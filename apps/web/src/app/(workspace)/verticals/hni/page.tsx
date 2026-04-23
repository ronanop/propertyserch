"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

type Hni = { ticketMinCr: number | null; ticketMaxCr: number | null };

export default function HniVerticalPage() {
  const { token } = useAuth();
  const [p, setP] = useState<Hni | null>(null);
  const [form, setForm] = useState({ ticketMinCr: "", ticketMaxCr: "" });
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiFetch<Hni>("/verticals/hni/profile", { token }).then(setP);
  }, [token]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setMsg(null);
    await apiFetch("/verticals/hni/profile", {
      method: "PUT",
      token,
      body: JSON.stringify({
        ticketMinCr: form.ticketMinCr ? Number(form.ticketMinCr) : undefined,
        ticketMaxCr: form.ticketMaxCr ? Number(form.ticketMaxCr) : undefined,
      }),
    });
    setMsg("Saved");
    setP(await apiFetch<Hni>("/verticals/hni/profile", { token }));
  }

  if (!token)
    return (
      <p>
        <Link href="/login" className="text-teal-400">
          Log in
        </Link>{" "}
        for HNI workspace.
      </p>
    );

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-xl font-semibold">HNI workspace</h1>
      <p className="mt-1 text-sm text-zinc-500">Ticket size band for curated deal flow.</p>
      {p && (
        <p className="mt-4 text-sm text-zinc-400">
          {p.ticketMinCr ?? "—"} – {p.ticketMaxCr ?? "—"} Cr
        </p>
      )}
      <form onSubmit={save} className="mt-6 space-y-3 text-sm">
        <label className="block">
          Min ticket (Cr)
          <input
            type="number"
            step="0.1"
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={form.ticketMinCr}
            onChange={(e) => setForm((f) => ({ ...f, ticketMinCr: e.target.value }))}
          />
        </label>
        <label className="block">
          Max ticket (Cr)
          <input
            type="number"
            step="0.1"
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={form.ticketMaxCr}
            onChange={(e) => setForm((f) => ({ ...f, ticketMaxCr: e.target.value }))}
          />
        </label>
        {msg && <p className="text-teal-400">{msg}</p>}
        <button
          type="submit"
          className="rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-500"
        >
          Save
        </button>
      </form>
    </div>
  );
}
