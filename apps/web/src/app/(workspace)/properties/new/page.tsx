"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";

const PT = ["RESIDENTIAL", "COMMERCIAL", "PLOT", "INSTITUTIONAL"] as const;
const DT = ["SALE", "RENT"] as const;

export default function NewPropertyPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    propertyType: "RESIDENTIAL",
    dealType: "SALE",
    price: "",
    areaSqft: "",
    city: "",
    areaPublic: "",
    localityPublic: "",
    addressPrivate: "Private — not shown publicly",
    latitude: "28.6139",
    longitude: "77.209",
    organizationId: "",
    imageUrlsText: "",
    isHighOpportunity: false,
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setErr(null);
    const imageUrls = form.imageUrlsText
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await apiFetch("/properties", {
        method: "POST",
        token,
        body: JSON.stringify({
          title: form.title,
          description: form.description || undefined,
          propertyType: form.propertyType,
          dealType: form.dealType,
          price: Number(form.price),
          areaSqft: Number(form.areaSqft),
          city: form.city,
          areaPublic: form.areaPublic,
          localityPublic: form.localityPublic,
          addressPrivate: form.addressPrivate,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
          organizationId: form.organizationId || undefined,
          imageUrls: imageUrls.length ? imageUrls : undefined,
          isHighOpportunity: form.isHighOpportunity,
        }),
      });
      router.push("/properties");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    }
  }

  async function mockUpload(files: FileList | null) {
    if (!token || !files?.length) return;
    setUploadMsg(null);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const res = await apiFetch<{ publicUrl: string }>("/properties/upload-url", {
          method: "POST",
          token,
          body: JSON.stringify({ fileName: file.name, contentType: file.type }),
        });
        urls.push(res.publicUrl);
      } catch {
        setUploadMsg("Some files failed to generate upload URLs.");
      }
    }
    if (urls.length) {
      setForm((f) => ({
        ...f,
        imageUrlsText: [f.imageUrlsText, ...urls].filter(Boolean).join("\n"),
      }));
      setUploadMsg(`Generated ${urls.length} media URL(s).`);
    }
  }

  if (!token)
    return (
      <p>
        <Link href="/login" className="text-teal-400">
          Log in
        </Link>{" "}
        to post a listing.
      </p>
    );

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-xl font-semibold">Post property</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Do not include phone, email, or URLs in title/description (platform rule).
      </p>
      <form onSubmit={submit} className="mt-6 space-y-3 text-sm">
        <label className="block">
          Title
          <input
            required
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </label>
        <label className="block">
          Description
          <textarea
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            Type
            <select
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.propertyType}
              onChange={(e) => setForm((f) => ({ ...f, propertyType: e.target.value }))}
            >
              {PT.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>
          <label>
            Deal
            <select
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.dealType}
              onChange={(e) => setForm((f) => ({ ...f, dealType: e.target.value }))}
            >
              {DT.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            Price (INR)
            <input
              required
              type="number"
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            />
          </label>
          <label>
            Area (sqft)
            <input
              required
              type="number"
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.areaSqft}
              onChange={(e) => setForm((f) => ({ ...f, areaSqft: e.target.value }))}
            />
          </label>
        </div>
        <label>
          City
          <input
            required
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
          />
        </label>
        <label>
          Area (public)
          <input
            required
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={form.areaPublic}
            onChange={(e) => setForm((f) => ({ ...f, areaPublic: e.target.value }))}
          />
        </label>
        <label>
          Locality (public)
          <input
            required
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={form.localityPublic}
            onChange={(e) => setForm((f) => ({ ...f, localityPublic: e.target.value }))}
          />
        </label>
        <label>
          Lat / Long
          <div className="mt-1 flex gap-2">
            <input
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.latitude}
              onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))}
            />
            <input
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
              value={form.longitude}
              onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))}
            />
          </div>
        </label>
        <label>
          Organization ID (optional — broker team)
          <input
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2"
            value={form.organizationId}
            onChange={(e) => setForm((f) => ({ ...f, organizationId: e.target.value }))}
            placeholder="From “Create broker organization”"
          />
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isHighOpportunity}
            onChange={(e) => setForm((f) => ({ ...f, isHighOpportunity: e.target.checked }))}
          />
          <span>High-Opportunity Investment Deal (distressed / special situation)</span>
        </label>
        <label>
          Upload images (presigned stub)
          <input
            type="file"
            multiple
            accept="image/*"
            className="mt-1 block w-full text-xs text-zinc-400 file:mr-2 file:rounded file:border-0 file:bg-zinc-800 file:px-3 file:py-1 file:text-zinc-200"
            onChange={(e) => void mockUpload(e.target.files)}
          />
        </label>
        {uploadMsg && <p className="text-xs text-zinc-500">{uploadMsg}</p>}
        <label>
          Image URLs (https, one per line)
          <textarea
            className="mt-1 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-xs"
            rows={4}
            value={form.imageUrlsText}
            onChange={(e) => setForm((f) => ({ ...f, imageUrlsText: e.target.value }))}
            placeholder="https://images.unsplash.com/..."
          />
        </label>
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button
          type="submit"
          className="rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-500"
        >
          Publish
        </button>
      </form>
    </div>
  );
}
