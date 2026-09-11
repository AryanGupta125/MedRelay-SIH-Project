"use client";

import Link from "next/link";
import { Lock, LogIn, ShieldAlert, Sparkles, UserPlus, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { useMounted } from "@/lib/useMounted";

export function LoginModal() {
  const showLoginModal = useApp((s) => s.showLoginModal);
  const setShowLoginModal = useApp((s) => s.setShowLoginModal);
  const mounted = useMounted();

  if (!mounted || !showLoginModal) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={() => setShowLoginModal(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div
        className="anim-scale-in relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-blue-500/15 blur-2xl" />
        <div className="pointer-events-none absolute -top-16 -left-16 size-40 rounded-full bg-indigo-500/15 blur-2xl" />

        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowLoginModal(false);
          }}
          className="absolute top-4 right-4 z-30 grid size-9 place-items-center rounded-full bg-slate-100/90 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-900 active:scale-95 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>

        {/* Header Icon */}
        <div className="relative mb-5 flex items-center justify-between pr-10 sm:pr-12">
          <div className="relative flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
            <Lock className="size-7" />
            <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-amber-500 text-white shadow-xs">
              <ShieldAlert className="size-3" />
            </span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200/60 ring-inset">
            <Sparkles className="size-3 text-blue-600" /> Authentication Required
          </span>
        </div>

        {/* Content */}
        <h3 id="login-modal-title" className="font-display text-xl font-bold tracking-tight text-slate-900">
          Please login to add items to your cart
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Sign in to your MedRelay account to add medicines to your cart, check live availability at nearby pharmacies in Maharashtra, and place your order.
        </p>

        {/* Actions */}
        <div className="mt-6 space-y-2.5">
          <Link
            href="/auth/login"
            onClick={() => setShowLoginModal(false)}
            className="btn-primary flex w-full items-center justify-center gap-2 py-3 text-sm"
          >
            <LogIn className="size-4" /> Sign In to Account
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-slate-100 pt-4 text-center">
          <p className="text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              onClick={() => setShowLoginModal(false)}
              className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800"
            >
              <UserPlus className="size-3.5" /> Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
