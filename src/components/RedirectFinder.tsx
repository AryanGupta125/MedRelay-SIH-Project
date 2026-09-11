"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { VerifiedBadge } from "./ui";

/**
 * Animated demonstration of automatic pharmacy redirection:
 * Pharmacy A is out of stock → the platform scans nearby verified
 * pharmacies → alternatives appear with a "continue" action.
 */
export function RedirectFinder() {
  // phases: 0 = check at store A, 1 = unavailable + scanning, 2 = alternatives found
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1700);
    const t2 = setTimeout(() => setPhase(2), 3600);
    const t3 = setTimeout(() => setPhase(0), 8600);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [phase]);

  return (
    <div className="card relative overflow-hidden p-5 shadow-[var(--shadow-card)] sm:p-6">
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-green-500" />

      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">Live demo</p>
          <h4 className="font-display text-base font-bold text-slate-900">Azithromycin 250mg</h4>
        </div>
        <span className="chip">Tablet · Strip of 6</span>
      </div>

      {/* Store A */}
      <div
        className={cn(
          "rounded-xl border p-3.5 transition-all duration-500",
          phase >= 1 ? "border-red-200 bg-red-50/60" : "border-slate-200 bg-slate-50",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={cn("grid size-9 place-items-center rounded-lg font-display text-xs font-bold text-white transition-colors", phase >= 1 ? "bg-red-500" : "bg-slate-400")}>
              NM
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">NovaMed Pharmacy</p>
              <p className="text-[11px] text-slate-500">1.2 km · Your selected store</p>
            </div>
          </div>
          {phase === 0 && <Loader2 className="size-4 animate-spin text-blue-600" />}
          {phase >= 1 && (
            <span className="anim-fade-in inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-600">
              <XCircle className="size-3.5" /> Unavailable here
            </span>
          )}
        </div>
      </div>

      {/* Scanning / results */}
      <div className="relative mt-3 min-h-[168px]">
        {phase === 1 && (
          <div className="anim-fade-in absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-blue-200 bg-blue-50/50">
            <span className="relative grid size-12 place-items-center">
              <span className="absolute inset-0 animate-ping-soft rounded-full bg-blue-400/40" />
              <span className="grid size-6 place-items-center rounded-full bg-blue-600">
                <Loader2 className="size-3.5 animate-spin text-white" />
              </span>
            </span>
            <p className="text-sm font-semibold text-blue-700">Finding another nearby verified pharmacy…</p>
          </div>
        )}

        {phase === 2 && (
          <div className="anim-fade-up space-y-2.5">
            {[
              { name: "CityCare Chemists", dist: "1.8 km", eta: "24–34 min", primary: true },
              { name: "MediPoint Plus", dist: "2.6 km", eta: "28–40 min", primary: false },
            ].map((p) => (
              <div
                key={p.name}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border p-3 transition-all",
                  p.primary ? "border-green-300 bg-green-50/60 shadow-sm" : "border-slate-200 bg-white",
                )}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-800">{p.name}</p>
                    <VerifiedBadge compact />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {p.dist} · Delivery {p.eta}
                  </p>
                </div>
                {p.primary ? (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white shadow-[var(--shadow-cta-green)]">
                    <CheckCircle2 className="size-4" /> Continue <ArrowRight className="size-3.5" />
                  </span>
                ) : (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700 ring-1 ring-green-200 ring-inset">
                    <CheckCircle2 className="size-3.5" /> Available
                  </span>
                )}
              </div>
            ))}
            <p className="pt-1 text-center text-[11px] leading-relaxed text-slate-400">
              We automatically find another nearby verified pharmacy when your selected store can&apos;t fulfil the order.
            </p>
          </div>
        )}

        {phase === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs font-medium text-slate-400">Checking live inventory…</p>
          </div>
        )}
      </div>
    </div>
  );
}
