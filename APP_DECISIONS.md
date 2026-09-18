# ⚡ RigForge Architecture & Engineering Decisions (APP_DECISIONS.md)

## 1. Store Concept & Overview
**RigForge** is an enthusiast custom PC hardware and configured systems storefront designed to eliminate hardware compatibility guesswork for PC builders, AI developers, 3D creators, and esports gamers.

### Core Merchant & Customer Problem:
PC hardware purchasing suffers from high return rates and customer frustration due to:
1. **Socket Mismatches** (e.g. AM5 CPU paired with LGA1700 motherboard).
2. **Power Envelope Deficits** (transient power spikes tripping underpowered PSUs).
3. **Chassis & Thermal Clearances** (GPU length exceeding case clearance).

RigForge solves this at both ends:
- **On the Storefront:** With a real-time 7-step PC Builder & Compatibility Guardrail Engine embedded in the Shopify Theme.
- **In Shopify Admin:** With an embedded merchant command hub providing automated build risk scoring, inventory threshold alerts, interactive compatibility matrix editing, and one-click order fulfillment with automatic stock deduction.

---

## 2. Shopify Theme Decisions (Part 1)
- **Liquid + Vanilla CSS + Minimal JS:** Built without heavy external frontend framework runtime dependencies in the storefront to maintain high Lighthouse performance and rapid page load times.
- **Dynamic Guardrails in Liquid & Web Component JS:** The PC Builder calculates `(CPU_Watts + GPU_Watts + 75W) * 1.25` in real time, dynamically checks socket compatibility, and dispatches multi-item bundles to Shopify's Cart AJAX API (`/cart/add.js`) with custom line-item properties (`_bundle_id`, `_category`, `_estimated_draw`).
- **Aesthetics & Branding:** High-contrast dark industrial theme (`#111211`), amber telemetry accents (`#d89755`), technical monospace readouts, and kinetic animated gyroscope machine cores.

---

## 3. Embedded App & Database Architecture (Part 2)

### Backend & Database (Implemented Node.js + Express + Drizzle ORM + MySQL):
The backend is fully implemented with **Express** REST API endpoints and **Drizzle ORM** across 5 core relational tables (`server/src/db/schema.ts`):

```sql
-- 1. Merchant Stores (Multi-tenant Shopify installations)
CREATE TABLE stores (
  id VARCHAR(64) PRIMARY KEY,
  shop_domain VARCHAR(255) NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Hardware Catalog
CREATE TABLE components (
  id VARCHAR(64) PRIMARY KEY,
  store_id VARCHAR(64) REFERENCES stores(id),
  sku VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category ENUM('CPU', 'Motherboard', 'GPU', 'RAM', 'Cooler', 'Case', 'PSU', 'Display') NOT NULL,
  socket VARCHAR(32),
  watts INT,
  length_mm INT,
  max_gpu_length INT,
  price INT NOT NULL, -- stored in USD / cents
  stock_quantity INT DEFAULT 0,
  low_stock_threshold INT DEFAULT 5,
  status ENUM('ACTIVE', 'ARCHIVED', 'OUT_OF_STOCK') DEFAULT 'ACTIVE',
  image TEXT,
  tags TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Compatibility Rules Engine
CREATE TABLE compatibility_rules (
  id VARCHAR(64) PRIMARY KEY,
  store_id VARCHAR(64) REFERENCES stores(id),
  name VARCHAR(255) NOT NULL,
  source_category ENUM('CPU', 'Motherboard', 'GPU', 'RAM', 'Cooler', 'Case', 'PSU', 'Display') NOT NULL,
  target_category ENUM('CPU', 'Motherboard', 'GPU', 'RAM', 'Cooler', 'Case', 'PSU', 'Display') NOT NULL,
  rule_type ENUM('SOCKET_MATCH', 'POWER_ENVELOPE', 'CLEARANCE_LENGTH', 'FORM_FACTOR') NOT NULL,
  severity ENUM('BLOCKING', 'WARNING') DEFAULT 'BLOCKING',
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Custom System Builds (Orders / Quotes)
CREATE TABLE custom_builds (
  id VARCHAR(64) PRIMARY KEY,
  store_id VARCHAR(64) REFERENCES stores(id),
  order_number VARCHAR(64) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  profile ENUM('CREATOR', 'AI DEV', 'ESPORTS', 'CUSTOM') DEFAULT 'CUSTOM',
  items_json TEXT NOT NULL,
  total_watts INT NOT NULL,
  recommended_psu INT NOT NULL,
  total_price INT NOT NULL,
  risk_score ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'LOW',
  status ENUM('PENDING_VERIFICATION', 'APPROVED', 'IN_ASSEMBLY', 'COMPLETED', 'DISPATCHED') DEFAULT 'PENDING_VERIFICATION',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Activity & Audit Logs
CREATE TABLE activity_logs (
  id VARCHAR(64) PRIMARY KEY,
  store_id VARCHAR(64) REFERENCES stores(id),
  action_type ENUM('STOCK_RESTOCK', 'RULE_CREATED', 'RULE_TOGGLED', 'BUILD_VERIFIED', 'BUILD_DISPATCHED', 'COMPONENT_ADDED', 'PRICE_UPDATED') NOT NULL,
  entity_type ENUM('COMPONENT', 'RULE', 'BUILD', 'SYSTEM') NOT NULL,
  description TEXT NOT NULL,
  performed_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Key Implemented Features

1. **Dynamic Power Envelope & Transient Spike Engine:** Calculates real-time system draw `((CPU + GPU + 75W) * 1.25)` and enforces power supply safety margins against selected PSUs.
2. **Socket Verification Guardrail:** Prevents invalid combinations (e.g. AM5 CPUs paired with LGA1700 motherboards) with inline warnings and blocking alerts.
3. **Automated Risk Scoring & Fulfillment:** Evaluates custom builds, flags high-risk configurations for merchant inspection, and automatically deducts stock inventory upon build dispatch (`fulfillAndDeductStock`).
4. **Dual-Mode Resilient API Layer:** The React embedded app communicates via REST endpoints (`http://localhost:3001/api`), with automatic transparent fallback to local storage sync if the backend database is unreachable.

---

## 5. Tradeoffs & Future Roadmap

### Technical Tradeoffs:
- **Resiliency Dual-Mode API:** Using a dual-mode API layer in `app-frontend/src/services/api.ts` allows immediate frontend exploration without requiring a running database server, while maintaining 100% contract compliance with Drizzle ORM.
- **Liquid Theme Bundling:** Utilizing line-item properties (`_bundle_id`, `_estimated_draw`) via Shopify Cart AJAX API instead of creating complex draft orders guarantees instant cart insertion speed without roundtrip server delays.

### Future Roadmap / Improvements with More Time:
- **3D WebGL / Three.js Chassis Preview:** Interactive 3D visual component fitting in the PC Builder section.
- **Shopify Webhook Subscriptions:** Real-time webhooks for `orders/create` and `inventory_levels/update` for automated multi-channel stock sync.
- **Automated Purchase Order Generation:** Auto-drafting vendor re-stock purchase orders when components dip below `low_stock_threshold`.

