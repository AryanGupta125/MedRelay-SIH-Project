import type { Metadata } from "next";
import { PharmacyExplorer } from "@/components/PharmacyExplorer";

export const metadata: Metadata = {
  title: "Pharmacies Near You — MedRelay",
  description: "Verified, licensed pharmacies near your location with live medicine availability.",
};

export default function PharmaciesPage() {
  return <PharmacyExplorer />;
}
