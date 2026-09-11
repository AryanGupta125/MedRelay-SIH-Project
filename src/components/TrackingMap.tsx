"use client";

import { useId } from "react";
import { Bike, Clock, Home, Store } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Stylised city map with an animated rider following the delivery route.
 * Architecture-ready for Google Maps JS SDK; this is the offline prototype.
 */
export function TrackingMap({
  pharmacyName = "NovaMed Pharmacy",
  eta = "18–25 min",
  riderName = "Arjun Kumar",
  compact = false,
  delivered = false,
}: {
  pharmacyName?: string;
  eta?: string;
  riderName?: string;
  compact?: boolean;
  delivered?: boolean;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const routeId = `route-${id}`;

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-slate-200 bg-[#F4F7FB]", compact ? "aspect-[16/10]" : "aspect-[16/11] sm:aspect-[16/9]")}>
      <svg viewBox="0 0 480 320" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id={`${id}-blocks`} width="80" height="70" patternUnits="userSpaceOnUse">
            <rect x="6" y="6" width="56" height="44" rx="6" fill="#E9EEF5" />
          </pattern>
        </defs>

        <rect width="480" height="320" fill="#F4F7FB" />
        <rect width="480" height="320" fill={`url(#${id}-blocks)`} />

        {/* park */}
        <rect x="322" y="176" width="128" height="92" rx="12" fill="#DCFCE7" />
        <text x="386" y="226" textAnchor="middle" fontSize="9" fill="#16A34A" fontWeight="600">Agara Lake</text>

        {/* roads */}
        <g stroke="#E2E8F0" strokeWidth="16" strokeLinecap="round">
          <line x1="90" y1="0" x2="90" y2="320" />
          <line x1="190" y1="0" x2="190" y2="320" />
          <line x1="300" y1="0" x2="300" y2="320" />
          <line x1="408" y1="0" x2="408" y2="320" />
          <line x1="0" y1="70" x2="480" y2="70" />
          <line x1="0" y1="150" x2="480" y2="150" />
          <line x1="0" y1="262" x2="480" y2="262" />
        </g>
        <g stroke="#FFFFFF" strokeWidth="1.6" strokeDasharray="8 10">
          <line x1="90" y1="0" x2="90" y2="320" />
          <line x1="190" y1="0" x2="190" y2="320" />
          <line x1="300" y1="0" x2="300" y2="320" />
          <line x1="0" y1="150" x2="480" y2="150" />
        </g>

        {/* street labels */}
        <text x="96" y="24" fontSize="8.5" fill="#94A3B8" fontWeight="600">27th Main Rd</text>
        <text x="316" y="144" fontSize="8.5" fill="#94A3B8" fontWeight="600">Outer Ring Rd</text>
        <text x="14" y="256" fontSize="8.5" fill="#94A3B8" fontWeight="600">5th Cross</text>

        {/* the delivery route */}
        <path
          id={routeId}
          d="M 72 252 C 90 240 90 200 90 168 L 90 150 C 90 128 120 118 150 118 L 330 118 C 368 118 380 92 404 76"
          fill="none"
          stroke="#2563EB"
          strokeWidth="4"
          strokeLinecap="round"
          className="route-dash"
          opacity="0.9"
        />

        {/* pharmacy marker */}
        <g transform="translate(72 252)">
          <circle r="14" fill="#16A34A" opacity="0.14" />
          <circle r="9" fill="#16A34A" stroke="#fff" strokeWidth="2.5" />
          <path d="M -3 -0.5 h 6 M 0 -3.5 v 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* home marker */}
        <g transform="translate(404 76)">
          <circle r="14" fill="#2563EB" opacity="0.14" />
          <circle r="9" fill="#2563EB" stroke="#fff" strokeWidth="2.5" />
          <path d="M -4 1.2 v -3.4 l 4 -3.2 4 3.2 v 3.4 z" fill="#fff" />
        </g>

        {/* animated rider */}
        {!delivered && (
          <g>
            <circle r="13" fill="#2563EB" opacity="0.18">
              <animateMotion dur="16s" repeatCount="indefinite" rotate="0">
                <mpath href={`#${routeId}`} />
              </animateMotion>
              <animate attributeName="r" values="10;16;10" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <circle r="7.5" fill="#0F172A" stroke="#fff" strokeWidth="2.5">
              <animateMotion dur="16s" repeatCount="indefinite" rotate="0">
                <mpath href={`#${routeId}`} />
              </animateMotion>
            </circle>
          </g>
        )}
      </svg>

      {/* overlays */}
      <div className="absolute top-3 left-3 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-md backdrop-blur">
        <span className="grid size-7 place-items-center rounded-lg bg-green-600 text-white">
          <Store className="size-4" />
        </span>
        <span>
          <span className="block text-[10px] font-semibold tracking-wide text-slate-400 uppercase">Pickup</span>
          <span className="block text-xs font-bold text-slate-800">{pharmacyName}</span>
        </span>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-md backdrop-blur">
        <span className={cn("grid size-7 place-items-center rounded-lg text-white", delivered ? "bg-green-600" : "bg-blue-600")}>
          <Clock className="size-4" />
        </span>
        <span>
          <span className="block text-[10px] font-semibold tracking-wide text-slate-400 uppercase">{delivered ? "Delivered" : "Arriving in"}</span>
          <span className="block text-xs font-bold text-slate-800">{delivered ? "Order complete" : eta}</span>
        </span>
      </div>

      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl bg-slate-900/90 px-3 py-2 text-white shadow-md backdrop-blur">
        <span className="grid size-7 place-items-center rounded-lg bg-white/10">
          <Bike className="size-4" />
        </span>
        <span>
          <span className="block text-[10px] font-medium text-slate-300 uppercase">{delivered ? "Delivered by" : "Your rider"}</span>
          <span className="block text-xs font-bold">{riderName}</span>
        </span>
      </div>

      <div className="absolute right-3 bottom-3 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-md backdrop-blur">
        <span className="grid size-7 place-items-center rounded-lg bg-blue-50 text-blue-600">
          <Home className="size-4" />
        </span>
        <span className="text-xs font-bold text-slate-800">Home</span>
      </div>
    </div>
  );
}
