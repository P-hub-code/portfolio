import React from 'react';

export type TransactionStatus = 'Confirmé' | 'En attente' | 'Échec' | 'SUCCESS' | 'PENDING' | 'FAILED' | string;

interface StatusBadgeProps {
  status: TransactionStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalized = (status || "").toLowerCase();

  if (normalized === 'confirmé' || normalized === 'success') {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
        style={{ background: 'rgba(107,255,143,0.15)', color: '#005321', border: '1px solid rgba(0,110,47,0.15)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#006e2f' }} />
        Confirmé
      </span>
    );
  }

  if (normalized === 'en attente' || normalized === 'pending') {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
        style={{ background: 'rgba(255,221,184,0.4)', color: '#653e00', border: '1px solid rgba(121,75,0,0.15)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: '#794b00' }} />
        En attente
      </span>
    );
  }

  if (normalized === 'échec' || normalized === 'echec' || normalized === 'failed') {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
        style={{ background: 'rgba(255,218,214,0.5)', color: '#93000a', border: '1px solid rgba(186,26,26,0.15)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#ba1a1a' }} />
        Échec
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold"
      style={{ background: 'rgba(233,237,255,0.8)', color: '#484556', border: '1px solid rgba(201,196,217,0.3)' }}
    >
      {status}
    </span>
  );
};
