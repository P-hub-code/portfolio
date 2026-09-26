"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
export default function TransactionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tx, setTx] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!id) return;
    const fetchTx = async () => {
      try {
        const { apiFetch } = await import('@/lib/api');
        const data = await apiFetch(`/transactions/${id}`);
        setTx(data);
      } catch (err) { console.error(err); setError(true); } finally { setLoading(false); }
    };
    fetchTx();
  }, [id]);
  if (loading) return <div className="p-8 text-center text-on-surface-variant">Chargement...</div>;
  if (error || !tx) return (
    <div className="p-8 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Transaction introuvable</h2>
      <button onClick={() => router.push("/transactions")} className="px-4 py-2 bg-blue-600 text-white rounded">Retour</button>
    </div>
  );
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <button onClick={() => router.push("/transactions")} className="mb-4 text-blue-600 hover:underline">&larr; Retour</button>
      <h1 className="text-2xl font-bold mb-6">Détails de la transaction</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
        <div className="flex justify-between border-b pb-4"><span className="text-gray-500">ID</span><span className="font-mono">{tx.id}</span></div>
        <div className="flex justify-between border-b pb-4"><span className="text-gray-500">Référence</span><span className="font-medium">{tx.internalRef}</span></div>
        <div className="flex justify-between border-b pb-4"><span className="text-gray-500">Montant</span><span className="font-bold">{tx.amount} {tx.currency}</span></div>
        <div className="flex justify-between border-b pb-4"><span className="text-gray-500">Statut</span><span className="capitalize">{tx.status}</span></div>
        <div className="flex justify-between border-b pb-4"><span className="text-gray-500">Client</span><span>{tx.customerName} ({tx.customerEmail})</span></div>
        <div className="flex justify-between pb-4"><span className="text-gray-500">Date</span><span>{new Date(tx.createdAt).toLocaleString("fr-FR")}</span></div>
      </div>
    </div>
  );
}