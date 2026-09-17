import React, { useState } from 'react';
import { CompatibilityRule, ComponentItem, ComponentCategory } from '../types';
import { RigForgeAPI } from '../services/api';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  ShieldCheck,
  Cpu,
  Zap,
  Maximize2,
  Thermometer,
  Plus,
  Check,
  X
} from 'lucide-react';

interface CompatibilityMatrixProps {
  rules: CompatibilityRule[];
  components: ComponentItem[];
  onRefresh: () => void;
}

export const CompatibilityMatrix: React.FC<CompatibilityMatrixProps> = ({
  rules,
  components,
  onRefresh,
}) => {
  // Logic Engine Sandbox / Simulator State
  const [selectedCpu, setSelectedCpu] = useState<string>('cpu-9950x');
  const [selectedMb, setSelectedMb] = useState<string>('mb-x670e-hero');
  const [selectedGpu, setSelectedGpu] = useState<string>('gpu-5080-fe');
  const [selectedPsu, setSelectedPsu] = useState<string>('psu-rm850x-shift');
  const [selectedCase, setSelectedCase] = useState<string>('case-north-xl-msh');
  const [selectedCooler, setSelectedCooler] = useState<string>('cool-arctic-lf3-360');

  // Filter & Modal State
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState<boolean>(false);
  const [newRule, setNewRule] = useState<{
    name: string;
    sourceCategory: ComponentCategory;
    targetCategory: ComponentCategory;
    ruleType: 'SOCKET_MATCH' | 'POWER_ENVELOPE' | 'CLEARANCE_LENGTH' | 'FORM_FACTOR';
    severity: 'BLOCKING' | 'WARNING';
    description: string;
  }>({
    name: '',
    sourceCategory: 'CPU',
    targetCategory: 'Motherboard',
    ruleType: 'SOCKET_MATCH',
    severity: 'BLOCKING',
    description: '',
  });

  const handleToggleRule = async (id: string) => {
    await RigForgeAPI.toggleRule(id);
    onRefresh();
  };

  const handleCreateRuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.name || !newRule.description) return;

    await RigForgeAPI.createRule({
      ...newRule,
      isActive: true,
    });
    setIsAddRuleModalOpen(false);
    setNewRule({
      name: '',
      sourceCategory: 'CPU',
      targetCategory: 'Motherboard',
      ruleType: 'SOCKET_MATCH',
      severity: 'BLOCKING',
      description: '',
    });
    onRefresh();
  };

  // Hardware items resolved from current state
  const cpus = components.filter((c) => c.category === 'CPU');
  const motherboards = components.filter((c) => c.category === 'Motherboard');
  const gpus = components.filter((c) => c.category === 'GPU');
  const psus = components.filter((c) => c.category === 'PSU');
  const cases = components.filter((c) => c.category === 'Case');
  const coolers = components.filter((c) => c.category === 'Cooler');

  const cpu = components.find((c) => c.id === selectedCpu) || cpus[0];
  const mb = components.find((c) => c.id === selectedMb) || motherboards[0];
  const gpu = components.find((c) => c.id === selectedGpu) || gpus[0];
  const psu = components.find((c) => c.id === selectedPsu) || psus[0];
  const caseItem = components.find((c) => c.id === selectedCase) || cases[0];
  const coolerItem = components.find((c) => c.id === selectedCooler) || coolers[0];

  // 1. Socket Check (Blocking)
  const socketMatch = cpu && mb ? cpu.socket === mb.socket : true;

  // 2. Power Headroom Check (1.25x Transient Spike Guard)
  const estimatedDraw = (cpu?.watts || 120) + (gpu?.watts || 285) + (mb?.watts || 50) + (coolerItem?.watts || 25) + 35;
  const recommendedPsu = Math.ceil(estimatedDraw * 1.25);
  const psuCapacity = psu?.watts || 850;
  const psuSufficient = psuCapacity >= recommendedPsu;

  // 3. GPU Chassis Clearance Check (Blocking)
  const gpuLength = gpu?.lengthMm || 304;
  const caseMaxGpu = caseItem?.maxGpuLength || 413;
  const clearanceMargin = caseMaxGpu - gpuLength;
  const clearanceOk = clearanceMargin >= 15;

  // 4. Thermal Headroom Check
  const cpuWatts = cpu?.watts || 120;
  const coolerIsAio = coolerItem?.name?.toLowerCase().includes('liquid') || coolerItem?.name?.toLowerCase().includes('360') || coolerItem?.name?.toLowerCase().includes('freezer');
  const coolerMaxTdp = coolerIsAio ? 350 : 250;
  const thermalOk = coolerMaxTdp >= cpuWatts;

  // Health Score Calculation
  let simulatedHealthScore = 100;
  if (!socketMatch) simulatedHealthScore -= 40;
  if (!clearanceOk) simulatedHealthScore -= 30;
  if (!psuSufficient) simulatedHealthScore -= 20;
  if (!thermalOk) simulatedHealthScore -= 10;
  simulatedHealthScore = Math.max(10, simulatedHealthScore);

  const filteredRules = rules.filter((r) => {
    if (selectedCategoryFilter === 'ALL') return true;
    return r.sourceCategory === selectedCategoryFilter || r.targetCategory === selectedCategoryFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header Banner */}
      <section className="admin-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="admin-eyebrow" style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>ENGINE CORE</span>
              <span style={{ fontSize: 11, background: 'var(--brand-blue-subtle)', color: 'var(--brand-primary)', padding: '2px 8px', borderRadius: 999, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                v2.4 REAL-TIME
              </span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '6px 0 8px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Compatibility Matrix & Guardrail Engine
            </h2>
            <p style={{ color: 'var(--text-sub)', fontSize: 13.5, lineHeight: 1.5, maxWidth: 780, margin: 0 }}>
              The deterministic rule engine validates buyer configurations against physical socket geometry, 1.25x transient power headroom, chassis millimeter clearances, and thermal TDP dissipation before checkout.
            </p>
          </div>

          <button
            className="admin-btn-primary"
            onClick={() => setIsAddRuleModalOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <Plus size={16} />
            Add Safety Rule
          </button>
        </div>
      </section>

      {/* Interactive Compatibility Sandbox */}
      <section className="admin-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span className="admin-eyebrow">Real-Time Logic Simulator</span>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '2px 0 0' }}>Multi-Vector Hardware Sandbox</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--bg-app)', padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 10.5, color: 'var(--text-muted)', display: 'block', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                CALCULATED SYSTEM HEALTH
              </span>
              <div style={{ fontSize: 18, fontWeight: 800, color: simulatedHealthScore >= 90 ? 'var(--accent-emerald)' : simulatedHealthScore >= 70 ? 'var(--accent-amber)' : 'var(--accent-rose)', fontFamily: 'var(--font-head)' }}>
                {simulatedHealthScore}% {simulatedHealthScore >= 90 ? 'Optimal Setup' : simulatedHealthScore >= 70 ? 'Advisory Flagged' : 'Critical Mismatch'}
              </div>
            </div>
          </div>
        </div>

        {/* 6 Hardware Selectors Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 22 }}>
          {/* CPU */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Cpu size={13} style={{ color: 'var(--brand-primary)' }} />
              Processor (CPU)
            </label>
            <select value={selectedCpu} onChange={(e) => setSelectedCpu(e.target.value)}>
              {cpus.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.socket || 'Socket N/A'} · {c.watts}W)
                </option>
              ))}
            </select>
          </div>

          {/* Motherboard */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={13} style={{ color: 'var(--brand-primary)' }} />
              Motherboard
            </label>
            <select value={selectedMb} onChange={(e) => setSelectedMb(e.target.value)}>
              {motherboards.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.socket || 'Socket N/A'})
                </option>
              ))}
            </select>
          </div>

          {/* GPU */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={13} style={{ color: 'var(--brand-primary)' }} />
              Graphics Card (GPU)
            </label>
            <select value={selectedGpu} onChange={(e) => setSelectedGpu(e.target.value)}>
              {gpus.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.watts}W · {c.lengthMm || 304}mm)
                </option>
              ))}
            </select>
          </div>

          {/* PSU */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={13} style={{ color: 'var(--brand-primary)' }} />
              Power Supply (PSU)
            </label>
            <select value={selectedPsu} onChange={(e) => setSelectedPsu(e.target.value)}>
              {psus.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.watts}W)
                </option>
              ))}
            </select>
          </div>

          {/* Case */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Maximize2 size={13} style={{ color: 'var(--brand-primary)' }} />
              Chassis / Case
            </label>
            <select value={selectedCase} onChange={(e) => setSelectedCase(e.target.value)}>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Max GPU: {c.maxGpuLength || 400}mm)
                </option>
              ))}
            </select>
          </div>

          {/* Cooler */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Thermometer size={13} style={{ color: 'var(--brand-primary)' }} />
              Cooling Solution
            </label>
            <select value={selectedCooler} onChange={(e) => setSelectedCooler(e.target.value)}>
              {coolers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4-Card Diagnostic Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {/* Card 1: Socket Alignment */}
          <div style={{ background: '#FFFFFF', padding: 16, borderRadius: 'var(--radius-sm)', border: `1.5px solid ${socketMatch ? 'var(--border-subtle)' : '#FECDD3'}`, boxShadow: 'var(--shadow-raised)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                1. Socket Alignment
              </span>
              <span className={`status-badge ${socketMatch ? 'success' : 'danger'}`}>
                {socketMatch ? 'MATCHED' : 'BLOCKED'}
              </span>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.45, color: socketMatch ? 'var(--text-main)' : 'var(--accent-rose)' }}>
              {socketMatch ? (
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong>Socket Harmonized:</strong> CPU socket (<code>{cpu?.socket}</code>) physically matches Motherboard socket (<code>{mb?.socket}</code>).
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <XCircle size={16} style={{ color: 'var(--accent-rose)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong>Critical Socket Conflict:</strong> CPU (<code>{cpu?.socket}</code>) cannot physically mount on <code>{mb?.socket}</code> board.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Power Overhead */}
          <div style={{ background: '#FFFFFF', padding: 16, borderRadius: 'var(--radius-sm)', border: `1.5px solid ${psuSufficient ? 'var(--border-subtle)' : '#FEF08A'}`, boxShadow: 'var(--shadow-raised)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                2. Power Overhead (1.25x)
              </span>
              <span className={`status-badge ${psuSufficient ? 'success' : 'warning'}`}>
                {psuSufficient ? 'SAFE BUFFER' : 'INSUFFICIENT'}
              </span>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.45, color: psuSufficient ? 'var(--text-main)' : 'var(--accent-amber)' }}>
              {psuSufficient ? (
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong>Power Verified:</strong> {psuCapacity}W PSU exceeds recommended {recommendedPsu}W buffer (Est. Draw: {estimatedDraw}W).
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <AlertTriangle size={16} style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong>Power Risk:</strong> {psuCapacity}W PSU is below safe {recommendedPsu}W minimum (transient spikes may trip OCP).
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Chassis Clearance */}
          <div style={{ background: '#FFFFFF', padding: 16, borderRadius: 'var(--radius-sm)', border: `1.5px solid ${clearanceOk ? 'var(--border-subtle)' : '#FECDD3'}`, boxShadow: 'var(--shadow-raised)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                3. Chassis GPU Clearance
              </span>
              <span className={`status-badge ${clearanceOk ? 'success' : 'danger'}`}>
                {clearanceOk ? 'CLEARED' : 'COLLISION'}
              </span>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.45, color: clearanceOk ? 'var(--text-main)' : 'var(--accent-rose)' }}>
              {clearanceOk ? (
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong>Clearance OK:</strong> {gpuLength}mm GPU fits inside chassis with +{clearanceMargin}mm safety buffer (Case max: {caseMaxGpu}mm).
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <XCircle size={16} style={{ color: 'var(--accent-rose)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong>Dimensional Collision:</strong> {gpuLength}mm GPU exceeds available clearance in selected case ({caseMaxGpu}mm max).
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 4: Thermal Headroom */}
          <div style={{ background: '#FFFFFF', padding: 16, borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border-subtle)', boxShadow: 'var(--shadow-raised)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                4. Thermal Headroom
              </span>
              <span className={`status-badge ${thermalOk ? 'success' : 'warning'}`}>
                {thermalOk ? 'OPTIMAL' : 'HIGH LOAD'}
              </span>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--text-main)' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>Thermal Solution Valid:</strong> {coolerItem?.name?.split(' ')[0] || 'Cooler'} rated for up to {coolerMaxTdp}W dissipation (CPU TDP: {cpuWatts}W).
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rules Registry Table */}
      <section className="admin-card">
        <header className="admin-card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span className="admin-eyebrow">Rules Registry</span>
            <h2>Active Guardrail Matrix Rules</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 4, background: 'var(--bg-app)', padding: 3, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              {['ALL', 'CPU', 'GPU', 'Motherboard', 'PSU', 'Case'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`filter-chip ${selectedCategoryFilter === cat ? 'active' : ''}`}
                  style={{ padding: '4px 10px', fontSize: 11 }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              {rules.filter((r) => r.isActive).length} of {rules.length} Active
            </span>
          </div>
        </header>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rule Name</th>
                <th>Relationship</th>
                <th>Rule Type</th>
                <th>Severity</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Status / Toggle</th>
              </tr>
            </thead>
            <tbody>
              {filteredRules.map((rule) => (
                <tr key={rule.id}>
                  <td>
                    <strong style={{ color: 'var(--text-main)', fontSize: 13.5 }}>{rule.name}</strong>
                  </td>
                  <td>
                    <span style={{ color: 'var(--brand-primary)', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--brand-blue-subtle)', padding: '2px 8px', borderRadius: 4 }}>
                      {rule.sourceCategory} &rarr; {rule.targetCategory}
                    </span>
                  </td>
                  <td>
                    <span className="status-badge neutral">{rule.ruleType}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${rule.severity === 'BLOCKING' ? 'danger' : 'warning'}`}>
                      {rule.severity}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-sub)', maxWidth: 380, fontSize: 12.5, lineHeight: 1.4 }}>
                    {rule.description}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className={rule.isActive ? 'admin-btn-primary' : 'admin-btn-outline'}
                      style={{ height: 30, padding: '0 14px', fontSize: 11.5, fontWeight: 700 }}
                      onClick={() => handleToggleRule(rule.id)}
                    >
                      {rule.isActive ? (
                        <>
                          <Check size={12} style={{ marginRight: 4 }} />
                          Active
                        </>
                      ) : (
                        'Disabled'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Rule Modal */}
      {isAddRuleModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsAddRuleModalOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow">Compatibility Guardrails</span>
                <h2>Add Safety Matrix Rule</h2>
              </div>
              <button
                onClick={() => setIsAddRuleModalOpen(false)}
                style={{ background: 'none', border: 0, color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRuleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label>Rule Name</label>
                <input
                  placeholder="e.g. AM5 Thermal Throttle Guard"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Source Component</label>
                  <select
                    value={newRule.sourceCategory}
                    onChange={(e) => setNewRule({ ...newRule, sourceCategory: e.target.value as ComponentCategory })}
                  >
                    <option value="CPU">CPU</option>
                    <option value="GPU">GPU</option>
                    <option value="Motherboard">Motherboard</option>
                    <option value="RAM">RAM</option>
                    <option value="Cooler">Cooler</option>
                    <option value="Case">Case</option>
                    <option value="PSU">PSU</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Target Component</label>
                  <select
                    value={newRule.targetCategory}
                    onChange={(e) => setNewRule({ ...newRule, targetCategory: e.target.value as ComponentCategory })}
                  >
                    <option value="Motherboard">Motherboard</option>
                    <option value="PSU">PSU</option>
                    <option value="Case">Case</option>
                    <option value="Cooler">Cooler</option>
                    <option value="RAM">RAM</option>
                    <option value="GPU">GPU</option>
                    <option value="CPU">CPU</option>
                  </select>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Rule Type</label>
                  <select
                    value={newRule.ruleType}
                    onChange={(e) => setNewRule({ ...newRule, ruleType: e.target.value as any })}
                  >
                    <option value="SOCKET_MATCH">SOCKET_MATCH (Physical Socket)</option>
                    <option value="POWER_ENVELOPE">POWER_ENVELOPE (Wattage Headroom)</option>
                    <option value="CLEARANCE_LENGTH">CLEARANCE_LENGTH (Millimeter Clearance)</option>
                    <option value="FORM_FACTOR">FORM_FACTOR (Chassis / Board Size)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Enforcement Severity</label>
                  <select
                    value={newRule.severity}
                    onChange={(e) => setNewRule({ ...newRule, severity: e.target.value as any })}
                  >
                    <option value="BLOCKING">BLOCKING (Prevents Checkout)</option>
                    <option value="WARNING">WARNING (Displays Advisory)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Technical Description / User Guidance</label>
                <textarea
                  rows={3}
                  placeholder="Describe the physical constraint or formula calculated..."
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  className="admin-btn-outline"
                  onClick={() => setIsAddRuleModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <Plus size={14} />
                  Register Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
