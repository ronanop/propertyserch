"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

export default function ServicesHubPage() {
  const { token } = useAuth();
  const [orgId, setOrgId] = useState("");
  const [dealId, setDealId] = useState("");
  const [type, setType] = useState<"legal" | "loan" | "insurance">("legal");
  const [partnerId, setPartnerId] = useState("");
  const [requestId, setRequestId] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !orgId.trim()) return;
    setMsg(null);
    const row = await apiFetch<{ id: string }>("/services/requests", {
      method: "POST",
      token,
      body: JSON.stringify({
        organizationId: orgId,
        type,
        dealId: dealId.trim() || undefined,
      }),
    });
    setMsg(`Created request ${row.id}`);
  }

  async function assign() {
    if (!token || !requestId.trim() || !partnerId.trim()) return;
    await apiFetch(`/services/requests/${requestId}/partner`, {
      method: "PUT",
      token,
      body: JSON.stringify({ partnerId }),
    });
    setMsg("Partner assigned");
  }

  if (!token)
    return (
      <p>
        <Link href="/login" className="text-teal-400">
          Log in
        </Link>
      </p>
    );

  return (
    <div className="mx-auto max-w-lg space-y-8 text-sm">
      <div>
        <h1 className="text-xl font-semibold">Legal · Loan · Insurance</h1>
        <p className="mt-1 text-zinc-500">Service requests on top of deals (Module 24–26).</p>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <label className="block">
            Organization ID
            <input
              required
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
            />
          </label>
          <label className="block">
            Deal ID (optional)
            <input
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={dealId}
              onChange={(e) => setDealId(e.target.value)}
            />
          </label>
          <label className="block">
            Type
            <select
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
            >
              <option value="legal">Legal</option>
              <option value="loan">Loan</option>
              <option value="insurance">Insurance</option>
            </select>
          </label>
          <button type="submit" className="rounded bg-teal-600 px-4 py-2 text-white">
            Open request
          </button>
        </form>
        {msg && <p className="mt-2 text-teal-400">{msg}</p>}
      </div>
      <div className="border-t border-zinc-800 pt-6">
        <h2 className="font-medium text-zinc-300">Assign partner</h2>
        <p className="text-zinc-500">
          Use IDs from{" "}
          <Link href="/partners" className="text-teal-400">
            Partners
          </Link>{" "}
          and your service request list.
        </p>
        <div className="mt-3 space-y-2">
          <input
            placeholder="Service request ID"
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
          />
          <input
            placeholder="Partner ID"
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={partnerId}
            onChange={(e) => setPartnerId(e.target.value)}
          />
          <button
            type="button"
            onClick={() => void assign()}
            className="rounded border border-zinc-600 px-3 py-2 text-zinc-200"
          >
            Assign partner
          </button>
        </div>
      </div>
    </div>
  );
}
