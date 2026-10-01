"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/transactions': 'Transactions',
  '/payments/new': 'Nouvelle commande',
  '/webhooks': 'Journal Webhooks',
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith('/transactions/')) return 'Détail de la transaction';
  if (pathname.startsWith('/payments/status/')) return 'Statut du paiement';
  return 'Payflow';
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <>
      {/* Desktop Header */}
      <header
        className="hidden md:flex fixed top-0 left-[232px] right-0 h-[64px] z-40 items-center justify-between px-6"
        style={{
          background: 'rgba(244,245,251,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(201,196,217,0.3)',
        }}
      >
        {/* Page title */}
        <div className="flex items-center gap-3">
          <span className="text-[15px] font-semibold text-on-surface">{title}</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Test mode badge */}
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold font-mono border"
            style={{
              background: 'rgba(255,221,184,0.5)',
              borderColor: 'rgba(121,75,0,0.2)',
              color: '#653e00',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse" />
            MODE TEST
          </span>

          {/* Separator */}
          <div className="w-px h-5 bg-outline-variant/40" />

          {/* User info */}
          <div className="flex items-center gap-2.5">
            <div className="text-right">
              <div className="text-[12.5px] font-semibold text-on-surface leading-tight">Admin User</div>
              <div className="text-[11px] text-on-surface-variant leading-tight">admin@payflow.io</div>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #5427e6 0%, #6d4aff 100%)' }}
            >
              <span className="text-[11px] font-bold text-white">AD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header
        className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-[56px]"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(201,196,217,0.3)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            aria-label="Menu"
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container text-on-surface-variant transition-colors -ml-1"
            type="button"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>menu</span>
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5427e6 0%, #6d4aff 100%)' }}>
              <span className="material-symbols-outlined text-white" style={{ fontSize: '12px', fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <span className="text-[15px] font-bold tracking-tight text-on-surface">
              Pay<span className="text-primary">flow</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold font-mono border"
            style={{
              background: 'rgba(255,221,184,0.5)',
              borderColor: 'rgba(121,75,0,0.2)',
              color: '#653e00',
            }}
          >
            TEST
          </span>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #5427e6 0%, #6d4aff 100%)' }}
          >
            <span className="text-[10px] font-bold text-white">AD</span>
          </div>
        </div>
      </header>
    </>
  );
};
