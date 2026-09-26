import React from 'react';

export type TransactionStatus = 'Confirmé' | 'En attente' | 'Échec' | string;

interface StatusBadgeProps {
  status: TransactionStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgClass = '';
  let textClass = '';

  switch (status) {
    case 'Confirmé':
      bgClass = 'bg-[#DCFCE7]'; // Status success bg from design
      textClass = 'text-[#15803D]'; // Status success text from design
      break;
    case 'En attente':
      bgClass = 'bg-[#FEF3C7]';
      textClass = 'text-[#B45309]';
      break;
    case 'Échec':
      bgClass = 'bg-[#FEE2E2]';
      textClass = 'text-[#B91C1C]';
      break;
    default:
      bgClass = 'bg-[#F3F4F6]';
      textClass = 'text-[#374151]';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${bgClass} ${textClass}`}
    >
      {status}
    </span>
  );
};
