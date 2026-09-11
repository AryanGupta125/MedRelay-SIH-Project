import Link from "next/link";
import { ArrowRight, Clock, MapPin, Quote } from "lucide-react";
import type { Pharmacy } from "@/lib/data";
import { MEDICINES } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Stars, VerifiedBadge } from "./ui";

export function PharmacyCard({ pharmacy: p }: { pharmacy: Pharmacy }) {
  const inStockCount = MEDICINES.filter((m) => (m.stock.find((s) => s.pharmacyId === p.id)?.qty ?? 0) > 0).length;

  return (
    <div className="card group flex h-full flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href={`/pharmacies/${p.id}`} className="font-display text-base font-bold text-slate-900 transition-colors group-hover:text-blue-700">
            {p.name}
          </Link>
          <div className="mt-1.5 flex items-center gap-2">
            <VerifiedBadge compact />
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
                p.openNow ? "bg-green-50 text-green-700 ring-green-200" : "bg-red-50 text-red-600 ring-red-200",
              )}
            >
              <Clock className="size-3" />
              {p.openNow ? `Open now · till ${p.closesAt}` : `Closed · opens ${p.opensAt}`}
            </span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <Stars rating={p.rating} />
          <p className="mt-0.5 text-[11px] text-slate-400">
            {p.rating} · {p.ratingCount.toLocaleString("en-IN")} ratings
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold">
        <span className="chip !py-1">
          <MapPin className="size-3 text-blue-600" /> {p.distanceKm} km away
        </span>
        <span className="chip !py-1">
          <Clock className="size-3 text-green-600" /> Delivery in {p.etaMin}–{p.etaMax} min
        </span>
        <span className="chip !py-1">{inStockCount} medicines in stock</span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-500">{p.address}</p>

      <div className="mt-3 flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-500 italic">
        <Quote className="mt-0.5 size-3.5 shrink-0 text-slate-300" />
        {p.reviewHighlight}
      </div>

      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="text-[10px] font-medium tracking-wide text-slate-400">Lic. {p.licenseNo}</span>
        <Link
          href={`/pharmacies/${p.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
        >
          View Pharmacy <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
