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
    <section className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-on-surface">Activité récente</h2>
          {transactions.length > 0 && (
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(84,39,230,0.08)', color: '#5427e6' }}
            >
              {transactions.length}
            </span>
          )}
        </div>
        <Link
          href="/transactions"
          className="inline-flex items-center gap-1 text-[12.5px] font-medium text-primary hover:text-primary-container transition-colors group"
        >
          <span>Voir tout</span>
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-0.5" style={{ fontSize: '15px' }}>
            arrow_forward
          </span>
        </Link>
      </div>

      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow: '0 1px 3px rgba(20,27,43,0.06), 0 1px 2px rgba(20,27,43,0.04)',
          border: '1px solid rgba(201,196,217,0.3)',
        }}
      >
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-14 text-center">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(233,237,255,0.8)' }}
            >
              <span className="material-symbols-outlined text-on-surface-variant/50" style={{ fontSize: '22px' }}>inbox</span>
            </div>
            <p className="text-[14px] font-semibold text-on-surface mb-1">Aucune activité récente</p>
            <p className="text-[12.5px] text-on-surface-variant">Vos dernières transactions apparaîtront ici.</p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="md:hidden divide-y" style={{ borderColor: 'rgba(233,237,255,0.8)' }}>
              {transactions.map((tx, i) => (
                <Link
                  key={tx.reference}
                  href={tx.id ? `/transactions/${tx.id}` : "/transactions"}
                  className="flex items-center justify-between px-4 py-3.5 hover:bg-surface transition-colors"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-[12.5px] font-mono font-semibold text-on-surface truncate">
                      {tx.reference}
                    </span>
                    <span className="text-[11.5px] text-on-surface-variant truncate">{tx.customer} · {tx.date}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-3">
                    <span className="text-[13px] font-bold text-on-surface tabular-nums">
                      {formatAmount(tx.amount, tx.currency)}
                    </span>
                    <StatusBadge status={tx.status} />
                  </div>
                </Link>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ background: 'rgba(244,245,251,0.8)', borderBottom: '1px solid rgba(201,196,217,0.25)' }}>
                    <th className="px-5 py-3 text-[10.5px] font-semibold uppercase tracking-widest text-on-surface-variant/60" scope="col">Référence</th>
                    <th className="px-5 py-3 text-[10.5px] font-semibold uppercase tracking-widest text-on-surface-variant/60" scope="col">Client</th>
                    <th className="px-5 py-3 text-[10.5px] font-semibold uppercase tracking-widest text-on-surface-variant/60 text-right" scope="col">Montant</th>
                    <th className="px-5 py-3 text-[10.5px] font-semibold uppercase tracking-widest text-on-surface-variant/60" scope="col">Statut</th>
                    <th className="px-5 py-3 text-[10.5px] font-semibold uppercase tracking-widest text-on-surface-variant/60 text-right" scope="col">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr
                      key={tx.reference}
                      className="group hover:bg-surface transition-colors cursor-pointer"
                      style={{ borderBottom: '1px solid rgba(233,237,255,0.8)' }}
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={tx.id ? `/transactions/${tx.id}` : "/transactions"}
                          className="text-[12.5px] font-mono font-semibold text-on-surface hover:text-primary transition-colors"
                        >
                          {tx.reference}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <Link href={tx.id ? `/transactions/${tx.id}` : "/transactions"} className="block">
                          <span className="text-[13px] text-on-surface">{tx.customer}</span>
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-[13.5px] font-bold text-on-surface tabular-nums">
                          {formatAmount(tx.amount, tx.currency)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-[12px] text-on-surface-variant">{tx.date}</span>
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
