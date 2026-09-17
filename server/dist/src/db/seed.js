import { db, pool } from './index.js';
import { stores, components, compatibilityRules, customBuilds, activityLogs } from './schema.js';
export const initialStore = {
    id: 'store-rigforge-01',
    shopDomain: 'rigforge-customs.myshopify.com',
    accessToken: 'shpat_live_rigforge_secure_token_demo',
};
export const initialComponents = [
    // CPUs
    {
        id: 'cpu-7800x3d',
        storeId: initialStore.id,
        sku: 'AMD-RYZ7-7800X3D',
        name: 'AMD Ryzen 7 7800X3D',
        category: 'CPU',
        socket: 'AM5',
        watts: 120,
        price: 449,
        stockQuantity: 14,
        lowStockThreshold: 5,
        status: 'ACTIVE',
        image: '/images/components/amd-ryzen-7-7800x3d_no_bg.png',
        tags: JSON.stringify(['AM5', '8-CORE', '3D V-CACHE', 'GAMING KING']),
    },
    {
        id: 'cpu-14900k',
        storeId: initialStore.id,
        sku: 'INT-CORE-I9-14900K',
        name: 'Intel Core i9-14900K',
        category: 'CPU',
        socket: 'LGA1700',
        watts: 253,
        price: 549,
        stockQuantity: 8,
        lowStockThreshold: 5,
        status: 'ACTIVE',
        image: '/images/components/intel-core-i9-14900k_no_bg.png',
        tags: JSON.stringify(['LGA1700', '24-CORE', '6.0GHZ BOOST', 'CREATOR BEAST']),
    },
    {
        id: 'cpu-7950x',
        storeId: initialStore.id,
        sku: 'AMD-RYZ9-7950X',
        name: 'AMD Ryzen 9 7950X',
        category: 'CPU',
        socket: 'AM5',
        watts: 170,
        price: 529,
        stockQuantity: 3,
        lowStockThreshold: 5,
        status: 'ACTIVE',
        image: '/images/components/amd-ryzen-9-7950x_no_bg.png',
        tags: JSON.stringify(['AM5', '16-CORE', 'WORKSTATION', 'HEAVY MULTITHREAD']),
    },
    // Motherboards
    {
        id: 'mb-x670e-hero',
        storeId: initialStore.id,
        sku: 'ASUS-ROG-X670E-HERO',
        name: 'ASUS ROG Crosshair X670E Hero',
        category: 'Motherboard',
        socket: 'AM5',
        watts: 60,
        price: 629,
        stockQuantity: 6,
        lowStockThreshold: 4,
        status: 'ACTIVE',
        image: '/images/components/asus-rog-crosshair-x670e-hero_no_bg.png',
        tags: JSON.stringify(['AM5', 'PCIE 5.0', 'DDR5', '18+2 POWER STAGES']),
    },
    {
        id: 'mb-b650-tuf',
        storeId: initialStore.id,
        sku: 'ASUS-TUF-B650-PLUS',
        name: 'ASUS TUF Gaming B650-Plus WiFi',
        category: 'Motherboard',
        socket: 'AM5',
        watts: 45,
        price: 219,
        stockQuantity: 19,
        lowStockThreshold: 5,
        status: 'ACTIVE',
        image: '/images/components/asus-tuf-gaming-b650-plus-wifi_no_bg.png',
        tags: JSON.stringify(['AM5', 'DDR5', 'WIFI 6', 'VALUE TITAN']),
    },
    {
        id: 'mb-z790-dark-hero',
        storeId: initialStore.id,
        sku: 'ASUS-ROG-Z790-DKHERO',
        name: 'ASUS ROG Maximus Z790 Dark Hero',
        category: 'Motherboard',
        socket: 'LGA1700',
        watts: 65,
        price: 699,
        stockQuantity: 2,
        lowStockThreshold: 5,
        status: 'ACTIVE',
        image: '/images/components/asus-rog-maximus-z790-dark-hero_no_bg.png',
        tags: JSON.stringify(['LGA1700', 'PCIE 5.0', 'THUNDERBOLT 4', 'OVERCLOCKING']),
    },
    // GPUs
    {
        id: 'gpu-4090-rog',
        storeId: initialStore.id,
        sku: 'ASUS-ROG-RTX4090-24G',
        name: 'ASUS ROG Strix RTX 4090 OC 24GB',
        category: 'GPU',
        watts: 450,
        lengthMm: 357,
        price: 1999,
        stockQuantity: 4,
        lowStockThreshold: 3,
        status: 'ACTIVE',
        image: '/images/components/asus-rog-strix-geforce-rtx-4090-oc_no_bg.png',
        tags: JSON.stringify(['24GB GDDR6X', 'DLSS 3.5', '4K ULTRA', 'TITANIC 357MM']),
    },
    {
        id: 'gpu-4080s-proart',
        storeId: initialStore.id,
        sku: 'ASUS-PROART-4080S-16G',
        name: 'ASUS ProArt RTX 4080 Super OC 16GB',
        category: 'GPU',
        watts: 320,
        lengthMm: 300,
        price: 1099,
        stockQuantity: 11,
        lowStockThreshold: 4,
        status: 'ACTIVE',
        image: '/images/components/asus-proart-geforce-rtx-4080-super-oc_no_bg.png',
        tags: JSON.stringify(['16GB GDDR6X', 'STUDIO READY', 'COMPACT 300MM', 'AI DEV']),
    },
    {
        id: 'gpu-4070s-dual',
        storeId: initialStore.id,
        sku: 'ASUS-DUAL-RTX4070S-12G',
        name: 'ASUS Dual RTX 4070 Super EVO 12GB',
        category: 'GPU',
        watts: 220,
        lengthMm: 227,
        price: 599,
        stockQuantity: 24,
        lowStockThreshold: 6,
        status: 'ACTIVE',
        image: '/images/components/asus-dual-geforce-rtx-4070-super-evo_no_bg.png',
        tags: JSON.stringify(['12GB GDDR6X', '1440P SWEET SPOT', 'DUAL FAN 227MM']),
    },
    // RAM
    {
        id: 'ram-gskill-64-6000',
        storeId: initialStore.id,
        sku: 'GSK-TRID-64GB-6000',
        name: 'G.Skill Trident Z5 RGB 64GB (2x32GB) DDR5-6000 CL30',
        category: 'RAM',
        watts: 15,
        price: 219,
        stockQuantity: 16,
        lowStockThreshold: 5,
        status: 'ACTIVE',
        image: '/images/components/gskill-trident-z5-rgb-64gb-ddr5_no_bg.png',
        tags: JSON.stringify(['DDR5-6000', 'CL30 LOW LATENCY', 'AMD EXPO', 'INTEL XMP']),
    },
    {
        id: 'ram-corsair-32-6000',
        storeId: initialStore.id,
        sku: 'COR-DOM-32GB-6000',
        name: 'Corsair Dominator Titanium 32GB (2x16GB) DDR5-6000 CL30',
        category: 'RAM',
        watts: 12,
        price: 169,
        stockQuantity: 28,
        lowStockThreshold: 5,
        status: 'ACTIVE',
        image: '/images/components/corsair-dominator-titanium-rgb-32gb-ddr5_no_bg.png',
        tags: JSON.stringify(['DDR5-6000', 'DHX COOLING', 'MODULAR TOP BARS']),
    },
    // Coolers
    {
        id: 'cool-nzxt-kraken-elite',
        storeId: initialStore.id,
        sku: 'NZXT-KRK-ELITE-360',
        name: 'NZXT Kraken Elite 360 RGB LCD',
        category: 'Cooler',
        watts: 25,
        price: 289,
        stockQuantity: 10,
        lowStockThreshold: 4,
        status: 'ACTIVE',
        image: '/images/components/nzxt-kraken-elite-360-rgb_no_bg.png',
        tags: JSON.stringify(['360MM AIO', '2.36" LCD SCREEN', 'AM5 / LGA1700', '350W TDP']),
    },
    {
        id: 'cool-corsair-h150i',
        storeId: initialStore.id,
        sku: 'COR-H150I-ICUE-360',
        name: 'Corsair iCUE LINK H150i LCD 360mm',
        category: 'Cooler',
        watts: 25,
        price: 279,
        stockQuantity: 7,
        lowStockThreshold: 3,
        status: 'ACTIVE',
        image: '/images/components/corsair-icue-link-h150i-lcd_no_bg.png',
        tags: JSON.stringify(['360MM AIO', 'IPS LCD DISPLAY', 'SINGLE CABLE LINK']),
    },
    {
        id: 'cool-nh-d15-chromax',
        storeId: initialStore.id,
        sku: 'NOCT-NH-D15-CHROMAX',
        name: 'Noctua NH-D15 chromax.black Dual-Tower Air Cooler',
        category: 'Cooler',
        watts: 10,
        price: 119,
        stockQuantity: 18,
        lowStockThreshold: 5,
        status: 'ACTIVE',
        image: '/images/components/noctua-nh-d15-chromax-black_no_bg.png',
        tags: JSON.stringify(['DUAL TOWER AIR', 'SILENT NF-A15', 'ZERO PUMP FAILURE RISK']),
    },
    // Cases
    {
        id: 'case-lianli-o11d-evo',
        storeId: initialStore.id,
        sku: 'LL-O11D-EVO-RGB',
        name: 'Lian Li O11 Dynamic EVO RGB Dual-Chamber Case',
        category: 'Case',
        maxGpuLength: 455,
        price: 169,
        stockQuantity: 15,
        lowStockThreshold: 4,
        status: 'ACTIVE',
        image: '/images/components/lian-li-o11-dynamic-evo-rgb_no_bg.png',
        tags: JSON.stringify(['DUAL CHAMBER', 'PANORAMIC GLASS', 'UP TO 455MM GPU', 'E-ATX']),
    },
    {
        id: 'case-nzxt-h9-flow',
        storeId: initialStore.id,
        sku: 'NZXT-H9-FLOW-DUAL',
        name: 'NZXT H9 Flow Dual-Chamber Mid-Tower Case',
        category: 'Case',
        maxGpuLength: 435,
        price: 159,
        stockQuantity: 9,
        lowStockThreshold: 3,
        status: 'ACTIVE',
        image: '/images/components/nzxt-h9-flow_no_bg.png',
        tags: JSON.stringify(['SEAMLESS GLASS', 'HIGH AIRFLOW TOP', 'UP TO 435MM GPU']),
    },
    {
        id: 'case-fractal-north-xl',
        storeId: initialStore.id,
        sku: 'FD-NORTH-XL-WALNUT',
        name: 'Fractal Design North XL Charcoal Black Walnut',
        category: 'Case',
        maxGpuLength: 413,
        price: 179,
        stockQuantity: 5,
        lowStockThreshold: 4,
        status: 'ACTIVE',
        image: '/images/components/fractal-design-north-xl_no_bg.png',
        tags: JSON.stringify(['GENUINE WALNUT FRONT', 'STEALTH INDUSTRIAL', 'UP TO 413MM GPU']),
    },
    // PSUs
    {
        id: 'psu-seasonic-tx1300',
        storeId: initialStore.id,
        sku: 'SEA-PRIME-TX1300',
        name: 'Seasonic Prime TX-1300 ATX 3.0 Titanium 1300W',
        category: 'PSU',
        watts: 1300,
        price: 499,
        stockQuantity: 6,
        lowStockThreshold: 2,
        status: 'ACTIVE',
        image: '/images/components/seasonic-prime-tx-1300_no_bg.png',
        tags: JSON.stringify(['1300W TITANIUM', 'PCIE 5.0 12V-2X6', '12 YEAR WARRANTY', 'EXTREME OC']),
    },
    {
        id: 'psu-corsair-hx1000i',
        storeId: initialStore.id,
        sku: 'COR-HX1000I-ATX3',
        name: 'Corsair HX1000i Platinum 1000W Fully Modular',
        category: 'PSU',
        watts: 1000,
        price: 239,
        stockQuantity: 12,
        lowStockThreshold: 4,
        status: 'ACTIVE',
        image: '/images/components/corsair-hx1000i-1000w-platinum_no_bg.png',
        tags: JSON.stringify(['1000W PLATINUM', 'ATX 3.0 READY', 'ICUE DIGITAL MONITORING']),
    },
    {
        id: 'psu-corsair-rm850x',
        storeId: initialStore.id,
        sku: 'COR-RM850X-GOLD-SHFT',
        name: 'Corsair RM850x Shift 850W Gold Modular',
        category: 'PSU',
        watts: 850,
        price: 149,
        stockQuantity: 21,
        lowStockThreshold: 5,
        status: 'ACTIVE',
        image: '/images/components/corsair-rm850x-shift-850w-gold_no_bg.png',
        tags: JSON.stringify(['850W GOLD', 'SIDE CABLE INTERFACE', 'ZERO RPM FAN MODE']),
    },
    // Displays
    {
        id: 'mon-msi-27',
        storeId: initialStore.id,
        sku: 'MSI-MAG-275QF-180',
        name: 'MSI MAG 275QF 27" 1440p 180Hz Rapid IPS Gaming Monitor',
        category: 'Display',
        watts: 45,
        price: 249,
        stockQuantity: 14,
        lowStockThreshold: 3,
        status: 'ACTIVE',
        image: '/images/components/msi-mag-275qf-27-inch-gaming-monitor_no_bg.png',
        tags: JSON.stringify(['27" 2560X1440', '180HZ 0.5MS', 'RAPID IPS', 'ADAPTIVE SYNC']),
    },
];
export const initialRules = [
    {
        id: 'rule-socket-am5-lga',
        storeId: initialStore.id,
        name: 'CPU to Motherboard Socket Alignment',
        sourceCategory: 'CPU',
        targetCategory: 'Motherboard',
        ruleType: 'SOCKET_MATCH',
        severity: 'BLOCKING',
        description: 'Enforce exact socket parity (AM5 to AM5, LGA1700 to LGA1700). Reject mismatched pairings before checkout.',
        isActive: true,
    },
    {
        id: 'rule-power-envelope-125',
        storeId: initialStore.id,
        name: 'Power Envelope & Transient Headroom',
        sourceCategory: 'GPU',
        targetCategory: 'PSU',
        ruleType: 'POWER_ENVELOPE',
        severity: 'BLOCKING',
        description: 'Selected PSU rated wattage must exceed total system draw + 75W base load multiplied by 1.25x safety factor.',
        isActive: true,
    },
    {
        id: 'rule-gpu-chassis-clearance',
        storeId: initialStore.id,
        name: 'GPU Physical Chassis Clearance',
        sourceCategory: 'GPU',
        targetCategory: 'Case',
        ruleType: 'CLEARANCE_LENGTH',
        severity: 'BLOCKING',
        description: 'Flag cases where maximum supported GPU clearance length is shorter than the graphics card physical dimensions.',
        isActive: true,
    },
    {
        id: 'rule-ddr5-motherboard-standard',
        storeId: initialStore.id,
        name: 'Memory Bus Architecture Validation',
        sourceCategory: 'RAM',
        targetCategory: 'Motherboard',
        ruleType: 'FORM_FACTOR',
        severity: 'WARNING',
        description: 'Ensure memory generation matches motherboard bus capability (DDR5 vs DDR4 topologies).',
        isActive: true,
    },
];
export const initialBuilds = [
    {
        id: 'build-rf-9082',
        storeId: initialStore.id,
        orderNumber: '#RF-9082',
        customerName: 'Marcus Vance',
        profile: 'CREATOR',
        itemsJson: JSON.stringify(['cpu-14900k', 'mb-z790-dark-hero', 'gpu-4090-rog', 'ram-gskill-64-6000', 'cool-nzxt-kraken-elite', 'case-fractal-north-xl', 'psu-seasonic-tx1300']),
        totalWatts: 835,
        recommendedPsu: 1044,
        totalPrice: 4334,
        riskScore: 'LOW',
        status: 'APPROVED',
    },
    {
        id: 'build-rf-9083',
        storeId: initialStore.id,
        orderNumber: '#RF-9083',
        customerName: 'Aria Takahashi',
        profile: 'AI DEV',
        itemsJson: JSON.stringify(['cpu-7950x', 'mb-x670e-hero', 'gpu-4080s-proart', 'ram-gskill-64-6000', 'cool-corsair-h150i', 'case-lianli-o11d-evo', 'psu-corsair-hx1000i']),
        totalWatts: 647,
        recommendedPsu: 809,
        totalPrice: 3264,
        riskScore: 'LOW',
        status: 'IN_ASSEMBLY',
    },
    {
        id: 'build-rf-9084',
        storeId: initialStore.id,
        orderNumber: '#RF-9084',
        customerName: 'Devon Reed',
        profile: 'ESPORTS',
        itemsJson: JSON.stringify(['cpu-7800x3d', 'mb-b650-tuf', 'gpu-4070s-dual', 'ram-corsair-32-6000', 'cool-nh-d15-chromax', 'case-nzxt-h9-flow', 'psu-corsair-rm850x']),
        totalWatts: 472,
        recommendedPsu: 590,
        totalPrice: 1914,
        riskScore: 'LOW',
        status: 'COMPLETED',
    },
    {
        id: 'build-rf-9085',
        storeId: initialStore.id,
        orderNumber: '#RF-9085',
        customerName: 'Kaelen Thorne',
        profile: 'CUSTOM',
        itemsJson: JSON.stringify(['cpu-14900k', 'mb-z790-dark-hero', 'gpu-4090-rog', 'ram-gskill-64-6000', 'cool-nh-d15-chromax', 'case-fractal-north-xl', 'psu-corsair-rm850x']),
        totalWatts: 820,
        recommendedPsu: 1025,
        totalPrice: 3984,
        riskScore: 'HIGH',
        status: 'PENDING_VERIFICATION',
    },
];
export const initialActivityLogs = [
    {
        id: 'log-001',
        storeId: initialStore.id,
        actionType: 'STOCK_RESTOCK',
        entityType: 'COMPONENT',
        description: 'Auto-restocked ASUS Dual RTX 4070 Super (+10 units batch PO-841)',
        performedBy: 'Automated Inventory Webhook',
        createdAt: new Date(),
    },
    {
        id: 'log-002',
        storeId: initialStore.id,
        actionType: 'BUILD_VERIFIED',
        entityType: 'BUILD',
        description: 'Merchant manually approved Build #RF-9082 after thermal review',
        performedBy: 'Lead Tech (Alex K.)',
        createdAt: new Date(),
    },
    {
        id: 'log-003',
        storeId: initialStore.id,
        actionType: 'RULE_TOGGLED',
        entityType: 'RULE',
        description: 'Enabled 1.25x Power Envelope safety headroom policy',
        performedBy: 'Store Admin',
        createdAt: new Date(),
    },
];
export async function seedDatabase() {
    if (!db) {
        console.warn('[Seed] Database connection not ready.');
        return;
    }
    console.log('[Seed] Seeding database...');
    try {
        // 1. Seed Store
        await db.insert(stores).values(initialStore).onDuplicateKeyUpdate({
            set: { shopDomain: initialStore.shopDomain },
        });
        console.log('✔ Stores seeded');
        // 2. Seed Components
        for (const comp of initialComponents) {
            await db.insert(components).values(comp).onDuplicateKeyUpdate({
                set: {
                    stockQuantity: comp.stockQuantity,
                    price: comp.price,
                    status: comp.status,
                },
            });
        }
        console.log(`✔ ${initialComponents.length} Components seeded`);
        // 3. Seed Rules
        for (const rule of initialRules) {
            await db.insert(compatibilityRules).values(rule).onDuplicateKeyUpdate({
                set: {
                    isActive: rule.isActive,
                    description: rule.description,
                },
            });
        }
        console.log(`✔ ${initialRules.length} Compatibility Rules seeded`);
        // 4. Seed Builds
        for (const build of initialBuilds) {
            await db.insert(customBuilds).values(build).onDuplicateKeyUpdate({
                set: {
                    status: build.status,
                    riskScore: build.riskScore,
                },
            });
        }
        console.log(`✔ ${initialBuilds.length} Custom Builds seeded`);
        // 5. Seed Activity Logs
        for (const log of initialActivityLogs) {
            await db.insert(activityLogs).values(log).onDuplicateKeyUpdate({
                set: {
                    description: log.description,
                },
            });
        }
        console.log(`✔ ${initialActivityLogs.length} Activity Logs seeded`);
        console.log('[Seed] Database seeding completed successfully!');
    }
    catch (error) {
        console.error('[Seed] Seeding failed with error:', error);
        throw error;
    }
}
// Auto-run if executed directly via tsx
if (process.argv[1]?.includes('seed.ts') || process.argv[1]?.includes('seed.js')) {
    seedDatabase()
        .then(() => {
        console.log('[Seed] Done.');
        if (pool)
            pool.end();
        process.exit(0);
    })
        .catch((err) => {
        console.error(err);
        if (pool)
            pool.end();
        process.exit(1);
    });
}
