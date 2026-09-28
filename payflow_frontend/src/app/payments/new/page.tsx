"use client";

import { useState } from "react";

export default function NewPaymentPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+225 ");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobile_money">("card");

  const validateForm = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return "Le nom complet est obligatoire.";
    if (trimmedName.length < 2) return "Le nom doit contenir au moins 2 caractères.";
    if (trimmedName.length > 100) return "Le nom ne doit pas dépasser 100 caractères.";
    if (!/^[a-zA-ZÀ-ÿ\s'\-]+$/.test(trimmedName)) return "Le nom contient des caractères non autorisés.";

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Veuillez entrer une adresse e-mail valide.";

    const phoneDigits = phone.replace(/[^0-9]/g, "");
    if (!phone.startsWith("+225") || phoneDigits.length < 13) {
      return "Veuillez entrer un numéro de téléphone valide au format +225 (10 chiffres).";
    }

    if (!description.trim()) return "La description de la commande est obligatoire.";
    if (description.trim().length > 500) return "La description ne doit pas dépasser 500 caractères.";

    if (amount === "" || Number(amount) <= 0) return "Le montant doit être supérieur à 0.";

    return null;
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const { apiFetch } = await import('@/lib/api');
      const data = await apiFetch('/payments/initialize', {
        method: 'POST',
        body: JSON.stringify({
          customerName: name.trim(),
          email: email.trim(),
          customerPhone: phone.trim(),
          description: description.trim(),
          amount: Number(amount),
          paymentMethod: paymentMethod,
        }),
      });

      if (data?.status && data.authorization_url) {
        setIsSuccess(true);
        window.location.href = data.authorization_url;
      } else {
        throw new Error('URL de redirection manquante dans la réponse du serveur');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'initialisation du paiement');
      setIsProcessing(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith("+225")) {
      val = "+225 " + val.replace(/^\+225\s?/, "");
    }
    setPhone(val);
  };

  return (
    <div className="flex flex-col w-full max-w-[760px] mx-auto pb-12">
      {/* Screen Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold">Nouvelle commande</h1>
          <p className="font-body-default text-body-default text-on-surface-variant mt-1">
            Préparez votre paiement avant de continuer.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-label-default font-label-default font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
          <span>Mode Test</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-sm border border-outline-variant/30">
        <form onSubmit={handlePay} className="flex flex-col gap-6">

          {/* Error Message */}
          {error && (
            <div className="p-4 text-sm text-error bg-error-container rounded-lg flex items-start gap-2 border border-error/20">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Informations client */}
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-4">
              Informations client
            </h2>
            <div className="bg-surface-container-low rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4 border border-outline-variant/20">
              <div className="flex flex-col">
                <label htmlFor="name" className="font-caption text-caption text-on-surface-variant uppercase tracking-wider mb-1 font-medium">
                  Nom complet <span className="text-error">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: John Doe"
                  className="w-full bg-surface-container-lowest text-on-surface font-body-medium text-[14px] p-2.5 rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="font-caption text-caption text-on-surface-variant uppercase tracking-wider mb-1 font-medium">
                  Adresse email <span className="text-error">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@exemple.com"
                  className="w-full bg-surface-container-lowest text-on-surface font-body-medium text-[14px] p-2.5 rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <label htmlFor="phone" className="font-caption text-caption text-on-surface-variant uppercase tracking-wider mb-1 font-medium">
                  Numéro de téléphone <span className="text-error">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+225 0700000000"
                  className="w-full bg-surface-container-lowest text-on-surface font-body-medium text-[14px] p-2.5 rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-surface-container-high"></div>

          {/* Section 2: Détails de la commande */}
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-4">
              Détails de la commande
            </h2>
            <div className="bg-surface-container-low rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4 border border-outline-variant/20">
              <div className="flex flex-col md:col-span-2">
                <label htmlFor="description" className="font-caption text-caption text-on-surface-variant uppercase tracking-wider mb-1 font-medium">
                  Description <span className="text-error">*</span>
                </label>
                <input
                  id="description"
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Commande #001 - Chaussures de sport"
                  className="w-full bg-surface-container-lowest text-on-surface font-body-medium text-[14px] p-2.5 rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="amount" className="font-caption text-caption text-on-surface-variant uppercase tracking-wider mb-1 font-medium">
                  Montant à régler (FCFA) <span className="text-error">*</span>
                </label>
                <input
                  id="amount"
                  type="number"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                  placeholder="Ex: 5000"
                  className="w-full bg-surface-container-lowest text-on-surface font-headline-md text-headline-md p-2 rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-surface-container-high"></div>

          {/* Section 3: Moyen de paiement */}
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-4">
              Moyen de paiement
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Carte bancaire */}
              <div
                onClick={() => setPaymentMethod("card")}
                className={`relative rounded-lg p-4 flex items-center justify-between shadow-sm cursor-pointer select-none transition-all ${
                  paymentMethod === "card"
                    ? "bg-primary-fixed/25 border-2 border-primary"
                    : "bg-surface-container-low border border-outline-variant/30 hover:bg-surface-container-high/40"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${
                    paymentMethod === "card" ? "bg-surface-container-lowest text-primary" : "bg-surface-container text-on-surface-variant"
                  }`}>
                    <span className="material-symbols-outlined text-[22px]">credit_card</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-medium text-body-medium text-on-surface font-semibold">Carte bancaire</span>
                    <span className="font-caption text-caption text-on-surface-variant">Visa, Mastercard</span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  paymentMethod === "card" ? "border-primary bg-primary" : "border-outline bg-transparent"
                }`}>
                  {paymentMethod === "card" && <div className="w-2 h-2 rounded-full bg-surface-container-lowest"></div>}
                </div>
              </div>

              {/* Mobile Money */}
              <div
                onClick={() => setPaymentMethod("mobile_money")}
                className={`relative rounded-lg p-4 flex items-center justify-between shadow-sm cursor-pointer select-none transition-all ${
                  paymentMethod === "mobile_money"
                    ? "bg-primary-fixed/25 border-2 border-primary"
                    : "bg-surface-container-low border border-outline-variant/30 hover:bg-surface-container-high/40"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${
                    paymentMethod === "mobile_money" ? "bg-surface-container-lowest text-primary" : "bg-surface-container text-on-surface-variant"
                  }`}>
                    <span className="material-symbols-outlined text-[22px]">smartphone</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-medium text-body-medium text-on-surface font-semibold">Mobile Money</span>
                    <span className="font-caption text-caption text-on-surface-variant">Orange, MTN, Moov, Wave</span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  paymentMethod === "mobile_money" ? "border-primary bg-primary" : "border-outline bg-transparent"
                }`}>
                  {paymentMethod === "mobile_money" && <div className="w-2 h-2 rounded-full bg-surface-container-lowest"></div>}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Action */}
          <div className="mt-4 flex flex-col items-center gap-3">
            <button
              id="pay-btn"
              type="submit"
              disabled={isProcessing || isSuccess}
              className={`w-full h-11 text-on-primary font-body-medium text-body-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm font-semibold ${
                isProcessing
                  ? "bg-primary opacity-80 cursor-wait"
                  : isSuccess
                  ? "bg-secondary hover:bg-secondary cursor-default"
                  : "bg-primary-container hover:bg-primary active:scale-[0.99]"
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
                  <span>Redirection vers Paystack...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span>
                    Payer {amount ? `${Number(amount).toLocaleString('fr-FR')} FCFA` : 'maintenant'}
                  </span>
                </>
              )}
            </button>

            <div className="inline-flex items-center gap-1.5 text-on-surface-variant font-body-secondary text-body-secondary">
              <span className="material-symbols-outlined text-[15px] text-on-surface-variant">lock</span>
              <span>Paiement sécurisé et chiffré SSL 256-bit</span>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
