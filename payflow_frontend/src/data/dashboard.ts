export interface StatItem {
  label: string;
  value: number;
}

export const dashboardStats: StatItem[] = [
  { label: 'Transactions', value: 128 },
  { label: 'Paiements réussis', value: 96 },
  { label: 'En attente', value: 12 },
  { label: 'Échecs', value: 20 },
];

export type TransactionStatus = 'Confirmé' | 'En attente' | 'Échec';

export interface Transaction {
  reference: string;
  customer: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  date: string;
}

export const recentTransactions: Transaction[] = [
  {
    reference: 'PF-20260923-001',
    customer: 'Client Demo',
    amount: 5000,
    currency: 'FCFA',
    status: 'Confirmé',
    date: '23 sept. 2026',
  },
  {
    reference: 'PF-20260923-002',
    customer: 'Client Demo',
    amount: 10000,
    currency: 'FCFA',
    status: 'En attente',
    date: '23 sept. 2026',
  },
  {
    reference: 'PF-20260922-003',
    customer: 'Client Demo',
    amount: 2500,
    currency: 'FCFA',
    status: 'Échec',
    date: '22 sept. 2026',
  },
  {
    reference: 'PF-20260922-004',
    customer: 'Client Demo',
    amount: 15000,
    currency: 'FCFA',
    status: 'Confirmé',
    date: '22 sept. 2026',
  },
];
