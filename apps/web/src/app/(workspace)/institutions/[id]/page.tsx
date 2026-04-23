"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

type Detail = {
  id: string;
  institutionType: string;
  city: string;
  maskedSummary: string | null;
  askingPriceCr: unknown;
  locked?: boolean;
  institutionName?: string;
};

export default function InstitutionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { token } = useAuth();
  const [row, setRow] = useState<Detail | null | undefined>(undefined);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(() => {
    if (token) {
      apiFetch<Detail>(`/institutions/${id}`, { token })
        .then(setRow)
        .catch(() => setRow(null));
    } else {
      apiFetch<Detail>(`/institutions/preview/${id}`)
        .then(setRow)
        .catch(() => setRow(null));
    }
  }, [id, token]);

  useEffect(() => {
    load();
  }, [load]);

  async function signNda() {
    if (!token) {
      setMsg("Log in to sign NDA");
      return;
    }
    setMsg(null);
    try {
      await apiFetch("/nda/sign", {
        method: "POST",
        token,
        body: JSON.stringify({ institutionId: id }),
      });
      setMsg("NDA signed. Refreshing…");
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    }
  }

  if (row === undefined) return <p className="text-zinc-500">Loading…</p>;
  if (row === null) return <p className="text-zinc-500">Not found</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/institutions" className="text-sm text-zinc-500 hover:text-teal-400">
        ← Institutions
      </Link>
      <h1 className="mt-4 text-2xl font-semibold">
        {row.locked ? row.maskedSummary ?? "Confidential asset" : row.institutionName ?? "Institution"}
      </h1>
      <p className="text-zinc-400">
        {row.institutionType} · {row.city}
      </p>
      <p className="mt-4">Asking ~₹{String(row.askingPriceCr)} Cr</p>
      {row.locked && (
        <div className="mt-6 rounded-lg border border-amber-900/50 bg-amber-950/20 p-4 text-sm">
          <p>Full details require verified buyer + NDA (platform rule).</p>
          <button
            type="button"
            onClick={signNda}
            className="mt-3 rounded bg-teal-600 px-3 py-1.5 text-white hover:bg-teal-500"
          >
            Sign NDA (demo)
          </button>
        </div>
      )}
      {msg && <p className="mt-4 text-sm text-zinc-400">{msg}</p>}
    </div>
  );
}
