"use client";

import { useState, useEffect, use } from "react";

export type PaymentStatus = "pending" | "success" | "failed" | "error";

export default function PaymentStatusPage({ params }: { params: Promise<{ reference: string }> }) {
  const [status, setStatus] = useState<PaymentStatus>("pending");
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const unwrappedParams = use(params);
  const reference = decodeURIComponent(unwrappedParams.reference);

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const { apiFetch } = await import('@/lib/api');
        const data = await apiFetch('/transactions');
        const tx = data.find((t: any) => t.internalRef === reference);
        if (tx) {
          setTransaction(tx);
          let apiStatus = tx.status.toLowerCase();
          if (apiStatus === 'success' || apiStatus === 'failed' || apiStatus === 'pending') {
             setStatus(apiStatus as any);
          }
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };
    fetchTx();
  }, [reference]);

  return (
    <div className="flex flex-col w-full">
      {/* ============================================================ */}
      {/* MOBILE LAYOUT (hidden on md) */}
      {/* ============================================================ */}
      <div className="md:hidden">
        {/* Section Contextuelle & Navigation */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5 text-on-surface-variant font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium">
            <span>Paiements</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium">Statut de transaction</span>
          </div>
          <div className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-full text-on-surface-variant font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium">
            <span className="material-symbols-outlined text-[13px] text-primary">verified_user</span>
            <span>V2 Direct</span>
          </div>
        </div>


        {/* Carte Principale Unique */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-5 w-full transition-all">
          {/* En-tête technique sobre */}
          <div className="flex items-center justify-between pb-3.5 mb-5 bg-surface-container-low/50 -mx-5 -mt-5 px-5 pt-4 rounded-t-xl">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[15px] text-primary">lock</span>
              <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-semibold uppercase tracking-wider text-on-surface-variant">Passerelle Payflow Checkout</span>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant bg-surface-container px-2 py-0.5 rounded text-[11px] font-caption">
              <span className="material-symbols-outlined text-[12px] text-secondary">encrypted</span>
              <span>TLS 256-bit</span>
            </div>
          </div>

          {/* STATES */}
          {status === 'pending' && (
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center mb-3.5">
                <svg className="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                  <path className="opacity-90" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-semibold text-on-surface mb-1">Confirmation du paiement en cours</h2>
              <p className="font-body-secondary text-[13px] leading-[18px] font-normal text-on-surface-variant px-1 mb-5">
                Nous vérifions votre paiement auprès de votre banque. Cela peut prendre quelques instants.
              </p>
              
              <div className="w-full bg-surface-container-low rounded-lg p-3.5 mb-4 text-left space-y-2.5">
                <div className="flex justify-between items-center text-on-surface-variant font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium">
                  <span>Référence</span>
                  <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-normal text-on-surface font-mono">{reference}</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium">
                  <span>Montant débité</span>
                  <span className="font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-bold text-on-surface">{(transaction ? `${transaction.amount} ${transaction.currency}` : "---")}</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium pt-0.5">
                  <span>Statut actuel</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium bg-tertiary-fixed text-on-tertiary-fixed-variant">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    En attente
                  </span>
                </div>
              </div>

              <div className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-surface-container rounded-lg text-on-surface-variant font-body-secondary text-[13px] leading-[18px] font-normal mb-2">
                <span className="material-symbols-outlined text-[16px] text-primary">info</span>
                <span>Veuillez ne pas fermer cette fenêtre.</span>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center mb-3.5">
                <span className="material-symbols-outlined text-[26px] text-secondary font-bold">check_circle</span>
              </div>
              <h2 className="font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-semibold text-on-surface mb-1">Paiement confirmé</h2>
              <p className="font-body-secondary text-[13px] leading-[18px] font-normal text-on-surface-variant px-1 mb-5">
                Votre paiement a été confirmé avec succès auprès du réseau bancaire.
              </p>

              <div className="w-full bg-surface-container-low rounded-lg p-3.5 mb-5 text-left space-y-2.5">
                <div className="flex justify-between items-center text-on-surface-variant font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium">
                  <span>Référence</span>
                  <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-normal text-on-surface font-mono">{reference}</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium">
                  <span>Montant débité</span>
                  <span className="font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-bold text-on-surface">{(transaction ? `${transaction.amount} ${transaction.currency}` : "---")}</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium pt-0.5">
                  <span>Statut actuel</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium bg-secondary-fixed text-on-secondary-container">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Confirmé
                  </span>
                </div>
              </div>

              <button className="w-full h-11 bg-primary hover:bg-[#5B3CE0] active:bg-primary-container text-on-primary font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors mb-1">
                <span>Voir la transaction</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          )}

          {status === 'failed' && (
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center mb-3.5">
                <span className="material-symbols-outlined text-[26px] text-error font-bold">cancel</span>
              </div>
              <h2 className="font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-semibold text-on-surface mb-1">Paiement non confirmé</h2>
              <p className="font-body-secondary text-[13px] leading-[18px] font-normal text-on-surface-variant px-1 mb-5">
                Le paiement n'a pas pu être confirmé par votre établissement.
              </p>

              <div className="w-full bg-surface-container-low rounded-lg p-3.5 mb-5 text-left space-y-2.5">
                <div className="flex justify-between items-center text-on-surface-variant font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium">
                  <span>Référence</span>
                  <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-normal text-on-surface font-mono">{reference}</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium">
                  <span>Montant débité</span>
                  <span className="font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-bold text-on-surface">{(transaction ? `${transaction.amount} ${transaction.currency}` : "---")}</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium pt-0.5">
                  <span>Statut actuel</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium bg-error-container text-on-error-container">
                    <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                    Échec
                  </span>
                </div>
              </div>

              <button className="w-full h-11 bg-primary hover:bg-[#5B3CE0] active:bg-primary-container text-on-primary font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors mb-1">
                <span className="material-symbols-outlined text-[18px]">replay</span>
                <span>Réessayer le paiement</span>
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center mb-3.5">
                <span className="material-symbols-outlined text-[26px] text-tertiary font-bold">warning</span>
              </div>
              <h2 className="font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-semibold text-on-surface mb-1">Une erreur est survenue</h2>
              <p className="font-body-secondary text-[13px] leading-[18px] font-normal text-on-surface-variant px-1 mb-5">
                Impossible de confirmer le statut du paiement en raison d'une indisponibilité temporaire.
              </p>

              <div className="w-full bg-surface-container-low rounded-lg p-3.5 mb-5 text-left space-y-2.5">
                <div className="flex justify-between items-center text-on-surface-variant font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium">
                  <span>Référence</span>
                  <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-normal text-on-surface font-mono">{reference}</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium">
                  <span>Montant débité</span>
                  <span className="font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-bold text-on-surface">{(transaction ? `${transaction.amount} ${transaction.currency}` : "---")}</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium pt-0.5">
                  <span>Statut actuel</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium bg-tertiary-fixed text-on-tertiary-fixed-variant">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    Non résolu
                  </span>
                </div>
              </div>

              <button className="w-full h-11 bg-primary hover:bg-[#5B3CE0] active:bg-primary-container text-on-primary font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors mb-1">
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                <span>Réessayer</span>
              </button>
            </div>
          )}

          {/* Séparateur & Horodatage technique discret */}
          <div className="mt-5 pt-3.5 bg-surface-container-low/40 -mx-5 -mb-5 px-5 pb-4 rounded-b-xl flex flex-col gap-1 text-on-surface-variant font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-normal">
            <div className="flex justify-between items-center">
              <span>Horodatage UTC</span>
              <span className="font-mono text-on-surface">{(transaction ? new Date(transaction.createdAt).toUTCString() : "---")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Identifiant transaction</span>
              <span className="font-mono text-on-surface">{(transaction ? transaction.id : "---")}</span>
            </div>
          </div>
        </div>

        {/* Pied de page épuré */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-on-surface-variant font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium opacity-80">
          <a className="hover:text-primary transition-colors" href="#">Documentation API</a>
          <span>·</span>
          <a className="hover:text-primary transition-colors" href="#">Politique de conformité</a>
          <span>·</span>
          <a className="hover:text-primary transition-colors" href="#">État des passerelles</a>
        </div>
      </div>


      {/* ============================================================ */}
      {/* DESKTOP LAYOUT (hidden on mobile) */}
      {/* ============================================================ */}
      <div className="hidden md:flex w-full flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-6">
        

        {/* Main Payment Status Card */}
        <div className="w-full max-w-[520px] bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-8 flex flex-col">
          
          {/* Top Meta / Flow breadcrumb indicator */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-container"></span>
              <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-normal text-on-surface-variant uppercase tracking-wider">Passerelle Payflow Checkout</span>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant/70 font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              <span>Protocole TLS 256-bit</span>
            </div>
          </div>

          {/* Content Area with States */}
          <div className="flex flex-col items-center text-center">
            
            {status === 'pending' && (
              <div className="w-full flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-5">
                  <svg className="animate-spin w-6 h-6 text-primary-container" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5"></circle>
                    <path className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor"></path>
                  </svg>
                </div>
                <h1 className="font-headline-md text-[20px] leading-[28px] tracking-[-0.015em] font-semibold text-on-surface tracking-tight mb-2">
                  Confirmation du paiement en cours
                </h1>
                <p className="font-body-default text-[14px] leading-[20px] tracking-[-0.005em] font-normal text-on-surface-variant max-w-[420px] mb-6">
                  Nous vérifions votre paiement auprès de votre banque. Cela peut prendre quelques instants.
                </p>

                <div className="w-full bg-surface rounded-lg border border-outline-variant/30 p-4 text-left mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-outline-variant/20">
                    <span className="font-body-secondary text-[13px] leading-[18px] font-normal text-on-surface-variant">Référence de transaction</span>
                    <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-normal text-on-surface font-medium select-all">{reference}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-outline-variant/20">
                    <span className="font-body-secondary text-[13px] leading-[18px] font-normal text-on-surface-variant">Montant débité</span>
                    <span className="font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-semibold text-on-surface">{(transaction ? `${transaction.amount} ${transaction.currency}` : "---")}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-body-secondary text-[13px] leading-[18px] font-normal text-on-surface-variant">Statut actuel</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-tertiary-fixed text-on-tertiary-fixed-variant text-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                      <span>En attente</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-on-surface-variant text-body-secondary text-[13px] leading-[18px] font-normal">
                  <span className="material-symbols-outlined text-[18px]">info</span>
                  <span>Veuillez ne pas fermer cette fenêtre.</span>
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="w-full flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-secondary-fixed/40 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-[28px] text-secondary">check</span>
                </div>
                <h1 className="font-headline-md text-[20px] leading-[28px] tracking-[-0.015em] font-semibold text-on-surface tracking-tight mb-2">
                  Paiement confirmé
                </h1>
                <p className="font-body-default text-[14px] leading-[20px] tracking-[-0.005em] font-normal text-on-surface-variant max-w-[420px] mb-6">
                  Votre paiement a été confirmé avec succès par le serveur.
                </p>

                <div className="w-full bg-surface rounded-lg border border-outline-variant/30 p-4 text-left mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-outline-variant/20">
                    <span className="font-body-secondary text-[13px] leading-[18px] font-normal text-on-surface-variant">Référence</span>
                    <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-normal text-on-surface font-medium select-all">{reference}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-outline-variant/20">
                    <span className="font-body-secondary text-[13px] leading-[18px] font-normal text-on-surface-variant">Montant</span>
                    <span className="font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-semibold text-on-surface">{(transaction ? `${transaction.amount} ${transaction.currency}` : "---")}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-body-secondary text-[13px] leading-[18px] font-normal text-on-surface-variant">Statut</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed-variant text-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      <span>Confirmé</span>
                    </span>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-2.5">
                  <a href="#" className="w-full h-[42px] bg-primary-container text-on-primary hover:bg-primary rounded-lg font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium flex items-center justify-center gap-2 transition-colors">
                    <span>Voir la transaction</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </a>
                  <a href="#" className="w-full h-[38px] bg-surface-container-lowest hover:bg-surface-container-low text-on-surface border border-outline-variant/40 rounded-lg font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium flex items-center justify-center transition-colors">
                    Retour au Dashboard
                  </a>
                </div>
              </div>
            )}

            {status === 'failed' && (
              <div className="w-full flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-error-container/40 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-[28px] text-error">close</span>
                </div>
                <h1 className="font-headline-md text-[20px] leading-[28px] tracking-[-0.015em] font-semibold text-on-surface tracking-tight mb-2">
                  Paiement non confirmé
                </h1>
                <p className="font-body-default text-[14px] leading-[20px] tracking-[-0.005em] font-normal text-on-surface-variant max-w-[420px] mb-6">
                  Le paiement n'a pas pu être confirmé par l'établissement bancaire.
                </p>

                <div className="w-full bg-surface rounded-lg border border-outline-variant/30 p-4 text-left mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-outline-variant/20">
                    <span className="font-body-secondary text-[13px] leading-[18px] font-normal text-on-surface-variant">Référence</span>
                    <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-normal text-on-surface font-medium select-all">{reference}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-outline-variant/20">
                    <span className="font-body-secondary text-[13px] leading-[18px] font-normal text-on-surface-variant">Montant</span>
                    <span className="font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-semibold text-on-surface">{(transaction ? `${transaction.amount} ${transaction.currency}` : "---")}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-body-secondary text-[13px] leading-[18px] font-normal text-on-surface-variant">Statut</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-error-container text-on-error-container text-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                      <span>Échec</span>
                    </span>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-2.5">
                  <button onClick={() => setStatus('pending')} type="button" className="w-full h-[42px] bg-primary-container text-on-primary hover:bg-primary rounded-lg font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium flex items-center justify-center gap-2 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">replay</span>
                    <span>Réessayer le paiement</span>
                  </button>
                  <a href="#" className="w-full h-[38px] bg-surface-container-lowest hover:bg-surface-container-low text-on-surface border border-outline-variant/40 rounded-lg font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium flex items-center justify-center transition-colors">
                    Contacter le support
                  </a>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="w-full flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-tertiary-fixed/60 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-[28px] text-tertiary">priority_high</span>
                </div>
                <h1 className="font-headline-md text-[20px] leading-[28px] tracking-[-0.015em] font-semibold text-on-surface tracking-tight mb-2">
                  Une erreur est survenue
                </h1>
                <p className="font-body-default text-[14px] leading-[20px] tracking-[-0.005em] font-normal text-on-surface-variant max-w-[420px] mb-6">
                  Impossible de confirmer le statut du paiement en raison d'un délai dépassé.
                </p>

                <div className="w-full bg-surface rounded-lg border border-outline-variant/30 p-4 text-left mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-outline-variant/20">
                    <span className="font-body-secondary text-[13px] leading-[18px] font-normal text-on-surface-variant">Référence</span>
                    <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-normal text-on-surface font-medium select-all">{reference}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-outline-variant/20">
                    <span className="font-body-secondary text-[13px] leading-[18px] font-normal text-on-surface-variant">Montant</span>
                    <span className="font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-semibold text-on-surface">{(transaction ? `${transaction.amount} ${transaction.currency}` : "---")}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-body-secondary text-[13px] leading-[18px] font-normal text-on-surface-variant">Statut</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-tertiary-fixed text-on-tertiary-fixed-variant text-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                      <span>Session expirée</span>
                    </span>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-2.5">
                  <button onClick={() => setStatus('pending')} type="button" className="w-full h-[42px] bg-primary-container text-on-primary hover:bg-primary rounded-lg font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium flex items-center justify-center gap-2 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                    <span>Réessayer</span>
                  </button>
                  <a href="#" className="w-full h-[38px] bg-surface-container-lowest hover:bg-surface-container-low text-on-surface border border-outline-variant/40 rounded-lg font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium flex items-center justify-center transition-colors">
                    Retour à l'accueil
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Security / Footer stamp */}
          <div className="mt-8 pt-5 border-t border-outline-variant/20 flex items-center justify-between text-on-surface-variant/70 font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium">
            <span>Horodatage UTC: {(transaction ? new Date(transaction.createdAt).toUTCString() : "---")}</span>
            <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-normal">ID: {(transaction ? transaction.id : "---")}</span>
          </div>
        </div>

        {/* Quick navigation footnote */}
        <div className="mt-6 flex items-center gap-4 text-on-surface-variant/80 font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium">
          <a className="hover:text-on-surface transition-colors" href="#">Documentation API</a>
          <span className="text-outline-variant">·</span>
          <a className="hover:text-on-surface transition-colors" href="#">Politique de conformité</a>
          <span className="text-outline-variant">·</span>
          <a className="hover:text-on-surface transition-colors" href="#">État des passerelles</a>
        </div>
      </div>
    </div>
  );
}
