"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

type Pref = {
  assetClasses: string[];
  geography: string[];
  minTicketCr: number | null;
  maxTicketCr: number | null;
};

export default function IrmPage() {
  const { token } = useAuth();
  const [form, setForm] = useState({
    assetClasses: "office,retail",
    geography: "mumbai,delhi",
    minTicketCr: "",
    maxTicketCr: "",
  });
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiFetch<Pref | null>("/irm/preferences", { token }).then((p) => {
      if (!p) return;
      setForm({
        assetClasses: (p.assetClasses ?? []).join(","),
        geography: (p.geography ?? []).join(","),
        minTicketCr: p.minTicketCr != null ? String(p.minTicketCr) : "",
        maxTicketCr: p.maxTicketCr != null ? String(p.maxTicketCr) : "",
      });
    });
  }, [token]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setMsg(null);
    await apiFetch("/irm/preferences", {
      method: "PUT",
      token,
      body: JSON.stringify({
        assetClasses: form.assetClasses.split(/[,\s]+/).filter(Boolean),
        geography: form.geography.split(/[,\s]+/).filter(Boolean),
        minTicketCr: form.minTicketCr ? Number(form.minTicketCr) : undefined,
        maxTicketCr: form.maxTicketCr ? Number(form.maxTicketCr) : undefined,
      }),
    });
    setMsg("Saved — matches will prioritize these filters (Phase 2 ML).");
  }

  if (!token)
    return (
      <p>
        <Link href="/login" className="text-teal-400">
          Log in
        </Link>{" "}
        for IRM preferences.
      </p>
    );

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-xl font-semibold">Investor preference (IRM)</h1>
      <p className="mt-1 text-sm text-zinc-500">Ticket size, asset class, and geography for deal feed.</p>
      <form onSubmit={save} className="mt-6 space-y-3 text-sm">
        <label className="block">
          Asset classes (comma-separated)
          <input
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={form.assetClasses}
            onChange={(e) => setForm((f) => ({ ...f, assetClasses: e.target.value }))}
          />
        </label>
        <label className="block">
          Geography (comma-separated)
          <input
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={form.geography}
            onChange={(e) => setForm((f) => ({ ...f, geography: e.target.value }))}
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            Min ticket (Cr)
            <input
              type="number"
              step="0.1"
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.minTicketCr}
              onChange={(e) => setForm((f) => ({ ...f, minTicketCr: e.target.value }))}
            />
          </label>
          <label>
            Max ticket (Cr)
            <input
              type="number"
              step="0.1"
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.maxTicketCr}
              onChange={(e) => setForm((f) => ({ ...f, maxTicketCr: e.target.value }))}
            />
          </label>
        </div>
        {msg && <p className="text-teal-400">{msg}</p>}
        <button
          type="submit"
          className="rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-500"
        >
          Save preferences
        </button>
      </form>
    </div>
  );
}
