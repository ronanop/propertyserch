import type { Metadata } from "next";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, " ")} — AR Buildwel`,
    description: "Educational article placeholder. Replace with CMS-driven content.",
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  return (
    <article className="min-h-screen bg-zinc-950 px-4 py-16 text-zinc-100">
      <div className="mx-auto max-w-3xl">
        <h1 className="capitalize">{slug.replace(/-/g, " ")}</h1>
        <p>
          This is a static placeholder route for SEO and internal linking. Hook your CMS or MDX
          pipeline here.
        </p>
        <p className="text-sm text-zinc-500">
          Disclaimer: not legal or financial advice; consult qualified professionals.
        </p>
        <p>
          <Link href="/blog" className="text-teal-400">
            Back to blog
          </Link>
        </p>
      </div>
    </article>
  );
}
