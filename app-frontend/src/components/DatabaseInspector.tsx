import React, { useState } from 'react';
import { ComponentItem, CustomBuild, CompatibilityRule, ActivityLog } from '../types';
import { Table } from 'lucide-react';

interface DatabaseInspectorProps {
  components: ComponentItem[];
  builds: CustomBuild[];
  rules: CompatibilityRule[];
  logs: ActivityLog[];
}

export const DatabaseInspector: React.FC<DatabaseInspectorProps> = ({
  components,
  builds,
  rules,
  logs,
}) => {
  const [selectedTable, setSelectedTable] = useState<
    'components' | 'custom_builds' | 'compatibility_rules' | 'activity_logs' | 'stores'
  >('components');

  const tableMetadata = {
    components: {
      name: 'components',
      description: 'Hardware Catalog & Live Inventory Thresholds',
      rowCount: components.length,
    },
    custom_builds: {
      name: 'custom_builds',
      description: 'Customer PC Orders & Risk Scoring Manifests',
      rowCount: builds.length,
    },
    compatibility_rules: {
      name: 'compatibility_rules',
      description: 'Hardware Constraint Matrix & Safety Rules',
      rowCount: rules.length,
    },
    activity_logs: {
      name: 'activity_logs',
      description: 'Immutable Audit Trail & System Actions',
      rowCount: logs.length,
    },
    stores: {
      name: 'stores',
      description: 'Shopify Store Registry & Multi-Tenant Tokens',
      rowCount: 1,
    },
  };

  return (
    <div>
      {/* Header Info */}
      <section className="admin-card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="admin-eyebrow">Drizzle ORM / MySQL Schema Inspector</span>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '4px 0 0' }}>
              Relational Database Tables & Live Row Inspector
            </h2>
          </div>

          <div className="segmented-control">
            {(['components', 'custom_builds', 'compatibility_rules', 'activity_logs', 'stores'] as const).map((tbl) => (
              <button
                key={tbl}
                className={selectedTable === tbl ? 'active' : ''}
                onClick={() => setSelectedTable(tbl)}
              >
                {tbl} ({tableMetadata[tbl].rowCount})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Table Schema Header */}
      <section className="admin-card">
        <header className="admin-card-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Table size={16} style={{ color: 'var(--brand-blue)' }} />
              <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 15 }}>table: {selectedTable}</h2>
              <span className="status-badge neutral">{tableMetadata[selectedTable].rowCount} rows</span>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, display: 'block' }}>
              {tableMetadata[selectedTable].description}
            </span>
          </div>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            Engine: Drizzle ORM + MySQL Core
          </div>
        </header>

        {/* Live Table Rows */}
        <div className="admin-table-wrap">
          {selectedTable === 'components' && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>id</th>
                  <th>sku</th>
                  <th>name</th>
                  <th>category</th>
                  <th>socket</th>
                  <th>watts</th>
                  <th>price ($)</th>
                  <th>stock_qty</th>
                  <th>threshold</th>
                  <th>status</th>
                </tr>
              </thead>
              <tbody>
                {components.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{c.id}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600 }}>{c.sku}</td>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td><span className="status-badge neutral">{c.category}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{c.socket || 'NULL'}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{c.watts ? `${c.watts}W` : 'NULL'}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${c.price}</td>
                    <td><strong style={{ color: c.stockQuantity <= c.lowStockThreshold ? 'var(--accent-amber)' : 'inherit' }}>{c.stockQuantity}</strong></td>
                    <td style={{ color: 'var(--text-muted)' }}>{c.lowStockThreshold}</td>
                    <td><span className="status-badge">{c.status || 'ACTIVE'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTable === 'custom_builds' && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>id</th>
                  <th>order_number</th>
                  <th>customer_name</th>
                  <th>profile</th>
                  <th>total_watts</th>
                  <th>recommended_psu</th>
                  <th>total_price ($)</th>
                  <th>risk_score</th>
                  <th>status</th>
                </tr>
              </thead>
              <tbody>
                {builds.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{b.id}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600 }}>{b.orderNumber}</td>
                    <td><strong>{b.customerName}</strong></td>
                    <td><span className="status-badge neutral">{b.profile}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{b.totalWatts}W</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{b.recommendedPsu}W</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${b.totalPrice.toLocaleString()}</td>
                    <td><span className={`status-badge ${b.riskScore === 'HIGH' ? 'danger' : b.riskScore === 'MEDIUM' ? 'warning' : ''}`}>{b.riskScore}</span></td>
                    <td><span className="status-badge">{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTable === 'compatibility_rules' && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>id</th>
                  <th>name</th>
                  <th>source_category</th>
                  <th>target_category</th>
                  <th>rule_type</th>
                  <th>severity</th>
                  <th>description</th>
                  <th>is_active</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{r.id}</td>
                    <td><strong>{r.name}</strong></td>
                    <td><span className="status-badge neutral">{r.sourceCategory}</span></td>
                    <td><span className="status-badge neutral">{r.targetCategory}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{r.ruleType}</td>
                    <td><span className={`status-badge ${r.severity === 'BLOCKING' ? 'danger' : 'warning'}`}>{r.severity}</span></td>
                    <td style={{ color: 'var(--text-sub)', fontSize: 12, maxWidth: 320 }}>{r.description}</td>
                    <td><span className="status-badge">{r.isActive ? 'TRUE' : 'FALSE'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTable === 'activity_logs' && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>id</th>
                  <th>timestamp</th>
                  <th>action_type</th>
                  <th>entity_type</th>
                  <th>description</th>
                  <th>performed_by</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{l.id}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{l.timestamp}</td>
                    <td><span className="status-badge neutral">{l.actionType}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600 }}>{l.entityType}</td>
                    <td><strong>{l.description}</strong></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{l.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTable === 'stores' && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>id</th>
                  <th>shop_domain</th>
                  <th>access_token</th>
                  <th>installed_at</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>store_rigforge_prod_01</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--brand-blue)' }}>rigforge-zh662akf.myshopify.com</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: 11 }}>shpat_live_rigforge_secure_token_demo</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>2026-09-17 00:00:00</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};
