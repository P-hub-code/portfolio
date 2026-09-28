"use client";

import React from 'react';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-[240px] right-0 h-16 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/30 z-40 items-center justify-between px-space-lg">
        <div className="flex items-center gap-space-sm">
          <span className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded font-label-default text-label-default bg-surface-container text-on-surface-variant border border-outline-variant/30">
            <span className="h-1.5 w-1.5 rounded-full bg-tertiary-container animate-pulse"></span>
            Mode Test
          </span>
        </div>
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-sm">
            <div className="text-right">
              <div className="font-body-medium text-body-medium text-on-surface leading-tight font-medium">Admin User</div>
              <div className="font-caption text-caption text-on-surface-variant">admin@payflow.internal</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden w-full bg-surface-container-lowest border-b border-outline-variant/30 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            aria-label="Menu"
            className="p-1 -ml-1 text-on-surface-variant hover:text-on-surface focus:outline-none"
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <div className="flex items-center tracking-tight text-lg font-bold select-none">
            <span className="text-on-surface">PAY</span>
            <span className="text-primary">FLOW</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-tertiary-fixed text-on-tertiary-fixed-variant">
            Mode Test
          </span>
          <div className="w-7 h-7 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-semibold text-[11px] ring-1 ring-primary/20" title="Admin">
            AD
          </div>
        </div>
      </header>
    </>
  );
};
