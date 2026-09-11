import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

/* ---------------------------------- Enums ---------------------------------- */

export const userRoleEnum = pgEnum("user_role", ["customer", "pharmacy", "rider", "admin"]);

export const prescriptionStatusEnum = pgEnum("prescription_status", [
  "processing",
  "pending_verification",
  "verified",
  "rejected",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "placed",
  "confirmed",
  "prescription_verified",
  "packed",
  "picked_up",
  "out_for_delivery",
  "delivered",
  "cancelled",
]);

export const paymentMethodEnum = pgEnum("payment_method", ["upi", "card", "cod"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "failed", "refunded"]);

/* ---------------------------------- Tables --------------------------------- */

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("customer"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pharmacies = pgTable("pharmacies", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").references(() => users.id),
  name: varchar("name", { length: 160 }).notNull(),
  licenseNo: varchar("license_no", { length: 60 }).notNull().unique(),
  area: varchar("area", { length: 120 }).notNull(),
  address: text("address").notNull(),
  lat: numeric("lat", { precision: 9, scale: 6 }),
  lng: numeric("lng", { precision: 9, scale: 6 }),
  rating: numeric("rating", { precision: 2, scale: 1 }).default("4.5"),
  openNow: boolean("open_now").notNull().default(true),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const medicines = pgTable("medicines", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  generic: varchar("generic", { length: 180 }),
  form: varchar("form", { length: 40 }).notNull(),
  strength: varchar("strength", { length: 60 }).notNull(),
  manufacturer: varchar("manufacturer", { length: 160 }),
  packSize: varchar("pack_size", { length: 120 }),
  requiresPrescription: boolean("requires_prescription").notNull().default(false),
  categoryId: varchar("category_id", { length: 60 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const inventory = pgTable(
  "inventory",
  {
    id: serial("id").primaryKey(),
    pharmacyId: integer("pharmacy_id").notNull().references(() => pharmacies.id),
    medicineId: integer("medicine_id").notNull().references(() => medicines.id),
    qty: integer("qty").notNull().default(0),
    price: integer("price").notNull(), // INR, whole rupees
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("inventory_pharmacy_medicine_idx").on(t.pharmacyId, t.medicineId)],
);

export const prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => users.id),
  pharmacyId: integer("pharmacy_id").references(() => pharmacies.id),
  imageUrl: text("image_url"),
  status: prescriptionStatusEnum("status").notNull().default("processing"),
  extracted: jsonb("extracted"), // OCR output: list of { name, strength, dose, confidence }
  verifiedBy: varchar("verified_by", { length: 160 }),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
});

export const deliveryPartners = pgTable("delivery_partners", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  vehicleNo: varchar("vehicle_no", { length: 20 }),
  rating: numeric("rating", { precision: 2, scale: 1 }).default("4.8"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  label: varchar("label", { length: 40 }).notNull(),
  line: text("line").notNull(),
  lat: numeric("lat", { precision: 9, scale: 6 }),
  lng: numeric("lng", { precision: 9, scale: 6 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  customerId: integer("customer_id").notNull().references(() => users.id),
  pharmacyId: integer("pharmacy_id").notNull().references(() => pharmacies.id),
  riderId: integer("rider_id").references(() => deliveryPartners.id),
  addressId: integer("address_id").references(() => addresses.id),
  status: orderStatusEnum("status").notNull().default("placed"),
  total: integer("total").notNull(), // INR
  fee: integer("fee").notNull().default(0),
  otp: varchar("otp", { length: 4 }),
  rxId: integer("rx_id").references(() => prescriptions.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  medicineId: integer("medicine_id").notNull().references(() => medicines.id),
  qty: integer("qty").notNull(),
  price: integer("price").notNull(),
});

export const orderEvents = pgTable("order_events", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  status: orderStatusEnum("status").notNull(),
  note: varchar("note", { length: 240 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => sql`now()`),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  method: paymentMethodEnum("method").notNull(),
  status: paymentStatusEnum("status").notNull().default("pending"),
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: varchar("title", { length: 160 }).notNull(),
  body: varchar("body", { length: 320 }),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
