"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

type Req = {
  id: string;
  city: string;
  areas: string[];
  budgetMin: unknown;
  budgetMax: unknown;
  tag: string;
  urgency: string;
};

export default function RequirementsPage() {
  const { token } = useAuth();
  const [publicList, setPublicList] = useState<Req[]>([]);
  const [mine, setMine] = useState<Req[]>([]);

  useEffect(() => {
    apiFetch<Req[]>("/requirements")
      .then(setPublicList)
      .catch(() => setPublicList([]));
  }, []);

  useEffect(() => {
    if (!token) return;
    apiFetch<Req[]>("/requirements/mine", { token }).then(setMine).catch(() => setMine([]));
  }, [token]);

  return (
    <div>
      <div className="flex justify-between gap-4">
        <h1 className="text-2xl font-semibold">Requirements</h1>
        <Link href="/requirements/new" className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm text-white">
          Post requirement
        </Link>
      </div>

      {token && mine.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-medium">My requirements</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {mine.map((r) => (
              <li key={r.id} className="rounded border border-zinc-800 bg-zinc-900/40 px-3 py-2">
                <span className="text-teal-400">{r.city}</span> · {r.areas.join(", ")} ·{" "}
                <span className="text-zinc-500">{r.tag}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-medium text-zinc-300">Public feed</h2>
        <ul className="mt-3 space-y-2">
          {publicList.map((r) => (
            <li key={r.id} className="text-sm text-zinc-400">
              {r.city} — {String(r.budgetMin)}–{String(r.budgetMax)} · {r.tag}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
