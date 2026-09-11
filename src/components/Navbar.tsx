"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Crosshair,
  Loader2,
  LogOut,
  MapPin,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { AREAS } from "@/lib/data";
import { cartCount, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/useMounted";
import { LoginModal } from "./LoginModal";
import { Logo } from "./ui";

const LINKS = [
  { label: "Medicines", href: "/medicines" },
  { label: "Categories", href: "/#categories" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pharmacies", href: "/pharmacies" },
  { label: "Track Order", href: "/track" },
];

function LocationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useApp((s) => s.location);
  const setLocation = useApp((s) => s.setLocation);
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState<"idle" | "locating" | "done">("idle");
  const [detectError, setDetectError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setPhase("idle");
      setQuery("");
      setDetectError(null);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [open]);

  if (!open) return null;

  const areas = AREAS.filter((a) => a.toLowerCase().includes(query.toLowerCase()));

  const detect = () => {
    setPhase("locating");
    setDetectError(null);

    if (typeof window === "undefined" || !navigator.geolocation) {
      setDetectError("Geolocation is not supported by your browser.");
      setPhase("idle");
      return;
    }

    const handlePositionSuccess = async (pos: GeolocationPosition) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      try {
        const res = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
        if (res.ok) {
          const data = await res.json();
          setLocation({
            area: data.area || `Location (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`,
            city: data.city || "Live Location",
            state: data.state || "India",
            isServiceable: true,
            lat,
            lng,
          });
          setPhase("done");
          timer.current = setTimeout(() => {
            onClose();
          }, 800);
          return;
        }
      } catch (err) {
        console.error("Geocode fetch error:", err);
      }

      setLocation({
        area: `Live GPS (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`,
        city: "Current Device Location",
        state: "Live Location",
        isServiceable: true,
        lat,
        lng,
      });
      setPhase("done");
      timer.current = setTimeout(() => {
        onClose();
      }, 800);
    };

    const handlePositionError = (err: GeolocationPositionError) => {
      if (err.code === err.TIMEOUT) {
        navigator.geolocation.getCurrentPosition(
          handlePositionSuccess,
          (err2) => {
            setDetectError("Location request timed out. Please check location permissions.");
            setPhase("idle");
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 0 }
        );
        return;
      }
      let msg = "Unable to retrieve your location. Please check browser permissions.";
      if (err.code === err.PERMISSION_DENIED) {
        msg = "Location permission denied. Please allow location access in your browser settings.";
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        msg = "Location information is unavailable on your device.";
      }
      setDetectError(msg);
      setPhase("idle");
    };

    navigator.geolocation.getCurrentPosition(
      handlePositionSuccess,
      handlePositionError,
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const pick = (area: string) => {
    const cityName = area.includes("Mumbai") ? "Mumbai" : area.includes("Pune") ? "Pune" : area.includes("Thane") ? "Thane" : area.includes("Nashik") ? "Nashik" : area.includes("Nagpur") ? "Nagpur" : "Maharashtra";
    setLocation({
      area,
      city: `${cityName}, Maharashtra`,
      state: "Maharashtra",
      isServiceable: true,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={location.isSet ? onClose : undefined}
    >
      <div
        className="anim-scale-in w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Choose delivery location"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">Choose delivery location</h3>
            <p className="mt-0.5 text-sm text-slate-500">
              {location.isSet
                ? "Fast delivery available to your location."
                : "Please set your delivery location to continue."}
            </p>
          </div>
          {location.isSet && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Live Location Button */}
        <button
          onClick={detect}
          disabled={phase === "locating"}
          className={cn(
            "flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all cursor-pointer",
            phase === "done"
              ? "border-green-300 bg-green-50"
              : "border-blue-200 bg-blue-50 hover:border-blue-400",
          )}
        >
          <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", phase === "done" ? "bg-green-600 text-white" : "bg-blue-600 text-white")}>
            {phase === "locating" ? <Loader2 className="size-5 animate-spin" /> : phase === "done" ? <CheckCircle2 className="size-5" /> : <Crosshair className="size-5" />}
          </span>
          <span>
            <span className={cn("block text-sm font-semibold", phase === "done" ? "text-green-700" : "text-blue-700")}>
              {phase === "locating" ? "Detecting your current location..." : phase === "done" ? "Location detected" : "Detect my current location"}
            </span>
            <span className="block text-xs text-slate-500">
              {phase === "done" ? `${location.area}, ${location.city}` : "Uses live device GPS for precise ETAs"}
            </span>
          </span>
        </button>

        {/* Error / Notice Message */}
        {detectError && (
          <div className="mt-3 flex items-start gap-2.5 rounded-2xl bg-amber-50 p-3.5 text-xs text-amber-900 border border-amber-200">
            <AlertTriangle className="size-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900">Notice</p>
              <p className="mt-0.5 leading-relaxed text-amber-800">{detectError}</p>
            </div>
          </div>
        )}

        <div className="my-3.5 flex items-center gap-3 text-xs font-semibold tracking-wide text-slate-400 uppercase">
          <span className="h-px flex-1 bg-slate-200" /> or search an area <span className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="relative mb-3">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search area (e.g. Kothrud, Viman Nagar, Baner)..."
            className="input-field !pl-10"
          />
        </div>

        <div className="max-h-48 space-y-1 overflow-y-auto">
          {areas.length === 0 && <p className="px-2 py-4 text-center text-sm text-slate-400">No matching areas found</p>}
          {areas.map((a) => (
            <button
              key={a}
              onClick={() => pick(a)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
            >
              <MapPin className="size-4 text-blue-600" />
              {a}
              {location.area === a && <span className="ml-auto text-[11px] font-semibold text-green-600">Current</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const location = useApp((s) => s.location);
  const cart = useApp((s) => s.cart);
  const isLoggedIn = useApp((s) => s.isLoggedIn);
  const user = useApp((s) => s.user);
  const logout = useApp((s) => s.logout);
  const mounted = useMounted();
  const count = mounted ? cartCount(cart) : 0;

  // Automatically prompt new users to set/detect location on first visit
  useEffect(() => {
    if (mounted && !location.isSet) {
      const timer = setTimeout(() => setLocOpen(true), 400);
      return () => clearTimeout(timer);
    }
  }, [mounted, location.isSet]);

  return (
    <header className="sticky top-0 z-50">
      {/* Top Banner when location is OUTSIDE Maharashtra */}
      {mounted && location.isSet && !location.isServiceable && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-center text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2">
          <AlertTriangle className="size-4 shrink-0 text-slate-950" />
          <span>
            <strong>Service currently not available in your location ({location.area || location.city || "Outside MH"}).</strong> MedRelay operates only in <strong>Maharashtra, India</strong>.
          </span>
          <button
            onClick={() => setLocOpen(true)}
            className="ml-2 rounded-lg bg-slate-950 px-2.5 py-1 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Change Location
          </button>
        </div>
      )}

      <div className="h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-green-500" />
      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center gap-3">
          <Logo />

          <nav className="ml-6 hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {LINKS.map((l) => {
              const active = !l.href.includes("#") && (l.href === "/" ? pathname === "/" : pathname.startsWith(l.href));
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setLocOpen(true)}
              className={cn(
                "hidden max-w-52 items-center gap-1.5 rounded-xl border px-3 py-2 text-left transition-all sm:flex cursor-pointer",
                mounted && !location.isSet
                  ? "border-blue-400 bg-blue-50/90 ring-2 ring-blue-400/40 animate-pulse hover:bg-blue-100"
                  : mounted && !location.isServiceable
                  ? "border-amber-400 bg-amber-50 hover:bg-amber-100"
                  : "border-slate-200 bg-white hover:border-blue-300",
              )}
              aria-label="Change delivery location"
            >
              <MapPin className={cn("size-4 shrink-0", mounted && !location.isSet ? "text-blue-600" : mounted && !location.isServiceable ? "text-amber-600" : "text-blue-600")} />
              <span className="min-w-0">
                <span className="block text-[10px] leading-none font-semibold tracking-wide text-slate-400 uppercase">
                  {mounted && !location.isSet ? "Set Location" : "Delivering to"}
                </span>
                <span className={cn("mt-0.5 block truncate text-xs leading-tight font-semibold", mounted && !location.isSet ? "text-blue-700" : mounted && !location.isServiceable ? "text-amber-900" : "text-slate-800")}>
                  {mounted ? (location.isSet ? location.area : "Select Location") : "Select Location"}
                </span>
              </span>
              <ChevronDown className="size-3.5 shrink-0 text-slate-400" />
            </button>

            {mounted && isLoggedIn ? (
              <div className="hidden items-center gap-2 sm:flex">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-blue-200">
                  <User className="size-3.5 text-blue-600" />
                  {user?.name || "Rahul M."}
                </span>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:inline-flex">
                <User className="size-4" /> Login
              </Link>
            )}

            <Link
              href="/cart"
              className="relative grid size-10 place-items-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100"
              aria-label={`Cart, ${count} items`}
            >
              <ShoppingCart className="size-5" />
              {count > 0 && (
                <span className="anim-scale-in absolute -top-0.5 -right-0.5 grid size-5 place-items-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {count}
                </span>
              )}
            </Link>

            <button
              className="grid size-10 place-items-center rounded-xl text-slate-700 hover:bg-slate-100 lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="anim-fade-in border-t border-slate-100 bg-white lg:hidden">
            <div className="container-x space-y-1 py-4">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setLocOpen(true);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold cursor-pointer",
                  mounted && !location.isSet
                    ? "bg-blue-100 text-blue-800 ring-2 ring-blue-300"
                    : mounted && !location.isServiceable
                    ? "bg-amber-100 text-amber-900"
                    : "bg-blue-50 text-blue-700",
                )}
              >
                <MapPin className="size-4" /> {mounted ? (location.isSet ? `Delivering to ${location.area}` : "Select Delivery Location") : "Select Delivery Location"} <ChevronDown className="ml-auto size-4" />
              </button>
              {LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {l.label}
                </Link>
              ))}

              {mounted && isLoggedIn ? (
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-xs font-bold text-slate-700">Signed in as {user?.name}</span>
                  <button onClick={logout} className="text-xs font-bold text-red-600 hover:underline">
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
      <LocationModal open={locOpen} onClose={() => setLocOpen(false)} />
      <LoginModal />
    </header>
  );
}
