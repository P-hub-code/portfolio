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
    const isCard = method.includes("card") || method.includes("carte");
    return (
      <span className="inline-flex items-center gap-1.5 text-[12px] text-on-surface-variant">
        <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
          {isCard ? 'credit_card' : 'smartphone'}
        </span>
        <span>{isCard ? 'Carte' : 'Mobile'}</span>
      </span>
    );
  };

  return (
    <div className="flex flex-col w-full max-w-[1200px] mx-auto gap-6 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] md:text-[24px] font-bold text-on-surface tracking-tight">Transactions</h1>
          <p className="text-[13.5px] text-on-surface-variant">Historique complet de vos paiements.</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-[280px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-on-surface-variant/60" style={{ fontSize: '17px' }}>search</span>
          </div>
          <input
            className="w-full h-10 pl-9 pr-4 bg-white text-on-surface text-[13px] rounded-xl transition-all outline-none focus:ring-2 focus:ring-primary/20"
            style={{
              border: '1.5px solid rgba(201,196,217,0.5)',
              boxShadow: '0 1px 2px rgba(20,27,43,0.04)',
            }}
            id="transaction-search"
            placeholder="Rechercher..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface"
              onClick={() => setSearchQuery("")}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex flex-col gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-[60px] w-full" style={{ animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {error && !loading && (
        <div
          className="p-8 flex flex-col items-center gap-3 rounded-2xl text-center"
          style={{
            background: 'rgba(255,218,214,0.3)',
            border: '1px solid rgba(186,26,26,0.15)',
          }}
        >
          <div className="w-10 h-10 rounded-full bg-error-container/60 flex items-center justify-center">
            <span className="material-symbols-outlined text-error" style={{ fontSize: '20px' }}>error</span>
          </div>
          <p className="text-[13.5px] font-medium text-error">Erreur lors du chargement des transactions.</p>
        </div>
      )}

      {/* ── Data ── */}
      {!loading && !error && (
        <>
          {/* Summary bar */}
          {filteredTransactions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-on-surface-variant">
                {filteredTransactions.length} transaction{filteredTransactions.length > 1 ? 's' : ''}
                {searchQuery && ` · filtrées par "${searchQuery}"`}
              </span>
            </div>
          )}

          {/* Mobile View */}
          <div className="flex flex-col gap-2 md:hidden">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => router.push(`/transactions/${tx.id}`)}
                className="flex items-center justify-between p-4 bg-white rounded-2xl cursor-pointer transition-all active:scale-[0.99] hover:shadow-sm"
                style={{
                  boxShadow: '0 1px 3px rgba(20,27,43,0.05)',
                  border: '1px solid rgba(201,196,217,0.3)',
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(233,237,255,0.8)' }}
                  >
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '17px', fontVariationSettings: "'FILL' 0" }}>receipt</span>
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[12.5px] font-mono font-semibold text-on-surface truncate">{tx.reference}</span>
                    <span className="text-[11.5px] text-on-surface-variant truncate">{tx.orderName} · {tx.date}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-3">
                  <span className="text-[13px] font-bold text-on-surface tabular-nums">{formatAmount(tx.amount, tx.currency)}</span>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            ))}

            {filteredTransactions.length === 0 && (
              <div
                className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl"
                style={{ border: '1px solid rgba(201,196,217,0.3)' }}
              >
                <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-on-surface-variant/50" style={{ fontSize: '20px' }}>search_off</span>
                </div>
                <p className="text-[14px] font-semibold text-on-surface">Aucune transaction trouvée</p>
                <p className="text-[12.5px] text-on-surface-variant mt-1">Vérifiez la référence ou le nom.</p>
              </div>
            )}
          </div>

          {/* Desktop View */}
          <div
            className="hidden md:block w-full bg-white rounded-2xl overflow-hidden"
            style={{
              boxShadow: '0 1px 3px rgba(20,27,43,0.06), 0 1px 2px rgba(20,27,43,0.04)',
              border: '1px solid rgba(201,196,217,0.3)',
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left" id="transactions-table">
                <thead>
                  <tr style={{ background: 'rgba(244,245,251,0.8)', borderBottom: '1px solid rgba(201,196,217,0.25)' }}>
                    <th className="py-3.5 px-5 text-[10.5px] font-semibold uppercase tracking-widest text-on-surface-variant/60" scope="col">Référence</th>
                    <th className="py-3.5 px-5 text-[10.5px] font-semibold uppercase tracking-widest text-on-surface-variant/60" scope="col">Client</th>
                    <th className="py-3.5 px-5 text-[10.5px] font-semibold uppercase tracking-widest text-on-surface-variant/60 text-right" scope="col">Montant</th>
                    <th className="py-3.5 px-5 text-[10.5px] font-semibold uppercase tracking-widest text-on-surface-variant/60" scope="col">Moyen</th>
                    <th className="py-3.5 px-5 text-[10.5px] font-semibold uppercase tracking-widest text-on-surface-variant/60" scope="col">Statut</th>
                    <th className="py-3.5 px-5 text-[10.5px] font-semibold uppercase tracking-widest text-on-surface-variant/60 text-right" scope="col">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => router.push(`/transactions/${tx.id}`)}
                      className="group cursor-pointer transition-colors hover:bg-surface"
                      style={{ borderBottom: '1px solid rgba(233,237,255,0.8)' }}
                    >
                      <td className="py-4 px-5">
                        <span className="text-[12.5px] font-mono font-semibold text-on-surface group-hover:text-primary transition-colors">
                          {tx.reference}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="text-[13px] text-on-surface-variant">{tx.orderName}</span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <span className="text-[13.5px] font-bold text-on-surface tabular-nums">
                          {formatAmount(tx.amount, tx.currency)}
                        </span>
                      </td>
                      <td className="py-4 px-5">{getMethodDisplay(tx.method)}</td>
                      <td className="py-4 px-5">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="py-4 px-5 text-right">
                        <span className="text-[12px] text-on-surface-variant">{tx.date}</span>
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-on-surface-variant/50" style={{ fontSize: '20px' }}>search_off</span>
                          </div>
                          <p className="text-[13.5px] font-semibold text-on-surface">Aucune transaction trouvée</p>
                          <p className="text-[12.5px] text-on-surface-variant">Vérifiez la référence ou le nom du client.</p>
                        </div>
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