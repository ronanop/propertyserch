"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

type PendingReview = {
  id: string;
  rating: number;
  comment: string | null;
  reviewer: { id: string; role: string };
  target: { id: string; role: string };
  propertyId: string | null;
  createdAt: string;
};

export default function AdminReviewsPage() {
  const { token, user } = useAuth();
  const [rows, setRows] = useState<PendingReview[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    apiFetch<PendingReview[]>("/reviews/admin/pending", { token })
      .then(setRows)
      .catch((e) => setErr(e instanceof Error ? e.message : "Error"));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function moderate(id: string, status: "approved" | "rejected") {
    if (!token) return;
    await apiFetch(`/reviews/admin/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify({ status }),
    });
    load();
  }

  if (!token) {
    return (
      <p>
        <Link href="/login" className="text-teal-400">
          Log in
        </Link>
      </p>
    );
  }
  if (user?.role !== "ADMIN") return <p className="text-zinc-500">Admin only</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-semibold">Review moderation queue</h1>
      {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
      <ul className="mt-6 space-y-3 text-sm">
        {rows.map((r) => (
          <li key={r.id} className="rounded border border-zinc-800 bg-zinc-900/40 p-3">
            <p className="text-zinc-200">
              {"★".repeat(r.rating)} · {r.comment ?? "No comment"}
            </p>
            <p className="text-xs text-zinc-500">
              reviewer {r.reviewer.role} · target {r.target.role} · property {r.propertyId ?? "n/a"}
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => void moderate(r.id, "approved")}
                className="rounded border border-emerald-700 px-2 py-1 text-xs text-emerald-300"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => void moderate(r.id, "rejected")}
                className="rounded border border-rose-700 px-2 py-1 text-xs text-rose-300"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
