"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { paymentData } from "@/data/new-payment";

export default function NewPaymentPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      router.push('/payments/status/PF-20260923-005');
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Mobile Breadcrumb (hidden on md) */}
      <div className="md:hidden mb-4">
        <div className="flex items-center gap-1.5 text-on-surface-variant font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-normal mb-1">
          <span>Commandes</span>
          <span className="material-symbols-outlined text-[13px]">chevron_right</span>
          <span className="text-primary font-medium">Nouvelle transaction</span>
        </div>
        <h1 className="text-on-surface font-headline-md text-[20px] leading-[28px] tracking-[-0.015em] font-semibold">
          Nouvelle commande
        </h1>
        <p className="text-on-surface-variant font-body-default text-[14px] leading-[20px] tracking-[-0.005em] font-normal mt-0.5">
          Préparez votre paiement avant de continuer.
        </p>
      </div>

      {/* Desktop Header (hidden on mobile) */}
      <div className="hidden md:flex max-w-[760px] w-full mx-auto items-center justify-between mb-8">
        <div>
          <h1 className="font-headline-lg text-[24px] leading-[32px] tracking-[-0.02em] font-semibold text-on-surface">Nouvelle commande</h1>
          <p className="font-body-default text-[14px] leading-[20px] tracking-[-0.005em] font-normal text-on-surface-variant mt-1">
            Préparez votre paiement avant de continuer.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[12px] leading-[16px] tracking-[0.01em] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
          <span>Mode Test</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-[760px] w-full mx-auto pb-12">
        <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-4 space-y-4 md:p-6 md:space-y-0">
          
          {/* Section 1: Détails de la commande */}
          <section className="space-y-3 md:space-y-0">
            {/* Mobile Header for Section 1 */}
            <div className="flex md:hidden items-center justify-between">
              <h2 className="text-on-surface font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-semibold">Détails de la commande</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] leading-[16px] tracking-[0.02em] font-medium bg-surface-container text-on-surface-variant">
                Démo
              </span>
            </div>
            
            {/* Desktop Header for Section 1 */}
            <h2 className="hidden md:block font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-semibold text-on-surface mb-4">
              Détails de la commande
            </h2>

            {/* Mobile Details Container */}
            <div className="md:hidden bg-surface-container-low rounded-lg p-3 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="block text-on-surface-variant font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium uppercase tracking-wider">Description</span>
                  <span className="block text-on-surface font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-semibold truncate">{paymentData.description}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="block text-on-surface-variant font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium uppercase tracking-wider">Référence</span>
                  <span className="inline-block px-1.5 py-0.5 mt-0.5 rounded text-[12px] leading-[16px] tracking-[0.02em] font-medium bg-surface-container-highest text-on-surface-variant">
                    {paymentData.reference}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between">
                <span className="text-on-surface-variant font-body-default text-[14px] leading-[20px] tracking-[-0.005em] font-normal">Montant à régler</span>
                <div className="text-right">
                  <span className="text-on-surface font-headline-md text-[20px] leading-[28px] tracking-[-0.015em] font-bold tracking-tight">{paymentData.formattedAmount}</span>
                  <span className="text-primary font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-semibold ml-1">{paymentData.currency}</span>
                </div>
              </div>
            </div>

            {/* Desktop Details Container */}
            <div className="hidden md:grid bg-surface-container-low rounded-lg p-4 grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant uppercase tracking-wider mb-1">Description</span>
                <span className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium text-on-surface">{paymentData.description}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant uppercase tracking-wider mb-1">Référence</span>
                <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-normal text-on-surface bg-surface-container-high px-2 py-0.5 rounded w-fit select-all">{paymentData.reference}</span>
              </div>
              <div className="flex flex-col items-end text-right">
                <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant uppercase tracking-wider mb-1">Montant à régler</span>
                <span className="font-headline-md text-[20px] leading-[28px] tracking-[-0.015em] font-semibold text-on-surface tabular-nums">{paymentData.formattedAmount} {paymentData.currency}</span>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-surface-container-highest md:bg-surface-container-high w-full md:my-6"></div>

          {/* Section 2: Informations client */}
          <section className="space-y-2.5 md:space-y-0">
            <h2 className="text-on-surface font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-semibold md:mb-4">Informations client</h2>
            
            {/* Mobile Client Container */}
            <div className="md:hidden bg-surface-container-low rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between py-0.5">
                <span className="text-on-surface-variant font-body-secondary text-[13px] leading-[18px] tracking-normal font-normal">Nom complet</span>
                <span className="text-on-surface font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium">{paymentData.customer.name}</span>
              </div>
              <div className="h-px w-full bg-surface-container-highest/60"></div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-on-surface-variant font-body-secondary text-[13px] leading-[18px] tracking-normal font-normal">Adresse email</span>
                <span className="text-on-surface font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium truncate max-w-[200px]">{paymentData.customer.email}</span>
              </div>
              <div className="h-px w-full bg-surface-container-highest/60"></div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-on-surface-variant font-body-secondary text-[13px] leading-[18px] tracking-normal font-normal">Numéro de téléphone</span>
                <span className="text-on-surface font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium tracking-tight">{paymentData.customer.phone}</span>
              </div>
            </div>

            {/* Desktop Client Container */}
            <div className="hidden md:grid bg-surface-container-low rounded-lg p-4 grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant uppercase tracking-wider mb-1">Nom complet</span>
                <span className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium text-on-surface">{paymentData.customer.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant uppercase tracking-wider mb-1">Adresse email</span>
                <span className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium text-on-surface truncate">{paymentData.customer.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant uppercase tracking-wider mb-1">Numéro de téléphone</span>
                <span className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium text-on-surface tabular-nums">{paymentData.customer.phone}</span>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-surface-container-highest md:bg-surface-container-high w-full md:my-6"></div>

          {/* Section 3: Moyen de paiement */}
          <section className="space-y-2.5 md:space-y-0">
            <h2 className="text-on-surface font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-semibold md:mb-4">Moyen de paiement</h2>
            
            {/* Mobile Payment Method */}
            <div className="md:hidden relative flex items-center justify-between p-3.5 rounded-lg bg-primary-fixed/30 ring-1 ring-primary transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>{paymentData.paymentMethod.icon}</span>
                </div>
                <div className="min-w-0">
                  <div className="text-on-surface font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-semibold">{paymentData.paymentMethod.name}</div>
                  <div className="text-on-surface-variant font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium">{paymentData.paymentMethod.description}</div>
                </div>
              </div>
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[13px] font-bold">check</span>
              </div>
            </div>

            {/* Desktop Payment Method */}
            <div className="hidden md:flex relative bg-primary-fixed/20 rounded-lg p-4 items-center justify-between shadow-sm cursor-pointer select-none">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary-container shadow-sm">
                  <span className="material-symbols-outlined text-[22px]">{paymentData.paymentMethod.icon}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium text-on-surface">{paymentData.paymentMethod.name}</span>
                  <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant">{paymentData.paymentMethod.description}</span>
                </div>
              </div>
              {/* Active Radio Selection Indicator */}
              <div className="w-5 h-5 rounded-full bg-primary-container flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-surface-container-lowest"></div>
              </div>
            </div>
          </section>

          {/* Payment Action */}
          <div className="pt-2 md:pt-0 md:mt-8 flex flex-col items-center gap-3 space-y-2.5 md:space-y-0">
            {/* Mobile Button */}
            <button
              type="button"
              onClick={handlePay}
              disabled={isProcessing || isSuccess}
              className={`md:hidden w-full h-11 text-on-primary font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all ${
                isProcessing ? 'bg-primary opacity-90 cursor-not-allowed' :
                isSuccess ? 'bg-secondary hover:bg-secondary' :
                'bg-primary hover:bg-primary-container active:scale-[0.99]'
              }`}
            >
              {isProcessing ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  <span>Traitement en cours...</span>
                </>
              ) : isSuccess ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Redirection sécurisée...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span>Payer maintenant</span>
                  <span className="font-normal opacity-90">•</span>
                  <span>{paymentData.formattedAmount} {paymentData.currency}</span>
                </>
              )}
            </button>

            {/* Desktop Button */}
            <button
              type="button"
              onClick={handlePay}
              disabled={isProcessing || isSuccess}
              className={`hidden md:flex w-full h-11 text-on-primary font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium rounded-lg transition-colors items-center justify-center gap-2 shadow-sm focus:outline-none ${
                isProcessing ? 'bg-primary-container cursor-not-allowed' :
                isSuccess ? 'bg-secondary hover:bg-secondary' :
                'bg-primary-container hover:bg-primary'
              }`}
            >
              {isProcessing ? (
                <>
                  <span>Traitement en cours...</span>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                </>
              ) : isSuccess ? (
                <span>Paiement réussi</span>
              ) : (
                <span>Payer maintenant</span>
              )}
            </button>

            {/* Mobile Secure Text */}
            <div className="md:hidden flex items-center justify-center gap-1.5 text-on-surface-variant font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-center">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              <span>Paiement sécurisé et chiffré SSL 256-bit</span>
            </div>

            {/* Desktop Secure Text */}
            <div className="hidden md:inline-flex items-center gap-1.5 text-on-surface-variant font-body-secondary text-[13px] leading-[18px] font-normal">
              <span className="material-symbols-outlined text-[15px] text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <span>Paiement sécurisé et chiffré</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
