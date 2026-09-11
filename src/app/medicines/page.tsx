import type { Metadata } from "next";
import { Suspense } from "react";
import { MedicinesExplorer } from "@/components/MedicinesExplorer";

export const metadata: Metadata = {
  title: "Browse Medicines — MedRelay",
  description: "Search medicines and health products with live availability from verified pharmacies near you.",
};

export default function MedicinesPage() {
  return (
    <Suspense fallback={<div className="container-x py-16"><div className="shimmer h-10 w-1/3 rounded-xl" /></div>}>
      <MedicinesExplorer />
    </Suspense>
  );
}
