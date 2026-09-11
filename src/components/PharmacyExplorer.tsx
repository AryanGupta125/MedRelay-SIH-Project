"use client";

import { useMemo, useState } from "react";
import { Clock, Search, ShieldCheck, Store } from "lucide-react";
import { PHARMACIES } from "@/lib/data";
import { cn } from "@/lib/utils";
import { PharmacyCard } from "./PharmacyCard";
import { EmptyState } from "./ui";

export function PharmacyExplorer() {
  const [query, setQuery] = useState("");
  const [openOnly, setOpenOnly] = useState(false);
  const [sort, setSort] = useState<"distance" | "rating" | "eta">("distance");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = PHARMACIES.filter((p) => {
      if (openOnly && !p.openNow) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.area.toLowerCase().includes(q) || p.address.toLowerCase().includes(q);
    });
    if (sort === "rating") out = [...out].sort((a, b) => b.rating - a.rating);
    if (sort === "eta") out = [...out].sort((a, b) => a.etaMin - b.etaMin);
    else if (sort === "distance") out = [...out].sort((a, b) => a.distanceKm - b.distanceKm);
    return out;
  }, [query, openOnly, sort]);

  return (
    <div className="container-x py-10">
      <div className="anim-fade-up mb-8">
        <p className="text-xs font-bold tracking-[0.18em] text-blue-600 uppercase">Pharmacies near you</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Verified pharmacies around HSR Layout
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
          Every store below is licence-checked and verified by MedRelay before it can receive orders.
        </p>
      </div>

      {/* trust banner */}
      <div className="anim-fade-up mb-6 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border border-green-200 bg-green-50/70 px-5 py-4 [animation-delay:70ms]">
        <span className="flex items-center gap-2 text-sm font-bold text-green-800">
          <ShieldCheck className="size-5" /> 100% licence-verified network
        </span>
        <span className="text-xs text-green-700">Drug licences, GST and pharmacist credentials are checked during onboarding and re-verified periodically.</span>
      </div>

      {/* filters */}
      <div className="card anim-fade-up mb-6 flex flex-col gap-3 p-4 [animation-delay:120ms] sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pharmacy name or area..."
            className="input-field !pl-10"
            aria-label="Search pharmacies"
          />
        </div>
        <div className="flex items-center gap-2.5">
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="input-field w-auto !py-2 text-xs font-semibold" aria-label="Sort pharmacies">
            <option value="distance">Nearest first</option>
            <option value="eta">Fastest delivery</option>
            <option value="rating">Highest rated</option>
          </select>
          <button
            onClick={() => setOpenOnly((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors",
              openOnly ? "border-green-300 bg-green-50 text-green-700" : "border-slate-200 text-slate-500 hover:bg-slate-50",
            )}
            aria-pressed={openOnly}
          >
            <Clock className="size-4" /> Open now
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={Store} title="No pharmacies match" sub="Try another area name, or clear the filters to see every verified store nearby." />
      ) : (
        <div className="grid gap-4 pb-10 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <PharmacyCard key={p.id} pharmacy={p} />
          ))}
        </div>
      )}
    </div>
  );
}
