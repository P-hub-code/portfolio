export type WebhookStatus = "PROCESSED" | "RECEIVED";
export type WebhookEvent = "charge.success" | "charge.failed";

export interface WebhookPayload {
  event: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  gateway_response: string;
  paid_at: string;
  channel: string;
  ip_address: string;
}

export interface Webhook {
  id: string;
  event: WebhookEvent;
  reference: string;
  status: WebhookStatus;
  date: string;
  time: string;
  signature: string;
  payload: WebhookPayload;
}

export const webhooks: Webhook[] = [
  {
    id: "evt_payflow_98234a",
    event: "charge.success",
    reference: "PF-20260923-001",
    status: "PROCESSED",
    date: "23 sept. 2026",
    time: "14:32:00 UTC",
    signature: "sha512_••••••••••a8f2",
    payload: {
      event: "charge.success",
      reference: "PF-20260923-001",
      amount: 500000,
      currency: "XOF",
      status: "success",
      gateway_response: "Successful",
      paid_at: "2026-09-23T14:32:00.000Z",
      channel: "card",
      ip_address: "197.159.**.**"
    }
  },
  {
    id: "evt_payflow_98235b",
    event: "charge.success",
    reference: "PF-20260923-002",
    status: "RECEIVED",
    date: "23 sept. 2026",
    time: "15:04:12 UTC",
    signature: "sha512_••••••••••7c31",
    payload: {
      event: "charge.success",
      reference: "PF-20260923-002",
      amount: 125000,
      currency: "XOF",
      status: "pending",
      gateway_response: "Pending Verification",
      paid_at: "2026-09-23T15:04:12.000Z",
      channel: "mobile_money",
      ip_address: "197.159.**.**"
    }
  },
  {
    id: "evt_payflow_98218e",
    event: "charge.failed",
    reference: "PF-20260922-003",
    status: "PROCESSED",
    date: "22 sept. 2026",
    time: "09:12:45 UTC",
    signature: "sha512_••••••••••4e99",
    payload: {
      event: "charge.failed",
      reference: "PF-20260922-003",
      amount: 350000,
      currency: "XOF",
      status: "failed",
      gateway_response: "Insufficient Funds",
      paid_at: "2026-09-22T09:12:45.000Z",
      channel: "card",
      ip_address: "197.159.**.**"
    }
  }
];
