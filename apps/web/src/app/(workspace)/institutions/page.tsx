"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Inst = {
  id: string;
  institutionType: string;
  city: string;
  maskedSummary: string | null;
  askingPriceCr: unknown;
  studentEnrollment: number | null;
};

export default function InstitutionsPage() {
  const [rows, setRows] = useState<Inst[]>([]);

  useEffect(() => {
    apiFetch<Inst[]>("/institutions")
      .then(setRows)
      .catch(() => setRows([]));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Institutional listings</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Names are masked until NDA + verified buyer access (vision §7).
      </p>
      <ul className="mt-6 space-y-3">
        {rows.map((i) => (
          <li key={i.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
            <Link href={`/institutions/${i.id}`} className="font-medium text-teal-400 hover:underline">
              {i.maskedSummary ?? `${i.institutionType} in ${i.city}`}
            </Link>
            <p className="text-sm text-zinc-500">
              {i.city} · ~₹{String(i.askingPriceCr)} Cr
              {i.studentEnrollment != null ? ` · ~${i.studentEnrollment} students` : ""}
            </p>
          </li>
        ))}
      </ul>
      {rows.length === 0 && (
        <p className="mt-8 text-zinc-500">No institutional listings — post one via API or admin seed.</p>
      )}
    </div>
  );
}
