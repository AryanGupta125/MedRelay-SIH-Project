import type { Medicine } from "./data";

/** Medicine objects are already plain data — this just makes intent explicit when crossing the server/client boundary. */
export function serializeMedicine(m: Medicine): Medicine {
  return { ...m, stock: m.stock.map((s) => ({ ...s })) };
}
