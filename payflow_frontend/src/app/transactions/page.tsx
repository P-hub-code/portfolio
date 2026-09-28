"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";

interface Transaction {
  id: string;
  reference: string;
  orderName: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  date: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { apiFetch } = await import('@/lib/api');
        const data = await apiFetch('/transactions');
        if (Array.isArray(data)) {
          setTransactions(
            data.map((tx: any) => ({
              id: tx.id,
              reference: tx.internalRef,
              orderName: tx.customerName || (tx.order && tx.order.customerName) || "N/A",
              amount: Number(tx.amount || 0),
              currency: tx.currency || "XOF",
              method: (tx.channel || "card").toLowerCase(),
              status: tx.status || "PENDING",
              date: new Date(tx.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })
            }))
          );
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    const searchString = `${tx.reference} ${tx.orderName} ${tx.amount} ${tx.status} ${tx.method}`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase().trim());
  });

  const formatAmount = (amount: number, currency: string) => {
    return `${amount.toLocaleString("fr-FR")} ${currency}`;
  };

  const getMethodDisplay = (method: string) => {
    if (method.includes("card") || method.includes("carte")) {
      return (
        <span className="inline-flex items-center gap-1.5 font-body-secondary text-body-secondary text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">credit_card</span>
          <span>Carte</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 font-body-secondary text-body-secondary text-on-surface-variant">
        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">smartphone</span>
        <span>Mobile</span>
      </span>
    );
  };

  return (
    <div className="flex flex-col w-full max-w-[1376px] mx-auto px-4 md:px-margin py-4 md:py-margin flex flex-col gap-space-lg">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-semibold">Transactions</h1>
          <p className="font-body-default text-body-default text-on-surface-variant">Historique des paiements enregistrés.</p>
        </div>
        <div className="relative w-full sm:w-[260px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">search</span>
          </div>
          <input
            className="w-full h-[38px] pl-9 pr-3.5 bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-default text-body-secondary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/30 transition-all"
            id="transaction-search"
            placeholder="Rechercher une transaction..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-12 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 text-on-surface-variant">
          <span className="material-symbols-outlined text-[32px] animate-spin text-primary mb-2">progress_activity</span>
          <p className="font-body-medium text-body-medium">Chargement des transactions...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-8 text-center text-error bg-error-container/40 rounded-xl border border-error/20">
          <span className="material-symbols-outlined text-[28px] mb-2">error</span>
          <p className="font-body-medium">Erreur lors du chargement des transactions.</p>
        </div>
      )}

      {/* Data display */}
      {!loading && !error && (
        <>
          {/* Mobile View: Cards Feed */}
          <div className="flex flex-col gap-space-sm w-full md:hidden">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => router.push(`/transactions/${tx.id}`)}
                className="flex flex-col p-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 transition-all active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-code text-label-code font-mono text-on-surface font-semibold select-all">
                    {tx.reference}
                  </span>
                  <StatusBadge status={tx.status} />
                </div>
                <div className="flex items-center justify-between text-on-surface-variant mb-3">
                  <span className="font-body-default text-body-default text-on-surface truncate max-w-[160px]">{tx.orderName}</span>
                  {getMethodDisplay(tx.method)}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-surface-container-high/40">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold tabular-nums">
                    {formatAmount(tx.amount, tx.currency)}
                  </span>
                  <span className="font-body-secondary text-body-secondary text-on-surface-variant">{tx.date}</span>
                </div>
              </div>
            ))}

            {filteredTransactions.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 my-2">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-2">
                  <span className="material-symbols-outlined text-[20px]">search_off</span>
                </div>
                <p className="font-body-medium text-body-medium text-on-surface font-medium">Aucune transaction trouvée</p>
                <p className="font-caption text-caption text-on-surface-variant mt-0.5">Vérifiez la référence ou le nom du client.</p>
              </div>
            )}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block w-full bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" id="transactions-table">
                <thead>
                  <tr className="h-9 bg-surface-container-low text-on-surface-variant font-label-default text-caption uppercase tracking-wider border-b border-surface-container-high/40">
                    <th className="py-2.5 px-6 font-medium" scope="col">Référence</th>
                    <th className="py-2.5 px-6 font-medium" scope="col">Client</th>
                    <th className="py-2.5 px-6 font-medium text-right" scope="col">Montant</th>
                    <th className="py-2.5 px-6 font-medium" scope="col">Moyen</th>
                    <th className="py-2.5 px-6 font-medium" scope="col">Statut</th>
                    <th className="py-2.5 px-6 font-medium text-right" scope="col">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high/40 font-body-default text-body-default">
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => router.push(`/transactions/${tx.id}`)}
                      className="h-14 hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-6 font-body-medium text-body-medium text-on-surface whitespace-nowrap font-mono select-all">
                        {tx.reference}
                      </td>
                      <td className="py-3.5 px-6 font-body-secondary text-body-secondary text-on-surface-variant whitespace-nowrap">
                        {tx.orderName}
                      </td>
                      <td className="py-3.5 px-6 font-body-medium text-body-medium text-on-surface text-right tabular-nums whitespace-nowrap font-semibold">
                        {formatAmount(tx.amount, tx.currency)}
                      </td>
                      <td className="py-3.5 px-6 font-body-secondary text-body-secondary text-on-surface-variant whitespace-nowrap">
                        {getMethodDisplay(tx.method)}
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="py-3.5 px-6 font-body-secondary text-body-secondary text-on-surface-variant text-right whitespace-nowrap">
                        {tx.date}
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 px-6 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[32px] opacity-40 mb-1">search_off</span>
                        <p className="font-body-medium text-body-medium">Aucune transaction trouvée</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}