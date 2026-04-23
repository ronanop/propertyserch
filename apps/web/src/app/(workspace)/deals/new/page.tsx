import { Suspense } from "react";
import { NewDealForm } from "./inner";

export default function NewDealPage() {
  return (
    <Suspense fallback={<p className="text-zinc-500">Loading…</p>}>
      <NewDealForm />
    </Suspense>
  );
}
