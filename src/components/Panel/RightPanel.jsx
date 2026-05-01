import { useState, useEffect } from 'react';
import { useMindMapStore } from '../../store/mindMapStore.js';
import { NodeIcon, STATUS_CONFIG, PRIORITY_CONFIG, PRESET_COLORS, TYPE_LABELS } from '../../utils/icons.js';
import { X, Trash2, Copy, Save, ChevronDown, CalendarDays } from 'lucide-react';

const ICON_OPTIONS = [
  'Brain','Circle','Target','Lightbulb','Flag','Star','Heart','Zap',
  'Check','AlertCircle','AlertTriangle','Info','Bookmark','Tag','Key',
  'Users','UserCheck','Building','Car','Truck','FileText','Settings',
  'DollarSign','Calendar','Clock','Mail','Phone','Link','Search','Download',
];

export default function RightPanel() {
  const node       = useMindMapStore(s => s.getSelectedNode());
  const updateNode = useMindMapStore(s => s.updateNode);
  const deleteNode = useMindMapStore(s => s.deleteNode);
  const duplicateNode = useMindMapStore(s => s.duplicateNode);
  const closePanel = useMindMapStore(s => s.closeRightPanel);
  const setDeleteTarget = useMindMapStore(s => s.setDeleteTarget);
  const addNode    = useMindMapStore(s => s.addNode);

  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (node) setForm({ ...node });
  }, [node?.id]);

  if (!node || !form) return null;

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    updateNode(node.id, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const statusCfg   = STATUS_CONFIG[form.status]   || STATUS_CONFIG.pendente;
  const priorityCfg = PRIORITY_CONFIG[form.priority] || PRIORITY_CONFIG.media;

  return (
    <aside className="panel-enter glass" style={{ width: 340, height: '100%', borderLeft: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
      {/* Header */}
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: '#475569', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
            {TYPE_LABELS[node.type] || 'Item'}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#CBD5E1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {node.title}
          </div>
        </div>
        <button className="btn-icon" onClick={closePanel}><X size={16} /></button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Title */}
        <div>
          <div className="section-label">Título *</div>
          <input className="input-field" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Digite o título..." />
        </div>

        {/* Description */}
        <div>
          <div className="section-label">Descrição</div>
          <textarea className="input-field" value={form.description || ''} onChange={e => set('description', e.target.value)} placeholder="Descrição opcional..." rows={3} />
        </div>

        {/* Status */}
        <div>
          <div className="section-label">Status</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => set('status', key)}
                style={{ padding: '7px 10px', borderRadius: 8, border: `1px solid ${form.status === key ? cfg.color + '55' : 'rgba(255,255,255,0.06)'}`, background: form.status === key ? cfg.bg : 'transparent', color: form.status === key ? cfg.color : '#64748B', fontSize: 11, cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color }} />
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <div className="section-label">Prioridade</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => set('priority', key)}
                style={{ flex: 1, padding: '7px 8px', borderRadius: 8, border: `1px solid ${form.priority === key ? cfg.color + '55' : 'rgba(255,255,255,0.06)'}`, background: form.priority === key ? `${cfg.color}18` : 'transparent', color: form.priority === key ? cfg.color : '#64748B', fontSize: 11, cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s' }}
              >
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <div className="section-label">Cor</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                onClick={() => set('color', c)}
                style={{ width: 26, height: 26, borderRadius: '50%', background: c, border: form.color === c ? `2.5px solid white` : '2.5px solid transparent', cursor: 'pointer', transition: 'transform 0.1s', boxSizing: 'border-box' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            ))}
          </div>
        </div>

        {/* Icon */}
        <div>
          <div className="section-label">Ícone</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxHeight: 100, overflow: 'auto' }}>
            {ICON_OPTIONS.map(ic => (
              <button
                key={ic}
                title={ic}
                onClick={() => set('icon', ic)}
                style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${form.icon === ic ? '#38BDF866' : 'rgba(255,255,255,0.06)'}`, background: form.icon === ic ? 'rgba(56,189,248,0.12)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.12s' }}
              >
                <NodeIcon name={ic} size={14} color={form.icon === ic ? '#38BDF8' : '#64748B'} />
              </button>
            ))}
          </div>
        </div>

        {/* Responsible */}
        <div>
          <div className="section-label">Responsável</div>
          <input className="input-field" value={form.responsible || ''} onChange={e => set('responsible', e.target.value)} placeholder="Nome do responsável..." />
        </div>

        {/* Deadline */}
        <div>
          <div className="section-label">Prazo</div>
          <input className="input-field" type="date" value={form.deadline || ''} onChange={e => set('deadline', e.target.value)} />
        </div>

        {/* Notes */}
        <div>
          <div className="section-label">Observações</div>
          <textarea className="input-field" value={form.notes || ''} onChange={e => set('notes', e.target.value)} placeholder="Observações adicionais..." rows={3} />
        </div>

        {/* Add children */}
        {node.type !== 'task' && (
          <div>
            <div className="section-label">Adicionar</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {node.type === 'central' && (
                <button className="btn-ghost" style={{ flex: 1, fontSize: 11, justifyContent: 'center', padding: '7px 6px' }} onClick={() => addNode(node.id, 'topic')}>+ Tópico</button>
              )}
              {(node.type === 'central' || node.type === 'topic') && (
                <button className="btn-ghost" style={{ flex: 1, fontSize: 11, justifyContent: 'center', padding: '7px 6px' }} onClick={() => addNode(node.id, 'subtopic')}>+ Subtópico</button>
              )}
              <button className="btn-ghost" style={{ flex: 1, fontSize: 11, justifyContent: 'center', padding: '7px 6px' }} onClick={() => addNode(node.id, 'task')}>+ Tarefa</button>
            </div>
          </div>
        )}

        {/* Meta */}
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 10, color: '#334155', display: 'flex', justifyContent: 'space-between' }}>
            <span>Criado</span>
            <span>{new Date(node.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
          <div style={{ fontSize: 10, color: '#334155', display: 'flex', justifyContent: 'space-between' }}>
            <span>Atualizado</span>
            <span>{new Date(node.updatedAt).toLocaleDateString('pt-BR')}</span>
          </div>
          <div style={{ fontSize: 10, color: '#334155', display: 'flex', justifyContent: 'space-between' }}>
            <span>ID</span>
            <span style={{ fontFamily: 'monospace', fontSize: 9 }}>{node.id.slice(-8)}</span>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 6, flexShrink: 0 }}>
        <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }} onClick={handleSave}>
          <Save size={13} /> {saved ? 'Salvo ✓' : 'Salvar'}
        </button>
        <button className="btn-ghost" title="Duplicar" onClick={() => duplicateNode(node.id)}>
          <Copy size={14} />
        </button>
        {node.type !== 'central' && (
          <button className="btn-danger" title="Excluir" onClick={() => setDeleteTarget({ type: 'node', id: node.id })}>
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </aside>
  );
}
