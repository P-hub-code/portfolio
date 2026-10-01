import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  accent?: 'default' | 'success' | 'warning' | 'error';
  trend?: { value: string; positive: boolean };
}

const accentConfig = {
  default: {
    iconBg: 'linear-gradient(135deg, #5427e6 0%, #6d4aff 100%)',
    iconColor: '#ffffff',
    dot: '#5427e6',
  },
  success: {
    iconBg: 'linear-gradient(135deg, #006e2f 0%, #00a346 100%)',
    iconColor: '#ffffff',
    dot: '#006e2f',
  },
  warning: {
    iconBg: 'linear-gradient(135deg, #794b00 0%, #b36e00 100%)',
    iconColor: '#ffffff',
    dot: '#794b00',
  },
  error: {
    iconBg: 'linear-gradient(135deg, #ba1a1a 0%, #dc2626 100%)',
    iconColor: '#ffffff',
    dot: '#ba1a1a',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon = 'analytics',
  accent = 'default',
  trend,
}) => {
  const cfg = accentConfig[accent];

  return (
    <div
      className="relative bg-white rounded-2xl p-5 flex flex-col gap-4 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 animate-fade-in-up"
      style={{
        boxShadow: '0 1px 3px rgba(20,27,43,0.06), 0 1px 2px rgba(20,27,43,0.04)',
        border: '1px solid rgba(201,196,217,0.3)',
      }}
    >
      {/* Subtle top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
        style={{ background: cfg.iconBg }}
      />

      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: cfg.iconBg }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '18px', color: cfg.iconColor, fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
              trend.positive
                ? 'bg-secondary-fixed/40 text-secondary'
                : 'bg-error-container text-on-error-container'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
              {trend.positive ? 'trending_up' : 'trending_down'}
            </span>
            {trend.value}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-[11.5px] font-medium uppercase tracking-wider text-on-surface-variant/70">
          {label}
        </span>
        <span className="text-[22px] font-bold text-on-surface tabular-nums tracking-tight leading-tight">
          {value}
        </span>
      </div>
    </div>
  );
};
