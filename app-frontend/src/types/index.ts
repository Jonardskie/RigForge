export type ComponentCategory = 'CPU' | 'Motherboard' | 'GPU' | 'RAM' | 'Cooler' | 'Case' | 'PSU' | 'Display';

export interface ComponentItem {
  id: string;
  sku: string;
  name: string;
  category: ComponentCategory;
  meta: string;
  socket?: string;
  watts?: number;
  maxGpuLength?: number;
  lengthMm?: number;
  price: number; // in cents or whole dollars
  stockQuantity: number;
  lowStockThreshold: number;
  status: 'ACTIVE' | 'ARCHIVED' | 'OUT_OF_STOCK';
  image?: string;
  updatedAt: string;
}

export interface CompatibilityRule {
  id: string;
  name: string;
  sourceCategory: ComponentCategory;
  targetCategory: ComponentCategory;
  ruleType: 'SOCKET_MATCH' | 'POWER_ENVELOPE' | 'CLEARANCE_LENGTH' | 'FORM_FACTOR';
  severity: 'BLOCKING' | 'WARNING';
  description: string;
  isActive: boolean;
}

export interface CustomBuild {
  id: string;
  orderNumber: string;
  customerName: string;
  profile: 'CREATOR' | 'AI DEV' | 'ESPORTS' | 'CUSTOM';
  components: {
    cpu?: string;
    motherboard?: string;
    gpu?: string;
    ram?: string;
    psu?: string;
    case?: string;
    cooler?: string;
    display?: string;
    [key: string]: string | undefined;
  };
  totalWatts: number;
  recommendedPsu: number;
  totalPrice: number;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING_VERIFICATION' | 'APPROVED' | 'IN_ASSEMBLY' | 'COMPLETED' | 'DISPATCHED';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  actionType: 'STOCK_RESTOCK' | 'RULE_CREATED' | 'BUILD_VERIFIED' | 'COMPONENT_ADDED' | 'PRICE_UPDATED' | 'BUILD_DISPATCHED';
  entityType: 'COMPONENT' | 'RULE' | 'BUILD' | 'SYSTEM';
  description: string;
  performedBy: string;
  timestamp: string;
}

export interface DashboardMetrics {
  grossRevenue: number;
  ordersCount: number;
  avgOrderValue: number;
  lowStockCount: number;
  pendingBuildsCount: number;
  systemHealthScore: number;
}
