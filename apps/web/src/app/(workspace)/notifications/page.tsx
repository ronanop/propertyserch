"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

type N = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<N[]>([]);

  const load = useCallback(() => {
    if (!token) return;
    apiFetch<N[]>("/notifications", { token })
      .then(setItems)
      .catch(() => setItems([]));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function markRead(id: string) {
    if (!token) return;
    await apiFetch(`/notifications/${id}/read`, { method: "PUT", token });
    load();
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
    <div>
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <p className="mt-1 text-sm text-zinc-500">In-app alerts (daily digest + WhatsApp in production).</p>
      <ul className="mt-6 space-y-3">
        {items.map((n) => (
          <li
            key={n.id}
            className={`rounded-lg border px-4 py-3 text-sm ${
              n.read ? "border-zinc-800 bg-zinc-900/20" : "border-teal-900/50 bg-teal-950/20"
            }`}
          >
            <p className="font-medium">{n.title}</p>
            <p className="text-zinc-400">{n.body}</p>
            <p className="mt-1 text-xs text-zinc-600">{new Date(n.createdAt).toLocaleString()}</p>
            {!n.read && (
              <button
                type="button"
                onClick={() => markRead(n.id)}
                className="mt-2 text-xs text-teal-400 hover:underline"
              >
                Mark read
              </button>
            )}
          </li>
        ))}
      </ul>
      {items.length === 0 && <p className="mt-8 text-zinc-500">No notifications yet.</p>}
    </div>
  );
}
