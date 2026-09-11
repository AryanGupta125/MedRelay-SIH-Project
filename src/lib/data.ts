import type { LucideIcon } from "lucide-react";
import {
  Baby,
  Bandage,
  HeartPulse,
  Leaf,
  Pill,
  Salad,
  Sparkles,
  Stethoscope,
  Thermometer,
  Wind,
} from "lucide-react";

/* ---------------------------------- Types ---------------------------------- */

export type MedicineForm =
  | "Tablet"
  | "Capsule"
  | "Syrup"
  | "Spray"
  | "Gel"
  | "Device"
  | "Sachet"
  | "Cream"
  | "Liquid";

export interface PharmacyStock {
  pharmacyId: string;
  qty: number; // 0 = out of stock right now
}

export interface Medicine {
  id: string;
  name: string;
  generic: string;
  form: MedicineForm;
  strength: string;
  manufacturer: string;
  packSize: string;
  price: number;
  mrp: number;
  categoryId: string;
  requiresPrescription: boolean;
  rating: number;
  ratingCount: number;
  description: string;
  usageNote: string;
  stock: PharmacyStock[];
  tags: string[];
}

export interface Pharmacy {
  id: string;
  name: string;
  area: string;
  address: string;
  distanceKm: number;
  etaMin: number;
  etaMax: number;
  rating: number;
  ratingCount: number;
  licenseNo: string;
  openNow: boolean;
  opensAt?: string;
  closesAt?: string;
  phone: string;
  reviewHighlight: string;
}

export interface Category {
  id: string;
  name: string;
  blurb: string;
  icon: LucideIcon;
  tint: "blue" | "green";
  count: number;
}

/* -------------------------------- Categories ------------------------------- */

export const CATEGORIES: Category[] = [
  { id: "pain-relief", name: "Pain Relief", blurb: "Tablets, sprays & gels", icon: Pill, tint: "blue", count: 240 },
  { id: "cold-cough", name: "Cold & Cough", blurb: "Syrups, lozenges, sprays", icon: Wind, tint: "green", count: 180 },
  { id: "fever", name: "Fever & Flu", blurb: "Antipyretics & care", icon: Thermometer, tint: "blue", count: 96 },
  { id: "vitamins", name: "Vitamins & Supplements", blurb: "Daily nutrition", icon: Leaf, tint: "green", count: 320 },
  { id: "first-aid", name: "First Aid", blurb: "Bandages & antiseptics", icon: Bandage, tint: "blue", count: 140 },
  { id: "digestive", name: "Digestive Health", blurb: "Antacids, ORS & more", icon: Salad, tint: "green", count: 150 },
  { id: "personal-care", name: "Personal Care", blurb: "Skin & hygiene", icon: Sparkles, tint: "blue", count: 410 },
  { id: "baby-care", name: "Baby Care", blurb: "Gentle essentials", icon: Baby, tint: "green", count: 130 },
  { id: "devices", name: "Healthcare Devices", blurb: "Thermometers & monitors", icon: Stethoscope, tint: "blue", count: 85 },
  { id: "chronic-care", name: "Chronic Care", blurb: "Diabetes, BP & heart", icon: HeartPulse, tint: "green", count: 210 },
];

export const CATEGORIES_MAP = new Map(CATEGORIES.map((c) => [c.id, c]));

/* -------------------------------- Pharmacies ------------------------------- */

export const PHARMACIES: Pharmacy[] = [
  {
    id: "p1", name: "NovaMed Pharmacy", area: "Kothrud, Pune",
    address: "Shop 12, Paud Rd, Kothrud, Pune, Maharashtra 411038",
    distanceKm: 1.2, etaMin: 20, etaMax: 30, rating: 4.8, ratingCount: 2314,
    licenseNo: "MH-PUN/2021/04821", openNow: true, closesAt: "11:30 PM",
    phone: "+91 98450 12231", reviewHighlight: "Packed neatly, delivered in 19 minutes.",
  },
  {
    id: "p2", name: "CityCare Chemists", area: "Bandra West, Mumbai",
    address: "88, Linking Rd, Bandra West, Mumbai, Maharashtra 400050",
    distanceKm: 1.8, etaMin: 24, etaMax: 34, rating: 4.6, ratingCount: 1876,
    licenseNo: "MH-MUM/2019/03317", openNow: true, closesAt: "Open 24×7",
    phone: "+91 98450 88712", reviewHighlight: "Pharmacist called to confirm my prescription. Very professional.",
  },
  {
    id: "p3", name: "WellNest Pharmacy", area: "Viman Nagar, Pune",
    address: "21, Datta Mandir Rd, Viman Nagar, Pune, Maharashtra 411014",
    distanceKm: 2.2, etaMin: 26, etaMax: 36, rating: 4.7, ratingCount: 1542,
    licenseNo: "MH-PUN/2022/05188", openNow: true, closesAt: "10:30 PM",
    phone: "+91 98450 33490", reviewHighlight: "Stock was accurate — my order was ready in minutes.",
  },
  {
    id: "p4", name: "MediPoint Plus", area: "Andheri West, Mumbai",
    address: "3, SV Rd, Andheri West, Mumbai, Maharashtra 400058",
    distanceKm: 2.6, etaMin: 28, etaMax: 40, rating: 4.5, ratingCount: 987,
    licenseNo: "MH-MUM/2020/04102", openNow: true, closesAt: "11:00 PM",
    phone: "+91 98450 77820", reviewHighlight: "Good range of chronic-care medicines.",
  },
  {
    id: "p5", name: "TrueDose Pharmacy", area: "Thane West, Thane",
    address: "45, Gokhale Rd, Thane West, Maharashtra 400602",
    distanceKm: 3.1, etaMin: 32, etaMax: 44, rating: 4.4, ratingCount: 802,
    licenseNo: "MH-THN/2023/05774", openNow: false, opensAt: "8:00 AM",
    phone: "+91 98450 90110", reviewHighlight: "Reliable store, opens early.",
  },
  {
    id: "p6", name: "HealthHub Chemists", area: "Vashi, Navi Mumbai",
    address: "102, Sector 17, Vashi, Navi Mumbai, Maharashtra 400703",
    distanceKm: 3.4, etaMin: 34, etaMax: 46, rating: 4.6, ratingCount: 1204,
    licenseNo: "MH-NMU/2021/04659", openNow: true, closesAt: "12:00 AM",
    phone: "+91 98450 61234", reviewHighlight: "Found a rarely-stocked inhaler here.",
  },
];

export const PHARMACIES_MAP = new Map(PHARMACIES.map((p) => [p.id, p]));

/* --------------------------------- Medicines ------------------------------- */

const S = (pharmacyId: string, qty: number): PharmacyStock => ({ pharmacyId, qty });

export const MEDICINES: Medicine[] = [
  {
    id: "m1", name: "Paracetamol 650mg", generic: "Paracetamol", form: "Tablet",
    strength: "650 mg", manufacturer: "HealWell Labs", packSize: "Strip of 15 tablets",
    price: 32, mrp: 38, categoryId: "pain-relief", requiresPrescription: false,
    rating: 4.8, ratingCount: 5212,
    description: "Widely used analgesic and antipyretic, stocked for fever as well as mild to moderate pain.",
    usageNote: "Commonly ordered for fever, headache and body ache. Follow the label or your doctor's directions.",
    stock: [S("p1", 48), S("p2", 120), S("p3", 35), S("p4", 60), S("p5", 0), S("p6", 22)],
    tags: ["fever", "headache", "pain"],
  },
  {
    id: "m2", name: "Azithromycin 250mg", generic: "Azithromycin", form: "Tablet",
    strength: "250 mg", manufacturer: "Medixor Pharma", packSize: "Strip of 6 tablets",
    price: 89, mrp: 105, categoryId: "cold-cough", requiresPrescription: true,
    rating: 4.6, ratingCount: 2210,
    description: "Prescription antibiotic. A valid prescription is verified by a licensed pharmacist before dispensing.",
    usageNote: "Antibiotic — supplied only against a valid, verified prescription.",
    stock: [S("p1", 0), S("p2", 26), S("p3", 0), S("p4", 14)],
    tags: ["antibiotic", "throat", "infection"],
  },
  {
    id: "m3", name: "Cetirizine 10mg", generic: "Cetirizine Hydrochloride", form: "Tablet",
    strength: "10 mg", manufacturer: "AllerCare Pharma", packSize: "Strip of 10 tablets",
    price: 26, mrp: 32, categoryId: "cold-cough", requiresPrescription: false,
    rating: 4.7, ratingCount: 3891,
    description: "Antihistamine frequently stocked for allergies, sneezing and runny nose.",
    usageNote: "May cause drowsiness for some people. Read the label before use.",
    stock: [S("p1", 80), S("p3", 44), S("p5", 12), S("p6", 31)],
    tags: ["allergy", "cold", "sneezing"],
  },
  {
    id: "m4", name: "Ibuprofen 400mg", generic: "Ibuprofen", form: "Tablet",
    strength: "400 mg", manufacturer: "Novex Healthcare", packSize: "Strip of 15 tablets",
    price: 41, mrp: 49, categoryId: "pain-relief", requiresPrescription: false,
    rating: 4.6, ratingCount: 1980,
    description: "NSAID stocked for pain, inflammation and fever.",
    usageNote: "Usually taken after food. Follow the label directions.",
    stock: [S("p1", 6), S("p2", 50), S("p5", 8)],
    tags: ["pain", "inflammation", "fever"],
  },
  {
    id: "m5", name: "Amoxicillin 500mg", generic: "Amoxicillin", form: "Capsule",
    strength: "500 mg", manufacturer: "BioNest Pharmaceuticals", packSize: "Strip of 10 capsules",
    price: 102, mrp: 120, categoryId: "cold-cough", requiresPrescription: true,
    rating: 4.5, ratingCount: 1640,
    description: "Prescription antibiotic, dispensed after pharmacist verification of a valid prescription.",
    usageNote: "Complete the full prescribed course as directed by your doctor.",
    stock: [S("p1", 0), S("p3", 18), S("p4", 22)],
    tags: ["antibiotic", "infection"],
  },
  {
    id: "m6", name: "Omeprazole 20mg", generic: "Omeprazole", form: "Capsule",
    strength: "20 mg", manufacturer: "GastroShield Labs", packSize: "Strip of 15 capsules",
    price: 58, mrp: 70, categoryId: "digestive", requiresPrescription: false,
    rating: 4.6, ratingCount: 1432,
    description: "Proton-pump inhibitor commonly stocked for acidity and heartburn.",
    usageNote: "Typically taken before meals. Check the label for directions.",
    stock: [S("p1", 45), S("p4", 30), S("p5", 16), S("p6", 25)],
    tags: ["acidity", "gas", "heartburn"],
  },
  {
    id: "m7", name: "Vitamin D3 60,000 IU", generic: "Cholecalciferol", form: "Capsule",
    strength: "60,000 IU", manufacturer: "Vitalis Nutrition", packSize: "Strip of 4 capsules",
    price: 96, mrp: 115, categoryId: "vitamins", requiresPrescription: false,
    rating: 4.7, ratingCount: 2876,
    description: "High-strength vitamin D supplement for weekly supplementation routines.",
    usageNote: "Supplement — confirm the regimen your doctor advised.",
    stock: [S("p2", 40), S("p3", 12), S("p6", 18)],
    tags: ["vitamin d", "supplement", "bones"],
  },
  {
    id: "m8", name: "ORS Orange Sachet", generic: "Oral Rehydration Salts", form: "Sachet",
    strength: "21.8 g", manufacturer: "HydroLife Sciences", packSize: "Pack of 5 sachets",
    price: 22, mrp: 26, categoryId: "digestive", requiresPrescription: false,
    rating: 4.9, ratingCount: 6120,
    description: "WHO-formula oral rehydration salts with orange flavour.",
    usageNote: "Dissolve in the quantity of water stated on the sachet.",
    stock: [S("p1", 84), S("p2", 96), S("p3", 60), S("p4", 72), S("p5", 40), S("p6", 55)],
    tags: ["hydration", "dehydration", "ors"],
  },
  {
    id: "m9", name: "Metformin 500mg", generic: "Metformin Hydrochloride", form: "Tablet",
    strength: "500 mg", manufacturer: "GlucoSure Pharma", packSize: "Strip of 20 tablets",
    price: 45, mrp: 54, categoryId: "chronic-care", requiresPrescription: true,
    rating: 4.5, ratingCount: 3310,
    description: "First-line chronic-care medicine for type 2 diabetes management programmes.",
    usageNote: "Chronic-care medicine — supplied against a valid prescription.",
    stock: [S("p4", 58), S("p5", 33)],
    tags: ["diabetes", "sugar", "chronic"],
  },
  {
    id: "m10", name: "Atorvastatin 10mg", generic: "Atorvastatin Calcium", form: "Tablet",
    strength: "10 mg", manufacturer: "CardioVance Labs", packSize: "Strip of 15 tablets",
    price: 74, mrp: 89, categoryId: "chronic-care", requiresPrescription: true,
    rating: 4.4, ratingCount: 1120,
    description: "Statin stocked as part of long-term lipid-management care plans.",
    usageNote: "Chronic-care medicine — supplied against a valid prescription.",
    stock: [S("p1", 0), S("p4", 20)],
    tags: ["cholesterol", "heart", "chronic"],
  },
  {
    id: "m11", name: "Cough Relief Syrup 100ml", generic: "Dextromethorphan + Phenylephrine", form: "Syrup",
    strength: "100 ml", manufacturer: "RespiCare Remedies", packSize: "1 bottle (100 ml)",
    price: 118, mrp: 135, categoryId: "cold-cough", requiresPrescription: false,
    rating: 4.3, ratingCount: 930,
    description: "Non-drowsy formula cough syrup for dry and irritating cough.",
    usageNote: "Shake well before use. Follow the label dosage cup markings.",
    stock: [S("p2", 28), S("p5", 10), S("p6", 15)],
    tags: ["cough", "sore throat", "cold"],
  },
  {
    id: "m12", name: "Antiseptic Liquid 100ml", generic: "Chlorhexidine + Cetrimide", form: "Liquid",
    strength: "100 ml", manufacturer: "SafeTouch Hygiene", packSize: "1 bottle (100 ml)",
    price: 86, mrp: 99, categoryId: "first-aid", requiresPrescription: false,
    rating: 4.6, ratingCount: 2510,
    description: "First-aid antiseptic for cuts, grazes and personal hygiene.",
    usageNote: "For external use only. Dilute as directed on the label.",
    stock: [S("p1", 33), S("p3", 21), S("p5", 14)],
    tags: ["antiseptic", "first aid", "cuts"],
  },
  {
    id: "m13", name: "Digital Thermometer Flexi", generic: "Digital clinical thermometer", form: "Device",
    strength: "BPA-free, waterproof", manufacturer: "MedSense Devices", packSize: "1 unit with case",
    price: 249, mrp: 329, categoryId: "devices", requiresPrescription: false,
    rating: 4.5, ratingCount: 1875,
    description: "Fast-read digital thermometer with a flexible tip and fever alarm.",
    usageNote: "Device — read the enclosed manual before first use.",
    stock: [S("p2", 9), S("p6", 6)],
    tags: ["thermometer", "fever", "device"],
  },
  {
    id: "m14", name: "Diaper Rash Cream 50g", generic: "Zinc Oxide 10% w/w", form: "Cream",
    strength: "50 g", manufacturer: "BabySoft Care", packSize: "1 tube (50 g)",
    price: 145, mrp: 165, categoryId: "baby-care", requiresPrescription: false,
    rating: 4.7, ratingCount: 1240,
    description: "Gentle barrier cream for baby diaper rash and skin protection.",
    usageNote: "For external use. Patch-test on sensitive skin first.",
    stock: [S("p3", 17), S("p6", 11)],
    tags: ["baby", "rash", "skin"],
  },
  {
    id: "m15", name: "Daily Multivitamin Tablets", generic: "Multivitamin + Multimineral", form: "Tablet",
    strength: "Adult formula", manufacturer: "Vitalis Nutrition", packSize: "Bottle of 60 tablets",
    price: 310, mrp: 380, categoryId: "vitamins", requiresPrescription: false,
    rating: 4.4, ratingCount: 2030,
    description: "Once-daily multivitamin with 23 vitamins, minerals and antioxidants.",
    usageNote: "Supplement — not a substitute for a varied diet.",
    stock: [S("p1", 26), S("p2", 38), S("p4", 19)],
    tags: ["multivitamin", "immunity", "supplement"],
  },
  {
    id: "m16", name: "Pain Relief Spray 100g", generic: "Diclofenac spray", form: "Spray",
    strength: "100 g", manufacturer: "FlexEase Therapeutics", packSize: "1 spray bottle",
    price: 165, mrp: 199, categoryId: "pain-relief", requiresPrescription: false,
    rating: 4.5, ratingCount: 2760,
    description: "Fast-absorbing topical spray for muscle and joint pain.",
    usageNote: "For external use only. Do not spray on broken skin.",
    stock: [S("p1", 8), S("p3", 23), S("p5", 0)],
    tags: ["spray", "muscle pain", "joint"],
  },
];

export const MEDICINES_MAP = new Map(MEDICINES.map((m) => [m.id, m]));

export const SUGGESTED_SEARCHES = ["Paracetamol", "Azithromycin", "Vitamin D3", "Cetirizine", "ORS", "Thermometer"];

export const AREAS = [
  "Kothrud, Pune",
  "Viman Nagar, Pune",
  "Baner, Pune",
  "Wakad, Pune",
  "Hinjawadi, Pune",
  "Aundh, Pune",
  "Deccan Gymkhana, Pune",
  "Hadapsar, Pune",
  "Koregaon Park, Pune",
  "Magarpatta, Pune",
  "Shivajinagar, Pune",
  "Kondhwa, Pune",
  "Bavdhan, Pune",
  "Pimple Saudagar, Pune",
  "FC Road, Pune",
  "Kalyani Nagar, Pune",
  "Bandra West, Mumbai",
  "Andheri West, Mumbai",
  "Dadar West, Mumbai",
  "Powai, Mumbai",
  "Thane West, Thane",
  "Vashi, Navi Mumbai",
  "Nashik Road, Nashik",
  "Dharampeth, Nagpur",
  "Borivali West, Mumbai",
];

/* ------------------------------ Availability ------------------------------- */

export function getMedicine(id: string): Medicine | undefined {
  return MEDICINES_MAP.get(id);
}

export function getPharmacy(id: string): Pharmacy | undefined {
  return PHARMACIES_MAP.get(id);
}

export function stockAt(m: Medicine, pharmacyId: string): number {
  return m.stock.find((s) => s.pharmacyId === pharmacyId)?.qty ?? 0;
}

export function availableAts(m: Medicine): Pharmacy[] {
  return PHARMACIES.filter((p) => p.openNow && stockAt(m, p.id) > 0).sort((a, b) => a.distanceKm - b.distanceKm);
}

export function nearestPharmacyWith(m: Medicine): Pharmacy | undefined {
  return availableAts(m)[0];
}

export interface FulfillmentOption {
  pharmacy: Pharmacy;
  have: string[]; // medicine ids in stock
  missing: string[]; // medicine ids not in stock
  coverAll: boolean;
}

/** Rank pharmacies by how many cart items they can fulfil (then distance). */
export function fulfillmentOptions(medicineIds: string[]): FulfillmentOption[] {
  const meds = medicineIds.map((id) => MEDICINES_MAP.get(id)).filter((m): m is Medicine => Boolean(m));
  return PHARMACIES.filter((p) => p.openNow)
    .map((pharmacy) => {
      const have = meds.filter((m) => stockAt(m, pharmacy.id) > 0).map((m) => m.id);
      const missing = meds.filter((m) => stockAt(m, pharmacy.id) <= 0).map((m) => m.id);
      return { pharmacy, have, missing, coverAll: missing.length === 0 };
    })
    .sort((a, b) => b.have.length - a.have.length || a.pharmacy.distanceKm - b.pharmacy.distanceKm);
}

/* --------------------------- Order / Tracking ------------------------------ */

export interface TimelineStep {
  key: string;
  label: string;
  hint: string;
}

export const TIMELINE: TimelineStep[] = [
  { key: "placed", label: "Order Placed", hint: "We received your order" },
  { key: "confirmed", label: "Pharmacy Confirmed", hint: "Store accepted & is preparing" },
  { key: "rx", label: "Prescription Verified", hint: "Checked by a licensed pharmacist" },
  { key: "packed", label: "Medicine Packed", hint: "Sealed & labelled for handover" },
  { key: "picked", label: "Rider Picked Up", hint: "Package is with your rider" },
  { key: "ofd", label: "Out for Delivery", hint: "Rider is heading your way" },
  { key: "delivered", label: "Delivered", hint: "Completed with OTP verification" },
];

export interface OrderItemView {
  medicineId: string;
  qty: number;
}

export interface DemoOrder {
  id: string;
  placedAt: string;
  items: OrderItemView[];
  pharmacyId: string;
  address: string;
  addressLabel: string;
  rider: { name: string; phone: string; rating: number; vehicle: string; deliveries: number };
  otp: string;
  eta: string;
  fee: number;
  stepIndex: number;
  timelineTimes: (string | null)[];
}

export const DEMO_ORDER: DemoOrder = {
  id: "MR-90412",
  placedAt: "Today, 7:42 PM",
  items: [
    { medicineId: "m1", qty: 2 },
    { medicineId: "m11", qty: 1 },
    { medicineId: "m3", qty: 1 },
  ],
  pharmacyId: "p1",
  address: "Flat 402, Sunshine Heights, Paud Road, Kothrud, Pune, Maharashtra 411038",
  addressLabel: "Home",
  rider: { name: "Arjun Kumar", phone: "+91 98••• ••231", rating: 4.9, vehicle: "Bike • MH-12-JD-2231", deliveries: 1832 },
  otp: "4826",
  eta: "18–25 min",
  fee: 19,
  stepIndex: 4,
  timelineTimes: ["7:42 PM", "7:44 PM", "7:46 PM", "7:52 PM", "8:03 PM", null, null],
};

export function orderTotal(items: OrderItemView[]): number {
  return items.reduce((sum, it) => sum + (MEDICINES_MAP.get(it.medicineId)?.price ?? 0) * it.qty, 0);
}

/* ------------------------------ User (mock) -------------------------------- */

export const CUSTOMER = {
  name: "Ananya Sharma",
  email: "ananya.sharma@example.com",
  phone: "+91 99880 12345",
  memberSince: "Jan 2025",
};

export const ADDRESSES = [
  { id: "a1", label: "Home", line: "Flat 402, Sunshine Heights, Paud Road, Kothrud, Pune, Maharashtra 411038", tag: "Default" },
  { id: "a2", label: "Work", line: "3rd Floor, Tech Park, BKC, Bandra East, Mumbai, Maharashtra 400051", tag: "" },
];

export const PAST_ORDERS = [
  { id: "MR-88031", date: "22 Jan", pharmacyId: "p2", items: 4, total: 486, status: "Delivered" },
  { id: "MR-87102", date: "14 Jan", pharmacyId: "p1", items: 2, total: 154, status: "Delivered" },
  { id: "MR-85966", date: "02 Jan", pharmacyId: "p3", items: 6, total: 912, status: "Delivered" },
];

export const CUSTOMER_RX = [
  {
    id: "RX-3392",
    uploadedAt: "18 Jan 2026",
    status: "verified" as const,
    meds: [
      { name: "Metformin", strength: "500 mg", dose: "1-0-1 · 30 days" },
      { name: "Atorvastatin", strength: "10 mg", dose: "0-0-1 · 30 days" },
    ],
    verifiedBy: "Ph. Rohit Shetty, NovaMed Pharmacy",
  },
  {
    id: "RX-3417",
    uploadedAt: "24 Jan 2026",
    status: "pending_verification" as const,
    meds: [
      { name: "Azithromycin", strength: "250 mg", dose: "1-0-0 · 5 days" },
      { name: "Cetirizine", strength: "10 mg", dose: "0-0-1 · 5 days" },
    ],
    verifiedBy: "",
  },
];

/* --------------------------- Pharmacy dashboard ---------------------------- */

export const PHARMACY_ORDERS = [
  { id: "MR-90412", customer: "Ananya Sharma", items: "Paracetamol 650mg ×2, Cough Relief Syrup ×1, Cetirizine ×1", total: 227, status: "new", placed: "2 min ago", rx: true },
  { id: "MR-90409", customer: "Vikram Iyer", items: "Ibuprofen 400mg ×1, ORS Sachet ×2", total: 85, status: "new", placed: "9 min ago", rx: false },
  { id: "MR-90402", customer: "Meera Pillai", items: "Antiseptic Liquid 100ml ×1", total: 105, status: "preparing", placed: "18 min ago", rx: false },
  { id: "MR-90395", customer: "Rohan Gupta", items: "Paracetamol 650mg ×1, Daily Multivitamin ×1", total: 342, status: "ready", placed: "31 min ago", rx: false },
  { id: "MR-90388", customer: "Sana Sheikh", items: "Pain Relief Spray 100g ×1", total: 184, status: "out_for_delivery", placed: "47 min ago", rx: false },
  { id: "MR-90371", customer: "Dev Patel", items: "Cetirizine 10mg ×2", total: 71, status: "delivered", placed: "1 hr ago", rx: false },
];

export const PHARMACY_RX_QUEUE = [
  {
    id: "RX-3417", customer: "Ananya Sharma", uploaded: "12 min ago", status: "pending" as const,
    meds: [
      { name: "Azithromycin", strength: "250 mg", dose: "1-0-0 · 5 days", confidence: 97 },
      { name: "Cetirizine", strength: "10 mg", dose: "0-0-1 · 5 days", confidence: 99 },
    ],
    doctor: "Dr. K. Raghavan · Reg. 89412",
  },
  {
    id: "RX-3416", customer: "Farhan Ali", uploaded: "40 min ago", status: "pending" as const,
    meds: [{ name: "Amoxicillin", strength: "500 mg", dose: "1-1-1 · 7 days", confidence: 94 }],
    doctor: "Dr. S. Menon · Reg. 71230",
  },
  {
    id: "RX-3415", customer: "Priya Nair", uploaded: "1 hr ago", status: "pending" as const,
    meds: [{ name: "Metformin", strength: "500 mg", dose: "1-0-1 · 30 days", confidence: 98 }],
    doctor: "Dr. A. Bhatt · Reg. 65508",
  },
];

export const PHARMA_WEEK = [22, 31, 28, 35, 30, 42, 34];

/* ------------------------------ Rider (mock) ------------------------------- */

export const RIDER = {
  name: "Arjun Kumar",
  id: "DRV-2211",
  rating: 4.9,
  since: "Mar 2024",
  phone: "+91 97170 88•••",
  earnings: { today: 860, week: 5240, deliveriesToday: 12, onlineHrs: "7h 20m", acceptance: 96 },
  history: [
    { id: "MR-90388", area: "HSR Layout → Agara", amount: 46, time: "32 min", when: "47 min ago" },
    { id: "MR-90377", area: "Koramangala → HSR", amount: 52, time: "28 min", when: "2 hr ago" },
    { id: "MR-90364", area: "BTM → HSR Sector 2", amount: 41, time: "24 min", when: "3 hr ago" },
    { id: "MR-90352", area: "HSR → Haralur", amount: 58, time: "36 min", when: "4 hr ago" },
  ],
};

/* ------------------------------- Admin (mock) ------------------------------ */

export const ADMIN_KPIS = {
  customers: 12840,
  pharmacies: 342,
  partners: 618,
  ordersToday: 1284,
  deliveredRate: 96.4,
  pendingVerifications: 7,
};

export const ORDERS_SERIES = [640, 702, 688, 754, 810, 936, 870, 902, 845, 991, 1042, 980, 1130, 1284];

export const DEMAND_SPLIT = [
  { label: "Pain Relief", value: 32, color: "#2563EB" },
  { label: "Cold & Cough", value: 22, color: "#60A5FA" },
  { label: "Chronic Care", value: 18, color: "#16A34A" },
  { label: "Vitamins", value: 14, color: "#4ADE80" },
  { label: "Devices", value: 8, color: "#93C5FD" },
  { label: "Others", value: 6, color: "#CBD5E1" },
];

export const PHARMACY_PERF = [
  { name: "NovaMed Pharmacy", orders: 312, fulfil: 98.2, rating: 4.8 },
  { name: "CityCare Chemists", orders: 284, fulfil: 97.1, rating: 4.6 },
  { name: "WellNest Pharmacy", orders: 246, fulfil: 95.8, rating: 4.7 },
  { name: "MediPoint Plus", orders: 198, fulfil: 94.4, rating: 4.5 },
  { name: "HealthHub Chemists", orders: 176, fulfil: 93.6, rating: 4.6 },
];

export const RECENT_ORDERS = [
  { id: "MR-90412", customer: "Ananya Sharma", pharmacy: "NovaMed Pharmacy", total: 227, status: "Out for delivery", when: "2 min ago" },
  { id: "MR-90411", customer: "Kabir Shah", pharmacy: "CityCare Chemists", total: 410, status: "Packed", when: "4 min ago" },
  { id: "MR-90410", customer: "Ishita Rao", pharmacy: "WellNest Pharmacy", total: 96, status: "Confirmed", when: "6 min ago" },
  { id: "MR-90409", customer: "Vikram Iyer", pharmacy: "NovaMed Pharmacy", total: 85, status: "Confirmed", when: "9 min ago" },
  { id: "MR-90408", customer: "Tara Bose", pharmacy: "MediPoint Plus", total: 623, status: "Delivered", when: "12 min ago" },
  { id: "MR-90407", customer: "Nikhil Anand", pharmacy: "HealthHub Chemists", total: 249, status: "Delivered", when: "15 min ago" },
];

export const VERIFICATION_QUEUE = [
  { id: "PV-118", name: "Sunrise Pharma Corner", area: "Whitefield", license: "KA-BLR/2025/06112", submitted: "Submitted 2 days ago", docs: "Drug license, GST, Owner ID" },
  { id: "PV-117", name: "Shree Balaji Medicals", area: "JP Nagar", license: "KA-BLR/2025/06087", submitted: "Submitted 3 days ago", docs: "Drug license, GST" },
  { id: "PV-116", name: "Neighbourhood Chemists", area: "Yelahanka", license: "KA-BLR/2025/06041", submitted: "Submitted 4 days ago", docs: "Drug license, GST, Owner ID" },
];

export const DELIVERY_PERF = { avgMins: 27, onTime: 94.8, activeNow: 312, zones: 9 };

export const TRUST_POINTS = [
  "Verified Pharmacies",
  "Live Availability",
  "Secure Prescription Handling",
  "Real-Time Tracking",
];
