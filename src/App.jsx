import React, { useState } from 'react';
import { useCentralSocket } from './hooks/useCentralSocket';
import { useDispatch } from './context/DispatchContext';
import IncidentQueue from './components/IncidentQueue';
import FleetMapCanvas from './components/FleetMapCanvas';
import LiveAudioStream from './components/LiveAudioStream';
import TenantManager from './components/TenantManager';
import api from './services/api';

export default function App() {
  // Establish baseline state layers and trigger socket connections
  useCentralSocket();
  const { selectedIncident, addOrUpdateIncident } = useDispatch();
  const [viewMode, setViewMode] = useState('DASHBOARD'); // 'DASHBOARD' or 'SUPERADMIN'
  const [paramedicInput, setParamedicInput] = useState('');

  const executeManualDispatchAssignment = async (e) => {
    e.preventDefault();
    if (!selectedIncident || !paramedicInput) return;

    try {
      const res = await api.patch(`/triage/update-incident/${selectedIncident._id}`, {
        status: 'RESPONDER_EN_ROUTE',
        paramedicId: paramedicInput,
      });
      addOrUpdateIncident(res.data.updatedIncident);
      setParamedicInput('');
    } catch (err) {
      console.error('Manual crew dispatch assignment fault:', err);
    }
  };

  // Mock authentication token if not present to ensure immediate workspace boot
  if (!localStorage.getItem('dispatch_token')) {
    localStorage.setItem('dispatch_token', 'MOCK_DISPATCH_TOKEN_KEY');
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 font-sans select-none">
      {/* Universal Operations Navigation Top Bar */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex justify-between items-center flex-shrink-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="h-6 w-6 rounded bg-rose-600 flex items-center justify-center font-black text-xs text-white">MW</div>
          <h1 className="text-sm font-black tracking-widest text-white uppercase">MEDICWATCH // CORE OPS COMMAND CENTER</h1>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('DASHBOARD')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all tracking-wide ${
              viewMode === 'DASHBOARD' ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            TACTICAL SCREEN
          </button>
          <button
            onClick={() => setViewMode('SUPERADMIN')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all tracking-wide ${
              viewMode === 'SUPERADMIN' ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            WORKSPACE MATRIX
          </button>
        </div>
      </header>

      {/* Primary Dynamic Content Node Workspace */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {viewMode === 'SUPERADMIN' ? (
          <div className="flex-1 overflow-y-auto bg-slate-900/20">
            <TenantManager />
          </div>
        ) : (
          <>
            {/* Left Column: Live Incident Tracking Queue */}
            <IncidentQueue />

            {/* Center Column: Live Fleet Telemetry Mapping Grid Canvas */}
            <FleetMapCanvas />

            {/* Right Column: Active Incident Details & Operational Control HUD */}
            <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-y-auto p-4 space-y-4">
              <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">TACTICAL OPERATION DETAILS</h2>
              
              {selectedIncident ? (
                <div className="space-y-4">
                  {/* Itemized Information Matrix Card */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">INCIDENT ID KEY</label>
                      <p className="text-xs font-mono font-bold text-slate-300 mt-0.5 truncate">{selectedIncident._id}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">PATIENT CLASSIFICATION</label>
                      <p className="text-sm font-bold text-slate-200 mt-0.5">{selectedIncident.patientId?.name || 'Anonymous Node'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">BLOOD TYPE</label>
                        <p className="text-xs font-bold text-rose-400 mt-0.5">{selectedIncident.patientId?.medicalProfile?.bloodType || 'O+'}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ALLERGY SCRIPTS</label>
                        <p className="text-xs font-bold text-slate-400 mt-0.5 truncate">{selectedIncident.patientId?.medicalProfile?.allergies?.join(', ') || 'None'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Manual Crew Dispatch Form Interceptor Control */}
                  {selectedIncident.status === 'PENDING_DISPATCH' && (
                    <form onSubmit={executeManualDispatchAssignment} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">DEPLOY AMBULANCE INTERCEPT</h4>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">PARAMEDIC RESOURCE ID</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: 6646bc789..."
                          value={paramedicInput}
                          onChange={(e) => setParamedicInput(e.target.value)}
                          className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-rose-500 transition-colors"
                        />
                      </div>
                      <button type="submit" className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors tracking-wide uppercase">
                        AUTHORIZE DISPATCH OVERRIDE
                      </button>
                    </form>
                  )}

                  {/* Real-time Field Audio Processing Panel */}
                  <LiveAudioStream activeIncidentId={selectedIncident._id} />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-4 border border-slate-800 border-dashed rounded-xl">
                  <p className="text-xs text-slate-500 italic">Select an incident from the operational queue to access command HUD fields.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}