"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowRightLeft,
  Bike,
  CheckCircle2,
  Clock,
  FileScan,
  FileUp,
  KeyRound,
  MapPin,
  Radar,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Zap,
} from "lucide-react";
import { MedicineCard } from "@/components/MedicineCard";
import { PharmacyCard } from "@/components/PharmacyCard";
import { RedirectFinder } from "@/components/RedirectFinder";
import { Reveal } from "@/components/Reveal";
import { SearchBar } from "@/components/SearchBar";
import { SectionHead, VerifiedBadge } from "@/components/ui";
import { CATEGORIES, MEDICINES, PHARMACIES, TRUST_POINTS } from "@/lib/data";
import { useApp } from "@/lib/store";
import { useMounted } from "@/lib/useMounted";

const FEATURED = ["m1", "m3", "m6", "m8", "m11", "m13", "m15", "m16"];

const HOW_STEPS = [
  { icon: Search, title: "Search or upload prescription", text: "Find medicines instantly or let OCR digitise your prescription." },
  { icon: ShieldCheck, title: "Pharmacy verifies", text: "A licensed pharmacist reviews prescriptions before dispensing." },
  { icon: Store, title: "Order assigned to a nearby pharmacy", text: "Fulfilled from live local stock — never a distant warehouse." },
  { icon: Bike, title: "Rider picks up your medicine", text: "A delivery partner collects the sealed package within minutes." },
  { icon: KeyRound, title: "Live tracking & OTP delivery", text: "Follow the rider in real time and confirm handover with an OTP." },
];

const WHY = [
  { icon: Zap, tint: "blue" as const, title: "Faster Medicine Access", text: "Real-time visibility of medicine availability across pharmacies near you — no calling around." },
  { icon: Store, tint: "green" as const, title: "Verified Local Pharmacies", text: "Every store is license-checked and verified before joining the network." },
  { icon: FileScan, tint: "blue" as const, title: "Smart Prescription Processing", text: "OCR digitises prescriptions so pharmacists review faster, with fewer manual errors." },
  { icon: RefreshCcw, tint: "green" as const, title: "Automatic Pharmacy Redirection", text: "If a medicine is unavailable at one store, we instantly find another verified pharmacy with stock." },
  { icon: Radar, tint: "blue" as const, title: "Real-Time Order Tracking", text: "Track your order from pharmacy shelf to your doorstep, with OTP-verified handover." },
  { icon: ShieldCheck, tint: "green" as const, title: "Secure & Trusted", text: "Prescriptions and health data are handled securely and shared only with your dispensing pharmacy." },
];

export default function HomePage() {
  const location = useApp((s) => s.location);
  const mounted = useMounted();
  const featured = FEATURED.map((id) => MEDICINES.find((m) => m.id === id)!).filter(Boolean);

  return (
    <>
      {/* ================================ HERO ================================ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white pt-4 pb-10 sm:pt-6 sm:pb-14">
        <div className="dotgrid absolute inset-0 opacity-40 pointer-events-none" />
        <div className="container-x relative grid items-center gap-10 py-4 sm:py-6 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <div className="anim-fade-up inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-xs backdrop-blur-sm">
              <Sparkles className="size-3.5 text-blue-600" /> Hyperlocal Medicine Delivery &mdash; Maharashtra, India
            </div>

            <h1 className="anim-fade-up mt-4 font-display text-4xl font-extrabold tracking-tight text-slate-900 [animation-delay:80ms] sm:text-5xl sm:leading-[1.12]">
              Medicines delivered from local pharmacies in <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">minutes</span>
            </h1>

            <p className="anim-fade-up mt-5 max-w-xl text-base leading-relaxed text-slate-500 [animation-delay:160ms] sm:text-lg">
              Find verified pharmacies, check medicine availability, upload prescriptions and get your medicines delivered
              to your doorstep — in as little as 20 minutes across Maharashtra.
            </p>

            <div className="anim-fade-up mt-7 [animation-delay:240ms]">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <MapPin className="size-3.5 text-blue-600" />
                Delivering to {mounted ? (location.isSet ? location.area : "Maharashtra") : "Maharashtra"} · {PHARMACIES.length} verified pharmacies in Maharashtra
              </div>
              <SearchBar suggestions />
            </div>

            <div className="anim-fade-up mt-6 flex flex-wrap gap-3 [animation-delay:320ms]">
              <Link href="/medicines" className="btn-primary">
                <Search className="size-4" /> Find Medicines
              </Link>
              <Link href="/prescription" className="btn-secondary">
                <FileUp className="size-4 text-blue-600" /> Upload Prescription
              </Link>
            </div>

            <ul className="anim-fade-up mt-7 flex flex-wrap gap-x-5 gap-y-2 [animation-delay:400ms]">
              {TRUST_POINTS.map((t) => (
                <li key={t} className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
                  <CheckCircle2 className="size-4 text-green-600" /> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto hidden w-full max-w-md sm:block lg:max-w-none" aria-hidden>
            <div className="relative mx-auto max-w-sm my-8 sm:my-10">
              {/* Main Order Card */}
              <div className="card anim-scale-in relative z-10 p-5 shadow-[var(--shadow-lift)] [animation-delay:200ms]">
                <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-3.5">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.14em] text-slate-400 uppercase">Order MR-90412</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-900">NovaMed Pharmacy → Home</p>
                  </div>
                  <VerifiedBadge compact />
                </div>
                <div className="space-y-3.5 py-4">
                  {[
                    { label: "Pharmacy confirmed & packed", done: true },
                    { label: "Prescription verified by pharmacist", done: true },
                    { label: "Arjun picked up your order", done: true, live: true },
                    { label: "Out for delivery", done: false },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-3">
                      {s.done ? (
                        <span className="relative grid size-6 place-items-center rounded-full bg-green-600 text-white">
                          <CheckCircle2 className="size-3.5" />
                          {s.live && <span className="absolute inset-0 animate-ping-soft rounded-full bg-green-500" />}
                        </span>
                      ) : (
                        <span className="grid size-6 place-items-center rounded-full border-2 border-dashed border-slate-300" />
                      )}
                      <span className={`text-[13px] font-medium ${s.done ? "text-slate-800" : "text-slate-400"}`}>{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3">
                  <span className="flex items-center gap-2 text-xs font-semibold text-blue-700">
                    <Bike className="size-4" /> Arjun is on the way
                  </span>
                  <span className="text-xs font-bold text-blue-800">18–25 min</span>
                </div>

                {/* Top Right Floating Badge - Pushed 100% above top edge */}
                <div className="absolute -top-3 -right-4 sm:-right-8 lg:-right-12 -translate-y-full z-20 animate-float pointer-events-none">
                  <div className="card flex items-center gap-2.5 px-4 py-3 shadow-[var(--shadow-lift)] bg-white/95 backdrop-blur-sm whitespace-nowrap pointer-events-auto">
                    <span className="grid size-9 place-items-center rounded-xl bg-green-50 text-green-600">
                      <CheckCircle2 className="size-5" />
                    </span>
                    <span>
                      <span className="block text-xs font-bold text-slate-900">In Stock nearby</span>
                      <span className="block text-[11px] text-slate-500">Paracetamol 650mg · 4 stores</span>
                    </span>
                  </div>
                </div>

                {/* Bottom Left Floating Badge - Pushed 100% below bottom edge */}
                <div className="absolute -bottom-3 -left-4 sm:-left-8 lg:-left-12 translate-y-full z-20 animate-float-slow pointer-events-none" style={{ animationDelay: "1.2s" }}>
                  <div className="card flex items-center gap-2.5 px-4 py-3 shadow-[var(--shadow-lift)] bg-white/95 backdrop-blur-sm whitespace-nowrap pointer-events-auto">
                    <span className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
                      <Clock className="size-5" />
                    </span>
                    <span>
                      <span className="block text-xs font-bold text-slate-900">Delivery in 22 min</span>
                      <span className="block text-[11px] text-slate-500">from NovaMed · 1.2 km</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* stats strip */}
        <div className="relative border-y border-slate-200 bg-white/70 backdrop-blur">
          <div className="container-x grid grid-cols-2 divide-x divide-slate-200 md:grid-cols-4">
            {[
              { v: "340+", l: "Verified pharmacies" },
              { v: "18k+", l: "Medicines tracked live" },
              { v: "27 min", l: "Avg. delivery time" },
              { v: "96.4%", l: "Fulfilment rate" },
            ].map((s) => (
              <div key={s.l} className="px-4 py-5 text-center">
                <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">{s.v}</p>
                <p className="mt-0.5 text-xs font-medium text-slate-500">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= CATEGORIES ============================== */}
      <section className="container-x py-16 sm:py-20">
        <Reveal>
          <SectionHead eyebrow="Shop by Category" title="What do you need today?" sub="Every category is served by live inventory from verified pharmacies around your location." id="categories" />
        </Reveal>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.id} delay={i * 40}>
              <Link
                href={`/medicines?cat=${c.id}`}
                className="card group flex h-full flex-col gap-3 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[var(--shadow-lift)]"
              >
                <span
                  className={`grid size-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                    c.tint === "blue" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"
                  }`}
                >
                  <c.icon className="size-5.5" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-slate-900 transition-colors group-hover:text-blue-700">{c.name}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{c.blurb}</span>
                  <span className="mt-1 block text-[11px] font-semibold text-slate-400">{c.count}+ items</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ======================== AVAILABLE NEAR YOU =========================== */}
      <section className="border-y border-slate-200 bg-slate-50/50 py-16 sm:py-20">
        <div className="container-x">
          <Reveal>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <SectionHead
                eyebrow="Live availability"
                title="Available near you right now"
                sub="Stock status is synced from pharmacy inventory. Green means it's on a shelf within reach."
              />
              <Link href="/medicines" className="btn-secondary mb-1 hidden sm:inline-flex">
                View all medicines <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((m, i) => (
              <Reveal key={m.id} delay={(i % 4) * 60}>
                <MedicineCard medicine={m} />
              </Reveal>
            ))}
          </div>
          <Link href="/medicines" className="btn-secondary mt-8 w-full sm:hidden">
            View all medicines <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ===================== HYPERLOCAL DIFFERENTIATOR ======================= */}
      <section className="container-x py-16 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="mb-2 text-xs font-bold tracking-[0.18em] text-blue-600 uppercase">Why hyperlocal wins</p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Not a warehouse.
              <br />
              Your neighbourhood.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-500">
              MedRelay fulfils every order from licensed pharmacies around you instead of shipping from a distant, central
              warehouse. That means live stock, fewer failed orders and delivery in minutes — not days.
            </p>

            <ul className="mt-7 space-y-4">
              {[
                { icon: Radar, text: "Live inventory from pharmacies within 3–4 km of your address." },
                { icon: RefreshCcw, text: "Automatic redirection — if one pharmacy is out of stock, we instantly route you to the next verified store." },
                { icon: Bike, text: "Local riders deliver in 20–45 minutes with OTP-verified handover." },
              ].map((f) => (
                <li key={f.text} className="flex items-start gap-3.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                    <f.icon className="size-4.5" />
                  </span>
                  <p className="pt-1.5 text-sm leading-relaxed text-slate-600">{f.text}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
              {["You", "Verified Pharmacy", "Local Rider", "Doorstep"].map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  <span
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold ${
                      i === 1 ? "bg-green-50 text-green-700 ring-1 ring-green-200" : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    {s}
                  </span>
                  {i < 3 && <ArrowRightLeft className="size-3.5 text-slate-300" />}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={140}>
            <RedirectFinder />
          </Reveal>
        </div>
      </section>

      {/* ========================= PHARMACIES NEAR YOU ========================= */}
      <section className="border-y border-slate-200 bg-slate-50/50 py-16 sm:py-20">
        <div className="container-x">
          <Reveal>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <SectionHead
                eyebrow="Verified & licensed"
                title="Pharmacies near you"
                sub="Every partner store is verified against its drug licence before it can receive a single order."
              />
              <Link href="/pharmacies" className="btn-secondary mb-1">
                View all pharmacies <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PHARMACIES.slice(0, 3).map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <PharmacyCard pharmacy={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= HOW IT WORKS ============================ */}
      <section className="container-x py-16 sm:py-24">
        <Reveal>
          <SectionHead
            eyebrow="How it works"
            title="From search to doorstep in 5 steps"
            sub="A fulfilment loop designed for speed without cutting corners on safety."
            align="center"
            id="how-it-works"
          />
        </Reveal>
        <ol className="relative grid gap-8 md:grid-cols-5 md:gap-4">
          <div className="absolute top-7 right-[10%] left-[10%] hidden border-t-2 border-dashed border-slate-200 md:block" aria-hidden />
          {HOW_STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <li className="relative flex flex-row gap-4 md:flex-col md:items-center md:text-center">
                <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl bg-white text-blue-600 ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:text-white hover:shadow-[var(--shadow-cta)] md:hover:bg-blue-600 [box-shadow:var(--shadow-card)]">
                  <s.icon className="size-6" />
                  <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                </span>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900 md:mt-4">{s.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{s.text}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ============================== WHY CHOOSE ============================= */}
      <section className="border-y border-slate-200 bg-slate-50/50 py-16 sm:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHead eyebrow="Why MedRelay" title="Built for speed. Backed by pharmacists." align="center" />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={(i % 3) * 70}>
                <div className="card h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[var(--shadow-lift)]">
                  <span className={`grid size-11 place-items-center rounded-xl ${w.tint === "blue" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>
                    <w.icon className="size-5.5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-slate-900">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= PRESCRIPTION CTA ============================ */}
      <section className="container-x py-16 sm:py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-blue-600 px-8 py-12 sm:px-12 lg:px-16">
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="absolute -top-24 -right-16 size-72 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-28 left-1/3 size-80 rounded-full bg-blue-400/30 blur-3xl" />
            </div>
            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="text-xs font-bold tracking-[0.18em] text-blue-200 uppercase">Prescription orders</p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Have a prescription? Upload it. We handle the rest.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-blue-100 sm:text-base">
                  OCR digitises your prescription, a licensed pharmacist verifies it, and your medicines are sourced from
                  the nearest verified pharmacy with stock.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/prescription" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg transition-all hover:-translate-y-0.5">
                    <FileUp className="size-4" /> Upload Prescription
                  </Link>
                  <Link href="/medicines" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                    Browse medicines
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-sm" aria-hidden>
                <div className="card rotate-2 p-5 shadow-2xl transition-transform duration-500 hover:rotate-0">
                  <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-3">
                    <p className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">Prescription · RX-3417</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700 ring-1 ring-green-200 ring-inset">
                      <ShieldCheck className="size-3" /> Pharmacist verified
                    </span>
                  </div>
                  <div className="space-y-2.5 py-4">
                    {["Azithromycin 250mg — 1-0-0 × 5 days", "Cetirizine 10mg — 0-0-1 × 5 days"].map((l) => (
                      <div key={l} className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700">
                        <CheckCircle2 className="size-4 shrink-0 text-green-600" /> {l}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl bg-blue-50 px-4 py-3 text-[11px] leading-relaxed font-medium text-blue-800">
                    Fulfilled by NovaMed Pharmacy · 1.2 km · Delivery in 20–30 min
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============================ PARTNER BANDS ============================ */}
      <section className="container-x pb-20">
        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="card group flex h-full flex-col justify-between gap-6 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-[var(--shadow-lift)] sm:flex-row sm:items-center">
              <div>
                <span className="grid size-12 place-items-center rounded-2xl bg-green-50 text-green-600">
                  <Store className="size-6" />
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-slate-900">Own a pharmacy?</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                  Get online orders, manage inventory digitally and reach customers across your neighbourhood — without
                  building your own delivery fleet.
                </p>
              </div>
              <Link href="/auth/register?role=pharmacy" className="btn-green shrink-0">
                Partner with us <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="card group flex h-full flex-col justify-between gap-6 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[var(--shadow-lift)] sm:flex-row sm:items-center">
              <div>
                <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                  <Bike className="size-6" />
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-slate-900">Deliver with MedRelay</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                  Flexible hours, transparent earnings and short local routes. Deliver essentials your neighbourhood
                  actually needs.
                </p>
              </div>
              <Link href="/auth/register?role=rider" className="btn-primary shrink-0">
                Become a rider <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
