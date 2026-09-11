"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  BarChart3,
  Bell,
  Bike,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  MapPin,
  Pill,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { LogoMark } from "./ui";

const ICONS = {
  dashboard: LayoutDashboard,
  orders: ShoppingBag,
  inventory: Pill,
  rx: FileText,
  customers: Users,
  reports: BarChart3,
  settings: Settings,
  deliveries: Bike,
  earnings: Wallet,
  map: MapPin,
  verify: ShieldCheck,
  store: Store,
  activity: ClipboardList,
} satisfies Record<string, LucideIcon>;

export type ShellIcon = keyof typeof ICONS;

export interface ShellNavItem {
  key: string;
  label: string;
  icon: ShellIcon;
  badge?: number;
}

export function DashboardShell({
  title,
  subtitle,
  roleLabel,
  accent = "blue",
  items,
  active,
  onSelect,
  userName,
  children,
}: {
  title: string;
  subtitle?: string;
  roleLabel: string;
  accent?: "blue" | "green";
  items: ShellNavItem[];
  active: string;
  onSelect: (key: string) => void;
  userName: string;
  children: React.ReactNode;
}) {
  const accentText = accent === "green" ? "text-green-700 bg-green-50 ring-green-200" : "text-blue-700 bg-blue-50 ring-blue-200";
  const activeCls = accent === "green" ? "bg-green-600 text-white shadow-[var(--shadow-cta-green)]" : "bg-blue-600 text-white shadow-[var(--shadow-cta)]";

  return (
    <div className="flex min-h-dvh bg-slate-50/80">
      {/* sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
          <LogoMark className="!size-8" />
          <div className="min-w-0">
            <p className="font-display text-base font-bold tracking-tight text-slate-900">
              Med<span className="text-blue-600">Relay</span>
            </p>
            <span className={cn("mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset", accentText)}>
              {roleLabel}
            </span>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Dashboard">
          {items.map((item) => {
            const Icon = ICONS[item.icon];
            const isActive = item.key === active;
            return (
              <button
                key={item.key}
                onClick={() => onSelect(item.key)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all",
                  isActive ? activeCls : "text-slate-600 hover:bg-slate-100",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="size-4.5" />
                {item.label}
                {item.badge != null && item.badge > 0 && (
                  <span className={cn("ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold", isActive ? "bg-white/20 text-white" : "bg-red-50 text-red-600")}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-slate-100 p-3">
          <Link href="/" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100">
            <ArrowLeft className="size-4.5" /> Back to store
          </Link>
          <Link href="/auth/login" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50">
            <LogOut className="size-4.5" /> Sign out
          </Link>
        </div>
      </aside>

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <Link href="/" className="lg:hidden">
              <LogoMark className="!size-8" />
            </Link>
            <div className="min-w-0">
              <h1 className="truncate font-display text-lg font-bold tracking-tight text-slate-900">{title}</h1>
              {subtitle && <p className="hidden truncate text-xs text-slate-500 sm:block">{subtitle}</p>}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ring-inset lg:hidden", accentText)}>{roleLabel}</span>
              <button className="relative grid size-9 place-items-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100" aria-label="Notifications">
                <Bell className="size-4.5" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 ring-2 ring-white" />
              </button>
              <span className="grid size-9 place-items-center rounded-xl bg-slate-900 text-xs font-bold text-white">{initials(userName)}</span>
            </div>
          </div>
          {/* mobile tabs */}
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-t border-slate-100 px-3 py-2 lg:hidden">
            {items.map((item) => {
              const Icon = ICONS[item.icon];
              const isActive = item.key === active;
              return (
                <button
                  key={item.key}
                  onClick={() => onSelect(item.key)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all",
                    isActive ? activeCls : "bg-slate-100 text-slate-600",
                  )}
                >
                  <Icon className="size-3.5" /> {item.label}
                  {item.badge != null && item.badge > 0 && <span className="rounded-full bg-white/25 px-1.5 text-[9px]">{item.badge}</span>}
                </button>
              );
            })}
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone = "blue",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  tone?: "blue" | "green" | "red" | "amber";
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-center justify-between">
        <span className={cn("grid size-10 place-items-center rounded-xl", tones[tone])}>
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-4 font-display text-2xl font-bold tracking-tight text-slate-900 tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs font-semibold text-slate-500">{label}</p>
      {sub && <p className="mt-1 text-[11px] text-slate-400">{sub}</p>}
    </div>
  );
}
