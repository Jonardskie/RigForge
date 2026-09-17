# ⚡ RigForge — Custom PC Builder & Merchant Command Hub

RigForge is a production-grade custom PC hardware configurator storefront and embedded merchant admin app designed to eliminate hardware compatibility guesswork for PC builders, gamers, AI developers, and creators.

---

## 🏗️ Architecture Overview

The repository is structured into two core parts:

```
rig-forge-storefront-prd/
├── theme/                      # Part 1: Production-Ready Shopify Theme (Liquid + CSS)
│   ├── assets/                 # Custom styles, transparent hardware photography, JS guardrails
│   ├── config/                 # settings_schema.json & settings_data.json
│   ├── layout/                 # theme.liquid
│   ├── locales/                # en.default.json
│   ├── sections/               # 8 Custom Shopify Sections (PC Builder, Hero, Collection, etc.)
│   └── templates/              # JSON Templates (index, product, collection, cart, 404)
│
├── app-frontend/               # Part 2: Embedded Shopify Merchant App (Vite + React + TypeScript)
│   ├── src/
│   │   ├── components/         # Dashboard, ComponentManager, CompatibilityMatrix, ActivityFeed
│   │   ├── services/           # Dual-mode API Client (REST API + LocalStorage fallback)
│   │   └── types/              # Full TypeScript contracts matching Drizzle schema
│   └── public/images/          # 21 transparent hardware photo assets
│
├── server/                     # Part 2: Node.js Backend API (Express + Drizzle ORM + MySQL)
│   ├── src/
│   │   ├── db/                 # schema.ts (5 relational MySQL tables), seed.ts, migrate.ts
│   │   └── server.ts           # Express REST API (/api/metrics, /api/components, /api/rules, etc.)
│   └── drizzle.config.ts       # Drizzle Kit CLI configuration
│
├── app/                        # Next.js Prototype Storefront (Live interactive local simulation)
└── APP_DECISIONS.md            # In-depth architectural tradeoffs, design decisions & schema specs
```

---

## 🚀 Quick Start Guide

### 1. Running the Shopify Embedded Merchant App (Part 2)

#### **Frontend (React + Vite):**
```bash
cd app-frontend
npm install
npm run dev
```
👉 Accessible at `http://localhost:5173`

#### **Backend Server (Node.js + Express + Drizzle ORM):**
```bash
cd server
npm install
npm run dev
```
👉 REST API listening on `http://localhost:3001`

---

## 🗄️ Database Setup (Drizzle ORM + MySQL)

The backend is built with **Drizzle ORM** targeting **MySQL** across 5 relational tables:
1. `stores` — Multi-tenant merchant store registry & access tokens.
2. `components` — Hardware catalog with socket, wattage, dimensions, pricing, and live inventory thresholds.
3. `compatibility_rules` — Merchant-managed compatibility matrix (Socket Alignment, Power Envelopes, Physical Clearances).
4. `custom_builds` — Customer builds and quote manifests with automated risk scoring (`LOW`, `MEDIUM`, `HIGH`).
5. `activity_logs` — Immutable audit trail of merchant actions and automated rule triggers.

### Database Commands:
```bash
cd server

# 1. Generate SQL migration files from Drizzle schema
npm run db:generate

# 2. Run schema migrations against MySQL
npm run db:migrate

# 3. Seed database with 21 components, compatibility rules, and builds
npm run db:seed

# 4. Open Drizzle Studio visual database inspector
npm run db:studio
```

*Note: If no local MySQL instance is active, the backend automatically operates in high-resiliency in-memory mode so you can evaluate the entire application immediately without friction.*

---

## 🎨 Shopify Theme (Part 1)

The theme in `theme/` is 100% compliant with Shopify Theme Store guidelines:
- **Zero Heavy Framework Footprint:** Fast rendering using native Liquid, modern Vanilla CSS, and lightweight vanilla Web Components.
- **Standout Interactive Feature:** Real-Time 7-Step PC Builder with dynamic wattage calculations `((CPU + GPU + 75W) * 1.25)`, socket compatibility verification, and direct-to-cart multi-item line bundling (`/cart/add.js`).
- **8 Custom Sections with Configurable Schemas:**
  - `rig-builder.liquid` (Configurable wattage headroom, accent colors, step navigation)
  - `hero-machine.liquid` (Kinetic gyroscope core animation, quick CTA)
  - `performance-profiles.liquid` (Preset builds: Creator, AI Dev, Esports)
  - `featured-components.liquid` (Hardware showcase with live stock badges)
  - `performance-workbench.liquid` (Benchmarking telemetries)
  - `main-collection.liquid` (Category filtering & sorting)
  - `main-product.liquid` (Technical specifications table & variant selectors)
  - `main-cart.liquid` (Live bundle manifest & wattage breakdown)

### Testing Theme on Shopify (`rigforge-zh662akf.myshopify.com`):
To preview or deploy directly to your Shopify store using the Shopify CLI:
```bash
# Live hot-reloading theme preview connected to your store:
npm run theme:dev
# (or: shopify theme dev --store rigforge-zh662akf.myshopify.com --path=theme)

# Push theme files to store:
npm run theme:push
```
Or zip the `theme/` directory and upload directly via **Shopify Admin > Online Store > Themes > Add Theme**.

---

## 🧪 Local Prototype Storefront
To test the interactive storefront experience locally outside Shopify:
```bash
npm install
npm run dev
```
👉 Available at `http://localhost:3000`

---

## 📋 Architectural Decisions & Deliverables
For an in-depth breakdown of technical trade-offs, schema definitions, and design philosophy, please review [APP_DECISIONS.md](file:///d:/rig-forge-storefront-prd/APP_DECISIONS.md).
