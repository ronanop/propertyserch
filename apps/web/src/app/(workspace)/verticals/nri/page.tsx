"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

type Nri = { country: string | null; assignedManager: string | null; serviceNotes: string | null };

export default function NriVerticalPage() {
  const { token } = useAuth();
  const [p, setP] = useState<Nri | null>(null);
  const [form, setForm] = useState({ country: "", assignedManager: "" });
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiFetch<Nri>("/verticals/nri/profile", { token }).then(setP);
  }, [token]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setMsg(null);
    await apiFetch("/verticals/nri/profile", {
      method: "PUT",
      token,
      body: JSON.stringify({ country: form.country, assignedManager: form.assignedManager }),
    });
    setMsg("Saved");
    const next = await apiFetch<Nri>("/verticals/nri/profile", { token });
    setP(next);
  }

  if (!token)
    return (
      <p>
        <Link href="/login" className="text-teal-400">
          Log in
        </Link>{" "}
        for NRI workspace.
      </p>
    );

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-xl font-semibold">NRI workspace</h1>
      <p className="mt-1 text-sm text-zinc-500">Service routing and relationship manager fields.</p>
      {p && (
        <p className="mt-4 text-sm text-zinc-400">
          Current: {p.country ?? "—"} · Manager: {p.assignedManager ?? "—"}
        </p>
      )}
      <form onSubmit={save} className="mt-6 space-y-3 text-sm">
        <label className="block">
          Country of residence
          <input
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={form.country}
            onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
          />
        </label>
        <label className="block">
          Assigned manager (internal)
          <input
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={form.assignedManager}
            onChange={(e) => setForm((f) => ({ ...f, assignedManager: e.target.value }))}
          />
        </label>
        {msg && <p className="text-teal-400">{msg}</p>}
        <button
          type="submit"
          className="rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-500"
        >
          Save profile
        </button>
      </form>
    </div>
  );
}
