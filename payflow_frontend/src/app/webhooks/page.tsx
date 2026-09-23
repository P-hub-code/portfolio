"use client";

import { useState } from "react";
import { webhooks } from "@/data/webhooks";

export default function WebhooksPage() {
  const [selectedWebhookId, setSelectedWebhookId] = useState(webhooks[0].id);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const selectedWebhook = webhooks.find((w) => w.id === selectedWebhookId) || webhooks[0];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedWebhook.payload, null, 2)).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col w-full">
      {/* ============================================================ */}
      {/* MOBILE LAYOUT (hidden on lg) */}
      {/* ============================================================ */}
      <div className="lg:hidden flex flex-col w-full px-4 py-4 gap-4">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <h1 className="font-headline-md text-[20px] leading-[28px] tracking-[-0.015em] font-semibold text-on-surface">Journal Webhooks</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-caption text-[11px] leading-[14px] tracking-[0.02em] font-semibold">
                Mode Test
              </span>
            </div>
            <button 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface font-body-secondary text-[13px] leading-[18px] hover:bg-surface-variant transition-colors active:scale-95 shadow-sm"
              onClick={handleRefresh}
            >
              <span className={`material-symbols-outlined text-[16px] text-on-surface-variant ${isRefreshing ? 'animate-spin' : ''}`}>refresh</span>
              <span>Actualiser</span>
            </button>
          </div>
          <p className="font-body-secondary text-[13px] leading-[18px] text-on-surface-variant">
            Événements reçus et traités par Payflow.
          </p>
        </div>

        {/* Events Feed List */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="font-label-default text-[12px] leading-[16px] tracking-[0.01em] text-on-surface-variant uppercase tracking-wider font-semibold">
              Événements récents
            </span>
            <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-outline">
              {webhooks.length} répertoriés
            </span>
          </div>

          {webhooks.map((webhook) => {
            const isActive = webhook.id === selectedWebhookId;
            return (
              <div
                key={webhook.id}
                onClick={() => setSelectedWebhookId(webhook.id)}
                className={`flex flex-col p-4 rounded-xl shadow-sm transition-all cursor-pointer relative overflow-hidden ${
                  isActive ? "bg-surface-container-lowest" : "bg-surface-container-low hover:bg-surface-container-lowest"
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                <div className="flex items-center justify-between mb-1.5 pl-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-label-code text-[12px] leading-[16px] tracking-[0.02em] ${
                        webhook.event === "charge.failed"
                          ? "bg-error-container text-error"
                          : isActive 
                            ? "bg-surface-container-high text-primary font-medium" 
                            : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {webhook.event}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        webhook.status === "PROCESSED" ? "bg-secondary" : "bg-tertiary-container"
                      }`}
                    ></span>
                    <span
                      className={`font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium ${
                        webhook.status === "PROCESSED" ? "text-secondary" : "text-tertiary"
                      }`}
                    >
                      {webhook.status === "PROCESSED" ? "Traité" : "Reçu"}
                    </span>
                  </div>
                  <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant">
                    {webhook.date}
                  </span>
                </div>
                <div className="flex items-center justify-between pl-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-outline">receipt_long</span>
                    <span className={`font-body-default text-[14px] leading-[20px] tracking-[-0.005em] text-on-surface ${isActive ? 'tracking-tight font-medium' : ''}`}>
                      {webhook.reference}
                    </span>
                  </div>
                  {isActive ? (
                    <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] text-primary font-medium">Actif</span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Card & JSON Payload */}
        <div className="flex flex-col rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden mt-1">
          {/* Detail Header */}
          <div className="flex items-center justify-between p-4 bg-surface-container-low/60">
            <div className="flex flex-col">
              <span className="font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-semibold text-on-surface">Détail de l'événement</span>
              <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-outline mt-0.5">
                ID: {selectedWebhook.id}
              </span>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-caption text-[11px] leading-[14px] tracking-[0.02em] font-semibold ${
                selectedWebhook.status === "PROCESSED"
                  ? "bg-secondary-container/40 text-on-secondary-container"
                  : "bg-tertiary-container/40 text-on-tertiary-container"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  selectedWebhook.status === "PROCESSED" ? "bg-secondary" : "bg-tertiary"
                }`}
              ></span>
              {selectedWebhook.status}
            </span>
          </div>

          {/* Detail Meta Rows */}
          <div className="flex flex-col p-4 gap-3 bg-surface-container-lowest">
            <div className="flex items-center justify-between">
              <span className="font-body-secondary text-[13px] leading-[18px] text-on-surface-variant">Event</span>
              <span className={`px-2 py-0.5 rounded font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-medium ${selectedWebhook.event === 'charge.failed' ? 'bg-error-container/60 text-error' : 'bg-surface-container-high text-primary'}`}>
                {selectedWebhook.event}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-body-secondary text-[13px] leading-[18px] text-on-surface-variant">Référence</span>
              <span className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium text-on-surface">{selectedWebhook.reference}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-body-secondary text-[13px] leading-[18px] text-on-surface-variant">Signature webhook</span>
              <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] text-on-surface-variant bg-surface-container-low px-1.5 py-0.5 rounded">
                {selectedWebhook.signature}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-body-secondary text-[13px] leading-[18px] text-on-surface-variant">Réception</span>
              <span className="font-body-secondary text-[13px] leading-[18px] text-on-surface text-right">
                {selectedWebhook.date} • {selectedWebhook.time}
              </span>
            </div>
          </div>

          {/* Payload JSON Block */}
          <div className="flex flex-col p-4 pt-2 bg-surface-container-lowest">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-semibold text-on-surface">Payload JSON</span>
              <button
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors active:scale-95"
                onClick={handleCopy}
              >
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
                  {isCopied ? "check" : "content_copy"}
                </span>
                <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium">{isCopied ? "Copié !" : "Copier"}</span>
              </button>
            </div>
            <div className="relative w-full rounded-lg bg-surface-container-low p-3 overflow-x-auto shadow-inner">
              <pre className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] text-on-surface leading-relaxed select-all whitespace-pre m-0">
                {JSON.stringify(selectedWebhook.payload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DESKTOP LAYOUT (hidden on mobile) */}
      {/* ============================================================ */}
      <div className="hidden lg:flex flex-col w-full">
        <div className="flex flex-col gap-8 px-[32px] py-[32px]">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h1 className="font-headline-lg text-[24px] leading-[32px] tracking-[-0.02em] font-semibold text-on-surface">Journal Webhooks</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium bg-surface-container text-on-surface-variant">
                  <span className="h-1.5 w-1.5 rounded-full bg-tertiary-container"></span>Mode Test
                </span>
              </div>
              <p className="font-body-default text-[14px] leading-[20px] tracking-[-0.005em] text-on-surface-variant">
                Événements reçus et traités par Payflow en temps réel.
              </p>
            </div>
            {/* Action Quick Filter & Refresh */}
            <div className="flex items-center gap-2">
              <button 
                className="inline-flex items-center gap-1 px-4 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium shadow-sm transition-all duration-150"
                onClick={handleRefresh}
              >
                <span className={`material-symbols-outlined text-[18px] ${isRefreshing ? 'animate-spin' : ''}`}>sync</span>
                <span>Actualiser</span>
              </button>
            </div>
          </div>

          {/* Master-Detail Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Main List Table Area */}
            <div className="lg:col-span-7 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-surface-container-low flex items-center justify-between">
                <span className="font-label-default text-[12px] leading-[16px] tracking-[0.01em] uppercase tracking-wider text-on-surface-variant font-medium">Événements récents</span>
                <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant font-mono">{webhooks.length} entrées répertoriées</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant font-label-default text-[12px] leading-[16px] tracking-[0.01em] uppercase tracking-wider">
                      <th className="py-3 px-4 font-medium" scope="col">Événement</th>
                      <th className="py-3 px-4 font-medium" scope="col">Référence</th>
                      <th className="py-3 px-4 font-medium" scope="col">Statut</th>
                      <th className="py-3 px-4 font-medium text-right" scope="col">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high/60">
                    {webhooks.map((webhook) => {
                      const isActive = webhook.id === selectedWebhookId;
                      return (
                        <tr
                          key={webhook.id}
                          onClick={() => setSelectedWebhookId(webhook.id)}
                          className={`cursor-pointer transition-colors duration-150 ${
                            isActive ? "bg-primary-fixed/25" : "hover:bg-surface-container-low"
                          }`}
                        >
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-semibold px-2 py-0.5 rounded ${
                                webhook.event === "charge.failed"
                                  ? "bg-error-container/60 text-error"
                                  : "bg-surface-container text-on-surface"
                              }`}
                            >
                              {webhook.event}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium text-on-surface font-mono">
                              {webhook.reference}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium ${
                                webhook.status === "PROCESSED"
                                  ? "bg-secondary-fixed/30 text-secondary"
                                  : "bg-tertiary-fixed/30 text-tertiary"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  webhook.status === "PROCESSED" ? "bg-secondary" : "bg-tertiary"
                                }`}
                              ></span>
                              {webhook.status === "PROCESSED" ? "Traité" : "Reçu"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-right font-body-secondary text-[13px] leading-[18px] text-on-surface-variant">
                            {webhook.date}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detail Area */}
            <div className="lg:col-span-5 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm p-6 gap-4">
              {/* Panel Header */}
              <div className="flex items-start justify-between pb-2 border-b border-surface-container-high/60">
                <div className="flex flex-col gap-0.5">
                  <h2 className="font-headline-sm text-[16px] leading-[24px] tracking-[-0.01em] font-semibold text-on-surface">Détail de l'événement</h2>
                  <span className="font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-on-surface-variant font-mono">
                    ID: {selectedWebhook.id}
                  </span>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium ${
                      selectedWebhook.status === "PROCESSED"
                        ? "bg-secondary-fixed/30 text-secondary"
                        : "bg-tertiary-fixed/30 text-tertiary"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        selectedWebhook.status === "PROCESSED" ? "bg-secondary" : "bg-tertiary"
                      }`}
                    ></span>
                    {selectedWebhook.status}
                  </span>
                </div>
              </div>

              {/* Technical Metadata Grid */}
              <div className="flex flex-col gap-2 py-1 text-[14px] leading-[20px] tracking-[-0.005em]">
                <div className="flex items-center justify-between py-1.5 border-b border-surface-container-high/40">
                  <span className="font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium text-on-surface-variant">Event</span>
                  <span className={`font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-semibold px-2 py-0.5 rounded ${selectedWebhook.event === 'charge.failed' ? 'bg-error-container/60 text-error' : 'bg-surface-container text-on-surface'}`}>
                    {selectedWebhook.event}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-surface-container-high/40">
                  <span className="font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium text-on-surface-variant">Référence</span>
                  <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-mono text-on-surface">{selectedWebhook.reference}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-surface-container-high/40">
                  <span className="font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium text-on-surface-variant">Signature webhook</span>
                  <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] font-mono text-on-surface-variant">{selectedWebhook.signature}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-surface-container-high/40">
                  <span className="font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium text-on-surface-variant">Réception</span>
                  <span className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] text-on-surface-variant">
                    {selectedWebhook.date} • {selectedWebhook.time}
                  </span>
                </div>
              </div>

              {/* Payload JSON Container */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-default text-[12px] leading-[16px] tracking-[0.01em] font-medium text-on-surface">Payload JSON</span>
                  <button
                    className="inline-flex items-center gap-1 font-caption text-[11px] leading-[14px] tracking-[0.02em] font-medium text-primary hover:text-primary-container transition-colors"
                    onClick={handleCopy}
                  >
                    <span className="material-symbols-outlined text-[14px]">{isCopied ? "check" : "content_copy"}</span>
                    <span>{isCopied ? "Copié !" : "Copier"}</span>
                  </button>
                </div>
                <div className="bg-surface-container-low rounded-lg p-4 overflow-x-auto shadow-inner">
                  <pre className="font-label-code text-[12px] leading-[16px] tracking-[0.02em] text-on-surface font-mono leading-relaxed whitespace-pre select-all">
                    {JSON.stringify(selectedWebhook.payload, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
