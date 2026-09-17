import { ComponentItem, CompatibilityRule, CustomBuild, ActivityLog, DashboardMetrics } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

// Canonical 21 Hardware Catalog items matching Backend Database Seed
export const CANONICAL_COMPONENTS: ComponentItem[] = [
  // CPUs
  {
    id: 'cpu-7800x3d',
    sku: 'AMD-RYZ7-7800X3D',
    name: 'AMD Ryzen 7 7800X3D',
    category: 'CPU',
    socket: 'AM5',
    watts: 120,
    price: 449,
    stockQuantity: 14,
    lowStockThreshold: 5,
    status: 'ACTIVE',
    image: 'AMD Ryzen 7 7800X3D_no_bg.png',
    meta: 'AM5 · 8-Core · 3D V-Cache · 120W TDP',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cpu-9950x',
    sku: 'AMD-RYZ9-9950X',
    name: 'AMD Ryzen 9 9950X',
    category: 'CPU',
    socket: 'AM5',
    watts: 170,
    price: 649,
    stockQuantity: 18,
    lowStockThreshold: 5,
    status: 'ACTIVE',
    image: 'AMD Ryzen 9 9950X_no_bg.png',
    meta: 'AM5 · 16-Core · 5.7GHz Boost · 170W TDP',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cpu-14700k',
    sku: 'INT-CORE-I7-14700K',
    name: 'Intel Core i7-14700K',
    category: 'CPU',
    socket: 'LGA1700',
    watts: 253,
    price: 399,
    stockQuantity: 11,
    lowStockThreshold: 4,
    status: 'ACTIVE',
    image: 'Intel Core i7-14700K_no_bg.png',
    meta: 'LGA1700 · 20-Core (8P+12E) · 253W TDP',
    updatedAt: new Date().toISOString(),
  },
  // Motherboards
  {
    id: 'mb-x670e-hero',
    sku: 'GIGA-X670E-AORUS',
    name: 'Gigabyte X670E AORUS Master',
    category: 'Motherboard',
    socket: 'AM5',
    watts: 60,
    price: 429,
    stockQuantity: 3,
    lowStockThreshold: 5,
    status: 'ACTIVE',
    image: 'Gigabyte X670E AORUS Master_no_bg.png',
    meta: 'AM5 · PCIe 5.0 · DDR5 · E-ATX Flagship',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mb-b650-steel',
    sku: 'ASR-B650E-STEEL',
    name: 'ASRock B650E Steel Legend WiFi',
    category: 'Motherboard',
    socket: 'AM5',
    watts: 45,
    price: 239,
    stockQuantity: 8,
    lowStockThreshold: 4,
    status: 'ACTIVE',
    image: 'ASRock B650E Steel Legend_no_bg.png',
    meta: 'AM5 · PCIe 5.0 x16 · DDR5 · WiFi 6E',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mb-z790-hero',
    sku: 'ASUS-ROG-Z790-HERO',
    name: 'ASUS ROG Maximus Z790 Hero',
    category: 'Motherboard',
    socket: 'LGA1700',
    watts: 65,
    price: 549,
    stockQuantity: 5,
    lowStockThreshold: 3,
    status: 'ACTIVE',
    image: 'ASUS ROG Maximus Z790 Hero_no_bg.png',
    meta: 'LGA1700 · Thunderbolt 4 · PCIe 5.0 · 20+1 VRM',
    updatedAt: new Date().toISOString(),
  },
  // GPUs
  {
    id: 'gpu-5080-fe',
    sku: 'NV-RTX5080-16G-FE',
    name: 'NVIDIA GeForce RTX 5080 Founders Edition',
    category: 'GPU',
    watts: 360,
    lengthMm: 304,
    price: 1199,
    stockQuantity: 7,
    lowStockThreshold: 5,
    status: 'ACTIVE',
    image: 'NVIDIA GeForce RTX 5080 Founders Edition_no_bg.png',
    meta: '16GB GDDR7 · Blackwell · 360W · 304mm Dual-Slot',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'gpu-5070ti-oc',
    sku: 'ASUS-RTX5070TI-OC',
    name: 'GeForce RTX 5070 Ti OC Edition 16GB',
    category: 'GPU',
    watts: 285,
    lengthMm: 305,
    price: 749,
    stockQuantity: 12,
    lowStockThreshold: 4,
    status: 'ACTIVE',
    image: 'GeForce RTX 5070 Ti OC Edition_no_bg.png',
    meta: '16GB GDDR7 · Axial-tech Fans · 285W · 305mm',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'gpu-9060xt-xfx',
    sku: 'XFX-RX9060XT-16G',
    name: 'XFX Swift OC Radeon RX 9060 XT 16GB',
    category: 'GPU',
    watts: 220,
    lengthMm: 280,
    price: 529,
    stockQuantity: 9,
    lowStockThreshold: 3,
    status: 'ACTIVE',
    image: 'XFX Swift OC Radeon RX 9060 XT 16 GB Video Card_no_bg.png',
    meta: '16GB GDDR6 · RDNA 4 · 220W · 280mm Compact',
    updatedAt: new Date().toISOString(),
  },
  // RAM
  {
    id: 'ram-corsair-64-6000',
    sku: 'COR-DOM-64GB-6000',
    name: 'Corsair Vengeance RGB 64GB (2x32GB) DDR5-6000 CL30',
    category: 'RAM',
    watts: 15,
    price: 209,
    stockQuantity: 4,
    lowStockThreshold: 6,
    status: 'ACTIVE',
    image: 'Corsair Vengeance RGB 64 GB (2 x 32 GB) DDR5-6000 CL30 Memory_no_bg.png',
    meta: '64GB (2x32GB) · DDR5-6000 · CL30-36-36 · AMD EXPO',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ram-kingston-32-6000',
    sku: 'KNG-FURY-32GB-6000',
    name: 'Kingston FURY Beast 32GB (2x16GB) DDR5-6000 CL30',
    category: 'RAM',
    watts: 10,
    price: 119,
    stockQuantity: 15,
    lowStockThreshold: 5,
    status: 'ACTIVE',
    image: 'Kingston FURY Beast 32 GB (2 x 16 GB) DDR5-6000 CL30 Memory_no_bg.png',
    meta: '32GB (2x16GB) · DDR5-6000 · CL30 · Low Profile',
    updatedAt: new Date().toISOString(),
  },
  // Coolers
  {
    id: 'cool-arctic-lf3-360',
    sku: 'ARC-LF3-360-AIO',
    name: 'Arctic Liquid Freezer III 360 Liquid Cooler',
    category: 'Cooler',
    watts: 25,
    price: 119,
    stockQuantity: 16,
    lowStockThreshold: 5,
    status: 'ACTIVE',
    image: 'Arctic Liquid Freezer III 360_no_bg.png',
    meta: '360mm Radiator · VRM Dedicated Fan · 350W+ TDP',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cool-deepcool-ak620',
    sku: 'DC-AK620-DIGITAL',
    name: 'DeepCool AK620 Digital Dual-Tower Air Cooler',
    category: 'Cooler',
    watts: 10,
    price: 79,
    stockQuantity: 10,
    lowStockThreshold: 4,
    status: 'ACTIVE',
    image: 'DeepCool AK620 Digital_no_bg.png',
    meta: 'Dual-Tower 6 Heatpipes · Real-Time LED Display',
    updatedAt: new Date().toISOString(),
  },
  // Cases
  {
    id: 'case-north-xl-msh',
    sku: 'FD-NORTH-XL-MSH',
    name: 'Fractal Design North XL Mesh Charcoal Walnut',
    category: 'Case',
    maxGpuLength: 413,
    price: 179,
    stockQuantity: 11,
    lowStockThreshold: 4,
    status: 'ACTIVE',
    image: 'Fractal Design North XL Mesh_no_bg.png',
    meta: 'Genuine Walnut Front · Mesh Side · 413mm GPU Support',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'case-lianli-o11-vis',
    sku: 'LL-O11-VISION-BLK',
    name: 'Lian Li O11 Vision 3-Sided Panoramic Glass Case',
    category: 'Case',
    maxGpuLength: 455,
    price: 139,
    stockQuantity: 6,
    lowStockThreshold: 4,
    status: 'ACTIVE',
    image: 'Lian Li O11 Vision_no_bg.png',
    meta: '3-Piece Borderless Glass · E-ATX · 455mm GPU Support',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'case-lianli-v100r',
    sku: 'LL-V100R-MID-ATX',
    name: 'Lian Li Vector V100R ATX Mid Tower Case',
    category: 'Case',
    maxGpuLength: 380,
    price: 119,
    stockQuantity: 8,
    lowStockThreshold: 3,
    status: 'ACTIVE',
    image: 'Lian Li Vector V100R ATX Mid Tower Case_no_bg.png',
    meta: 'Dual Chamber · High Flow Front · 380mm GPU Support',
    updatedAt: new Date().toISOString(),
  },
  // PSUs
  {
    id: 'psu-rm850x-shift',
    sku: 'COR-RM850X-SHFT-GLD',
    name: 'Corsair RM850x Shift 850W Gold Modular PSU',
    category: 'PSU',
    watts: 850,
    price: 149,
    stockQuantity: 14,
    lowStockThreshold: 5,
    status: 'ACTIVE',
    image: 'Corsair RM850x Shift_no_bg.png',
    meta: '850W 80+ Gold · ATX 3.1 · Side-Mounted Interface',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'psu-vertex-1000',
    sku: 'SEA-VTX-GX1000-GLD',
    name: 'Seasonic Vertex GX-1000 ATX 3.0 Gold 1000W',
    category: 'PSU',
    watts: 1000,
    price: 199,
    stockQuantity: 7,
    lowStockThreshold: 3,
    status: 'ACTIVE',
    image: 'Seasonic Vertex GX-1000_no_bg.png',
    meta: '1000W 80+ Gold · PCIe 5.0 12VHPWR · 10 Yr Warranty',
    updatedAt: new Date().toISOString(),
  },
  // Displays
  {
    id: 'mon-rog-oled',
    sku: 'ASUS-ROG-OLED-27',
    name: 'ASUS ROG Strix OLED 27" 240Hz 0.03ms Gaming Monitor',
    category: 'Display',
    watts: 55,
    price: 899,
    stockQuantity: 5,
    lowStockThreshold: 2,
    status: 'ACTIVE',
    image: 'Asus ROG Strix OLEDMonitor_no_bg.png',
    meta: '27" 1440p QD-OLED · 240Hz · 0.03ms Response Time',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mon-msi-27',
    sku: 'MSI-MAG-275QF-180',
    name: 'MSI MAG 275QF 27" 1440p 180Hz Rapid IPS Monitor',
    category: 'Display',
    watts: 45,
    price: 249,
    stockQuantity: 14,
    lowStockThreshold: 3,
    status: 'ACTIVE',
    image: 'MSI MAG 275QF_no_bg.png',
    meta: '27" 2560x1440 · 180Hz 0.5ms · Rapid IPS Panel',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mon-msi-24',
    sku: 'MSI-MAG-244F-170',
    name: 'MSI MAG 244F 24" 1080p 170Hz Esports Monitor',
    category: 'Display',
    watts: 35,
    price: 169,
    stockQuantity: 20,
    lowStockThreshold: 4,
    status: 'ACTIVE',
    image: 'MSI MAG 244F_no_bg.png',
    meta: '24" 1080p · 170Hz 1ms · Adaptive-Sync Esports',
    updatedAt: new Date().toISOString(),
  },
];

export const CANONICAL_RULES: CompatibilityRule[] = [
  { id: 'r1', name: 'AM5 Socket Lock', sourceCategory: 'CPU', targetCategory: 'Motherboard', ruleType: 'SOCKET_MATCH', severity: 'BLOCKING', description: 'Ryzen 7000/9000 CPUs strictly require AM5 socket motherboards.', isActive: true },
  { id: 'r2', name: 'LGA1700 Socket Lock', sourceCategory: 'CPU', targetCategory: 'Motherboard', ruleType: 'SOCKET_MATCH', severity: 'BLOCKING', description: 'Intel 13th/14th Gen CPUs strictly require LGA1700 socket motherboards.', isActive: true },
  { id: 'r3', name: 'PSU 1.25x Headroom Guard', sourceCategory: 'GPU', targetCategory: 'PSU', ruleType: 'POWER_ENVELOPE', severity: 'WARNING', description: 'PSU wattage must exceed (CPU + GPU + 75W) * 1.25 to prevent transient trip.', isActive: true },
  { id: 'r4', name: 'GPU Chassis Clearance', sourceCategory: 'GPU', targetCategory: 'Case', ruleType: 'CLEARANCE_LENGTH', severity: 'BLOCKING', description: 'GPU length must be at least 15mm shorter than Case maximum GPU clearance.', isActive: true },
];

export const CANONICAL_BUILDS: CustomBuild[] = [
  {
    id: 'b1',
    orderNumber: '#RF-9082',
    customerName: 'Marcus Vance',
    profile: 'CREATOR',
    components: {
      cpu: 'AMD Ryzen 9 9950X',
      motherboard: 'Gigabyte X670E AORUS Master',
      gpu: 'NVIDIA GeForce RTX 5080 Founders Edition',
      ram: 'Corsair Vengeance RGB 64GB DDR5',
      cooler: 'Arctic Liquid Freezer III 360',
      case: 'Fractal Design North XL Mesh',
      psu: 'Corsair RM850x Shift Gold',
    },
    totalWatts: 635,
    recommendedPsu: 794,
    totalPrice: 3264,
    riskScore: 'LOW',
    status: 'IN_ASSEMBLY',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'b2',
    orderNumber: '#RF-9083',
    customerName: 'Aria Takahashi',
    profile: 'AI DEV',
    components: {
      cpu: 'Intel Core i7-14700K',
      motherboard: 'ASUS ROG Maximus Z790 Hero',
      gpu: 'NVIDIA GeForce RTX 5080 Founders Edition',
      ram: 'Corsair Vengeance RGB 64GB DDR5',
      cooler: 'Arctic Liquid Freezer III 360',
      case: 'Lian Li O11 Vision',
      psu: 'Seasonic Vertex GX-1000 ATX 3.0',
    },
    totalWatts: 703,
    recommendedPsu: 879,
    totalPrice: 3514,
    riskScore: 'LOW',
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'b3',
    orderNumber: '#RF-9084',
    customerName: 'Devon Reed',
    profile: 'ESPORTS',
    components: {
      cpu: 'AMD Ryzen 7 7800X3D',
      motherboard: 'ASRock B650E Steel Legend WiFi',
      gpu: 'GeForce RTX 5070 Ti OC Edition 16GB',
      ram: 'Kingston FURY Beast 32GB DDR5',
      cooler: 'DeepCool AK620 Digital',
      case: 'Lian Li Vector V100R ATX',
      psu: 'Corsair RM850x Shift Gold',
    },
    totalWatts: 490,
    recommendedPsu: 613,
    totalPrice: 1914,
    riskScore: 'LOW',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 'b4',
    orderNumber: '#RF-9085',
    customerName: 'Kaelen Thorne',
    profile: 'CUSTOM',
    components: {
      cpu: 'Intel Core i7-14700K',
      motherboard: 'ASUS ROG Maximus Z790 Hero',
      gpu: 'NVIDIA GeForce RTX 5080 Founders Edition',
      ram: 'Corsair Vengeance RGB 64GB DDR5',
      cooler: 'DeepCool AK620 Digital',
      case: 'Fractal Design North XL Mesh',
      psu: 'Corsair RM850x Shift Gold',
    },
    totalWatts: 698,
    recommendedPsu: 873,
    totalPrice: 2890,
    riskScore: 'HIGH',
    status: 'PENDING_VERIFICATION',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

export const CANONICAL_LOGS: ActivityLog[] = [
  {
    id: 'l1',
    actionType: 'STOCK_RESTOCK',
    entityType: 'COMPONENT',
    description: 'Restocked GeForce RTX 5070 Ti OC Edition (+12 units)',
    performedBy: 'Automated Inventory Sync',
    timestamp: '12 minutes ago',
  },
  {
    id: 'l2',
    actionType: 'BUILD_VERIFIED',
    entityType: 'BUILD',
    description: 'Verified custom rig #RF-9082 (Marcus Vance) · Power & thermal balance 96%',
    performedBy: 'Lead Tech (Alex K.)',
    timestamp: '35 minutes ago',
  },
  {
    id: 'l3',
    actionType: 'RULE_CREATED',
    entityType: 'RULE',
    description: 'Active 1.25x transient power headroom safety policy enforced',
    performedBy: 'Store Admin',
    timestamp: '1 hour ago',
  },
];

function getStore<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(`rigforge_v2_${key}`);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setStore<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`rigforge_v2_${key}`, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export const RigForgeAPI = {
  // Clear and re-synchronize local storage with live catalog
  async resetAndSyncCatalog(): Promise<void> {
    try {
      localStorage.removeItem('rigforge_components');
      localStorage.removeItem('rigforge_rules');
      localStorage.removeItem('rigforge_builds');
      localStorage.removeItem('rigforge_logs');
      localStorage.removeItem('rigforge_v2_components');
      localStorage.removeItem('rigforge_v2_rules');
      localStorage.removeItem('rigforge_v2_builds');
      localStorage.removeItem('rigforge_v2_logs');

      // Re-seed in database if reachable
      await fetch(`${API_BASE_URL}/seed`, { method: 'POST' }).catch(() => null);
    } catch {
      // ignore
    }
  },

  // Metrics
  async getMetrics(): Promise<DashboardMetrics> {
    try {
      const res = await fetch(`${API_BASE_URL}/metrics`, { signal: AbortSignal.timeout(1200) });
      if (res.ok) {
        const data = await res.json();
        return {
          grossRevenue: data.totalRevenue || 84290,
          ordersCount: 142,
          avgOrderValue: 593,
          lowStockCount: data.lowStockCount,
          pendingBuildsCount: data.pendingBuildsCount,
          systemHealthScore: 94,
        };
      }
    } catch {
      // fallback
    }

    const components = await this.getComponents();
    const builds = await this.getBuilds();
    const lowStock = components.filter((c) => c.stockQuantity <= c.lowStockThreshold).length;
    const pendingBuilds = builds.filter((b) => b.status === 'PENDING_VERIFICATION').length;

    return {
      grossRevenue: builds.reduce((s, b) => s + b.totalPrice, 0) + 72000,
      ordersCount: 142,
      avgOrderValue: 593,
      lowStockCount: lowStock,
      pendingBuildsCount: pendingBuilds,
      systemHealthScore: 94,
    };
  },

  // Components CRUD
  async getComponents(): Promise<ComponentItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/components`, { signal: AbortSignal.timeout(1200) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((item: any) => ({
            ...item,
            image: item.image?.split('/').pop() || item.image,
            meta: item.meta || `${item.socket ? `Socket ${item.socket} · ` : ''}${item.watts ? `${item.watts}W · ` : ''}$${item.price}`,
          }));
          setStore('components', formatted);
          return formatted;
        }
      }
    } catch {
      // fallback
    }
    return getStore<ComponentItem[]>('components', CANONICAL_COMPONENTS);
  },

  async createComponent(item: Omit<ComponentItem, 'id' | 'updatedAt'>): Promise<ComponentItem> {
    try {
      const res = await fetch(`${API_BASE_URL}/components`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const created = await res.json();
        const formatted = {
          ...created,
          image: created.image?.split('/').pop() || created.image,
        };
        const current = await this.getComponents();
        setStore('components', [formatted, ...current]);
        return formatted;
      }
    } catch {
      // fallback
    }

    const current = await this.getComponents();
    const newItem: ComponentItem = {
      ...item,
      id: `comp-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    const updated = [newItem, ...current];
    setStore('components', updated);

    await this.logActivity({
      actionType: 'COMPONENT_ADDED',
      entityType: 'COMPONENT',
      description: `Added new hardware component: ${item.name} (${item.sku})`,
      performedBy: 'Merchant User',
    });

    return newItem;
  },

  async updateStock(id: string, newStock: number): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/components/${id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exact: newStock }),
      }).catch(() => null);
    } catch {
      // fallback
    }

    const current = await this.getComponents();
    const target = current.find((c) => c.id === id);
    if (!target) return;

    const diff = newStock - target.stockQuantity;
    target.stockQuantity = newStock;
    target.status = newStock === 0 ? 'OUT_OF_STOCK' : 'ACTIVE';
    target.updatedAt = new Date().toISOString();
    setStore('components', current);

    await this.logActivity({
      actionType: 'STOCK_RESTOCK',
      entityType: 'COMPONENT',
      description: `Stock adjusted for ${target.name} (${diff >= 0 ? `+${diff}` : diff} units)`,
      performedBy: 'Merchant Admin',
    });
  },

  // Rules Engine
  async getRules(): Promise<CompatibilityRule[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/rules`, { signal: AbortSignal.timeout(1200) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setStore('rules', data);
          return data;
        }
      }
    } catch {
      // fallback
    }
    return getStore<CompatibilityRule[]>('rules', CANONICAL_RULES);
  },

  async toggleRule(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/rules/${id}/toggle`, { method: 'PATCH' }).catch(() => null);
    } catch {
      // fallback
    }

    const rules = await this.getRules();
    const rule = rules.find((r) => r.id === id);
    if (rule) {
      rule.isActive = !rule.isActive;
      setStore('rules', rules);
      await this.logActivity({
        actionType: 'RULE_CREATED',
        entityType: 'RULE',
        description: `Toggled compatibility rule: "${rule.name}" -> ${rule.isActive ? 'ENABLED' : 'DISABLED'}`,
        performedBy: 'Merchant Admin',
      });
    }
  },

  async createRule(newRule: Omit<CompatibilityRule, 'id'>): Promise<CompatibilityRule> {
    const rules = await this.getRules();
    const rule: CompatibilityRule = {
      ...newRule,
      id: `rule-${Date.now()}`,
    };
    const updated = [...rules, rule];
    setStore('rules', updated);

    await this.logActivity({
      actionType: 'RULE_CREATED',
      entityType: 'RULE',
      description: `Created new guardrail rule: "${rule.name}" (${rule.ruleType})`,
      performedBy: 'Merchant Admin',
    });

    return rule;
  },

  // Builds & Logic Scorer
  async getBuilds(): Promise<CustomBuild[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/builds`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped = data.map((b: any) => {
            let comps: Record<string, string> = {};
            if (typeof b.itemsJson === 'string') {
              try {
                const parsed = JSON.parse(b.itemsJson);
                if (Array.isArray(parsed)) {
                  parsed.forEach((item: any) => {
                    if (typeof item === 'string') {
                      comps[item] = item;
                    } else if (item && typeof item === 'object') {
                      const category = item.category || 'Component';
                      comps[category] = item.name || item.sku || 'Hardware Item';
                    }
                  });
                }
              } catch {
                comps = { summary: b.itemsJson };
              }
            } else if (b.components && typeof b.components === 'object') {
              comps = b.components;
            }

            return {
              ...b,
              components: Object.keys(comps).length > 0 ? comps : { system: 'Custom Hardware Bundle' },
            };
          });
          setStore('builds', mapped);
          return mapped;
        }
      }
    } catch {
      // fallback
    }
    return getStore<CustomBuild[]>('builds', CANONICAL_BUILDS);
  },

  async verifyBuild(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/builds/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      }).catch(() => null);
    } catch {
      // fallback
    }

    const builds = await this.getBuilds();
    const b = builds.find((item) => item.id === id);
    if (b) {
      b.status = 'APPROVED';
      b.riskScore = 'LOW';
      setStore('builds', builds);

      await this.logActivity({
        actionType: 'BUILD_VERIFIED',
        entityType: 'BUILD',
        description: `Verified and approved build ${b.orderNumber} (${b.customerName})`,
        performedBy: 'Merchant Admin',
      });
    }
  },

  // Fulfill & Dispatch Build Order with Automatic Inventory Deduction
  async fulfillAndDeductStock(buildId: string): Promise<{ success: boolean; build: CustomBuild; deductedItems: string[] }> {
    const builds = await this.getBuilds();
    const components = await this.getComponents();
    const targetBuild = builds.find((b) => b.id === buildId);

    if (!targetBuild) {
      throw new Error('Build order not found');
    }

    const deductedItems: string[] = [];
    const componentValues = Object.values(targetBuild.components || {}).filter(Boolean);

    components.forEach((comp) => {
      const isPart = componentValues.some(
        (val) =>
          val &&
          (comp.name.toLowerCase().includes(String(val).toLowerCase()) ||
            String(val).toLowerCase().includes(comp.name.toLowerCase()) ||
            comp.id === val ||
            comp.sku === val)
      );

      if (isPart && comp.stockQuantity > 0) {
        comp.stockQuantity = Math.max(0, comp.stockQuantity - 1);
        if (comp.stockQuantity === 0) {
          comp.status = 'OUT_OF_STOCK';
        }
        comp.updatedAt = new Date().toISOString();
        deductedItems.push(`${comp.name} (-1 unit -> ${comp.stockQuantity} left)`);
      }
    });

    targetBuild.status = 'DISPATCHED';
    targetBuild.riskScore = 'LOW';

    setStore('components', components);
    setStore('builds', builds);

    try {
      await fetch(`${API_BASE_URL}/builds/${buildId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DISPATCHED' }),
      }).catch(() => null);
    } catch {
      // ignore
    }

    await this.logActivity({
      actionType: 'BUILD_DISPATCHED',
      entityType: 'BUILD',
      description: `Dispatched & Fulfilled Order ${targetBuild.orderNumber} (${targetBuild.customerName}) · Auto-deducted inventory: ${deductedItems.join(', ') || '1x custom rig bundle'}`,
      performedBy: 'Lead Technician (Alex K.)',
    });

    return {
      success: true,
      build: targetBuild,
      deductedItems,
    };
  },

  // Activity Logs
  async getActivityLogs(): Promise<ActivityLog[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/activity-logs`, { signal: AbortSignal.timeout(1200) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((l: any) => ({
            ...l,
            timestamp: l.createdAt ? new Date(l.createdAt).toLocaleTimeString() : 'Just now',
          }));
          setStore('logs', mapped);
          return mapped;
        }
      }
    } catch {
      // fallback
    }
    return getStore<ActivityLog[]>('logs', CANONICAL_LOGS);
  },

  async logActivity(entry: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<void> {
    const logs = await this.getActivityLogs();
    const newLog: ActivityLog = {
      ...entry,
      id: `l_${Date.now()}`,
      timestamp: 'Just now',
    };
    setStore('logs', [newLog, ...logs]);
  },
};
