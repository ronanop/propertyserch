"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

export default function OrgSetupPage() {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [rera, setRera] = useState("");
  const [gst, setGst] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [mine, setMine] = useState<
    { id: string; role: string; organization: { id: string; name: string; reraNumber: string | null } }[]
  >([]);

  const loadMine = useCallback(async () => {
    if (!token) return;
    const data = await apiFetch<
      { id: string; role: string; organization: { id: string; name: string; reraNumber: string | null } }[]
    >("/organizations/mine", { token });
    setMine(data);
  }, [token]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setMsg(null);
    try {
      const org = await apiFetch<{ id: string; name: string }>("/organizations", {
        method: "POST",
        token,
        body: JSON.stringify({ name, reraNumber: rera || undefined, gstNumber: gst || undefined }),
      });
      setMsg(`Created: ${org.name} (${org.id})`);
      setName("");
      setRera("");
      setGst("");
      await loadMine();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error");
    }
  }

  useEffect(() => {
    void loadMine();
  }, [loadMine]);

  if (!token)
    return (
      <p>
        <Link href="/login" className="text-teal-400">
          Log in
        </Link>
      </p>
    );

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-xl font-semibold">Create broker organization</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm">
          Firm name
          <input
            required
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          RERA (optional)
          <input
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={rera}
            onChange={(e) => setRera(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          GST (optional)
          <input
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={gst}
            onChange={(e) => setGst(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-500"
        >
          Create
        </button>
      </form>
      {msg && <p className="mt-4 text-sm text-zinc-400">{msg}</p>}
      <div className="mt-8">
        <p className="text-sm font-medium text-zinc-300">My organizations</p>
        <ul className="mt-2 space-y-2 text-sm text-zinc-500">
          {mine.map((m) => (
            <li key={m.id} className="rounded border border-zinc-800 px-3 py-2">
              {m.organization.name} · role {m.role} · RERA {m.organization.reraNumber ?? "—"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
