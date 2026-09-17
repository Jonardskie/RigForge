import React, { useState } from 'react';
import { ComponentItem } from '../types';
import { RigForgeAPI } from '../services/api';
import { 
  Search, 
  Plus, 
  RotateCw, 
  X
} from 'lucide-react';

interface ComponentManagerProps {
  components: ComponentItem[];
  onRefresh: () => void;
  onOpenCreateModal: () => void;
}

export const ComponentManager: React.FC<ComponentManagerProps> = ({
  components,
  onRefresh,
  onOpenCreateModal,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [restockModalItem, setRestockModalItem] = useState<ComponentItem | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(10);

  const categories: string[] = ['ALL', 'CPU', 'Motherboard', 'GPU', 'RAM', 'Cooler', 'Case', 'PSU', 'Display'];

  const filtered = components.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockModalItem) return;
    const newTotal = restockModalItem.stockQuantity + Number(restockAmount);
    await RigForgeAPI.updateStock(restockModalItem.id, newTotal);
    setRestockModalItem(null);
    onRefresh();
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="admin-toolbar">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="admin-search">
            <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by hardware name or SKU..."
            />
          </div>

          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`filter-chip ${selectedCategory === c ? 'active' : ''}`}
                onClick={() => setSelectedCategory(c)}
              >
                {c === 'ALL' ? 'All Hardware' : c}
              </button>
            ))}
          </div>
        </div>

        <button className="admin-btn-primary" onClick={onOpenCreateModal}>
          <Plus size={14} />
          <span>Add Hardware SKU</span>
        </button>
      </div>

      {/* Catalog Table */}
      <section className="admin-card">
        <header className="admin-card-header">
          <div>
            <span className="admin-eyebrow">Inventory Registry</span>
            <h2>Component Inventory & Specifications</h2>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {filtered.length} SKUs listed
          </span>
        </header>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Component / Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Specifications</th>
                <th>Unit Price</th>
                <th>Live Stock</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const isLow = item.stockQuantity <= item.lowStockThreshold;
                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {item.image && (
                          <div style={{ width: 38, height: 38, background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 3, flexShrink: 0 }}>
                            <img
                              src={
                                item.image.startsWith('data:') ||
                                item.image.startsWith('http') ||
                                item.image.startsWith('/')
                                  ? item.image
                                  : `/images/${item.image}`
                              }
                              alt={item.name}
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                            />
                          </div>
                        )}
                        <div>
                          <strong style={{ fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>{item.name}</strong>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      {item.sku}
                    </td>
                    <td>
                      <span className="status-badge neutral">{item.category}</span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-sub)', fontSize: 12 }}>
                        {item.socket ? `Socket ${item.socket} · ` : ''}
                        {item.watts ? `${item.watts}W TDP · ` : ''}
                        {item.maxGpuLength ? `${item.maxGpuLength}mm Max GPU · ` : ''}
                        {item.lengthMm ? `${item.lengthMm}mm Length · ` : ''}
                        {item.meta && !item.socket && !item.watts ? item.meta : ''}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${item.price.toLocaleString()}</strong>
                    </td>
                    <td>
                      <span className={`status-badge ${isLow ? 'danger' : ''}`}>
                        ● {item.stockQuantity} in stock
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="admin-btn-outline"
                        style={{ height: 28, padding: '0 10px', fontSize: 11 }}
                        onClick={() => {
                          setRestockModalItem(item);
                          setRestockAmount(10);
                        }}
                      >
                        <RotateCw size={11} />
                        <span>Restock</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                    No hardware components match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Restock Sub-Modal */}
      {restockModalItem && (
        <div className="admin-modal-backdrop" onClick={() => setRestockModalItem(null)}>
          <div className="admin-modal" style={{ width: 440 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow">Inventory Adjustment</span>
                <h2>Restock Hardware SKU</h2>
              </div>
              <button 
                onClick={() => setRestockModalItem(null)} 
                style={{ background: 'none', border: 0, color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ color: 'var(--text-sub)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
              Replenish live stock for <strong style={{ color: 'var(--text-main)' }}>{restockModalItem.name}</strong> ({restockModalItem.sku}).
              Current available: <strong style={{ fontFamily: 'var(--font-mono)' }}>{restockModalItem.stockQuantity} units</strong>.
            </p>

            <form onSubmit={handleRestockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label>Units to Add</label>
                <input
                  type="number"
                  min="1"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Number(e.target.value))}
                  required
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                <button
                  type="button"
                  className="admin-btn-outline"
                  onClick={() => setRestockModalItem(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Confirm Restock (+{restockAmount})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

