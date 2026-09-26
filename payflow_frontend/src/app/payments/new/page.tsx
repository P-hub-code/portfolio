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
  const [paymentMethod, setPaymentMethod] = useState("carte");

  const validateForm = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return "Le nom complet est obligatoire.";
    if (trimmedName.length < 2) return "Le nom doit contenir au moins 2 caractères.";
    if (trimmedName.length > 100) return "Le nom ne doit pas dépasser 100 caractères.";
    if (!/^[a-zA-ZÀ-ÿ\s'\-]+$/.test(trimmedName)) return "Le nom contient des caractères non autorisés.";

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Veuillez entrer une adresse e-mail valide.";
    
    // Validation du numéro de téléphone (Côte d'Ivoire +225...)
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
          customerName: name,
          email: email,
          customerPhone: phone,
          description: description,
          amount: Number(amount),
          paymentMethod: paymentMethod,
        }),
      });

      if (data?.status && data.authorization_url) {
        setIsSuccess(true);
        window.location.href = data.authorization_url;
      } else {
        throw new Error('URL de redirection manquante');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
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
      </div>

      {/* Main Card */}
      <div className="max-w-[760px] w-full mx-auto pb-12">
        <form onSubmit={handlePay} className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-4 space-y-6 md:p-6 md:space-y-8">
          
          {/* Error Message */}
          {error && (
            <div className="p-4 text-sm text-error bg-error-container rounded-lg flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Informations client */}
          <section className="space-y-3 md:space-y-4">
            <h2 className="text-on-surface font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-semibold">Informations client</h2>
            
            <div className="bg-surface-container-low rounded-lg p-3 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="name" className="text-on-surface-variant font-body-secondary text-[13px] leading-[18px] mb-1.5">
                  Nom complet <span className="text-error">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom complet"
                  className="w-full bg-surface-container-highest text-on-surface font-body-medium text-[14px] p-2.5 rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="text-on-surface-variant font-body-secondary text-[13px] leading-[18px] mb-1.5">
                  Adresse email <span className="text-error">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.com"
                  className="w-full bg-surface-container-highest text-on-surface font-body-medium text-[14px] p-2.5 rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <label htmlFor="phone" className="text-on-surface-variant font-body-secondary text-[13px] leading-[18px] mb-1.5">
                  Numéro de téléphone <span className="text-error">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+225 0102030405"
                  className="w-full md:max-w-md bg-surface-container-highest text-on-surface font-body-medium text-[14px] p-2.5 rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Détails de la commande */}
          <section className="space-y-3 md:space-y-4">
            <h2 className="text-on-surface font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-semibold">Détails de la commande</h2>
            
            <div className="bg-surface-container-low rounded-lg p-3 md:p-4 space-y-4">
              <div className="flex flex-col">
                <label htmlFor="description" className="text-on-surface-variant font-body-secondary text-[13px] leading-[18px] mb-1.5">
                  Description de la commande <span className="text-error">*</span>
                </label>
                <textarea
                  id="description"
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Achat de chaussures, Pointure 42..."
                  className="w-full bg-surface-container-highest text-on-surface font-body-medium text-[14px] p-2.5 rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="amount" className="text-on-surface-variant font-body-secondary text-[13px] leading-[18px] mb-1.5">
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
                  className="w-full md:max-w-xs bg-surface-container-highest text-on-surface font-headline-md text-[20px] p-2.5 rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Moyen de paiement */}
          <section className="space-y-3 md:space-y-4">
            <h2 className="text-on-surface font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-semibold">Moyen de paiement</h2>
            
            <div className="bg-surface-container-low rounded-lg p-3 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <label 
                className={`relative flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'carte' 
                    ? 'border-primary bg-primary-fixed/20' 
                    : 'border-outline-variant bg-surface-container-highest hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[20px] ${paymentMethod === 'carte' ? 'text-primary' : 'text-on-surface-variant'}`}>
                    credit_card
                  </span>
                  <span className={`font-body-medium text-[14px] ${paymentMethod === 'carte' ? 'text-primary font-medium' : 'text-on-surface'}`}>
                    Carte bancaire
                  </span>
                </div>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="carte" 
                  checked={paymentMethod === 'carte'}
                  onChange={() => setPaymentMethod('carte')}
                  className="w-4 h-4 text-primary focus:ring-primary border-outline-variant"
                />
              </label>

              <label 
                className={`relative flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'mobile_money' 
                    ? 'border-primary bg-primary-fixed/20' 
                    : 'border-outline-variant bg-surface-container-highest hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[20px] ${paymentMethod === 'mobile_money' ? 'text-primary' : 'text-on-surface-variant'}`}>
                    account_balance
                  </span>
                  <span className={`font-body-medium text-[14px] ${paymentMethod === 'mobile_money' ? 'text-primary font-medium' : 'text-on-surface'}`}>
                    Mobile Money
                  </span>
                </div>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="mobile_money" 
                  checked={paymentMethod === 'mobile_money'}
                  onChange={() => setPaymentMethod('mobile_money')}
                  className="w-4 h-4 text-primary focus:ring-primary border-outline-variant"
                />
              </label>
            </div>
          </section>

          {/* Payment Action */}
          <div className="pt-2 flex flex-col items-center gap-3">
            <button
              type="submit"
              disabled={isProcessing || isSuccess}
              className={`w-full md:w-auto md:min-w-[280px] h-12 text-on-primary font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all ${
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
                  <span>Payer {amount ? `${Number(amount).toLocaleString('fr-FR')} FCFA` : 'maintenant'}</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5 text-on-surface-variant font-caption text-[12px] leading-[16px] font-medium text-center">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span>Paiement sécurisé et chiffré SSL 256-bit</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
