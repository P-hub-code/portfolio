"use client";

import { useState, useEffect, use, useRef } from "react";
import Link from "next/link";

export type PaymentStatus = "pending" | "success" | "failed" | "error";

export default function PaymentStatusPage({ params }: { params: Promise<{ reference: string }> }) {
  const unwrappedParams = use(params);
  const reference = decodeURIComponent(unwrappedParams.reference);

  const [status, setStatus] = useState<PaymentStatus>("pending");
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pollCount, setPollCount] = useState(0);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkStatus = async () => {
    try {
      const { apiFetch } = await import('@/lib/api');
      const data = await apiFetch('/transactions');
      if (Array.isArray(data)) {
        const tx = data.find((t: any) => t.internalRef === reference || t.orderReference === reference);
        if (tx) {
          setTransaction(tx);
          const apiStatus = (tx.status || "").toLowerCase();
          if (apiStatus === 'success') {
            setStatus('success');
            return true;
          } else if (apiStatus === 'failed') {
            setStatus('failed');
            return true;
          } else {
            setStatus('pending');
          }
        }
      }
    } catch (err) {
      console.error('Error fetching transaction status:', err);
    } finally {
      setLoading(false);
    }
    return false;
  };

  useEffect(() => {
    let isSubscribed = true;
    let attempts = 0;
    const maxAttempts = 24;

    const runPolling = async () => {
      const done = await checkStatus();
      if (done || !isSubscribed) return;

      pollIntervalRef.current = setInterval(async () => {
        attempts += 1;
        setPollCount(attempts);

        const finished = await checkStatus();
        if (finished || attempts >= maxAttempts) {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
        }
      }, 2500);
    };

    runPolling();

    return () => {
      isSubscribed = false;
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [reference]);

  const displayAmount = transaction
    ? `${Number(transaction.amount).toLocaleString('fr-FR')} ${transaction.currency || 'FCFA'}`
    : "—";

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-8 w-full">
      <div
        className="w-full max-w-[480px] bg-white rounded-2xl flex flex-col overflow-hidden"
        style={{
          boxShadow: '0 4px 24px rgba(20,27,43,0.08), 0 1px 3px rgba(20,27,43,0.06)',
          border: '1px solid rgba(201,196,217,0.3)',
        }}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ background: 'rgba(244,245,251,0.8)', borderBottom: '1px solid rgba(201,196,217,0.25)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #5427e6 0%, #6d4aff 100%)' }}
            >
              <span className="material-symbols-outlined text-white" style={{ fontSize: '12px', fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <span className="text-[12px] font-bold text-on-surface tracking-tight">Payflow Checkout</span>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant/60">
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>lock</span>
            <span className="text-[11px] font-medium">SSL 256-bit</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 flex flex-col">

          {/* ── PENDING ── */}
          {status === 'pending' && (
            <div className="flex flex-col items-center text-center animate-fade-in">
              {/* Spinner */}
              <div className="relative w-16 h-16 mb-6">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'rgba(84,39,230,0.08)' }}
                />
                <svg
                  className="w-16 h-16 animate-spin"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="32" cy="32" r="26" stroke="rgba(84,39,230,0.15)" strokeWidth="4" />
                  <path
                    d="M32 6a26 26 0 0 1 26 26"
                    stroke="url(#grad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#5427e6" />
                      <stop offset="100%" stopColor="#6d4aff" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <h1 className="text-[18px] font-bold text-on-surface mb-2">Vérification en cours</h1>
              <p className="text-[13px] text-on-surface-variant mb-6 max-w-[340px]">
                Nous confirmons votre paiement auprès de votre banque via Paystack.
              </p>

              {/* Ledger */}
              <div
                className="w-full rounded-2xl mb-6"
                style={{ background: 'rgba(244,245,251,0.7)', border: '1px solid rgba(201,196,217,0.3)' }}
              >
                {[
                  { label: 'Référence', value: reference, mono: true },
                  { label: 'Montant', value: displayAmount, bold: true },
                  { label: 'Statut', value: (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold" style={{ background: 'rgba(255,221,184,0.4)', color: '#653e00', border: '1px solid rgba(121,75,0,0.15)' }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#794b00' }} />
                      En attente
                    </span>
                  )},
                ].map(({ label, value, mono, bold }, i, arr) => (
                  <div
                    key={label}
                    className="flex items-center justify-between px-4 py-3"
                    style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(201,196,217,0.2)' : undefined }}
                  >
                    <span className="text-[12.5px] text-on-surface-variant">{label}</span>
                    {typeof value === 'string' ? (
                      <span className={`text-[12.5px] font-semibold text-on-surface ${mono ? 'font-mono' : ''} ${bold ? 'text-[14px]' : ''}`}>
                        {value}
                      </span>
                    ) : value}
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-2.5 w-full">
                <div className="flex items-center gap-1.5 text-on-surface-variant/60 text-[12px]">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>info</span>
                  <span>Vérification automatique en arrière-plan...</span>
                </div>
                <button
                  onClick={() => checkStatus()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold transition-all hover:shadow-sm"
                  style={{ background: 'rgba(233,237,255,0.8)', color: '#5427e6', border: '1px solid rgba(84,39,230,0.15)' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>refresh</span>
                  Vérifier manuellement
                </button>
              </div>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {status === 'success' && (
            <div className="flex flex-col items-center text-center animate-fade-in">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ background: 'linear-gradient(135deg, #006e2f 0%, #00a346 100%)' }}
              >
                <span className="material-symbols-outlined text-white" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>

              <h1 className="text-[20px] font-bold text-on-surface mb-2">Paiement confirmé ✓</h1>
              <p className="text-[13px] text-on-surface-variant mb-6 max-w-[340px]">
                Votre paiement a été confirmé avec succès par le serveur via webhook Paystack.
              </p>

              {/* Ledger */}
              <div
                className="w-full rounded-2xl mb-6"
                style={{ background: 'rgba(244,245,251,0.7)', border: '1px solid rgba(201,196,217,0.3)' }}
              >
                {[
                  { label: 'Référence', value: reference, mono: true },
                  { label: 'Montant débité', value: displayAmount, bold: true },
                  { label: 'Statut', value: (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold" style={{ background: 'rgba(107,255,143,0.15)', color: '#005321', border: '1px solid rgba(0,110,47,0.15)' }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#006e2f' }} />
                      Confirmé
                    </span>
                  )},
                ].map(({ label, value, mono, bold }, i, arr) => (
                  <div
                    key={label}
                    className="flex items-center justify-between px-4 py-3"
                    style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(201,196,217,0.2)' : undefined }}
                  >
                    <span className="text-[12.5px] text-on-surface-variant">{label}</span>
                    {typeof value === 'string' ? (
                      <span className={`text-[12.5px] font-semibold text-on-surface ${mono ? 'font-mono' : ''} ${bold ? 'text-[14px]' : ''}`}>
                        {value}
                      </span>
                    ) : value}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2.5 w-full">
                <Link
                  href={transaction?.id ? `/transactions/${transaction.id}` : "/transactions"}
                  className="w-full h-11 rounded-xl text-white text-[13.5px] font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #5427e6 0%, #6d4aff 100%)' }}
                >
                  <span>Voir la transaction</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>arrow_forward</span>
                </Link>
                <Link
                  href="/"
                  className="w-full h-10 rounded-xl text-on-surface text-[13.5px] font-semibold flex items-center justify-center transition-all hover:bg-surface-container"
                  style={{ background: 'rgba(244,245,251,0.8)', border: '1px solid rgba(201,196,217,0.4)' }}
                >
                  Retour au Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* ── FAILED ── */}
          {status === 'failed' && (
            <div className="flex flex-col items-center text-center animate-fade-in">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ background: 'linear-gradient(135deg, #ba1a1a 0%, #dc2626 100%)' }}
              >
                <span className="material-symbols-outlined text-white" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>cancel</span>
              </div>

              <h1 className="text-[20px] font-bold text-on-surface mb-2">Paiement non confirmé</h1>
              <p className="text-[13px] text-on-surface-variant mb-6 max-w-[340px]">
                Le paiement n&apos;a pas pu être confirmé par l&apos;établissement bancaire.
              </p>

              {/* Ledger */}
              <div
                className="w-full rounded-2xl mb-6"
                style={{ background: 'rgba(244,245,251,0.7)', border: '1px solid rgba(201,196,217,0.3)' }}
              >
                {[
                  { label: 'Référence', value: reference, mono: true },
                  { label: 'Montant', value: displayAmount, bold: true },
                  { label: 'Statut', value: (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold" style={{ background: 'rgba(255,218,214,0.5)', color: '#93000a', border: '1px solid rgba(186,26,26,0.15)' }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#ba1a1a' }} />
                      Échec
                    </span>
                  )},
                ].map(({ label, value, mono, bold }, i, arr) => (
                  <div
                    key={label}
                    className="flex items-center justify-between px-4 py-3"
                    style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(201,196,217,0.2)' : undefined }}
                  >
                    <span className="text-[12.5px] text-on-surface-variant">{label}</span>
                    {typeof value === 'string' ? (
                      <span className={`text-[12.5px] font-semibold text-on-surface ${mono ? 'font-mono' : ''} ${bold ? 'text-[14px]' : ''}`}>
                        {value}
                      </span>
                    ) : value}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2.5 w-full">
                <Link
                  href="/payments/new"
                  className="w-full h-11 rounded-xl text-white text-[13.5px] font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #5427e6 0%, #6d4aff 100%)' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>replay</span>
                  <span>Réessayer le paiement</span>
                </Link>
                <Link
                  href="/"
                  className="w-full h-10 rounded-xl text-on-surface text-[13.5px] font-semibold flex items-center justify-center transition-all hover:bg-surface-container"
                  style={{ background: 'rgba(244,245,251,0.8)', border: '1px solid rgba(201,196,217,0.4)' }}
                >
                  Retour au Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* ── ERROR ── */}
          {status === 'error' && (
            <div className="flex flex-col items-center text-center animate-fade-in">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ background: 'rgba(255,221,184,0.5)' }}
              >
                <span className="material-symbols-outlined text-tertiary" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>priority_high</span>
              </div>

              <h1 className="text-[20px] font-bold text-on-surface mb-2">Une erreur est survenue</h1>
              <p className="text-[13px] text-on-surface-variant mb-6 max-w-[340px]">
                Impossible de joindre le serveur pour vérifier le statut du paiement.
              </p>

              <div className="flex flex-col gap-2.5 w-full">
                <button
                  onClick={() => checkStatus()}
                  className="w-full h-11 rounded-xl text-white text-[13.5px] font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #5427e6 0%, #6d4aff 100%)' }}
                  type="button"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>refresh</span>
                  <span>Réessayer</span>
                </button>
                <Link
                  href="/"
                  className="w-full h-10 rounded-xl text-on-surface text-[13.5px] font-semibold flex items-center justify-center transition-all hover:bg-surface-container"
                  style={{ background: 'rgba(244,245,251,0.8)', border: '1px solid rgba(201,196,217,0.4)' }}
                >
                  Retour au Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: '1px solid rgba(201,196,217,0.25)', background: 'rgba(244,245,251,0.5)' }}
        >
          <span className="text-[11px] text-on-surface-variant/50">Source de vérité: Webhooks Paystack</span>
          <span className="text-[10.5px] font-mono text-on-surface-variant/40 truncate max-w-[160px]">REF: {reference}</span>
        </div>
      </div>
    </div>
  );
}
