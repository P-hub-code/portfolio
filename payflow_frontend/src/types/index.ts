export interface Transaction {
  id: string;
  internalRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description: string;
  amount: number;
  currency: string;
  channel: string;
  status: string;
  paystackRef: string | null;
  authorizationUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEvent {
  id: string;
  event: string;
  data: any;
  createdAt: string;
}

export interface PaymentInitData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description: string;
  amount: number;
  paymentMethod: string;
}
