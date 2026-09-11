import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });

export const metadata: Metadata = {
  title: "MedRelay — Hyperlocal Medicine Delivery",
  description:
    "Medicines from your nearest verified pharmacy. Check live availability, upload prescriptions, and track delivery to your doorstep.",
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable}`}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
