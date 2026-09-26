"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Transaction = { id: string; reference: string; orderName: string; amount: number; currency: string; method: string; status: string; date: string; };

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
        setTransactions(data.map((tx: any) => ({
          id: tx.id, reference: tx.internalRef, orderName: tx.customerName || "N/A", amount: Number(tx.amount), currency: tx.currency, method: tx.channel || "carte", status: tx.status.toLowerCase(),
          date: new Date(tx.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
        })));
      } catch (err) { console.error(err); setError(true); } finally { setLoading(false); }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    const searchString = `${tx.reference} ${tx.orderName} ${tx.amount} ${tx.status} ${tx.method}`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase().trim());
  });

  const getDesktopStatusBadge = (status: string) => {
    switch (status) {
      case "success": return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-default text-[11px] leading-[14px] tracking-[0.02em] bg-secondary-fixed/30 text-secondary font-medium">Confirmé</span>;
      case "pending": return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-default text-[11px] leading-[14px] tracking-[0.02em] bg-tertiary-fixed/40 text-tertiary font-medium">En attente</span>;
      case "failed": return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-default text-[11px] leading-[14px] tracking-[0.02em] bg-error-container text-error font-medium">Échec</span>;
      default: return null;
    }
  };

  const getMobileStatusBadge = (status: string) => {
    switch (status) {
      case "success": return <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary-container/20 text-secondary font-label-default text-[12px] leading-[16px] tracking-[0.01em]">Confirmé</span>;
      case "pending": return <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-default text-[12px] leading-[16px] tracking-[0.01em]">En attente</span>;
      case "failed": return <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-error-container text-on-error-container font-label-default text-[12px] leading-[16px] tracking-[0.01em]">Échec</span>;
      default: return null;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${amount.toLocaleString("fr-FR")} ${currency}`;
  };

  const getMethodIcon = (method: string) => {
    if (method === "carte" || method === "card") {
      return <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-on-surface-variant">credit_card</span><span>Carte</span></span>;
    }
    return <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-on-surface-variant">smartphone</span><span>Mobile</span></span>;
  };

  if (loading) return <div className="p-8 text-center text-on-surface-variant">Chargement des transactions...</div>;
  if (error) return <div className="p-8 text-center text-error">Erreur lors du chargement des transactions.</div>;

  return (
    <div className="flex flex-col w-full">
      <div className="md:hidden flex flex-col w-full px-4 py-4">
        <div className="flex flex-col gap-1 mb-4">
          <h1 className="font-headline-lg text-[24px] leading-[32px] tracking-[-0.02em] font-semibold text-on-surface tracking-tight">Transactions</h1>
          <p className="font-body-default text-[14px] leading-[20px] tracking-[-0.005em] font-normal text-on-surface-variant">Historique des paiements enregistrés.</p>
        </div>
        <div className="relative w-full mb-4">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">search</span>
          <input className="w-full h-10 pl-10 pr-3 bg-surface-container-lowest text-on-surface placeholder:text-outline text-[14px] leading-[20px] tracking-[-0.005em] font-normal rounded-lg shadow-sm focus:outline-none focus:shadow-[0_0_0_2px_rgba(84,39,230,0.25)] transition-all" placeholder="Rechercher une transaction..." type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2 w-full">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="flex flex-col p-4 bg-surface-container-lowest rounded-xl shadow-sm transition-all active:scale-[0.99] cursor-pointer" onClick={() => router.push(`/transactions/${tx.id}`)}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-semibold text-on-surface tracking-tight">{tx.reference}</span>
                {getMobileStatusBadge(tx.status)}
              </div>
              <div className="flex items-center justify-between text-on-surface-variant mb-3">
                <span className="font-body-default text-[14px] leading-[20px] tracking-[-0.005em] font-normal">{tx.orderName}</span>
                <div className="flex items-center gap-1.5 font-body-secondary text-[13px] leading-[18px] font-normal">{getMethodIcon(tx.method)}</div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-semibold text-on-surface">{formatAmount(tx.amount, tx.currency)}</span>
                <span className="font-body-secondary text-[13px] leading-[18px] font-normal text-on-surface-variant">{tx.date}</span>
              </div>
            </div>
          ))}
          {filteredTransactions.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-container-lowest rounded-xl shadow-sm my-2">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-2"><span className="material-symbols-outlined text-[20px]">search_off</span></div>
              <p className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium text-on-surface">Aucune transaction trouvée</p>
              <p className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant mt-0.5">Vérifiez la référence ou le nom de commande.</p>
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:flex flex-col w-full">
        <div className="max-w-[1376px] w-full mx-auto px-[32px] py-[32px] flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="font-headline-lg text-[24px] leading-[32px] tracking-[-0.02em] font-semibold text-on-surface tracking-tight">Transactions</h1>
              <p className="font-body-default text-[14px] leading-[20px] tracking-[-0.005em] font-normal text-on-surface-variant">Historique des paiements enregistrés.</p>
            </div>
            <div className="relative w-full sm:w-[260px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">search</span></div>
              <input className="w-full h-[38px] pl-9 pr-3.5 bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-default text-[13px] leading-[18px] font-normal rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Rechercher une transaction..." type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="h-9 bg-surface-container-low text-on-surface-variant font-label-default text-[11px] leading-[14px] tracking-[0.02em] font-medium uppercase tracking-wider">
                    <th className="py-2.5 px-6 font-medium" scope="col">Référence</th><th className="py-2.5 px-6 font-medium" scope="col">Commande</th><th className="py-2.5 px-6 font-medium text-right" scope="col">Montant</th><th className="py-2.5 px-6 font-medium" scope="col">Moyen</th><th className="py-2.5 px-6 font-medium" scope="col">Statut</th><th className="py-2.5 px-6 font-medium text-right" scope="col">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y-0 font-body-default text-[14px] leading-[20px] tracking-[-0.005em] font-normal">
                  {filteredTransactions.map((tx, index) => (
                    <tr key={tx.id} onClick={() => router.push(`/transactions/${tx.id}`)} className={`h-14 hover:bg-surface-container-low/40 transition-colors cursor-pointer ${index % 2 === 0 ? "bg-surface-container-lowest" : "bg-surface-container-low/20"}`}>
                      <td className="py-3.5 px-6 font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium text-on-surface whitespace-nowrap">{tx.reference}</td>
                      <td className="py-3.5 px-6 font-body-secondary text-[13px] leading-[18px] font-normal text-on-surface-variant whitespace-nowrap">{tx.orderName}</td>
                      <td className="py-3.5 px-6 font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium text-on-surface text-right tabular-nums whitespace-nowrap">{formatAmount(tx.amount, tx.currency)}</td>
                      <td className="py-3.5 px-6 font-body-secondary text-[13px] leading-[18px] font-normal text-on-surface-variant whitespace-nowrap">{getMethodIcon(tx.method)}</td>
                      <td className="py-3.5 px-6 whitespace-nowrap">{getDesktopStatusBadge(tx.status)}</td>
                      <td className="py-3.5 px-6 font-body-secondary text-[13px] leading-[18px] font-normal text-on-surface-variant text-right whitespace-nowrap">{tx.date}</td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr className="h-14 bg-surface-container-lowest">
                      <td colSpan={6} className="py-8 px-6 text-center text-on-surface-variant">Aucune transaction trouvée</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}