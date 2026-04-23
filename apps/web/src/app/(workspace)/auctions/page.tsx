"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiUrl } from "@/lib/api";

type Auction = {
  id: string;
  source: string;
  title: string;
  city: string;
  emdAmount: unknown;
  startPrice: unknown;
  auctionDate: string | null;
};

export default function AuctionsPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<Auction[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch(apiUrl("/verticals/auctions"))
      .then((r) => r.json())
      .then(setRows)
      .catch(() => setErr("Could not load auctions"));
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-semibold">Bank auction inventory</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Public catalog (Phase 1 manual seed). Link auction leads into your CRM pipeline.
      </p>
      {err && <p className="mt-4 text-sm text-red-400">{err}</p>}
      <ul className="mt-6 space-y-3">
        {rows.map((a) => (
          <li
            key={a.id}
            className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm"
          >
            <p className="font-medium text-zinc-100">{a.title}</p>
            <p className="text-zinc-500">
              {a.city} · {a.source}
              {a.startPrice != null && <> · Start {String(a.startPrice)}</>}
            </p>
          </li>
        ))}
      </ul>
      {!rows.length && !err && <p className="mt-6 text-zinc-500">No rows yet — seed via API.</p>}
      {token && (
        <p className="mt-8 text-sm text-zinc-500">
          Brokers: create auction rows via{" "}
          <code className="text-teal-400">POST /verticals/auctions</code> or{" "}
          <Link href="/crm" className="text-teal-400">
            CRM
          </Link>
          .
        </p>
      )}
    </div>
  );
}
