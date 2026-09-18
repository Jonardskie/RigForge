# ⚡ RigForge — Custom PC Builder & Merchant Command Hub

RigForge is a production-grade custom PC hardware configurator storefront and embedded merchant admin app designed to eliminate hardware compatibility guesswork for PC builders, gamers, AI developers, and creators.

---

## 🏗️ Architecture Overview

The repository is structured into two core parts:

```
RigForge/
├── theme/                      # Part 1: Production-Ready Shopify Theme (Liquid + CSS + Web Components)
│   ├── assets/                 # Custom styles, transparent hardware photography, JS guardrails
│   ├── config/                 # settings_schema.json & settings_data.json
│   ├── layout/                 # theme.liquid (Main layout wrapper)
│   ├── locales/                # en.default.json (Localization strings)
│   ├── sections/               # 10 Custom Shopify Sections (rig-builder, hero-machine, header, footer, etc.)
│   └── templates/              # JSON Templates (index, product, collection, cart, 404)
│
├── app-frontend/               # Part 2: Embedded Shopify Merchant App UI (Vite + React + TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/         # Dashboard, ComponentManager, CompatibilityMatrix, ActivityFeed, InventoryAuditor
│   │   ├── services/           # Dual-mode API Client (Express REST API with LocalStorage fallback)
│   │   ├── styles/             # Tailwind CSS & App Bridge custom styles
│   │   └── types/              # Full TypeScript contracts matching Drizzle ORM schema
│   └── public/images/          # 21 transparent hardware photo assets
│
├── server/                     # Part 2: Backend REST API Server (Node.js + Express + Drizzle ORM + MySQL)
│   ├── drizzle/                # Auto-generated SQL migration files (0000_lonely_toxin.sql)
│   ├── src/
│   │   ├── db/                 # schema.ts (5 relational tables), seed.ts, migrate.ts, index.ts
│   │   └── server.ts           # Express REST API endpoints (/api/metrics, /api/components, /api/rules, /api/builds, etc.)
│   └── drizzle.config.ts       # Drizzle Kit CLI configuration
│
├── APP_DECISIONS.md            # In-depth architectural tradeoffs, design decisions & schema specs
└── AGENTS.md                   # Repository agent guidelines and rules
```

---

## 🚀 Quick Start Guide

### Option A: Unified Startup (Root Workspace)

Run all services simultaneously from the project root using `concurrently`:

```bash
# 1. Install root dependencies
npm install

# 2. Launch App Frontend (5173), Backend API Server (3001), and Shopify Theme CLI concurrently
npm run dev

# 3. Or launch App Frontend and Backend Server only (without Shopify CLI)
npm run dev:local
```

---

### Option B: Individual Service Startup

#### **1. App Frontend (React + Vite):**
```bash
cd app-frontend
npm install
npm run dev
```
👉 Accessible at `http://localhost:5173`

#### **2. Backend Server (Node.js + Express + Drizzle ORM):**
```bash
cd server
npm install
npm run dev
```
👉 REST API listening at `http://localhost:3001`

#### **3. Shopify Storefront Theme CLI:**
```bash
cd theme
# preview theme live connected to your store:
npm run theme:dev
```

---

## 🗄️ Database Setup (Drizzle ORM + MySQL / SQLite)

The backend is powered by **Drizzle ORM** across 5 fully typed relational tables:
1. `stores` — Multi-tenant merchant store registry & access tokens.
2. `components` — Hardware catalog with socket, wattage, physical dimensions, pricing, and stock thresholds.
3. `compatibility_rules` — Merchant-managed compatibility matrix (Socket Alignment, Power Envelopes, Physical Clearances).
4. `custom_builds` — Customer builds and quote manifests with automated risk scoring (`LOW`, `MEDIUM`, `HIGH`) and auto-stock deduction.
5. `activity_logs` — Immutable audit trail of merchant actions, rule triggers, and fulfillment events.

### Database CLI Commands:
```bash
cd server

# 1. Generate SQL migration files from Drizzle schema
npm run db:generate

# 2. Run schema migrations against MySQL
npm run db:migrate

# 3. Seed database with 21 hardware components, compatibility rules, builds & logs
npm run db:seed

# 4. Open Drizzle Studio visual database inspector
npm run db:studio
```

*Note: The frontend API service operates in a high-resiliency dual mode. If the Express REST server or database is offline, it seamlessly falls back to synchronized local storage so you can evaluate the full app UI without interruption.*

---

## 🎨 Shopify Theme (Part 1)

The theme in `theme/` is 100% compliant with Shopify Theme Store guidelines:
- **Zero Heavy Framework Footprint:** Native Liquid, modern Vanilla CSS, and lightweight Web Components.
- **Standout Interactive Feature:** Real-Time 7-Step PC Builder with dynamic wattage calculations `((CPU + GPU + 75W) * 1.25)`, socket compatibility verification, and direct-to-cart multi-item line bundling (`/cart/add.js`).
- **10 Custom Sections with Configurable Schemas:**
  - `rig-builder.liquid` (7-step PC Configurator & wattage guardrail engine)
  - `hero-machine.liquid` (Kinetic gyroscope core animation & CTA)
  - `performance-profiles.liquid` (Preset builds: Creator, AI Dev, Esports)
  - `featured-components.liquid` (Hardware showcase with live stock badges)
  - `performance-workbench.liquid` (Benchmarking telemetries)
  - `main-collection.liquid` (Category filtering & sorting)
  - `main-product.liquid` (Technical specifications table & variant selectors)
  - `main-cart.liquid` (Live bundle manifest & wattage breakdown)
  - `header.liquid` & `footer.liquid` (Branded navigation and footer controls)

### Theme Deployment Commands:
```bash
# Push theme files to store (requires Shopify CLI login)
npm run theme:push

# Pull theme updates from store
npm run theme:pull

# Lint & validate theme files
npm run theme:check
```

---

## 📋 Architectural Decisions & Deliverables
For an in-depth breakdown of technical trade-offs, schema definitions, and design philosophy, please review [APP_DECISIONS.md](APP_DECISIONS.md).

