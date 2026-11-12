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
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) (Deployed on [Neon](https://neon.tech/) Serverless Cloud) + [Drizzle ORM](https://orm.drizzle.team/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons & Visuals**: [Lucide React](https://lucide.dev/)
- **Database Migrations & Tools**: `drizzle-kit`, `tsx`

---

## 📂 Project Structure

```text
medrelay/
├── src/
│   ├── app/                      # Next.js App Router Pages & API Routes
│   │   ├── admin/                # Admin Panel Dashboard
│   │   ├── api/                  # Backend REST API routes (geocode, health)
│   │   ├── auth/                 # Login & Registration pages
│   │   ├── cart/                 # Cart view & management
│   │   ├── checkout/             # Payment & Checkout workflow
│   │   ├── dashboard/            # Role-specific dashboard router
│   │   ├── medicines/            # Medicine Explorer & Detail views
│   │   ├── partner/              # Pharmacy & Rider portal views
│   │   ├── pharmacies/           # Pharmacy listing & detail views
│   │   ├── prescription/         # Prescription upload & OCR verification
│   │   ├── support/              # Customer support & Help Center
│   │   ├── track/                # Real-time Order Live GPS Tracking
│   │   ├── globals.css           # Global Tailwind CSS styles
│   │   ├── layout.tsx            # Root Layout
│   │   └── page.tsx              # Homepage / Landing page
│   ├── components/               # Reusable React UI components
│   │   ├── AdminView.tsx         # Admin Dashboard Component
│   │   ├── AvailabilityList.tsx  # Pharmacy inventory breakdown
│   │   ├── MedicinesExplorer.tsx # Medicine filter/search component
│   │   ├── MobileNav.tsx         # Mobile bottom navigation bar
│   │   ├── Navbar.tsx            # Desktop navigation header
│   │   ├── TrackingMap.tsx       # Live delivery tracking map
│   │   └── ...                   # Cards, modals, charts, and UI atoms
│   ├── db/                       # Database setup & schema definitions
│   │   ├── schema.ts             # Drizzle PostgreSQL Schema & Enums
│   │   ├── index.ts              # Drizzle DB client instance (Neon PostgreSQL)
│   │   └── seed.ts               # Sample database seeder
│   └── lib/                      # Utilities, helpers & global state
│       ├── data.ts               # Demo catalog & static mock data
│       ├── store.ts              # Global Zustand state store
│       └── utils.ts              # Styling & format utilities
├── .env.example                  # Environment variable template for contributors
├── .gitignore                    # Excludes sensitive files (.env.local, node_modules)
├── drizzle.config.ts             # Dynamic Drizzle Kit configuration (reads .env.local)
├── drizzle.config.json           # Drizzle Kit migration schema config
├── next.config.ts                # Next.js configuration
├── package.json                  # Scripts & project dependencies
├── run_project.bat               # 1-Click local launch script for Windows
└── tsconfig.json                 # TypeScript compiler configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.x or v20+ recommended)
- **npm** (comes with Node.js)

> [!NOTE]
> **Database Infrastructure:** MedRelay is backed by a serverless **PostgreSQL** database deployed on **[Neon](https://neon.tech/)**. Database connection strings are loaded securely via `.env.local` through `process.env.DATABASE_URL`, ensuring all database credentials remain strictly isolated from public source code.

---

### ⚡ Quick Start

MedRelay includes an automated launcher script (**`run_project.bat`**) that streamlines environment configuration, dependency checks, and dev server boot into a single action on Windows, while full manual terminal support is available for macOS and Linux.

---

#### 🚀 Method 1: Automated 1-Click Launch (`run_project.bat` — Recommended for Windows)

Double-click **`run_project.bat`** in the root directory. The script executes the following automated pipeline:

```text
[Step 1: Config Check]    ──> Auto-creates .env.local from .env.example if missing
[Step 2: Dependencies]    ──> Runs "npm install" automatically if node_modules is missing
[Step 3: Server Startup]   ──> Boots Next.js Dev Server (Turbopack) on http://localhost:3000
```

Depending on whether you have an existing database configuration, the launcher handles the two following cases:

##### 🟢 Case 1: Database Already Configured (`.env.local` exists)
- **When to expect this**: If `.env.local` is already present with an active Neon PostgreSQL connection string (`DATABASE_URL`).
- **What happens**: The launcher detects your existing credentials, checks dependencies, and immediately boots the server.
- **Result**: The app launches at [http://localhost:3000](http://localhost:3000) fully connected to the live database — medicine catalogs, real-time pharmacy inventory, prescription verification workflows, and order tracking are active immediately.

##### 🟡 Case 2: Fresh Clone / First-Time Setup (`.env.local` is missing)
- **When to expect this**: When cloning the repository fresh from GitHub, since `.env.local` is strictly ignored by Git to keep passwords secure.
- **What happens**:
  1. The script automatically detects that `.env.local` is missing and copies `.env.example` to create a new `.env.local` for you.
  2. It installs any missing `node_modules` and launches the application server.
- **Connecting your Database**:
  - Open the newly generated `.env.local` file in any text editor.
  - Set your `DATABASE_URL` with your Neon PostgreSQL connection string:
    ```env
    DATABASE_URL=postgresql://<user>:<password>@<host>.neon.tech/neondb?sslmode=require
    ```
  - *(Optional)* If connecting to a fresh database, generate the schema and seed sample demo data:
    ```bash
    npx drizzle-kit push
    npx tsx src/db/seed.ts
    ```

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
