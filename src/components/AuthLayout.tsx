"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Bike,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Store,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMark } from "./ui";

export type Role = "customer" | "pharmacy" | "rider" | "admin";

export const ROLES: { id: Role; label: string; icon: typeof User; dest: string }[] = [
  { id: "customer", label: "Customer", icon: User, dest: "/dashboard" },
  { id: "pharmacy", label: "Pharmacy", icon: Store, dest: "/partner/pharmacy" },
  { id: "rider", label: "Delivery Partner", icon: Bike, dest: "/partner/rider" },
  { id: "admin", label: "Admin", icon: ShieldCheck, dest: "/admin" },
];

export function RoleTabs({
  role,
  onChange,
  includeAdmin = false,
}: {
  role: Role;
  onChange: (r: Role) => void;
  includeAdmin?: boolean;
}) {
  const roles = includeAdmin ? ROLES : ROLES.filter((r) => r.id !== "admin");
  return (
    <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-slate-100 p-1.5" role="tablist" aria-label="Select your role">
      {roles.map((r) => (
        <button
          key={r.id}
          role="tab"
          aria-selected={role === r.id}
          onClick={() => onChange(r.id)}
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-[11px] font-bold transition-all sm:flex-row sm:justify-center sm:gap-1.5 sm:text-xs",
            role === r.id ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700",
          )}
        >
          <r.icon className="size-4" />
          {r.label}
        </button>
      ))}
    </div>
  );
}

export function BrandPanel({ heading, lines }: { heading: string; lines: string[] }) {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden rounded-3xl bg-slate-900 p-10 lg:flex">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-24 -right-24 size-72 rounded-full bg-blue-600/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 size-64 rounded-full bg-green-600/20 blur-3xl" />
        <div className="dotgrid absolute inset-0 opacity-30" />
      </div>
      <Link href="/" className="relative inline-flex items-center gap-2.5">
        <LogoMark />
        <span className="font-display text-xl font-bold tracking-tight text-white">
          Med<span className="text-blue-400">Relay</span>
        </span>
      </Link>
      <div className="relative">
        <h2 className="font-display text-3xl leading-tight font-bold tracking-tight text-white">{heading}</h2>
        <ul className="mt-6 space-y-3">
          {lines.map((l) => (
            <li key={l} className="flex items-center gap-2.5 text-sm text-slate-300">
              <CheckCircle2 className="size-4.5 shrink-0 text-green-400" /> {l}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative flex items-center gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
        <span className="grid size-10 place-items-center rounded-xl bg-green-500/20 text-green-400">
          <BadgeCheck className="size-5" />
        </span>
        <p className="text-xs leading-relaxed text-slate-400">
          Every pharmacy on MedRelay is verified against its drug licence before it can receive orders.
        </p>
      </div>
    </div>
  );
}

export function BackToHome() {
  return (
    <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-800 lg:hidden">
      <ArrowLeft className="size-4" /> Home
    </Link>
  );
}

export function PasswordInput({ id = "password", placeholder = "Create a password" }: { id?: string; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
      <input id={id} type={show ? "text" : "password"} required placeholder={placeholder} autoComplete="current-password" className="input-field !pl-10" />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={<div className="shimmer h-96 rounded-3xl" />}>
      <LoginInner />
    </Suspense>
  );
}

import { useApp } from "@/lib/store";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const loginStore = useApp((s) => s.login);
  const initial = (params.get("role") as Role) || "customer";
  const [role, setRole] = useState<Role>(["customer", "pharmacy", "rider", "admin"].includes(initial) ? initial : "customer");
  const [mode, setMode] = useState<"login" | "forgot" | "sent">("login");
  const [loading, setLoading] = useState(false);

  const dest = ROLES.find((r) => r.id === role)!.dest;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    loginStore({
      name: role === "pharmacy" ? "NovaMed Pharmacy Owner" : role === "rider" ? "Arjun Rider" : "Rahul Deshmukh",
      email: "user@medrelay.in",
      role,
    });
    setTimeout(() => router.push(dest), 900);
  };

  return (
    <div className="card p-7 shadow-[var(--shadow-card)] sm:p-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
      <p className="mt-1.5 text-sm text-slate-500">Sign in to your {ROLES.find((r) => r.id === role)!.label.toLowerCase()} account.</p>

      <div className="mt-6">
        <RoleTabs role={role} onChange={setRole} includeAdmin />
      </div>

      {mode !== "forgot" ? (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label-field" htmlFor="email">Email or phone</label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
              <input id="email" type="text" required placeholder="you@example.com" autoComplete="username" className="input-field !pl-10" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="label-field" htmlFor="password">Password</label>
              {role === "pharmacy" && (
                <span className="mb-1.5 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700 ring-1 ring-green-200 ring-inset">
                  Verified store
                </span>
              )}
            </div>
            <PasswordInput placeholder="••••••••" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 font-medium text-slate-600">
              <input type="checkbox" defaultChecked className="size-4 rounded accent-blue-600" /> Remember me
            </label>
            <button type="button" onClick={() => setMode("forgot")} className="font-bold text-blue-600 hover:text-blue-800">
              Forgot password?
            </button>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <><Loader2 className="size-4 animate-spin" /> Signing in…</> : "Sign in"}
          </button>
          {mode === "sent" && (
            <p className="anim-fade-in rounded-xl bg-green-50 px-4 py-3 text-center text-xs font-semibold text-green-700 ring-1 ring-green-200 ring-inset">
              Reset link sent — check your inbox.
            </p>
          )}
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setMode("sent");
            setTimeout(() => setMode("login"), 2600);
          }}
          className="anim-fade-in mt-6 space-y-4"
        >
          <div>
            <label className="label-field" htmlFor="reset-email">Registered email</label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
              <input id="reset-email" type="email" required placeholder="you@example.com" className="input-field !pl-10" />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">Send reset link</button>
          <button type="button" onClick={() => setMode("login")} className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-700">
            ← Back to sign in
          </button>
        </form>
      )}

      {/* demo hints */}
      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <p className="mb-2 text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase">Demo access</p>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <Link key={r.id} href={r.dest} className="rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-600 ring-1 ring-slate-200 transition-colors hover:text-blue-700 hover:ring-blue-300">
              {r.label} dashboard →
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        New to MedRelay?{" "}
        <Link href={`/auth/register?role=${role === "admin" ? "customer" : role}`} className="font-bold text-blue-600 hover:text-blue-800">
          Create an account
        </Link>
      </p>
    </div>
  );
}
