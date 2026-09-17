import {
  mysqlTable,
  varchar,
  text,
  int,
  boolean,
  timestamp,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// 1. Stores Table (Multi-tenant Shopify installations)
export const stores = mysqlTable('stores', {
  id: varchar('id', { length: 64 }).primaryKey(),
  shopDomain: varchar('shop_domain', { length: 255 }).notNull().unique(),
  accessToken: text('access_token').notNull(),
  installedAt: timestamp('installed_at').defaultNow().notNull(),
});

// 2. Hardware Components Table
export const components = mysqlTable('components', {
  id: varchar('id', { length: 64 }).primaryKey(),
  storeId: varchar('store_id', { length: 64 }).references(() => stores.id),
  sku: varchar('sku', { length: 64 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  category: mysqlEnum('category', [
    'CPU',
    'Motherboard',
    'GPU',
    'RAM',
    'Cooler',
    'Case',
    'PSU',
    'Display',
  ]).notNull(),
  socket: varchar('socket', { length: 32 }),
  watts: int('watts'),
  lengthMm: int('length_mm'),
  maxGpuLength: int('max_gpu_length'),
  price: int('price').notNull(), // in cents / USD
  stockQuantity: int('stock_quantity').default(0).notNull(),
  lowStockThreshold: int('low_stock_threshold').default(5).notNull(),
  status: mysqlEnum('status', ['ACTIVE', 'ARCHIVED', 'OUT_OF_STOCK']).default('ACTIVE').notNull(),
  image: text('image'),
  tags: text('tags'), // JSON string array or comma separated
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// 3. Compatibility Rules Engine Table
export const compatibilityRules = mysqlTable('compatibility_rules', {
  id: varchar('id', { length: 64 }).primaryKey(),
  storeId: varchar('store_id', { length: 64 }).references(() => stores.id),
  name: varchar('name', { length: 255 }).notNull(),
  sourceCategory: mysqlEnum('source_category', [
    'CPU',
    'Motherboard',
    'GPU',
    'RAM',
    'Cooler',
    'Case',
    'PSU',
    'Display',
  ]).notNull(),
  targetCategory: mysqlEnum('target_category', [
    'CPU',
    'Motherboard',
    'GPU',
    'RAM',
    'Cooler',
    'Case',
    'PSU',
    'Display',
  ]).notNull(),
  ruleType: mysqlEnum('rule_type', [
    'SOCKET_MATCH',
    'POWER_ENVELOPE',
    'CLEARANCE_LENGTH',
    'FORM_FACTOR',
  ]).notNull(),
  severity: mysqlEnum('severity', ['BLOCKING', 'WARNING']).default('BLOCKING').notNull(),
  description: text('description').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Custom System Builds (Orders / Quotes)
export const customBuilds = mysqlTable('custom_builds', {
  id: varchar('id', { length: 64 }).primaryKey(),
  storeId: varchar('store_id', { length: 64 }).references(() => stores.id),
  orderNumber: varchar('order_number', { length: 64 }).notNull(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  profile: mysqlEnum('profile', ['CREATOR', 'AI DEV', 'ESPORTS', 'CUSTOM']).default('CUSTOM').notNull(),
  itemsJson: text('items_json').notNull(), // JSON string of component IDs or details
  totalWatts: int('total_watts').notNull(),
  recommendedPsu: int('recommended_psu').notNull(),
  totalPrice: int('total_price').notNull(),
  riskScore: mysqlEnum('risk_score', ['LOW', 'MEDIUM', 'HIGH']).default('LOW').notNull(),
  status: mysqlEnum('status', [
    'PENDING_VERIFICATION',
    'APPROVED',
    'IN_ASSEMBLY',
    'COMPLETED',
  ]).default('PENDING_VERIFICATION').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Activity & Audit Logs Table
export const activityLogs = mysqlTable('activity_logs', {
  id: varchar('id', { length: 64 }).primaryKey(),
  storeId: varchar('store_id', { length: 64 }).references(() => stores.id),
  actionType: mysqlEnum('action_type', [
    'STOCK_RESTOCK',
    'RULE_CREATED',
    'RULE_TOGGLED',
    'BUILD_VERIFIED',
    'COMPONENT_ADDED',
    'PRICE_UPDATED',
  ]).notNull(),
  entityType: mysqlEnum('entity_type', ['COMPONENT', 'RULE', 'BUILD', 'SYSTEM']).notNull(),
  description: text('description').notNull(),
  performedBy: varchar('performed_by', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relational Definitions
export const storesRelations = relations(stores, ({ many }) => ({
  components: many(components),
  rules: many(compatibilityRules),
  builds: many(customBuilds),
  activityLogs: many(activityLogs),
}));

export const componentsRelations = relations(components, ({ one }) => ({
  store: one(stores, {
    fields: [components.storeId],
    references: [stores.id],
  }),
}));

export const compatibilityRulesRelations = relations(compatibilityRules, ({ one }) => ({
  store: one(stores, {
    fields: [compatibilityRules.storeId],
    references: [stores.id],
  }),
}));

export const customBuildsRelations = relations(customBuilds, ({ one }) => ({
  store: one(stores, {
    fields: [customBuilds.storeId],
    references: [stores.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  store: one(stores, {
    fields: [activityLogs.storeId],
    references: [stores.id],
  }),
}));
