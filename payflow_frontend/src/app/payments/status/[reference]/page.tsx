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
            return true; // Stop polling
          } else if (apiStatus === 'failed') {
            setStatus('failed');
            return true; // Stop polling
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
    const maxAttempts = 24; // 24 * 2.5s = 60 seconds of auto-polling

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
          if (!finished && attempts >= maxAttempts && isSubscribed) {
            // Keep pending or show check button
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
    : "---";

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-space-lg w-full">
      {/* Main Payment Status Card */}
      <div className="w-full max-w-[520px] bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 sm:p-8 flex flex-col">
        {/* Top Meta / Flow breadcrumb indicator */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-container"></span>
            <span className="font-label-code text-label-code text-on-surface-variant uppercase tracking-wider font-semibold">
              Passerelle Payflow Checkout
            </span>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant/70 font-caption text-caption">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            <span>Protocole TLS 256-bit</span>
          </div>
        </div>

        {/* Content Area with States */}
        <div className="flex flex-col items-center text-center">

          {/* 1. PENDING STATE */}
          {status === 'pending' && (
            <div className="w-full flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-5">
                <svg className="animate-spin w-6 h-6 text-primary-container" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5"></circle>
                  <path className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor"></path>
                </svg>
              </div>
              <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-2 font-semibold">
                Confirmation du paiement en cours
              </h1>
              <p className="font-body-default text-body-default text-on-surface-variant max-w-[420px] mb-6">
                Nous vérifions votre paiement auprès de votre banque via webhook Paystack. Cela peut prendre quelques instants.
              </p>

              {/* Ledger Detail Block */}
              <div className="w-full bg-surface rounded-lg border border-outline-variant/30 p-4 text-left mb-6">
                <div className="flex items-center justify-between py-2 border-b border-outline-variant/20">
                  <span className="font-body-secondary text-body-secondary text-on-surface-variant">Référence de transaction</span>
                  <span className="font-label-code text-label-code text-on-surface font-mono font-medium select-all">{reference}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-outline-variant/20">
                  <span className="font-body-secondary text-body-secondary text-on-surface-variant">Montant</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold tabular-nums">{displayAmount}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-body-secondary text-body-secondary text-on-surface-variant">Statut actuel</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-tertiary-fixed text-on-tertiary-fixed-variant text-label-default font-label-default font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                    <span>En attente</span>
                  </span>
                </div>
              </div>

              {/* Bottom Notice & Refresh */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-on-surface-variant text-body-secondary font-body-secondary">
                  <span className="material-symbols-outlined text-[18px]">info</span>
                  <span>Vérification automatique en arrière-plan...</span>
                </div>
                <button
                  onClick={() => checkStatus()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-primary font-medium hover:underline bg-surface-container rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">refresh</span>
                  <span>Vérifier le statut manuellement</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. SUCCESS STATE */}
          {status === 'success' && (
            <div className="w-full flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/40 flex items-center justify-center mb-5 text-secondary">
                <span className="material-symbols-outlined text-[28px] font-bold">check</span>
              </div>
              <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-2 font-semibold">
                Paiement confirmé
              </h1>
              <p className="font-body-default text-body-default text-on-surface-variant max-w-[420px] mb-6">
                Votre paiement a été confirmé avec succès par le serveur via webhook.
              </p>

              {/* Ledger Detail Block */}
              <div className="w-full bg-surface rounded-lg border border-outline-variant/30 p-4 text-left mb-6">
                <div className="flex items-center justify-between py-2 border-b border-outline-variant/20">
                  <span className="font-body-secondary text-body-secondary text-on-surface-variant">Référence</span>
                  <span className="font-label-code text-label-code text-on-surface font-mono font-medium select-all">{reference}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-outline-variant/20">
                  <span className="font-body-secondary text-body-secondary text-on-surface-variant">Montant débité</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold tabular-nums">{displayAmount}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-body-secondary text-body-secondary text-on-surface-variant">Statut</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed-variant text-label-default font-label-default font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    <span>Confirmé</span>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="w-full flex flex-col gap-2.5">
                <Link
                  href={transaction?.id ? `/transactions/${transaction.id}` : "/transactions"}
                  className="w-full h-[42px] bg-primary-container text-on-primary hover:bg-primary rounded-lg font-body-medium text-body-medium flex items-center justify-center gap-2 transition-colors font-medium shadow-sm"
                >
                  <span>Voir la transaction</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
                <Link
                  href="/"
                  className="w-full h-[38px] bg-surface-container-lowest hover:bg-surface-container-low text-on-surface border border-outline-variant/40 rounded-lg font-body-medium text-body-medium flex items-center justify-center transition-colors"
                >
                  Retour au Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* 3. FAILED STATE */}
          {status === 'failed' && (
            <div className="w-full flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-error-container/40 flex items-center justify-center mb-5 text-error">
                <span className="material-symbols-outlined text-[28px] font-bold">close</span>
              </div>
              <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-2 font-semibold">
                Paiement non confirmé
              </h1>
              <p className="font-body-default text-body-default text-on-surface-variant max-w-[420px] mb-6">
                Le paiement n'a pas pu être confirmé par l'établissement bancaire.
              </p>

              {/* Ledger Detail Block */}
              <div className="w-full bg-surface rounded-lg border border-outline-variant/30 p-4 text-left mb-6">
                <div className="flex items-center justify-between py-2 border-b border-outline-variant/20">
                  <span className="font-body-secondary text-body-secondary text-on-surface-variant">Référence</span>
                  <span className="font-label-code text-label-code text-on-surface font-mono font-medium select-all">{reference}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-outline-variant/20">
                  <span className="font-body-secondary text-body-secondary text-on-surface-variant">Montant</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold tabular-nums">{displayAmount}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-body-secondary text-body-secondary text-on-surface-variant">Statut</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-error-container text-on-error-container text-label-default font-label-default font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                    <span>Échec</span>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="w-full flex flex-col gap-2.5">
                <Link
                  href="/payments/new"
                  className="w-full h-[42px] bg-primary-container text-on-primary hover:bg-primary rounded-lg font-body-medium text-body-medium flex items-center justify-center gap-2 transition-colors font-medium shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">replay</span>
                  <span>Réessayer le paiement</span>
                </Link>
                <Link
                  href="/"
                  className="w-full h-[38px] bg-surface-container-lowest hover:bg-surface-container-low text-on-surface border border-outline-variant/40 rounded-lg font-body-medium text-body-medium flex items-center justify-center transition-colors"
                >
                  Retour au Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* 4. ERROR STATE */}
          {status === 'error' && (
            <div className="w-full flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed/60 flex items-center justify-center mb-5 text-tertiary">
                <span className="material-symbols-outlined text-[28px] font-bold">priority_high</span>
              </div>
              <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-2 font-semibold">
                Une erreur est survenue
              </h1>
              <p className="font-body-default text-body-default text-on-surface-variant max-w-[420px] mb-6">
                Impossible de joindre le serveur pour vérifier le statut du paiement.
              </p>

              {/* Actions */}
              <div className="w-full flex flex-col gap-2.5">
                <button
                  onClick={() => checkStatus()}
                  className="w-full h-[42px] bg-primary-container text-on-primary hover:bg-primary rounded-lg font-body-medium text-body-medium flex items-center justify-center gap-2 transition-colors font-medium shadow-sm"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                  <span>Réessayer</span>
                </button>
                <Link
                  href="/"
                  className="w-full h-[38px] bg-surface-container-lowest hover:bg-surface-container-low text-on-surface border border-outline-variant/40 rounded-lg font-body-medium text-body-medium flex items-center justify-center transition-colors"
                >
                  Retour au Dashboard
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* Security / Footer stamp */}
        <div className="mt-8 pt-5 border-t border-outline-variant/20 flex items-center justify-between text-on-surface-variant/70 font-caption text-caption">
          <span>Source de vérité: Webhooks Paystack</span>
          <span className="font-label-code text-label-code font-mono truncate max-w-[180px]">REF: {reference}</span>
        </div>
      </div>
    </div>
  );
}
