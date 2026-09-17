import React, { useState } from 'react';
import { ActivityLog } from '../types';

interface ActivityFeedProps {
  logs: ActivityLog[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ logs }) => {
  const [filter, setFilter] = useState<string>('ALL');

  const filtered = logs.filter((log) => {
    if (filter === 'ALL') return true;
    return log.actionType === filter;
  });

  return (
    <div>
      <section className="admin-card">
        <header className="admin-card-header">
          <div>
            <span className="admin-eyebrow">Audit & Telemetry Log</span>
            <h2>System & Merchant Activity History</h2>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Events' },
              { id: 'STOCK_RESTOCK', label: 'Restocks' },
              { id: 'BUILD_VERIFIED', label: 'Verified Builds' },
              { id: 'RULE_CREATED', label: 'Rules' },
              { id: 'COMPONENT_ADDED', label: 'New Components' },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                className={`filter-chip ${filter === type.id ? 'active' : ''}`}
                onClick={() => setFilter(type.id)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </header>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action Type</th>
                <th>Entity Target</th>
                <th>Description of Event</th>
                <th>Actor</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--text-muted)', width: 140, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                    {item.timestamp}
                  </td>
                  <td>
                    <span className="status-badge neutral">
                      {item.actionType.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--brand-primary)', fontWeight: 600, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                      {item.entityType}
                    </span>
                  </td>
                  <td>
                    <strong style={{ fontWeight: 500, color: 'var(--text-main)' }}>{item.description}</strong>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{item.performedBy}</td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                    No audit records match the selected category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

