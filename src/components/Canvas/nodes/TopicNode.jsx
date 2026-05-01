import { Handle, Position } from '@xyflow/react';
import { useMindMapStore } from '../../../store/mindMapStore.js';
import { NodeIcon, STATUS_CONFIG, PRIORITY_CONFIG } from '../../../utils/icons.js';
import { Plus, PlusCircle } from 'lucide-react';

export default function TopicNode({ data, selected }) {
  const addNode = useMindMapStore(s => s.addNode);
  const selectNode = useMindMapStore(s => s.selectNode);
  const { title, description, color = '#6366F1', icon = 'Circle', status, priority } = data;
  const statusCfg  = STATUS_CONFIG[status]   || STATUS_CONFIG.pendente;
  const priorityCfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.media;

  return (
    <div
      className="topic-node mindmap-node nowheel"
      style={{
        borderLeft: `3.5px solid ${color}`,
        boxShadow: selected ? `0 0 0 2px ${color}55, 0 4px 24px rgba(0,0,0,0.4)` : '0 4px 24px rgba(0,0,0,0.35)',
      }}
      onClick={() => selectNode(data.id)}
    >
      <Handle type="source" position={Position.Top}    id="t" />
      <Handle type="source" position={Position.Bottom} id="b" />
      <Handle type="source" position={Position.Left}   id="l" />
      <Handle type="source" position={Position.Right}  id="r" />
      <Handle type="target" position={Position.Top}    id="tt" />
      <Handle type="target" position={Position.Bottom} id="bt" />
      <Handle type="target" position={Position.Left}   id="lt" />
      <Handle type="target" position={Position.Right}  id="rt" />

      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
        <NodeIcon name={icon} size={16} color={color} />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9', flex: 1, lineHeight: 1.2 }}>
          {title.length > 24 ? title.slice(0, 24) + '…' : title}
        </span>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: priorityCfg.color, flexShrink: 0 }} title={`Prioridade: ${priorityCfg.label}`} />
      </div>

      {description && (
        <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.4, marginBottom: 7 }}>
          {description.length > 50 ? description.slice(0, 50) + '…' : description}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="chip" style={{ background: statusCfg.bg, color: statusCfg.color, fontSize: 10 }}>
          {statusCfg.label}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            className="btn-icon"
            title="Adicionar subtópico"
            style={{ padding: 3, borderRadius: 6 }}
            onClick={(e) => { e.stopPropagation(); addNode(data.id, 'subtopic'); }}
          >
            <Plus size={11} color={color} />
          </button>
          <button
            className="btn-icon"
            title="Adicionar tarefa"
            style={{ padding: 3, borderRadius: 6 }}
            onClick={(e) => { e.stopPropagation(); addNode(data.id, 'task'); }}
          >
            <PlusCircle size={11} color="#94A3B8" />
          </button>
        </div>
      </div>
    </div>
  );
}
