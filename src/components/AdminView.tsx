"use client";

import { useState } from "react";
import {
  Activity,
  BadgeCheck,
  Bike,
  CheckCircle2,
  Database,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  Timer,
  Users,
  XCircle,
} from "lucide-react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { AreaChart, Donut, ProgressRow } from "@/components/charts";
import { StatusPill } from "@/components/ui";
import {
  ADMIN_KPIS,
  DELIVERY_PERF,
  DEMAND_SPLIT,
  ORDERS_SERIES,
  PHARMACY_PERF,
  RECENT_ORDERS,
  VERIFICATION_QUEUE,
} from "@/lib/data";
import { cn, inr } from "@/lib/utils";

interface LiveStats {
  customers: number;
  pharmacies: number;
  partners: number;
  orders: number;
  revenue: number;
}

export function AdminView({ live }: { live: LiveStats | null }) {
  const [tab, setTab] = useState("overview");
  const [orderSearch, setOrderSearch] = useState("");
  const [queue, setQueue] = useState(VERIFICATION_QUEUE.map((v) => ({ ...v, state: "pending" as "pending" | "approved" | "rejected" })));
  const pendingCount = queue.filter((v) => v.state === "pending").length;

  const kpis = {
    customers: live?.customers ?? ADMIN_KPIS.customers,
    pharmacies: live?.pharmacies ?? ADMIN_KPIS.pharmacies,
    partners: live?.partners ?? ADMIN_KPIS.partners,
  };

  const nav = [
    { key: "overview", label: "Dashboard", icon: "dashboard" as const },
    { key: "orders", label: "Orders", icon: "orders" as const },
    { key: "pharmacies", label: "Pharmacies", icon: "verify" as const, badge: pendingCount },
    { key: "delivery", label: "Delivery Ops", icon: "deliveries" as const },
  ];

  return (
    <DashboardShell
      title="Admin Console"
      subtitle="Platform-wide monitoring, verification and analytics"
      roleLabel="Administrator"
      accent="blue"
      items={nav}
      active={tab}
      onSelect={setTab}
      userName="Platform Admin"
    >
      {/* data source chip */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ring-1 ring-inset",
          live ? "bg-green-50 text-green-700 ring-green-200" : "bg-slate-100 text-slate-500 ring-slate-200",
        )}>
          <Database className="size-3.5" />
          {live ? "Connected to PostgreSQL · live counts" : "Demo dataset (database offline)"}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-700 ring-1 ring-blue-200 ring-inset">
          <Activity className="size-3.5" /> All systems operational
        </span>
      </div>

      {/* ------------------------------ OVERVIEW ------------------------------ */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard icon={Users} label="Total customers" value={kpis.customers.toLocaleString("en-IN")} sub="+214 this week" tone="blue" />
            <StatCard icon={Store} label="Verified pharmacies" value={String(kpis.pharmacies)} sub="licence-checked" tone="green" />
            <StatCard icon={Bike} label="Delivery partners" value={String(kpis.partners)} sub="312 active now" tone="blue" />
            <StatCard icon={ShoppingBag} label="Orders today" value={ADMIN_KPIS.ordersToday.toLocaleString("en-IN")} sub="+9.4% vs yesterday" tone="green" />
            <StatCard icon={PackageCheck} label="Successful deliveries" value={`${ADMIN_KPIS.deliveredRate}%`} sub="last 30 days" tone="green" />
            <StatCard icon={ShieldCheck} label="Pending verifications" value={String(pendingCount)} sub="pharmacy onboarding" tone="amber" />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <div className="card p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-slate-900">Orders over time</h3>
                <span className="text-xs font-semibold text-green-600">↑ 13.6% this week</span>
              </div>
              <AreaChart data={ORDERS_SERIES} />
            </div>
            <div className="card p-6">
              <h3 className="mb-5 font-display text-base font-bold text-slate-900">Medicine demand</h3>
              <Donut segments={DEMAND_SPLIT} centerLabel="share %" />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="card p-6">
              <h3 className="mb-5 font-display text-base font-bold text-slate-900">Pharmacy performance</h3>
              <div className="space-y-4">
                {PHARMACY_PERF.map((p) => (
                  <ProgressRow key={p.name} label={`${p.name} · ${p.orders} orders`} value={`${p.fulfil}% fulfil`} pct={p.fulfil} tone="green" />
                ))}
              </div>
            </div>
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h3 className="font-display text-base font-bold text-slate-900">Live order activity</h3>
                <button onClick={() => setTab("orders")} className="text-xs font-bold text-blue-600">View all →</button>
              </div>
              <ul className="divide-y divide-slate-100">
                {RECENT_ORDERS.slice(0, 4).map((o) => (
                  <li key={o.id} className="flex items-center gap-3 px-6 py-3">
                    <span className="grid size-8 place-items-center rounded-lg bg-blue-50 text-blue-600"><ShoppingBag className="size-4" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-800">#{o.id} · {o.customer}</p>
                      <p className="text-[11px] text-slate-400">{o.pharmacy} · {o.when}</p>
                    </div>
                    <StatusPill status={o.status} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------- ORDERS -------------------------------- */}
      {tab === "orders" && (
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-6 py-4">
            <h2 className="font-display text-base font-bold text-slate-900">All orders</h2>
            <div className="relative ml-auto">
              <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
              <input value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} placeholder="Search id, customer, pharmacy…" className="input-field !py-2 !pl-9 text-xs" aria-label="Search orders" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase">
                  <th className="px-6 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Pharmacy</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-6 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {RECENT_ORDERS.filter(
                  (o) =>
                    o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                    o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
                    o.pharmacy.toLowerCase().includes(orderSearch.toLowerCase()),
                ).map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-6 py-3.5 font-bold text-blue-700">#{o.id}</td>
                    <td className="px-4 py-3.5 text-slate-700">{o.customer}</td>
                    <td className="px-4 py-3.5 text-slate-600">{o.pharmacy}</td>
                    <td className="px-4 py-3.5 font-semibold tabular-nums">{inr(o.total)}</td>
                    <td className="px-4 py-3.5"><StatusPill status={o.status} /></td>
                    <td className="px-6 py-3.5 text-xs text-slate-400">{o.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------------------- PHARMACIES ------------------------------ */}
      {tab === "pharmacies" && (
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="font-display text-base font-bold text-slate-900">Pharmacy verification requests</h2>
                <p className="text-xs text-slate-500">Review drug licences and credentials before a store goes live.</p>
              </div>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200 ring-inset">
                {pendingCount} pending
              </span>
            </div>
            <ul className="divide-y divide-slate-100">
              {queue.map((v) => (
                <li key={v.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-900 font-display text-xs font-bold text-white">
                    {v.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900">{v.name} <span className="font-medium text-slate-400">· {v.area}</span></p>
                    <p className="mt-0.5 text-[11px] text-slate-500">Licence {v.license} · {v.submitted} · Docs: {v.docs}</p>
                  </div>
                  {v.state === "pending" ? (
                    <div className="flex gap-2">
                      <button onClick={() => setQueue((q) => q.map((x) => (x.id === v.id ? { ...x, state: "rejected" } : x)))} className="rounded-xl border border-red-200 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50">
                        <XCircle className="mr-1 inline size-3.5" /> Reject
                      </button>
                      <button onClick={() => setQueue((q) => q.map((x) => (x.id === v.id ? { ...x, state: "approved" } : x)))} className="rounded-xl bg-green-600 px-3.5 py-2 text-xs font-bold text-white shadow-[var(--shadow-cta-green)] transition-transform hover:scale-[1.03]">
                        <CheckCircle2 className="mr-1 inline size-3.5" /> Verify store
                      </button>
                    </div>
                  ) : (
                    <span className={cn("rounded-full px-3 py-1.5 text-[11px] font-bold ring-1 ring-inset", v.state === "approved" ? "bg-green-50 text-green-700 ring-green-200" : "bg-red-50 text-red-600 ring-red-200")}>
                      {v.state === "approved" ? "✓ Verified & live" : "Rejected"}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="font-display text-base font-bold text-slate-900">Top pharmacies · this week</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase">
                    <th className="px-6 py-3">Pharmacy</th>
                    <th className="px-4 py-3">Orders</th>
                    <th className="px-4 py-3 w-1/3">Fulfilment</th>
                    <th className="px-6 py-3 text-right">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {PHARMACY_PERF.map((p) => (
                    <tr key={p.name} className="transition-colors hover:bg-slate-50/60">
                      <td className="px-6 py-3.5">
                        <span className="flex items-center gap-2 font-bold text-slate-800">
                          <BadgeCheck className="size-4 text-green-600" /> {p.name}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-semibold tabular-nums">{p.orders}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-green-500" style={{ width: `${p.fulfil}%` }} />
                          </div>
                          <span className="text-xs font-bold text-slate-700 tabular-nums">{p.fulfil}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-right font-bold text-slate-800 tabular-nums">{p.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------- DELIVERY ------------------------------ */}
      {tab === "delivery" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={Timer} label="Avg. delivery time" value={`${DELIVERY_PERF.avgMins} min`} sub="citywide, today" tone="blue" />
            <StatCard icon={CheckCircle2} label="On-time rate" value={`${DELIVERY_PERF.onTime}%`} sub="within promised ETA" tone="green" />
            <StatCard icon={Bike} label="Riders active now" value={String(DELIVERY_PERF.activeNow)} sub="across zones" tone="blue" />
            <StatCard icon={Activity} label="Service zones" value={String(DELIVERY_PERF.zones)} sub="Bengaluru south" tone="green" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="card p-6">
              <h3 className="mb-5 font-display text-base font-bold text-slate-900">Zone load · right now</h3>
              <div className="space-y-4">
                <ProgressRow label="HSR Layout" value="72 riders" pct={88} />
                <ProgressRow label="Koramangala" value="64 riders" pct={76} />
                <ProgressRow label="BTM Layout" value="51 riders" pct={62} />
                <ProgressRow label="Electronic City" value="47 riders" pct={58} />
                <ProgressRow label="Bellandur" value="39 riders" pct={47} />
                <ProgressRow label="Whitefield (opening soon)" value="18 riders" pct={24} tone="green" />
              </div>
            </div>
            <div className="card overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="font-display text-base font-bold text-slate-900">Top riders today</h3>
              </div>
              <ul className="divide-y divide-slate-100">
                {[
                  { name: "Arjun Kumar", deliveries: 12, rating: 4.9, mins: 23 },
                  { name: "Faraz Ahmed", deliveries: 11, rating: 4.8, mins: 25 },
                  { name: "Deepak Yadav", deliveries: 10, rating: 4.9, mins: 24 },
                  { name: "Sanjay Patil", deliveries: 9, rating: 4.7, mins: 27 },
                ].map((r) => (
                  <li key={r.name} className="flex items-center gap-3 px-6 py-3.5">
                    <span className="grid size-9 place-items-center rounded-xl bg-blue-600 font-display text-[11px] font-bold text-white">
                      {r.name.split(" ").map((w) => w[0]).join("")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900">{r.name}</p>
                      <p className="text-[11px] text-slate-500">{r.deliveries} deliveries · avg {r.mins} min</p>
                    </div>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200 ring-inset">★ {r.rating}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
