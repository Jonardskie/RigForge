import React, { useState } from 'react';
import { CustomBuild, ComponentItem } from '../types';
import { RigForgeAPI } from '../services/api';
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Check
} from 'lucide-react';

interface OrdersManagerProps {
  builds: CustomBuild[];
  components?: ComponentItem[];
  onRefresh: () => void;
  onShowNotice: (msg: string) => void;
}

export const OrdersManager: React.FC<OrdersManagerProps> = ({
  builds,
  onRefresh,
  onShowNotice,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'DISPATCHED'>('ALL');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredBuilds = builds.filter(b => {
    if (filter === 'PENDING') return b.status !== 'DISPATCHED' && b.status !== 'COMPLETED';
    if (filter === 'DISPATCHED') return b.status === 'DISPATCHED' || b.status === 'COMPLETED';
    return true;
  });

  const handleFulfillAndDeduct = async (build: CustomBuild) => {
    setProcessingId(build.id);
    try {
      const result = await RigForgeAPI.fulfillAndDeductStock(build.id);
      onShowNotice(`✔ Dispatched Order ${build.orderNumber} (${build.customerName})! Stock deducted for: ${result.deductedItems.join(', ') || 'configured hardware bundle'}`);
      onRefresh();
    } catch (err: any) {
      onShowNotice(`✕ Fulfillment error: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleVerify = async (id: string) => {
    await RigForgeAPI.verifyBuild(id);
    onShowNotice('✔ Build verified & approved for assembly');
    onRefresh();
  };

  return (
    <div>
      {/* Header Summary & Filter Bar */}
      <section className="admin-card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="admin-eyebrow">Order Fulfillment & Assembly Pipeline</span>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '4px 0 6px' }}>
              Custom System Orders & Live Inventory Depletion
            </h2>
            <p style={{ color: 'var(--text-sub)', fontSize: 13, maxWidth: 740, lineHeight: 1.5, margin: 0 }}>
              Orders configured on the storefront appear here in real time. Fulfilling an order decrements stock quantities of the CPU, GPU, motherboard, RAM, and PSU automatically.
            </p>
          </div>
          
          <div className="segmented-control">
            <button
              className={filter === 'ALL' ? 'active' : ''}
              onClick={() => setFilter('ALL')}
            >
              All ({builds.length})
            </button>
            <button
              className={filter === 'PENDING' ? 'active' : ''}
              onClick={() => setFilter('PENDING')}
            >
              Pending ({builds.filter(b => b.status !== 'DISPATCHED' && b.status !== 'COMPLETED').length})
            </button>
            <button
              className={filter === 'DISPATCHED' ? 'active' : ''}
              onClick={() => setFilter('DISPATCHED')}
            >
              Dispatched ({builds.filter(b => b.status === 'DISPATCHED' || b.status === 'COMPLETED').length})
            </button>
          </div>
        </div>
      </section>

      {/* Orders Grid / Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredBuilds.map((build) => {
          const isDispatched = build.status === 'DISPATCHED' || build.status === 'COMPLETED';
          const partsList = Object.entries(build.components || {}).filter(([_, v]) => Boolean(v));

          return (
            <article
              key={build.id}
              className="admin-card"
              style={{
                padding: 22,
                borderLeft: isDispatched ? '3px solid var(--accent-emerald)' : '3px solid var(--brand-primary)',
                marginBottom: 0
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700, fontFamily: 'var(--font-mono)', margin: 0 }}>
                      {build.orderNumber}
                    </h3>
                    <span className="status-badge neutral">{build.profile}</span>
                    <span className={`status-badge ${build.riskScore === 'HIGH' ? 'danger' : build.riskScore === 'MEDIUM' ? 'warning' : ''}`}>
                      ● {build.riskScore} Risk
                    </span>
                    <span className={`status-badge ${isDispatched ? '' : 'pending'}`}>
                      {isDispatched ? 'Dispatched' : build.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-sub)', marginTop: 5 }}>
                    Customer: <strong style={{ color: 'var(--text-main)', fontWeight: 600 }}>{build.customerName}</strong> · Power: <strong style={{ fontFamily: 'var(--font-mono)' }}>{build.totalWatts}W Draw</strong> ({build.recommendedPsu}W PSU Req)
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="admin-eyebrow">Order Total</span>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--brand-primary)', fontFamily: 'var(--font-head)' }}>
                    ${build.totalPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Hardware Components Manifest */}
              <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: 16 }}>
                <span className="admin-eyebrow" style={{ display: 'block', marginBottom: 8, fontSize: 10 }}>Hardware Bill of Materials</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
                  {partsList.map(([key, val]) => (
                    <div key={key} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, background: '#FFFFFF', padding: '4px 8px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', minWidth: 44, fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{key}</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions & Status Footnote */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {isDispatched ? (
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={13} />
                      Hardware bundled & inventory decremented in live catalog.
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={13} />
                      Awaiting workbench assembly & stock release.
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {build.status === 'PENDING_VERIFICATION' && (
                    <button
                      className="admin-btn-outline"
                      style={{ height: 32, fontSize: 12 }}
                      onClick={() => handleVerify(build.id)}
                    >
                      <ShieldCheck size={13} />
                      <span>Verify Design</span>
                    </button>
                  )}

                  {!isDispatched ? (
                    <button
                      className="admin-btn-primary"
                      style={{ height: 32, padding: '0 14px', fontSize: 12, fontWeight: 600 }}
                      disabled={processingId === build.id}
                      onClick={() => handleFulfillAndDeduct(build)}
                    >
                      <Package size={13} />
                      <span>{processingId === build.id ? 'Deducting Stock...' : 'Fulfill & Deduct Stock'}</span>
                    </button>
                  ) : (
                    <button className="admin-btn-outline" style={{ height: 32, fontSize: 12, opacity: 0.8, cursor: 'default' }} disabled>
                      <Check size={13} />
                      <span>Fulfilled & Dispatched</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {filteredBuilds.length === 0 && (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)', background: '#FFFFFF' }}>
            No orders found matching the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};

