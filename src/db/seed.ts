import "dotenv/config";
import { db } from "./index";
import {
  addresses,
  deliveryPartners,
  inventory,
  medicines,
  notifications,
  orderEvents,
  orderItems,
  orders,
  payments,
  pharmacies,
  prescriptions,
  users,
} from "./schema";
import { MEDICINES, PHARMACIES } from "../lib/data";

const PH = "x-demo-hash-not-a-real-password";

/** Deterministic seed for the MedRelay demo — safe to re-run (wipes & re-inserts). */
async function main() {
  console.log("Seeding MedRelay demo data…");

  // wipe in FK-safe order
  await db.delete(notifications);
  await db.delete(payments);
  await db.delete(orderEvents);
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(prescriptions);
  await db.delete(addresses);
  await db.delete(inventory);
  await db.delete(deliveryPartners);
  await db.delete(medicines);
  await db.delete(pharmacies);
  await db.delete(users);

  // users: admin, 8 customers, 3 pharmacy owners, 3 riders
  const insertedUsers = await db
    .insert(users)
    .values([
      { name: "Platform Admin", email: "admin@medrelay.in", phone: "+91 90000 00001", passwordHash: PH, role: "admin" },
      { name: "Ananya Sharma", email: "ananya.sharma@example.com", phone: "+91 99880 12345", passwordHash: PH, role: "customer" },
      { name: "Vikram Iyer", email: "vikram.iyer@example.com", phone: "+91 99880 22222", passwordHash: PH, role: "customer" },
      { name: "Meera Pillai", email: "meera.pillai@example.com", phone: "+91 99880 33333", passwordHash: PH, role: "customer" },
      { name: "Rohan Gupta", email: "rohan.gupta@example.com", phone: "+91 99880 44444", passwordHash: PH, role: "customer" },
      { name: "Sana Sheikh", email: "sana.sheikh@example.com", phone: "+91 99880 55555", passwordHash: PH, role: "customer" },
      { name: "Dev Patel", email: "dev.patel@example.com", phone: "+91 99880 66666", passwordHash: PH, role: "customer" },
      { name: "Kabir Shah", email: "kabir.shah@example.com", phone: "+91 99880 77777", passwordHash: PH, role: "customer" },
      { name: "Ishita Rao", email: "ishita.rao@example.com", phone: "+91 99880 88888", passwordHash: PH, role: "customer" },
      { name: "Nikhil Anand", email: "nikhil.anand@example.com", phone: "+91 99880 99999", passwordHash: PH, role: "customer" },
      { name: "Ramesh Khanna", email: "owner@novamed.in", phone: "+91 98450 12231", passwordHash: PH, role: "pharmacy" },
      { name: "Latha Menon", email: "owner@citycare.in", phone: "+91 98450 88712", passwordHash: PH, role: "pharmacy" },
      { name: "Suresh Bhat", email: "owner@wellnest.in", phone: "+91 98450 33490", passwordHash: PH, role: "pharmacy" },
      { name: "Arjun Kumar", email: "arjun.kumar@example.com", phone: "+91 97170 88231", passwordHash: PH, role: "rider" },
      { name: "Faraz Ahmed", email: "faraz.ahmed@example.com", phone: "+91 97170 11223", passwordHash: PH, role: "rider" },
      { name: "Deepak Yadav", email: "deepak.yadav@example.com", phone: "+91 97170 44556", passwordHash: PH, role: "rider" },
    ])
    .returning({ id: users.id, role: users.role });

  const owners = insertedUsers.filter((u) => u.role === "pharmacy");
  const riders = insertedUsers.filter((u) => u.role === "rider");
  const customers = insertedUsers.filter((u) => u.role === "customer");

  const insertedPharmacies = await db
    .insert(pharmacies)
    .values(
      PHARMACIES.map((p, i) => ({
        ownerId: owners[i % owners.length].id,
        name: p.name,
        licenseNo: p.licenseNo,
        area: p.area,
        address: p.address,
        rating: String(p.rating),
        openNow: p.openNow,
        verified: true,
      })),
    )
    .returning({ id: pharmacies.id });

  const insertedMeds = await db
    .insert(medicines)
    .values(
      MEDICINES.map((m) => ({
        name: m.name,
        generic: m.generic,
        form: m.form,
        strength: m.strength,
        manufacturer: m.manufacturer,
        packSize: m.packSize,
        requiresPrescription: m.requiresPrescription,
        categoryId: m.categoryId,
      })),
    )
    .returning({ id: medicines.id });

  // inventory from mock stock (mock 'p1'..'p6' map to inserted pharmacy ids in order)
  const invRows: (typeof inventory.$inferInsert)[] = [];
  MEDICINES.forEach((m, mi) => {
    m.stock.forEach((s) => {
      const phIdx = PHARMACIES.findIndex((p) => p.id === s.pharmacyId);
      if (phIdx >= 0) {
        invRows.push({
          pharmacyId: insertedPharmacies[phIdx].id,
          medicineId: insertedMeds[mi].id,
          qty: s.qty,
          price: m.price,
        });
      }
    });
  });
  await db.insert(inventory).values(invRows);

  const partners = await db
    .insert(deliveryPartners)
    .values(riders.map((r, i) => ({ userId: r.id, vehicleNo: `KA-05-JD-22${30 + i}`, rating: "4.9" })))
    .returning({ id: deliveryPartners.id });

  const addr = await db
    .insert(addresses)
    .values({
      userId: customers[0].id,
      label: "Home",
      line: "Flat 402, Lakeview Residency, 5th Cross, HSR Layout, Bengaluru 560102",
    })
    .returning({ id: addresses.id });

  const rx = await db
    .insert(prescriptions)
    .values({
      customerId: customers[0].id,
      pharmacyId: insertedPharmacies[0].id,
      status: "verified",
      extracted: [
        { name: "Metformin", strength: "500 mg", dose: "1-0-1 · 30 days", confidence: 98 },
        { name: "Atorvastatin", strength: "10 mg", dose: "0-0-1 · 30 days", confidence: 96 },
      ],
      verifiedBy: "Ph. Rohit Shetty",
    })
    .returning({ id: prescriptions.id });

  const orderRows = await db
    .insert(orders)
    .values([
      { code: "MR-90412", customerId: customers[0].id, pharmacyId: insertedPharmacies[0].id, riderId: partners[0].id, addressId: addr[0].id, status: "picked_up", total: 227, fee: 19, otp: "4826" },
      { code: "MR-90388", customerId: customers[4].id, pharmacyId: insertedPharmacies[0].id, riderId: partners[1].id, addressId: addr[0].id, status: "out_for_delivery", total: 184, fee: 19, otp: "7712" },
      { code: "MR-90371", customerId: customers[5].id, pharmacyId: insertedPharmacies[1].id, riderId: partners[2].id, addressId: addr[0].id, status: "delivered", total: 71, fee: 0, otp: "3305", rxId: rx[0].id },
    ])
    .returning({ id: orders.id });

  await db.insert(orderItems).values([
    { orderId: orderRows[0].id, medicineId: insertedMeds[0].id, qty: 2, price: 64 },
    { orderId: orderRows[0].id, medicineId: insertedMeds[10].id, qty: 1, price: 118 },
    { orderId: orderRows[0].id, medicineId: insertedMeds[2].id, qty: 1, price: 26 },
    { orderId: orderRows[1].id, medicineId: insertedMeds[15].id, qty: 1, price: 165 },
    { orderId: orderRows[2].id, medicineId: insertedMeds[2].id, qty: 2, price: 52 },
  ]);

  const flows: [number, ("placed" | "confirmed" | "prescription_verified" | "packed" | "picked_up" | "out_for_delivery" | "delivered")[]][] = [
    [orderRows[0].id, ["placed", "confirmed", "prescription_verified", "packed", "picked_up"]],
    [orderRows[1].id, ["placed", "confirmed", "packed", "picked_up", "out_for_delivery"]],
    [orderRows[2].id, ["placed", "confirmed", "prescription_verified", "packed", "picked_up", "out_for_delivery", "delivered"]],
  ];
  for (const [orderId, statuses] of flows) {
    await db.insert(orderEvents).values(statuses.map((status) => ({ orderId, status })));
  }

  await db.insert(payments).values([
    { orderId: orderRows[0].id, method: "upi", status: "paid", amount: 227 },
    { orderId: orderRows[1].id, method: "card", status: "paid", amount: 184 },
    { orderId: orderRows[2].id, method: "upi", status: "paid", amount: 71 },
  ]);

  await db.insert(notifications).values([
    { userId: customers[0].id, title: "Order picked up", body: "Arjun picked up MR-90412 from NovaMed Pharmacy." },
    { userId: owners[0].id, title: "New order received", body: "MR-90412 · 3 items · ₹227" },
  ]);

  console.log("Seed complete ✔");
  console.log(`  users=${insertedUsers.length} pharmacies=${insertedPharmacies.length} medicines=${insertedMeds.length} inventory=${invRows.length} orders=${orderRows.length}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
