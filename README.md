# 🏥 MedRelay — Hyperlocal Medicine Delivery Ecosystem

> An end-to-end, ultra-fast hyperlocal pharmacy discovery, prescription verification, and medicine delivery platform built with **Next.js 16 App Router**, **TypeScript**, **Tailwind CSS**, **Drizzle ORM**, and **PostgreSQL**.

---

## 🌟 Key Features

### 🔍 Hyperlocal Search & Medicine Discovery
- **Real-Time Availability**: Search medicines by brand, generic name, category, or manufacturer and view local inventory across nearby verified pharmacies.
- **Smart Substitutes**: Automatic suggestions for bioequivalent generic medicines when brand stock is low.
- **Interactive Maps & Radius Filtering**: Locate registered partner pharmacies in your vicinity.

### 📋 AI/OCR Prescription Verification
- **Prescription Upload**: Direct upload portal for paper/digital prescriptions.
- **OCR Data Extraction**: Automatically extracts medicine names, dosages, and quantities from uploaded images for rapid verification.
- **Pharmacist Audit Workflow**: Verification interface for licensed pharmacists to approve or request changes before order fulfillment.

### 🚚 Real-Time Order Tracking & Logistics
- **Live GPS Tracking**: Real-time status updates and delivery map tracking from pickup to doorstep.
- **OTP Verification**: Secure delivery completion using one-time passwords generated per order.
- **Order Lifecycle Events**: Full audit trail of order events (`placed` ➔ `prescription_verified` ➔ `packed` ➔ `picked_up` ➔ `out_for_delivery` ➔ `delivered`).

### 👥 Role-Based Dashboards
- **Customer Portal**: Browse medicines, manage cart, track active orders, upload prescriptions, and view order history.
- **Pharmacy Dashboard**: Manage local inventory, process incoming orders, verify prescriptions, and track daily revenue.
- **Delivery Partner (Rider) View**: Accept assigned deliveries, view optimal navigation routes, and verify customer OTPs upon arrival.
- **Admin Control Panel**: Platform-wide metrics, pharmacy onboarding/licensing verification, platform user management, and operational analytics.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router with Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) + [Drizzle ORM](https://orm.drizzle.team/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons & Visuals**: [Lucide React](https://lucide.dev/)
- **Database Migrations & Tools**: `drizzle-kit`, `tsx`

---

## 📂 Project Structure

```text
hyperlocal-medicine-delivery-ecosystem/
├── src/
│   ├── app/                      # Next.js App Router Pages & API Routes
│   │   ├── admin/                # Admin Panel Dashboard
│   │   ├── api/                  # Backend REST API routes
│   │   ├── auth/                 # Login & Registration pages
│   │   ├── cart/                 # Cart view & management
│   │   ├── checkout/             # Payment & Checkout workflow
│   │   ├── dashboard/            # Role-specific dashboard router
│   │   ├── medicines/            # Medicine Explorer & Detail views
│   │   ├── partner/              # Pharmacy & Rider portal views
│   │   ├── pharmacies/           # Pharmacy listing & detail views
│   │   ├── prescription/         # Upload & OCR Verification page
│   │   ├── support/              # Customer support & Help Center
│   │   ├── track/                # Real-time Order Live Tracking
│   │   ├── globals.css           # Global Tailwind CSS styles
│   │   ├── layout.tsx            # Root Layout
│   │   └── page.tsx              # Homepage / Landing page
│   ├── components/               # Reusable React components
│   │   ├── AdminView.tsx         # Admin Dashboard Component
│   │   ├── AvailabilityList.tsx  # Pharmacy inventory breakdown
│   │   ├── MedicinesExplorer.tsx # Medicine filter/search component
│   │   ├── Navbar.tsx            # Navigation Header
│   │   ├── TrackingMap.tsx       # Live Map tracker component
│   │   └── ...                   # UI components, modals, charts
│   ├── db/                       # Database setup & schema definitions
│   │   ├── schema.ts             # Drizzle PostgreSQL Schema & Enums
│   │   ├── index.ts              # Drizzle DB client instance
│   │   └── seed.ts               # Sample database seeder
│   └── lib/                      # Utilities & Zustand stores
│       └── store.ts              # Global application state store
├── drizzle.config.json           # Drizzle Kit migration configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Scripts & project dependencies
└── tsconfig.json                 # TypeScript compiler configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.x or later recommended)
- **npm** or **yarn** / **pnpm**
- **PostgreSQL** database instance (Local PostgreSQL or hosted like Neon / Supabase)

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AryanGupta125/MedRelay-SIH-Project.git
   cd MedRelay-SIH-Project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and configure your PostgreSQL database connection:
   ```env
   DATABASE_URL=postgres://username:password@localhost:5432/medrelay_db
   ```

4. **Database Setup & Seeding**:
   Push the schema to your PostgreSQL database and run the seeder:
   ```bash
   # Push schema to database
   npx drizzle-kit push

   # Seed initial sample data (medicines, pharmacies, test users)
   npx tsx src/db/seed.ts
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```

6. **Open application**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack |
| `npm run build` | Builds the production bundle |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Runs ESLint checks across the project |
| `npm run typecheck` | Validates TypeScript types without emitting output |

---

## 🗄️ Database Schema Summary

| Table | Purpose |
| :--- | :--- |
| `users` | Stores accounts for Customers, Pharmacies, Delivery Riders, and Admins |
| `pharmacies` | Registered pharmacy details, location (lat/lng), license no, ratings |
| `medicines` | Catalog of medicines, generics, pack size, prescription flags |
| `inventory` | Stock quantity and pricing per medicine per pharmacy |
| `prescriptions` | Uploaded rx image URLs, OCR extraction payload, verification status |
| `orders` | Order records, assigned rider, OTP code, status tracking |
| `order_items` | Individual line items per order |
| `delivery_partners` | Rider vehicle info, ratings, active status |
| `payments` | UPI/Card/COD payment transactions and status |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an **Issue** or submit a **Pull Request**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AwesomeFeature`)
3. Commit your Changes (`git commit -m 'Add some AwesomeFeature'`)
4. Push to the Branch (`git push origin feature/AwesomeFeature`)
5. Open a Pull Request

---
