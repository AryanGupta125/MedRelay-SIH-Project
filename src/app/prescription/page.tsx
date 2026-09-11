"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  CheckCircle2,
  ChevronRight,
  CloudUpload,
  FileImage,
  FileText,
  FileUp,
  Info,
  Loader2,
  Lock,
  ScanText,
  Send,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

type Stage = "idle" | "uploading" | "scanning" | "extracted" | "sent";

const EXTRACTED = [
  { name: "Azithromycin", strength: "250 mg", dose: "1-0-0 · after food × 5 days", confidence: 97 },
  { name: "Cetirizine", strength: "10 mg", dose: "0-0-1 · at bedtime × 5 days", confidence: 99 },
  { name: "Paracetamol", strength: "650 mg", dose: "SOS · if fever > 100°F", confidence: 95 },
];

const STEPS: { key: Stage; label: string }[] = [
  { key: "uploading", label: "Uploading securely" },
  { key: "scanning", label: "Reading text (OCR)" },
  { key: "extracted", label: "Extracting medicines" },
];

export default function PrescriptionPage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const prescriptions = useApp((s) => s.prescriptions);
  const addPrescription = useApp((s) => s.addPrescription);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const startProcessing = useCallback((name: string, previewUrl: string | null) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setFileName(name);
    setPreview(previewUrl);
    setStage("uploading");
    setProgress(0);

    const iv = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(iv);
          return 100;
        }
        return p + 8;
      });
    }, 90);

    timers.current.push(
      setTimeout(() => setStage("scanning"), 1400),
      setTimeout(() => setStage("extracted"), 3400),
    );
  }, []);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      const url = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
      startProcessing(file.name, url);
    },
    [startProcessing],
  );

  const useSample = () => startProcessing("prescription-sample.jpg", "/rx-sample");

  const sendForVerification = () => {
    setStage("sent");
    addPrescription({
      id: "RX-" + Math.floor(3400 + Math.random() * 200),
      fileName: fileName ?? "prescription.jpg",
      uploadedAt: "Just now",
      status: "pending_verification",
      meds: EXTRACTED.map(({ name, strength, dose }) => ({ name, strength, dose })),
    });
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStage("idle");
    setFileName(null);
    setPreview(null);
    setProgress(0);
  };

  const stepIndex = (s: Stage) => (s === "uploading" ? 0 : s === "scanning" ? 1 : 2);

  return (
    <div className="container-x py-10 sm:py-14">
      <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr]">
        {/* ------------------------------- Main column ------------------------------ */}
        <div>
          <div className="anim-fade-up">
            <p className="text-xs font-bold tracking-[0.18em] text-blue-600 uppercase">Prescription upload</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Upload your prescription
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
              We&apos;ll digitise it with OCR, show you what we found, and a licensed pharmacist will verify it before
              any medicine is dispensed.
            </p>
          </div>

          {/* ------------------------------- IDLE ------------------------------- */}
          {stage === "idle" && (
            <div className="anim-fade-up mt-8 [animation-delay:100ms]">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFile(e.dataTransfer.files?.[0]);
                }}
                className={cn(
                  "flex flex-col items-center rounded-3xl border-2 border-dashed px-6 py-14 text-center transition-all duration-300",
                  dragOver ? "border-blue-500 bg-blue-50/70 scale-[1.01]" : "border-slate-300 bg-slate-50/60 hover:border-blue-400 hover:bg-blue-50/40",
                )}
              >
                <span className="grid size-16 place-items-center rounded-2xl bg-blue-600 text-white shadow-[var(--shadow-cta)]">
                  <CloudUpload className="size-8" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-slate-900">Drag &amp; drop your prescription</h3>
                <p className="mt-1.5 text-sm text-slate-500">JPG, PNG or PDF · up to 10 MB · stored securely</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button onClick={() => inputRef.current?.click()} className="btn-primary">
                    <FileUp className="size-4" /> Choose file
                  </button>
                  <button onClick={() => cameraRef.current?.click()} className="btn-secondary">
                    <Camera className="size-4 text-blue-600" /> Use camera
                  </button>
                  <button onClick={useSample} className="btn-secondary">
                    <ScanText className="size-4 text-green-600" /> Try a sample
                  </button>
                </div>
                <input ref={inputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
              </div>

              <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-slate-50 px-4 py-3.5 text-xs text-slate-500">
                <Lock className="mt-0.5 size-4 shrink-0 text-slate-400" />
                Your prescription is encrypted in transit and shared only with the pharmacy that dispenses your order.
              </div>
            </div>
          )}

          {/* --------------------------- PROCESSING --------------------------- */}
          {(stage === "uploading" || stage === "scanning") && (
            <div className="card anim-fade-up mt-8 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                    <FileImage className="size-5" />
                  </span>
                  <div>
                    <p className="max-w-56 truncate text-sm font-bold text-slate-900 sm:max-w-xs">{fileName}</p>
                    <p className="text-xs text-slate-400">Prescription document</p>
                  </div>
                </div>
                <button onClick={reset} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" aria-label="Cancel">
                  <X className="size-4" />
                </button>
              </div>

              {/* preview + scan effect */}
              <div className="relative mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Uploaded prescription preview" className="max-h-64 w-full object-cover opacity-90" />
                ) : (
                  <div className="mx-auto max-w-sm px-8 py-8">
                    <div className="rounded-xl bg-white p-5 shadow-sm">
                      <div className="mb-3 h-3 w-1/3 rounded bg-slate-200" />
                      <div className="space-y-2">
                        {[100, 88, 92, 70].map((w, i) => (
                          <div key={i} className="h-2.5 rounded bg-slate-100" style={{ width: `${w}%` }} />
                        ))}
                      </div>
                      <div className="mt-4 h-10 w-10 rounded-full border-2 border-blue-200" />
                    </div>
                  </div>
                )}
                {stage === "scanning" && <div className="scanline" aria-hidden />}
                {stage === "scanning" && (
                  <div className="absolute top-3 left-3 rounded-lg bg-slate-900/85 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur">
                    <span className="flex items-center gap-1.5"><ScanText className="size-3.5" /> Digitising prescription…</span>
                  </div>
                )}
              </div>

              {/* steps */}
              <div className="mt-6 space-y-3.5">
                {STEPS.map((s, i) => {
                  const active = stepIndex(stage) === i;
                  const done = stepIndex(stage) > i;
                  return (
                    <div key={s.key} className="flex items-center gap-3">
                      {done ? (
                        <CheckCircle2 className="size-5 shrink-0 text-green-600" />
                      ) : active ? (
                        <Loader2 className="size-5 shrink-0 animate-spin text-blue-600" />
                      ) : (
                        <span className="size-5 shrink-0 rounded-full border-2 border-slate-200" />
                      )}
                      <span className={cn("text-sm font-medium", done ? "text-green-700" : active ? "text-slate-900" : "text-slate-400")}>
                        {s.label}
                        {active && s.key === "uploading" && <span className="ml-2 text-xs text-slate-400 tabular-nums">{Math.min(progress, 100)}%</span>}
                      </span>
                    </div>
                  );
                })}
                {stage === "uploading" && (
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="progress-stripes h-full rounded-full bg-blue-600 transition-[width]" style={{ width: `${progress}%` }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---------------------------- EXTRACTED ---------------------------- */}
          {stage === "extracted" && (
            <div className="anim-fade-up mt-8 space-y-5">
              <div className="card p-6 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                    <CheckCircle2 className="size-5 text-green-600" /> Prescription detected
                  </h3>
                  <span className="chip">{fileName}</span>
                </div>

                <ol className="mt-5 space-y-3">
                  {EXTRACTED.map((m, i) => (
                    <li key={m.name} className="anim-fade-up rounded-xl border border-slate-200 bg-white p-4" style={{ animationDelay: `${i * 120}ms` }}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="grid size-7 place-items-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700">{i + 1}</span>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {m.name} <span className="font-semibold text-slate-500">— {m.strength}</span>
                            </p>
                            <p className="text-xs text-slate-500">{m.dose}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-green-500 transition-[width] duration-1000" style={{ width: `${m.confidence}%` }} />
                          </div>
                          <span className="text-[11px] font-bold text-green-700 tabular-nums">{m.confidence}%</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                  <Info className="mt-0.5 size-5 shrink-0 text-blue-600" />
                  <p className="text-sm leading-relaxed text-blue-900/85">
                    <span className="font-bold">Prescription details are subject to pharmacist verification before dispensing.</span>{" "}
                    OCR extraction helps your pharmacist review faster — it is not an automatic approval.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={sendForVerification} className="btn-green">
                    <Send className="size-4" /> Send for Pharmacist Verification
                  </button>
                  <button onClick={reset} className="btn-secondary">Re-upload</button>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------- SENT ------------------------------- */}
          {stage === "sent" && (
            <div className="card anim-scale-in mt-8 p-8 text-center">
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-green-600 text-white shadow-[var(--shadow-cta-green)]">
                <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path className="check-draw" d="M4.5 12.5l5 5 10-11" />
                </svg>
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold text-slate-900">Sent for verification</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                A licensed pharmacist at <span className="font-bold text-slate-800">NovaMed Pharmacy</span> will review
                your prescription — typically within <span className="font-bold text-slate-800">5–10 minutes</span>.
                We&apos;ll notify you the moment it&apos;s verified.
              </p>
              <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 ring-inset">
                <Loader2 className="size-3.5 animate-spin" /> Pharmacist review in progress
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/medicines" className="btn-primary">Browse medicines meanwhile</Link>
                <button onClick={reset} className="btn-secondary">Upload another</button>
              </div>
            </div>
          )}

          {/* my uploads */}
          {prescriptions.length > 0 && (
            <div className="mt-10">
              <h3 className="mb-3 text-sm font-bold text-slate-900">Your uploads</h3>
              <div className="space-y-2.5">
                {prescriptions.slice(0, 3).map((rx) => (
                  <div key={rx.id} className="card flex items-center gap-3 p-4">
                    <span className="grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-600"><FileText className="size-4.5" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-800">{rx.fileName}</p>
                      <p className="text-[11px] text-slate-400">{rx.id} · {rx.uploadedAt}</p>
                    </div>
                    <span className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset",
                      rx.status === "verified" ? "bg-green-50 text-green-700 ring-green-200" : "bg-amber-50 text-amber-700 ring-amber-200",
                    )}>
                      {rx.status === "verified" ? "Verified" : "Pending verification"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------ Side column ------------------------------ */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card anim-fade-up p-6 [animation-delay:120ms]">
            <h3 className="mb-4 text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">What happens next</h3>
            <ol className="space-y-5">
              {[
                { icon: FileUp, title: "You upload", text: "Photo or PDF of a valid prescription from a registered doctor." },
                { icon: ScanText, title: "OCR digitises it", text: "Medicine names, strengths and dosage patterns are extracted for quick review." },
                { icon: Stethoscope, title: "Pharmacist verifies", text: "A licensed pharmacist confirms validity, dosage and substitutions if any." },
                { icon: ChevronRight, title: "Order & track", text: "Medicines are packed at the nearest verified pharmacy and tracked to your door." },
              ].map((s) => (
                <li key={s.title} className="flex items-start gap-3.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                    <s.icon className="size-4.5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{s.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="card anim-fade-up border-green-200 bg-green-50/50 p-6 [animation-delay:180ms]">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-green-800">
              <ShieldCheck className="size-4.5" /> Safe by design
            </h3>
            <ul className="space-y-2.5 text-xs leading-relaxed text-green-800/80">
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-green-600" /> Only verified, licensed pharmacies receive prescriptions</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-green-600" /> Rx medicines are never dispensed without pharmacist approval</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-green-600" /> Encrypted storage and controlled access</li>
            </ul>
          </div>

          <div className="anim-fade-up rounded-2xl bg-slate-900 p-6 text-white [animation-delay:240ms]">
            <p className="text-xs font-bold tracking-[0.14em] text-slate-400 uppercase">Policy note</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Schedule H/H1 medicines are dispensed strictly against valid prescriptions. Requests that fail verification
              are declined with a reason, per our <Link href="/support#rx-policy" className="font-semibold text-white underline underline-offset-2">Prescription Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
