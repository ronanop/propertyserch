"use client";

import { useRouter } from "next/navigation";

export function LocaleSwitcher({ locale }: { locale: string }) {
  const router = useRouter();
  return (
    <select
      aria-label="Language"
      className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-100"
      value={locale}
      onChange={(e) => {
        document.cookie = `NEXT_LOCALE=${e.target.value}; path=/; max-age=31536000`;
        router.refresh();
      }}
    >
      <option value="en">English</option>
      <option value="hi">हिंदी</option>
    </select>
  );
}
