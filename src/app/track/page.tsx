"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bike,
  CheckCircle2,
  ChevronRight,
  Copy,
  Headset,
  KeyRound,
  MessageCircle,
  Package,
  Phone,
  Radar,
  ShieldCheck,
  Star,
} from "lucide-react";
import { TrackingMap } from "@/components/TrackingMap";
import { RxBadge, StatusPill } from "@/components/ui";
import { DEMO_ORDER, TIMELINE, getMedicine, getPharmacy, orderTotal } from "@/lib/data";
import { useApp } from "@/lib/store";
import { cn, inr, initials } from "@/lib/utils";

interface TrackView {
  id: string;
  placedAt: string;
  items: { medicineId: string; qty: number }[];
  pharmacyName: string;
  pharmacyId: string;
  address: string;
  addressLabel: string;
  riderName: string;
  riderRating: number;
  riderVehicle: string;
  otp: string;
  eta: string;
  fee: number;
  startStep: number;
  times: (string | null)[];
  isDemo: boolean;
}

export default function TrackPage() {
  const orders = useApp((s) => s.orders);
  const [mounted, setMounted] = useState(false);
  const [liveSince, setLiveSince] = useState<string | null>(null);
  useEffect(() => {
    setMounted(true);
    setLiveSince(
      new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
    );
  }, []);

  const view: TrackView = useMemo(() => {
    const latest = mounted ? orders[0] : null;
    if (latest) {
      const ph = getPharmacy(latest.pharmacyId);
      const times: (string | null)[] = TIMELINE.map((_, i) => (i <= 1 ? latest.placedAt.split(",")[1]?.trim() ?? "now" : null));
      return {
        id: latest.id,
        placedAt: latest.placedAt,
        items: latest.items.map((i) => ({ medicineId: i.medicineId, qty: i.qty })),
        pharmacyName: ph?.name ?? "NovaMed Pharmacy",
        pharmacyId: latest.pharmacyId,
        address: latest.address,
        addressLabel: "Delivery address",
        riderName: "Arjun Kumar",
        riderRating: 4.9,
        riderVehicle: "Bike • KA-05-JD-2231",
        otp: latest.otp,
        eta: latest.eta,
        fee: latest.fee,
        startStep: 1,
        times,
        isDemo: false,
      };
    }
    const ph = getPharmacy(DEMO_ORDER.pharmacyId)!;
    return {
      id: DEMO_ORDER.id,
      placedAt: DEMO_ORDER.placedAt,
      items: DEMO_ORDER.items,
      pharmacyName: ph.name,
      pharmacyId: ph.id,
      address: DEMO_ORDER.address,
      addressLabel: DEMO_ORDER.addressLabel,
      riderName: DEMO_ORDER.rider.name,
      riderRating: DEMO_ORDER.rider.rating,
      riderVehicle: DEMO_ORDER.rider.vehicle,
      otp: DEMO_ORDER.otp,
      eta: DEMO_ORDER.eta,
      fee: DEMO_ORDER.fee,
      startStep: DEMO_ORDER.stepIndex,
      times: DEMO_ORDER.timelineTimes,
      isDemo: true,
    };
  }, [orders, mounted]);

  const [step, setStep] = useState(view.startStep);
  useEffect(() => {
    setStep(view.startStep);
  }, [view]);

  const delivered = step >= TIMELINE.length - 1;
  const subtotal = orderTotal(view.items);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // gentle auto-progression so the page feels "live"
  useEffect(() => {
    timer.current = setInterval(() => {
      setStep((s) => (s < TIMELINE.length - 2 ? s + 1 : s));
    }, 20000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const timeFor = (i: number): string | null => {
    if (i > step) return null;
    return view.times[i] ?? (i === step && i >= view.startStep ? `Just now${liveSince ? ` · ${liveSince}` : ""}` : view.isDemo ? null : view.placedAt.split(",")[1]?.trim() ?? "now");
  };

  const advance = () => setStep((s) => Math.min(TIMELINE.length - 1, s + 1));

  return (
    <div className="container-x py-8 sm:py-10">
      {/* header */}
      <div className="anim-fade-up mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Order #{view.id}</h1>
            <StatusPill status={delivered ? "Delivered" : TIMELINE[step].label === "Delivered" ? "Delivered" : "Out for delivery"} />
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            Placed {view.placedAt} · {view.pharmacyName} → {view.addressLabel}
            {view.isDemo && mounted && orders.length === 0 && (
              <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 ring-1 ring-blue-200 ring-inset">Live demo order</span>
            )}
          </p>
        </div>
        {!delivered && (
          <button onClick={advance} className="btn-secondary !px-4 !py-2 text-xs">
            <Radar className="size-4 text-blue-600" /> Simulate next update
          </button>
        )}
      </div>

      {/* map */}
      <div className="anim-fade-up [animation-delay:80ms]">
        <TrackingMap pharmacyName={view.pharmacyName} eta={view.eta} riderName={view.riderName} delivered={delivered} />
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* timeline */}
        <div className="card anim-fade-up p-6 [animation-delay:140ms]">
          <h2 className="mb-5 text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">Delivery timeline</h2>
          <ol className="relative space-y-0">
            {TIMELINE.map((t, i) => {
              const done = i < step || delivered;
              const current = i === step && !delivered;
              const time = timeFor(i);
              return (
                <li key={t.key} className="relative flex gap-4 pb-7 last:pb-0">
                  {i < TIMELINE.length - 1 && (
                    <span className={cn("absolute top-9 left-[17px] h-[calc(100%-2rem)] w-0.5 rounded-full", i < step ? "bg-green-500" : "bg-slate-200")} aria-hidden />
                  )}
                  <span
                    className={cn(
                      "relative z-10 grid size-9 shrink-0 place-items-center rounded-full transition-all duration-500",
                      delivered || done ? "bg-green-600 text-white" : current ? "bg-blue-600 text-white shadow-[var(--shadow-cta)]" : "border-2 border-dashed border-slate-300 bg-white",
                    )}
                  >
                    {done || delivered ? <CheckCircle2 className="size-4.5" /> : current ? (
                      <>
                        <Bike className="size-4.5" />
                        <span className="absolute inset-0 animate-ping-soft rounded-full bg-blue-500" />
                      </>
                    ) : (
                      <span className="size-2 rounded-full bg-slate-300" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1 pt-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <p className={cn("text-sm font-bold", done || current || delivered ? "text-slate-900" : "text-slate-400")}>{t.label}</p>
                      {time && <span className="text-[11px] font-semibold text-slate-400 tabular-nums">{time}</span>}
                    </div>
                    <p className={cn("text-xs", done || current || delivered ? "text-slate-500" : "text-slate-300")}>{t.hint}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {delivered && (
            <div className="anim-scale-in mt-5 flex items-center gap-3 rounded-2xl bg-green-50 p-4 ring-1 ring-green-200 ring-inset">
              <span className="grid size-10 place-items-center rounded-full bg-green-600 text-white">
                <CheckCircle2 className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-green-800">Delivered with OTP verification</p>
                <p className="text-xs text-green-700">Handover confirmed. Stay healthy!</p>
              </div>
            </div>
          )}
        </div>

        {/* right column */}
        <div className="space-y-5">
          {/* OTP */}
          <div className="card anim-fade-up p-6 [animation-delay:200ms]">
            <h3 className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">
              <KeyRound className="size-4 text-blue-600" /> Delivery OTP
            </h3>
            <div className="mt-4 flex gap-2.5">
              {view.otp.split("").map((d, i) => (
                <span key={i} className="grid h-12 flex-1 place-items-center rounded-xl border-2 border-blue-100 bg-blue-50/60 font-display text-xl font-bold text-blue-700 tabular-nums">
                  {d}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
              Share this with the rider only after you receive your medicines. The rider confirms delivery with this code.
            </p>
          </div>

          {/* rider */}
          {step >= 4 && !delivered ? (
            <div className="card anim-fade-up p-6 [animation-delay:240ms]">
              <h3 className="mb-4 text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">Your delivery partner</h3>
              <div className="flex items-center gap-3.5">
                <span className="grid size-12 place-items-center rounded-2xl bg-slate-900 font-display text-sm font-bold text-white">
                  {initials(view.riderName)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">{view.riderName}</p>
                  <p className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Star className="size-3 fill-amber-400 text-amber-400" /> {view.riderRating} · {view.riderVehicle}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="grid size-10 place-items-center rounded-xl bg-green-600 text-white transition-transform hover:scale-105" aria-label="Call rider">
                    <Phone className="size-4" />
                  </button>
                  <button className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50" aria-label="Message rider">
                    <MessageCircle className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : !delivered ? (
            <div className="card flex items-center gap-3 p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><Bike className="size-5" /></span>
              <p className="text-xs leading-relaxed text-slate-500">
                A nearby delivery partner will be assigned as soon as the pharmacy packs your order.
              </p>
            </div>
          ) : null}

          {/* order summary */}
          <div className="card anim-fade-up p-6 [animation-delay:280ms]">
            <h3 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">
              <Package className="size-4 text-blue-600" /> Order summary
            </h3>
            <ul className="space-y-2.5 text-sm">
              {view.items.map((i) => {
                const m = getMedicine(i.medicineId);
                if (!m) return null;
                return (
                  <li key={i.medicineId} className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-slate-500">{i.qty}×</span>
                    <Link href={`/medicines/${m.id}`} className="group flex min-w-0 flex-1 items-center gap-1.5">
                      <span className="truncate font-medium text-slate-700 group-hover:text-blue-700">{m.name}</span>
                      {m.requiresPrescription && <RxBadge />}
                      <ChevronRight className="size-3 text-slate-300" />
                    </Link>
                    <span className="font-bold tabular-nums">{inr(m.price * i.qty)}</span>
                  </li>
                );
              })}
              <li className="flex justify-between pt-1 text-xs text-slate-500"><span>Delivery fee</span><span className="tabular-nums">{inr(view.fee)}</span></li>
              <li className="flex justify-between border-t border-dashed border-slate-200 pt-2.5 font-bold">
                <span>Total</span><span className="tabular-nums">{inr(subtotal + view.fee)}</span>
              </li>
            </ul>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-[11px]">
              <span className="flex items-center gap-1.5 font-semibold text-slate-600"><Copy className="size-3" /> {view.address}</span>
            </div>
          </div>

          {/* support */}
          <div className="flex items-center gap-3 rounded-2xl bg-slate-900 p-5 text-white">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10"><Headset className="size-5" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">Need help with this order?</p>
              <p className="text-[11px] text-slate-400">Pharmacist-verified support, 24×7</p>
            </div>
            <Link href="/support#contact" className="rounded-lg bg-white px-3.5 py-2 text-xs font-bold text-slate-900">Contact</Link>
          </div>

          <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
            <ShieldCheck className="size-3.5 text-green-600" /> Google Maps Platform powers routing in production
          </p>
        </div>
      </div>
    </div>
  );
}
