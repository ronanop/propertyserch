"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

type Step = "welcome" | "org" | "first_listing" | "complete";

export default function OnboardingPage() {
  const { token, user, refreshProfile } = useAuth();
  const [step, setStep] = useState<Step>("welcome");
  const [msg, setMsg] = useState<string | null>(null);
  const [role, setRole] = useState("BUYER");
  const [areas, setAreas] = useState("");
  const [reraId, setReraId] = useState("");
  const [buyerBudget, setBuyerBudget] = useState("");
  const [country, setCountry] = useState("");

  async function persist(next: string) {
    if (!token) return;
    await apiFetch("/user/onboarding", {
      method: "PUT",
      token,
      body: JSON.stringify({ step: next }),
    });
    await refreshProfile();
    setMsg(null);
  }

  async function saveRoleAndProfile() {
    if (!token) return;
    await apiFetch("/user/role", {
      method: "PUT",
      token,
      body: JSON.stringify({ role }),
    });
    await apiFetch("/user/profile", {
      method: "PUT",
      token,
      body: JSON.stringify({
        serviceAreas: areas
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        reraId: reraId || undefined,
        name:
          role === "BUYER" && buyerBudget
            ? `${user?.name ?? "Buyer"} (budget ${buyerBudget})`
            : role === "NRI" && country
              ? `${user?.name ?? "NRI"} (${country})`
              : user?.name ?? undefined,
      }),
    });
    await refreshProfile();
    setMsg("Saved profile details");
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
      <h1 className="text-xl font-semibold">Onboarding</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Role: <span className="text-zinc-300">{user?.role}</span> — pick a path; progress is stored on
        your profile.
      </p>
      <div className="mt-6 space-y-3 text-sm">
        {step === "welcome" && (
          <>
            <p>Welcome to AR Buildwel — connect listings, requirements, and institutional flow.</p>
            <label className="block text-sm">
              Select your role
              <select
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
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
            <label className="block text-sm">
              Service areas (comma-separated)
              <input
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
                value={areas}
                onChange={(e) => setAreas(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              Personal RERA ID (optional)
              <input
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
                value={reraId}
                onChange={(e) => setReraId(e.target.value)}
              />
            </label>
            {role === "BUYER" && (
              <label className="block text-sm">
                Budget preference
                <input
                  className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
                  value={buyerBudget}
                  onChange={(e) => setBuyerBudget(e.target.value)}
                  placeholder="e.g. 2Cr-4Cr"
                />
              </label>
            )}
            {role === "NRI" && (
              <label className="block text-sm">
                Country of residence
                <input
                  className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </label>
            )}
            <button
              type="button"
              onClick={async () => {
                await saveRoleAndProfile();
                setStep("org");
                void persist("org");
              }}
              className="rounded bg-teal-600 px-4 py-2 text-white"
            >
              Continue
            </button>
          </>
        )}
        {step === "org" && (
          <>
            <p>Create or join a broker organization (team inbox & CRM).</p>
            <Link href="/organizations/setup" className="inline-block text-teal-400 underline">
              Organization setup
            </Link>
            <button
              type="button"
              className="ml-4 rounded border border-zinc-600 px-3 py-2"
              onClick={() => {
                setStep("first_listing");
                void persist("first_listing");
              }}
            >
              Skip
            </button>
          </>
        )}
        {step === "first_listing" && (
          <>
            <p>Post your first property or requirement to activate matching.</p>
            <div className="flex gap-2">
              <Link href="/properties/new" className="text-teal-400 underline">
                Post property
              </Link>
              <Link href="/requirements/new" className="text-teal-400 underline">
                Post requirement
              </Link>
            </div>
            <button
              type="button"
              className="mt-4 rounded bg-teal-600 px-4 py-2 text-white"
              onClick={() => {
                setStep("complete");
                void persist("complete");
              }}
            >
              Finish onboarding
            </button>
          </>
        )}
        {step === "complete" && (
          <p className="text-teal-400">
            You are ready — use the sidebar for day-to-day workflows.
            {(msg || user?.role) && (
              <span className="block text-zinc-500">
                {msg ?? ""} {user?.role ? `Role: ${user.role}` : ""}
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
