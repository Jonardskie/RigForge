import React, { useEffect, useState } from 'react';
import { DashboardMetrics, CustomBuild, ComponentItem } from '../types';
import { RigForgeAPI } from '../services/api';
import { 
  CheckCircle2, 
  ArrowUpRight, 
  Plus
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onOpenNewComponentModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onOpenNewComponentModal }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [builds, setBuilds] = useState<CustomBuild[]>([]);
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [m, b, c] = await Promise.all([
      RigForgeAPI.getMetrics(),
      RigForgeAPI.getBuilds(),
      RigForgeAPI.getComponents(),
    ]);
    setMetrics(m);
    setBuilds(b);
    setComponents(c);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (id: string) => {
    await RigForgeAPI.verifyBuild(id);
    await loadData();
  };

  if (loading || !metrics) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
        Loading dashboard telemetry...
      </div>
    );
  }

  const lowStockItems = components.filter(c => c.stockQuantity <= c.lowStockThreshold);

  return (
    <div>
      {/* Top Metrics Cards */}
      <section className="admin-metrics">
        <article className="admin-metric-card">
          <span>
            Gross Revenue 
            <small>↗ +18.4%</small>
          </span>
          <strong>${metrics.grossRevenue.toLocaleString()}</strong>
          <i>vs $71,140 last 30d window</i>
        </article>
        
        <article className="admin-metric-card">
          <span>
            Orders Processed 
            <small>↗ +12.8%</small>
          </span>
          <strong>{metrics.ordersCount}</strong>
          <i>{metrics.pendingBuildsCount} requiring assembly</i>
        </article>

        <article className="admin-metric-card">
          <span>
            Average Order Value
            <small style={{ color: 'var(--brand-blue)', background: 'var(--brand-blue-subtle)', borderColor: 'var(--brand-blue-border)' }}>Avg</small>
          </span>
          <strong>${metrics.avgOrderValue.toLocaleString()}</strong>
          <i>+$42 per custom rig bundle</i>
        </article>

        <article className={`admin-metric-card ${metrics.lowStockCount > 0 ? 'warning' : ''}`}>
          <span>
            Low Stock Alerts
            {metrics.lowStockCount > 0 && <small>Action</small>}
          </span>
          <strong>{metrics.lowStockCount}</strong>
          <i>{metrics.lowStockCount > 0 ? 'SKUs below safety threshold' : 'All hardware levels optimal'}</i>
        </article>
      </section>

      {/* Revenue Graph & System Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 20, marginBottom: 24 }}>
        <article className="admin-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <span className="admin-eyebrow">Financial Telemetry (Trailing 30 Days)</span>
              <h2 style={{ margin: '3px 0 0', fontSize: 18, fontWeight: 700 }}>Revenue Velocity</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CURRENT MTD</span>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--brand-primary)', fontFamily: 'var(--font-head)' }}>$84,290</div>
            </div>
          </div>
          
          <div style={{ height: 160, position: 'relative', marginTop: 14 }}>
            <svg viewBox="0 0 800 180" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0F172A" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#0F172A" stopOpacity="0.00" />
                </linearGradient>
              </defs>
              {/* Subtle Gridlines */}
              <line x1="0" y1="40" x2="800" y2="40" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="800" y2="90" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="800" y2="140" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
              
              <path 
                d="M0 145 L70 135 L140 140 L220 105 L300 115 L380 85 L460 95 L540 55 L620 65 L700 25 L800 12 L800 180 L0 180 Z" 
                fill="url(#revenueGradient)" 
              />
              <path 
                d="M0 145 L70 135 L140 140 L220 105 L300 115 L380 85 L460 95 L540 55 L620 65 L700 25 L800 12" 
                fill="none" 
                stroke="#0F172A" 
                strokeWidth="2.2" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Data points */}
              <circle cx="220" cy="105" r="3.5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="540" cy="55" r="3.5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="800" cy="12" r="4" fill="#059669" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', font: '11px var(--font-mono)', color: 'var(--text-muted)', marginTop: 8, borderTop: '1px solid var(--border-subtle)', paddingTop: 8 }}>
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4 (Current)</span>
          </div>
        </article>

        <article className="admin-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span className="admin-eyebrow">Automated Rule Engine</span>
            <h2 style={{ margin: '4px 0 10px', fontSize: 18, fontWeight: 700 }}>Compatibility Guardrails</h2>
            <p style={{ color: 'var(--text-sub)', fontSize: 13, lineHeight: 1.55, margin: 0 }}>
              RigForge actively evaluates hardware constraints, motherboard socket alignments, clearance envelope, and transient power overhead across all customer configurations.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
            <button className="admin-btn-outline" onClick={() => onNavigate('Rules')}>
              <ArrowUpRight size={13} />
              <span>Test Matrix Guardrails</span>
            </button>
            <button className="admin-btn-primary" onClick={onOpenNewComponentModal}>
              <Plus size={13} />
              <span>Register Hardware SKU</span>
            </button>
          </div>
        </article>
      </div>

      {/* Live Custom Rig Queue */}
      <section className="admin-card">
        <header className="admin-card-header">
          <div>
            <span className="admin-eyebrow">Storefront Configurations</span>
            <h2>Active Custom Builds & Risk Analysis</h2>
          </div>
          <button className="admin-btn-outline" style={{ height: 32, fontSize: 12 }} onClick={() => onNavigate('Orders')}>
            <span>View All Orders ({builds.length})</span>
            <ArrowUpRight size={13} />
          </button>
        </header>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Workload Profile</th>
                <th>Power Draw</th>
                <th>Risk Assessment</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Fulfillment</th>
              </tr>
            </thead>
            <tbody>
              {builds.slice(0, 8).map((build) => {
                const isDispatched = build.status === 'DISPATCHED' || build.status === 'COMPLETED';
                return (
                  <tr key={build.id}>
                    <td>
                      <strong style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 12 }}>
                        {build.orderNumber}
                      </strong>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500 }}>{build.customerName}</span>
                    </td>
                    <td>
                      <span className="status-badge neutral">{build.profile}</span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                        {build.totalWatts}W <small style={{ color: 'var(--text-muted)' }}>({build.recommendedPsu}W req)</small>
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${build.riskScore === 'HIGH' ? 'danger' : build.riskScore === 'MEDIUM' ? 'warning' : ''}`}>
                        ● {build.riskScore} Risk
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${isDispatched ? '' : 'pending'}`}>
                        {isDispatched ? 'Dispatched' : build.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {build.status === 'PENDING_VERIFICATION' && (
                        <button 
                          className="admin-btn-outline" 
                          style={{ height: 28, padding: '0 10px', fontSize: 11, marginRight: 6 }}
                          onClick={() => handleVerify(build.id)}
                        >
                          Approve ✓
                        </button>
                      )}

                      {!isDispatched ? (
                        <button 
                          className="admin-btn-primary" 
                          style={{ height: 28, padding: '0 12px', fontSize: 11 }}
                          onClick={async () => {
                            const res = await RigForgeAPI.fulfillAndDeductStock(build.id);
                            alert(`✔ Dispatched order ${build.orderNumber}! Stock auto-deducted for: ${res.deductedItems.join(', ') || 'configured components'}`);
                            await loadData();
                          }}
                        >
                          Fulfill 📦
                        </button>
                      ) : (
                        <span style={{ color: 'var(--accent-emerald)', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <CheckCircle2 size={13} />
                          Dispatched
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Low Stock Warning Banner */}
      {lowStockItems.length > 0 && (
        <section className="admin-card" style={{ marginTop: 24 }}>
          <header className="admin-card-header">
            <div>
              <span className="admin-eyebrow" style={{ color: 'var(--accent-amber)' }}>Inventory Alert</span>
              <h2>Items Below Safety Stock ({lowStockItems.length})</h2>
            </div>
            <button className="admin-btn-outline" style={{ height: 32, fontSize: 12 }} onClick={() => onNavigate('Inventory')}>
              <span>Restock Catalog</span>
              <ArrowUpRight size={13} />
            </button>
          </header>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Hardware Component</th>
                  <th>SKU</th>
                  <th>Available Stock</th>
                  <th>Safety Threshold</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item) => (
                  <tr key={item.id}>
                    <td><strong style={{ fontWeight: 600 }}>{item.name}</strong></td>
                    <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{item.sku}</td>
                    <td>
                      <span className="status-badge danger">
                        ● {item.stockQuantity} units remaining
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{item.lowStockThreshold} units min</td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="admin-btn-outline" 
                        style={{ height: 28, padding: '0 10px', fontSize: 11 }}
                        onClick={() => onNavigate('Inventory')}
                      >
                        Restock ↗
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

