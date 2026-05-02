import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { gtsystemMap } from '../data/gtsystemData.js';

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const TOPIC_COLORS = ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#38BDF8', '#F87171', '#34D399'];

export const useMindMapStore = create(
  persist(
    (set, get) => ({
      maps: [gtsystemMap],
      currentMapId: gtsystemMap.id,
      selectedNodeId: null,
      sidebarOpen: true,
      rightPanelOpen: false,
      dashboardOpen: false,
      showCreateModal: false,
      deleteTarget: null,   // { type: 'map'|'node', id }
      searchQuery: '',
      filters: { status: '', priority: '', type: '' },

      // ─── Derived getters ──────────────────────────────────
      getCurrentMap() {
        const { maps, currentMapId } = get();
        return maps.find(m => m.id === currentMapId) ?? maps[0] ?? null;
      },
      getCurrentNodes() {
        return get().getCurrentMap()?.nodes ?? [];
      },
      getSelectedNode() {
        const { selectedNodeId, getCurrentNodes } = get();
        return getCurrentNodes().find(n => n.id === selectedNodeId) ?? null;
      },
      getFilteredNodes() {
        const { getCurrentNodes, searchQuery, filters } = get();
        return getCurrentNodes().filter(n => {
          if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) && !n.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
          if (filters.status && n.status !== filters.status) return false;
          if (filters.priority && n.priority !== filters.priority) return false;
          if (filters.type && n.type !== filters.type) return false;
          return true;
        });
      },

      // ─── Map actions ─────────────────────────────────────
      createMap(data) {
        const id = genId();
        const centralNode = {
          id: genId(), parentId: null,
          title: data.name, description: data.description || '',
          type: 'central', status: 'pendente', priority: 'alta',
          color: '#38BDF8', icon: 'Brain', step: 1,
          responsible: '', deadline: '', notes: '',
          position: { x: 0, y: 0 },
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        };
        const map = {
          id, name: data.name, description: data.description || '',
          category: data.category || 'personalizado', objective: data.objective || '',
          currentStep: 1, nodes: [centralNode],
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        };
        set(s => ({ maps: [...s.maps, map], currentMapId: id, selectedNodeId: null, rightPanelOpen: false, showCreateModal: false }));
      },

      createMapFromTemplate(templateMap) {
        set(s => ({ maps: [...s.maps, templateMap], currentMapId: templateMap.id, selectedNodeId: null, rightPanelOpen: false, showCreateModal: false }));
      },

      deleteMap(id) {
        set(s => {
          const maps = s.maps.filter(m => m.id !== id);
          const currentMapId = s.currentMapId === id ? (maps[0]?.id ?? null) : s.currentMapId;
          return { maps, currentMapId, deleteTarget: null, selectedNodeId: null, rightPanelOpen: false };
        });
      },

      duplicateMap(id) {
        const map = get().maps.find(m => m.id === id);
        if (!map) return;
        const newMap = { ...map, id: genId(), name: `${map.name} (cópia)`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        set(s => ({ maps: [...s.maps, newMap], currentMapId: newMap.id }));
      },

      switchMap(id) { set({ currentMapId: id, selectedNodeId: null, rightPanelOpen: false }); },

      updateMapMeta(updates) {
        set(s => ({
          maps: s.maps.map(m => m.id === s.currentMapId ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m),
        }));
      },

      setCurrentStep(step) {
        set(s => ({ maps: s.maps.map(m => m.id === s.currentMapId ? { ...m, currentStep: step } : m) }));
      },

      // ─── Node actions ─────────────────────────────────────
      addNode(parentId, type = 'subtopic') {
        const nodes = get().getCurrentNodes();
        const parent = nodes.find(n => n.id === parentId);
        if (!parent) return;

        const siblings = nodes.filter(n => n.parentId === parentId);
        const angle = ((siblings.length * 50) - 90) * (Math.PI / 180);
        const radius = type === 'topic' ? 420 : 250;
        const pos = {
          x: Math.round(parent.position.x + Math.cos(angle) * radius),
          y: Math.round(parent.position.y + Math.sin(angle) * radius),
        };

        const colorIdx = nodes.filter(n => n.type === 'topic').length % TOPIC_COLORS.length;

        const node = {
          id: genId(), parentId,
          title: type === 'topic' ? 'Novo Tópico' : type === 'task' ? 'Nova Tarefa' : 'Novo Subtópico',
          description: '', type,
          status: 'pendente', priority: 'media',
          color: type === 'topic' ? TOPIC_COLORS[colorIdx] : (parent.color || '#38BDF8'),
          icon: 'Circle', step: get().getCurrentMap()?.currentStep ?? 1,
          responsible: '', deadline: '', notes: '',
          position: pos,
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        };

        set(s => ({
          maps: s.maps.map(m => m.id === s.currentMapId
            ? { ...m, nodes: [...m.nodes, node], updatedAt: new Date().toISOString() }
            : m),
          selectedNodeId: node.id,
          rightPanelOpen: true,
        }));
        return node.id;
      },

      updateNode(id, updates) {
        set(s => ({
          maps: s.maps.map(m => m.id === s.currentMapId
            ? { ...m, nodes: m.nodes.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n), updatedAt: new Date().toISOString() }
            : m),
        }));
      },

      updateNodePosition(id, position) {
        set(s => ({
          maps: s.maps.map(m => m.id === s.currentMapId
            ? { ...m, nodes: m.nodes.map(n => n.id === id ? { ...n, position } : n) }
            : m),
        }));
      },

      deleteNode(id) {
        const nodes = get().getCurrentNodes();
        const getAllDesc = (pid) => {
          const children = nodes.filter(n => n.parentId === pid);
          return children.reduce((acc, c) => [...acc, c.id, ...getAllDesc(c.id)], []);
        };
        const toDelete = new Set([id, ...getAllDesc(id)]);
        set(s => ({
          maps: s.maps.map(m => m.id === s.currentMapId
            ? { ...m, nodes: m.nodes.filter(n => !toDelete.has(n.id)), updatedAt: new Date().toISOString() }
            : m),
          selectedNodeId: toDelete.has(s.selectedNodeId) ? null : s.selectedNodeId,
          rightPanelOpen: toDelete.has(s.selectedNodeId) ? false : s.rightPanelOpen,
          deleteTarget: null,
        }));
      },

      duplicateNode(id) {
        const nodes = get().getCurrentNodes();
        const node = nodes.find(n => n.id === id);
        if (!node) return;
        const dup = { ...node, id: genId(), title: `${node.title} (cópia)`, position: { x: node.position.x + 50, y: node.position.y + 50 }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        set(s => ({
          maps: s.maps.map(m => m.id === s.currentMapId
            ? { ...m, nodes: [...m.nodes, dup], updatedAt: new Date().toISOString() }
            : m),
          selectedNodeId: dup.id,
        }));
      },

      // Conectar nó filho a outro pai (arrasta-e-solta)
      connectNodes(childId, newParentId) {
        const nodes = get().getCurrentNodes();
        const child = nodes.find(n => n.id === childId);
        const newParent = nodes.find(n => n.id === newParentId);
        if (!child || !newParent || childId === newParentId) return;

        // Verificar se não é ancestor (evitar ciclo)
        const getAncestors = (pid) => {
          const parent = nodes.find(n => n.id === pid);
          if (!parent || !parent.parentId) return [];
          return [parent.parentId, ...getAncestors(parent.parentId)];
        };
        if (getAncestors(newParentId).includes(childId)) return;

        set(s => ({
          maps: s.maps.map(m => m.id === s.currentMapId
            ? {
                ...m,
                nodes: m.nodes.map(n => n.id === childId
                  ? { ...n, parentId: newParentId, color: newParent.color || n.color, updatedAt: new Date().toISOString() }
                  : n),
                updatedAt: new Date().toISOString(),
              }
            : m),
        }));
      },

      // ─── UI actions ───────────────────────────────────────
      selectNode(id) { set({ selectedNodeId: id, rightPanelOpen: !!id }); },
      toggleSidebar() { set(s => ({ sidebarOpen: !s.sidebarOpen })); },
      toggleDashboard() { set(s => ({ dashboardOpen: !s.dashboardOpen })); },
      closeRightPanel() { set({ rightPanelOpen: false, selectedNodeId: null }); },
      setShowCreateModal(v) { set({ showCreateModal: v }); },
      setDeleteTarget(v) { set({ deleteTarget: v }); },
      setSearchQuery(q) { set({ searchQuery: q }); },
      setFilter(key, value) { set(s => ({ filters: { ...s.filters, [key]: value } })); },
      clearFilters() { set({ searchQuery: '', filters: { status: '', priority: '', type: '' } }); },
    }),
    {
      name: 'mindflow-v2',
      version: 2,
      onRehydrateStorage: () => (state) => {
        // Ensure GTSystem map always exists after rehydration
        if (state && state.maps && !state.maps.find(m => m.id === 'map-gtsystem')) {
          state.maps = [gtsystemMap, ...state.maps];
        }
      },
    }
  )
);
