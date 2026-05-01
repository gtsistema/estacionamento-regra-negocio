import { useState } from 'react';
import { useMindMapStore } from '../../store/mindMapStore.js';
import { X, Brain } from 'lucide-react';

const CATEGORIES = [
  { value: 'projeto',       label: '📁 Projeto' },
  { value: 'estudo',        label: '📚 Estudo' },
  { value: 'empresa',       label: '🏢 Empresa' },
  { value: 'processo',      label: '⚙️ Processo' },
  { value: 'pessoal',       label: '👤 Pessoal' },
  { value: 'personalizado', label: '✨ Personalizado' },
];

export default function CreateMapModal() {
  const createMap = useMindMapStore(s => s.createMap);
  const close     = useMindMapStore(s => s.setShowCreateModal);
  const [form, setForm] = useState({ name: '', description: '', category: 'personalizado', objective: '' });
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('O nome do mapa é obrigatório.'); return; }
    createMap(form);
    close(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => close(false)}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <div style={{ background: 'linear-gradient(135deg,#38BDF8,#818CF8)', borderRadius: 8, padding: 8, display: 'flex' }}>
            <Brain size={18} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#F1F5F9' }}>Novo Mapa Mental</div>
            <div style={{ fontSize: 12, color: '#475569' }}>Preencha as informações iniciais</div>
          </div>
          <button className="btn-icon" style={{ marginLeft: 'auto' }} onClick={() => close(false)}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div className="section-label">Nome do Mapa *</div>
            <input
              className="input-field"
              placeholder="Ex: Planejamento Q1 2025"
              value={form.name}
              onChange={e => { set('name', e.target.value); setError(''); }}
              autoFocus
            />
            {error && <div style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>{error}</div>}
          </div>

          <div>
            <div className="section-label">Descrição</div>
            <textarea className="input-field" placeholder="Descrição opcional..." value={form.description} onChange={e => set('description', e.target.value)} rows={2} />
          </div>

          <div>
            <div className="section-label">Categoria</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              {CATEGORIES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set('category', value)}
                  style={{ padding: '8px 6px', borderRadius: 8, border: `1px solid ${form.category === value ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.07)'}`, background: form.category === value ? 'rgba(56,189,248,0.1)' : 'rgba(255,255,255,0.03)', color: form.category === value ? '#38BDF8' : '#64748B', fontSize: 11, cursor: 'pointer', transition: 'all 0.15s' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="section-label">Objetivo</div>
            <textarea className="input-field" placeholder="Qual o objetivo deste mapa mental?" value={form.objective} onChange={e => set('objective', e.target.value)} rows={2} />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" className="btn-ghost" onClick={() => close(false)}>Cancelar</button>
            <button type="submit" className="btn-primary">Criar Mapa</button>
          </div>
        </form>
      </div>
    </div>
  );
}
