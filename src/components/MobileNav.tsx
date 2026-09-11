"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FileUp, Home, Pill, Radar, ShoppingCart } from "lucide-react";
import { cartCount, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Medicines", href: "/medicines", icon: Pill },
  { label: "Upload Rx", href: "/prescription", icon: FileUp, center: true },
  { label: "Track", href: "/track", icon: Radar },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const cart = useApp((s) => s.cart);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = mounted ? cartCount(cart) : 0;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),0.4rem)] backdrop-blur-xl md:hidden" aria-label="Mobile">
      <div className="mx-auto flex max-w-md items-end justify-between">
        {ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          if ("center" in item && item.center) {
            return (
              <Link key={item.label} href={item.href} className="group relative -mt-6 flex flex-col items-center" aria-label={item.label}>
                <span className="grid size-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-[var(--shadow-cta)] transition-transform group-active:scale-95">
                  <item.icon className="size-5" />
                </span>
                <span className="mt-1 text-[10px] font-semibold text-slate-500">{item.label}</span>
              </Link>
            );
          }
          return (
            <Link key={item.label} href={item.href} className="relative flex w-16 flex-col items-center gap-0.5 py-1.5" aria-label={item.label}>
              <span className={cn("relative grid size-9 place-items-center rounded-xl transition-colors", active ? "bg-blue-50 text-blue-600" : "text-slate-400")}>
                <item.icon className="size-5" />
                {item.label === "Cart" && count > 0 && (
                  <span className="absolute -top-1 -right-1 grid size-4.5 place-items-center rounded-full bg-blue-600 text-[9px] font-bold text-white ring-2 ring-white">
                    {count}
                  </span>
                )}
              </span>
              <span className={cn("text-[10px] font-semibold", active ? "text-blue-600" : "text-slate-500")}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
