"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface TransactionDetail {
  id: string;
  internalRef: string;
  paystackRef: string | null;
  amount: number;
  currency: string;
  channel: string | null;
  status: string;
  createdAt: string;
  order?: {
    id: string;
    reference: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string | null;
    description?: string | null;
    createdAt: string;
  };
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  description?: string;
}

export default function TransactionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tx, setTx] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchTx = async () => {
      try {
        const { apiFetch } = await import('@/lib/api');
        const data = await apiFetch(`/transactions/${id}`);
        setTx(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTx();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-on-surface-variant">
        <span className="material-symbols-outlined text-[32px] animate-spin text-primary mb-2">progress_activity</span>
        <p className="font-body-medium text-body-medium">Chargement du détail de la transaction...</p>
      </div>
    );
  }

  if (error || !tx) {
    return (
      <div className="p-8 max-w-lg mx-auto flex flex-col items-center justify-center text-center bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 mt-8">
        <div className="w-12 h-12 rounded-full bg-error-container/60 text-error flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-[24px]">error</span>
        </div>
        <h2 className="font-headline-md text-headline-md text-on-surface font-semibold mb-2">Transaction introuvable</h2>
        <p className="font-body-default text-body-default text-on-surface-variant mb-6">
          Impossible de récupérer les informations de cette transaction.
        </p>
        <button
          onClick={() => router.push("/transactions")}
          className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary font-body-medium text-body-medium rounded-lg shadow-sm transition-colors"
        >
          Retour aux transactions
        </button>
      </div>
    );
  }

  const rawStatus = (tx.status || "").toLowerCase();
  const isSuccess = rawStatus === "success";
  const isPending = rawStatus === "pending";
  const statusLabel = isSuccess ? "Confirmé" : isPending ? "En attente" : "Échec";

  const customerName = tx.order?.customerName || tx.customerName || "Non disponible";
  const customerEmail = tx.order?.customerEmail || tx.customerEmail || "";
  const customerPhone = tx.order?.customerPhone || tx.customerPhone || "";
  const orderDescription = tx.order?.description || tx.description || tx.order?.reference || "Non disponible";

  const channelLabel = () => {
    const ch = (tx.channel || "").toLowerCase();
    if (ch.includes("card") || ch.includes("carte")) return "Carte";
    if (ch.includes("mobile") || ch.includes("money")) return "Mobile Money";
    return tx.channel || "Non spécifié";
  };

  const formattedDate = new Date(tx.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-space-lg">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-space-sm">
          <div>
            <Link
              href="/transactions"
              className="inline-flex items-center gap-space-xs font-body-secondary text-body-secondary text-on-surface-variant hover:text-primary transition-colors group"
            >
              <span className="material-symbols-outlined text-[16px] transition-transform group-hover:-translate-x-0.5">arrow_back</span>
              <span>Retour aux transactions</span>
            </Link>
          </div>
          <div className="flex items-center justify-between gap-space-md pt-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold">Détail de la transaction</h1>
            {isSuccess && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-secondary">
                <span className="h-2 w-2 rounded-full bg-secondary"></span>
                <span className="font-body-secondary text-body-secondary font-medium text-secondary">{statusLabel}</span>
              </div>
            )}
            {isPending && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant">
                <span className="h-2 w-2 rounded-full bg-tertiary"></span>
                <span className="font-body-secondary text-body-secondary font-medium">{statusLabel}</span>
              </div>
            )}
            {!isSuccess && !isPending && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container">
                <span className="h-2 w-2 rounded-full bg-error"></span>
                <span className="font-body-secondary text-body-secondary font-medium">{statusLabel}</span>
              </div>
            )}
          </div>
        </div>

        {/* Carte Principale */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 sm:p-8 flex flex-col gap-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-space-sm pb-space-md border-b border-surface-container-high/60">
            <div className="flex flex-col gap-1">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider font-medium">Montant total</span>
              <div className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
                {Number(tx.amount).toLocaleString("fr-FR")} {tx.currency}
              </div>
            </div>
            <div className="flex items-center gap-space-xs font-label-code text-label-code text-on-surface-variant bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/30">
              <span className="text-on-surface-variant/70">REF:</span>
              <span className="text-on-surface font-medium select-all font-mono">{tx.internalRef}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 pt-2">
            <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-surface-container-low/50 border border-outline-variant/20">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Référence</span>
              <span className="font-body-medium text-body-medium text-on-surface font-mono select-all truncate">{tx.internalRef}</span>
            </div>

            <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-surface-container-low/50 border border-outline-variant/20">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Statut</span>
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${isSuccess ? 'bg-secondary' : isPending ? 'bg-tertiary' : 'bg-error'}`}></span>
                <span className="font-body-medium text-body-medium text-on-surface font-medium">{statusLabel}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-surface-container-low/50 border border-outline-variant/20">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Moyen de paiement</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">credit_card</span>
                <span className="font-body-medium text-body-medium text-on-surface font-medium">{channelLabel()}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-surface-container-low/50 border border-outline-variant/20">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Date</span>
              <span className="font-body-medium text-body-medium text-on-surface font-medium">{formattedDate}</span>
            </div>

            <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-surface-container-low/50 border border-outline-variant/20">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Commande</span>
              <span className="font-body-medium text-body-medium text-on-surface font-medium truncate" title={orderDescription}>{orderDescription}</span>
            </div>

            <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-surface-container-low/50 border border-outline-variant/20">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">Client</span>
              <div className="flex flex-col">
                <span className="font-body-medium text-body-medium text-on-surface font-medium truncate">{customerName}</span>
                {customerEmail && (
                  <span className="font-caption text-caption text-on-surface-variant truncate">{customerEmail}</span>
                )}
                {customerPhone && (
                  <span className="font-caption text-caption text-on-surface-variant">{customerPhone}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section Informations Techniques */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 flex flex-col gap-space-md">
          <div className="flex items-center justify-between pb-2 border-b border-surface-container-high/60">
            <h2 className="font-label-default text-label-default text-on-surface-variant uppercase tracking-wider font-semibold">Informations techniques</h2>
            <span className="font-caption text-caption text-on-surface-variant font-mono">Payload metadata</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1 bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wide">Référence interne</span>
              <span className="font-label-code text-label-code text-on-surface font-mono select-all truncate">{tx.internalRef}</span>
            </div>

            <div className="flex flex-col gap-1 bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wide">Référence paiement</span>
              <span className="font-label-code text-label-code text-on-surface font-mono select-all truncate">{tx.paystackRef || "Non disponible"}</span>
            </div>

            <div className="flex flex-col gap-1 bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wide">Canal</span>
              <span className="font-label-code text-label-code text-on-surface font-mono truncate">{tx.channel || "Non spécifié"}</span>
            </div>

            <div className="flex flex-col gap-1 bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
              <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wide">Devise</span>
              <span className="font-label-code text-label-code text-on-surface font-mono font-medium">{tx.currency}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}