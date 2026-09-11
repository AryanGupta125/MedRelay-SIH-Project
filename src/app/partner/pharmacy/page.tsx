"use client";

import { useMemo, useState } from "react";
import {
  BellRing,
  CheckCircle2,
  ClipboardList,
  Minus,
  PackageCheck,
  Plus,
  ReceiptText,
  Search,
  ShoppingBag,
  Stethoscope,
  TrendingUp,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { BarChart, Donut, ProgressRow } from "@/components/charts";
import { RxBadge } from "@/components/ui";
import { DEMAND_SPLIT, MEDICINES, PHARMACY_ORDERS, PHARMACY_RX_QUEUE, PHARMA_WEEK, getPharmacy } from "@/lib/data";
import { cn, inr } from "@/lib/utils";

const PHARMACY_ID = "p1";
const STORE = getPharmacy(PHARMACY_ID)!;

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard" as const },
  { key: "orders", label: "Orders", icon: "orders" as const, badge: 2 },
  { key: "inventory", label: "Inventory", icon: "inventory" as const },
  { key: "rx", label: "Prescriptions", icon: "rx" as const, badge: 3 },
  { key: "reports", label: "Reports", icon: "reports" as const },
  { key: "settings", label: "Settings", icon: "settings" as const },
];

const ORDER_FLOW: Record<string, { label: string; next?: string; nextLabel?: string }> = {
  new: { label: "New", next: "preparing", nextLabel: "Accept & prepare" },
  preparing: { label: "Preparing", next: "ready", nextLabel: "Mark ready" },
  ready: { label: "Ready", next: "out_for_delivery", nextLabel: "Hand to rider" },
  out_for_delivery: { label: "Out for delivery" },
  delivered: { label: "Delivered" },
  rejected: { label: "Rejected" },
};

const statusCls: Record<string, string> = {
  new: "bg-amber-50 text-amber-700 ring-amber-200",
  preparing: "bg-blue-50 text-blue-700 ring-blue-200",
  ready: "bg-blue-50 text-blue-700 ring-blue-200",
  out_for_delivery: "bg-blue-50 text-blue-700 ring-blue-200",
  delivered: "bg-green-50 text-green-700 ring-green-200",
  rejected: "bg-red-50 text-red-600 ring-red-200",
};

interface InvRow {
  id: string;
  name: string;
  form: string;
  price: number;
  qty: number;
  rx: boolean;
  custom?: boolean;
}

const INITIAL_INV: InvRow[] = MEDICINES.filter((m) => m.stock.some((s) => s.pharmacyId === PHARMACY_ID)).map((m) => ({
  id: m.id,
  name: m.name,
  form: `${m.form} · ${m.packSize}`,
  price: m.price,
  qty: m.stock.find((s) => s.pharmacyId === PHARMACY_ID)!.qty,
  rx: m.requiresPrescription,
}));

export default function PharmacyDashboard() {
  const [tab, setTab] = useState("dashboard");
  const [orders, setOrders] = useState(PHARMACY_ORDERS);
  const [rxQueue, setRxQueue] = useState(PHARMACY_RX_QUEUE.map((r) => ({ ...r, status: "pending" as string })));
  const [inv, setInv] = useState<InvRow[]>(INITIAL_INV);
  const [invSearch, setInvSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState({ name: "", price: "", qty: "", rx: false });
  const [openForOrders, setOpenForOrders] = useState(true);
  const [saved, setSaved] = useState(false);

  const pendingRx = rxQueue.filter((r) => r.status === "pending").length;
  const lowStock = inv.filter((r) => r.qty <= 10).length;
  const newOrders = orders.filter((o) => o.status === "new").length;

  const filteredInv = useMemo(
    () => inv.filter((r) => r.name.toLowerCase().includes(invSearch.toLowerCase())),
    [inv, invSearch],
  );

  const adjust = (id: string, delta: number) =>
    setInv((rows) => rows.map((r) => (r.id === id ? { ...r, qty: Math.max(0, r.qty + delta) } : r)));

  const addMedicine = () => {
    if (!newMed.name.trim() || !newMed.price) return;
    setInv((rows) => [
      { id: `custom-${Date.now()}`, name: newMed.name.trim(), form: "Tablet · newly added", price: Number(newMed.price) || 0, qty: Number(newMed.qty) || 0, rx: newMed.rx, custom: true },
      ...rows,
    ]);
    setNewMed({ name: "", price: "", qty: "", rx: false });
    setShowAdd(false);
  };

  const saveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardShell
      title={STORE.name}
      subtitle={`${STORE.area} · Licence ${STORE.licenseNo}`}
      roleLabel="Pharmacy Partner"
      accent="green"
      items={NAV.map((n) => (n.key === "orders" ? { ...n, badge: newOrders } : n.key === "rx" ? { ...n, badge: pendingRx } : n))}
      active={tab}
      onSelect={setTab}
      userName={STORE.name}
    >
      {/* ------------------------------ DASHBOARD ------------------------------ */}
      {tab === "dashboard" && (
        <div className="space-y-6">
          {newOrders > 0 && (
            <div className="anim-fade-up flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
              <span className="relative grid size-10 place-items-center rounded-xl bg-amber-500 text-white">
                <BellRing className="size-5" />
                <span className="absolute inset-0 animate-ping-soft rounded-xl bg-amber-400" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-amber-900">{newOrders} new {newOrders === 1 ? "order" : "orders"} waiting</p>
                <p className="text-xs text-amber-700">Accept quickly — customers expect fast confirmation.</p>
              </div>
              <button onClick={() => setTab("orders")} className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white">Review now</button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={ShoppingBag} label="Today's orders" value={String(34)} sub="+12% vs yesterday" tone="green" />
            <StatCard icon={Stethoscope} label="Pending prescriptions" value={String(pendingRx)} sub="Need pharmacist review" tone="amber" />
            <StatCard icon={TriangleAlert} label="Low stock medicines" value={String(lowStock)} sub="Restock recommended" tone="red" />
            <StatCard icon={PackageCheck} label="Completed today" value="28" sub="Avg. prep time 7 min" tone="green" />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <div className="card p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-slate-900">Orders this week</h3>
                <span className="text-xs font-semibold text-green-600">↑ 18% week-on-week</span>
              </div>
              <BarChart data={PHARMA_WEEK} labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} />
            </div>
            <div className="card p-6">
              <h3 className="mb-4 font-display text-base font-bold text-slate-900">Live snapshot</h3>
              <div className="space-y-4">
                <ProgressRow label="Fulfilment rate" value="98.2%" pct={98} tone="green" />
                <ProgressRow label="Inventory sync accuracy" value="96.4%" pct={96} tone="green" />
                <ProgressRow label="Avg. confirmation time" value="1.8 min" pct={88} />
                <ProgressRow label="Customer rating 4.8 / 5" value="2,314 ratings" pct={96} />
              </div>
              <div className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-xs leading-relaxed text-green-800">
                <TrendingUp className="mr-1.5 inline size-3.5" />
                You&apos;re the #1 fulfilled store in HSR Layout this week.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------- ORDERS -------------------------------- */}
      {tab === "orders" && (
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
            <h2 className="font-display text-base font-bold text-slate-900">Incoming orders</h2>
            <p className="text-xs text-slate-500">{orders.filter((o) => o.status !== "delivered" && o.status !== "rejected").length} active</p>
          </div>
          <ul className="divide-y divide-slate-100">
            {orders.map((o) => {
              const flow = ORDER_FLOW[o.status];
              return (
                <li key={o.id} className="px-6 py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">#{o.id}</p>
                        <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold ring-1 ring-inset", statusCls[o.status])}>{flow.label}</span>
                        {o.rx && (
                          <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700 ring-1 ring-green-200 ring-inset">
                            Rx verified
                          </span>
                        )}
                      </div>
                      <p className="mt-1 max-w-xl truncate text-xs text-slate-500">{o.items}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{o.customer} · {o.placed} · {inr(o.total)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {o.status === "new" && (
                        <button
                          onClick={() => setOrders((os) => os.map((x) => (x.id === o.id ? { ...x, status: "rejected" } : x)))}
                          className="rounded-xl border border-red-200 px-3.5 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
                        >
                          Reject
                        </button>
                      )}
                      {flow.next && (
                        <button
                          onClick={() => setOrders((os) => os.map((x) => (x.id === o.id ? { ...x, status: flow.next! } : x)))}
                          className={cn(
                            "rounded-xl px-3.5 py-2 text-xs font-bold text-white transition-transform hover:scale-[1.03]",
                            o.status === "new" ? "bg-green-600 shadow-[var(--shadow-cta-green)]" : "bg-blue-600 shadow-[var(--shadow-cta)]",
                          )}
                        >
                          {flow.nextLabel}
                        </button>
                      )}
                      {o.status === "rejected" && (
                        <button
                          onClick={() => setOrders((os) => os.map((x) => (x.id === o.id ? { ...x, status: "new" } : x)))}
                          className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50"
                        >
                          Undo
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ------------------------------ INVENTORY ------------------------------ */}
      {tab === "inventory" && (
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-6 py-4">
            <h2 className="font-display text-base font-bold text-slate-900">Inventory</h2>
            <span className="text-xs text-slate-500">synced live to customers searching nearby</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
                <input value={invSearch} onChange={(e) => setInvSearch(e.target.value)} placeholder="Search stock..." className="input-field !py-2 !pl-9 text-xs" aria-label="Search inventory" />
              </div>
              <button onClick={() => setShowAdd((v) => !v)} className="btn-green !px-3.5 !py-2 text-xs"><Plus className="size-4" /> Add medicine</button>
            </div>
          </div>

          {showAdd && (
            <div className="anim-fade-in grid gap-3 border-b border-slate-100 bg-blue-50/40 px-6 py-4 sm:grid-cols-[2fr_1fr_1fr_auto_auto]">
              <input value={newMed.name} onChange={(e) => setNewMed((m) => ({ ...m, name: e.target.value }))} placeholder="Medicine name & strength" className="input-field !py-2 text-xs" />
              <input value={newMed.price} onChange={(e) => setNewMed((m) => ({ ...m, price: e.target.value }))} placeholder="Price ₹" inputMode="numeric" className="input-field !py-2 text-xs" />
              <input value={newMed.qty} onChange={(e) => setNewMed((m) => ({ ...m, qty: e.target.value }))} placeholder="Qty" inputMode="numeric" className="input-field !py-2 text-xs" />
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <input type="checkbox" checked={newMed.rx} onChange={(e) => setNewMed((m) => ({ ...m, rx: e.target.checked }))} className="size-4 rounded accent-blue-600" /> Rx
              </label>
              <button onClick={addMedicine} className="btn-primary !px-4 !py-2 text-xs">Save</button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase">
                  <th className="px-6 py-3">Medicine</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Prescription</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredInv.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-6 py-3.5">
                      <p className="font-bold text-slate-800">{r.name}</p>
                      <p className="text-[11px] text-slate-400">{r.form}{r.custom && " · manual entry"}</p>
                    </td>
                    <td className="px-4 py-3.5 font-semibold tabular-nums">{inr(r.price)}</td>
                    <td className="px-4 py-3.5">{r.rx ? <RxBadge /> : <span className="text-[11px] text-slate-400">OTC</span>}</td>
                    <td className="px-4 py-3.5">
                      <div className="inline-flex items-center rounded-lg border border-slate-200">
                        <button onClick={() => adjust(r.id, -1)} className="grid h-7 w-7 place-items-center text-slate-500 hover:bg-slate-100" aria-label="Decrease stock"><Minus className="size-3.5" /></button>
                        <span className="w-10 text-center text-xs font-bold tabular-nums">{r.qty}</span>
                        <button onClick={() => adjust(r.id, 1)} className="grid h-7 w-7 place-items-center text-slate-500 hover:bg-slate-100" aria-label="Increase stock"><Plus className="size-3.5" /></button>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {r.qty === 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600 ring-1 ring-red-200 ring-inset"><XCircle className="size-3" /> Out of stock</span>
                      ) : r.qty <= 10 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 ring-1 ring-amber-200 ring-inset"><TriangleAlert className="size-3" /> Low · restock</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700 ring-1 ring-green-200 ring-inset"><CheckCircle2 className="size-3" /> In stock</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button onClick={() => adjust(r.id, 20)} className="rounded-lg bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-700 transition-colors hover:bg-blue-100">
                        + Restock 20
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------------------- PRESCRIPTIONS ---------------------------- */}
      {tab === "rx" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 px-5 py-4 text-xs leading-relaxed text-blue-900/80">
            <Stethoscope className="mr-1.5 inline size-4" />
            OCR digitises each uploaded prescription. Verify the extracted medicines against the scan before approving —
            only you can authorise dispensing.
          </div>
          {rxQueue.map((rx) => (
            <div key={rx.id} className={cn("card p-5 transition-all", rx.status !== "pending" && "opacity-75")}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-900">
                    {rx.id} · {rx.customer}
                    <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold ring-1 ring-inset", rx.status === "pending" ? "bg-amber-50 text-amber-700 ring-amber-200" : rx.status === "approved" ? "bg-green-50 text-green-700 ring-green-200" : "bg-red-50 text-red-600 ring-red-200")}>
                      {rx.status === "pending" ? "Awaiting review" : rx.status === "approved" ? "✓ Verified & approved" : "Rejected"}
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">Uploaded {rx.uploaded} · {rx.doctor}</p>
                </div>
                {rx.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setRxQueue((q) => q.map((x) => (x.id === rx.id ? { ...x, status: "rejected" } : x)))}
                      className="rounded-xl border border-red-200 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => setRxQueue((q) => q.map((x) => (x.id === rx.id ? { ...x, status: "approved" } : x)))}
                      className="rounded-xl bg-green-600 px-3.5 py-2 text-xs font-bold text-white shadow-[var(--shadow-cta-green)] transition-transform hover:scale-[1.03]"
                    >
                      <CheckCircle2 className="mr-1 inline size-4" /> Verify & approve
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {rx.meds.map((m) => (
                  <div key={m.name} className="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-800">{m.name} {m.strength}</p>
                      <span className="text-[10px] font-bold text-green-700 tabular-nums">{m.confidence}% match</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">{m.dose}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------- REPORTS -------------------------------- */}
      {tab === "reports" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="mb-5 flex items-center gap-2 font-display text-base font-bold text-slate-900">
              <ReceiptText className="size-5 text-blue-600" /> Orders · last 7 days
            </h3>
            <BarChart data={PHARMA_WEEK} labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} />
          </div>
          <div className="card p-6">
            <h3 className="mb-5 font-display text-base font-bold text-slate-900">Sales by category</h3>
            <Donut segments={DEMAND_SPLIT} centerLabel="orders" />
          </div>
          <div className="card p-6 lg:col-span-2">
            <h3 className="mb-5 font-display text-base font-bold text-slate-900">Top medicines this month</h3>
            <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
              <ProgressRow label="Paracetamol 650mg" value="412 packs" pct={96} tone="green" />
              <ProgressRow label="Cetirizine 10mg" value="286 packs" pct={70} tone="green" />
              <ProgressRow label="ORS Orange Sachet" value="245 packs" pct={58} tone="green" />
              <ProgressRow label="Omeprazole 20mg" value="198 packs" pct={47} />
              <ProgressRow label="Daily Multivitamin" value="142 packs" pct={34} />
              <ProgressRow label="Pain Relief Spray" value="121 packs" pct={29} />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------- SETTINGS ------------------------------- */}
      {tab === "settings" && (
        <div className="grid max-w-3xl gap-4">
          <div className="card p-6">
            <h3 className="mb-4 font-display text-base font-bold text-slate-900">Store profile</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label-field" htmlFor="s-name">Store name</label><input id="s-name" defaultValue={STORE.name} className="input-field" /></div>
              <div><label className="label-field" htmlFor="s-phone">Phone</label><input id="s-phone" defaultValue={STORE.phone} className="input-field" /></div>
              <div><label className="label-field" htmlFor="s-lic">Drug licence</label><input id="s-lic" defaultValue={STORE.licenseNo} className="input-field" /></div>
              <div><label className="label-field" htmlFor="s-hours">Hours</label><input id="s-hours" defaultValue={`9:00 AM – ${STORE.closesAt}`} className="input-field" /></div>
              <div className="sm:col-span-2"><label className="label-field" htmlFor="s-addr">Address</label><input id="s-addr" defaultValue={STORE.address} className="input-field" /></div>
            </div>
            <label className="mt-5 flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 px-4 py-3.5">
              <span>
                <span className="block text-sm font-bold text-slate-800">Open for orders</span>
                <span className="block text-xs text-slate-500">Customers nearby can see and order from your inventory</span>
              </span>
              <span className={cn("relative h-7 w-12 rounded-full transition-colors", openForOrders ? "bg-green-500" : "bg-slate-300")}>
                <input type="checkbox" className="peer sr-only" checked={openForOrders} onChange={(e) => setOpenForOrders(e.target.checked)} />
                <span className={cn("absolute top-0.5 size-6 rounded-full bg-white shadow transition-all", openForOrders ? "left-[22px]" : "left-0.5")} />
              </span>
            </label>
            <div className="mt-5 flex items-center gap-3">
              <button onClick={saveSettings} className="btn-green !px-6">Save changes</button>
              {saved && <span className="anim-fade-in flex items-center gap-1.5 text-xs font-bold text-green-600"><CheckCircle2 className="size-4" /> Saved</span>}
            </div>
          </div>
          <div className="card flex items-start gap-3 p-5">
            <ClipboardList className="mt-0.5 size-5 shrink-0 text-slate-400" />
            <p className="text-xs leading-relaxed text-slate-500">
              Your licence and pharmacist credentials were verified on 12 Jan 2026. MedRelay re-verifies partner stores
              every 6 months — you&apos;ll be notified 30 days before renewal is due.
            </p>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
