"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

type Status = Record<string, string>;

export default function Phase2WorkspacePage() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    fetch(apiUrl("/phase2/status"))
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ error: "API unreachable" }));
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold">Phase 2 — Intelligence & scale</h1>
      <p className="mt-2 text-zinc-400">
        Stubs are live on the API for ML scoring, auction crawlers, chat, escrow intent, and ecosystem
        APIs. This page reflects{" "}
        <code className="text-teal-400">GET /phase2/status</code>.
      </p>
      {status && (
        <ul className="mt-8 list-disc space-y-2 pl-6 text-sm text-zinc-300">
          {Object.entries(status).map(([k, v]) => (
            <li key={k}>
              <span className="text-zinc-100">{k}</span>: {v}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-8 text-xs text-zinc-600">
        Authenticated routes: POST /phase2/ml/score-preview, /auction-crawler/trigger, /chat/thread,
        /escrow/intent — use API client with JWT.
      </p>
    </div>
  );
}
