import { Handle, Position } from '@xyflow/react';
import { useMindMapStore } from '../../../store/mindMapStore.js';
import { NodeIcon, STATUS_CONFIG, PRIORITY_CONFIG } from '../../../utils/icons.js';
import { Plus } from 'lucide-react';

export default function SubtopicNode({ data, selected }) {
  const addNode = useMindMapStore(s => s.addNode);
  const selectNode = useMindMapStore(s => s.selectNode);
  const { title, color = '#38BDF8', icon = 'Circle', status, priority, type } = data;
  const statusCfg   = STATUS_CONFIG[status]    || STATUS_CONFIG.pendente;
  const priorityCfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.media;

  const isTask = type === 'task';

  return (
    <div
      className="subtopic-node mindmap-node nowheel"
      style={{
        borderLeft: `2.5px solid ${color}88`,
        boxShadow: selected ? `0 0 0 2px ${color}44, 0 2px 16px rgba(0,0,0,0.4)` : '0 2px 16px rgba(0,0,0,0.3)',
        opacity: status === 'concluido' ? 0.75 : 1,
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

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {status === 'concluido' ? (
          <span style={{ fontSize: 13 }}>✓</span>
        ) : status === 'bloqueado' ? (
          <span style={{ fontSize: 13 }}>⊗</span>
        ) : (
          <NodeIcon name={icon} size={13} color={`${color}cc`} />
        )}
        <span style={{
          fontSize: 12, fontWeight: 600, color: status === 'concluido' ? '#64748B' : '#CBD5E1',
          flex: 1, lineHeight: 1.25,
          textDecoration: status === 'concluido' ? 'line-through' : 'none',
        }}>
          {title.length > 26 ? title.slice(0, 26) + '…' : title}
        </span>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusCfg.color, flexShrink: 0 }} />
      </div>

      {!isTask && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 5 }}>
          <button
            className="btn-icon"
            title="Adicionar item"
            style={{ padding: 2, borderRadius: 5 }}
            onClick={(e) => { e.stopPropagation(); addNode(data.id, 'task'); }}
          >
            <Plus size={10} color="#475569" />
          </button>
        </div>
      )}
    </div>
  );
}
