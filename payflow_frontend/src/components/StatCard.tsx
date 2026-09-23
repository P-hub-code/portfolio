import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  return (
    <div className="bg-white rounded-xl p-5 h-[100px] flex flex-col justify-between shadow-sm">
      <span className="text-[12px] font-medium text-[#797588] leading-[16px] tracking-[0.01em]">
        {label}
      </span>
      <span className="text-[24px] font-semibold text-[#141b2b] tracking-[-0.02em] leading-[32px]">
        {value}
      </span>
    </div>
  );
};
