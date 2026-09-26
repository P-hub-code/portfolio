import React from 'react';
import { StatusBadge } from './StatusBadge';

export interface Transaction {
  reference: string;
  customer: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
}

interface RecentActivityProps {
  transactions: Transaction[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ transactions }) => {
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + currency;
  };

  return (
    <section className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold leading-[24px] tracking-[-0.01em] text-[#141b2b]">
          Activité récente
        </h2>
        <a
          href="/transactions"
          className="text-[13px] leading-[18px] text-[#797588] hover:text-[#141b2b] transition-colors"
        >
          Voir tout <span aria-hidden="true" className="md:hidden">→</span><span className="hidden md:inline">→</span>
        </a>
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-[#797588]">
            <span className="material-symbols-outlined text-[32px] opacity-50 mb-2">inbox</span>
            <p className="text-[14px] font-medium text-[#141b2b]">Aucune activité récente</p>
            <p className="text-[12px] mt-1">Vos dernières transactions apparaîtront ici.</p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="divide-y divide-[#E5E7EB] md:hidden">
          {transactions.map((tx) => (
            <article key={tx.reference} className="p-3.5 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#111827] tracking-tight">
                  {tx.reference}
                </span>
                <StatusBadge status={tx.status} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#6B7280]">
                  <span>{tx.customer}</span>
                  <span>•</span>
                  <span>{tx.date}</span>
                </div>
                <div className="font-semibold text-[#111827] text-[13px]">
                  {formatAmount(tx.amount, tx.currency)}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Desktop View */}
        <table className="hidden md:table w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f1f3ff] h-9">
              <th className="px-5 text-[11px] leading-[14px] font-medium text-[#797588] uppercase tracking-wider">RÉFÉRENCE</th>
              <th className="px-5 text-[11px] leading-[14px] font-medium text-[#797588] uppercase tracking-wider">CLIENT</th>
              <th className="px-5 text-[11px] leading-[14px] font-medium text-[#797588] uppercase tracking-wider">MONTANT</th>
              <th className="px-5 text-[11px] leading-[14px] font-medium text-[#797588] uppercase tracking-wider">STATUT</th>
              <th className="px-5 text-[11px] leading-[14px] font-medium text-[#797588] uppercase tracking-wider text-right">DATE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e9edff]">
            {transactions.map((tx) => (
              <tr key={tx.reference} className="h-14 hover:bg-[#f1f3ff] transition-colors">
                <td className="px-5 text-[12px] leading-[16px] text-[#141b2b] font-medium">{tx.reference}</td>
                <td className="px-5 text-[14px] leading-[20px] text-[#141b2b]">{tx.customer}</td>
                <td className="px-5 text-[14px] leading-[20px] text-[#141b2b] font-medium">{formatAmount(tx.amount, tx.currency)}</td>
                <td className="px-5"><StatusBadge status={tx.status} /></td>
                <td className="px-5 text-[13px] leading-[18px] text-[#797588] text-right">{tx.date}</td>
              </tr>
            ))}
            </tbody>
          </table>
          </>
        )}
      </div>
    </section>
  );
};
