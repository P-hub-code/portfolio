"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchWebhooks = async () => {
      try {
        const { apiFetch } = await import('@/lib/api');
        const data = await apiFetch('/webhooks');
        setWebhooks(data);
      } catch (err) { console.error(err); setError(true); } finally { setLoading(false); }
    };
    fetchWebhooks();
  }, []);
  if (loading) return <div className="p-8 text-center text-on-surface-variant">Chargement des webhooks...</div>;
  if (error) return <div className="p-8 text-center text-error">Erreur lors du chargement des webhooks.</div>;
  return (
    <div className="flex flex-col w-full h-full min-h-[calc(100vh-64px)]">
      <div className="flex flex-col md:flex-row w-full h-full max-w-[1376px] mx-auto">
        <div className="w-full md:w-[320px] lg:w-[400px] flex flex-col border-r border-surface-container-high/40 bg-surface-container-lowest min-h-full">
          <div className="p-4 border-b border-surface-container-high/40 bg-surface-container-lowest sticky top-0 z-10">
            <h1 className="font-headline-sm text-[20px] leading-[28px] tracking-[-0.01em] font-semibold text-on-surface tracking-tight mb-1">Journal Webhooks</h1>
            <p className="font-body-default text-[13px] leading-[18px] tracking-[-0.005em] font-normal text-on-surface-variant">Événements reçus de Paystack</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {webhooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[32px] opacity-50 mb-2">inbox</span>
                <p className="font-body-medium text-[14px] leading-[20px] tracking-[-0.005em] font-medium text-on-surface">Aucun webhook</p>
                <p className="font-body-default text-[12px] leading-[16px] tracking-[-0.005em] mt-1">Les événements apparaîtront ici.</p>
              </div>
            ) : (
              <ul className="divide-y divide-surface-container-high/40">
                {webhooks.map((wh) => (
                  <li key={wh.id} className="p-4 hover:bg-surface-container-low/40"><div>{wh.event}</div></li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}