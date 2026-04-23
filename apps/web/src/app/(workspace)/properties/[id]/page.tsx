"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

type Prop = {
  id: string;
  title: string;
  description: string | null;
  city: string;
  areaPublic: string;
  localityPublic: string;
  price: unknown;
  areaSqft: number;
  propertyType: string;
  dealType: string;
  trustScore: number;
  presentationLabel?: string;
  imageUrls?: string[];
};

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { token } = useAuth();
  const [p, setP] = useState<Prop | null | undefined>(undefined);
  const [reviews, setReviews] = useState<{ id: string; rating: number; comment: string | null; createdAt: string }[]>([]);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Prop>(`/properties/${id}`)
      .then(setP)
      .catch(() => setP(null));
    apiFetch<{ id: string; rating: number; comment: string | null; createdAt: string }[]>(
      `/reviews/property/${id}`,
    )
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [id]);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setMsg(null);
    await apiFetch(`/reviews/property/${id}`, {
      method: "POST",
      token,
      body: JSON.stringify({ rating: Number(rating), comment: comment || undefined }),
    });
    setComment("");
    setMsg("Review submitted for moderation.");
  }

  if (p === undefined) return <p className="text-zinc-500">Loading…</p>;
  if (p === null) return <p className="text-zinc-500">Not found</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/properties" className="text-sm text-zinc-500 hover:text-teal-400">
        ← Properties
      </Link>
      {p.presentationLabel && (
        <p className="mt-2 text-sm font-medium text-amber-400">{p.presentationLabel}</p>
      )}
      <h1 className="mt-2 text-2xl font-semibold">{p.title}</h1>
      <p className="text-zinc-400">
        {p.city} · {p.areaPublic}, {p.localityPublic}
      </p>
      <p className="mt-4 text-lg">
        {String(p.price)} · {p.areaSqft} sqft · {p.propertyType} · {p.dealType}
      </p>
      {p.description && <p className="mt-4 text-zinc-300">{p.description}</p>}
      {p.imageUrls?.length ? (
        <div className="mt-6 grid grid-cols-2 gap-2">
          {p.imageUrls.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={url} src={url} alt="" className="rounded-lg object-cover" />
          ))}
        </div>
      ) : null}
      <p className="mt-6 text-xs text-zinc-600">
        Contact details are not shown publicly. Connect via platform representative.
      </p>
      <section className="mt-8 border-t border-zinc-800 pt-6">
        <h2 className="text-lg font-medium text-zinc-200">Reviews</h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-400">
          {reviews.map((r) => (
            <li key={r.id}>
              {"★".repeat(r.rating)} · {r.comment ?? "No comment"} ·{" "}
              {new Date(r.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
        {!reviews.length && <p className="mt-2 text-sm text-zinc-600">No approved reviews yet.</p>}
        {token ? (
          <form onSubmit={submitReview} className="mt-4 space-y-2 text-sm">
            <label>
              Rating
              <select
                className="ml-2 rounded border border-zinc-700 bg-zinc-900 px-2 py-1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                {[5, 4, 3, 2, 1].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>
            <textarea
              className="block w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the interaction?"
            />
            <button type="submit" className="rounded border border-zinc-600 px-3 py-1.5 text-zinc-200">
              Submit review
            </button>
            {msg && <p className="text-xs text-zinc-500">{msg}</p>}
          </form>
        ) : null}
      </section>
    </div>
  );
}
