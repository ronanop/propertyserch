import type { Metadata } from "next";
import Link from "next/link";

const CITIES = ["mumbai", "delhi", "bengaluru", "hyderabad", "pune", "chennai", "kolkata"] as const;

type Props = { params: Promise<{ city: string }> };

export function generateStaticParams() {
  return CITIES.map((city) => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const title = city.charAt(0).toUpperCase() + city.slice(1);
  return {
    title: `${title} — AR Buildwel`,
    description: `Structured real estate deals, institutional listings, and broker CRM in ${title}.`,
    openGraph: { title: `${title} | AR Buildwel` },
  };
}

export default async function CitySeoPage({ params }: Props) {
  const { city } = await params;
  const label = city.charAt(0).toUpperCase() + city.slice(1);
  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-16 text-zinc-100">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-teal-400">
          <Link href="/">← Home</Link>
        </p>
        <h1 className="mt-4 text-3xl font-semibold">{label}</h1>
        <p className="mt-4 text-zinc-400">
          SEO landing (Module 16): city routes for discovery. Browse masked institutional inventory and
          broker listings after sign-in.
        </p>
        <ul className="mt-8 list-disc space-y-2 pl-6 text-sm text-zinc-300">
          <li>
            <Link className="text-teal-400 hover:underline" href="/login">
              Log in
            </Link>{" "}
            for dashboards
          </li>
          <li>Requirements and matches are scoped to verified workflows</li>
        </ul>
      </div>
    </div>
  );
}
