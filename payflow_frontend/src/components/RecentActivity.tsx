import React from 'react';
import Link from 'next/link';
import { StatusBadge } from './StatusBadge';

export interface RecentTransaction {
  id?: string;
  reference: string;
  customer: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
}

interface RecentActivityProps {
  transactions: RecentTransaction[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ transactions }) => {
  const formatAmount = (amount: number, currency: string) => {
    return `${Number(amount).toLocaleString('fr-FR')} ${currency}`;
  };

  return (
    <section className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
          Activité récente
        </h2>
        <Link
          href="/transactions"
          className="font-body-secondary text-body-secondary text-outline hover:text-on-surface transition-colors inline-flex items-center gap-1 group"
        >
          <span>Voir tout</span>
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>

      <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/30">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-outline">
            <span className="material-symbols-outlined text-[36px] opacity-40 mb-2">inbox</span>
            <p className="font-body-medium text-body-medium text-on-surface font-medium">Aucune activité récente</p>
            <p className="font-caption text-caption text-on-surface-variant mt-1">Vos dernières transactions apparaîtront ici.</p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="divide-y divide-surface-container-high/60 md:hidden">
              {transactions.map((tx) => (
                <Link
                  key={tx.reference}
                  href={tx.id ? `/transactions/${tx.id}` : "/transactions"}
                  className="block p-4 hover:bg-surface-container-low transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-label-code text-label-code font-mono text-on-surface font-semibold">
                      {tx.reference}
                    </span>
                    <StatusBadge status={tx.status} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-on-surface-variant font-body-secondary text-body-secondary">
                      <span className="truncate max-w-[140px]">{tx.customer}</span>
                      <span>•</span>
                      <span>{tx.date}</span>
                    </div>
                    <div className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                      {formatAmount(tx.amount, tx.currency)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low h-9 border-b border-surface-container-high/40">
                    <th className="px-5 font-caption text-caption text-outline uppercase tracking-wider font-medium" scope="col">RÉFÉRENCE</th>
                    <th className="px-5 font-caption text-caption text-outline uppercase tracking-wider font-medium" scope="col">CLIENT</th>
                    <th className="px-5 font-caption text-caption text-outline uppercase tracking-wider font-medium" scope="col">MONTANT</th>
                    <th className="px-5 font-caption text-caption text-outline uppercase tracking-wider font-medium" scope="col">STATUT</th>
                    <th className="px-5 font-caption text-caption text-outline uppercase tracking-wider font-medium text-right" scope="col">DATE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high/40 font-body-default">
                  {transactions.map((tx) => (
                    <tr
                      key={tx.reference}
                      className="h-14 hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <td className="px-5 font-label-code text-label-code text-on-surface font-mono font-medium whitespace-nowrap">
                        <Link href={tx.id ? `/transactions/${tx.id}` : "/transactions"} className="hover:text-primary transition-colors">
                          {tx.reference}
                        </Link>
                      </td>
                      <td className="px-5 font-body-default text-body-default text-on-surface whitespace-nowrap">
                        <Link href={tx.id ? `/transactions/${tx.id}` : "/transactions"} className="block">
                          {tx.customer}
                        </Link>
                      </td>
                      <td className="px-5 font-body-medium text-body-medium text-on-surface font-semibold tabular-nums whitespace-nowrap">
                        {formatAmount(tx.amount, tx.currency)}
                      </td>
                      <td className="px-5 whitespace-nowrap">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="px-5 font-body-secondary text-body-secondary text-outline text-right whitespace-nowrap">
                        {tx.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
