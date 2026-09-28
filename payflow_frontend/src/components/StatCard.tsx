import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 min-h-[100px] flex flex-col justify-between shadow-sm border border-outline-variant/30">
      <span className="font-label-default text-label-default text-outline font-medium">
        {label}
      </span>
      <span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight tabular-nums">
        {value}
      </span>
    </div>
  );
};
