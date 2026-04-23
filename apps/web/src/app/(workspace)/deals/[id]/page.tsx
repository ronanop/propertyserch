"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

type DealDetail = {
  id: string;
  stage: string;
  slaBreachCount: number;
  dealHealthScore: number | null;
  stageEnteredAt: string;
  institutionId: string | null;
  coBrokerInviteEmail: string | null;
  commissionSplitPct: number | null;
  requirement: { id: string; city: string };
  property: { id: string; title: string } | null;
};

type Doc = { id: string; type: string; storageKey: string; createdAt: string };
type Act = { id: string; action: string; createdAt: string; userId: string | null };
type Svc = { id: string; type: "legal" | "loan" | "insurance"; status: string; createdAt: string };

export default function DealDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { token } = useAuth();
  const router = useRouter();
  const [deal, setDeal] = useState<DealDetail | null | undefined>(undefined);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [activity, setActivity] = useState<Act[]>([]);
  const [services, setServices] = useState<Svc[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [coEmail, setCoEmail] = useState("");
  const [coPct, setCoPct] = useState("");
  const [fraud, setFraud] = useState<string | null>(null);
  const [dd, setDd] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    apiFetch<DealDetail>(`/deals/${id}`, { token })
      .then((d) => {
        setDeal(d);
        if (d) {
          setCoEmail(d.coBrokerInviteEmail ?? "");
          setCoPct(d.commissionSplitPct != null ? String(d.commissionSplitPct) : "");
        }
      })
      .catch(() => setDeal(null));
    apiFetch<{ logs: Act[]; documents: Doc[]; services: Svc[] }>(`/deals/${id}/timeline`, {
      token,
    })
      .then((x) => {
        setActivity(x.logs ?? []);
        setDocs(x.documents ?? []);
        setServices(x.services ?? []);
      })
      .catch(() => {
        setActivity([]);
        setDocs([]);
        setServices([]);
      });
  }, [id, token]);

  useEffect(() => {
    load();
  }, [load]);

  async function advance() {
    if (!token) return;
    setErr(null);
    try {
      await apiFetch(`/deals/${id}/advance`, { method: "POST", token });
      load();
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    }
  }

  async function saveCoBroker(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    await apiFetch(`/deals/${id}`, {
      method: "PATCH",
      token,
      body: JSON.stringify({
        coBrokerInviteEmail: coEmail || undefined,
        commissionSplitPct: coPct ? Number(coPct) : undefined,
      }),
    });
    load();
  }

  async function runFraud() {
    if (!token || !deal?.property?.id) return;
    const r = await apiFetch<{ risk: string; similarListingsInCity?: number }>(
      "/fraud/duplicate-check",
      {
        method: "POST",
        token,
        body: JSON.stringify({ propertyId: deal.property.id }),
      },
    );
    setFraud(`Risk: ${r.risk}${r.similarListingsInCity != null ? ` · similar in city: ${r.similarListingsInCity}` : ""}`);
  }

  async function loadDd() {
    if (!token) return;
    const r = await apiFetch<{ items?: { label: string; done: boolean }[] }>(`/dd/deal/${id}/checklist`, {
      token,
    });
    setDd(r.items?.map((i) => `${i.done ? "✓" : "○"} ${i.label}`).join("\n") ?? "");
  }

  if (!token)
    return (
      <p>
        <Link href="/login" className="text-teal-400">
          Log in
        </Link>
      </p>
    );

  if (deal === undefined) return <p className="text-zinc-500">Loading…</p>;
  if (deal === null) return <p className="text-zinc-500">Not found or no access</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/deals" className="text-sm text-zinc-500 hover:text-teal-400">
        ← Deals
      </Link>
      <h1 className="mt-4 text-2xl font-semibold">Deal pipeline</h1>
      <p className="mt-2 text-zinc-400">
        Stage: <strong className="text-zinc-200">{deal.stage}</strong>
      </p>
      <p className="text-sm text-zinc-500">
        SLA breaches: {deal.slaBreachCount} · Health: {deal.dealHealthScore ?? "—"} · Stage since{" "}
        {new Date(deal.stageEnteredAt).toLocaleString()}
      </p>
      {deal.institutionId && (
        <p className="mt-3 rounded border border-amber-900/50 bg-amber-950/30 px-3 py-2 text-sm text-amber-200">
          Institutional deal — buyer must sign NDA before advancing (Module 40).
        </p>
      )}
      {deal.property && (
        <p className="mt-4">
          Property:{" "}
          <Link href={`/properties/${deal.property.id}`} className="text-teal-400">
            {deal.property.title}
          </Link>
        </p>
      )}
      <p className="mt-2 text-sm">Requirement: {deal.requirement.city}</p>
      {err && <p className="mt-4 text-red-400">{err}</p>}
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {(["legal", "loan", "insurance"] as const).map((k) => {
          const row = services.find((s) => s.type === k);
          return (
            <span key={k} className="rounded border border-zinc-700 px-2 py-1 text-zinc-400">
              {k}: {row?.status ?? "not started"}
            </span>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => advance()}
        className="mt-6 rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-500"
      >
        Advance to next stage
      </button>

      <section className="mt-10 border-t border-zinc-800 pt-6">
        <h2 className="text-lg font-medium text-zinc-200">Broker network (co-broke)</h2>
        <form onSubmit={saveCoBroker} className="mt-3 space-y-2 text-sm">
          <label className="block">
            Co-broker invite email
            <input
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={coEmail}
              onChange={(e) => setCoEmail(e.target.value)}
            />
          </label>
          <label className="block">
            Commission split (% to co-broker)
            <input
              type="number"
              min={0}
              max={100}
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={coPct}
              onChange={(e) => setCoPct(e.target.value)}
            />
          </label>
          <button type="submit" className="rounded border border-zinc-600 px-3 py-1.5 text-zinc-200">
            Save
          </button>
        </form>
      </section>

      <section className="mt-10 border-t border-zinc-800 pt-6">
        <h2 className="text-lg font-medium text-zinc-200">Fraud & due diligence</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void runFraud()}
            disabled={!deal.property}
            className="rounded bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 disabled:opacity-40"
          >
            Duplicate check
          </button>
          <button type="button" onClick={() => void loadDd()} className="rounded bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200">
            DD checklist
          </button>
        </div>
        {fraud && <p className="mt-2 text-xs text-zinc-400">{fraud}</p>}
        {dd && (
          <pre className="mt-2 whitespace-pre-wrap rounded border border-zinc-800 bg-zinc-900/50 p-3 text-xs text-zinc-400">
            {dd}
          </pre>
        )}
      </section>

      <section className="mt-10 border-t border-zinc-800 pt-6">
        <h2 className="text-lg font-medium text-zinc-200">Deal room — documents</h2>
        <ul className="mt-3 space-y-1 text-sm text-zinc-400">
          {docs.map((d) => (
            <li key={d.id}>
              {d.type} · <span className="font-mono text-xs">{d.storageKey}</span>
            </li>
          ))}
        </ul>
        {!docs.length && <p className="text-sm text-zinc-600">No documents yet.</p>}
      </section>

      <section className="mt-10 border-t border-zinc-800 pt-6">
        <h2 className="text-lg font-medium text-zinc-200">Access trail</h2>
        <ul className="mt-3 max-h-48 space-y-1 overflow-auto font-mono text-xs text-zinc-500">
          {activity.map((a) => (
            <li key={a.id}>
              {new Date(a.createdAt).toISOString()} · {a.action}
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-xs text-zinc-600">
        Module 39–40: document versioning and orchestration rules apply before data room unlock.
      </p>
    </div>
  );
}
