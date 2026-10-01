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

function WebhookStatusBadge({ status }: { status: string }) {
  const s = (status || "").toUpperCase();
  if (s === "PROCESSED") {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
        style={{ background: 'rgba(107,255,143,0.15)', color: '#005321', border: '1px solid rgba(0,110,47,0.15)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#006e2f' }} />
        Traité
      </span>
    );
  }
  if (s === "RECEIVED") {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
        style={{ background: 'rgba(255,221,184,0.4)', color: '#653e00', border: '1px solid rgba(121,75,0,0.15)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#794b00' }} />
        Reçu
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
      style={{ background: 'rgba(255,218,214,0.5)', color: '#93000a', border: '1px solid rgba(186,26,26,0.15)' }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#ba1a1a' }} />
      Échec
    </span>
  );
}

function EventTag({ event }: { event: string }) {
  const isFailed = event.includes("failed");
  return (
    <span
      className="inline-block font-mono text-[11.5px] font-semibold px-2 py-0.5 rounded-lg"
      style={isFailed ? {
        background: 'rgba(255,218,214,0.5)',
        color: '#93000a',
      } : {
        background: 'rgba(233,237,255,0.8)',
        color: '#141b2b',
      }}
    >
      {event}
    </span>
  );
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

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

  const handleSelectWebhook = (wh: WebhookItem) => {
    setSelectedWebhook(wh);
    setMobileShowDetail(true);
  };

  return (
    <div className="flex flex-col w-full max-w-[1200px] mx-auto gap-6 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] md:text-[24px] font-bold text-on-surface tracking-tight">Journal Webhooks</h1>
          <p className="text-[13.5px] text-on-surface-variant">Événements reçus et traités par Payflow en temps réel.</p>
        </div>

        <button
          onClick={() => fetchWebhooks(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold transition-all hover:shadow-sm active:scale-[0.98] disabled:opacity-50 flex-shrink-0 self-start sm:self-auto"
          style={{
            background: '#ffffff',
            border: '1.5px solid rgba(201,196,217,0.5)',
            boxShadow: '0 1px 2px rgba(20,27,43,0.04)',
            color: '#141b2b',
          }}
          type="button"
        >
          <span className={`material-symbols-outlined ${refreshing ? "animate-spin" : ""}`} style={{ fontSize: '17px' }}>
            sync
          </span>
          <span>Actualiser</span>
        </button>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex flex-col gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-[54px] w-full" style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {error && !loading && (
        <div
          className="p-8 flex flex-col items-center gap-3 rounded-2xl text-center"
          style={{ background: 'rgba(255,218,214,0.3)', border: '1px solid rgba(186,26,26,0.15)' }}
        >
          <div className="w-10 h-10 rounded-full bg-error-container/60 flex items-center justify-center">
            <span className="material-symbols-outlined text-error" style={{ fontSize: '20px' }}>error</span>
          </div>
          <p className="text-[13.5px] font-medium text-error">Erreur lors de la récupération du journal.</p>
          <button
            onClick={() => fetchWebhooks(false)}
            className="px-4 py-2 bg-white text-on-surface text-[13px] font-medium rounded-xl border border-outline-variant/40 hover:shadow-sm transition-all"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* ── Master-Detail ── */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

          {/* List Panel */}
          <div
            className={`lg:col-span-7 bg-white rounded-2xl overflow-hidden flex flex-col ${mobileShowDetail ? 'hidden lg:flex' : 'flex'}`}
            style={{
              boxShadow: '0 1px 3px rgba(20,27,43,0.06)',
              border: '1px solid rgba(201,196,217,0.3)',
            }}
          >
            {/* Panel header */}
            <div
              className="flex items-center justify-between px-5 py-3.5"
              style={{ background: 'rgba(244,245,251,0.8)', borderBottom: '1px solid rgba(201,196,217,0.25)' }}
            >
              <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                Événements récents
              </span>
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(84,39,230,0.08)', color: '#5427e6' }}
              >
                {webhooks.length}
              </span>
            </div>

            {webhooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-14 text-center">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(233,237,255,0.8)' }}
                >
                  <span className="material-symbols-outlined text-on-surface-variant/50" style={{ fontSize: '22px' }}>webhook</span>
                </div>
                <p className="text-[14px] font-semibold text-on-surface mb-1">Aucun webhook enregistré</p>
                <p className="text-[12.5px] text-on-surface-variant max-w-[260px]">
                  Les notifications de paiement Paystack apparaîtront ici.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left" id="webhooks-table">
                  <thead>
                    <tr style={{ background: 'rgba(244,245,251,0.5)', borderBottom: '1px solid rgba(201,196,217,0.2)' }}>
                      <th className="py-3 px-5 text-[10.5px] font-semibold uppercase tracking-widest text-on-surface-variant/60" scope="col">Événement</th>
                      <th className="py-3 px-5 text-[10.5px] font-semibold uppercase tracking-widest text-on-surface-variant/60" scope="col">Référence</th>
                      <th className="py-3 px-5 text-[10.5px] font-semibold uppercase tracking-widest text-on-surface-variant/60" scope="col">Statut</th>
                      <th className="py-3 px-5 text-[10.5px] font-semibold uppercase tracking-widest text-on-surface-variant/60 text-right" scope="col">Date</th>
                    </tr>
                  </thead>
                  <tbody>
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
                          onClick={() => handleSelectWebhook(wh)}
                          className="cursor-pointer transition-colors"
                          style={{
                            background: isSelected ? 'rgba(84,39,230,0.05)' : undefined,
                            borderBottom: '1px solid rgba(233,237,255,0.8)',
                            borderLeft: isSelected ? '3px solid #5427e6' : '3px solid transparent',
                          }}
                        >
                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <EventTag event={wh.event} />
                          </td>
                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <span className="font-mono text-[12px] font-semibold text-on-surface select-all">
                              {wh.reference || "—"}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <WebhookStatusBadge status={wh.processingStatus} />
                          </td>
                          <td className="py-3.5 px-5 whitespace-nowrap text-right">
                            <span className="text-[12px] text-on-surface-variant">{dateFormatted}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div
            className={`lg:col-span-5 bg-white rounded-2xl flex flex-col ${mobileShowDetail ? 'flex' : 'hidden lg:flex'}`}
            style={{
              boxShadow: '0 1px 3px rgba(20,27,43,0.06)',
              border: '1px solid rgba(201,196,217,0.3)',
            }}
          >
            {selectedWebhook ? (
              <>
                {/* Detail header */}
                <div
                  className="flex items-center justify-between px-5 py-3.5"
                  style={{ background: 'rgba(244,245,251,0.8)', borderBottom: '1px solid rgba(201,196,217,0.25)' }}
                >
                  <div className="flex items-center gap-2">
                    {/* Mobile back button */}
                    <button
                      className="lg:hidden -ml-1 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
                      onClick={() => setMobileShowDetail(false)}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                    </button>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                      Détail de l&apos;événement
                    </span>
                  </div>
                  <WebhookStatusBadge status={selectedWebhook.processingStatus} />
                </div>

                <div className="flex flex-col gap-5 p-5">
                  {/* ID */}
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                    style={{ background: 'rgba(233,237,255,0.5)', border: '1px solid rgba(201,196,217,0.3)' }}
                  >
                    <span className="text-[10.5px] font-semibold text-on-surface-variant/60 uppercase tracking-wider">ID</span>
                    <span className="font-mono text-[11.5px] font-semibold text-on-surface truncate select-all">
                      {selectedWebhook.id}
                    </span>
                  </div>

                  {/* Metadata rows */}
                  <div className="flex flex-col gap-0">
                    {[
                      { label: 'Événement', value: <EventTag event={selectedWebhook.event} /> },
                      { label: 'Référence', value: <span className="font-mono text-[12.5px] font-semibold text-on-surface select-all">{selectedWebhook.reference || "—"}</span> },
                      { label: "Clé d'idempotence", value: <span className="font-mono text-[11px] text-on-surface-variant truncate max-w-[200px]" title={selectedWebhook.idempotencyKey}>{selectedWebhook.idempotencyKey || "—"}</span> },
                      {
                        label: 'Réception',
                        value: <span className="font-mono text-[12px] text-on-surface-variant">
                          {new Date(selectedWebhook.createdAt).toLocaleString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                      },
                    ].map(({ label, value }, idx, arr) => (
                      <div
                        key={label}
                        className="flex items-center justify-between py-3"
                        style={{ borderBottom: idx < arr.length - 1 ? '1px solid rgba(233,237,255,0.8)' : undefined }}
                      >
                        <span className="text-[12px] font-semibold text-on-surface-variant">{label}</span>
                        <div className="ml-3">{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* JSON Payload */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold text-on-surface">Payload JSON</span>
                      <button
                        onClick={handleCopyJson}
                        className="inline-flex items-center gap-1.5 text-[11.5px] font-medium transition-colors"
                        style={{ color: copied ? '#006e2f' : '#5427e6' }}
                        type="button"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                          {copied ? "check_circle" : "content_copy"}
                        </span>
                        <span>{copied ? "Copié !" : "Copier"}</span>
                      </button>
                    </div>
                    <div
                      className="rounded-xl p-4 overflow-x-auto max-h-[280px] overflow-y-auto"
                      style={{ background: 'rgba(20,27,43,0.03)', border: '1px solid rgba(201,196,217,0.3)' }}
                    >
                      <pre className="font-mono text-[11px] text-on-surface leading-relaxed whitespace-pre select-all">
                        {JSON.stringify(selectedWebhook, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-14 text-center">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(233,237,255,0.8)' }}
                >
                  <span className="material-symbols-outlined text-on-surface-variant/50" style={{ fontSize: '22px' }}>info</span>
                </div>
                <p className="text-[13.5px] font-semibold text-on-surface mb-1">Aucun événement sélectionné</p>
                <p className="text-[12.5px] text-on-surface-variant">Cliquez sur un événement pour voir ses détails.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}