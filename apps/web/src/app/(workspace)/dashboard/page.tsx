"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

type DashboardSummary = {
  unreadCount: number;
  digestStrip: { id: string; title: string; body: string }[];
  quickStats: { myProperties: number; myRequirements: number; myMatches: number };
  recentMatches: {
    id: string;
    matchScore: number;
    hotMatch: boolean;
    property: { id: string; title: string; city: string };
    requirement: { id: string; city: string; tag: string };
  }[];
  hotRequirements: {
    id: string;
    city: string;
    tag: string;
    urgency: string;
    budgetMin: unknown;
    budgetMax: unknown;
  }[];
};

export default function DashboardPage() {
  const { token, ready, user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    if (!ready || !token) return;
    apiFetch<DashboardSummary>("/dashboard/summary", { token })
      .then(setSummary)
      .catch(() => setSummary(null));
  }, [ready, token]);

  if (!ready)
    return <p className="text-zinc-500">Loading…</p>;

  if (!token)
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8">
        <p className="text-zinc-300">Sign in to see your workspace.</p>
        <Link href="/login" className="mt-4 inline-block text-teal-400">
          Log in
        </Link>
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-zinc-400">
        Welcome{user?.name ? `, ${user.name}` : ""}. Track listings, requirements, matches, and deals.
      </p>

      {summary && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["My listings", summary.quickStats.myProperties, "/properties"],
            ["My requirements", summary.quickStats.myRequirements, "/requirements"],
            ["Matches", summary.quickStats.myMatches, "/matches"],
            ["Deals", summary.recentMatches.length, "/deals"],
            ["Unread alerts", summary.unreadCount, "/notifications"],
          ].map(([label, n, href]) => (
            <Link
              key={String(label)}
              href={href as string}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition hover:border-teal-800"
            >
              <p className="text-sm text-zinc-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-teal-400">{n}</p>
            </Link>
          ))}
        </div>
      )}

      {summary?.digestStrip?.length ? (
        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <p className="text-sm font-medium text-zinc-200">Daily market update</p>
          <ul className="mt-3 space-y-1 text-sm text-zinc-400">
            {summary.digestStrip.slice(0, 4).map((d) => (
              <li key={d.id}>
                <span className="text-zinc-200">{d.title}:</span> {d.body}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {summary?.hotRequirements?.length ? (
        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <p className="text-sm font-medium text-zinc-200">Hot requirements</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            {summary.hotRequirements.slice(0, 5).map((r) => (
              <li key={r.id}>
                {r.city} · {r.urgency} · budget {String(r.budgetMin)} - {String(r.budgetMax)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/properties/new"
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500"
        >
          Post property
        </Link>
        <Link
          href="/requirements/new"
          className="rounded-lg border border-zinc-600 px-4 py-2 text-sm hover:bg-zinc-900"
        >
          Post requirement
        </Link>
        <Link href="/organizations/setup" className="rounded-lg border border-zinc-600 px-4 py-2 text-sm hover:bg-zinc-900">
          Create broker organization
        </Link>
      </div>
    </div>
  );
}
