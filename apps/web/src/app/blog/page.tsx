import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — AR Buildwel",
  description:
    "Guides for buyers, brokers, NRIs, institutional acquisitions, and compliance in Indian real estate.",
  openGraph: {
    title: "AR Buildwel Blog",
    description: "Market trends, legal basics, and deal execution playbooks.",
  },
};

const posts = [
  { slug: "buying-property-india-2026", title: "Complete Guide to Buying Property in India (2026)" },
  { slug: "verify-documents", title: "How to Verify Property Documents in India" },
  { slug: "nri-guide", title: "NRI Guide to Buying Property in India" },
  { slug: "buy-school-india", title: "How to Buy a School in India — Overview" },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-16 text-zinc-100">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold">Blog</h1>
        <p className="mt-2 text-zinc-400">
          SEO-ready article list (CMS wiring can replace static entries in Phase 1).
        </p>
        <ul className="mt-10 space-y-4">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="text-teal-400 hover:underline">
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-12 text-sm text-zinc-500">
          <Link href="/" className="text-zinc-400 hover:text-white">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
