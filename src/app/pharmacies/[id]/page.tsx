import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  Phone,
  Quote,
  ReceiptText,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { MedicineCard } from "@/components/MedicineCard";
import { Stars, VerifiedBadge } from "@/components/ui";
import { MEDICINES, getPharmacy, stockAt } from "@/lib/data";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = getPharmacy(id);
  return { title: p ? `${p.name} — MedRelay` : "Pharmacy — MedRelay" };
}

export default async function PharmacyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getPharmacy(id);
  if (!p) notFound();

  const inStock = MEDICINES.filter((m) => stockAt(m, p.id) > 0);

  return (
    <div className="container-x py-8 sm:py-10">
      <nav className="mb-6 flex items-center gap-1.5 text-xs font-medium text-slate-400" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="size-3" />
        <Link href="/pharmacies" className="hover:text-blue-600">Pharmacies</Link>
        <ChevronRight className="size-3" />
        <span className="text-slate-600">{p.name}</span>
      </nav>

      {/* header card */}
      <div className="card anim-fade-up overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-8 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid size-14 place-items-center rounded-2xl bg-white/15 font-display text-lg font-bold text-white ring-1 ring-white/25">
                {p.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </span>
              <div>
                <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{p.name}</h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-blue-100">
                  <MapPin className="size-3.5" /> {p.area} · {p.distanceKm} km away
                </p>
              </div>
            </div>
            <VerifiedBadge />
          </div>
        </div>

        <div className="grid gap-0 divide-y divide-slate-200 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          {[
            { icon: Clock, label: "Status", value: p.openNow ? `Open · till ${p.closesAt}` : `Closed · opens ${p.opensAt}`, accent: p.openNow ? "text-green-600" : "text-red-600" },
            { icon: Truck, label: "Delivery estimate", value: `${p.etaMin}–${p.etaMax} min`, accent: "text-slate-900" },
            { icon: BadgeCheck, label: "Catalogue", value: `${inStockCountLabel(inStock.length)} in stock`, accent: "text-slate-900" },
            { icon: ShieldCheck, label: "Verification", value: "Licence verified", accent: "text-green-600" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 px-6 py-4">
              <s.icon className="size-5 shrink-0 text-blue-600" />
              <div>
                <p className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">{s.label}</p>
                <p className={cn("text-sm font-bold", s.accent)}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* details grid */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="card p-6">
          <h3 className="mb-3 text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">Store details</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" /> {p.address}</li>
            <li className="flex items-center gap-2.5"><Phone className="size-4 shrink-0 text-slate-400" /> {p.phone}</li>
            <li className="flex items-center gap-2.5"><Mail className="size-4 shrink-0 text-slate-400" /> {p.name.toLowerCase().replace(/[^a-z]/g, "")}@partner.medrelay.in</li>
          </ul>
        </div>
        <div className="card p-6">
          <h3 className="mb-3 text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">Licence & compliance</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5">
              <span className="flex items-center gap-2 text-slate-600"><ReceiptText className="size-4 text-slate-400" /> Drug licence</span>
              <span className="font-mono text-xs font-bold text-slate-800">{p.licenseNo}</span>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-green-50 px-3.5 py-2.5">
              <span className="flex items-center gap-2 text-green-800"><ShieldCheck className="size-4" /> MedRelay verification</span>
              <span className="text-xs font-bold text-green-700">Active</span>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-green-50 px-3.5 py-2.5">
              <span className="flex items-center gap-2 text-green-800"><BadgeCheck className="size-4" /> Pharmacist on duty</span>
              <span className="text-xs font-bold text-green-700">Verified</span>
            </li>
          </ul>
        </div>
        <div className="card flex flex-col p-6">
          <h3 className="mb-3 text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">Customer rating</h3>
          <div className="flex items-center gap-2">
            <span className="font-display text-3xl font-bold text-slate-900">{p.rating}</span>
            <div>
              <Stars rating={p.rating} />
              <p className="mt-0.5 text-xs text-slate-400">{p.ratingCount.toLocaleString("en-IN")} ratings</p>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-500 italic">
            <Quote className="mt-0.5 size-3.5 shrink-0 text-slate-300" />
            {p.reviewHighlight}
          </div>
        </div>
      </div>

      {/* inventory */}
      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">In stock at {p.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{inStock.length} products synced from live store inventory.</p>
          </div>
          <Link href="/medicines" className="text-sm font-semibold text-blue-600 hover:text-blue-800">Browse all</Link>
        </div>
        <div className="grid gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          {inStock.slice(0, 8).map((m) => (
            <MedicineCard key={m.id} medicine={m} />
          ))}
        </div>
      </section>
    </div>
  );
}

function inStockCountLabel(n: number): string {
  return `${n} medicines`;
}
