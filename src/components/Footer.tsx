import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { LogoMark } from "./ui";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "Home", href: "/" },
      { label: "Medicines", href: "/medicines" },
      { label: "Pharmacies", href: "/pharmacies" },
      { label: "Track Order", href: "/track" },
      { label: "Upload Prescription", href: "/prescription" },
    ],
  },
  {
    title: "For Pharmacies",
    links: [
      { label: "Partner With Us", href: "/auth/register?role=pharmacy" },
      { label: "Pharmacy Login", href: "/auth/login?role=pharmacy" },
      { label: "Manage Inventory", href: "/partner/pharmacy" },
    ],
  },
  {
    title: "For Delivery Partners",
    links: [
      { label: "Become a Delivery Partner", href: "/auth/register?role=rider" },
      { label: "Partner Login", href: "/auth/login?role=rider" },
      { label: "Delivery Dashboard", href: "/partner/rider" },
    ],
  },
  {
    title: "Support & Legal",
    links: [
      { label: "Help Center & FAQs", href: "/support#faq" },
      { label: "Contact Us", href: "/support#contact" },
      { label: "Privacy Policy", href: "/support#privacy" },
      { label: "Terms of Use", href: "/support#terms" },
      { label: "Prescription Policy", href: "/support#rx-policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/60">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5" aria-label="MedRelay home">
            <LogoMark />
            <span className="font-display text-xl font-bold tracking-tight text-slate-900">
              Med<span className="text-blue-600">Relay</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
            Hyperlocal medicine fulfilment — connecting you with verified, licensed pharmacies in your neighbourhood for faster delivery.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 ring-1 ring-green-200 ring-inset">
            <ShieldCheck className="size-4" /> Only verified &amp; licensed pharmacies
          </div>
          <div className="mt-5 space-y-2 text-sm text-slate-500">
            <p className="flex items-center gap-2"><Phone className="size-4 text-slate-400" /> 1800-266-0146 (toll-free)</p>
            <p className="flex items-center gap-2"><Mail className="size-4 text-slate-400" /> care@medrelay.in</p>
            <p className="flex items-center gap-2"><MapPin className="size-4 text-slate-400" /> Kothrud, Pune, Maharashtra, India</p>
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-slate-600 transition-colors hover:text-blue-600">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-500">© 2026 MedRelay · Hyperlocal Medicine Delivery Ecosystem</p>
          <p className="max-w-xl text-[11px] leading-relaxed text-slate-400">
            Medicines are dispensed only by licensed pharmacies. Prescription medicines are supplied after pharmacist verification.
            MedRelay is a technology platform and does not provide medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
