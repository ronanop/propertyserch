"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch, apiUrl } from "@/lib/api";

type Hit = { id: string; title: string; city: string; price: unknown; areaSqft: number };
type Saved = { id: string; name: string; filters: unknown; createdAt: string };

export default function SearchPage() {
  const { token } = useAuth();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState<Saved[]>([]);

  async function runSearch() {
    const res = await fetch(apiUrl(`/search/properties?q=${encodeURIComponent(q)}`)).then((r) =>
      r.json(),
    );
    setHits(res.hits ?? []);
    setNote(res.note ?? "");
  }

  useEffect(() => {
    if (!token) return;
    apiFetch<Saved[]>("/search/saved", { token }).then(setSaved);
  }, [token]);

  async function saveCurrent() {
    if (!token || !q.trim()) return;
    await apiFetch("/search/saved", {
      method: "POST",
      token,
      body: JSON.stringify({ name: `Search: ${q}`, filters: { q } }),
    });
    setSaved(await apiFetch("/search/saved", { token }));
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-semibold">Property search</h1>
      <p className="mt-1 text-sm text-zinc-500">
        PostgreSQL text match today; Elasticsearch when infra is wired (Phase 2).
      </p>
      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
          placeholder="City, title, locality…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          type="button"
          onClick={() => void runSearch()}
          className="rounded bg-teal-600 px-4 py-2 text-sm text-white"
        >
          Search
        </button>
      </div>
      {note && <p className="mt-2 text-xs text-zinc-500">{note}</p>}
      <ul className="mt-6 space-y-2 text-sm">
        {hits.map((h) => (
          <li key={h.id}>
            <Link href={`/properties/${h.id}`} className="text-teal-400 hover:underline">
              {h.title}
            </Link>
            <span className="text-zinc-500">
              {" "}
              · {h.city} · {String(h.price)} · {h.areaSqft} sqft
            </span>
          </li>
        ))}
      </ul>
      {token && (
        <div className="mt-8 border-t border-zinc-800 pt-6">
          <button
            type="button"
            onClick={() => void saveCurrent()}
            className="rounded border border-zinc-600 px-3 py-1.5 text-sm text-zinc-300"
          >
            Save this query
          </button>
          <h2 className="mt-6 text-sm font-medium text-zinc-300">Saved searches</h2>
          <ul className="mt-2 space-y-1 text-xs text-zinc-500">
            {saved.map((s) => (
              <li key={s.id}>
                {s.name} — {new Date(s.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!token && (
        <p className="mt-6 text-sm text-zinc-500">
          <Link href="/login" className="text-teal-400">
            Log in
          </Link>{" "}
          to save searches.
        </p>
      )}
    </div>
  );
}
