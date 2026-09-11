"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { MobileNav } from "./MobileNav";
import { Navbar } from "./Navbar";

const BARE_PREFIXES = ["/partner", "/admin", "/auth", "/dashboard"];

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const bare = BARE_PREFIXES.some((p) => pathname.startsWith(p));

  if (bare) return <>{children}</>;

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}
