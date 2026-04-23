"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

export default function BillingPage() {
  const { token } = useAuth();
  const [out, setOut] = useState<string | null>(null);

  async function checkout() {
    if (!token) return;
    const res = await apiFetch<{ url: string; message: string }>("/billing/checkout-session", {
      method: "POST",
      token,
      body: JSON.stringify({ plan: "Broker Pro (annual)", sku: "broker_pro" }),
    });
    setOut(`${res.message}\n${res.url}`);
  }

  if (!token)
    return (
      <p>
        <Link href="/login" className="text-teal-400">
          Log in
        </Link>{" "}
        for subscription checkout.
      </p>
    );

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-xl font-semibold">Monetization</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Phase 1 stub — returns a placeholder checkout URL. Wire Stripe or Razorpay for production.
      </p>
      <button
        type="button"
        onClick={() => void checkout()}
        className="mt-6 rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-500"
      >
        Start Broker Pro checkout (stub)
      </button>
      {out && (
        <pre className="mt-6 whitespace-pre-wrap rounded border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-400">
          {out}
        </pre>
      )}
    </div>
  );
}
