import { ReactFlowProvider } from '@xyflow/react';
import { useMindMapStore } from './store/mindMapStore.js';
import Header          from './components/Header/Header.jsx';
import Sidebar         from './components/Sidebar/Sidebar.jsx';
import MindMapCanvas   from './components/Canvas/MindMapCanvas.jsx';
import RightPanel      from './components/Panel/RightPanel.jsx';
import StepWizard      from './components/Wizard/StepWizard.jsx';
import DashboardPanel  from './components/Dashboard/DashboardPanel.jsx';
import CreateMapModal  from './components/Modals/CreateMapModal.jsx';
import DeleteConfirmModal from './components/Modals/DeleteConfirmModal.jsx';

export default function App() {
  const sidebarOpen      = useMindMapStore(s => s.sidebarOpen);
  const rightPanelOpen   = useMindMapStore(s => s.rightPanelOpen);
  const dashboardOpen    = useMindMapStore(s => s.dashboardOpen);
  const showCreateModal  = useMindMapStore(s => s.showCreateModal);
  const deleteTarget     = useMindMapStore(s => s.deleteTarget);

  return (
    <ReactFlowProvider>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Header />

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
          {/* Left Sidebar */}
          {sidebarOpen && <Sidebar />}

          {/* Canvas area */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <MindMapCanvas />
            <StepWizard />
            {dashboardOpen && <DashboardPanel />}
          </div>

          {/* Right Panel */}
          {rightPanelOpen && <RightPanel />}
        </div>

        {/* Modals */}
        {showCreateModal && <CreateMapModal />}
        {deleteTarget    && <DeleteConfirmModal />}
      </div>
    </ReactFlowProvider>
  );
}
