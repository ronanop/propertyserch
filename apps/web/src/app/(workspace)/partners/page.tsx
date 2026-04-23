"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch, apiUrl } from "@/lib/api";

type Partner = { id: string; type: string; name: string; verified: boolean };

export default function PartnersPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<Partner[]>([]);
  const [form, setForm] = useState({ type: "legal", name: "" });

  useEffect(() => {
    fetch(apiUrl("/partners"))
      .then((r) => r.json())
      .then(setRows);
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    await apiFetch("/partners", {
      method: "POST",
      token,
      body: JSON.stringify({ type: form.type, name: form.name }),
    });
    setForm({ type: form.type, name: "" });
    const next = await fetch(apiUrl("/partners")).then((r) => r.json());
    setRows(next);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-semibold">Partner directory</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Link partners to service requests from{" "}
        <Link href="/services-hub" className="text-teal-400">
          Legal & loans
        </Link>
        .
      </p>
      <ul className="mt-6 space-y-2 text-sm">
        {rows.map((p) => (
          <li key={p.id} className="flex justify-between rounded border border-zinc-800 px-3 py-2">
            <span>
              {p.name}{" "}
              <span className="text-zinc-500">
                ({p.type}){p.verified ? " · verified" : ""}
              </span>
            </span>
            <span className="font-mono text-xs text-zinc-600">{p.id.slice(0, 8)}…</span>
          </li>
        ))}
      </ul>
      {token ? (
        <form onSubmit={add} className="mt-8 space-y-3 text-sm">
          <p className="font-medium text-zinc-300">Add partner (broker)</p>
          <div className="flex gap-2">
            <select
              className="rounded border border-zinc-700 bg-zinc-900 px-2 py-2"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            >
              <option value="legal">Legal</option>
              <option value="loan">Loan</option>
              <option value="insurance">Insurance</option>
            </select>
            <input
              required
              placeholder="Firm name"
              className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <button type="submit" className="rounded bg-teal-600 px-3 py-2 text-white">
              Add
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-6 text-sm text-zinc-500">
          <Link href="/login" className="text-teal-400">
            Log in
          </Link>{" "}
          to add partners.
        </p>
      )}
    </div>
  );
}
