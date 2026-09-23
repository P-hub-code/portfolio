import React from 'react';
import Link from 'next/link';
import { dashboardStats, recentTransactions } from '@/data/dashboard';
import { StatCard } from '@/components/StatCard';
import { RecentActivity } from '@/components/RecentActivity';

export default function Dashboard() {
  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1200px] mx-auto md:px-8 md:py-7 flex flex-col gap-5 md:gap-8">
        
        {/* Dashboard Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4 md:gap-0">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 w-full md:w-auto">
            <div className="flex flex-col">
              <h1 className="text-[22px] md:text-[24px] font-semibold text-[#141b2b] leading-tight md:tracking-[-0.02em] md:leading-[32px]">
                Dashboard
              </h1>
              <p className="text-[13px] md:text-[14px] text-[#6B7280] md:text-[#797588] mt-1 md:mt-0.5 leading-normal md:leading-[20px]">
                Vue d'ensemble de votre activité de paiement.
              </p>
            </div>
            {/* Desktop Button */}
            <Link 
              href="/payments/new"
              className="hidden md:inline-flex h-10 px-4 bg-[#6d4aff] hover:opacity-95 active:opacity-90 text-white font-medium text-[14px] leading-[20px] rounded-lg items-center justify-center transition-opacity shadow-sm"
            >
              + Nouvelle commande
            </Link>
            {/* Mobile Button */}
            <Link 
              href="/payments/new"
              className="md:hidden w-full mt-1 h-10 bg-[#6D4AFF] hover:bg-[#5B3CE0] active:scale-[0.99] transition-all text-white font-medium text-sm rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span className="text-base font-semibold leading-none">+</span>
              <span>Nouvelle commande</span>
            </Link>
          </div>
          
          {/* Desktop Right Header Content (Mode Test, Admin) */}
          <div className="hidden md:flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#ffddb8] text-[#794b00]">
              Mode Test
            </span>
            <span className="text-[14px] font-medium text-[#141b2b] ml-1">Admin</span>
            <div className="w-8 h-8 rounded-full bg-[#e9edff] flex items-center justify-center text-[#484556] text-[11px] font-medium">
              AD
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
          {dashboardStats.map((stat, index) => (
            <StatCard key={index} label={stat.label} value={stat.value} />
          ))}
        </section>

        {/* Recent Activity */}
        <RecentActivity transactions={recentTransactions} />
        
      </div>
    </div>
  );
}
