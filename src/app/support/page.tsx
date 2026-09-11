import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronDown,
  FileText,
  Headset,
  Lock,
  Mail,
  MessageSquareText,
  Phone,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Help Center — MedRelay",
  description: "FAQs, contact options and platform policies for MedRelay's hyperlocal medicine delivery ecosystem.",
};

const FAQS = [
  {
    q: "How fast will my medicines arrive?",
    a: "Most orders are delivered in 20–45 minutes because they're fulfilled by a verified pharmacy within 3–4 km of you, not a central warehouse. Your exact ETA is shown before you pay.",
  },
  {
    q: "How do I know the pharmacy is genuine?",
    a: "Every partner store is verified against its drug licence, GST registration and pharmacist credentials before it can receive a single order — and re-verified periodically. Look for the green Verified Pharmacy badge.",
  },
  {
    q: "What happens if my medicine is out of stock?",
    a: "MedRelay automatically searches other verified pharmacies nearby and redirects your order to the closest one with live stock. You'll always see the switch before we make it.",
  },
  {
    q: "How does prescription verification work?",
    a: "Upload a photo or PDF. OCR digitises the medicines for speed, then a licensed pharmacist reviews the prescription against the scan. Nothing is dispensed without a pharmacist's approval — OCR output alone is never an approval.",
  },
  {
    q: "Which medicines need a prescription?",
    a: "Items marked with a blue 'Rx' badge — typically Schedule H/H1 medicines such as antibiotics and chronic-care medicines. You'll be asked to attach a prescription at checkout.",
  },
  {
    q: "What is the delivery OTP?",
    a: "A 4-digit code shown on your tracking screen. Share it with the rider only after you receive your package — it closes the order and prevents mis-deliveries.",
  },
  {
    q: "Can I return medicines?",
    a: "Unopened, unused non-prescription items can be returned within 48 hours through your order history. Prescription medicines cannot be returned once dispensed, as required by law.",
  },
  {
    q: "Is my health data safe?",
    a: "Prescriptions are encrypted in transit and at rest, and are shared only with the pharmacy dispensing your order. We never sell personal health information. See the Privacy Policy below.",
  },
];

export default function SupportPage() {
  return (
    <div className="container-x py-12 sm:py-16">
      {/* hero */}
      <div className="anim-fade-up max-w-2xl">
        <p className="text-xs font-bold tracking-[0.18em] text-blue-600 uppercase">Help center</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">How can we help?</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
          Answers about orders, prescriptions, verification and delivery — plus every policy in plain language.
        </p>
      </div>

      {/* contact */}
      <div id="contact" className="mt-10 grid scroll-mt-28 gap-4 sm:grid-cols-3">
        {[
          { icon: Phone, title: "Call us", value: "1800-266-0146", sub: "Toll-free · 24×7", href: "tel:18002660146" },
          { icon: Mail, title: "Email", value: "care@medrelay.in", sub: "Replies within 2 hours", href: "mailto:care@medrelay.in" },
          { icon: MessageSquareText, title: "Order support", value: "Track & chat", sub: "Live help on active orders", href: "/track" },
        ].map((c) => (
          <a key={c.title} href={c.href} className="card group flex items-center gap-4 p-5 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[var(--shadow-lift)]">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-105">
              <c.icon className="size-5.5" />
            </span>
            <span>
              <span className="block text-xs font-semibold text-slate-400">{c.title}</span>
              <span className="block text-sm font-bold text-slate-900">{c.value}</span>
              <span className="block text-[11px] text-slate-500">{c.sub}</span>
            </span>
          </a>
        ))}
      </div>

      {/* faq */}
      <div id="faq" className="mt-16 max-w-3xl scroll-mt-28">
        <SectionHead eyebrow="FAQs" title="Frequently asked questions" />
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="card group overflow-hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown className="size-4 shrink-0 text-slate-400 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-500">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* policies */}
      <div className="mt-16 grid max-w-4xl gap-4">
        <section id="privacy" className="card scroll-mt-28 p-6 sm:p-8">
          <h3 className="flex items-center gap-2.5 font-display text-lg font-bold text-slate-900">
            <Lock className="size-5 text-blue-600" /> Privacy Policy
          </h3>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-500">
            <p>We collect only what fulfilment needs: your contact details, delivery address, order history and prescriptions you choose to upload.</p>
            <p>Prescriptions are encrypted in transit (TLS) and at rest, and are visible only to you and the licensed pharmacy dispensing your order. Pharmacist access is logged.</p>
            <p>We never sell or rent personal or health data. Aggregate, de-identified trends may be used to improve availability predictions.</p>
            <p>You can request export or deletion of your data any time from your account or by writing to privacy@medrelay.in.</p>
          </div>
        </section>

        <section id="terms" className="card scroll-mt-28 p-6 sm:p-8">
          <h3 className="flex items-center gap-2.5 font-display text-lg font-bold text-slate-900">
            <Scale className="size-5 text-blue-600" /> Terms of Use
          </h3>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-500">
            <p>MedRelay is a technology platform connecting customers with independently owned, licensed pharmacies and delivery partners. Medicines are dispensed solely by the pharmacy fulfilling your order.</p>
            <p>MedRelay does not provide medical advice, diagnosis or treatment. Product information is for discovery and ordering only — always follow your doctor&apos;s guidance.</p>
            <p>Orders containing prescription items are confirmed only after pharmacist verification. We may decline orders that fail verification or violate applicable law.</p>
            <p>Estimated delivery times are good-faith estimates and may vary with weather, traffic and pharmacy load.</p>
          </div>
        </section>

        <section id="rx-policy" className="card scroll-mt-28 p-6 sm:p-8">
          <h3 className="flex items-center gap-2.5 font-display text-lg font-bold text-slate-900">
            <FileText className="size-5 text-blue-600" /> Prescription Policy
          </h3>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-500">
            <p>A valid prescription issued by a registered medical practitioner is required for all medicines marked Rx. It must show the doctor&apos;s name, registration number, date and the patient&apos; name.</p>
            <p>OCR-based digitisation assists pharmacists in reading prescriptions faster — it is never treated as an automatic approval. Every prescription is verified by a licensed pharmacist before dispensing.</p>
            <p>Blurred, cropped, expired or previously-used prescriptions are rejected with a reason, and you may re-upload. Habit-forming medicines follow quantity limits as per the prescription.</p>
            <p>Prescriptions are retained for the legally required period and handled per our Privacy Policy.</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-[11px] font-bold text-green-700 ring-1 ring-green-200 ring-inset">
              <ShieldCheck className="size-3.5" /> Licensed pharmacies only
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-700 ring-1 ring-blue-200 ring-inset">
              <Headset className="size-3.5" /> Pharmacist support 24×7
            </span>
          </div>
        </section>
      </div>

      <p className="mt-10 text-center text-sm text-slate-500">
        Still stuck? <Link href="/track" className="font-bold text-blue-600">Track your order</Link> or write to{" "}
        <a href="mailto:care@medrelay.in" className="font-bold text-blue-600">care@medrelay.in</a>
      </p>
    </div>
  );
}
