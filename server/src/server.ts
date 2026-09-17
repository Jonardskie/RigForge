import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { db, isDbConnected } from './db/index.js';
import { components, compatibilityRules, customBuilds, activityLogs } from './db/schema.js';
import { eq, desc } from 'drizzle-orm';
import {
  initialComponents,
  initialRules,
  initialBuilds,
  initialActivityLogs,
  seedDatabase,
  ComponentSeed,
  RuleSeed,
  BuildSeed,
  ActivityLogSeed,
} from './db/seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Canonical In-Memory State
let memComponents: ComponentSeed[] = [...initialComponents];
let memRules: RuleSeed[] = [...initialRules];
let memBuilds: BuildSeed[] = [...initialBuilds];
let memLogs: ActivityLogSeed[] = [...initialActivityLogs];

// Helper: Run Server-Side Compatibility & Risk Scoring
function evaluateBuildRisk(compList: ComponentSeed[], requestedPsuWatts?: number): {
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  reasons: string[];
  totalWatts: number;
  recommendedPsu: number;
} {
  const reasons: string[] = [];
  let riskScore: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';

  const cpu = compList.find((c) => c.category === 'CPU');
  const mobo = compList.find((c) => c.category === 'Motherboard');
  const gpu = compList.find((c) => c.category === 'GPU');
  const pcCase = compList.find((c) => c.category === 'Case');
  const psu = compList.find((c) => c.category === 'PSU');

  // 1. Socket Verification
  if (cpu && mobo && cpu.socket && mobo.socket) {
    if (cpu.socket.toLowerCase() !== mobo.socket.toLowerCase()) {
      riskScore = 'HIGH';
      reasons.push(`Socket mismatch: CPU (${cpu.name} - ${cpu.socket}) is incompatible with Motherboard (${mobo.name} - ${mobo.socket}).`);
    }
  }

  // 2. Power Envelope & Safety Buffer calculation
  const totalWatts = compList.reduce((sum, c) => sum + (c.watts || 0), 0) + 75; // 75W base for RAM/Drives/Fans
  const recommendedPsu = Math.ceil((totalWatts * 1.25) / 50) * 50; // 1.25x transient spike buffer rounded to 50W

  const effectivePsuWatts = requestedPsuWatts || (psu ? psu.watts : 0);
  if (effectivePsuWatts && effectivePsuWatts < totalWatts * 1.15) {
    riskScore = 'HIGH';
    reasons.push(`Power envelope deficit: Estimated draw (${totalWatts}W with transient headroom) exceeds PSU capacity (${effectivePsuWatts}W).`);
  }

  // 3. GPU Length vs Case Clearance
  if (gpu && pcCase && gpu.lengthMm && pcCase.maxGpuLength) {
    if (gpu.lengthMm > pcCase.maxGpuLength) {
      if (riskScore !== 'HIGH') riskScore = 'MEDIUM';
      reasons.push(`Chassis clearance warning: GPU length (${gpu.lengthMm}mm) exceeds case max allowance (${pcCase.maxGpuLength}mm).`);
    }
  }

  return { riskScore, reasons, totalWatts, recommendedPsu };
}

// ----------------------------------------------------
// 1. Health & Status
// ----------------------------------------------------
app.get('/api/health', async (req, res) => {
  res.json({
    status: 'ok',
    app: 'RigForge Merchant Embedded App Backend',
    database: isDbConnected ? 'connected (MySQL + Drizzle ORM)' : 'in-memory (21 canonical hardware SKUs)',
    jobsRunning: ['LowStockMonitor', 'CompatibilityRiskEngine', 'ShopifyWebhookReceiver'],
    timestamp: new Date().toISOString(),
  });
});

// ----------------------------------------------------
// 2. Seed Endpoint
// ----------------------------------------------------
app.post('/api/seed', async (req, res) => {
  try {
    if (db && isDbConnected) {
      await seedDatabase();
      return res.json({ success: true, message: 'Database seeded via Drizzle ORM' });
    } else {
      memComponents = [...initialComponents];
      memRules = [...initialRules];
      memBuilds = [...initialBuilds];
      memLogs = [...initialActivityLogs];
      return res.json({ success: true, message: 'In-memory state reset to seed defaults' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------
// 3. Metrics Endpoint
// ----------------------------------------------------
app.get('/api/metrics', async (req, res) => {
  try {
    if (db && isDbConnected) {
      try {
        const comps = await db.select().from(components);
        const rules = await db.select().from(compatibilityRules);
        const builds = await db.select().from(customBuilds);

        const totalComponents = comps.length;
        const lowStockCount = comps.filter((c) => c.stockQuantity <= c.lowStockThreshold).length;
        const activeRulesCount = rules.filter((r) => r.isActive).length;
        const pendingBuildsCount = builds.filter((b) => b.status === 'PENDING_VERIFICATION').length;
        const totalRevenue = builds.reduce((sum, b) => sum + b.totalPrice, 0);

        return res.json({
          totalComponents,
          lowStockCount,
          activeRulesCount,
          pendingBuildsCount,
          totalRevenue,
          systemStatus: 'ONLINE_OPTIMIZED',
        });
      } catch (err) {
        console.warn('MySQL query failed, falling back to in-memory metrics', err);
      }
    }

    // In-memory fallback
    const totalComponents = memComponents.length;
    const lowStockCount = memComponents.filter((c) => c.stockQuantity <= c.lowStockThreshold).length;
    const activeRulesCount = memRules.filter((r) => r.isActive).length;
    const pendingBuildsCount = memBuilds.filter((b) => b.status === 'PENDING_VERIFICATION').length;
    const totalRevenue = memBuilds.reduce((sum, b) => sum + b.totalPrice, 0);

    res.json({
      totalComponents,
      lowStockCount,
      activeRulesCount,
      pendingBuildsCount,
      totalRevenue,
      systemStatus: 'ONLINE_OPTIMIZED',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------
// 4. Components API
// ----------------------------------------------------
app.get('/api/components', async (req, res) => {
  const { category, search } = req.query;

  try {
    let list: ComponentSeed[] = memComponents;

    if (db && isDbConnected) {
      try {
        const results = await db.select().from(components);
        if (results.length > 0) {
          list = results.map((r) => ({
            ...r,
            socket: r.socket || undefined,
            watts: r.watts || undefined,
            lengthMm: r.lengthMm || undefined,
            maxGpuLength: r.maxGpuLength || undefined,
            image: r.image || undefined,
            tags: r.tags || undefined,
          })) as ComponentSeed[];
        }
      } catch (err) {
        console.warn('Falling back to memory for components', err);
      }
    }

    let filtered = [...list];
    if (category && category !== 'ALL') {
      filtered = filtered.filter((c) => c.category === category);
    }
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.sku.toLowerCase().includes(q) ||
          (c.socket && c.socket.toLowerCase().includes(q))
      );
    }

    res.json(filtered);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/components', async (req, res) => {
  const body = req.body;
  const newComp: ComponentSeed = {
    id: `comp-${Date.now()}`,
    storeId: 'store-rigforge-01',
    sku: body.sku || `RF-SKU-${Date.now().toString().slice(-4)}`,
    name: body.name,
    category: body.category,
    socket: body.socket || undefined,
    watts: body.watts ? Number(body.watts) : undefined,
    lengthMm: body.lengthMm ? Number(body.lengthMm) : undefined,
    maxGpuLength: body.maxGpuLength ? Number(body.maxGpuLength) : undefined,
    price: Number(body.price),
    stockQuantity: Number(body.stockQuantity || 0),
    lowStockThreshold: Number(body.lowStockThreshold || 5),
    status: (body.status || 'ACTIVE') as 'ACTIVE' | 'ARCHIVED' | 'OUT_OF_STOCK',
    image: body.image || '/images/components/amd-ryzen-7-7800x3d_no_bg.png',
    tags: JSON.stringify(body.tags || []),
  };

  try {
    if (db && isDbConnected) {
      try {
        await db.insert(components).values(newComp);
      } catch (err) {
        console.warn('MySQL insert failed, using memory', err);
      }
    }

    memComponents.unshift(newComp);

    // Add activity log
    const logItem: ActivityLogSeed = {
      id: `log-${Date.now()}`,
      storeId: 'store-rigforge-01',
      actionType: 'COMPONENT_ADDED',
      entityType: 'COMPONENT',
      description: `Added new component ${newComp.name} (${newComp.sku})`,
      performedBy: 'Merchant User',
      createdAt: new Date(),
    };
    memLogs.unshift(logItem);

    res.status(201).json(newComp);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/components/:id/stock', async (req, res) => {
  const { id } = req.params;
  const { delta, exact } = req.body;

  try {
    const idx = memComponents.findIndex((c) => c.id === id || c.sku === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Component not found' });
    }

    const currentStock = memComponents[idx].stockQuantity;
    const newStock = exact !== undefined ? Number(exact) : Math.max(0, currentStock + Number(delta || 0));
    const newStatus: 'ACTIVE' | 'OUT_OF_STOCK' = newStock === 0 ? 'OUT_OF_STOCK' : 'ACTIVE';
    
    memComponents[idx].stockQuantity = newStock;
    memComponents[idx].status = newStatus;

    if (db && isDbConnected) {
      try {
        await db
          .update(components)
          .set({ stockQuantity: newStock, status: newStatus })
          .where(eq(components.id, memComponents[idx].id));
      } catch (err) {
        console.warn('MySQL stock update failed, using memory', err);
      }
    }

    // Log restock activity
    const logItem: ActivityLogSeed = {
      id: `log-${Date.now()}`,
      storeId: 'store-rigforge-01',
      actionType: 'STOCK_RESTOCK',
      entityType: 'COMPONENT',
      description: `Updated stock for ${memComponents[idx].name} to ${newStock} units`,
      performedBy: 'Merchant Admin',
      createdAt: new Date(),
    };
    memLogs.unshift(logItem);

    res.json(memComponents[idx]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------
// 5. Compatibility Engine & Rules API
// ----------------------------------------------------
app.get('/api/rules', async (req, res) => {
  try {
    let list: RuleSeed[] = memRules;
    if (db && isDbConnected) {
      try {
        const results = await db.select().from(compatibilityRules);
        if (results.length > 0) list = results as RuleSeed[];
      } catch (err) {
        console.warn('Falling back to memory for rules', err);
      }
    }
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/rules/:id/toggle', async (req, res) => {
  const { id } = req.params;
  try {
    const rule = memRules.find((r) => r.id === id);
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    rule.isActive = !rule.isActive;

    if (db && isDbConnected) {
      try {
        await db
          .update(compatibilityRules)
          .set({ isActive: rule.isActive })
          .where(eq(compatibilityRules.id, id));
      } catch (err) {
        console.warn('MySQL rule toggle failed, using memory', err);
      }
    }

    const logItem: ActivityLogSeed = {
      id: `log-${Date.now()}`,
      storeId: 'store-rigforge-01',
      actionType: 'RULE_TOGGLED',
      entityType: 'RULE',
      description: `${rule.isActive ? 'Enabled' : 'Disabled'} rule: ${rule.name}`,
      performedBy: 'Merchant Admin',
      createdAt: new Date(),
    };
    memLogs.unshift(logItem);

    res.json(rule);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Automated Server-Side Compatibility Validation Endpoint
app.post('/api/compatibility/validate', async (req, res) => {
  try {
    const { componentIds, skus, psuWatts } = req.body;
    let selectedComps: ComponentSeed[] = [];

    if (Array.isArray(componentIds) && componentIds.length > 0) {
      selectedComps = memComponents.filter((c) => componentIds.includes(c.id));
    } else if (Array.isArray(skus) && skus.length > 0) {
      selectedComps = memComponents.filter((c) => skus.includes(c.sku));
    }

    const evaluation = evaluateBuildRisk(selectedComps, psuWatts ? Number(psuWatts) : undefined);

    res.json({
      success: true,
      isValid: evaluation.riskScore !== 'HIGH',
      riskScore: evaluation.riskScore,
      violations: evaluation.reasons,
      totalWatts: evaluation.totalWatts,
      recommendedPsu: evaluation.recommendedPsu,
      evaluatedComponentsCount: selectedComps.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------
// 6. Custom Builds & Orders API (with Inventory Deduction)
// ----------------------------------------------------
app.get('/api/builds', async (req, res) => {
  try {
    let list: BuildSeed[] = memBuilds;
    if (db && isDbConnected) {
      try {
        const results = await db.select().from(customBuilds).orderBy(desc(customBuilds.createdAt));
        if (results.length > 0) list = results as BuildSeed[];
      } catch (err) {
        console.warn('Falling back to memory for builds', err);
      }
    }
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/builds', async (req, res) => {
  try {
    const body = req.body;
    const items: Array<{ id?: string; sku?: string; name?: string; quantity?: number; watts?: number; price?: number }> = body.items || [];
    
    // Resolve components for risk evaluation
    const matchedComps: ComponentSeed[] = [];
    for (const item of items) {
      const match = memComponents.find((c) => c.id === item.id || c.sku === item.sku || c.name === item.name);
      if (match) matchedComps.push(match);
    }

    const evaluation = evaluateBuildRisk(matchedComps);

    const orderNumber = body.orderNumber || `#RF-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalPrice = body.totalPrice || items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    const totalWatts = body.totalWatts || evaluation.totalWatts;
    const recommendedPsu = body.recommendedPsu || evaluation.recommendedPsu;
    const riskScore = body.riskScore || evaluation.riskScore;

    const newBuild: BuildSeed = {
      id: `build-${Date.now()}`,
      storeId: 'store-rigforge-01',
      orderNumber,
      customerName: body.customerName || 'Storefront Customer',
      profile: (body.profile || 'CUSTOM') as 'CREATOR' | 'AI DEV' | 'ESPORTS' | 'CUSTOM',
      itemsJson: JSON.stringify(items.length > 0 ? items : matchedComps),
      totalWatts,
      recommendedPsu,
      totalPrice,
      riskScore,
      status: riskScore === 'HIGH' ? 'PENDING_VERIFICATION' : 'APPROVED',
      createdAt: new Date(),
    };

    // Auto-decrement inventory stock for each component in the build
    for (const item of items) {
      const target = memComponents.find((c) => c.id === item.id || c.sku === item.sku || c.name === item.name);
      if (target) {
        const qty = item.quantity || 1;
        target.stockQuantity = Math.max(0, target.stockQuantity - qty);
        if (target.stockQuantity === 0) {
          target.status = 'OUT_OF_STOCK';
        }
      }
    }

    // Persist to MySQL if connected
    if (db && isDbConnected) {
      try {
        await db.insert(customBuilds).values(newBuild);
        for (const target of matchedComps) {
          await db
            .update(components)
            .set({ stockQuantity: target.stockQuantity, status: target.status })
            .where(eq(components.id, target.id));
        }
      } catch (err) {
        console.warn('MySQL build insert failed, using memory', err);
      }
    }

    memBuilds.unshift(newBuild);

    // Activity Log
    const logItem: ActivityLogSeed = {
      id: `log-${Date.now()}`,
      storeId: 'store-rigforge-01',
      actionType: 'BUILD_VERIFIED',
      entityType: 'BUILD',
      description: `New order ${orderNumber} registered ($${totalPrice.toLocaleString()}) - Risk: ${riskScore}`,
      performedBy: 'Checkout Order Engine',
      createdAt: new Date(),
    };
    memLogs.unshift(logItem);

    res.status(201).json({
      success: true,
      build: newBuild,
      riskAssessment: evaluation,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch('/api/builds/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const build = memBuilds.find((b) => b.id === id);
    if (!build) {
      return res.status(404).json({ error: 'Build not found' });
    }

    build.status = status;
    if (status === 'APPROVED') {
      build.riskScore = 'LOW';
    }

    if (db && isDbConnected) {
      try {
        await db
          .update(customBuilds)
          .set({ status: build.status, riskScore: build.riskScore })
          .where(eq(customBuilds.id, id));
      } catch (err) {
        console.warn('MySQL build status update failed, using memory', err);
      }
    }

    const logItem: ActivityLogSeed = {
      id: `log-${Date.now()}`,
      storeId: 'store-rigforge-01',
      actionType: 'BUILD_VERIFIED',
      entityType: 'BUILD',
      description: `Updated status for build ${build.orderNumber} to ${status}`,
      performedBy: 'Lead Technician',
      createdAt: new Date(),
    };
    memLogs.unshift(logItem);

    res.json(build);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------
// 7. Activity Logs API
// ----------------------------------------------------
app.get('/api/activity-logs', async (req, res) => {
  try {
    let list: ActivityLogSeed[] = memLogs;
    if (db && isDbConnected) {
      try {
        const results = await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt));
        if (results.length > 0) list = results as ActivityLogSeed[];
      } catch (err) {
        console.warn('Falling back to memory for activity logs', err);
      }
    }
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/activity-logs', async (req, res) => {
  try {
    const body = req.body;
    const newLog: ActivityLogSeed = {
      id: `log-${Date.now()}`,
      storeId: body.storeId || 'store-rigforge-01',
      actionType: body.actionType || 'BUILD_VERIFIED',
      entityType: body.entityType || 'SYSTEM',
      description: body.description || 'System event recorded',
      performedBy: body.performedBy || 'Storefront Client',
      createdAt: new Date(),
    };

    if (db && isDbConnected) {
      try {
        await db.insert(activityLogs).values(newLog);
      } catch (err) {
        console.warn('MySQL log insert failed, using memory', err);
      }
    }

    memLogs.unshift(newLog);
    res.status(201).json({ success: true, log: newLog });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------
// 8. Shopify Webhook Ingestion Handlers
// ----------------------------------------------------
app.post('/api/webhooks/orders/create', async (req, res) => {
  try {
    const payload = req.body;
    const orderNumber = payload.name || `#SHOP-${Date.now().toString().slice(-4)}`;
    const lineItems = payload.line_items || [];
    const customerName = payload.customer ? `${payload.customer.first_name} ${payload.customer.last_name}` : 'Shopify Customer';
    const totalPrice = Number(payload.total_price || 0);

    const logItem: ActivityLogSeed = {
      id: `log-${Date.now()}`,
      storeId: 'store-rigforge-01',
      actionType: 'BUILD_VERIFIED',
      entityType: 'BUILD',
      description: `Shopify Webhook: Order ${orderNumber} received for ${customerName} ($${totalPrice})`,
      performedBy: 'Shopify Webhook Worker',
      createdAt: new Date(),
    };
    memLogs.unshift(logItem);

    res.status(200).json({ success: true, message: 'Webhook processed', orderNumber });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/webhooks/inventory/update', async (req, res) => {
  try {
    const { sku, available } = req.body;
    const target = memComponents.find((c) => c.sku === sku);
    if (target) {
      target.stockQuantity = Number(available);
      target.status = target.stockQuantity === 0 ? 'OUT_OF_STOCK' : 'ACTIVE';
    }

    res.status(200).json({ success: true, message: 'Inventory updated from Shopify', sku, available });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------
// 9. Background Jobs: Recurring Low-Stock Monitor
// ----------------------------------------------------
let lastAlertedSkus = new Set<string>();

function runLowStockMonitorJob() {
  const lowItems = memComponents.filter((c) => c.stockQuantity <= c.lowStockThreshold);
  for (const item of lowItems) {
    if (!lastAlertedSkus.has(item.sku)) {
      lastAlertedSkus.add(item.sku);
      const alertLog: ActivityLogSeed = {
        id: `log-${Date.now()}`,
        storeId: 'store-rigforge-01',
        actionType: 'STOCK_RESTOCK',
        entityType: 'COMPONENT',
        description: `⚠️ LOW STOCK ALERT: ${item.name} is down to ${item.stockQuantity} units (Threshold: ${item.lowStockThreshold}). PO draft suggested.`,
        performedBy: 'Automated Stock Sentinel Job',
        createdAt: new Date(),
      };
      memLogs.unshift(alertLog);
      console.log(`[Sentinel Job] Alert generated for low-stock component: ${item.sku}`);
    }
  }
}

// Run monitor every 60 seconds
setInterval(runLowStockMonitorJob, 60000);

// Run once at startup after 3 seconds
setTimeout(runLowStockMonitorJob, 3000);

// ----------------------------------------------------
// Server Startup
// ----------------------------------------------------
app.listen(PORT, () => {
  console.log(`⚡ RigForge Backend API Server listening on http://localhost:${PORT}`);
  console.log(`📡 Endpoints available: /api/health, /api/metrics, /api/components, /api/rules, /api/compatibility/validate, /api/builds, /api/activity-logs, /api/webhooks/*`);
});
