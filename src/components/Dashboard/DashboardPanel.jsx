import { useMindMapStore } from '../../store/mindMapStore.js';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../../utils/icons.js';
import { X, TrendingUp, CheckCircle2, AlertCircle, Clock, XCircle } from 'lucide-react';

function StatBar({ label, count, total, color }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: '#94A3B8' }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color }}>{count} <span style={{ color: '#334155' }}>/ {total}</span></span>
      </div>
      <div className="progress-bar">
        <div style={{ height: '100%', borderRadius: 2, background: color, width: `${pct}%`, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
}

export default function DashboardPanel() {
  const map    = useMindMapStore(s => s.getCurrentMap());
  const toggle = useMindMapStore(s => s.toggleDashboard);
  if (!map) return null;

  const nodes = map.nodes.filter(n => n.type !== 'central');
  const total = nodes.length;

  const byStatus   = Object.fromEntries(Object.keys(STATUS_CONFIG).map(k => [k, nodes.filter(n => n.status === k).length]));
  const byPriority = Object.fromEntries(Object.keys(PRIORITY_CONFIG).map(k => [k, nodes.filter(n => n.priority === k).length]));
  const byType = {
    topic:    nodes.filter(n => n.type === 'topic').length,
    subtopic: nodes.filter(n => n.type === 'subtopic').length,
    task:     nodes.filter(n => n.type === 'task').length,
  };

  const doneCount  = byStatus.concluido || 0;
  const blockedCount = byStatus.bloqueado || 0;
  const progress   = total > 0 ? Math.round(doneCount / total * 100) : 0;
  const stepProgress = Math.round((((map.currentStep || 1) - 1) / 6) * 100);

  const ICONS = { pendente: Clock, em_andamento: TrendingUp, concluido: CheckCircle2, bloqueado: XCircle };

  return (
    <div
      className="glass"
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '20px 28px',
        zIndex: 30,
        animation: 'fadeIn 0.2s ease-out',
        maxHeight: '38vh',
        overflow: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9' }}>Painel de Resumo</div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{map.name}</div>
        </div>
        <button className="btn-icon" onClick={toggle}><X size={16} /></button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>

        {/* Overall progress */}
        <div>
          <div className="section-label" style={{ marginBottom: 10 }}>Progresso Geral</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
            <div style={{ position: 'relative', width: 70, height: 70, flexShrink: 0 }}>
              <svg width="70" height="70" viewBox="0 0 70 70">
                <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                <circle cx="35" cy="35" r="28" fill="none" stroke="#38BDF8" strokeWidth="7"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                  strokeLinecap="round" transform="rotate(-90 35 35)"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#F1F5F9' }}>{progress}%</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#F1F5F9' }}>{total}</div>
              <div style={{ fontSize: 11, color: '#475569' }}>itens no mapa</div>
              <div style={{ fontSize: 11, color: '#22C55E' }}>{doneCount} concluídos</div>
              {blockedCount > 0 && <div style={{ fontSize: 11, color: '#EF4444' }}>{blockedCount} bloqueados</div>}
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>Etapa do fluxo</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${stepProgress}%` }} />
          </div>
          <div style={{ fontSize: 10, color: '#334155', marginTop: 3 }}>Etapa {map.currentStep || 1} de 7</div>
        </div>

        {/* Status breakdown */}
        <div>
          <div className="section-label" style={{ marginBottom: 10 }}>Por Status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
              const Icon = ICONS[key] || Clock;
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={13} color={cfg.color} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <StatBar label={cfg.label} count={byStatus[key] || 0} total={total} color={cfg.color} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority breakdown */}
        <div>
          <div className="section-label" style={{ marginBottom: 10 }}>Por Prioridade</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
              <StatBar key={key} label={cfg.label} count={byPriority[key] || 0} total={total} color={cfg.color} />
            ))}
          </div>
        </div>

        {/* Type breakdown + objective */}
        <div>
          <div className="section-label" style={{ marginBottom: 10 }}>Estrutura</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {[['Tópicos', byType.topic, '#6366F1'], ['Subtópicos', byType.subtopic, '#8B5CF6'], ['Tarefas', byType.task, '#10B981']].map(([l, c, color]) => (
              <StatBar key={l} label={l} count={c} total={total} color={color} />
            ))}
          </div>
          {map.objective && (
            <div>
              <div className="section-label" style={{ marginBottom: 6 }}>Objetivo</div>
              <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.55, background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '8px 10px', borderLeft: '2px solid rgba(56,189,248,0.3)' }}>
                {map.objective.length > 140 ? map.objective.slice(0, 140) + '…' : map.objective}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
