"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

const PT = ["RESIDENTIAL", "COMMERCIAL", "PLOT", "INSTITUTIONAL"] as const;
const DT = ["SALE", "RENT"] as const;
const UR = ["IMMEDIATE", "WITHIN_30_DAYS", "FLEXIBLE"] as const;

export default function NewRequirementPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState({
    budgetMin: "",
    budgetMax: "",
    city: "",
    areas: "",
    propertyType: "RESIDENTIAL",
    dealType: "SALE",
    areaSqftMin: "",
    areaSqftMax: "",
    urgency: "FLEXIBLE",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setErr(null);
    const areas = form.areas.split(",").map((s) => s.trim()).filter(Boolean);
    try {
      await apiFetch("/requirements", {
        method: "POST",
        token,
        body: JSON.stringify({
          budgetMin: Number(form.budgetMin),
          budgetMax: Number(form.budgetMax),
          city: form.city,
          areas: areas.length ? areas : [form.city],
          propertyType: form.propertyType,
          dealType: form.dealType,
          areaSqftMin: Number(form.areaSqftMin),
          areaSqftMax: Number(form.areaSqftMax),
          urgency: form.urgency,
        }),
      });
      router.push("/requirements");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
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

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-xl font-semibold">Post requirement</h1>
      <form onSubmit={submit} className="mt-6 space-y-3 text-sm">
        <label className="block">
          Budget min–max (INR)
          <div className="mt-1 flex gap-2">
            <input
              required
              type="number"
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.budgetMin}
              onChange={(e) => setForm((f) => ({ ...f, budgetMin: e.target.value }))}
            />
            <input
              required
              type="number"
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.budgetMax}
              onChange={(e) => setForm((f) => ({ ...f, budgetMax: e.target.value }))}
            />
          </div>
        </label>
        <label className="block">
          City
          <input
            required
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
          />
        </label>
        <label className="block">
          Areas (comma-separated)
          <input
            required
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={form.areas}
            onChange={(e) => setForm((f) => ({ ...f, areas: e.target.value }))}
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            Property type
            <select
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.propertyType}
              onChange={(e) => setForm((f) => ({ ...f, propertyType: e.target.value }))}
            >
              {PT.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>
          <label>
            Deal type
            <select
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.dealType}
              onChange={(e) => setForm((f) => ({ ...f, dealType: e.target.value }))}
            >
              {DT.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            Sqft min
            <input
              required
              type="number"
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.areaSqftMin}
              onChange={(e) => setForm((f) => ({ ...f, areaSqftMin: e.target.value }))}
            />
          </label>
          <label>
            Sqft max
            <input
              required
              type="number"
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.areaSqftMax}
              onChange={(e) => setForm((f) => ({ ...f, areaSqftMax: e.target.value }))}
            />
          </label>
        </div>
        <label>
          Urgency
          <select
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={form.urgency}
            onChange={(e) => setForm((f) => ({ ...f, urgency: e.target.value }))}
          >
            {UR.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </label>
        {err && <p className="text-red-400">{err}</p>}
        <button type="submit" className="rounded-lg bg-teal-600 px-4 py-2 text-white">
          Submit
        </button>
      </form>
    </div>
  );
}
