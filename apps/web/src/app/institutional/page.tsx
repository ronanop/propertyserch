import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Institutional — AR Buildwel",
  description: "Masked listings, NDA-gated data rooms, and broker-orchestrated execution.",
};

export default function InstitutionalLandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-16 text-zinc-100">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-teal-400">
          <Link href="/">← Home</Link>
        </p>
        <h1 className="mt-4 text-3xl font-semibold">Institutional corridor</h1>
        <p className="mt-4 text-zinc-400">
          Browse masked institution profiles, sign NDAs, and unlock deal rooms after orchestration checks.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-block rounded-lg bg-teal-600 px-5 py-2.5 font-medium text-white hover:bg-teal-500"
        >
          Sign in to continue
        </Link>
      </div>
    </div>
  );
}
