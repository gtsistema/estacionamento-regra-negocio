import { useCallback, useEffect, useRef, useMemo } from 'react';
import {
  ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState,
  BackgroundVariant, SelectionMode, useReactFlow,
} from '@xyflow/react';
import { useMindMapStore } from '../../store/mindMapStore.js';
import CentralNode  from './nodes/CentralNode.jsx';
import TopicNode    from './nodes/TopicNode.jsx';
import SubtopicNode from './nodes/SubtopicNode.jsx';

const NODE_TYPES = {
  centralNode:  CentralNode,
  topicNode:    TopicNode,
  subtopicNode: SubtopicNode,
};

function toRFNodes(storeNodes) {
  return storeNodes.map(n => ({
    id: n.id,
    type: n.type === 'central' ? 'centralNode'
        : n.type === 'topic'   ? 'topicNode'
        : 'subtopicNode',
    position: n.position ?? { x: 0, y: 0 },
    data: n,
    draggable: true,
  }));
}

function toRFEdges(storeNodes) {
  const nodeSet = new Set(storeNodes.map(n => n.id));
  return storeNodes
    .filter(n => n.parentId && nodeSet.has(n.parentId))
    .map(n => ({
      id: `e-${n.parentId}-${n.id}`,
      source: n.parentId,
      target: n.id,
      type: 'smoothstep',
      animated: n.status === 'em_andamento',
      style: {
        stroke: n.color ? `${n.color}99` : '#334155',
        strokeWidth: n.type === 'topic' ? 2.5 : 1.5,
      },
    }));
}

export default function MindMapCanvas() {
  const storeNodes      = useMindMapStore(s => s.getCurrentNodes());
  const selectedNodeId  = useMindMapStore(s => s.selectedNodeId);
  const selectNode      = useMindMapStore(s => s.selectNode);
  const updateNodePos   = useMindMapStore(s => s.updateNodePosition);
  const connectNodes   = useMindMapStore(s => s.connectNodes);
  const searchQuery     = useMindMapStore(s => s.searchQuery);
  const filters         = useMindMapStore(s => s.filters);

  const { fitView } = useReactFlow();

  const [rfNodes, setRfNodes, onRFNodesChange] = useNodesState([]);
  const [rfEdges, setRfEdges]                  = useEdgesState([]);
  const isDragging    = useRef(false);
  const prevFocusedId = useRef(null);

  // Compute filtered node IDs for dimming
  const filteredIds = useMemo(() => {
    if (!searchQuery && !filters.status && !filters.priority && !filters.type) return null;
    const q = searchQuery.toLowerCase();
    return new Set(
      storeNodes
        .filter(n =>
          (!q || n.title.toLowerCase().includes(q) || (n.description || '').toLowerCase().includes(q)) &&
          (!filters.status   || n.status   === filters.status) &&
          (!filters.priority || n.priority === filters.priority) &&
          (!filters.type     || n.type     === filters.type)
        )
        .map(n => n.id)
    );
  }, [storeNodes, searchQuery, filters]);

  // FitView to node when selected externally (from fluxo tab)
  useEffect(() => {
    if (!selectedNodeId || selectedNodeId === prevFocusedId.current) return;
    if (!rfNodes.some(n => n.id === selectedNodeId)) return; // not yet synced to RF
    prevFocusedId.current = selectedNodeId;
    const timer = setTimeout(() => {
      fitView({ nodes: [{ id: selectedNodeId }], duration: 450, maxZoom: 1.3, padding: 0.9 });
    }, 40);
    return () => clearTimeout(timer);
  }, [selectedNodeId, rfNodes, fitView]);

  // Sync store → RF when not dragging
  useEffect(() => {
    if (isDragging.current) return;
    const nodes = toRFNodes(storeNodes).map(n => ({
      ...n,
      style: filteredIds && !filteredIds.has(n.id)
        ? { opacity: 0.2, pointerEvents: 'none' }
        : {},
      selected: n.id === selectedNodeId,
    }));
    setRfNodes(nodes);
    setRfEdges(toRFEdges(storeNodes));
  }, [storeNodes, selectedNodeId, filteredIds]);

  const onNodesChange = useCallback((changes) => {
    const hasDragMove = changes.some(c => c.type === 'position' && c.dragging);
    const hasDragEnd  = changes.some(c => c.type === 'position' && c.dragging === false && c.position);

    if (hasDragMove) isDragging.current = true;
    onRFNodesChange(changes);

    if (hasDragEnd) {
      isDragging.current = false;
      changes.forEach(c => {
        if (c.type === 'position' && c.dragging === false && c.position) {
          updateNodePos(c.id, c.position);
        }
      });
    }
  }, [onRFNodesChange, updateNodePos]);

  const onNodeClick = useCallback((_, node) => {
    selectNode(node.id);
  }, [selectNode]);

  const onConnect = useCallback((connection) => {
    if (connection.source && connection.target) {
      connectNodes(connection.target, connection.source);
    }
  }, [connectNodes]);

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div id="mindmap-canvas" style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.15}
        maxZoom={2.5}
        selectionMode={SelectionMode.Partial}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={null}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#1E293B"
        />
        <Controls
          style={{ bottom: 24, left: 24 }}
          showInteractive={false}
        />
        <MiniMap
          style={{ bottom: 24, right: 24, background: 'rgba(15,23,42,0.95)' }}
          nodeColor={n => {
            const sn = storeNodes.find(s => s.id === n.id);
            return sn?.color ?? '#334155';
          }}
          maskColor="rgba(15,23,42,0.7)"
        />
      </ReactFlow>
    </div>
  );
}
