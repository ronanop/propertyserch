"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [role, setRole] = useState("BUYER");
  const [token, setToken] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function sendOtp() {
    setErr(null);
    try {
      await apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ phone }) });
      setStep("otp");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    }
  }

  async function verify() {
    setErr(null);
    try {
      const res = await apiFetch<{ accessToken: string }>("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ phone, otp, role }),
      });
      setToken(res.accessToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", res.accessToken);
      }
      router.replace("/dashboard");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-16 text-zinc-100">
      <div className="mx-auto max-w-md rounded-xl border border-zinc-800 bg-zinc-900/50 p-8">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-2 text-sm text-zinc-400">
          OTP dev mode uses <code className="text-teal-400">123456</code> when API has{" "}
          <code className="text-teal-400">OTP_DEV_MODE=true</code>.
        </p>
        {step === "phone" ? (
          <div className="mt-6 space-y-4">
            <label className="block text-sm">
              Mobile
              <input
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
              />
            </label>
            <button
              type="button"
              onClick={sendOtp}
              className="w-full rounded-lg bg-teal-600 py-2 font-medium hover:bg-teal-500"
            >
              Send OTP
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <label className="block text-sm">
              OTP
              <input
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
              />
            </label>
            <label className="block text-sm">
              Role
              <select
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="BROKER">Broker</option>
                <option value="BUYER">Buyer</option>
                <option value="SELLER">Seller</option>
                <option value="NRI">NRI</option>
                <option value="HNI">HNI</option>
                <option value="INSTITUTIONAL_SELLER">Institutional seller</option>
                <option value="INSTITUTIONAL_BUYER">Institutional buyer</option>
              </select>
            </label>
            <button
              type="button"
              onClick={verify}
              className="w-full rounded-lg bg-teal-600 py-2 font-medium hover:bg-teal-500"
            >
              Verify
            </button>
          </div>
        )}
        {err && <p className="mt-4 text-sm text-red-400">{err}</p>}
        {token && (
          <p className="mt-4 break-all text-xs text-zinc-500">
            Token stored. <Link href="/dashboard" className="text-teal-400">Open dashboard</Link>
          </p>
        )}
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-zinc-400 hover:text-white">
            Back home
          </Link>
        </p>
      </div>
    </div>
  );
}
