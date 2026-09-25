import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaystackService } from '../paystack/paystack.service';
import { PrismaService } from '../prisma/prisma.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paystackService: PaystackService,
    private readonly prisma: PrismaService,
  ) {}

  async initializePayment(dto: InitializePaymentDto) {
    const paystackAmount = dto.amount * 100;
    const reference = `PAYFLOW-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

    // Create Order in DB
    const order = await this.prisma.order.create({
      data: {
        reference,
        amount: dto.amount,
        customerName: dto.customerName,
        customerEmail: dto.email,
        customerPhone: dto.customerPhone,
        description: dto.description,
        paymentMethod: dto.paymentMethod,
      },
    });

    // Create Transaction in DB
    await this.prisma.transaction.create({
      data: {
        internalRef: reference,
        orderId: order.id,
        amount: dto.amount,
        channel: dto.paymentMethod,
        status: 'PENDING',
      },
    });

    try {
      const response = await this.paystackService.initializeTransaction(
        dto.email,
        paystackAmount,
        reference,
      );

      return {
        status: response.status,
        authorization_url: response.data?.authorization_url,
        reference: response.data?.reference || reference,
      };
    } catch (error: any) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while communicating with Paystack',
      );
    }
  }
}
