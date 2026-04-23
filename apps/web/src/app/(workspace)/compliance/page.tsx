"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

type Item = { id: string; severity: string; title: string; body: string };

export default function CompliancePage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!token) return;
    apiFetch<{ items: Item[] }>("/compliance/feed", { token }).then((r) => setItems(r.items));
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
    <div className="mx-auto max-w-xl">
      <h1 className="text-xl font-semibold">Compliance advisory feed</h1>
      <ul className="mt-6 space-y-3 text-sm">
        {items.map((i) => (
          <li key={i.id} className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3">
            <p className="font-medium text-zinc-200">
              [{i.severity}] {i.title}
            </p>
            <p className="mt-1 text-zinc-400">{i.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
