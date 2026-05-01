import { useState } from 'react';
import { useMindMapStore } from '../../store/mindMapStore.js';
import { exportJSON, exportCSV, exportPNG, exportPDF } from '../../utils/exportUtils.js';
import {
  Brain, Save, Download, Maximize2, LayoutDashboard, PanelLeftClose, PanelLeftOpen,
  Plus, ChevronDown, FileJson, FileText, FileImage, Table2, Sparkles,
} from 'lucide-react';

export default function Header() {
  const map           = useMindMapStore(s => s.getCurrentMap());
  const sidebarOpen   = useMindMapStore(s => s.sidebarOpen);
  const dashboardOpen = useMindMapStore(s => s.dashboardOpen);
  const toggleSidebar = useMindMapStore(s => s.toggleSidebar);
  const toggleDashboard = useMindMapStore(s => s.toggleDashboard);
  const setShowCreateModal = useMindMapStore(s => s.setShowCreateModal);
  const [exportOpen, setExportOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1200);
  };

  const handleExport = async (type) => {
    setExportOpen(false);
    if (!map) return;
    if (type === 'json') exportJSON(map);
    else if (type === 'csv') exportCSV(map);
    else if (type === 'png') await exportPNG('mindmap-canvas');
    else if (type === 'pdf') await exportPDF(map, 'mindmap-canvas');
  };

  const completedNodes = map?.nodes.filter(n => n.status === 'concluido').length ?? 0;
  const totalNodes     = map?.nodes.length ?? 0;
  const progress       = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

  return (
    <header className="glass" style={{ height: 56, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, flexShrink: 0, zIndex: 50 }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 4 }}>
        <div style={{ background: 'linear-gradient(135deg,#38BDF8,#818CF8)', borderRadius: 8, padding: 6, display: 'flex' }}>
          <Brain size={16} color="white" />
        </div>
        <span className="gradient-text" style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px' }}>MindFlow</span>
      </div>

      {/* Sidebar toggle */}
      <button className="btn-icon" onClick={toggleSidebar} title="Alternar barra lateral">
        {sidebarOpen ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
      </button>

      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.07)' }} />

      {/* Current map name */}
      {map && (
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#F1F5F9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {map.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 11, color: '#475569' }}>
              {totalNodes} itens · {progress}% concluído
            </div>
            <div className="progress-bar" style={{ width: 80 }}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button className="btn-ghost" style={{ gap: 6, fontSize: 12 }} onClick={() => setShowCreateModal(true)}>
          <Plus size={14} /> Novo Mapa
        </button>

        <button className="btn-icon" onClick={handleSave} title="Salvo automaticamente">
          <Save size={16} color={saving ? '#22C55E' : undefined} />
        </button>

        {/* Export dropdown */}
        <div style={{ position: 'relative' }}>
          <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setExportOpen(o => !o)}>
            <Download size={14} /> Exportar <ChevronDown size={12} />
          </button>
          {exportOpen && (
            <div className="glass" style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, borderRadius: 10, padding: 6, minWidth: 160, zIndex: 200, border: '1px solid rgba(255,255,255,0.08)', animation: 'scaleIn 0.12s ease-out' }}>
              {[
                { type: 'json', icon: FileJson,  label: 'JSON' },
                { type: 'csv',  icon: Table2,    label: 'CSV / Excel' },
                { type: 'png',  icon: FileImage, label: 'PNG (imagem)' },
                { type: 'pdf',  icon: FileText,  label: 'PDF' },
              ].map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => handleExport(type)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 10px', background: 'transparent', border: 'none', color: '#CBD5E1', fontSize: 13, cursor: 'pointer', borderRadius: 7 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Icon size={14} color="#64748B" /> {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="btn-icon" onClick={toggleDashboard} title="Painel de resumo" style={{ color: dashboardOpen ? '#38BDF8' : undefined }}>
          <LayoutDashboard size={17} />
        </button>

        <button className="btn-icon" onClick={() => document.documentElement.requestFullscreen?.()} title="Tela cheia">
          <Maximize2 size={16} />
        </button>
      </div>
    </header>
  );
}
