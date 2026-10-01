"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/StatCard";
import { RecentActivity } from "@/components/RecentActivity";

// Statuts bruts retournés par l'API backend (NestJS/Paystack)
// SUCCESS = transaction confirmée, FAILED = transaction échouée
// On compare en majuscules pour correspondre à la casse réelle de l'API
const STATUS_SUCCESS = "SUCCESS";
const STATUS_FAILED = "FAILED";

interface DashboardStats {
  totalAmount: number;
  totalCount: number;
  successCount: number;
  failedCount: number;
}

type ErrorKind = "network" | "http" | "parse" | null;

interface DashboardError {
  kind: ErrorKind;
  message: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<DashboardError | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        // Import dynamique identique à /transactions pour que le fetch
        // s'exécute côté navigateur (Client Component) et non côté serveur
        const { apiFetch } = await import("@/lib/api");

        let data: any[];
        try {
          data = await apiFetch("/transactions");
        } catch (fetchErr: any) {
          // Distingue erreur réseau (ECONNREFUSED, NetworkError) vs erreur HTTP
          const msg: string = fetchErr?.message || "";
          const isNetwork =
            msg.toLowerCase().includes("failed to fetch") ||
            msg.toLowerCase().includes("networkerror") ||
            msg.toLowerCase().includes("econnrefused") ||
            msg.toLowerCase().includes("load failed");

          setError({
            kind: isNetwork ? "network" : "http",
            message: isNetwork
              ? "Backend inaccessible — vérifiez que le serveur NestJS est démarré sur le port 3001."
              : `Erreur API (${msg})`,
          });
          setLoading(false);
          return;
        }

        if (!Array.isArray(data)) {
          setError({
            kind: "parse",
            message: `Réponse inattendue du serveur : type "${typeof data}" reçu au lieu d'un tableau.`,
          });
          setLoading(false);
          return;
        }

        // Calcul des statistiques à partir des statuts BRUTS de l'API
        // (pas de normalisation fr-FR ici, on compare les valeurs telles que reçues)
        const successData = data.filter(
          (tx) => (tx.status || "").toUpperCase() === STATUS_SUCCESS
        );
        const failedData = data.filter(
          (tx) => (tx.status || "").toUpperCase() === STATUS_FAILED
        );

        const totalAmount = successData.reduce(
          (sum, tx) => sum + Number(tx.amount || 0),
          0
        );

        setStats({
          totalAmount,
          totalCount: data.length,
          successCount: successData.length,
          failedCount: failedData.length,
        });

        // 5 transactions les plus récentes pour RecentActivity
        // Mêmes champs que /transactions — statut passé brut au StatusBadge
        setRecentTransactions(
          data.slice(0, 5).map((tx: any) => ({
            id: tx.id,
            reference: tx.internalRef,
            customer:
              tx.customerName ||
              (tx.order && tx.order.customerName) ||
              "Client inconnu",
            amount: Number(tx.amount || 0),
            currency: tx.currency || "XOF",
            status: tx.status || "PENDING",
            date: new Date(tx.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          }))
        );
      } catch (unexpectedErr: any) {
        setError({
          kind: "parse",
          message: `Erreur inattendue : ${unexpectedErr?.message || String(unexpectedErr)}`,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ── Stat cards config (calculées depuis données réelles) ──
  const statCards = stats
    ? [
        {
          label: "Encaissé",
          value: `${stats.totalAmount.toLocaleString("fr-FR")} FCFA`,
          icon: "payments",
          accent: "default" as const,
        },
        {
          label: "Transactions",
          value: stats.totalCount,
          icon: "receipt_long",
          accent: "default" as const,
        },
        {
          label: "Confirmées",
          value: stats.successCount,
          icon: "check_circle",
          accent: "success" as const,
        },
        {
          label: "Échouées",
          value: stats.failedCount,
          icon: "cancel",
          accent: "error" as const,
        },
      ]
    : [
        { label: "Encaissé", value: "—", icon: "payments", accent: "default" as const },
        { label: "Transactions", value: "—", icon: "receipt_long", accent: "default" as const },
        { label: "Confirmées", value: "—", icon: "check_circle", accent: "success" as const },
        { label: "Échouées", value: "—", icon: "cancel", accent: "error" as const },
      ];

  return (
    <div className="flex flex-col w-full max-w-[1200px] mx-auto gap-6 md:gap-8 animate-fade-in">

      {/* ── Page Header ── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] md:text-[24px] font-bold text-on-surface tracking-tight">
          Bonjour, Admin 👋
        </h1>
        <p className="text-[13.5px] text-on-surface-variant">
          Voici un aperçu de votre activité Payflow aujourd&apos;hui.
        </p>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 stagger">
        {loading
          ? // Skeleton loaders pendant le chargement
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="skeleton h-[100px] w-full rounded-2xl"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))
          : statCards.map((stat, index) => (
              <StatCard
                key={index}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                accent={stat.accent}
              />
            ))}
      </div>

      {/* ── Error State ── */}
      {error && !loading && (
        <div
          className="p-6 rounded-2xl flex flex-col gap-4"
          style={{
            background: "rgba(255,218,214,0.3)",
            border: "1px solid rgba(186,26,26,0.15)",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(186,26,26,0.1)" }}
            >
              <span
                className="material-symbols-outlined text-error"
                style={{ fontSize: "18px" }}
              >
                {error.kind === "network" ? "cloud_off" : "error"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-bold text-error">
                {error.kind === "network"
                  ? "Backend inaccessible"
                  : error.kind === "http"
                  ? "Erreur de l'API"
                  : "Erreur de données"}
              </span>
              <span className="text-[12.5px] text-on-error-container">
                {error.message}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setError(null);
              setStats(null);
              setLoading(true);
              // re-mount effect via state trick
              setRecentTransactions([]);
              // call fetch manually
              const refetch = async () => {
                try {
                  const { apiFetch } = await import("@/lib/api");
                  const data = await apiFetch("/transactions");
                  if (!Array.isArray(data)) throw new Error("parse");
                  const successData = data.filter(
                    (tx) => (tx.status || "").toUpperCase() === STATUS_SUCCESS
                  );
                  const failedData = data.filter(
                    (tx) => (tx.status || "").toUpperCase() === STATUS_FAILED
                  );
                  setStats({
                    totalAmount: successData.reduce(
                      (s, tx) => s + Number(tx.amount || 0),
                      0
                    ),
                    totalCount: data.length,
                    successCount: successData.length,
                    failedCount: failedData.length,
                  });
                  setRecentTransactions(
                    data.slice(0, 5).map((tx: any) => ({
                      id: tx.id,
                      reference: tx.internalRef,
                      customer:
                        tx.customerName ||
                        (tx.order && tx.order.customerName) ||
                        "Client inconnu",
                      amount: Number(tx.amount || 0),
                      currency: tx.currency || "XOF",
                      status: tx.status || "PENDING",
                      date: new Date(tx.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }),
                    }))
                  );
                  setError(null);
                } catch (e: any) {
                  const msg: string = e?.message || "";
                  const isNetwork =
                    msg.toLowerCase().includes("failed to fetch") ||
                    msg.toLowerCase().includes("networkerror") ||
                    msg.toLowerCase().includes("econnrefused");
                  setError({
                    kind: isNetwork ? "network" : "http",
                    message: isNetwork
                      ? "Backend inaccessible — vérifiez que le serveur NestJS est démarré sur le port 3001."
                      : `Erreur API (${msg})`,
                  });
                } finally {
                  setLoading(false);
                }
              };
              refetch();
            }}
            className="self-start inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold transition-all hover:shadow-sm"
            style={{
              background: "rgba(255,255,255,0.7)",
              color: "#ba1a1a",
              border: "1px solid rgba(186,26,26,0.2)",
            }}
            type="button"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "15px" }}
            >
              refresh
            </span>
            Réessayer
          </button>
        </div>
      )}

      {/* ── Recent Activity ── */}
      {!error && (
        <RecentActivity transactions={recentTransactions} />
      )}
    </div>
  );
}
