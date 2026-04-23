"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

type Prop = {
  id: string;
  title: string;
  city: string;
  areaPublic: string;
  price: unknown;
  imageUrls?: string[];
};

export default function PropertiesPage() {
  const { token } = useAuth();
  const [publicList, setPublicList] = useState<Prop[]>([]);
  const [mine, setMine] = useState<Prop[]>([]);

  useEffect(() => {
    apiFetch<Prop[]>("/properties")
      .then(setPublicList)
      .catch(() => setPublicList([]));
  }, []);

  useEffect(() => {
    if (!token) return;
    apiFetch<Prop[]>("/properties/mine", { token })
      .then(setMine)
      .catch(() => setMine([]));
  }, [token]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Properties</h1>
        <Link
          href="/properties/new"
          className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white"
        >
          Post property
        </Link>
      </div>

      {token && mine.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-medium text-zinc-300">My listings</h2>
          <ul className="mt-3 space-y-2">
            {mine.map((p) => (
              <li key={p.id}>
                <Link href={`/properties/${p.id}`} className="text-teal-400 hover:underline">
                  {p.title}
                </Link>
                <span className="text-zinc-500"> — {p.city}, {p.areaPublic}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-medium text-zinc-300">Marketplace</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {publicList.map((p) => (
            <Link
              key={p.id}
              href={`/properties/${p.id}`}
              className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 transition hover:border-teal-900"
            >
              {p.imageUrls?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrls[0]} alt="" className="h-32 w-full object-cover" />
              ) : (
                <div className="flex h-32 items-center justify-center bg-zinc-800 text-xs text-zinc-500">
                  No image
                </div>
              )}
              <div className="p-3">
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-zinc-500">
                  {p.city} · {String(p.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
