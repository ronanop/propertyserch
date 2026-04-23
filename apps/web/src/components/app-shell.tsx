"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/properties", label: "Properties" },
  { href: "/properties/new", label: "Post property" },
  { href: "/requirements", label: "Requirements" },
  { href: "/requirements/new", label: "Post requirement" },
  { href: "/matches", label: "Matches" },
  { href: "/deals", label: "Deals" },
  { href: "/crm", label: "CRM leads" },
  { href: "/notifications", label: "Notifications" },
  { href: "/institutions", label: "Institutions" },
  { href: "/auctions", label: "Auctions" },
  { href: "/verticals/nri", label: "NRI" },
  { href: "/verticals/hni", label: "HNI" },
  { href: "/partners", label: "Partners" },
  { href: "/irm", label: "IRM" },
  { href: "/billing", label: "Billing" },
  { href: "/search", label: "Search" },
  { href: "/analytics", label: "Analytics" },
  { href: "/compliance", label: "Compliance" },
  { href: "/services-hub", label: "Legal & loans" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/reputation", label: "Reputation" },
  { href: "/settings/notifications", label: "Alert prefs" },
  { href: "/admin/audit", label: "Audit (admin)" },
  { href: "/admin/reviews", label: "Reviews (admin)" },
  { href: "/phase2", label: "Phase 2" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, token } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-56 shrink-0 border-r border-zinc-800 bg-zinc-900/50 p-4 md:block">
          <Link href="/" className="block font-semibold text-teal-400">
            AR Buildwel
          </Link>
          <nav className="mt-6 flex flex-col gap-1 text-sm">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded px-2 py-1.5 hover:bg-zinc-800 ${
                  pathname === item.href ? "bg-zinc-800 text-white" : "text-zinc-400"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <div className="flex flex-wrap gap-2 md:hidden">
              <Link href="/dashboard" className="text-sm text-teal-400">
                Menu
              </Link>
            </div>
            <div className="ml-auto flex items-center gap-3 text-sm text-zinc-400">
              {user && (
                <span>
                  <span className="text-zinc-200">{user.role}</span>
                  {user.verified && (
                    <span className="ml-2 rounded bg-teal-900/50 px-1.5 text-xs text-teal-300">
                      Verified
                    </span>
                  )}
                </span>
              )}
              {token ? (
                <button
                  type="button"
                  onClick={() => logout()}
                  className="rounded border border-zinc-600 px-2 py-1 hover:bg-zinc-800"
                >
                  Log out
                </button>
              ) : (
                <Link href="/login" className="text-teal-400">
                  Log in
                </Link>
              )}
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
