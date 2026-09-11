import type { Metadata } from "next";
import { BackToHome, BrandPanel, LoginForm } from "@/components/AuthLayout";

export const metadata: Metadata = {
  title: "Sign in — MedRelay",
};

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-slate-50/70">
      <div className="container-x grid min-h-dvh items-center gap-10 py-10 lg:grid-cols-[1fr_1.05fr]">
        <BrandPanel
          heading="Sign in to the hyperlocal way of getting medicines."
          lines={[
            "Track live orders from nearby verified pharmacies",
            "Prescriptions verified by licensed pharmacists",
            "One account — customer, store or rider",
          ]}
        />
        <div className="mx-auto w-full max-w-md">
          <BackToHome />
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
