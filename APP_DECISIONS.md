# RigForge Architecture & Engineering Decisions (APP_DECISIONS.md)

## 1. Store Concept & Overview
**RigForge** is an enthusiast custom PC hardware and configured systems storefront designed to eliminate hardware compatibility guesswork for PC builders, AI developers, 3D creators, and esports gamers.

### Core Merchant & Customer Problem:
PC hardware purchasing suffers from high return rates and customer frustration due to:
1. **Socket Mismatches** (e.g. AM5 CPU paired with LGA1700 motherboard).
2. **Power Envelope Deficits** (transient power spikes tripping underpowered PSUs).
3. **Chassis & Thermal Clearances** (GPU length exceeding case clearance).

RigForge solves this at both ends:
- **On the Storefront:** With a real-time 7-step PC Builder & Compatibility Guardrail Engine.
- **On the Shopify Admin:** With an embedded merchant command hub providing automated build risk scoring, inventory threshold alerts, and dynamic rule simulation.

---

## 2. Part 1: Shopify Theme Decisions
- **Liquid + Vanilla CSS + Minimal JS:** Built without heavy external frontend framework runtime dependencies in the storefront to maintain high lighthouse performance and rapid page load.
- **Dynamic Guardrails in Liquid & Web Component JS:** The PC Builder calculates `(CPU_Watts + GPU_Watts + 75W) * 1.25` in real time, dynamically checks socket compatibility, and dispatches multi-item bundles to Shopify's Cart AJAX API (`/cart/add.js`) with custom line-item properties (`_bundle_id`, `_category`, `_estimated_draw`).
- **Aesthetics & Branding:** High-contrast dark industrial theme (`#111211`), amber telemetry accents (`#d89755`), technical monospace readouts, and kinetic animated gyroscope machine cores.

---

## 3. Part 2: Embedded App & Database Architecture

### Backend & Database (Planned Node.js + Drizzle ORM + MySQL Schema):
When connected to MySQL, the schema is structured with relational integrity across 5 core tables:

```sql
-- 1. Merchant Stores
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
  category ENUM('CPU', 'Motherboard', 'GPU', 'RAM', 'Cooler', 'Case', 'PSU') NOT NULL,
  socket VARCHAR(32),
  watts INT,
  length_mm INT,
  max_gpu_length INT,
  price INT NOT NULL,
  stock_quantity INT DEFAULT 0,
  low_stock_threshold INT DEFAULT 5,
  status ENUM('ACTIVE', 'ARCHIVED', 'OUT_OF_STOCK') DEFAULT 'ACTIVE',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Compatibility Rules Engine
CREATE TABLE compatibility_rules (
  id VARCHAR(64) PRIMARY KEY,
  store_id VARCHAR(64) REFERENCES stores(id),
  name VARCHAR(255) NOT NULL,
  source_category ENUM('CPU', 'Motherboard', 'GPU', 'RAM', 'Cooler', 'Case', 'PSU') NOT NULL,
  target_category ENUM('CPU', 'Motherboard', 'GPU', 'RAM', 'Cooler', 'Case', 'PSU') NOT NULL,
  rule_type ENUM('SOCKET_MATCH', 'POWER_ENVELOPE', 'CLEARANCE_LENGTH', 'FORM_FACTOR') NOT NULL,
  severity ENUM('BLOCKING', 'WARNING') DEFAULT 'BLOCKING',
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- 4. Custom System Builds (Orders)
CREATE TABLE custom_builds (
  id VARCHAR(64) PRIMARY KEY,
  store_id VARCHAR(64) REFERENCES stores(id),
  order_number VARCHAR(64) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  profile ENUM('CREATOR', 'AI DEV', 'ESPORTS', 'CUSTOM') DEFAULT 'CUSTOM',
  total_watts INT NOT NULL,
  recommended_psu INT NOT NULL,
  total_price INT NOT NULL,
  risk_score ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'LOW',
  status ENUM('PENDING_VERIFICATION', 'APPROVED', 'IN_ASSEMBLY', 'COMPLETED') DEFAULT 'PENDING_VERIFICATION',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Activity & Audit Logs
CREATE TABLE activity_logs (
  id VARCHAR(64) PRIMARY KEY,
  store_id VARCHAR(64) REFERENCES stores(id),
  action_type ENUM('STOCK_RESTOCK', 'RULE_CREATED', 'BUILD_VERIFIED', 'COMPONENT_ADDED', 'PRICE_UPDATED') NOT NULL,
  entity_type ENUM('COMPONENT', 'RULE', 'BUILD', 'SYSTEM') NOT NULL,
  description TEXT NOT NULL,
  performed_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Key Logic Features
1. **Dynamic Power Envelope & Transient Spike Engine:** Calculates real-time system draw and enforces a 1.25x safety multiplier against selected power supply units.
2. **Socket Verification Guardrail:** Blocks order placement when incompatible motherboard and CPU architectures are paired.
3. **Automated Risk Scoring:** Evaluates custom customer builds and flags high-risk configurations for merchant verification prior to assembly.

---

## 5. Tradeoffs & Future Roadmap
- **Tradeoff:** Using a client-side mock service layer in the initial frontend phase allows immediate UI exploration and interaction without demanding local MySQL setup overhead, while keeping data contracts 100% ready for Drizzle ORM.
- **With More Time:**
  - Implement 3D WebGL / Three.js interactive visual chassis preview in the PC Builder.
  - Automatic Shopify Inventory webhook synchronization (`inventory_levels/update`).
  - Automated dynamic restock purchase order generation when items fall below safety threshold.
