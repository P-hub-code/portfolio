import React from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
import { StatCard } from '@/components/StatCard';
import { RecentActivity } from '@/components/RecentActivity';
import { Transaction } from '@/types';
import { apiFetch } from '@/lib/api';

export default async function Dashboard() {
  let transactions: any[] = [];
  let dashboardStats = [
    { label: "Encaissé", value: "0 FCFA" },
    { label: "Transactions", value: 0 },
    { label: "Confirmées", value: 0 },
    { label: "Échouées", value: 0 }
  ];
  let errorState = null;

  try {
    const data: Transaction[] = await apiFetch('/transactions', { cache: 'no-store' });

    if (Array.isArray(data)) {
      const successData = data.filter((tx) => (tx.status || '').toLowerCase() === 'success');
      const totalAmount = successData.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
      const totalCount = data.length;
      const successCount = successData.length;
      const failedCount = data.filter((tx) => (tx.status || '').toLowerCase() === 'failed').length;

      dashboardStats = [
        { label: "Encaissé", value: `${totalAmount.toLocaleString('fr-FR')} FCFA` },
        { label: "Transactions", value: totalCount },
        { label: "Confirmées", value: successCount },
        { label: "Échouées", value: failedCount }
      ];

      transactions = data.slice(0, 5).map((tx: any) => {
        let mappedStatus = tx.status;
        const s = (tx.status || '').toLowerCase();
        if (s === 'success') mappedStatus = 'Confirmé';
        else if (s === 'pending') mappedStatus = 'En attente';
        else if (s === 'failed') mappedStatus = 'Échec';

        return {
          id: tx.id,
          reference: tx.internalRef,
          customer: tx.customerName || (tx.order && tx.order.customerName) || 'Client inconnu',
          amount: Number(tx.amount || 0),
          currency: tx.currency || 'XOF',
          status: mappedStatus,
          date: new Date(tx.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
        };
      });
    }
  } catch (error) {
    console.error('Failed to fetch transactions for dashboard', error);
    errorState = 'Erreur lors du chargement des données.';
  }

  return (
    <div className="flex flex-col w-full max-w-[1200px] mx-auto md:px-8 md:py-7 flex flex-col gap-6 md:gap-8">
      {/* 1. Header Principal */}
      <header className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4 md:gap-0">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 w-full md:w-auto">
          <div className="flex flex-col">
            <h1 className="font-headline-lg text-headline-lg text-on-surface leading-tight font-semibold">
              Dashboard
            </h1>
            <p className="font-body-default text-body-default text-outline mt-0.5">
              Vue d'ensemble de votre activité de paiement.
            </p>
          </div>
          {/* Desktop Button */}
          <Link
            href="/payments/new"
            className="hidden md:inline-flex h-10 px-4 bg-primary-container hover:opacity-95 active:opacity-90 text-on-primary font-body-medium text-body-medium rounded-lg items-center justify-center transition-opacity shadow-sm"
          >
            + Nouvelle commande
          </Link>
          {/* Mobile Button */}
          <Link
            href="/payments/new"
            className="md:hidden w-full h-10 bg-primary-container hover:opacity-95 text-on-primary font-body-medium text-body-medium rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span className="text-base font-semibold leading-none">+</span>
            <span>Nouvelle commande</span>
          </Link>
        </div>

        {/* Desktop Right Header Content (Mode Test, Admin) */}
        <div className="hidden md:flex items-center gap-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-caption bg-tertiary-fixed text-tertiary font-medium">
            Mode Test
          </span>
          <span className="font-body-medium text-body-medium text-on-surface ml-1 font-medium">Admin</span>
          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant text-caption font-caption font-semibold">
            AD
          </div>
        </div>
      </header>

      {/* 2. Section Statistiques (Exactement 4 cartes) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
        {dashboardStats.map((stat, index) => (
          <StatCard key={index} label={stat.label} value={stat.value} />
        ))}
      </section>

      {/* 3. Section Activité Récente */}
      {errorState ? (
        <div className="p-8 text-center text-error bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30">
          <span className="material-symbols-outlined text-[28px] mb-2">cloud_off</span>
          <p className="font-body-medium">{errorState}</p>
        </div>
      ) : (
        <RecentActivity transactions={transactions} />
      )}
    </div>
  );
}
