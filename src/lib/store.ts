"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { MEDICINES_MAP } from "./data";
import { orderId, otp as genOtp } from "./utils";

export interface CartItem {
  medicineId: string;
  qty: number;
}

export interface UploadedRx {
  id: string;
  fileName: string;
  uploadedAt: string;
  status: "processing" | "pending_verification" | "verified";
  meds: { name: string; strength: string; dose: string }[];
}

export interface PlacedOrder {
  id: string;
  items: { medicineId: string; qty: number; price: number }[];
  pharmacyId: string;
  address: string;
  total: number;
  fee: number;
  otp: string;
  eta: string;
  placedAt: string;
  rxId?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: "customer" | "pharmacy" | "rider" | "admin";
  phone?: string;
}

export interface LocationState {
  area: string;
  city: string;
  state: string; // e.g. "Maharashtra"
  isServiceable: boolean; // true if in Maharashtra, false if outside
  isSet: boolean; // true if user has selected/detected location, false for new users
  lat?: number;
  lng?: number;
}

interface AppState {
  location: LocationState;
  cart: CartItem[];
  pharmacyId: string | null; // null = auto-assign best pharmacy
  prescriptions: UploadedRx[];
  orders: PlacedOrder[];
  isLoggedIn: boolean;
  user: UserProfile | null;
  showLoginModal: boolean;
  pendingMedicineId: string | null;
  setLocation: (loc: Partial<LocationState> & { area: string; city: string }) => void;
  setShowLoginModal: (open: boolean) => void;
  login: (u?: Partial<UserProfile>) => void;
  logout: () => void;
  addToCart: (medicineId: string, qty?: number) => void;
  setQty: (medicineId: string, qty: number) => void;
  removeFromCart: (medicineId: string) => void;
  clearCart: () => void;
  setPharmacyId: (id: string | null) => void;
  addPrescription: (rx: UploadedRx) => void;
  setRxStatus: (id: string, status: UploadedRx["status"]) => void;
  placeOrder: (partial: { pharmacyId: string; address: string; total: number; fee: number; rxId?: string }) => PlacedOrder;
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      location: {
        area: "Select Location",
        city: "Live Location",
        state: "Current Location",
        isServiceable: true,
        isSet: false,
      },
      cart: [],
      pharmacyId: null,
      prescriptions: [],
      orders: [],
      isLoggedIn: false,
      user: null,
      showLoginModal: false,
      pendingMedicineId: null,

      setLocation: (loc) =>
        set((s) => {
          const nextState = loc.state ?? s.location.state ?? "Current Location";
          const isServiceable = loc.isServiceable ?? true;
          return {
            location: {
              ...s.location,
              ...loc,
              state: nextState,
              isServiceable,
              isSet: true,
            },
          };
        }),

      setShowLoginModal: (open) => set({ showLoginModal: open }),

      login: (u) => {
        const userObj: UserProfile = {
          name: u?.name || "Rahul Deshmukh",
          email: u?.email || "rahul@example.com",
          role: u?.role || "customer",
          phone: u?.phone || "+91 98220 12345",
        };
        const pendingId = get().pendingMedicineId;
        set({ isLoggedIn: true, user: userObj, showLoginModal: false, pendingMedicineId: null });

        // If there was a pending item user tried to add before logging in, add it now!
        if (pendingId) {
          get().addToCart(pendingId, 1);
        }
      },

      logout: () => set({ isLoggedIn: false, user: null, cart: [] }),

      addToCart: (medicineId, qty = 1) => {
        if (!get().isLoggedIn) {
          set({ showLoginModal: true, pendingMedicineId: medicineId });
          return;
        }
        set((s) => {
          const existing = s.cart.find((c) => c.medicineId === medicineId);
          if (existing) {
            return { cart: s.cart.map((c) => (c.medicineId === medicineId ? { ...c, qty: c.qty + qty } : c)) };
          }
          return { cart: [...s.cart, { medicineId, qty }] };
        });
      },

      setQty: (medicineId, qty) => {
        if (!get().isLoggedIn) {
          set({ showLoginModal: true, pendingMedicineId: medicineId });
          return;
        }
        set((s) => ({
          cart:
            qty <= 0
              ? s.cart.filter((c) => c.medicineId !== medicineId)
              : s.cart.map((c) => (c.medicineId === medicineId ? { ...c, qty } : c)),
        }));
      },

      removeFromCart: (medicineId) => set((s) => ({ cart: s.cart.filter((c) => c.medicineId !== medicineId) })),
      clearCart: () => set({ cart: [], pharmacyId: null }),
      setPharmacyId: (id) => set({ pharmacyId: id }),

      addPrescription: (rx) => set((s) => ({ prescriptions: [rx, ...s.prescriptions] })),

      setRxStatus: (id, status) =>
        set((s) => ({ prescriptions: s.prescriptions.map((r) => (r.id === id ? { ...r, status } : r)) })),

      placeOrder: ({ pharmacyId, address, total, fee, rxId }) => {
        const order: PlacedOrder = {
          id: orderId(),
          items: get().cart.map((c) => ({
            medicineId: c.medicineId,
            qty: c.qty,
            price: (MEDICINES_MAP.get(c.medicineId)?.price ?? 0) * c.qty,
          })),
          pharmacyId,
          address,
          total,
          fee,
          otp: genOtp(),
          eta: "18–25 min",
          placedAt: new Date().toLocaleString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            day: "numeric",
            month: "short",
          }),
          rxId,
        };
        set((s) => ({ orders: [order, ...s.orders], cart: [], pharmacyId: null }));
        return order;
      },
    }),
    {
      name: "medrelay-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function cartCount(cart: CartItem[]): number {
  return cart.reduce((n, c) => n + c.qty, 0);
}
