import { Handle, Position } from '@xyflow/react';
import { useMindMapStore } from '../../../store/mindMapStore.js';
import { NodeIcon, STATUS_CONFIG } from '../../../utils/icons.js';
import { Plus } from 'lucide-react';

export default function CentralNode({ data, selected }) {
  const addNode = useMindMapStore(s => s.addNode);
  const selectNode = useMindMapStore(s => s.selectNode);
  const { title, description, color = '#38BDF8', icon = 'Brain', status } = data;
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.pendente;

  return (
    <div
      className={`central-node mindmap-node nowheel`}
      style={{ borderColor: selected ? '#38BDF8' : `${color}99` }}
      onClick={() => selectNode(data.id)}
    >
      <Handle type="source" position={Position.Top}    id="t" style={{ top: -4 }} />
      <Handle type="source" position={Position.Bottom} id="b" style={{ bottom: -4 }} />
      <Handle type="source" position={Position.Left}   id="l" style={{ left: -4 }} />
      <Handle type="source" position={Position.Right}  id="r" style={{ right: -4 }} />
      <Handle type="target" position={Position.Top}    id="tt" style={{ top: -4 }} />
      <Handle type="target" position={Position.Bottom} id="bt" style={{ bottom: -4 }} />
      <Handle type="target" position={Position.Left}   id="lt" style={{ left: -4 }} />
      <Handle type="target" position={Position.Right}  id="rt" style={{ right: -4 }} />

      <div style={{ marginBottom: 6 }}>
        <NodeIcon name={icon} size={28} color={color} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#F1F5F9', lineHeight: 1.2, marginBottom: 4 }}>
        {title.length > 22 ? title.slice(0, 22) + '…' : title}
      </div>
      <div
        className="chip"
        style={{ background: statusCfg.bg, color: statusCfg.color, fontSize: 10, marginBottom: 6 }}
      >
        {statusCfg.label}
      </div>
      <button
        className="btn-icon"
        title="Adicionar tópico"
        style={{ background: 'rgba(56,189,248,0.12)', borderRadius: 20, padding: '3px 8px', fontSize: 11, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: 4 }}
        onClick={(e) => { e.stopPropagation(); addNode(data.id, 'topic'); }}
      >
        <Plus size={12} /> Tópico
      </button>
    </div>
  );
}
