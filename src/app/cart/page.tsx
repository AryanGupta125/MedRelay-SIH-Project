"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileWarning,
  RefreshCcw,
  ShieldCheck,
  ShoppingCart,
  Store,
  Trash2,
  Truck,
} from "lucide-react";
import { AddToCartControls } from "@/components/MedicineCard";
import { EmptyState, RxBadge, StockPill, VerifiedBadge } from "@/components/ui";
import { fulfillmentOptions, getMedicine } from "@/lib/data";
import { useApp } from "@/lib/store";
import { cn, inr } from "@/lib/utils";

export default function CartPage() {
  const location = useApp((s) => s.location);
  const cart = useApp((s) => s.cart);
  const pharmacyId = useApp((s) => s.pharmacyId);
  const setPharmacyId = useApp((s) => s.setPharmacyId);
  const removeFromCart = useApp((s) => s.removeFromCart);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useMemo(
    () => cart.map((c) => ({ ...c, medicine: getMedicine(c.medicineId)! })).filter((i) => i.medicine),
    [cart],
  );

  const options = useMemo(() => fulfillmentOptions(items.map((i) => i.medicineId)), [items]);

  const chosen = useMemo(() => {
    if (options.length === 0) return null;
    if (pharmacyId) {
      const found = options.find((o) => o.pharmacy.id === pharmacyId);
      if (found) return found;
    }
    return options[0];
  }, [options, pharmacyId]);

  if (!mounted) {
    return (
      <div className="container-x py-14">
        <div className="shimmer h-9 w-56 rounded-xl" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="shimmer h-64 rounded-2xl" />
          <div className="shimmer h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-14">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          sub="Search medicines near you or upload a prescription — verified pharmacies around HSR Layout are ready to deliver."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/medicines" className="btn-primary">Find medicines</Link>
              <Link href="/prescription" className="btn-secondary">Upload prescription</Link>
            </div>
          }
        />
      </div>
    );
  }

  const subtotal = items.reduce((s, i) => s + i.medicine.price * i.qty, 0);
  const mrpTotal = items.reduce((s, i) => s + i.medicine.mrp * i.qty, 0);
  const fee = subtotal >= 199 ? 0 : 25;
  const total = subtotal + fee;
  const hasRx = items.some((i) => i.medicine.requiresPrescription);
  const missingAtChosen = chosen?.missing ?? [];

  return (
    <div className="container-x py-10">
      {!location.isServiceable && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs sm:text-sm text-amber-900">
          <AlertTriangle className="size-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-bold text-amber-950">Service Currently Not Available in Your Location ({location.area || location.city})</p>
            <p className="mt-0.5 leading-relaxed text-amber-900">
              MedRelay operates exclusively within <strong>Maharashtra, India</strong>. You cannot checkout from your current location. Please change your location to Maharashtra to proceed.
            </p>
          </div>
        </div>
      )}
      <div className="anim-fade-up mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">Your Cart</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          {items.length} {items.length === 1 ? "item" : "items"} · fulfilled hyperlocally from a verified pharmacy
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          {/* fulfillment card */}
          {chosen && (
            <div className={cn("card p-5", missingAtChosen.length > 0 && "border-red-200")}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={cn("grid size-10 place-items-center rounded-xl text-white", missingAtChosen.length > 0 ? "bg-red-500" : "bg-green-600")}>
                    <Store className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {missingAtChosen.length === 0 ? "Fulfilled by " : "Partially fulfilled by "}
                      <Link href={`/pharmacies/${chosen.pharmacy.id}`} className="text-blue-700 hover:underline">{chosen.pharmacy.name}</Link>
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500">
                      <VerifiedBadge compact />
                      <span>{chosen.pharmacy.distanceKm} km · delivery {chosen.pharmacy.etaMin}–{chosen.pharmacy.etaMax} min</span>
                    </div>
                  </div>
                </div>
                {missingAtChosen.length === 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 ring-1 ring-green-200 ring-inset">
                    <CheckCircle2 className="size-4" /> All items in stock
                  </span>
                )}
              </div>

              {/* redirection panel */}
              {missingAtChosen.length > 0 && (
                <div className="anim-fade-in mt-4 rounded-xl border border-red-200 bg-red-50/60 p-4">
                  <p className="flex items-center gap-2 text-sm font-bold text-red-700">
                    <RefreshCcw className="size-4" /> Automatic pharmacy redirection
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-red-600/90">
                    {missingAtChosen.map((id) => getMedicine(id)?.name).join(", ")} unavailable at {chosen.pharmacy.name}.
                    We searched nearby verified pharmacies for you:
                  </p>
                  <div className="mt-3 space-y-2">
                    {options
                      .filter((o) => o.coverAll && o.pharmacy.id !== chosen.pharmacy.id)
                      .slice(0, 2)
                      .map((o) => (
                        <div key={o.pharmacy.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-green-200 bg-white p-3">
                          <div>
                            <p className="flex items-center gap-2 text-sm font-bold text-slate-800">
                              {o.pharmacy.name} <VerifiedBadge compact />
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-500">
                              ✓ All items available · {o.pharmacy.distanceKm} km · delivery {o.pharmacy.etaMin}–{o.pharmacy.etaMax} min
                            </p>
                          </div>
                          <button
                            onClick={() => setPharmacyId(o.pharmacy.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3.5 py-2 text-xs font-bold text-white shadow-[var(--shadow-cta-green)] transition-transform hover:scale-[1.03]"
                          >
                            Continue with {o.pharmacy.name.split(" ")[0]} <ArrowRight className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    {options.filter((o) => o.coverAll && o.pharmacy.id !== chosen.pharmacy.id).length === 0 && (
                      <p className="rounded-xl bg-white p-3 text-xs text-slate-500">
                        No single pharmacy stocks everything right now — split fulfilment will be offered at checkout.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* other options */}
              {options.length > 1 && (
                <details className="mt-3 text-xs">
                  <summary className="cursor-pointer font-semibold text-blue-600">View other fulfilment options ({options.length - 1})</summary>
                  <div className="mt-2 space-y-2">
                    {options
                      .filter((o) => o.pharmacy.id !== chosen.pharmacy.id)
                      .map((o) => (
                        <button
                          key={o.pharmacy.id}
                          onClick={() => setPharmacyId(o.pharmacy.id)}
                          className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3.5 py-2.5 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/50"
                        >
                          <span>
                            <span className="block font-bold text-slate-800">{o.pharmacy.name}</span>
                            <span className="text-[11px] text-slate-500">
                              {o.have.length}/{items.length} items · {o.pharmacy.distanceKm} km · {o.pharmacy.etaMin}–{o.pharmacy.etaMax} min
                            </span>
                          </span>
                          {o.coverAll && <span className="text-[10px] font-bold text-green-600">FULL STOCK</span>}
                        </button>
                      ))}
                  </div>
                </details>
              )}
            </div>
          )}

          {/* items */}
          {items.map((i) => {
            const qtyAtChosen = chosen ? (i.medicine.stock.find((s) => s.pharmacyId === chosen.pharmacy.id)?.qty ?? 0) : 0;
            return (
              <div key={i.medicineId} className="card anim-fade-up flex flex-wrap items-center gap-4 p-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-blue-50 font-display text-sm font-bold text-blue-700">
                  {i.medicine.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link href={`/medicines/${i.medicine.id}`} className="truncate text-sm font-bold text-slate-900 hover:text-blue-700">
                      {i.medicine.name}
                    </Link>
                    {i.medicine.requiresPrescription && <RxBadge />}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{i.medicine.form} · {i.medicine.packSize}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <StockPill qty={qtyAtChosen} />
                    {qtyAtChosen <= 0 && <span className="text-[11px] font-semibold text-red-500">Will be redirected to another pharmacy</span>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2.5">
                  <p className="font-display text-base font-bold text-slate-900">{inr(i.medicine.price * i.qty)}</p>
                  <div className="flex items-center gap-2">
                    <AddToCartControls medicineId={i.medicineId} />
                    <button onClick={() => removeFromCart(i.medicineId)} className="grid size-9 place-items-center rounded-xl text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${i.medicine.name}`}>
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {hasRx && (
            <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
              <FileWarning className="mt-0.5 size-5 shrink-0 text-blue-600" />
              <p className="text-sm leading-relaxed text-blue-900/85">
                Prescription required for some items in this cart. You&apos;ll attach a valid prescription at checkout —
                a pharmacist verifies it before dispensing.
              </p>
            </div>
          )}
        </div>

        {/* bill */}
        <div className="card anim-fade-up p-6 [animation-delay:100ms] lg:sticky lg:top-24">
          <h3 className="mb-4 text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">Bill summary</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Item total (MRP)</dt><dd className="font-semibold text-slate-700 tabular-nums">{inr(mrpTotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Price discount</dt><dd className="font-semibold text-green-600 tabular-nums">− {inr(mrpTotal - subtotal)}</dd></div>
            <div className="flex justify-between">
              <dt className="flex items-center gap-1.5 text-slate-500"><Truck className="size-4" /> Delivery fee</dt>
              <dd className="font-semibold tabular-nums">
                {fee === 0 ? <span className="text-green-600">FREE</span> : <span className="text-slate-700">{inr(fee)}</span>}
              </dd>
            </div>
            {fee > 0 && <p className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-500">Add {inr(199 - subtotal)} more for free delivery</p>}
            <div className="flex justify-between border-t border-dashed border-slate-200 pt-3">
              <dt className="text-base font-bold text-slate-900">To pay</dt>
              <dd className="font-display text-xl font-bold text-slate-900 tabular-nums">{inr(total)}</dd>
            </div>
          </dl>

          {missingAtChosen.length > 0 ? (
            <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-center text-xs font-semibold text-red-600">
              Resolve fulfilment above — or continue and we&apos;ll auto-redirect unavailable items.
            </p>
          ) : null}

          {!location.isServiceable ? (
            <button
              disabled
              title="Service not available in your region (Outside Maharashtra)"
              className="btn-primary mt-4 w-full opacity-60 cursor-not-allowed bg-slate-400 hover:bg-slate-400"
            >
              Service Unavailable in {location.area || "Your Location"}
            </button>
          ) : (
            <Link href="/checkout" className="btn-primary mt-4 w-full">
              Proceed to Checkout <ArrowRight className="size-4" />
            </Link>
          )}
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
            <ShieldCheck className="size-3.5 text-green-600" /> Dispensed by licensed pharmacists · OTP-verified delivery
          </p>
        </div>
      </div>
    </div>
  );
}
