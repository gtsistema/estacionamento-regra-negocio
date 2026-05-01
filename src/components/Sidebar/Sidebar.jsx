import { useState } from 'react';
import { useMindMapStore } from '../../store/mindMapStore.js';
import { NodeIcon, STATUS_CONFIG, PRIORITY_CONFIG } from '../../utils/icons.js';
import { TEMPLATES } from '../../data/templates.js';
import {
  Plus, Trash2, Copy, ChevronRight, Search, X, Filter, Map,
  Layers, MoreHorizontal, Sparkles, Check, GitBranch,
} from 'lucide-react';

// ─── Fluxograma Tab ────────────────────────────────────────
const P_LABELS = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };
const P_COLORS = { alta: '#EF4444', media: '#F97316', baixa: '#38BDF8' };

function findTopicOf(node, allNodes) {
  if (!node || node.type === 'central') return null;
  if (node.type === 'topic') return node;
  const parent = allNodes.find(n => n.id === node.parentId);
  return parent ? findTopicOf(parent, allNodes) : null;
}

function FluxogramaTab({ currentNodes, selectedNodeId, selectNode, updateNode }) {
  const topics   = currentNodes.filter(n => n.type === 'topic');
  const topicIdx = Object.fromEntries(topics.map((t, i) => [t.id, i]));
  const nonRoot  = currentNodes.filter(n => n.type !== 'central');
  const total    = nonRoot.length;
  const done     = nonRoot.filter(n => n.status === 'concluido').length;
  const pct      = total > 0 ? Math.round(done / total * 100) : 0;

  // Build groups: { alta: [{topicId, topic, nodes[]}, ...], media: [...], baixa: [...] }
  const groups = { alta: [], media: [], baixa: [] };
  [...nonRoot]
    .sort((a, b) => {
      const tA = findTopicOf(a, currentNodes);
      const tB = findTopicOf(b, currentNodes);
      const ti = (topicIdx[tA?.id] ?? 99) - (topicIdx[tB?.id] ?? 99);
      if (ti !== 0) return ti;
      const typeVal = { topic: 0, subtopic: 1, task: 2 };
      return (typeVal[a.type] ?? 3) - (typeVal[b.type] ?? 3);
    })
    .forEach(node => {
      const p = node.priority ?? 'baixa';
      if (!groups[p]) return;
      const topic = findTopicOf(node, currentNodes);
      const tid   = topic?.id ?? '__none__';
      let bucket  = groups[p].find(b => b.topicId === tid);
      if (!bucket) { bucket = { topicId: tid, topic, nodes: [] }; groups[p].push(bucket); }
      bucket.nodes.push(node);
    });

  const handleToggle = (e, node) => {
    e.stopPropagation();
    updateNode(node.id, { status: node.status === 'concluido' ? 'pendente' : 'concluido' });
  };

  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* Progresso */}
      <div style={{ padding: '12px 12px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B', marginBottom: 5 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <GitBranch size={11} color="#38BDF8" /> Demandas
          </span>
          <span style={{ color: pct === 100 ? '#22C55E' : '#38BDF8', fontWeight: 700 }}>{done}/{total}</span>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
        <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>{pct}% concluído</div>
      </div>

      {/* Lista */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 8 }}>
        {['alta', 'media', 'baixa'].map(priority => {
          const buckets = groups[priority];
          if (!buckets.length) return null;
          const pColor    = P_COLORS[priority];
          const gTotal    = buckets.reduce((s, b) => s + b.nodes.length, 0);
          const gDone     = buckets.reduce((s, b) => s + b.nodes.filter(n => n.status === 'concluido').length, 0);

          return (
            <div key={priority}>
              {/* Cabeçalho prioridade sticky */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px 4px', marginTop: 4, position: 'sticky', top: 0, background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(8px)', zIndex: 2 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: pColor, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: pColor, textTransform: 'uppercase', letterSpacing: '0.07em', flex: 1 }}>{P_LABELS[priority]}</span>
                <span style={{ fontSize: 10, color: '#475569' }}>{gDone}/{gTotal}</span>
              </div>

              {/* Buckets por tópico */}
              {buckets.map(({ topicId, topic, nodes: bNodes }) => {
                const bDone    = bNodes.filter(n => n.status === 'concluido').length;
                const isTopSel = selectedNodeId === topic?.id;
                const childRows = bNodes.filter(n => n.type !== 'topic');

                return (
                  <div key={topicId}>
                    {/* Sub-header do tópico */}
                    <div
                      onClick={() => topic && selectNode(topic.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px 4px', marginTop: 3, cursor: topic ? 'pointer' : 'default', background: isTopSel ? 'rgba(56,189,248,0.08)' : 'transparent', borderLeft: `3px solid ${topic?.color ?? '#334155'}`, transition: 'background 0.12s' }}
                      onMouseEnter={e => { if (!isTopSel && topic) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseLeave={e => { if (!isTopSel) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <NodeIcon name={topic?.icon ?? 'Circle'} size={11} color={topic?.color ?? '#475569'} />
                      <span style={{ fontSize: 10, fontWeight: 700, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: isTopSel ? '#38BDF8' : topic?.color ?? '#64748B' }}>
                        {topic?.title ?? 'Sem tópico'}
                      </span>
                      <span style={{ fontSize: 9, color: '#475569', flexShrink: 0 }}>{bDone}/{bNodes.length}</span>
                    </div>

                    {/* Subtópicos e tarefas */}
                    {childRows.map(node => {
                      const cfg   = STATUS_CONFIG[node.status];
                      const isSel = selectedNodeId === node.id;
                      const isDone = node.status === 'concluido';
                      const pl    = node.type === 'subtopic' ? 16 : 26;
                      return (
                        <div key={node.id} onClick={() => selectNode(node.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: `5px 10px 5px ${pl}px`, cursor: 'pointer', background: isSel ? 'rgba(56,189,248,0.1)' : 'transparent', borderLeft: `2.5px solid ${isSel ? '#38BDF8' : node.color ?? 'transparent'}`, transition: 'background 0.12s' }}
                          onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                          onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg?.color ?? '#475569', flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 11, color: isDone ? '#334155' : isSel ? '#38BDF8' : '#94A3B8', textDecoration: isDone ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {node.title}
                            </div>
                            {node.responsible && (
                              <div style={{ fontSize: 9, color: '#334155', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                👤 {node.responsible}
                              </div>
                            )}
                          </div>
                          <button className="btn-icon" title={isDone ? 'Reabrir' : 'Concluir'} onClick={e => handleToggle(e, node)}
                            style={{ padding: 3, flexShrink: 0, color: isDone ? '#22C55E' : '#475569', opacity: isSel || isDone ? 1 : 0.25, transition: 'opacity 0.15s, color 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = isDone ? '#22C55E' : '#38BDF8'; }}
                            onMouseLeave={e => { if (!isSel && !isDone) { e.currentTarget.style.opacity = 0.25; e.currentTarget.style.color = '#475569'; } }}
                          >
                            <Check size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
        {total === 0 && <div style={{ padding: 24, textAlign: 'center', color: '#334155', fontSize: 12 }}>Nenhuma demanda encontrada.</div>}
      </div>
    </div>
  );
}

// ─── Steps ─────────────────────────────────────────────────
const STEPS = [
  { n: 1, label: 'Tema Central',       desc: 'Defina o tema principal' },
  { n: 2, label: 'Objetivo',           desc: 'Qual o propósito do mapa' },
  { n: 3, label: 'Categorias',         desc: 'Grandes grupos e áreas' },
  { n: 4, label: 'Subinformações',     desc: 'Detalhes e subtópicos' },
  { n: 5, label: 'Priorização',        desc: 'Defina prioridades' },
  { n: 6, label: 'Status',             desc: 'Acompanhe o progresso' },
  { n: 7, label: 'Revisão Final',      desc: 'Visão geral e resumo' },
];

export default function Sidebar() {
  const maps          = useMindMapStore(s => s.maps);
  const currentMapId  = useMindMapStore(s => s.currentMapId);
  const currentMap    = useMindMapStore(s => s.getCurrentMap());
  const currentNodes  = useMindMapStore(s => s.getCurrentMap()?.nodes ?? []);
  const selectedNodeId = useMindMapStore(s => s.selectedNodeId);
  const switchMap     = useMindMapStore(s => s.switchMap);
  const deleteMap     = useMindMapStore(s => s.deleteMap);
  const duplicateMap  = useMindMapStore(s => s.duplicateMap);
  const setCurrentStep = useMindMapStore(s => s.setCurrentStep);
  const setShowCreateModal = useMindMapStore(s => s.setShowCreateModal);
  const setDeleteTarget = useMindMapStore(s => s.setDeleteTarget);
  const searchQuery   = useMindMapStore(s => s.searchQuery);
  const filters       = useMindMapStore(s => s.filters);
  const setSearchQuery = useMindMapStore(s => s.setSearchQuery);
  const setFilter     = useMindMapStore(s => s.setFilter);
  const clearFilters  = useMindMapStore(s => s.clearFilters);
  const selectNode    = useMindMapStore(s => s.selectNode);
  const updateNode    = useMindMapStore(s => s.updateNode);
  const createMapFromTemplate = useMindMapStore(s => s.createMapFromTemplate);

  const [tab, setTab] = useState('maps'); // 'maps' | 'steps' | 'filters' | 'templates' | 'fluxo'
  const [mapMenu, setMapMenu] = useState(null);

  const currentStep = currentMap?.currentStep ?? 1;
  const hasFilters = searchQuery || filters.status || filters.priority || filters.type;

  return (
    <aside className="glass sidebar-enter" style={{ width: 260, height: '100%', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        {[
          { key: 'maps',      icon: Map,       tip: 'Mapas' },
          { key: 'steps',     icon: Layers,    tip: 'Etapas' },
          { key: 'filters',   icon: Filter,    tip: 'Filtros', badge: hasFilters },
          { key: 'templates', icon: Sparkles,  tip: 'Templates' },
          { key: 'fluxo',     icon: GitBranch, tip: 'Fluxograma' },
        ].map(({ key, icon: Icon, tip, badge }) => (
          <button
            key={key}
            className="btn-icon"
            title={tip}
            onClick={() => setTab(key)}
            style={{ flex: 1, borderRadius: 0, padding: '12px 0', color: tab === key ? '#38BDF8' : '#475569', borderBottom: tab === key ? '2px solid #38BDF8' : '2px solid transparent', position: 'relative' }}
          >
            <Icon size={16} />
            {badge && <span style={{ position: 'absolute', top: 8, right: '50%', transform: 'translateX(6px)', width: 6, height: 6, background: '#38BDF8', borderRadius: '50%' }} />}
          </button>
        ))}
      </div>

      {/* ─── MAPAS ─────────────────────────────────────── */}
      {tab === 'maps' && (
        <div style={{ flex: 1, overflow: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 12, padding: '8px' }} onClick={() => setShowCreateModal(true)}>
            <Plus size={14} /> Novo Mapa
          </button>
          {maps.map(m => {
            const done = m.nodes.filter(n => n.status === 'concluido').length;
            const pct  = m.nodes.length > 0 ? Math.round(done / m.nodes.length * 100) : 0;
            const isActive = m.id === currentMapId;
            return (
              <div
                key={m.id}
                onClick={() => switchMap(m.id)}
                style={{
                  padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                  background: isActive ? 'rgba(56,189,248,0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(56,189,248,0.25)' : '1px solid transparent',
                  transition: 'all 0.15s', position: 'relative',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: isActive ? '#38BDF8' : '#CBD5E1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.name}
                    </div>
                    <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{m.nodes.length} itens · {pct}%</div>
                    <div className="progress-bar" style={{ marginTop: 5 }}>
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <button
                    className="btn-icon"
                    style={{ padding: 3, marginTop: -2 }}
                    onClick={(e) => { e.stopPropagation(); setMapMenu(mapMenu === m.id ? null : m.id); }}
                  >
                    <MoreHorizontal size={13} />
                  </button>
                </div>
                {mapMenu === m.id && (
                  <div className="glass" onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: '100%', right: 0, zIndex: 99, borderRadius: 8, padding: 4, minWidth: 130, border: '1px solid rgba(255,255,255,0.08)', animation: 'scaleIn 0.1s ease-out' }}>
                    <button onClick={() => { duplicateMap(m.id); setMapMenu(null); }} style={{ display: 'flex', alignItems: 'center', gap: 7, width: '100%', padding: '6px 8px', background: 'transparent', border: 'none', color: '#CBD5E1', fontSize: 12, cursor: 'pointer', borderRadius: 5 }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <Copy size={12} /> Duplicar
                    </button>
                    <button onClick={() => { setDeleteTarget({ type: 'map', id: m.id }); setMapMenu(null); }} style={{ display: 'flex', alignItems: 'center', gap: 7, width: '100%', padding: '6px 8px', background: 'transparent', border: 'none', color: '#EF4444', fontSize: 12, cursor: 'pointer', borderRadius: 5 }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.07)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <Trash2 size={12} /> Excluir
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── ETAPAS ────────────────────────────────────── */}
      {tab === 'steps' && (
        <div style={{ flex: 1, overflow: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div className="section-label" style={{ marginBottom: 10, paddingLeft: 4 }}>Fluxo por Etapas</div>
          {STEPS.map(step => {
            const done = step.n < currentStep;
            const active = step.n === currentStep;
            return (
              <button
                key={step.n}
                onClick={() => setCurrentStep(step.n)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  background: active ? 'rgba(56,189,248,0.1)' : 'transparent',
                  border: active ? '1px solid rgba(56,189,248,0.25)' : '1px solid transparent',
                  borderRadius: 9, cursor: 'pointer', textAlign: 'left', width: '100%',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
                  background: done ? 'rgba(34,197,94,0.15)' : active ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.05)',
                  border: done ? '1.5px solid #22C55E44' : active ? '1.5px solid #38BDF8' : '1.5px solid rgba(255,255,255,0.1)',
                  color: done ? '#22C55E' : active ? '#38BDF8' : '#475569',
                }}>
                  {done ? <Check size={12} /> : step.n}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: active ? '#38BDF8' : done ? '#64748B' : '#94A3B8' }}>{step.label}</div>
                  <div style={{ fontSize: 10, color: '#475569', marginTop: 1 }}>{step.desc}</div>
                </div>
              </button>
            );
          })}
          <div style={{ margin: '12px 0 4px', padding: '0 4px' }}>
            <div className="section-label">Progresso Geral</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#475569', margin: '6px 0 4px' }}>
              <span>Etapa {currentStep} de 7</span>
              <span>{Math.round((currentStep - 1) / 6 * 100)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.round((currentStep - 1) / 6 * 100)}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* ─── FILTROS ───────────────────────────────────── */}
      {tab === 'filters' && (
        <div style={{ flex: 1, overflow: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
            <input
              className="input-field"
              placeholder="Buscar por palavra-chave..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 30, fontSize: 12 }}
            />
            {searchQuery && (
              <button className="btn-icon" style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', padding: 3 }} onClick={() => setSearchQuery('')}>
                <X size={12} />
              </button>
            )}
          </div>

          <div>
            <div className="section-label">Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button key={key} onClick={() => setFilter('status', filters.status === key ? '' : key)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, border: `1px solid ${filters.status === key ? cfg.color + '44' : 'transparent'}`, background: filters.status === key ? cfg.bg : 'rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color }} />
                  <span style={{ fontSize: 12, color: filters.status === key ? cfg.color : '#94A3B8' }}>{cfg.label}</span>
                  {filters.status === key && <Check size={11} color={cfg.color} style={{ marginLeft: 'auto' }} />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="section-label">Prioridade</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                <button key={key} onClick={() => setFilter('priority', filters.priority === key ? '' : key)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, border: `1px solid ${filters.priority === key ? cfg.color + '44' : 'transparent'}`, background: filters.priority === key ? `${cfg.color}15` : 'rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color }} />
                  <span style={{ fontSize: 12, color: filters.priority === key ? cfg.color : '#94A3B8' }}>{cfg.label}</span>
                  {filters.priority === key && <Check size={11} color={cfg.color} style={{ marginLeft: 'auto' }} />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="section-label">Tipo</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[['topic','Tópico'],['subtopic','Subtópico'],['task','Tarefa']].map(([k, l]) => (
                <button key={k} onClick={() => setFilter('type', filters.type === k ? '' : k)} style={{ padding: '5px 10px', borderRadius: 20, border: `1px solid ${filters.type === k ? '#38BDF844' : 'rgba(255,255,255,0.08)'}`, background: filters.type === k ? 'rgba(56,189,248,0.1)' : 'transparent', color: filters.type === k ? '#38BDF8' : '#64748B', fontSize: 11, cursor: 'pointer' }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {hasFilters && (
            <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: 12 }} onClick={clearFilters}>
              <X size={13} /> Limpar Filtros
            </button>
          )}
        </div>
      )}

      {/* ─── TEMPLATES ─────────────────────────────────── */}
      {tab === 'templates' && (
        <div style={{ flex: 1, overflow: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="section-label" style={{ paddingLeft: 4, marginBottom: 6 }}>Templates Prontos</div>
          {TEMPLATES.map(tpl => (
            <button
              key={tpl.key}
              onClick={() => createMapFromTemplate(tpl.build())}
              style={{ padding: '11px 13px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.06)'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <NodeIcon name={tpl.icon} size={15} color="#38BDF8" />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#CBD5E1' }}>{tpl.label}</span>
              </div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{tpl.description}</div>
            </button>
          ))}
        </div>
      )}

      {/* ─── FLUXOGRAMA ────────────────────────────────── */}
      {tab === 'fluxo' && (
        <FluxogramaTab
          currentNodes={currentNodes}
          selectedNodeId={selectedNodeId}
          selectNode={selectNode}
          updateNode={updateNode}
        />
      )}
    </aside>
  );
}
