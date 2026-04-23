"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

export default function ReputationPage() {
  const { token } = useAuth();
  const [data, setData] = useState<{
    reputationScore: number;
    closedDealsAttributed: number;
    note: string;
  } | null>(null);

  async function load() {
    if (!token) return;
    setData(await apiFetch("/reputation/me", { token }));
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
    <div className="mx-auto max-w-lg">
      <h1 className="text-xl font-semibold">Reputation (basic)</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Closed deals attributed to your organizations increase score (Phase 1 heuristic).
      </p>
      <button
        type="button"
        onClick={() => void load()}
        className="mt-4 rounded bg-teal-600 px-4 py-2 text-sm text-white"
      >
        Refresh score
      </button>
      {data && (
        <div className="mt-6 rounded border border-zinc-800 bg-zinc-900/50 p-4 text-sm">
          <p>
            Score: <strong className="text-zinc-100">{data.reputationScore}</strong>
          </p>
          <p className="text-zinc-500">Closed deals: {data.closedDealsAttributed}</p>
          <p className="mt-2 text-xs text-zinc-600">{data.note}</p>
        </div>
      )}
    </div>
  );
}
