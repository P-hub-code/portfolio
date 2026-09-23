"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard', icon: 'grid_view' },
    { href: '/transactions', label: 'Transactions', icon: 'receipt_long' },
    { href: '/payments/new', label: 'Nouvelle commande', icon: 'add_circle' },
    { href: '/webhooks', label: 'Journal Webhooks', icon: 'webhook' },
  ];

  return (
    <aside className="hidden md:flex fixed top-0 left-0 h-full w-[240px] bg-white border-r border-[#E5E7EB] z-50 flex-col">
      <div className="h-16 px-6 flex items-center shrink-0">
        <span className="text-[20px] font-semibold tracking-tight">
          <span className="text-[#111827]">PAY</span>
          <span className="text-[#6D4AFF]">FLOW</span>
        </span>
      </div>
      <nav className="flex flex-col gap-1 px-3 py-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-[14px] font-medium ${
                isActive
                  ? 'bg-[#e9edff] text-[#6D4AFF]'
                  : 'text-[#484556] hover:bg-[#e1e8fd] hover:text-[#141b2b]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
