"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  CheckCircle2,
  CreditCard,
  FileWarning,
  HomeIcon,
  Loader2,
  MapPin,
  Plus,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Upload,
  Wallet,
} from "lucide-react";
import type { PlacedOrder } from "@/lib/store";
import { useApp } from "@/lib/store";
import { ADDRESSES, CUSTOMER_RX, fulfillmentOptions, getMedicine } from "@/lib/data";
import { cn, inr } from "@/lib/utils";
import { EmptyState, RxBadge, VerifiedBadge } from "@/components/ui";

const STEP_LABELS = ["Address", "Prescription", "Summary", "Payment", "Confirmed"];

export default function CheckoutPage() {
  const router = useRouter();
  const location = useApp((s) => s.location);
  const cart = useApp((s) => s.cart);
  const pharmacyId = useApp((s) => s.pharmacyId);
  const placeOrder = useApp((s) => s.placeOrder);
  const prescriptions = useApp((s) => s.prescriptions);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [addressId, setAddressId] = useState("a1");
  const [rxChoice, setRxChoice] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState<"upi" | "card" | "cod">("upi");
  const [paying, setPaying] = useState(false);
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const items = useMemo(() => cart.map((c) => ({ ...c, medicine: getMedicine(c.medicineId)! })).filter((i) => i.medicine), [cart]);
  const options = useMemo(() => fulfillmentOptions(items.map((i) => i.medicineId)), [items]);
  const chosen = pharmacyId ? (options.find((o) => o.pharmacy.id === pharmacyId) ?? options[0]) : options[0];
  const hasRx = items.some((i) => i.medicine.requiresPrescription);
  const needsRx = hasRx;

  const subtotal = items.reduce((s, i) => s + i.medicine.price * i.qty, 0);
  const fee = subtotal >= 199 ? 0 : 25;
  const total = subtotal + fee;

  const address = ADDRESSES.find((a) => a.id === addressId) ?? ADDRESSES[0];
  const verifiedRxList = [
    ...prescriptions.filter((p) => p.status !== "processing").map((p) => ({ id: p.id, label: `${p.fileName} · ${p.uploadedAt}`, status: p.status })),
    ...CUSTOMER_RX.map((r) => ({ id: r.id, label: `Prescription uploaded ${r.uploadedAt}`, status: r.status })),
  ];

  const canContinue =
    step === 0 ? Boolean(addressId) :
    step === 1 ? (!needsRx || Boolean(rxChoice)) :
    true;

  const next = () => {
    if (step === 0 && !needsRx) setStep(2);
    else setStep((s) => Math.min(4, s + 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => {
    if (step === 2 && !needsRx) setStep(0);
    else setStep((s) => Math.max(0, s - 1));
  };

  const pay = () => {
    setPaying(true);
    timer.current = setTimeout(() => {
      const order = placeOrder({
        pharmacyId: chosen?.pharmacy.id ?? "p1",
        address: address.line,
        total,
        fee,
        rxId: rxChoice ?? undefined,
      });
      setPlaced(order);
      setPaying(false);
      setStep(4);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1700);
  };

  if (!mounted) {
    return <div className="container-x py-14"><div className="shimmer h-96 rounded-2xl" /></div>;
  }

  /* --------------------------- confirmation screen --------------------------- */
  if (step === 4 && placed) {
    const pharmacy = chosen?.pharmacy;
    return (
      <div className="container-x max-w-2xl py-16 text-center">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-green-600 text-white shadow-[var(--shadow-cta-green)]">
          <svg viewBox="0 0 24 24" className="size-10" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path className="check-draw" d="M4.5 12.5l5 5 10-11" />
          </svg>
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-slate-900">Order confirmed</h1>
        <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
          Order <span className="font-bold text-slate-900">{placed.id}</span> is confirmed with{" "}
          <span className="font-bold text-slate-900">{pharmacy?.name ?? "NovaMed Pharmacy"}</span>. A rider will be
          assigned as soon as it&apos;s packed.
        </p>

        <div className="card mt-8 grid gap-0 divide-y divide-slate-100 text-left sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { l: "Estimated delivery", v: placed.eta },
            { l: "Delivery OTP", v: placed.otp },
            { l: "Amount paid", v: payMethod === "cod" ? `${inr(placed.total)} (to pay)` : inr(placed.total) },
          ].map((s) => (
            <div key={s.l} className="px-5 py-4 text-center">
              <p className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">{s.l}</p>
              <p className="mt-1 font-display text-lg font-bold text-slate-900">{s.v}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/track" className="btn-primary">Track your order <ArrowRight className="size-4" /></Link>
          <Link href="/medicines" className="btn-secondary">Continue shopping</Link>
        </div>

        <p className="mt-6 text-[11px] text-slate-400">
          Share the OTP with the rider only after receiving your medicines.
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-14">
        <EmptyState
          icon={ShoppingBag}
          title="Nothing to checkout yet"
          sub="Your cart is empty. Add medicines or upload a prescription to place an order."
          action={<Link href="/medicines" className="btn-primary">Find medicines</Link>}
        />
      </div>
    );
  }

  return (
    <div className="container-x py-10">
      <div className="anim-fade-up mb-8 flex items-center gap-3">
        <button onClick={() => (step > 0 ? back() : router.push("/cart"))} className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50" aria-label="Go back">
          <ArrowLeft className="size-4.5" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Checkout</h1>
          <p className="text-xs text-slate-500">Secure, verified and delivered hyperlocally</p>
        </div>
      </div>

      {/* progress */}
      <div className="anim-fade-up mb-10 [animation-delay:60ms]">
        <ol className="flex items-center">
          {STEP_LABELS.slice(0, 4).map((label, i) => {
            const skipped = i === 1 && !needsRx;
            const done = step > i || skipped;
            const active = step === i && !skipped;
            return (
              <li key={label} className={cn("flex items-center", i < 3 && "flex-1")}>
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      "grid size-9 place-items-center rounded-full border-2 text-xs font-bold transition-all",
                      active ? "border-blue-600 bg-blue-600 text-white shadow-[var(--shadow-cta)]" : done ? "border-green-600 bg-green-600 text-white" : "border-slate-200 bg-white text-slate-400",
                    )}
                  >
                    {done ? <CheckCircle2 className="size-4.5" /> : i + 1}
                  </span>
                  <span className={cn("text-[10px] font-bold tracking-wide uppercase sm:text-[11px]", active ? "text-blue-700" : done ? "text-green-700" : "text-slate-400")}>
                    {label}{skipped && " — n/a"}
                  </span>
                </div>
                {i < 3 && <span className={cn("mx-2 -mt-6 h-0.5 flex-1 rounded-full sm:mx-4", (step > i || (i === 0 && step > 1)) ? "bg-green-500" : "bg-slate-200")} />}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="anim-fade-up [animation-delay:120ms]">
          {/* STEP 1 — address */}
          {step === 0 && (
            <div className="card p-6">
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                <MapPin className="size-5 text-blue-600" /> Delivery address
              </h2>
              <div className="space-y-3">
                {ADDRESSES.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAddressId(a.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                      addressId === a.id ? "border-blue-500 bg-blue-50/60 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                    )}
                  >
                    <span className={cn("mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg", addressId === a.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500")}>
                      <HomeIcon className="size-4" />
                    </span>
                    <span>
                      <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        {a.label}
                        {a.tag && <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700 ring-1 ring-green-200 ring-inset">{a.tag}</span>}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-slate-500">{a.line}</span>
                    </span>
                    {addressId === a.id && <CheckCircle2 className="ml-auto size-5 shrink-0 text-blue-600" />}
                  </button>
                ))}
                <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 px-4 py-3.5 text-sm font-semibold text-slate-500 transition-colors hover:border-blue-400 hover:text-blue-600">
                  <Plus className="size-4" /> Add a new address
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — prescription */}
          {step === 1 && needsRx && (
            <div className="card p-6">
              <h2 className="mb-1.5 flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                <FileWarning className="size-5 text-blue-600" /> Prescription verification
              </h2>
              <p className="mb-4 text-xs leading-relaxed text-slate-500">
                {items.filter((i) => i.medicine.requiresPrescription).length} item(s) in your order need a valid prescription. A licensed pharmacist
                verifies it before dispensing — orders are never auto-approved.
              </p>
              <div className="space-y-3">
                {verifiedRxList.map((rx) => (
                  <button
                    key={rx.id}
                    onClick={() => setRxChoice(rx.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all",
                      rxChoice === rx.id ? "border-blue-500 bg-blue-50/60 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                    )}
                  >
                    <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", rxChoice === rx.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500")}>
                      <FileWarning className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-slate-900">{rx.label}</span>
                      <span className={cn("mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset", rx.status === "verified" ? "bg-green-50 text-green-700 ring-green-200" : "bg-amber-50 text-amber-700 ring-amber-200")}>
                        {rx.status === "verified" ? "Verified on file" : "Pending pharmacist verification"}
                      </span>
                    </span>
                    {rxChoice === rx.id && <CheckCircle2 className="size-5 shrink-0 text-blue-600" />}
                  </button>
                ))}
                <Link href="/prescription" className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 px-4 py-3.5 text-sm font-semibold text-slate-500 transition-colors hover:border-blue-400 hover:text-blue-600">
                  <Upload className="size-4" /> Upload a new prescription
                </Link>
              </div>
            </div>
          )}

          {/* STEP 3 — summary */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="card p-6">
                <h2 className="mb-4 font-display text-lg font-bold text-slate-900">Order summary</h2>
                <ul className="space-y-3">
                  {items.map((i) => (
                    <li key={i.medicineId} className="flex items-center gap-3 text-sm">
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-[11px] font-bold text-blue-700">{i.qty}×</span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <span className="truncate">{i.medicine.name}</span>
                          {i.medicine.requiresPrescription && <RxBadge />}
                        </span>
                        <span className="text-[11px] text-slate-400">{i.medicine.packSize}</span>
                      </span>
                      <span className="font-bold text-slate-900 tabular-nums">{inr(i.medicine.price * i.qty)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {chosen && (
                <div className="card flex flex-wrap items-center gap-3 p-5">
                  <span className="grid size-10 place-items-center rounded-xl bg-green-600 text-white"><ShieldCheck className="size-5" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900">Fulfilled by {chosen.pharmacy.name}</p>
                    <p className="text-[11px] text-slate-500">Verified Pharmacy · {chosen.pharmacy.distanceKm} km · {chosen.pharmacy.address}</p>
                  </div>
                  <VerifiedBadge compact />
                </div>
              )}
              <div className="card flex items-center gap-3 p-5">
                <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><MapPin className="size-5" /></span>
                <div>
                  <p className="text-sm font-bold text-slate-900">{address.label}</p>
                  <p className="text-[11px] leading-relaxed text-slate-500">{address.line}</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — payment */}
          {step === 3 && (
            <div className="card p-6">
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                <Wallet className="size-5 text-blue-600" /> Payment
              </h2>
              <div className="space-y-3">
                {[
                  { id: "upi" as const, icon: QrCode, title: "UPI", sub: "Google Pay, PhonePe, Paytm & more", badge: "Recommended" },
                  { id: "card" as const, icon: CreditCard, title: "Card", sub: "Credit / debit cards · saved securely", badge: "" },
                  { id: "cod" as const, icon: Banknote, title: "Cash on delivery", sub: "Pay the rider after OTP verification", badge: "" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all",
                      payMethod === m.id ? "border-blue-500 bg-blue-50/60 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                    )}
                  >
                    <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", payMethod === m.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500")}>
                      <m.icon className="size-5" />
                    </span>
                    <span className="flex-1">
                      <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        {m.title}
                        {m.badge && <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700 ring-1 ring-green-200 ring-inset">{m.badge}</span>}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">{m.sub}</span>
                    </span>
                    {payMethod === m.id && <CheckCircle2 className="size-5 shrink-0 text-blue-600" />}
                  </button>
                ))}
              </div>
              {payMethod === "upi" && (
                <div className="anim-fade-in mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                  <Smartphone className="size-5 shrink-0 text-slate-400" />
                  <input placeholder="yourname@upi" className="input-field !bg-white" aria-label="UPI ID" />
                </div>
              )}
            </div>
          )}

          {!location.isServiceable && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs sm:text-sm text-amber-900">
              <AlertTriangle className="size-5 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">Cannot Place Order (Outside Maharashtra)</p>
                <p className="mt-0.5 leading-relaxed text-amber-900">
                  Service is currently not available in <strong>{location.area || location.city}</strong>. MedRelay delivers exclusively within Maharashtra, India.
                </p>
              </div>
            </div>
          )}

          {/* nav buttons */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button onClick={back} className="btn-secondary !px-4" disabled={step === 0}>
              <ArrowLeft className="size-4" /> Back
            </button>
            {!location.isServiceable ? (
              <button disabled className="btn-primary cursor-not-allowed opacity-50 bg-slate-400 hover:bg-slate-400">
                Service Unavailable
              </button>
            ) : step < 3 ? (
              <button onClick={next} disabled={!canContinue} className={cn("btn-primary", !canContinue && "cursor-not-allowed opacity-40 shadow-none")}>
                Continue <ArrowRight className="size-4" />
              </button>
            ) : (
              <button onClick={pay} disabled={paying} className="btn-green min-w-52">
                {paying ? <><Loader2 className="size-4 animate-spin" /> Processing payment…</> : <>Pay {inr(total)} <ArrowRight className="size-4" /></>}
              </button>
            )}
          </div>
        </div>

        {/* right rail */}
        <div className="card anim-fade-up p-6 [animation-delay:180ms] lg:sticky lg:top-24">
          <h3 className="mb-4 text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">Price details</h3>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Items ({items.reduce((n, i) => n + i.qty, 0)})</dt><dd className="font-semibold tabular-nums">{inr(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Delivery</dt><dd className={cn("font-semibold tabular-nums", fee === 0 && "text-green-600")}>{fee === 0 ? "FREE" : inr(fee)}</dd></div>
            <div className="flex justify-between border-t border-dashed border-slate-200 pt-2.5"><dt className="font-bold">To pay</dt><dd className="font-display text-lg font-bold tabular-nums">{inr(total)}</dd></div>
          </dl>
          {chosen && (
            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
              <p className="font-bold text-slate-800">{chosen.pharmacy.name}</p>
              <p className="mt-0.5">{chosen.pharmacy.distanceKm} km away · estimated delivery {chosen.pharmacy.etaMin}–{chosen.pharmacy.etaMax} min</p>
              <p className="mt-2 flex items-center gap-1.5 font-semibold text-green-700"><ShieldCheck className="size-3.5" /> Licensed & verified by MedRelay</p>
            </div>
          )}
          <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
            Orders containing Rx items are confirmed only after pharmacist verification. If any item goes out of stock,
            we automatically redirect to another nearby verified pharmacy.
          </p>
        </div>
      </div>
    </div>
  );
}
