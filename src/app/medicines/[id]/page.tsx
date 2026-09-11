import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, FileWarning, Info, MapPin, ShieldCheck, Star } from "lucide-react";
import { AvailabilityList } from "@/components/AvailabilityList";
import { AddToCartControls, MedicineCard } from "@/components/MedicineCard";
import { RxBadge, StockPill, VerifiedBadge } from "@/components/ui";
import {
  CATEGORIES_MAP,
  MEDICINES,
  availableAts,
  getMedicine,
  nearestPharmacyWith,
  stockAt,
} from "@/lib/data";
import { discountPct, inr } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const m = getMedicine(id);
  return { title: m ? `${m.name} — MedRelay` : "Medicine — MedRelay" };
}

export default async function MedicineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = getMedicine(id);
  if (!m) notFound();

  const best = nearestPharmacyWith(m);
  const nearby = availableAts(m);
  const off = discountPct(m.price, m.mrp);
  const category = CATEGORIES_MAP.get(m.categoryId);
  const similar = MEDICINES.filter((x) => x.categoryId === m.categoryId && x.id !== m.id).slice(0, 4);

  return (
    <div className="container-x py-8 sm:py-10">
      {/* breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs font-medium text-slate-400" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="size-3" />
        <Link href="/medicines" className="hover:text-blue-600">Medicines</Link>
        {category && (
          <>
            <ChevronRight className="size-3" />
            <Link href={`/medicines?cat=${category.id}`} className="hover:text-blue-600">{category.name}</Link>
          </>
        )}
        <ChevronRight className="size-3" />
        <span className="text-slate-600">{m.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
        {/* left: info */}
        <div>
          <div className="anim-fade-up">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{m.name}</h1>
              {m.requiresPrescription && <RxBadge />}
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {m.form} · {m.strength} · {m.packSize}
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-800">{m.rating}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">{m.ratingCount.toLocaleString("en-IN")} verified purchase ratings</span>
            </div>
          </div>

          <div className="card anim-fade-up mt-6 p-6 [animation-delay:80ms]">
            <h2 className="mb-4 text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">Product details</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
              {[
                ["Generic / salt", m.generic],
                ["Manufacturer", m.manufacturer],
                ["Form", m.form],
                ["Strength", m.strength],
                ["Pack size", m.packSize],
                ["Category", category?.name ?? "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">{k}</dt>
                  <dd className="mt-1 font-semibold text-slate-800">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 border-t border-dashed border-slate-200 pt-5">
              <p className="text-sm leading-relaxed text-slate-600">{m.description}</p>
            </div>
          </div>

          {m.requiresPrescription ? (
            <div className="anim-fade-up mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/60 p-4 [animation-delay:140ms]">
              <FileWarning className="mt-0.5 size-5 shrink-0 text-red-600" />
              <div className="text-sm">
                <p className="font-bold text-red-700">Prescription required</p>
                <p className="mt-1 leading-relaxed text-red-600/90">
                  This medicine is dispensed only after a licensed pharmacist verifies a valid prescription. You can
                  upload it during checkout or from your account.
                </p>
              </div>
            </div>
          ) : (
            <div className="anim-fade-up mt-4 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 [animation-delay:140ms]">
              <Info className="mt-0.5 size-5 shrink-0 text-blue-600" />
              <p className="text-sm leading-relaxed text-blue-900/80">
                {m.usageNote} MedRelay facilitates discovery and ordering — it does not provide medical advice or dosage
                recommendations. Always follow your doctor&apos;s guidance.
              </p>
            </div>
          )}

          {/* availability across pharmacies */}
          <h2 className="mt-10 mb-4 font-display text-xl font-bold text-slate-900">Availability at nearby pharmacies</h2>
          <AvailabilityList medicineId={m.id} />
        </div>

        {/* right: buy box */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="card anim-scale-in p-6 shadow-[var(--shadow-card)] [animation-delay:120ms]">
            <div className="flex items-baseline gap-2.5">
              <span className="font-display text-3xl font-bold text-slate-900">{inr(m.price)}</span>
              {off > 0 && (
                <>
                  <span className="text-sm text-slate-400 line-through">{inr(m.mrp)}</span>
                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700">{off}% off</span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-400">Inclusive of all taxes · {m.packSize}</p>

            <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4">
              {best ? (
                <>
                  <div className="flex items-center justify-between">
                    <StockPill qty={stockAt(m, best.id)} />
                    <span className="text-xs font-bold text-green-700">Available Nearby</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Fastest from <span className="font-bold text-slate-800">{best.name}</span> · {nearby.length}{" "}
                    {nearby.length === 1 ? "pharmacy" : "pharmacies"} stock it
                  </p>
                </>
              ) : (
                <p className="text-xs font-semibold text-red-600">
                  Currently unavailable nearby — check again soon or upload a prescription and we&apos;ll source it.
                </p>
              )}
              <div className="space-y-2 border-t border-slate-200 pt-3 text-xs text-slate-600">
                <p className="flex items-center gap-2"><Clock className="size-3.5 text-blue-600" /> Delivery in {best ? `${best.etaMin}–${best.etaMax} min` : "—"}</p>
                <p className="flex items-center gap-2"><MapPin className="size-3.5 text-blue-600" /> Delivering to HSR Layout, Bengaluru</p>
                <p className="flex items-center gap-2"><ShieldCheck className="size-3.5 text-green-600" /> Dispensed by a licensed pharmacist</p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <AddToCartControls medicineId={m.id} size="lg" />
              <Link href="/cart" className="btn-secondary flex-1 !py-2.5 text-center text-sm">
                Go to cart
              </Link>
            </div>

            <div className="mt-4 flex justify-center">
              <VerifiedBadge />
            </div>
          </div>
        </div>
      </div>

      {/* similar */}
      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 font-display text-xl font-bold text-slate-900">More in {category?.name}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((s) => (
              <MedicineCard key={s.id} medicine={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
