"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus, Star } from "lucide-react";
import type { Medicine } from "@/lib/data";
import { availableAts, nearestPharmacyWith, stockAt } from "@/lib/data";
import { useApp } from "@/lib/store";
import { cn, discountPct, inr } from "@/lib/utils";
import { useMounted } from "@/lib/useMounted";
import { RxBadge, StockPill } from "./ui";

export function AddToCartControls({ medicineId, size = "md" }: { medicineId: string; size?: "md" | "lg" }) {
  const location = useApp((s) => s.location);
  const qty = useApp((s) => s.cart.find((c) => c.medicineId === medicineId)?.qty ?? 0);
  const addToCart = useApp((s) => s.addToCart);
  const setQty = useApp((s) => s.setQty);
  const mounted = useMounted();

  const base = size === "lg" ? "h-11 text-sm" : "h-9 text-xs";

  if (mounted && !location.isServiceable) {
    return (
      <button
        disabled
        title="Service currently not available in your location (Outside Maharashtra)"
        className={cn(
          "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 font-bold text-slate-400 cursor-not-allowed opacity-80 whitespace-nowrap",
          base,
          size === "lg" ? "px-4 text-xs" : "px-3 text-[11px]",
        )}
      >
        Out of Stock
      </button>
    );
  }

  if (!mounted || qty === 0) {
    return (
      <button
        onClick={() => addToCart(medicineId)}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 font-bold text-white shadow-[var(--shadow-cta)] transition-all hover:bg-blue-700 active:scale-95",
          base,
          size === "lg" ? "px-6" : "px-4",
        )}
      >
        <Plus className="size-4" /> Add
      </button>
    );
  }

  return (
    <div className={cn("inline-flex items-center rounded-xl bg-blue-600 font-bold text-white shadow-[var(--shadow-cta)]", base)}>
      <button onClick={() => setQty(medicineId, qty - 1)} className={cn("grid h-full w-9 place-items-center rounded-l-xl transition-colors hover:bg-blue-700", size === "lg" && "w-11")} aria-label="Decrease quantity">
        <Minus className="size-4" />
      </button>
      <span className="min-w-6 text-center text-sm tabular-nums">{qty}</span>
      <button onClick={() => addToCart(medicineId)} className={cn("grid h-full w-9 place-items-center rounded-r-xl transition-colors hover:bg-blue-700", size === "lg" && "w-11")} aria-label="Increase quantity">
        <Plus className="size-4" />
      </button>
    </div>
  );
}

export function MedicineCard({ medicine: m }: { medicine: Medicine }) {
  const location = useApp((s) => s.location);
  const mounted = useMounted();
  const nearby = availableAts(m);
  const best = nearestPharmacyWith(m);
  const off = discountPct(m.price, m.mrp);

  const isUnserviceable = mounted && !location.isServiceable;

  return (
    <div className="card group flex flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[var(--shadow-lift)]">
      <div className="mb-1 flex items-start justify-between gap-2">
        <Link href={`/medicines/${m.id}`} className="font-display text-[15px] leading-snug font-bold text-slate-900 transition-colors group-hover:text-blue-700">
          {m.name}
        </Link>
        {m.requiresPrescription && <RxBadge />}
      </div>
      <p className="text-xs text-slate-500">
        {m.form} · {m.strength} · {m.packSize}
      </p>
      <p className="mt-0.5 text-[11px] text-slate-400">by {m.manufacturer}</p>

      <div className="mt-3 flex items-center gap-1.5 text-xs">
        <Star className="size-3.5 fill-amber-400 text-amber-400" />
        <span className="font-semibold text-slate-700">{m.rating}</span>
        <span className="text-slate-400">({m.ratingCount.toLocaleString("en-IN")})</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {isUnserviceable ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-700 border border-red-100">
            Out of Stock (Service Unavailable)
          </span>
        ) : (
          <>
            <StockPill qty={best ? stockAt(m, best.id) : 0} />
            {best ? (
              <span className="text-[11px] font-medium text-slate-500">
                {nearby.length} {nearby.length === 1 ? "pharmacy" : "pharmacies"} nearby · {best.etaMin}-{best.etaMax} min
              </span>
            ) : (
              <span className="text-[11px] font-medium text-red-500">Not stocked nearby</span>
            )}
          </>
        )}
      </div>

      <div className="mt-auto flex items-end justify-between pt-4">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-lg font-bold text-slate-900">{inr(m.price)}</span>
            {off > 0 && <span className="text-xs text-slate-400 line-through">{inr(m.mrp)}</span>}
          </div>
          {off > 0 && <span className="text-[11px] font-semibold text-green-600">{off}% off</span>}
        </div>
        <AddToCartControls medicineId={m.id} />
      </div>
    </div>
  );
}
