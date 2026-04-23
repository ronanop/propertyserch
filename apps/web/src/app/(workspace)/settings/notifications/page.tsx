"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

type Prefs = { dailyDigest?: boolean; matchAlerts?: boolean; slaWarnings?: boolean };

export default function NotificationSettingsPage() {
  const { token } = useAuth();
  const [prefs, setPrefs] = useState<Prefs>({
    dailyDigest: true,
    matchAlerts: true,
    slaWarnings: true,
  });
  const [digest, setDigest] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiFetch<{ notificationPrefs: unknown }>("/user/profile", { token }).then((p) => {
      const n = p.notificationPrefs as Prefs | null;
      if (n && typeof n === "object") setPrefs((prev) => ({ ...prev, ...n }));
    });
  }, [token]);

  async function save() {
    if (!token) return;
    await apiFetch("/user/notification-preferences", {
      method: "PUT",
      token,
      body: JSON.stringify(prefs),
    });
  }

  async function previewDigest() {
    if (!token) return;
    const d = await apiFetch<{ windowLocal: string; items: { title: string }[] }>(
      "/notifications/digest-preview",
      { token },
    );
    setDigest(`${d.windowLocal} digest — ${d.items.length} unread items in preview`);
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
    <div className="mx-auto max-w-lg text-sm">
      <h1 className="text-xl font-semibold">Notification tiers</h1>
      <p className="mt-1 text-zinc-500">Control digest, match alerts, and SLA warnings (Module 43).</p>
      <div className="mt-6 space-y-3">
        {(["dailyDigest", "matchAlerts", "slaWarnings"] as const).map((k) => (
          <label key={k} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!prefs[k]}
              onChange={(e) => setPrefs((p) => ({ ...p, [k]: e.target.checked }))}
            />
            <span className="capitalize">{k.replace(/([A-Z])/g, " $1").trim()}</span>
          </label>
        ))}
      </div>
      <button
        type="button"
        onClick={() => void save()}
        className="mt-6 rounded bg-teal-600 px-4 py-2 text-white"
      >
        Save preferences
      </button>
      <button
        type="button"
        onClick={() => void previewDigest()}
        className="ml-3 rounded border border-zinc-600 px-4 py-2 text-zinc-300"
      >
        Preview digest (stub)
      </button>
      {digest && <p className="mt-4 text-xs text-zinc-500">{digest}</p>}
    </div>
  );
}
