"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------- Bar chart -------------------------------- */

export function BarChart({
  data,
  labels,
  height = 140,
  highlightLast = true,
}: {
  data: number[];
  labels?: string[];
  height?: number;
  highlightLast?: boolean;
}) {
  const max = Math.max(...data, 1);
  return (
    <div>
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((v, i) => (
          <div key={i} className="group relative flex-1" style={{ height: `${Math.max(6, (v / max) * 100)}%` }}>
            <div
              className={cn(
                "h-full w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80",
                highlightLast && i === data.length - 1 ? "bg-green-500" : "bg-blue-600/85",
              )}
            />
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-semibold whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
              {v.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>
      {labels && (
        <div className="mt-2 flex gap-2">
          {labels.map((l, i) => (
            <span key={i} className="flex-1 truncate text-center text-[10px] font-medium text-slate-400">
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------- Area chart -------------------------------- */

export function AreaChart({ data, height = 160 }: { data: number[]; height?: number }) {
  const id = useId();
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const w = 100;
  const h = 100;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 8) - 4;
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <div style={{ height }}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${id}-fill)`} />
        <path d={line} fill="none" stroke="#2563EB" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {pts.map(([x, y], i) =>
          i === pts.length - 1 ? (
            <g key={i}>
              <circle cx={x} cy={y} r="3.4" fill="#16A34A" stroke="#fff" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
            </g>
          ) : null,
        )}
      </svg>
      <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400">
        <span>14 days ago</span>
        <span>Today · {data[data.length - 1].toLocaleString("en-IN")} orders</span>
      </div>
    </div>
  );
}

/* --------------------------------- Donut ----------------------------------- */

export function Donut({
  segments,
  size = 168,
  centerLabel,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  centerLabel: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = 42;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg width={size} height={size} viewBox="0 0 110 110" className="shrink-0 -rotate-0">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#F1F5F9" strokeWidth="13" />
        {segments.map((s) => {
          const frac = s.value / total;
          const dash = frac * circ;
          const el = (
            <circle
              key={s.label}
              cx="55"
              cy="55"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="13"
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform="rotate(-90 55 55)"
            />
          );
          offset += dash;
          return el;
        })}
        <text x="55" y="52" textAnchor="middle" className="fill-slate-900" fontSize="15" fontWeight="800">
          {total}
        </text>
        <text x="55" y="66" textAnchor="middle" className="fill-slate-400" fontSize="7.5" fontWeight="600">
          {centerLabel}
        </text>
      </svg>
      <ul className="min-w-36 space-y-2">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-xs">
            <span className="size-2.5 shrink-0 rounded-[4px]" style={{ background: s.color }} />
            <span className="flex-1 font-medium text-slate-600">{s.label}</span>
            <span className="font-bold text-slate-800 tabular-nums">{s.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------ Progress row ------------------------------- */

export function ProgressRow({
  label,
  value,
  pct,
  tone = "blue",
}: {
  label: string;
  value: string;
  pct: number;
  tone?: "blue" | "green";
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-bold text-slate-800 tabular-nums">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn("h-full rounded-full transition-[width] duration-700", tone === "green" ? "bg-green-500" : "bg-blue-600")}
          style={{ width: `${Math.min(100, Math.max(2, pct))}%` }}
        />
      </div>
    </div>
  );
}
