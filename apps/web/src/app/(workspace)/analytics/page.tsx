"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [orgId, setOrgId] = useState("");
  const [data, setData] = useState<{
    stages: { stage: string; _count: number | { _all: number } }[];
  } | null>(null);
  const [kpi, setKpi] = useState<{
    leads: number;
    deals: number;
    closedDeals: number;
    matchCount: number;
    conversionRate: number;
  } | null>(null);

  async function load() {
    if (!token || !orgId.trim()) return;
    const res = await apiFetch<{ stages: { stage: string; _count: number }[] }>(
      `/analytics/deals?organizationId=${encodeURIComponent(orgId)}`,
      { token },
    );
    setData(res);
  }

  useEffect(() => {
    if (!token) return;
    void apiFetch<{
      leads: number;
      deals: number;
      closedDeals: number;
      matchCount: number;
      conversionRate: number;
    }>("/analytics/broker/me", { token }).then(setKpi);
  }, [token]);

  if (!token)
    return (
      <p>
        <Link href="/login" className="text-teal-400">
          Log in
        </Link>
      </p>
    );

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-xl font-semibold">Deal funnel</h1>
      <p className="mt-1 text-sm text-zinc-500">Stage counts by organization (broker KPIs).</p>
      {kpi && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-5">
          {[
            ["Leads", kpi.leads],
            ["Deals", kpi.deals],
            ["Closed", kpi.closedDeals],
            ["Matches", kpi.matchCount],
            ["Conversion %", kpi.conversionRate],
          ].map(([k, v]) => (
            <div key={String(k)} className="rounded border border-zinc-800 bg-zinc-900/50 p-2">
              <p className="text-zinc-500">{k}</p>
              <p className="text-zinc-200">{String(v)}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
          placeholder="Organization ID"
          value={orgId}
          onChange={(e) => setOrgId(e.target.value)}
        />
        <button
          type="button"
          onClick={() => void load()}
          className="rounded bg-teal-600 px-4 py-2 text-sm text-white"
        >
          Load
        </button>
      </div>
      {data && (
        <ul className="mt-6 space-y-2 text-sm">
          {data.stages.map((s) => {
            const c = s._count;
            const n = typeof c === "number" ? c : c._all;
            return (
              <li key={s.stage} className="flex justify-between border-b border-zinc-800 py-2">
                <span>{s.stage}</span>
                <span className="text-zinc-400">{n}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
