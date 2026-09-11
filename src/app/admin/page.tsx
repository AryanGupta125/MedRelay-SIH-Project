import type { Metadata } from "next";
import { sql } from "drizzle-orm";
import { AdminView } from "@/components/AdminView";

export const metadata: Metadata = {
  title: "Admin Console — MedRelay",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

interface LiveStats {
  customers: number;
  pharmacies: number;
  partners: number;
  orders: number;
  revenue: number;
}

async function getLiveStats(): Promise<LiveStats | null> {
  try {
    const { db } = await import("@/db");
    const result = await db.execute(sql`
      select
        (select count(*) from users where role = 'customer')::int as customers,
        (select count(*) from pharmacies where verified = true)::int as pharmacies,
        (select count(*) from delivery_partners where active = true)::int as partners,
        (select count(*) from orders)::int as orders,
        (select coalesce(sum(total), 0) from orders where status != 'cancelled')::int as revenue
    `);
    const row = (result.rows?.[0] ?? null) as unknown as LiveStats | null;
    if (!row || row.customers === 0) return null;
    return row;
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  const live = await getLiveStats();
  return <AdminView live={live} />;
}
