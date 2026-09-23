import Link from "next/link";
import { notFound } from "next/navigation";
import { transactions } from "@/data/transactions";

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const transaction = transactions.find((tx) => tx.reference === id);

  if (!transaction) {
    notFound();
  }

  const formatAmount = (amount: number, currency: string) => {
    return `${amount.toLocaleString("fr-FR")} ${currency}`;
  };

  const getDesktopStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-secondary">
            <span className="h-2 w-2 rounded-full bg-secondary"></span>
            <span className="font-body-secondary text-body-secondary font-medium text-secondary">Confirmé</span>
          </div>
        );
      case "pending":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed/40 text-tertiary">
            <span className="h-2 w-2 rounded-full bg-tertiary"></span>
            <span className="font-body-secondary text-body-secondary font-medium text-tertiary">En attente</span>
          </div>
        );
      case "failed":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-error">
            <span className="h-2 w-2 rounded-full bg-error"></span>
            <span className="font-body-secondary text-body-secondary font-medium text-error">Échec</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getMobileStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-caption text-caption font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            Confirmé
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-caption text-caption font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            En attente
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-caption text-caption font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
            Échec
          </span>
        );
      default:
        return null;
    }
  };

  const getDesktopStatusIndicator = (status: string) => {
    switch (status) {
      case "success":
        return (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-secondary"></span>
            <span className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] text-on-surface font-medium">Confirmé</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-tertiary"></span>
            <span className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] text-on-surface font-medium">En attente</span>
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-error"></span>
            <span className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] text-on-surface font-medium">Échec</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getMethodText = (method: string) => {
    if (method === "carte") return "Carte";
    if (method === "mobile_money") return "Mobile Money";
    if (method === "bank_transfer") return "Virement";
    return method;
  };

  return (
    <div className="flex flex-col w-full">
      {/* ============================================================ */}
      {/* MOBILE LAYOUT (hidden on md) */}
      {/* ============================================================ */}
      <div className="md:hidden flex flex-col w-full px-4 pt-5 pb-6 space-y-4">
        {/* Navigation Header & Return Link */}
        <section className="flex flex-col space-y-2">
          <Link
            href="/transactions"
            className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors py-1 group"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
              arrow_back
            </span>
            <span className="font-body-secondary text-[13px] leading-[18px] font-medium">
              Retour aux transactions
            </span>
          </Link>
          <div className="flex items-center justify-between gap-2 pt-1">
            <h1 className="font-headline-md text-[20px] leading-[28px] tracking-[-0.015em] font-semibold text-on-surface tracking-tight">
              Détail de la transaction
            </h1>
            {getMobileStatusBadge(transaction.status)}
          </div>
        </section>

        {/* Carte Principale */}
        <section className="bg-surface-container-lowest rounded-xl p-4 shadow-sm space-y-4">
          {/* Header Montant & Référence */}
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium uppercase tracking-wider text-outline">
                Montant Total
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container-low text-outline font-label-code text-[12px] leading-[16px] tracking-[0.02em]">
                REF: {transaction.reference}
              </span>
            </div>
            <div className="flex items-baseline gap-1 text-on-surface">
              <span className="font-headline-lg text-[24px] leading-[32px] tracking-[-0.02em] font-bold tracking-tight">
                {transaction.amount.toLocaleString("fr-FR")}
              </span>
              <span className="font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] text-outline font-medium">
                {transaction.currency}
              </span>
            </div>
          </div>

          {/* Grille de Détails Métier */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Référence */}
            <div className="bg-surface-container-low rounded-lg p-3 flex flex-col justify-between">
              <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium uppercase tracking-wider text-outline mb-1">
                Référence
              </span>
              <span className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium text-on-surface truncate font-mono">
                {transaction.reference}
              </span>
            </div>
            {/* Statut */}
            <div className="bg-surface-container-low rounded-lg p-3 flex flex-col justify-between">
              <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium uppercase tracking-wider text-outline mb-1">
                Statut
              </span>
              {getDesktopStatusIndicator(transaction.status)}
            </div>
            {/* Moyen de Paiement */}
            <div className="bg-surface-container-low rounded-lg p-3 flex flex-col justify-between">
              <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium uppercase tracking-wider text-outline mb-1">
                Moyen de paiement
              </span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                  {transaction.method === "carte" ? "credit_card" : "account_balance"}
                </span>
                <span className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium text-on-surface">
                  {getMethodText(transaction.method)}
                </span>
              </div>
            </div>
            {/* Date */}
            <div className="bg-surface-container-low rounded-lg p-3 flex flex-col justify-between">
              <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium uppercase tracking-wider text-outline mb-1">
                Date
              </span>
              <span className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium text-on-surface">
                {transaction.date}
              </span>
            </div>
            {/* Commande */}
            <div className="bg-surface-container-low rounded-lg p-3 flex flex-col justify-between">
              <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium uppercase tracking-wider text-outline mb-1">
                Commande
              </span>
              <span className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium text-on-surface">
                {transaction.orderName}
              </span>
            </div>
            {/* Montant */}
            <div className="bg-surface-container-low rounded-lg p-3 flex flex-col justify-between">
              <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium uppercase tracking-wider text-outline mb-1">
                Montant
              </span>
              <span className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium text-on-surface font-semibold">
                {formatAmount(transaction.amount, transaction.currency)}
              </span>
            </div>
          </div>
        </section>

        {/* Section Informations Techniques */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium uppercase tracking-wider text-outline font-semibold">
              Informations techniques
            </span>
            <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-outline-variant font-mono">
              Payload metadata
            </span>
          </div>
          {/* Pile d'informations techniques */}
          <div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm space-y-2">
            {/* Référence Interne */}
            <div className="bg-surface-container-low rounded-lg px-3 py-2.5 flex items-center justify-between">
              <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium uppercase tracking-wider text-outline">
                RÉFÉRENCE INTERNE
              </span>
              <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-mono text-on-surface font-medium select-all">
                {transaction.reference}
              </span>
            </div>
            {/* Référence Paiement */}
            <div className="bg-surface-container-low rounded-lg px-3 py-2.5 flex items-center justify-between">
              <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium uppercase tracking-wider text-outline">
                RÉFÉRENCE PAIEMENT
              </span>
              <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-mono text-on-surface font-medium select-all">
                {transaction.paymentReference}
              </span>
            </div>
            {/* Canal */}
            <div className="bg-surface-container-low rounded-lg px-3 py-2.5 flex items-center justify-between">
              <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium uppercase tracking-wider text-outline">
                CANAL
              </span>
              <span className="font-body-secondary text-[13px] leading-[18px] text-on-surface font-medium">
                {transaction.channel}
              </span>
            </div>
            {/* Devise */}
            <div className="bg-surface-container-low rounded-lg px-3 py-2.5 flex items-center justify-between">
              <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium uppercase tracking-wider text-outline">
                DEVISE
              </span>
              <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-mono text-on-surface font-medium">
                {transaction.isoCurrency}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* ============================================================ */}
      {/* DESKTOP LAYOUT (hidden on mobile) */}
      {/* ============================================================ */}
      <div className="hidden md:flex flex-col w-full">
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 px-[32px] py-[32px]">
          <div className="flex flex-col gap-2">
            <div>
              <Link
                href="/transactions"
                className="inline-flex items-center gap-1 font-body-secondary text-[13px] leading-[18px] text-on-surface-variant hover:text-primary transition-colors group"
              >
                <span className="material-symbols-outlined text-[16px] transition-transform group-hover:-translate-x-0.5">
                  arrow_back
                </span>
                <span>Retour aux transactions</span>
              </Link>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1">
              <h1 className="font-headline-lg text-[24px] leading-[32px] tracking-[-0.02em] font-semibold text-on-surface tracking-tight">
                Détail de la transaction
              </h1>
              {getDesktopStatusBadge(transaction.status)}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4">
              <div className="flex flex-col gap-1">
                <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant uppercase tracking-wider">
                  Montant total
                </span>
                <div className="font-headline-lg text-[24px] leading-[32px] tracking-[-0.02em] text-on-surface font-semibold tracking-tight">
                  {formatAmount(transaction.amount, transaction.currency)}
                </div>
              </div>
              <div className="flex items-center gap-1 font-label-code text-[12px] leading-[16px] tracking-[0.02em] text-on-surface-variant bg-surface-container-low px-2.5 py-1.5 rounded-lg">
                <span className="text-on-surface-variant/70">REF:</span>
                <span className="text-on-surface font-medium select-all">
                  {transaction.reference}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
              <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-surface-container-low/50">
                <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant uppercase tracking-wider">
                  Référence
                </span>
                <span className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] text-on-surface font-mono select-all">
                  {transaction.reference}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-surface-container-low/50">
                <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant uppercase tracking-wider">
                  Statut
                </span>
                {getDesktopStatusIndicator(transaction.status)}
              </div>
              <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-surface-container-low/50">
                <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant uppercase tracking-wider">
                  Moyen de paiement
                </span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                    {transaction.method === "carte" ? "credit_card" : "account_balance"}
                  </span>
                  <span className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] text-on-surface font-medium">
                    {getMethodText(transaction.method)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-surface-container-low/50">
                <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant uppercase tracking-wider">
                  Date
                </span>
                <span className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] text-on-surface font-medium">
                  {transaction.date}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-surface-container-low/50">
                <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant uppercase tracking-wider">
                  Commande
                </span>
                <span className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] text-on-surface font-medium">
                  {transaction.orderName}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-surface-container-low/50">
                <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant uppercase tracking-wider">
                  Montant
                </span>
                <span className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] text-on-surface font-semibold">
                  {formatAmount(transaction.amount, transaction.currency)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-label-default text-[12px] leading-[16px] tracking-[0.01em] text-on-surface-variant uppercase tracking-wider font-semibold">
                Informations techniques
              </h2>
              <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] text-on-surface-variant font-mono">
                Payload metadata
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1 bg-surface-container-low p-3 rounded-lg">
                <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant uppercase tracking-wide">
                  Référence interne
                </span>
                <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] text-on-surface font-mono select-all">
                  {transaction.reference}
                </span>
              </div>
              <div className="flex flex-col gap-1 bg-surface-container-low p-3 rounded-lg">
                <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant uppercase tracking-wide">
                  Référence paiement
                </span>
                <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] text-on-surface font-mono select-all">
                  {transaction.paymentReference}
                </span>
              </div>
              <div className="flex flex-col gap-1 bg-surface-container-low p-3 rounded-lg">
                <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant uppercase tracking-wide">
                  Canal
                </span>
                <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] text-on-surface font-mono">
                  {transaction.channel}
                </span>
              </div>
              <div className="flex flex-col gap-1 bg-surface-container-low p-3 rounded-lg">
                <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant uppercase tracking-wide">
                  Devise
                </span>
                <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] text-on-surface font-mono font-medium">
                  {transaction.isoCurrency}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
