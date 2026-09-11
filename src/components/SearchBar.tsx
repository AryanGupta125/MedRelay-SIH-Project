"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { SUGGESTED_SEARCHES } from "@/lib/data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SearchBar({
  initialQuery = "",
  suggestions = false,
  compact = false,
}: {
  initialQuery?: string;
  suggestions?: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const location = useApp((s) => s.location);

  const go = (term: string) => {
    const t = term.trim();
    router.push(t ? `/medicines?q=${encodeURIComponent(t)}` : "/medicines");
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(q);
        }}
        className={cn(
          "flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[var(--shadow-lift)] transition-all duration-300",
          "focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100",
          compact ? "max-w-xl" : "max-w-2xl",
        )}
      >
        <Search className={cn("ml-2.5 shrink-0 text-slate-400", compact ? "size-4" : "size-5")} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search medicines, health products..."
          className={cn("min-w-0 flex-1 bg-transparent font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none", compact ? "py-2 text-sm" : "py-2.5 text-base")}
          aria-label="Search medicines"
        />
        <span className="hidden items-center gap-1.5 border-l border-slate-200 px-3 text-xs font-semibold whitespace-nowrap text-slate-500 sm:flex">
          <MapPin className="size-3.5 text-blue-600" /> {location.area}
        </span>
        <button type="submit" className={cn("btn-primary shrink-0 !rounded-xl", compact ? "!px-4 !py-2 text-xs" : "")}>
          Search
        </button>
      </form>

      {suggestions && (
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Popular:</span>
          {SUGGESTED_SEARCHES.map((s) => (
            <button
              key={s}
              onClick={() => go(s)}
              className="chip transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
