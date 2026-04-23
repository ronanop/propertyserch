import Link from "next/link";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function SiteHeader({
  locale,
  messages,
}: {
  locale: string;
  messages: { nav: { login: string; dashboard: string; blog: string } };
}) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight text-teal-400">
          AR Buildwel
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-300">
          <Link href="/blog" className="hover:text-white">
            {messages.nav.blog}
          </Link>
          <Link href="/dashboard" className="hover:text-white">
            {messages.nav.dashboard}
          </Link>
          <Link href="/login" className="hover:text-white">
            {messages.nav.login}
          </Link>
          <LocaleSwitcher locale={locale} />
        </nav>
      </div>
    </header>
  );
}
