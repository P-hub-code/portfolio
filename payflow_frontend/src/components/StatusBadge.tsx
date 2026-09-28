import React from 'react';

export type TransactionStatus = 'Confirmé' | 'En attente' | 'Échec' | 'SUCCESS' | 'PENDING' | 'FAILED' | string;

interface StatusBadgeProps {
  status: TransactionStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalized = (status || "").toLowerCase();

  if (normalized === 'confirmé' || normalized === 'success') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-caption font-caption bg-secondary-fixed text-on-secondary-fixed-variant font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
        <span>Confirmé</span>
      </span>
    );
  }

  if (normalized === 'en attente' || normalized === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-caption font-caption bg-tertiary-fixed text-tertiary font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
        <span>En attente</span>
      </span>
    );
  }

  if (normalized === 'échec' || normalized === 'echec' || normalized === 'failed') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-caption font-caption bg-error-container text-on-error-container font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
        <span>Échec</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-caption bg-surface-container text-on-surface-variant font-medium">
      {status}
    </span>
  );
};
