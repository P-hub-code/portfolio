export type TransactionStatus = "success" | "pending" | "failed";
export type PaymentMethod = "carte" | "mobile_money" | "bank_transfer";

export interface Transaction {
  id: string;
  reference: string;
  orderName: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: TransactionStatus;
  date: string;
  // Technical information
  paymentReference: string;
  channel: string;
  isoCurrency: string;
}

export const transactions: Transaction[] = [
  {
    id: "tx_1",
    reference: "PF-20260923-001",
    orderName: "Commande #001",
    amount: 5000,
    currency: "FCFA",
    method: "carte",
    status: "success",
    date: "23 sept. 2026",
    paymentReference: "PSK-TEST-001",
    channel: "Card",
    isoCurrency: "XOF",
  },
  {
    id: "tx_2",
    reference: "PF-20260923-002",
    orderName: "Commande #002",
    amount: 10000,
    currency: "FCFA",
    method: "carte",
    status: "pending",
    date: "23 sept. 2026",
    paymentReference: "PSK-TEST-002",
    channel: "Card",
    isoCurrency: "XOF",
  },
  {
    id: "tx_3",
    reference: "PF-20260922-003",
    orderName: "Commande #003",
    amount: 2500,
    currency: "FCFA",
    method: "carte",
    status: "failed",
    date: "22 sept. 2026",
    paymentReference: "PSK-TEST-003",
    channel: "Card",
    isoCurrency: "XOF",
  },
  {
    id: "tx_4",
    reference: "PF-20260922-004",
    orderName: "Commande #004",
    amount: 15000,
    currency: "FCFA",
    method: "carte",
    status: "success",
    date: "22 sept. 2026",
    paymentReference: "PSK-TEST-004",
    channel: "Card",
    isoCurrency: "XOF",
  },
];
