"use client";

import type { MediaAsset } from "@docs/lib/media-catalog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@repo/shadcn-ui/components/ui/dialog";
import { ArrowUpRight, Copy, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const actionClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50";

function AssetCard({ asset }: { asset: MediaAsset }) {
  const [feedback, setFeedback] = useState("");
  const [copying, setCopying] = useState(false);
  const attempt = useRef(0);
  useEffect(
    () => () => {
      attempt.current += 1;
    },
    []
  );
  const copy = async (text: string, label: string) => {
    const current = ++attempt.current;
    setCopying(true);
    setFeedback("");
    try {
      await navigator.clipboard.writeText(text);
      if (current === attempt.current) {
        setFeedback(`${label} copied.`);
      }
    } catch {
      if (current === attempt.current) {
        setFeedback(
          "Could not copy. Select the source below and copy it manually."
        );
      }
    } finally {
      if (current === attempt.current) {
        setCopying(false);
      }
    }
  };
  return (
    <Dialog
      onOpenChange={() => {
        attempt.current += 1;
        setCopying(false);
        setFeedback("");
      }}
    >
      <DialogTrigger asChild>
        <button
          aria-label={`Preview ${asset.id}`}
          className="group overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4"
          data-media-card
          type="button"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <Image
              alt={asset.alt}
              className={
                asset.category === "Card art"
                  ? "object-contain"
                  : "object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.025] motion-reduce:transition-none"
              }
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              src={`${asset.src}?tr=w-640,f-auto`}
              unoptimized
            />
            <span
              aria-hidden
              className="absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm"
            >
              <ArrowUpRight className="size-4" />
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 p-4">
            <span className="truncate font-medium text-sm">
              {asset.title ?? asset.id}
            </span>
            <span className="shrink-0 text-muted-foreground text-xs">
              {asset.category}
            </span>
          </div>
          <p className="px-4 pb-4 text-muted-foreground text-xs">
            {asset.usage.length > 0
              ? `${asset.usage.length} demo${asset.usage.length === 1 ? "" : "s"}`
              : "Available · no demo references"}
          </p>
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[92dvh] gap-4 overflow-y-auto p-4 motion-reduce:animate-none sm:max-w-5xl sm:p-6 [&>button]:size-11">
        <div className="pr-10">
          <DialogTitle className="font-title text-xl">
            {asset.title ?? asset.id}
          </DialogTitle>
          <DialogDescription className="mt-1">
            {asset.category} · {asset.alt}
          </DialogDescription>
        </div>
        <div className="relative h-[45dvh] min-h-48 rounded-xl border border-border bg-muted/40 sm:h-[55dvh]">
          <Image
            alt={asset.alt}
            className="object-contain"
            fill
            sizes="90vw"
            src={asset.src}
            unoptimized
          />
        </div>
        <section aria-label="Image usage" className="space-y-2">
          <h3 className="font-medium text-sm">Used in</h3>
          {asset.usage.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {asset.usage.map((demo) => {
                const label = demo === "landing" ? "Landing page" : demo;
                return (
                  <Link
                    className={actionClass}
                    href={demo === "landing" ? "/" : `/docs/components/${demo}`}
                    key={demo}
                  >
                    {label}
                    <ArrowUpRight aria-hidden className="size-4" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No component demo references. Kept in the library for review and
              reuse.
            </p>
          )}
        </section>
        <div className="flex flex-wrap gap-2">
          <button
            className={actionClass}
            disabled={copying}
            onClick={() => copy(asset.src, "Source URL")}
            type="button"
          >
            <Copy aria-hidden className="size-4" />
            Copy URL
          </button>
          <button
            className={actionClass}
            disabled={copying}
            onClick={() => copy(asset.code, "Code reference")}
            type="button"
          >
            <Copy aria-hidden className="size-4" />
            Copy reference
          </button>
          <a
            className={actionClass}
            href={asset.src}
            rel="noopener noreferrer"
            target="_blank"
          >
            Open original
            <ArrowUpRight aria-hidden className="size-4" />
          </a>
        </div>
        <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-3">
          <p className="select-all break-all font-mono text-xs">{asset.src}</p>
          <p className="select-all break-all font-mono text-muted-foreground text-xs">
            {asset.code}
          </p>
        </div>
        <p className="min-h-5 text-muted-foreground text-sm" role="status">
          {feedback}
        </p>
      </DialogContent>
    </Dialog>
  );
}

export function MediaLibrary({ assets }: { assets: MediaAsset[] }) {
  const [category, setCategory] = useState("All");
  const [gender, setGender] = useState("All people");
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("All images");
  const categories = ["All", ...new Set(assets.map((asset) => asset.category))];
  const needle = query.trim().toLowerCase();
  const visible = assets.filter(
    (asset) =>
      (category === "All" || category === asset.category) &&
      (category !== "People" ||
        gender === "All people" ||
        (asset.gender ?? "unspecified") === gender) &&
      (collection === "All images" ||
        (collection === "Approved abstracts"
          ? asset.approved
          : !asset.approved)) &&
      `${asset.id} ${asset.alt} ${asset.usage.join(" ")}`
        .toLowerCase()
        .includes(needle)
  );
  return (
    <main className="mx-auto max-w-7xl px-6 pt-28 pb-32 sm:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-3 flex items-center gap-2 font-mono text-muted-foreground text-xs uppercase tracking-wider">
            <span aria-hidden className="size-1.5 rounded-full bg-brand" />
            SmoothUI collection
          </p>
          <h1 className="font-semibold font-title text-4xl tracking-tight">
            Image library
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {assets.length} images: blurred, grain-rich backgrounds, generated
            people and animals, and selected objects. Open an image for demo
            usage and its source. Legacy backgrounds are archived, not shown.
          </p>
        </div>
        <label className="flex min-h-11 w-full items-center gap-2 rounded-xl border border-border bg-background px-3 focus-within:outline-2 focus-within:outline-ring sm:w-72">
          <Search aria-hidden className="size-4 text-muted-foreground" />
          <span className="sr-only">Search images</span>
          <input
            className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or subject…"
            type="search"
            value={query}
          />
        </label>
      </header>
      <fieldset
        aria-label="Image collection"
        className="mb-4 flex flex-wrap gap-2"
      >
        {["All images", "Approved abstracts", "People, animals & objects"].map(
          (item) => (
            <button
              aria-pressed={collection === item}
              className={`min-h-11 rounded-lg border px-4 text-sm focus-visible:outline-2 focus-visible:outline-ring ${collection === item ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}
              key={item}
              onClick={() => {
                setCollection(item);
                setCategory("All");
              }}
              type="button"
            >
              {item}
            </button>
          )
        )}
      </fieldset>
      <fieldset
        aria-label="Image category"
        className="mb-6 flex flex-wrap gap-2"
      >
        {categories.map((item) => (
          <button
            aria-pressed={category === item}
            className={`min-h-10 rounded-full border px-4 text-sm focus-visible:outline-2 focus-visible:outline-ring ${category === item ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}
            key={item}
            onClick={() => setCategory(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </fieldset>
      {category === "People" ? (
        <fieldset
          aria-label="People gender"
          className="mb-6 flex flex-wrap gap-2"
        >
          {[
            ["All people", "All people"],
            ["female", "Women"],
            ["male", "Men"],
            ["nonbinary", "Nonbinary"],
            ["unspecified", "Unspecified"],
          ].map(([value, label]) => (
            <button
              aria-pressed={gender === value}
              className={`min-h-11 rounded-lg border px-4 text-sm focus-visible:outline-2 focus-visible:outline-ring ${gender === value ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}
              key={value}
              onClick={() => setGender(value)}
              type="button"
            >
              {label}
            </button>
          ))}
          <p className="w-full text-muted-foreground text-xs">
            Gender follows source catalog labels, never appearance. Unlabeled
            portraits stay unspecified.
          </p>
        </fieldset>
      ) : null}
      <p className="mb-5 font-mono text-muted-foreground text-xs" role="status">
        {visible.length} of {assets.length} images
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((asset) => (
          <AssetCard asset={asset} key={asset.id} />
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="rounded-2xl border border-border border-dashed py-16 text-center text-muted-foreground">
          No images match. Try another name or category.
        </p>
      ) : null}
    </main>
  );
}
