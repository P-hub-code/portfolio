import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const transactions = await this.prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        order: true,
      },
    });

    return transactions.map((tx) => ({
      id: tx.id,
      internalRef: tx.internalRef,
      paystackRef: tx.paystackRef,
      amount: tx.amount,
      currency: tx.currency,
      channel: tx.channel,
      status: tx.status,
      createdAt: tx.createdAt,
      customerName: tx.order.customerName,
      customerEmail: tx.order.customerEmail,
      orderReference: tx.order.reference,
    }));
  }

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        order: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    return {
      id: transaction.id,
      internalRef: transaction.internalRef,
      paystackRef: transaction.paystackRef,
      amount: transaction.amount,
      currency: transaction.currency,
      channel: transaction.channel,
      status: transaction.status,
      createdAt: transaction.createdAt,
      order: {
        id: transaction.order.id,
        reference: transaction.order.reference,
        customerName: transaction.order.customerName,
        customerEmail: transaction.order.customerEmail,
        customerPhone: transaction.order.customerPhone,
        description: transaction.order.description,
        createdAt: transaction.order.createdAt,
      },
    };
  }
}
