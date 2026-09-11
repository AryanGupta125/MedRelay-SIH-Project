"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, MapPin, RefreshCcw } from "lucide-react";
import { PHARMACIES, getMedicine, stockAt } from "@/lib/data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { StockPill, VerifiedBadge } from "./ui";

export function AvailabilityList({ medicineId }: { medicineId: string }) {
  const m = getMedicine(medicineId);
  const pharmacyId = useApp((s) => s.pharmacyId);
  const setPharmacyId = useApp((s) => s.setPharmacyId);
  const [mounted, setMounted] = useState(false);
  const [justPicked, setJustPicked] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!justPicked) return;
    const t = setTimeout(() => setJustPicked(null), 2200);
    return () => clearTimeout(t);
  }, [justPicked]);

  if (!m) return null;

  const rows = [...PHARMACIES].sort((a, b) => a.distanceKm - b.distanceKm);
  const selected = mounted ? pharmacyId : null;

  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 text-xs text-slate-500">
        <RefreshCcw className="size-3.5 text-blue-600" />
        Can&apos;t be fulfilled at one store? We automatically redirect your order to the nearest verified pharmacy with
        stock.
      </p>
      {rows.map((p) => {
        const qty = stockAt(m, p.id);
        const isSelected = selected === p.id;
        return (
          <div
            key={p.id}
            className={cn(
              "card flex flex-wrap items-center gap-3 p-4 transition-all duration-300 sm:flex-nowrap",
              qty === 0 && "opacity-75",
              isSelected && "border-green-400 bg-green-50/40 ring-2 ring-green-100",
            )}
          >
            <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl font-display text-xs font-bold text-white", qty > 0 ? "bg-blue-600" : "bg-slate-300")}>
              {p.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/pharmacies/${p.id}`} className="text-sm font-bold text-slate-900 hover:text-blue-700">
                  {p.name}
                </Link>
                <VerifiedBadge compact />
                {!p.openNow && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">Closed</span>}
              </div>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                <MapPin className="size-3" /> {p.distanceKm} km · Delivery in {p.etaMin}–{p.etaMax} min
              </p>
            </div>
            <StockPill qty={p.openNow ? qty : 0} />
            {qty > 0 && p.openNow ? (
              <button
                onClick={() => {
                  setPharmacyId(p.id);
                  setJustPicked(p.id);
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all",
                  isSelected ? "bg-green-600 text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100",
                )}
              >
                {isSelected ? (
                  <>
                    <CheckCircle2 className="size-4" /> Selected
                  </>
                ) : justPicked === p.id ? (
                  <>
                    <CheckCircle2 className="size-4" /> Selected
                  </>
                ) : (
                  <>
                    Fulfil from here <ArrowRight className="size-3.5" />
                  </>
                )}
              </button>
            ) : (
              <span className="rounded-xl bg-slate-50 px-3.5 py-2 text-[11px] font-semibold text-slate-400">
                We&apos;ll redirect automatically
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
