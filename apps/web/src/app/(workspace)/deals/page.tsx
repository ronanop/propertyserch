"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

type Deal = {
  id: string;
  stage: string;
  dealHealthScore: number | null;
  updatedAt: string;
  property: { id: string; title: string; city: string } | null;
  institution: { id: string; city: string } | null;
};

export default function DealsPage() {
  const { token } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    if (!token) return;
    apiFetch<Deal[]>("/deals", { token })
      .then(setDeals)
      .catch(() => setDeals([]));
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
    <div>
      <div className="flex justify-between gap-4">
        <h1 className="text-2xl font-semibold">Deals</h1>
        <Link href="/deals/new" className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm text-white">
          New deal
        </Link>
      </div>
      <ul className="mt-6 space-y-2">
        {deals.map((d) => (
          <li key={d.id} className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3">
            <Link href={`/deals/${d.id}`} className="font-medium text-teal-400 hover:underline">
              {d.property?.title ?? d.institution?.city ?? "Deal"} · {d.stage}
            </Link>
            <p className="text-xs text-zinc-500">
              Health {d.dealHealthScore ?? "—"} · updated {new Date(d.updatedAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
      {deals.length === 0 && (
        <p className="mt-8 text-zinc-500">No deals — create an organization, then open a deal from Matches.</p>
      )}
    </div>
  );
}
