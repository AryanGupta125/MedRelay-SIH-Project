"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Bike,
  CheckCircle2,
  ChevronDown,
  KeyRound,
  MapPin,
  Navigation,
  Package,
  Phone,
  Star,
  Store,
  Timer,
  Wallet,
  Zap,
} from "lucide-react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { BarChart } from "@/components/charts";
import { TrackingMap } from "@/components/TrackingMap";
import { DEMO_ORDER, RIDER, getPharmacy } from "@/lib/data";
import { cn, inr } from "@/lib/utils";

const NAV = [
  { key: "deliveries", label: "Deliveries", icon: "deliveries" as const, badge: 1 },
  { key: "earnings", label: "Earnings", icon: "earnings" as const },
  { key: "map", label: "Route Map", icon: "map" as const },
];

type Stage = "assigned" | "accepted" | "picked" | "onway" | "otp" | "delivered";

const STAGES: { key: Stage; label: string; action: string }[] = [
  { key: "assigned", label: "Order Assigned", action: "Accept delivery" },
  { key: "accepted", label: "Accepted", action: "Confirm pickup" },
  { key: "picked", label: "Picked Up", action: "Start delivery" },
  { key: "onway", label: "On the Way", action: "I have arrived" },
  { key: "otp", label: "OTP Verification", action: "Verify & complete" },
  { key: "delivered", label: "Delivered", action: "" },
];

const WEEK_EARNINGS = [620, 840, 760, 905, 1110, 1290, 860];

export default function RiderDashboard() {
  const [tab, setTab] = useState("deliveries");
  const [stage, setStage] = useState<Stage>("assigned");
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [todayEarn, setTodayEarn] = useState(RIDER.earnings.today);
  const [online, setOnline] = useState(true);

  const pharmacy = getPharmacy(DEMO_ORDER.pharmacyId)!;
  const stageIdx = STAGES.findIndex((s) => s.key === stage);

  const advance = () => {
    if (stage === "assigned") setStage("accepted");
    else if (stage === "accepted") setStage("picked");
    else if (stage === "picked") setStage("onway");
    else if (stage === "onway") setStage("otp");
    else if (stage === "otp") {
      if (otpInput === DEMO_ORDER.otp) {
        setStage("delivered");
        setOtpError(false);
        setTodayEarn((e) => e + 46);
      } else {
        setOtpError(true);
        setTimeout(() => setOtpError(false), 1600);
      }
    }
  };

  return (
    <DashboardShell
      title={`Ride on, ${RIDER.name.split(" ")[0]}`}
      subtitle={`Partner since ${RIDER.since} · ID ${RIDER.id}`}
      roleLabel="Delivery Partner"
      accent="blue"
      items={NAV}
      active={tab}
      onSelect={setTab}
      userName={RIDER.name}
    >
      {tab === "deliveries" && (
        <div className="grid items-start gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            {/* status strip */}
            <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
              <div className="flex items-center gap-3">
                <span className={cn("relative grid size-3", online ? "" : "")}>
                  <span className={cn("absolute inline-flex h-3 w-3 rounded-full", online ? "bg-green-500" : "bg-slate-300")} />
                  {online && <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-green-400 opacity-75" />}
                </span>
                <p className="text-sm font-bold text-slate-900">{online ? "You are online" : "You are offline"}</p>
                <p className="text-xs text-slate-500">Zone: HSR Layout · {RIDER.earnings.onlineHrs} today</p>
              </div>
              <button
                onClick={() => setOnline((v) => !v)}
                className={cn("rounded-xl px-4 py-2 text-xs font-bold transition-colors", online ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-600 text-white")}
              >
                {online ? "Go offline" : "Go online"}
              </button>
            </div>

            {/* active job */}
            {stage !== "delivered" ? (
              <div className="card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-6 py-4">
                  <div>
                    <h2 className="font-display text-base font-bold text-slate-900">Active delivery · #{DEMO_ORDER.id}</h2>
                    <p className="text-xs text-slate-500">3 items · prepaid {inr(227)} · payout ₹46</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700 ring-1 ring-blue-200 ring-inset">{STAGES[stageIdx].label}</span>
                </div>

                <div className="grid gap-0 sm:grid-cols-2 sm:divide-x sm:divide-slate-100">
                  <div className="px-6 py-5">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase"><Store className="size-3.5 text-green-600" /> Pickup</p>
                    <p className="mt-2 text-sm font-bold text-slate-900">{pharmacy.name}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{pharmacy.address}</p>
                    {stageIdx <= 1 && (
                      <button className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-200">
                        <Navigation className="size-3.5" /> Navigate to store
                      </button>
                    )}
                  </div>
                  <div className="border-t border-slate-100 px-6 py-5 sm:border-t-0">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase"><MapPin className="size-3.5 text-blue-600" /> Drop</p>
                    <p className="mt-2 text-sm font-bold text-slate-900">{DEMO_ORDER.addressLabel}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{DEMO_ORDER.address}</p>
                    {stageIdx >= 2 && (
                      <button className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-200">
                        <Navigation className="size-3.5" /> Navigate to customer
                      </button>
                    )}
                  </div>
                </div>

                {/* workflow progress */}
                <div className="border-t border-slate-100 px-6 py-5">
                  <div className="mb-5 flex items-center gap-1">
                    {STAGES.map((s, i) => (
                      <div key={s.key} className="flex flex-1 items-center gap-1 last:flex-none">
                        <span
                          className={cn(
                            "grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-bold transition-all",
                            i < stageIdx ? "bg-green-600 text-white" : i === stageIdx ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400",
                          )}
                        >
                          {i < stageIdx ? <CheckCircle2 className="size-3.5" /> : i + 1}
                        </span>
                        {i < STAGES.length - 1 && <span className={cn("h-1 flex-1 rounded-full", i < stageIdx ? "bg-green-500" : "bg-slate-100")} />}
                      </div>
                    ))}
                  </div>

                  {stage === "otp" && (
                    <div className="anim-fade-in mb-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                      <p className="flex items-center gap-2 text-xs font-bold text-blue-800"><KeyRound className="size-4" /> Ask the customer for their 4-digit OTP</p>
                      <div className="mt-3 flex items-center gap-2.5">
                        <input
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          inputMode="numeric"
                          placeholder="••••"
                          className={cn(
                            "input-field w-32 text-center !text-lg !font-bold tracking-[0.4em]",
                            otpError && "!border-red-400 !ring-4 !ring-red-100",
                          )}
                          aria-label="Customer OTP"
                        />
                        {otpError && <span className="anim-fade-in text-xs font-bold text-red-600">Incorrect OTP — check with customer</span>}
                      </div>
                    </div>
                  )}

                  {stage === "assigned" ? (
                    <div className="flex gap-3">
                      <button className="btn-secondary flex-1 !py-2.5 text-xs opacity-60">Decline</button>
                      <button onClick={advance} className="btn-primary flex-1 !py-2.5 text-xs">{STAGES[stageIdx].action}</button>
                    </div>
                  ) : (
                    <button onClick={advance} className={cn("w-full !py-3 text-sm", stage === "otp" ? "btn-green" : "btn-primary")}>
                      {STAGES[stageIdx].action}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="card anim-scale-in p-8 text-center">
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-green-600 text-white shadow-[var(--shadow-cta-green)]">
                  <CheckCircle2 className="size-8" />
                </span>
                <h2 className="mt-4 font-display text-xl font-bold text-slate-900">Delivery completed</h2>
                <p className="mt-1.5 text-sm text-slate-500">OTP verified · ₹46 added to today&apos;s earnings.</p>
                <button onClick={() => { setStage("assigned"); setOtpInput(""); }} className="btn-primary mt-5 !px-5 !py-2.5 text-xs">
                  <Bike className="size-4" /> Find next delivery
                </button>
              </div>
            )}

            {/* history */}
            <div className="card overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="font-display text-base font-bold text-slate-900">Completed today</h3>
              </div>
              <ul className="divide-y divide-slate-100">
                {RIDER.history.map((h) => (
                  <li key={h.id} className="flex flex-wrap items-center gap-3 px-6 py-3.5">
                    <span className="grid size-9 place-items-center rounded-xl bg-green-50 text-green-600"><Package className="size-4.5" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900">#{h.id}</p>
                      <p className="text-[11px] text-slate-500">{h.area} · {h.time} · {h.when}</p>
                    </div>
                    <span className="text-sm font-bold text-green-700 tabular-nums">+₹{h.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* right rail */}
          <div className="space-y-5">
            <TrackingMap compact pharmacyName={pharmacy.name} eta={DEMO_ORDER.eta} riderName="You are here" delivered={stage === "delivered"} />
            <div className="grid grid-cols-2 gap-4">
              <StatCard icon={Wallet} label="Today's earnings" value={inr(todayEarn)} sub={`${RIDER.earnings.deliveriesToday} deliveries`} tone="green" />
              <StatCard icon={Timer} label="Online" value={RIDER.earnings.onlineHrs} sub={`${RIDER.earnings.acceptance}% acceptance`} tone="blue" />
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-amber-50 text-amber-500"><Star className="size-5 fill-amber-400" /></span>
                <div>
                  <p className="font-display text-lg font-bold text-slate-900">{RIDER.rating} / 5</p>
                  <p className="text-[11px] text-slate-500">1,204 delivery ratings</p>
                </div>
              </div>
              <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-600"><BadgeCheck className="size-4 text-green-600" /> On-time delivery</span>
                  <span className="font-bold text-slate-800">96%</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-600"><Zap className="size-4 text-blue-600" /> Avg. pickup time</span>
                  <span className="font-bold text-slate-800">4.2 min</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-600"><Phone className="size-4 text-slate-400" /> Support line</span>
                  <span className="font-bold text-blue-700">1800-266-0146</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "earnings" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={Wallet} label="Today" value={inr(todayEarn)} sub={`${RIDER.earnings.deliveriesToday} deliveries`} tone="green" />
            <StatCard icon={Wallet} label="This week" value={inr(RIDER.earnings.week)} sub="37 deliveries" tone="blue" />
            <StatCard icon={Zap} label="Incentives unlocked" value="₹300" sub="12 more deliveries → ₹500" tone="amber" />
            <StatCard icon={Timer} label="Avg per delivery" value="₹44" sub="zone average ₹42" tone="blue" />
          </div>
          <div className="card p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-slate-900">Earnings this week</h3>
              <span className="text-xs font-semibold text-slate-500"><ChevronDown className="mr-1 inline size-3.5" />This week</span>
            </div>
            <BarChart data={WEEK_EARNINGS} labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} />
          </div>
          <div className="card p-6">
            <h3 className="mb-4 font-display text-base font-bold text-slate-900">Payout schedule</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { l: "Available balance", v: inr(RIDER.earnings.week - 1400), s: "Withdraws tonight, 11:59 PM" },
                { l: "Last payout", v: "₹4,830", s: "20 Jan · via UPI" },
                { l: "Next milestone", v: "₹500 bonus", s: "25 deliveries this week" },
              ].map((x) => (
                <div key={x.l} className="rounded-xl bg-slate-50 px-4 py-3.5">
                  <p className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">{x.l}</p>
                  <p className="mt-1 font-display text-lg font-bold text-slate-900">{x.v}</p>
                  <p className="text-[11px] text-slate-500">{x.s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "map" && (
        <div className="space-y-4">
          <TrackingMap pharmacyName={pharmacy.name} eta={DEMO_ORDER.eta} riderName="You are here" delivered={stage === "delivered"} />
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { l: "Distance to drop", v: "3.1 km" },
              { l: "Estimated ride time", v: "14 min" },
              { l: "Traffic on route", v: "Light" },
            ].map((x) => (
              <div key={x.l} className="card px-4 py-3.5">
                <p className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">{x.l}</p>
                <p className="mt-1 font-display text-lg font-bold text-slate-900">{x.v}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] text-slate-400">Routing powered by Google Maps Platform in production</p>
        </div>
      )}
    </DashboardShell>
  );
}
