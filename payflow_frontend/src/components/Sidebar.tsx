"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard', icon: 'grid_view' },
    { href: '/transactions', label: 'Transactions', icon: 'receipt_long' },
    { href: '/payments/new', label: 'Nouvelle commande', icon: 'add_circle' },
    { href: '/webhooks', label: 'Journal Webhooks', icon: 'webhook' },
  ];

  const content = (
    <div className="h-full flex flex-col justify-between">
      <div className="flex flex-col">
        {/* Brand logo */}
        <div className="h-16 flex items-center px-space-lg border-b border-outline-variant/30 justify-between">
          <Link href="/" className="font-headline-md text-headline-md tracking-tight select-none">
            <span className="text-on-surface font-semibold">PAY</span>
            <span className="text-primary font-bold">FLOW</span>
          </Link>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 text-on-surface-variant hover:text-on-surface"
              aria-label="Fermer le menu"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-space-xs p-space-sm">
          {links.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg font-body-medium text-body-medium transition-colors ${
                  isActive
                    ? 'bg-surface-container-high text-primary font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Version info */}
      <div className="p-space-md border-t border-outline-variant/30">
        <div className="flex items-center gap-space-sm px-space-sm">
          <span className="h-2 w-2 rounded-full bg-secondary"></span>
          <span className="font-caption text-caption text-on-surface-variant font-mono">v2.4.0-prod</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-[240px] bg-surface-container-lowest border-r border-outline-variant/30 z-50 flex-col">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop & Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        >
          <div
            className="w-[280px] h-full bg-surface-container-lowest shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
};
