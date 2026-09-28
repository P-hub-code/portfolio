"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";

interface WebhookItem {
  id: string;
  event: string;
  reference: string | null;
  processingStatus: "RECEIVED" | "PROCESSED" | "FAILED" | string;
  idempotencyKey: string;
  createdAt: string;
  [key: string]: any;
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchWebhooks = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(false);

    try {
      const { apiFetch } = await import('@/lib/api');
      const data: WebhookItem[] = await apiFetch('/webhooks');
      setWebhooks(data || []);
      if (data && data.length > 0) {
        setSelectedWebhook((prev) => {
          if (prev) {
            const found = data.find((w) => w.id === prev.id);
            return found || data[0];
          }
          return data[0];
        });
      } else {
        setSelectedWebhook(null);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
      if (isManual) {
        setTimeout(() => setRefreshing(false), 500);
      }
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const handleCopyJson = () => {
    if (!selectedWebhook) return;
    navigator.clipboard.writeText(JSON.stringify(selectedWebhook, null, 2)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const getStatusBadge = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s === "PROCESSED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-label-default text-label-default bg-secondary-fixed/30 text-secondary">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
          Traité
        </span>
      );
    }
    if (s === "RECEIVED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-label-default text-label-default bg-tertiary-fixed/30 text-tertiary">
          <span className="h-1.5 w-1.5 rounded-full bg-tertiary"></span>
          Reçu
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-label-default text-label-default bg-error-container text-error">
        <span className="h-1.5 w-1.5 rounded-full bg-error"></span>
        Échec
      </span>
    );
  };

  const getEventTag = (event: string) => {
    const isFailed = event.includes("failed");
    return (
      <span
        className={`font-label-code text-label-code font-semibold px-2 py-0.5 rounded ${
          isFailed
            ? "bg-error-container/60 text-error"
            : "bg-surface-container text-on-surface"
        }`}
      >
        {event}
      </span>
    );
  };

  return (
    <div className="flex flex-col w-full max-w-[1376px] mx-auto pb-12">
      <div className="flex flex-col gap-space-lg">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold">Journal Webhooks</h1>
              <span className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded font-label-default text-label-default bg-surface-container text-on-surface-variant border border-outline-variant/30">
                <span className="h-1.5 w-1.5 rounded-full bg-tertiary-container"></span>
                Mode Test
              </span>
            </div>
            <p className="font-body-default text-body-default text-on-surface-variant">
              Événements reçus et traités par Payflow en temps réel.
            </p>
          </div>

          <div className="flex items-center gap-space-sm">
            <button
              onClick={() => fetchWebhooks(true)}
              disabled={loading || refreshing}
              className="inline-flex items-center gap-space-xs px-space-md py-2 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg font-body-medium text-body-medium shadow-sm transition-all duration-150 border border-outline-variant/30 disabled:opacity-50"
              type="button"
            >
              <span className={`material-symbols-outlined text-[18px] ${refreshing ? "animate-spin" : ""}`}>
                sync
              </span>
              <span>Actualiser</span>
            </button>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="flex flex-col items-center justify-center p-12 text-on-surface-variant bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30">
            <span className="material-symbols-outlined text-[32px] animate-spin text-primary mb-2">progress_activity</span>
            <p className="font-body-medium text-body-medium">Chargement des webhooks...</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-6 text-center text-error bg-error-container/40 rounded-xl border border-error/20 flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">error</span>
            <p className="font-body-medium">Erreur lors de la récupération du journal des webhooks.</p>
            <button
              onClick={() => fetchWebhooks(false)}
              className="px-3 py-1 bg-surface-container-lowest text-on-surface text-sm rounded shadow-sm border border-outline-variant/30 mt-2"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Master-Detail Layout */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Main List Table Area (7 cols on lg) */}
            <div className="lg:col-span-7 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
              <div className="px-space-md py-3 bg-surface-container-low flex items-center justify-between border-b border-surface-container-high/60">
                <span className="font-label-default text-label-default uppercase tracking-wider text-on-surface-variant font-medium">
                  Événements récents
                </span>
                <span className="font-caption text-caption text-on-surface-variant font-mono">
                  {webhooks.length} {webhooks.length <= 1 ? "entrée répertoriée" : "entrées répertoriées"}
                </span>
              </div>

              {webhooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[36px] opacity-40 mb-2">webhook</span>
                  <p className="font-body-medium text-body-medium text-on-surface font-medium">Aucun webhook enregistré</p>
                  <p className="font-caption text-caption text-on-surface-variant mt-1">
                    Les notifications de paiement envoyées par Paystack apparaîtront ici.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left" id="webhooks-table">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant font-label-default text-label-default uppercase tracking-wider border-b border-surface-container-high/40">
                        <th className="py-3 px-space-md font-medium" scope="col">Événement</th>
                        <th className="py-3 px-space-md font-medium" scope="col">Référence</th>
                        <th className="py-3 px-space-md font-medium" scope="col">Statut</th>
                        <th className="py-3 px-space-md font-medium text-right" scope="col">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-high/60">
                      {webhooks.map((wh) => {
                        const isSelected = selectedWebhook?.id === wh.id;
                        const dateFormatted = new Date(wh.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        });

                        return (
                          <tr
                            key={wh.id}
                            onClick={() => setSelectedWebhook(wh)}
                            className={`cursor-pointer transition-colors duration-150 ${
                              isSelected
                                ? "bg-primary-fixed/25"
                                : "hover:bg-surface-container-low"
                            }`}
                          >
                            <td className="py-3.5 px-space-md whitespace-nowrap">
                              {getEventTag(wh.event)}
                            </td>
                            <td className="py-3.5 px-space-md whitespace-nowrap">
                              <span className="font-body-medium text-body-medium text-on-surface font-mono select-all">
                                {wh.reference || "N/A"}
                              </span>
                            </td>
                            <td className="py-3.5 px-space-md whitespace-nowrap">
                              {getStatusBadge(wh.processingStatus)}
                            </td>
                            <td className="py-3.5 px-space-md whitespace-nowrap text-right font-body-secondary text-body-secondary text-on-surface-variant">
                              {dateFormatted}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Detail Area (5 cols on lg) */}
            <div className="lg:col-span-5 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-space-lg gap-space-md">
              {selectedWebhook ? (
                <>
                  {/* Panel Header */}
                  <div className="flex items-start justify-between pb-space-sm border-b border-surface-container-high/60">
                    <div className="flex flex-col gap-0.5">
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Détail de l'événement</h2>
                      <span className="font-caption text-caption text-on-surface-variant font-mono truncate max-w-[240px]">
                        ID: {selectedWebhook.id}
                      </span>
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-label-default text-label-default bg-secondary-fixed/30 text-secondary font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
                        {selectedWebhook.processingStatus}
                      </span>
                    </div>
                  </div>

                  {/* Technical Metadata Grid */}
                  <div className="flex flex-col gap-space-sm py-space-xs text-body-default">
                    <div className="flex items-center justify-between py-1.5 border-b border-surface-container-high/40">
                      <span className="font-label-default text-label-default text-on-surface-variant">Event</span>
                      {getEventTag(selectedWebhook.event)}
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-surface-container-high/40">
                      <span className="font-label-default text-label-default text-on-surface-variant">Référence</span>
                      <span className="font-label-code text-label-code font-mono text-on-surface select-all">
                        {selectedWebhook.reference || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-surface-container-high/40">
                      <span className="font-label-default text-label-default text-on-surface-variant">Clé d'idempotence</span>
                      <span className="font-label-code text-label-code font-mono text-on-surface-variant truncate max-w-[200px]" title={selectedWebhook.idempotencyKey}>
                        {selectedWebhook.idempotencyKey || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-surface-container-high/40">
                      <span className="font-label-default text-label-default text-on-surface-variant">Réception</span>
                      <span className="font-label-code text-label-code text-on-surface-variant font-mono text-right">
                        {new Date(selectedWebhook.createdAt).toLocaleString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Payload JSON Container */}
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-default text-label-default text-on-surface font-medium">Données réelles (JSON)</span>
                      <button
                        onClick={handleCopyJson}
                        className="inline-flex items-center gap-1 font-caption text-caption text-primary hover:text-primary-container transition-colors"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {copied ? "check" : "content_copy"}
                        </span>
                        <span>{copied ? "Copié !" : "Copier"}</span>
                      </button>
                    </div>
                    <div className="bg-surface-container-low rounded-lg p-space-md overflow-x-auto shadow-inner border border-outline-variant/20 max-h-[300px]">
                      <pre className="font-label-code text-label-code text-on-surface font-mono leading-relaxed whitespace-pre select-all text-xs">
                        {JSON.stringify(selectedWebhook, null, 2)}
                      </pre>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[28px] opacity-40 mb-1">info</span>
                  <p className="font-body-default text-body-default">Sélectionnez un événement pour afficher ses détails.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}