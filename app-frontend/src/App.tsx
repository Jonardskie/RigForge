import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  ShieldCheck, 
  History, 
  Database,
  RefreshCw, 
  ExternalLink, 
  Plus, 
  Upload, 
  Link2, 
  X, 
  CheckCircle2
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { ComponentManager } from './components/ComponentManager';
import { OrdersManager } from './components/OrdersManager';
import { CompatibilityMatrix } from './components/CompatibilityMatrix';
import { ActivityFeed } from './components/ActivityFeed';
import { DatabaseInspector } from './components/DatabaseInspector';
import { ComponentItem, CompatibilityRule, ActivityLog, ComponentCategory, CustomBuild } from './types';
import { RigForgeAPI } from './services/api';
import './styles/admin.css';

// Catalog of Transparent Hardware Photo Assets
const HARDWARE_PHOTO_PRESETS: { name: string; file: string; category: ComponentCategory; watts?: number; socket?: string; defaultPrice?: number }[] = [
  // GPUs
  { name: 'RTX 5080 Founders Edition', file: 'NVIDIA GeForce RTX 5080 Founders Edition_no_bg.png', category: 'GPU', watts: 360, defaultPrice: 1199 },
  { name: 'GeForce RTX 5070 Ti OC Edition', file: 'GeForce RTX 5070 Ti OC Edition_no_bg.png', category: 'GPU', watts: 285, defaultPrice: 749 },
  { name: 'Radeon RX 9060 XT 16GB', file: 'XFX Swift OC Radeon RX 9060 XT 16 GB Video Card_no_bg.png', category: 'GPU', watts: 220, defaultPrice: 529 },
  // CPUs
  { name: 'AMD Ryzen 9 9950X', file: 'AMD Ryzen 9 9950X_no_bg.png', category: 'CPU', watts: 170, socket: 'AM5', defaultPrice: 649 },
  { name: 'AMD Ryzen 7 7800X3D', file: 'AMD Ryzen 7 7800X3D_no_bg.png', category: 'CPU', watts: 120, socket: 'AM5', defaultPrice: 389 },
  { name: 'Intel Core i7-14700K', file: 'Intel Core i7-14700K_no_bg.png', category: 'CPU', watts: 253, socket: 'LGA1700', defaultPrice: 399 },
  // Motherboards
  { name: 'Gigabyte X670E AORUS Master', file: 'Gigabyte X670E AORUS Master_no_bg.png', category: 'Motherboard', socket: 'AM5', defaultPrice: 429 },
  { name: 'ASRock B650E Steel Legend', file: 'ASRock B650E Steel Legend_no_bg.png', category: 'Motherboard', socket: 'AM5', defaultPrice: 239 },
  { name: 'ASUS ROG Maximus Z790 Hero', file: 'ASUS ROG Maximus Z790 Hero_no_bg.png', category: 'Motherboard', socket: 'LGA1700', defaultPrice: 549 },
  // RAM
  { name: 'Corsair Vengeance RGB 64GB DDR5', file: 'Corsair Vengeance RGB 64 GB (2 x 32 GB) DDR5-6000 CL30 Memory_no_bg.png', category: 'RAM', watts: 15, defaultPrice: 209 },
  { name: 'Kingston FURY Beast 32GB DDR5', file: 'Kingston FURY Beast 32 GB (2 x 16 GB) DDR5-6000 CL30 Memory_no_bg.png', category: 'RAM', watts: 10, defaultPrice: 119 },
  // Coolers
  { name: 'Arctic Liquid Freezer III 360', file: 'Arctic Liquid Freezer III 360_no_bg.png', category: 'Cooler', watts: 25, defaultPrice: 119 },
  { name: 'DeepCool AK620 Digital', file: 'DeepCool AK620 Digital_no_bg.png', category: 'Cooler', watts: 10, defaultPrice: 79 },
  // Cases
  { name: 'Fractal Design North XL Mesh', file: 'Fractal Design North XL Mesh_no_bg.png', category: 'Case', defaultPrice: 179 },
  { name: 'Lian Li O11 Vision', file: 'Lian Li O11 Vision_no_bg.png', category: 'Case', defaultPrice: 139 },
  { name: 'Lian Li Vector V100R ATX', file: 'Lian Li Vector V100R ATX Mid Tower Case_no_bg.png', category: 'Case', defaultPrice: 119 },
  // PSUs
  { name: 'Corsair RM850x Shift Gold', file: 'Corsair RM850x Shift_no_bg.png', category: 'PSU', watts: 850, defaultPrice: 149 },
  { name: 'Seasonic Vertex GX-1000 ATX 3.0', file: 'Seasonic Vertex GX-1000_no_bg.png', category: 'PSU', watts: 1000, defaultPrice: 199 },
  // Displays
  { name: 'Asus ROG Strix OLED Gaming Monitor', file: 'Asus ROG Strix OLEDMonitor_no_bg.png', category: 'Display', defaultPrice: 899 },
  { name: 'MSI MAG 275QF 27" 1440p', file: 'MSI MAG 275QF_no_bg.png', category: 'Display', defaultPrice: 249 },
  { name: 'MSI MAG 244F 24" 1080p', file: 'MSI MAG 244F_no_bg.png', category: 'Display', defaultPrice: 169 },
];

export function App() {
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Inventory' | 'Orders' | 'Rules' | 'Activity' | 'Database'>('Dashboard');
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [rules, setRules] = useState<CompatibilityRule[]>([]);
  const [builds, setBuilds] = useState<CustomBuild[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [alertNotice, setAlertNotice] = useState<string | null>(null);

  // New Component Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSourceMode, setImageSourceMode] = useState<'gallery' | 'upload' | 'url'>('gallery');
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [selectedPhotoFilter, setSelectedPhotoFilter] = useState<string>('ALL');
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'GPU' as ComponentCategory,
    meta: '',
    socket: '',
    watts: 0,
    price: 0,
    stockQuantity: 10,
    lowStockThreshold: 5,
    maxGpuLength: 0,
    lengthMm: 0,
    image: 'NVIDIA GeForce RTX 5080 Founders Edition_no_bg.png',
  });

  const loadAllData = async () => {
    const [c, r, b, l] = await Promise.all([
      RigForgeAPI.getComponents(),
      RigForgeAPI.getRules(),
      RigForgeAPI.getBuilds(),
      RigForgeAPI.getActivityLogs(),
    ]);
    setComponents(c);
    setRules(r);
    setBuilds(b);
    setLogs(l);
  };

  useEffect(() => {
    loadAllData();
    const interval = setInterval(() => {
      loadAllData();
    }, 3500);

    const onFocus = () => loadAllData();
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const handleSelectPresetPhoto = (preset: typeof HARDWARE_PHOTO_PRESETS[0]) => {
    setFormData((prev) => ({
      ...prev,
      name: prev.name || preset.name,
      sku: prev.sku || `${preset.category.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`,
      category: preset.category,
      watts: preset.watts || prev.watts,
      socket: preset.socket || prev.socket,
      price: preset.defaultPrice || prev.price,
      image: preset.file,
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) return;

    await RigForgeAPI.createComponent({
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      meta: formData.meta || `${formData.category} · ${formData.watts ? `${formData.watts}W` : ''} · ${formData.socket || ''}`,
      socket: formData.socket || undefined,
      watts: formData.watts > 0 ? formData.watts : undefined,
      maxGpuLength: formData.maxGpuLength > 0 ? formData.maxGpuLength : undefined,
      lengthMm: formData.lengthMm > 0 ? formData.lengthMm : undefined,
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity),
      lowStockThreshold: Number(formData.lowStockThreshold),
      status: 'ACTIVE',
      image: formData.image,
    });

    setIsModalOpen(false);
    setFormData({
      name: '',
      sku: '',
      category: 'GPU',
      meta: '',
      socket: '',
      watts: 0,
      price: 0,
      stockQuantity: 10,
      lowStockThreshold: 5,
      maxGpuLength: 0,
      lengthMm: 0,
      image: 'NVIDIA GeForce RTX 5080 Founders Edition_no_bg.png',
    });
    setAlertNotice(`Successfully registered new hardware item: ${formData.name}`);
    await loadAllData();
  };

  const lowStockCount = components.filter(c => c.stockQuantity <= c.lowStockThreshold).length;
  const pendingOrdersCount = builds.filter(b => b.status !== 'DISPATCHED' && b.status !== 'COMPLETED').length;

  const filteredPhotos = selectedPhotoFilter === 'ALL'
    ? HARDWARE_PHOTO_PRESETS
    : HARDWARE_PHOTO_PRESETS.filter(p => p.category === selectedPhotoFilter);

  return (
    <div className="admin-shell">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-main">
            <div className="admin-brand-logo-badge">
              RF
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>RigForge</div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ADMIN HUB</span>
            </div>
          </div>
          <span className="admin-brand-badge">LIVE</span>
        </div>

        <div className="admin-nav-label">Management</div>

        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('Dashboard')}
          >
            <LayoutDashboard size={15} />
            <span>Dashboard</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'Inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('Inventory')}
          >
            <Package size={15} />
            <span>Hardware Catalog</span>
            {lowStockCount > 0 && <em>{lowStockCount} low</em>}
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'Orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('Orders')}
          >
            <ShoppingCart size={15} />
            <span>Build Orders</span>
            {pendingOrdersCount > 0 && <em>{pendingOrdersCount}</em>}
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'Rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('Rules')}
          >
            <ShieldCheck size={15} />
            <span>Compatibility Matrix</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'Activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('Activity')}
          >
            <History size={15} />
            <span>Audit Logs</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'Database' ? 'active' : ''}`}
            onClick={() => setActiveTab('Database')}
          >
            <Database size={15} />
            <span>Database Schema</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <a href="http://127.0.0.1:9292" target="_blank" rel="noopener noreferrer" className="storefront-jump-link">
            <span>Customer Storefront</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>:9292 ↗</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 6px', font: '11px var(--font-mono)', color: 'var(--text-muted)' }}>
            <span className="status-dot-pulse" />
            <span>Sync Engine: Active</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Top Navbar */}
        <header className="admin-topbar">
          <div>
            <span className="admin-eyebrow">
              Store Administration / {activeTab === 'Rules' ? 'Compatibility' : activeTab === 'Orders' ? 'Orders' : activeTab === 'Database' ? 'Database Inspector' : activeTab}
            </span>
            <h1>
              {activeTab === 'Dashboard' && 'Store Overview'}
              {activeTab === 'Inventory' && 'Hardware Catalog'}
              {activeTab === 'Orders' && 'Build Orders & Assembly'}
              {activeTab === 'Rules' && 'Hardware Compatibility Engine'}
              {activeTab === 'Activity' && 'System Audit Logs'}
              {activeTab === 'Database' && 'Relational Database Schema & Tables'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={async () => {
                await RigForgeAPI.resetAndSyncCatalog();
                await loadAllData();
                setAlertNotice('✔ Database synchronized with canonical catalog (21 hardware components ready).');
              }}
              className="admin-btn-outline"
              style={{ height: 36, fontSize: 12 }}
            >
              <RefreshCw size={14} />
              <span>Sync Database</span>
            </button>

            <a
              href="http://127.0.0.1:9292"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn-primary"
              style={{ height: 36, fontSize: 12, textDecoration: 'none' }}
            >
              <ExternalLink size={14} />
              <span>Open Storefront (:9292)</span>
            </a>
          </div>
        </header>

        {/* Global Notice Alert */}
        {alertNotice && (
          <div className="admin-alert">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} />
              <span>{alertNotice}</span>
            </div>
            <button
              onClick={() => setAlertNotice(null)}
              style={{ background: 'none', border: 0, color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Content Tabs */}
        {activeTab === 'Dashboard' && (
          <Dashboard
            onNavigate={(tab) => setActiveTab(tab as any)}
            onOpenNewComponentModal={() => setIsModalOpen(true)}
          />
        )}

        {activeTab === 'Inventory' && (
          <ComponentManager
            components={components}
            onRefresh={loadAllData}
            onOpenCreateModal={() => setIsModalOpen(true)}
          />
        )}

        {activeTab === 'Orders' && (
          <OrdersManager
            builds={builds}
            components={components}
            onRefresh={loadAllData}
            onShowNotice={(msg) => setAlertNotice(msg)}
          />
        )}

        {activeTab === 'Rules' && (
          <CompatibilityMatrix
            rules={rules}
            components={components}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === 'Activity' && (
          <ActivityFeed logs={logs} />
        )}

        {activeTab === 'Database' && (
          <DatabaseInspector
            components={components}
            builds={builds}
            rules={rules}
            logs={logs}
          />
        )}
      </main>

      {/* Product Creation Modal */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: 720 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow">Catalog Management</span>
                <h2>Add Hardware Component</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 0, color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '78vh', overflowY: 'auto', paddingRight: 4 }}>
              {/* Photo Selector */}
              <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', padding: 16, borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>Hardware Image</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => setImageSourceMode('gallery')}
                      className={imageSourceMode === 'gallery' ? 'admin-btn-primary' : 'admin-btn-outline'}
                      style={{ height: 28, fontSize: 11, padding: '0 10px' }}
                    >
                      Preset Catalog
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSourceMode('upload')}
                      className={imageSourceMode === 'upload' ? 'admin-btn-primary' : 'admin-btn-outline'}
                      style={{ height: 28, fontSize: 11, padding: '0 10px' }}
                    >
                      <Upload size={12} />
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSourceMode('url')}
                      className={imageSourceMode === 'url' ? 'admin-btn-primary' : 'admin-btn-outline'}
                      style={{ height: 28, fontSize: 11, padding: '0 10px' }}
                    >
                      <Link2 size={12} />
                      Image URL
                    </button>
                  </div>
                </div>

                {/* Mode 1: Preset Gallery */}
                {imageSourceMode === 'gallery' && (
                  <div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                      {['ALL', 'GPU', 'CPU', 'Motherboard', 'RAM', 'Cooler', 'Case', 'PSU', 'Display'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedPhotoFilter(cat)}
                          className={`filter-chip ${selectedPhotoFilter === cat ? 'active' : ''}`}
                          style={{ padding: '3px 9px', fontSize: 11 }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))', gap: 8, maxHeight: 150, overflowY: 'auto', padding: 8, background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                      {filteredPhotos.map((photo) => (
                        <div
                          key={photo.file}
                          onClick={() => handleSelectPresetPhoto(photo)}
                          title={photo.name}
                          style={{
                            background: formData.image === photo.file ? 'var(--brand-blue-subtle)' : 'var(--bg-app)',
                            border: `1px solid ${formData.image === photo.file ? 'var(--brand-blue)' : 'var(--border-subtle)'}`,
                            padding: 6,
                            textAlign: 'center',
                            cursor: 'pointer',
                            borderRadius: 'var(--radius-sm)',
                            transition: 'all 0.12s ease',
                          }}
                        >
                          <img
                            src={`/images/${photo.file}`}
                            alt={photo.name}
                            style={{ width: '100%', height: 38, objectFit: 'contain' }}
                          />
                          <small style={{ fontSize: 10, color: formData.image === photo.file ? 'var(--brand-blue)' : 'var(--text-sub)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 4, fontWeight: 600 }}>
                            {photo.name.split(' ')[0]}
                          </small>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mode 2: Device File Upload */}
                {imageSourceMode === 'upload' && (
                  <div
                    style={{
                      border: '2px dashed var(--border-subtle)',
                      background: 'var(--bg-card)',
                      padding: '24px 16px',
                      textAlign: 'center',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              setFormData(prev => ({
                                ...prev,
                                image: reader.result as string,
                                name: prev.name || file.name.replace(/\.[^/.]+$/, ''),
                              }));
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <Upload size={24} style={{ color: 'var(--brand-primary)', margin: '0 auto 8px' }} />
                    <strong style={{ fontSize: 13, display: 'block', color: 'var(--text-main)' }}>
                      Click or drag image file here
                    </strong>
                    <small style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>
                      PNG (transparent background recommended), JPG, SVG, WEBP
                    </small>
                  </div>
                )}

                {/* Mode 3: Image URL */}
                {imageSourceMode === 'url' && (
                  <div>
                    <input
                      type="url"
                      placeholder="https://example.com/hardware-photo.png"
                      value={formData.image.startsWith('http') ? formData.image : ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '9px 12px', color: 'var(--text-main)', fontSize: 13, borderRadius: 'var(--radius-sm)' }}
                    />
                    <small style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>
                      Paste a direct link to any transparent hardware image.
                    </small>
                  </div>
                )}

                {/* Selected Preview */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, background: 'var(--bg-card)', padding: 10, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <img
                    src={
                      formData.image.startsWith('data:') ||
                      formData.image.startsWith('http') ||
                      formData.image.startsWith('/')
                        ? formData.image
                        : `/images/${formData.image}`
                    }
                    alt="Preview"
                    style={{ width: 44, height: 44, objectFit: 'contain', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: 4 }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/AMD Ryzen 7 7800X3D_no_bg.png';
                    }}
                  />
                  <div style={{ fontSize: 12, overflow: 'hidden' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Selected Asset:</span>{' '}
                    <strong style={{ color: 'var(--text-main)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 450, fontWeight: 500 }}>
                      {formData.image.startsWith('data:') ? 'Custom Uploaded File' : formData.image}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="form-grid">
                <div className="form-group">
                  <label>Component Title</label>
                  <input
                    placeholder="e.g. RTX 5080 Founders Edition"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>SKU Code</label>
                  <input
                    placeholder="e.g. GPU-5080-FE"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Hardware Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ComponentCategory })}
                  >
                    <option value="CPU">CPU (Processor)</option>
                    <option value="Motherboard">Motherboard</option>
                    <option value="GPU">GPU (Graphics Card)</option>
                    <option value="RAM">RAM (Memory)</option>
                    <option value="Cooler">Cooler</option>
                    <option value="Case">Case / Chassis</option>
                    <option value="PSU">PSU (Power Supply)</option>
                    <option value="Display">Display / Monitor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Socket (If CPU or Motherboard)</label>
                  <input
                    placeholder="e.g. AM5 or LGA1700"
                    value={formData.socket}
                    onChange={(e) => setFormData({ ...formData, socket: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Power Draw / TDP (Watts)</label>
                  <input
                    type="number"
                    placeholder="e.g. 360"
                    value={formData.watts || ''}
                    onChange={(e) => setFormData({ ...formData, watts: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Price (USD $)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1199"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Initial Stock Units</label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Low Stock Alert Threshold</label>
                  <input
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  className="admin-btn-outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <Plus size={14} />
                  Save Hardware Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
