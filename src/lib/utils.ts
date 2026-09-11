export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function inr(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function discountPct(price: number, mrp: number): number {
  if (mrp <= price) return 0;
  return Math.round((1 - price / mrp) * 100);
}

export function plural(n: number, word: string, words?: string): string {
  return n === 1 ? `${n} ${word}` : `${n} ${words ?? word + "s"}`;
}

export function orderId(): string {
  return "MR-" + Math.floor(10000 + Math.random() * 89999);
}

export function otp(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}
