"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronRight,
  Clock,
  FileText,
  FileUp,
  Home,
  MapPin,
  Package,
  Plus,
  Radar,
  ShoppingBag,
  User,
  Wallet,
} from "lucide-react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { StatusPill } from "@/components/ui";
import { ADDRESSES, CUSTOMER, CUSTOMER_RX, PAST_ORDERS, getPharmacy } from "@/lib/data";
import { useApp } from "@/lib/store";
import { cn, inr } from "@/lib/utils";

const NAV = [
  { key: "overview", label: "Dashboard", icon: "dashboard" as const },
  { key: "orders", label: "My Orders", icon: "orders" as const },
  { key: "rx", label: "Prescriptions", icon: "rx" as const },
  { key: "addresses", label: "Addresses", icon: "map" as const },
];

export default function CustomerDashboard() {
  const [tab, setTab] = useState("overview");
  const orders = useApp((s) => s.orders);
  const prescriptions = useApp((s) => s.prescriptions);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const activeOrders = mounted ? orders.length : 0;
  const totalOrders = PAST_ORDERS.length + activeOrders;
  const rxList = [
    ...(mounted
      ? prescriptions.map((p) => ({
          id: p.id,
          uploadedAt: p.uploadedAt,
          status: p.status,
          meds: p.meds,
          verifiedBy: "",
        }))
      : []),
    ...CUSTOMER_RX,
  ];

  return (
    <DashboardShell
      title={`Hello, ${CUSTOMER.name.split(" ")[0]}`}
      subtitle="Your orders, prescriptions and addresses in one place"
      roleLabel="Customer"
      accent="blue"
      items={NAV}
      active={tab}
      onSelect={setTab}
      userName={CUSTOMER.name}
    >
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={Radar} label="Active orders" value={String(activeOrders + (activeOrders === 0 ? 1 : 0))} sub="Out for delivery" tone="blue" />
            <StatCard icon={ShoppingBag} label="Total orders" value={String(totalOrders + 1)} sub="Since Jan 2025" tone="green" />
            <StatCard icon={FileText} label="Prescriptions" value={String(rxList.length)} sub="On your profile" tone="blue" />
            <StatCard icon={MapPin} label="Saved addresses" value={String(ADDRESSES.length)} sub="Home & work" tone="green" />
          </div>

          {/* active order */}
          <div className="card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
              <h2 className="font-display text-base font-bold text-slate-900">Active order</h2>
              <Link href="/track" className="text-xs font-bold text-blue-600 hover:text-blue-800">View tracking →</Link>
            </div>
            <div className="flex flex-wrap items-center gap-4 px-6 py-5">
              <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-600"><Package className="size-6" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">
                  #{mounted && orders[0] ? orders[0].id : "MR-90412"} · NovaMed Pharmacy
                </p>
                <p className="mt-0.5 text-xs text-slate-500">3 items · picked up by Arjun · arriving in 18–25 min</p>
                <div className="mt-3 h-2 max-w-md overflow-hidden rounded-full bg-slate-100">
                  <div className="progress-stripes h-full w-3/5 rounded-full bg-blue-600" />
                </div>
              </div>
              <Link href="/track" className="btn-primary !px-4 !py-2.5 text-xs">
                <Radar className="size-4" /> Track live
              </Link>
            </div>
          </div>

          {/* quick actions */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: FileUp, title: "Upload prescription", sub: "OCR digitised, pharmacist verified", href: "/prescription", cta: "Upload" },
              { icon: Package, title: "Order medicines", sub: "Live stock from pharmacies nearby", href: "/medicines", cta: "Browse" },
              { icon: Clock, title: "Track delivery", sub: "Real-time rider tracking & OTP", href: "/track", cta: "Track" },
            ].map((a) => (
              <div key={a.title} className="card group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
                <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><a.icon className="size-5" /></span>
                <p className="mt-3.5 text-sm font-bold text-slate-900">{a.title}</p>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-500">{a.sub}</p>
                <Link href={a.href} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:gap-2">
                  {a.cta} <ChevronRight className="size-3.5 transition-all" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="font-display text-base font-bold text-slate-900">Order history</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {mounted &&
              orders.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center gap-3 px-6 py-4">
                  <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><Package className="size-5" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900">#{o.id}</p>
                    <p className="text-xs text-slate-500">
                      {o.items.length} item(s) · {getPharmacy(o.pharmacyId)?.name ?? "NovaMed Pharmacy"} · {o.placedAt}
                    </p>
                  </div>
                  <StatusPill status="Out for delivery" />
                  <span className="text-sm font-bold tabular-nums">{inr(o.total)}</span>
                  <Link href="/track" className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100">Track</Link>
                </li>
              ))}
            {PAST_ORDERS.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center gap-3 px-6 py-4">
                <span className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-500"><Package className="size-5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">#{o.id}</p>
                  <p className="text-xs text-slate-500">{o.items} items · {getPharmacy(o.pharmacyId)?.name} · {o.date}</p>
                </div>
                <StatusPill status={o.status} />
                <span className="text-sm font-bold tabular-nums">{inr(o.total)}</span>
                <Link href="/medicines" className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200">Reorder</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "rx" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-slate-900">Your prescriptions</h2>
              <p className="text-xs text-slate-500">Digitised with OCR, verified by licensed pharmacists.</p>
            </div>
            <Link href="/prescription" className="btn-primary !px-4 !py-2 text-xs"><Plus className="size-4" /> Upload</Link>
          </div>
          {rxList.map((rx) => (
            <div key={rx.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><FileText className="size-5" /></span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{rx.id}</p>
                    <p className="text-[11px] text-slate-400">Uploaded {rx.uploadedAt}</p>
                  </div>
                </div>
                <span className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-bold ring-1 ring-inset",
                  rx.status === "verified" ? "bg-green-50 text-green-700 ring-green-200" : "bg-amber-50 text-amber-700 ring-amber-200",
                )}>
                  {rx.status === "verified" ? "✓ Verified" : "Pending verification"}
                </span>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {rx.meds.map((m) => (
                  <div key={m.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs">
                    <span className="font-semibold text-slate-700">{m.name} {m.strength}</span>
                    <span className="text-slate-400">{m.dose}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] text-slate-400">
                  {rx.status === "verified" && rx.verifiedBy ? `Verified by ${rx.verifiedBy}` : "Subject to pharmacist verification before dispensing"}
                </p>
                <Link href="/medicines" className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100">Order these medicines</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "addresses" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {ADDRESSES.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Home className="size-4 text-blue-600" /> {a.label}
                </span>
                {a.tag && <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700 ring-1 ring-green-200 ring-inset">{a.tag}</span>}
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-500">{a.line}</p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                <Wallet className="size-3.5" /> Default for checkout
              </div>
            </div>
          ))}
          <button className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 transition-colors hover:border-blue-400 hover:text-blue-600">
            <Plus className="size-6" />
            <span className="text-sm font-bold">Add new address</span>
          </button>
        </div>
      )}

      {/* profile footer strip */}
      <div className="card mt-6 flex flex-wrap items-center gap-4 p-5">
        <span className="grid size-11 place-items-center rounded-2xl bg-slate-900 text-sm font-bold text-white"><User className="size-5" /></span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">{CUSTOMER.name}</p>
          <p className="text-xs text-slate-500">{CUSTOMER.email} · {CUSTOMER.phone} · member since {CUSTOMER.memberSince}</p>
        </div>
        <Link href="/support#contact" className="text-xs font-bold text-blue-600">Need help?</Link>
      </div>
    </DashboardShell>
  );
}
