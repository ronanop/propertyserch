import { headers } from "next/headers";
import Link from "next/link";
import { getMessages } from "@/lib/i18n";
import { SiteHeader } from "@/components/SiteHeader";

export default async function Home() {
  const h = await headers();
  const locale = h.get("x-locale") ?? "en";
  const m = getMessages(locale);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader locale={locale} messages={m} />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <p className="text-sm font-medium uppercase tracking-wide text-teal-400">
          Real Estate Transaction OS
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
          {m.home.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">{m.home.subtitle}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-teal-600 px-5 py-2.5 font-medium text-white hover:bg-teal-500"
          >
            {m.home.cta}
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-zinc-600 px-5 py-2.5 font-medium hover:bg-zinc-900"
          >
            {m.home.cta2}
          </Link>
        </div>
        <div className="mt-16 border-t border-zinc-800 pt-10">
          <p className="text-sm font-medium text-zinc-300">{m.cities.title}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/city/mumbai" className="text-teal-400 hover:underline">
              {m.cities.mumbai}
            </Link>
            <Link href="/city/delhi" className="text-teal-400 hover:underline">
              {m.cities.delhi}
            </Link>
            <Link href="/city/bengaluru" className="text-teal-400 hover:underline">
              {m.cities.bengaluru}
            </Link>
          </div>
        </div>
        <p className="mt-16 max-w-3xl text-sm text-zinc-500">{m.compliance.disclaimer}</p>
      </main>
    </div>
  );
}
