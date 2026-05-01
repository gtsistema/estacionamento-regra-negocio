import { useMindMapStore } from '../../store/mindMapStore.js';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal() {
  const deleteTarget = useMindMapStore(s => s.deleteTarget);
  const setDeleteTarget = useMindMapStore(s => s.setDeleteTarget);
  const deleteMap    = useMindMapStore(s => s.deleteMap);
  const deleteNode   = useMindMapStore(s => s.deleteNode);
  const getCurrentNodes = useMindMapStore(s => s.getCurrentNodes);
  const maps         = useMindMapStore(s => s.maps);

  if (!deleteTarget) return null;

  const isMap  = deleteTarget.type === 'map';
  const label  = isMap
    ? maps.find(m => m.id === deleteTarget.id)?.name ?? 'este mapa'
    : getCurrentNodes().find(n => n.id === deleteTarget.id)?.title ?? 'este item';

  const childCount = isMap ? 0 : (() => {
    const nodes = getCurrentNodes();
    const getDesc = (pid) => {
      const ch = nodes.filter(n => n.parentId === pid);
      return ch.reduce((a, c) => [...a, c.id, ...getDesc(c.id)], []);
    };
    return getDesc(deleteTarget.id).length;
  })();

  const handleConfirm = () => {
    if (isMap) deleteMap(deleteTarget.id);
    else deleteNode(deleteTarget.id);
  };

  return (
    <div className="modal-backdrop" onClick={() => setDeleteTarget(null)}>
      <div className="modal-box" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
          <div style={{ background: 'rgba(239,68,68,0.12)', borderRadius: 10, padding: 10, flexShrink: 0 }}>
            <AlertTriangle size={22} color="#EF4444" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9', marginBottom: 6 }}>
              Excluir {isMap ? 'mapa' : 'item'}?
            </div>
            <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>
              Você está prestes a excluir <strong style={{ color: '#CBD5E1' }}>"{label}"</strong>.
              {childCount > 0 && (
                <> Esta ação também removerá <strong style={{ color: '#F97316' }}>{childCount} {childCount === 1 ? 'item filho' : 'itens filhos'}</strong>.</>
              )}
              <br />Esta ação <strong style={{ color: '#EF4444' }}>não pode ser desfeita</strong>.
            </div>
          </div>
          <button className="btn-icon" onClick={() => setDeleteTarget(null)}><X size={16} /></button>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn-ghost" onClick={() => setDeleteTarget(null)}>Cancelar</button>
          <button className="btn-danger" onClick={handleConfirm} style={{ padding: '8px 18px' }}>
            Excluir definitivamente
          </button>
        </div>
      </div>
    </div>
  );
}
