import { Injectable, InternalServerErrorException } from '@nestjs/common';

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

@Injectable()
export class PaystackService {
  private readonly baseUrl: string;
  private readonly secretKey: string;

  constructor() {
    this.baseUrl = process.env.PAYSTACK_BASE_URL || 'https://api.paystack.co';

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      throw new InternalServerErrorException(
        'Paystack secret key is not configured.',
      );
    }
    this.secretKey = secret;
  }

  async initializeTransaction(
    email: string,
    amount: number,
    reference?: string,
  ): Promise<PaystackInitResponse> {
    const payload: Record<string, unknown> = {
      email,
      amount,
      currency: 'XOF',
    };
    if (reference) {
      payload.reference = reference;
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      payload.callback_url = `${frontendUrl}/payments/status/${reference}`;
    }
    // Ne plus envoyer le champ channels pour l'instant

    const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Paystack error:', response.status, errText);
      throw new InternalServerErrorException(
        'Failed to initialize transaction with Paystack',
      );
    }

    return (await response.json()) as PaystackInitResponse;
  }
}
