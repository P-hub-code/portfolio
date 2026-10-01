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

function InfoField({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10.5px] font-semibold uppercase tracking-widest text-on-surface-variant/60">
        {label}
      </span>
      <div className={`text-[13.5px] font-medium text-on-surface ${mono ? 'font-mono' : ''}`}>
        {value}
      </div>
    </div>
  );
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
      <div className="flex flex-col w-full max-w-3xl mx-auto gap-4">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-[220px] w-full" />
        <div className="skeleton h-[160px] w-full" />
      </div>
    );
  }

  if (error || !tx) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-5">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(255,218,214,0.4)' }}
        >
          <span className="material-symbols-outlined text-error" style={{ fontSize: '28px' }}>error</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <h2 className="text-[16px] font-bold text-on-surface">Transaction introuvable</h2>
          <p className="text-[13px] text-on-surface-variant max-w-[340px]">
            Impossible de récupérer les informations de cette transaction.
          </p>
        </div>
        <button
          onClick={() => router.push("/transactions")}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl text-white text-[13.5px] font-semibold transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #5427e6 0%, #6d4aff 100%)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>arrow_back</span>
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
    if (ch.includes("card") || ch.includes("carte")) return "Carte bancaire";
    if (ch.includes("mobile") || ch.includes("money")) return "Mobile Money";
    return tx.channel || "Non spécifié";
  };

  const formattedDate = new Date(tx.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusConfig = {
    success: { label: 'Confirmé', color: '#005321', bg: 'rgba(107,255,143,0.12)', border: 'rgba(0,110,47,0.15)', dot: '#006e2f' },
    pending: { label: 'En attente', color: '#653e00', bg: 'rgba(255,221,184,0.3)', border: 'rgba(121,75,0,0.15)', dot: '#794b00' },
    failed: { label: 'Échec', color: '#93000a', bg: 'rgba(255,218,214,0.35)', border: 'rgba(186,26,26,0.15)', dot: '#ba1a1a' },
  };
  const sc = isSuccess ? statusConfig.success : isPending ? statusConfig.pending : statusConfig.failed;

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto gap-6 animate-fade-in">

      {/* ── Back + Status ── */}
      <div className="flex items-center justify-between">
        <Link
          href="/transactions"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-on-surface-variant hover:text-primary transition-colors group"
        >
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-0.5" style={{ fontSize: '16px' }}>arrow_back</span>
          Transactions
        </Link>
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold"
          style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}
        >
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sc.dot }} />
          {sc.label}
        </span>
      </div>

      {/* ── Main Card: Amount + Key Info ── */}
      <div
        className="bg-white rounded-2xl p-6 md:p-8 flex flex-col gap-6"
        style={{
          boxShadow: '0 1px 3px rgba(20,27,43,0.07), 0 1px 2px rgba(20,27,43,0.05)',
          border: '1px solid rgba(201,196,217,0.3)',
        }}
      >
        {/* Amount hero */}
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6"
          style={{ borderBottom: '1px solid rgba(233,237,255,0.8)' }}
        >
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant/60">Montant total</span>
            <div className="text-[28px] md:text-[32px] font-bold text-on-surface tabular-nums tracking-tight">
              {Number(tx.amount).toLocaleString("fr-FR")}
              <span className="text-[16px] font-semibold text-on-surface-variant ml-2">{tx.currency}</span>
            </div>
          </div>
          <div
            className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-2 rounded-xl"
            style={{ background: 'rgba(233,237,255,0.7)', border: '1px solid rgba(201,196,217,0.3)' }}
          >
            <span className="text-[11px] font-semibold text-on-surface-variant/60 uppercase tracking-wider">REF</span>
            <span className="text-[12.5px] font-mono font-semibold text-on-surface select-all">{tx.internalRef}</span>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          <InfoField label="Référence interne" value={tx.internalRef} mono />
          <InfoField
            label="Statut"
            value={
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: sc.dot }} />
                {statusLabel}
              </span>
            }
          />
          <InfoField
            label="Moyen de paiement"
            value={
              <span className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '16px' }}>credit_card</span>
                {channelLabel()}
              </span>
            }
          />
          <InfoField label="Date et heure" value={formattedDate} />
          <InfoField label="Commande" value={<span className="truncate block max-w-[180px]" title={orderDescription}>{orderDescription}</span>} />
          <InfoField
            label="Client"
            value={
              <div className="flex flex-col gap-0.5">
                <span>{customerName}</span>
                {customerEmail && <span className="text-[12px] font-normal text-on-surface-variant">{customerEmail}</span>}
                {customerPhone && <span className="text-[12px] font-normal text-on-surface-variant">{customerPhone}</span>}
              </div>
            }
          />
        </div>
      </div>

      {/* ── Technical Info ── */}
      <div
        className="bg-white rounded-2xl p-6 flex flex-col gap-5"
        style={{
          boxShadow: '0 1px 3px rgba(20,27,43,0.07), 0 1px 2px rgba(20,27,43,0.05)',
          border: '1px solid rgba(201,196,217,0.3)',
        }}
      >
        <div className="flex items-center justify-between" style={{ borderBottom: '1px solid rgba(233,237,255,0.8)', paddingBottom: '12px' }}>
          <h2 className="text-[13px] font-bold text-on-surface">Informations techniques</h2>
          <span className="text-[11px] font-mono text-on-surface-variant/60">Payload metadata</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Réf. interne', value: tx.internalRef },
            { label: 'Réf. paiement', value: tx.paystackRef || '—' },
            { label: 'Canal', value: tx.channel || '—' },
            { label: 'Devise', value: tx.currency },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col gap-1.5 p-3.5 rounded-xl"
              style={{ background: 'rgba(244,245,251,0.8)', border: '1px solid rgba(201,196,217,0.2)' }}
            >
              <span className="text-[10.5px] font-semibold uppercase tracking-wider text-on-surface-variant/60">{label}</span>
              <span className="text-[12.5px] font-mono font-semibold text-on-surface truncate select-all">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}