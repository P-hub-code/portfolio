"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const links = [
  {
    href: '/',
    label: 'Dashboard',
    icon: 'grid_view',
    exactMatch: true,
  },
  {
    href: '/transactions',
    label: 'Transactions',
    icon: 'receipt_long',
    exactMatch: false,
  },
  {
    href: '/payments/new',
    label: 'Nouvelle commande',
    icon: 'add_circle',
    exactMatch: false,
  },
  {
    href: '/webhooks',
    label: 'Journal Webhooks',
    icon: 'webhook',
    exactMatch: false,
  },
];

const SidebarContent: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col">
      {/* Brand */}
      <div className="h-[64px] flex items-center px-5 justify-between flex-shrink-0" style={{ borderBottom: '1px solid rgba(201,196,217,0.25)' }}>
        <Link href="/" className="flex items-center gap-2 select-none group" onClick={onCloseMobile}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5427e6 0%, #6d4aff 100%)' }}>
            <span className="material-symbols-outlined text-white" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>bolt</span>
          </div>
          <span className="text-[17px] font-bold tracking-tight text-on-surface">
            Pay<span className="text-primary">flow</span>
          </span>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
            aria-label="Fermer le menu"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/50 px-3 pt-2 pb-1.5">Navigation</p>
        {links.map((link) => {
          const isActive = link.exactMatch
            ? pathname === link.href
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onCloseMobile}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              style={isActive ? {
                background: 'linear-gradient(135deg, rgba(84,39,230,0.1) 0%, rgba(109,74,255,0.06) 100%)',
              } : undefined}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-transparent text-on-surface-variant group-hover:bg-surface-container-high/70 group-hover:text-on-surface'
              }`}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '18px',
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {link.icon}
                </span>
              </div>
              <span className="text-[13.5px] leading-none">{link.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(201,196,217,0.25)' }}>
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-white" style={{ fontSize: '15px', fontVariationSettings: "'FILL' 1" }}>person</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-semibold text-on-surface truncate">Admin User</span>
            <span className="text-[11px] text-on-surface-variant truncate">admin@payflow.io</span>
          </div>
          <div className="ml-auto flex-shrink-0 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span className="text-[10px] font-mono text-on-surface-variant">live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex fixed left-0 top-0 h-full w-[232px] flex-col z-50"
        style={{
          background: '#ffffff',
          borderRight: '1px solid rgba(201,196,217,0.3)',
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          style={{ background: 'rgba(20,27,43,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={onCloseMobile}
        >
          <div
            className="w-[260px] h-full bg-white flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent onCloseMobile={onCloseMobile} />
          </div>
        </div>
      )}
    </>
  );
};
