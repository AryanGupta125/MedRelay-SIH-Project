import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { CheckCircle2, FileWarning, ShieldCheck, Star, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/* --------------------------------- Logo ----------------------------------- */

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative grid size-9 place-items-center rounded-xl bg-blue-600 text-white shadow-md", className)}>
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
        <path d="M12 5.5v13" />
        <path d="M5.5 12h13" />
      </svg>
      <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-green-500 ring-2 ring-white" />
    </span>
  );
}

export function Logo({ href = "/", light = false }: { href?: string; light?: boolean }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5" aria-label="MedRelay home">
      <LogoMark className="transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3" />
      <span className={cn("font-display text-xl font-bold tracking-tight", light ? "text-white" : "text-slate-900")}>
        Med<span className="text-blue-600">Relay</span>
      </span>
    </Link>
  );
}

/* --------------------------------- Badges --------------------------------- */

export function VerifiedBadge({ label = "Verified Pharmacy", compact = false }: { label?: string; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700 ring-1 ring-green-200 ring-inset">
      <ShieldCheck className="size-3.5" />
      {compact ? "Verified" : label}
    </span>
  );
}

export function StockPill({ qty }: { qty: number }) {
  if (qty <= 0)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600 ring-1 ring-red-200 ring-inset">
        <XCircle className="size-3.5" /> Unavailable
      </span>
    );
  if (qty <= 10)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200 ring-inset">
        <CheckCircle2 className="size-3.5" /> Low stock · {qty} left
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700 ring-1 ring-green-200 ring-inset">
      <CheckCircle2 className="size-3.5" /> In Stock
    </span>
  );
}

export function RxBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-blue-700 ring-1 ring-blue-200 ring-inset">
      <FileWarning className="size-3" /> Rx
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Delivered: "bg-green-50 text-green-700 ring-green-200",
    "Out for delivery": "bg-blue-50 text-blue-700 ring-blue-200",
    Packed: "bg-blue-50 text-blue-700 ring-blue-200",
    Confirmed: "bg-blue-50 text-blue-700 ring-blue-200",
    Cancelled: "bg-red-50 text-red-600 ring-red-200",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset", map[status] ?? "bg-slate-50 text-slate-600 ring-slate-200")}>
      {status}
    </span>
  );
}

/* --------------------------------- Stars ---------------------------------- */

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`Rated ${rating} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className={cn("size-3.5", i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200")}
        />
      ))}
    </span>
  );
}

/* ------------------------------ Section head ------------------------------- */

export function SectionHead({
  eyebrow,
  title,
  sub,
  align = "left",
  id,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
  id?: string;
}) {
  return (
    <div id={id} className={cn("mb-10 scroll-mt-24", align === "center" && "text-center")}>
      <p className="mb-2 text-xs font-bold tracking-[0.18em] text-blue-600 uppercase">{eyebrow}</p>
      <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      {sub ? <p className={cn("mt-3 max-w-2xl text-base text-slate-500", align === "center" && "mx-auto")}>{sub}</p> : null}
    </div>
  );
}

/* ------------------------------ Empty state -------------------------------- */

export function EmptyState({
  icon: Icon,
  title,
  sub,
  action,
}: {
  icon: LucideIcon;
  title: string;
  sub: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center px-6 py-16 text-center">
      <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-blue-50 text-blue-600">
        <Icon className="size-7" />
      </span>
      <h3 className="font-display text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">{sub}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
