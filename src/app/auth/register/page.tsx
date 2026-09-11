"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  Bike,
  Building2,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ReceiptText,
  ShieldCheck,
  Store,
  User,
} from "lucide-react";
import { BackToHome, BrandPanel, PasswordInput, ROLES, RoleTabs, type Role } from "@/components/AuthLayout";
import { cn } from "@/lib/utils";

function RegisterInner() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = (params.get("role") as Role) || "customer";
  const [role, setRole] = useState<Role>(["customer", "pharmacy", "rider"].includes(initial) ? initial : "customer");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (role === "pharmacy") setDone(true);
      else router.push(ROLES.find((r) => r.id === role)!.dest);
    }, 1000);
  };

  if (done) {
    return (
      <div className="card anim-scale-in p-8 text-center shadow-[var(--shadow-card)]">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-green-600 text-white shadow-[var(--shadow-cta-green)]">
          <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path className="check-draw" d="M4.5 12.5l5 5 10-11" />
          </svg>
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold text-slate-900">Application received</h1>
        <p className="mx-auto mt-2.5 max-w-sm text-sm leading-relaxed text-slate-500">
          Our compliance team will verify your drug licence and credentials — typically within{" "}
          <span className="font-bold text-slate-800">24–48 hours</span>. You&apos;ll get an email the moment your store
          is approved and live.
        </p>
        <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 ring-inset">
          <Clock className="size-3.5" /> Verification in progress
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/partner/pharmacy" className="btn-green">Preview pharmacy dashboard</Link>
          <Link href="/" className="btn-secondary">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-7 shadow-[var(--shadow-card)] sm:p-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
      <p className="mt-1.5 text-sm text-slate-500">
        {role === "customer" && "Order from verified pharmacies near you."}
        {role === "pharmacy" && "Get online orders and manage inventory digitally."}
        {role === "rider" && "Deliver on short local routes with transparent earnings."}
      </p>

      <div className="mt-6">
        <RoleTabs role={role} onChange={setRole} />
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        {role === "pharmacy" ? (
          <>
            <div>
              <label className="label-field" htmlFor="store">Pharmacy / store name</label>
              <div className="relative">
                <Store className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                <input id="store" required placeholder="e.g. Sunrise Medicare" className="input-field !pl-10" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-field" htmlFor="lic">Drug licence number</label>
                <div className="relative">
                  <ReceiptText className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                  <input id="lic" required placeholder="KA-BLR/20XX/XXXXX" className="input-field !pl-10" />
                </div>
              </div>
              <div>
                <label className="label-field" htmlFor="area">Area / locality</label>
                <div className="relative">
                  <MapPin className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                  <input id="area" required placeholder="e.g. HSR Layout" className="input-field !pl-10" />
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-field" htmlFor="owner">Owner full name</label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                  <input id="owner" required placeholder="Full name" className="input-field !pl-10" />
                </div>
              </div>
              <div>
                <label className="label-field" htmlFor="pphone">Phone</label>
                <div className="relative">
                  <Phone className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                  <input id="pphone" required type="tel" placeholder="+91" className="input-field !pl-10" />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2.5 rounded-2xl bg-blue-50/70 px-4 py-3.5 text-xs leading-relaxed text-blue-900/80 ring-1 ring-blue-100 ring-inset">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-blue-600" />
              Your store goes live only after MedRelay verifies the licence. Fake or expired licences are rejected.
            </div>
          </>
        ) : role === "rider" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-field" htmlFor="rname">Full name</label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                  <input id="rname" required placeholder="Full name" className="input-field !pl-10" />
                </div>
              </div>
              <div>
                <label className="label-field" htmlFor="rphone">Phone</label>
                <div className="relative">
                  <Phone className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                  <input id="rphone" required type="tel" placeholder="+91" className="input-field !pl-10" />
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-field" htmlFor="vehicle">Vehicle type</label>
                <select id="vehicle" className="input-field" defaultValue="Motorbike / Scooter">
                  <option>Motorbike / Scooter</option>
                  <option>Bicycle / E-bike</option>
                </select>
              </div>
              <div>
                <label className="label-field" htmlFor="vno">Vehicle number</label>
                <div className="relative">
                  <Bike className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                  <input id="vno" required placeholder="KA-05-XX-0000" className="input-field !pl-10" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-field" htmlFor="cname">Full name</label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                  <input id="cname" required placeholder="Full name" className="input-field !pl-10" />
                </div>
              </div>
              <div>
                <label className="label-field" htmlFor="cphone">Phone</label>
                <div className="relative">
                  <Phone className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                  <input id="cphone" required type="tel" placeholder="+91" className="input-field !pl-10" />
                </div>
              </div>
            </div>
            <div>
              <label className="label-field" htmlFor="cemail">Email</label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                <input id="cemail" required type="email" placeholder="you@example.com" autoComplete="email" className="input-field !pl-10" />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="label-field" htmlFor="reg-password">Password</label>
          <PasswordInput id="reg-password" />
        </div>

        {role !== "pharmacy" && role !== "rider" ? null : (
          <div>
            <label className="label-field" htmlFor="org-email">Work email</label>
            <div className="relative">
              <Building2 className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
              <input id="org-email" required type="email" placeholder="you@yourstore.in" className="input-field !pl-10" />
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} className={cn("w-full", role === "pharmacy" ? "btn-green" : "btn-primary")}>
          {loading ? <><Loader2 className="size-4 animate-spin" /> Creating account…</> : role === "pharmacy" ? "Submit for verification" : "Create account"}
        </button>

        <p className="text-center text-[11px] leading-relaxed text-slate-400">
          By continuing you agree to our <Link href="/support#terms" className="font-semibold text-slate-600 underline underline-offset-2">Terms</Link> and{" "}
          <Link href="/support#privacy" className="font-semibold text-slate-600 underline underline-offset-2">Privacy Policy</Link>.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href={`/auth/login?role=${role}`} className="font-bold text-blue-600 hover:text-blue-800">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-dvh bg-slate-50/70">
      <div className="container-x grid min-h-dvh items-center gap-10 py-10 lg:grid-cols-[1fr_1.05fr]">
        <BrandPanel
          heading="Join the network that delivers trust, hyperlocally."
          lines={[
            "Customers: medicines in 20–45 minutes",
            "Pharmacies: new orders without a delivery fleet",
            "Riders: flexible hours, transparent payouts",
          ]}
        />
        <div className="mx-auto w-full max-w-md">
          <BackToHome />
          <Suspense fallback={<div className="shimmer h-96 rounded-3xl" />}>
            <RegisterInner />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
