/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  private readonly secretKey = process.env.PAYSTACK_SECRET_KEY || '';

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const webhooks = await this.prisma.webhookEvent.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Exclude the raw payload if it contains sensitive data,
    // or just return the relevant info to avoid leaking secrets
    return webhooks.map((wh) => ({
      id: wh.id,
      event: wh.event,
      reference: wh.reference,
      processingStatus: wh.processingStatus,
      idempotencyKey: wh.idempotencyKey,
      createdAt: wh.createdAt,
    }));
  }

  async handlePaystackWebhook(signature: string, body: any) {
    const hash = crypto
      .createHmac('sha512', this.secretKey)
      .update(JSON.stringify(body))
      .digest('hex');

    if (hash !== signature) {
      this.logger.warn('Invalid Paystack signature');
      throw new UnauthorizedException('Invalid signature');
    }

    const event = body.event;
    const data = body.data;
    const reference = data?.reference; // PAYFLOW-...

    if (!reference) {
      this.logger.warn(`Ignored event ${event} with no reference`);
      return;
    }

    const eventId = data.id
      ? String(data.id)
      : crypto.randomBytes(16).toString('hex');
    const idempotencyKey = `${event}_${eventId}`;

    const existingEvent = await this.prisma.webhookEvent.findUnique({
      where: { idempotencyKey },
    });

    if (existingEvent && existingEvent.processingStatus === 'PROCESSED') {
      this.logger.log(`Event ${event} for ${reference} already processed.`);
      return;
    }

    this.logger.log(
      `Received Paystack event: ${event} for reference: ${reference}`,
    );

    if (!existingEvent) {
      await this.prisma.webhookEvent.create({
        data: {
          event: event,
          reference: reference,
          processingStatus: 'RECEIVED',
          idempotencyKey: idempotencyKey,
          payload: body,
        },
      });
    }

    try {
      if (event === 'charge.success' || event === 'charge.failed') {
        const transaction = await this.prisma.transaction.findUnique({
          where: { internalRef: reference },
        });

        if (!transaction) {
          this.logger.warn(`Transaction not found for reference: ${reference}`);
          await this.prisma.webhookEvent.update({
            where: { idempotencyKey },
            data: { processingStatus: 'FAILED' },
          });
          return;
        }

        const newStatus = event === 'charge.success' ? 'SUCCESS' : 'FAILED';
        const paystackRef = data.id ? String(data.id) : undefined;

        if (transaction.status === newStatus) {
          this.logger.log(
            `Transaction ${reference} is already ${newStatus}. Skipping update.`,
          );
        } else {
          await this.prisma.$transaction([
            this.prisma.transaction.update({
              where: { id: transaction.id },
              data: { status: newStatus, paystackRef },
            }),
            this.prisma.order.update({
              where: { id: transaction.orderId },
              data: { status: newStatus },
            }),
          ]);
          this.logger.log(`Updated transaction ${reference} to ${newStatus}`);
        }
      } else {
        this.logger.log(`Ignored unhandled event type: ${event}`);
      }

      await this.prisma.webhookEvent.update({
        where: { idempotencyKey },
        data: { processingStatus: 'PROCESSED' },
      });
    } catch (err) {
      this.logger.error(
        `Error processing webhook event ${event} for ${reference}`,
        err,
      );
      await this.prisma.webhookEvent.update({
        where: { idempotencyKey },
        data: { processingStatus: 'FAILED' },
      });
    }
  }
}
