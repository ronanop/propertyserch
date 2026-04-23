"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

type Log = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
};

export default function AdminAuditPage() {
  const { token, user } = useAuth();
  const [orgId, setOrgId] = useState("");
  const [rows, setRows] = useState<Log[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    if (!token || !orgId.trim()) return;
    setErr(null);
    try {
      const data = await apiFetch<Log[]>(
        `/audit/organization?organizationId=${encodeURIComponent(orgId)}`,
        { token },
      );
      setRows(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Forbidden or error");
      setRows(null);
    }
  }

  if (!token)
    return (
      <p>
        <Link href="/login" className="text-teal-400">
          Log in
        </Link>
      </p>
    );

  if (user?.role !== "ADMIN")
    return (
      <p className="text-zinc-500">
        Platform admin only. Your role: <span className="text-zinc-300">{user?.role}</span>
      </p>
    );

  return (
    <div className="mx-auto max-w-3xl text-sm">
      <h1 className="text-xl font-semibold">Organization audit trail</h1>
      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
          placeholder="Organization ID"
          value={orgId}
          onChange={(e) => setOrgId(e.target.value)}
        />
        <button type="button" onClick={() => void load()} className="rounded bg-teal-600 px-4 py-2 text-white">
          Load
        </button>
      </div>
      {err && <p className="mt-4 text-red-400">{err}</p>}
      {rows && (
        <ul className="mt-6 max-h-[480px] space-y-2 overflow-auto font-mono text-xs text-zinc-400">
          {rows.map((r) => (
            <li key={r.id}>
              {new Date(r.createdAt).toISOString()} · {r.action} · {r.entityType} · {r.entityId}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
