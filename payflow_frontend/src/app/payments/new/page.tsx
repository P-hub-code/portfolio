"use client";

import { useState } from "react";

function FormField({
  id,
  label,
  required = false,
  children,
  hint,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-center gap-1 text-[12px] font-semibold text-on-surface-variant">
        {label}
        {required && <span className="text-error text-[11px]">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-on-surface-variant/70">{hint}</p>}
    </div>
  );
}

const inputClass = `
  w-full h-10 px-3.5 bg-white text-on-surface text-[13.5px] rounded-xl outline-none
  transition-all focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/40
`.trim().replace(/\s+/g, ' ');

const inputStyle = {
  border: '1.5px solid rgba(201,196,217,0.6)',
  boxShadow: '0 1px 2px rgba(20,27,43,0.04)',
};

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
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'initialisation du paiement");
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

  const formattedAmount = amount ? `${Number(amount).toLocaleString('fr-FR')} FCFA` : null;

  return (
    <div className="flex flex-col w-full max-w-[680px] mx-auto gap-6 pb-12 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] md:text-[24px] font-bold text-on-surface tracking-tight">Nouvelle commande</h1>
        <p className="text-[13.5px] text-on-surface-variant">Renseignez les informations du client et de la commande.</p>
      </div>

      {/* ── Form Card ── */}
      <form onSubmit={handlePay}>
        <div className="flex flex-col gap-1">

          {/* Error Banner */}
          {error && (
            <div
              className="flex items-start gap-3 p-4 rounded-2xl mb-4 animate-fade-in"
              style={{ background: 'rgba(255,218,214,0.4)', border: '1px solid rgba(186,26,26,0.2)' }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(186,26,26,0.1)' }}>
                <span className="material-symbols-outlined text-error" style={{ fontSize: '17px' }}>error</span>
              </div>
              <div className="flex flex-col gap-0.5 pt-0.5">
                <span className="text-[12.5px] font-semibold text-error">Erreur de validation</span>
                <span className="text-[12.5px] text-on-error-container">{error}</span>
              </div>
            </div>
          )}

          {/* Section 1: Client */}
          <div
            className="bg-white rounded-2xl p-6 flex flex-col gap-5"
            style={{
              boxShadow: '0 1px 3px rgba(20,27,43,0.06)',
              border: '1px solid rgba(201,196,217,0.3)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #5427e6 0%, #6d4aff 100%)' }}
              >
                <span className="material-symbols-outlined text-white" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>person</span>
              </div>
              <h2 className="text-[14px] font-bold text-on-surface">Informations client</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField id="name" label="Nom complet" required>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Jean Kouassi"
                  className={inputClass}
                  style={inputStyle}
                />
              </FormField>

              <FormField id="email" label="Adresse email" required>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@exemple.com"
                  className={inputClass}
                  style={inputStyle}
                />
              </FormField>

              <FormField
                id="phone"
                label="Téléphone"
                required
                hint="Format: +225 0700000000"
              >
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+225 0700000000"
                  className={inputClass + " font-mono"}
                  style={inputStyle}
                />
              </FormField>
            </div>
          </div>

          {/* Section 2: Commande */}
          <div
            className="bg-white rounded-2xl p-6 flex flex-col gap-5 mt-3"
            style={{
              boxShadow: '0 1px 3px rgba(20,27,43,0.06)',
              border: '1px solid rgba(201,196,217,0.3)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #5427e6 0%, #6d4aff 100%)' }}
              >
                <span className="material-symbols-outlined text-white" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
              </div>
              <h2 className="text-[14px] font-bold text-on-surface">Détails de la commande</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <FormField id="description" label="Description" required>
                  <input
                    id="description"
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Commande #001 - Chaussures de sport"
                    className={inputClass}
                    style={inputStyle}
                  />
                </FormField>
              </div>

              <FormField id="amount" label="Montant (FCFA)" required>
                <div className="relative">
                  <input
                    id="amount"
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                    placeholder="5 000"
                    className={inputClass + " tabular-nums pr-14"}
                    style={inputStyle}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11.5px] font-semibold text-on-surface-variant/50 pointer-events-none">
                    FCFA
                  </span>
                </div>
              </FormField>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div
            className="bg-white rounded-2xl p-6 flex flex-col gap-5 mt-3"
            style={{
              boxShadow: '0 1px 3px rgba(20,27,43,0.06)',
              border: '1px solid rgba(201,196,217,0.3)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #5427e6 0%, #6d4aff 100%)' }}
              >
                <span className="material-symbols-outlined text-white" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>wallet</span>
              </div>
              <h2 className="text-[14px] font-bold text-on-surface">Moyen de paiement</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className="flex items-center justify-between p-4 rounded-2xl text-left transition-all"
                style={paymentMethod === "card" ? {
                  background: 'rgba(84,39,230,0.06)',
                  border: '2px solid #5427e6',
                } : {
                  background: 'rgba(244,245,251,0.6)',
                  border: '1.5px solid rgba(201,196,217,0.4)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={paymentMethod === "card"
                      ? { background: 'linear-gradient(135deg, #5427e6 0%, #6d4aff 100%)' }
                      : { background: 'rgba(233,237,255,0.8)' }
                    }
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: '20px',
                        color: paymentMethod === "card" ? '#fff' : '#484556',
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >credit_card</span>
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-[13.5px] font-bold ${paymentMethod === "card" ? "text-primary" : "text-on-surface"}`}>
                      Carte bancaire
                    </span>
                    <span className="text-[11.5px] text-on-surface-variant">Visa, Mastercard</span>
                  </div>
                </div>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={paymentMethod === "card"
                    ? { background: '#5427e6', border: '2px solid #5427e6' }
                    : { background: 'transparent', border: '1.5px solid rgba(201,196,217,0.7)' }
                  }
                >
                  {paymentMethod === "card" && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </button>

              {/* Mobile Money */}
              <button
                type="button"
                onClick={() => setPaymentMethod("mobile_money")}
                className="flex items-center justify-between p-4 rounded-2xl text-left transition-all"
                style={paymentMethod === "mobile_money" ? {
                  background: 'rgba(84,39,230,0.06)',
                  border: '2px solid #5427e6',
                } : {
                  background: 'rgba(244,245,251,0.6)',
                  border: '1.5px solid rgba(201,196,217,0.4)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={paymentMethod === "mobile_money"
                      ? { background: 'linear-gradient(135deg, #5427e6 0%, #6d4aff 100%)' }
                      : { background: 'rgba(233,237,255,0.8)' }
                    }
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: '20px',
                        color: paymentMethod === "mobile_money" ? '#fff' : '#484556',
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >smartphone</span>
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-[13.5px] font-bold ${paymentMethod === "mobile_money" ? "text-primary" : "text-on-surface"}`}>
                      Mobile Money
                    </span>
                    <span className="text-[11.5px] text-on-surface-variant">Orange, MTN, Moov, Wave</span>
                  </div>
                </div>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={paymentMethod === "mobile_money"
                    ? { background: '#5427e6', border: '2px solid #5427e6' }
                    : { background: 'transparent', border: '1.5px solid rgba(201,196,217,0.7)' }
                  }
                >
                  {paymentMethod === "mobile_money" && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* ── Submit Section ── */}
          <div className="mt-4 flex flex-col gap-3">
            {/* Order summary preview */}
            {formattedAmount && (
              <div
                className="flex items-center justify-between px-4 py-3 rounded-xl animate-fade-in"
                style={{ background: 'rgba(233,237,255,0.6)', border: '1px solid rgba(201,196,217,0.3)' }}
              >
                <span className="text-[12.5px] text-on-surface-variant">Total à régler</span>
                <span className="text-[15px] font-bold text-on-surface tabular-nums">{formattedAmount}</span>
              </div>
            )}

            <button
              id="pay-btn"
              type="submit"
              disabled={isProcessing || isSuccess}
              className="w-full h-12 rounded-2xl text-white text-[14px] font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: isSuccess
                  ? 'linear-gradient(135deg, #006e2f 0%, #00a346 100%)'
                  : 'linear-gradient(135deg, #5427e6 0%, #6d4aff 100%)',
              }}
            >
              {isProcessing ? (
                <>
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: '18px' }}>progress_activity</span>
                  <span>Traitement en cours...</span>
                </>
              ) : isSuccess ? (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span>Redirection vers Paystack...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>lock</span>
                  <span>
                    {formattedAmount ? `Payer ${formattedAmount}` : 'Payer maintenant'}
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-on-surface-variant/60">
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>lock</span>
              <span className="text-[11.5px]">Paiement sécurisé via Paystack · SSL 256-bit</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
