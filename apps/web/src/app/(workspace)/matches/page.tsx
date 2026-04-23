"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

type MatchRow = {
  id: string;
  matchScore: number;
  hotMatch: boolean;
  status: string;
  property: {
    id: string;
    title: string;
    city: string;
    price: unknown;
    postedById: string;
  };
  requirement: {
    id: string;
    city: string;
    tag: string;
    userId: string;
  };
};

export default function MatchesPage() {
  const { token, user } = useAuth();
  const [rows, setRows] = useState<MatchRow[]>([]);
  const [view, setView] = useState<"all" | "property" | "requirement">("all");

  const load = useCallback(() => {
    if (!token) return;
    apiFetch<MatchRow[]>("/matching/me", { token })
      .then(setRows)
      .catch(() => setRows([]));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function mark(id: string, status: "VIEWED" | "ACCEPTED" | "REJECTED") {
    if (!token) return;
    await apiFetch(`/matching/matches/${id}/status`, {
      method: "PUT",
      token,
      body: JSON.stringify({ status }),
    });
    load();
  }

  if (!token)
    return (
      <p>
        <Link href="/login" className="text-teal-400">
          Log in
        </Link>{" "}
        to see matches.
      </p>
    );

  return (
    <div>
      <h1 className="text-2xl font-semibold">Your matches</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Rule-based scores. Hot = high fit for your listings or requirements.
      </p>
      <div className="mt-4 flex gap-2 text-xs">
        {(["all", "property", "requirement"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setView(k)}
            className={`rounded border px-2 py-1 ${
              view === k ? "border-teal-700 text-teal-300" : "border-zinc-700 text-zinc-500"
            }`}
          >
            {k === "all" ? "All" : k === "property" ? "Property-centric" : "Requirement-centric"}
          </button>
        ))}
      </div>
      <ul className="mt-6 space-y-3">
        {rows
          .filter((m) => {
            if (view === "all") return true;
            if (view === "property") return user?.id === m.property.postedById;
            return user?.id === m.requirement.userId;
          })
          .map((m) => {
          const role =
            user?.id === m.property.postedById
              ? "Your listing"
              : user?.id === m.requirement.userId
                ? "Your requirement"
                : "";
          return (
            <li
              key={m.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-teal-400">{m.matchScore}% match</span>
                {m.hotMatch && (
                  <span className="rounded bg-amber-900/40 px-2 py-0.5 text-xs text-amber-200">
                    Hot
                  </span>
                )}
                {role && <span className="text-xs text-zinc-500">{role}</span>}
              </div>
              <p className="mt-2 text-zinc-300">
                <Link href={`/properties/${m.property.id}`} className="hover:underline">
                  {m.property.title}
                </Link>{" "}
                · {m.property.city} · {String(m.property.price)}
              </p>
              <p className="text-zinc-500">
                Buyer need: {m.requirement.city} · {m.requirement.tag} · status {m.status}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => void mark(m.id, "VIEWED")}
                  className="rounded border border-zinc-700 px-2 py-1 text-zinc-400"
                >
                  Mark viewed
                </button>
                <button
                  type="button"
                  onClick={() => void mark(m.id, "ACCEPTED")}
                  className="rounded border border-emerald-700 px-2 py-1 text-emerald-300"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => void mark(m.id, "REJECTED")}
                  className="rounded border border-rose-800 px-2 py-1 text-rose-300"
                >
                  Reject
                </button>
              </div>
              <Link
                href={`/deals/new?propertyId=${m.property.id}&requirementId=${m.requirement.id}`}
                className="mt-2 inline-block text-xs text-teal-500 hover:underline"
              >
                Start deal (pick org on form)
              </Link>
            </li>
          );
          })}
      </ul>
      {rows.length === 0 && <p className="mt-8 text-zinc-500">No matches yet — post a listing or requirement.</p>}
    </div>
  );
}
