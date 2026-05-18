import React, { useState, useEffect } from 'react';
import { useCentralSocket } from './hooks/useCentralSocket';
import { useDispatch } from './context/DispatchContext';
import IncidentQueue from './components/IncidentQueue';
import FleetMapCanvas from './components/FleetMapCanvas';
import LiveAudioStream from './components/LiveAudioStream';
import TenantManager from './components/TenantManager';
import LoginGateway from './components/LoginGateway';
import api from './services/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('dispatch_token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('operator_role') || 'Dispatcher');
  const [viewMode, setViewMode] = useState('DASHBOARD'); 
  const [paramedicInput, setParamedicInput] = useState('');
  
  useCentralSocket();
  const { selectedIncident, addOrUpdateIncident } = useDispatch();

  // Automatically configure the target landing matrix layer whenever authorization state transitions
  useEffect(() => {
    if (isAuthenticated) {
      const activeRole = localStorage.getItem('operator_role') || 'Dispatcher';
      setUserRole(activeRole);
      
      // SuperAdmins should immediately bypass the Dispatch room and land on the control infrastructure matrix
      if (activeRole === 'SuperAdmin') {
        setViewMode('SUPERADMIN');
      } else {
        setViewMode('DASHBOARD');
      }
    }
  }, [isAuthenticated]);

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

  const terminateOperatorSession = () => {
    localStorage.removeItem('dispatch_token');
    localStorage.removeItem('operator_role');
    localStorage.removeItem('tenant_id');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginGateway onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 font-sans select-none transition-all duration-300">
      {/* Universal Operations Navigation Top Bar */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex justify-between items-center flex-shrink-0 z-20 shadow-md">
        <div className="flex items-center space-x-4">
          <div className="h-6 w-6 rounded bg-rose-600 flex items-center justify-center font-black text-xs text-white">MW</div>
          <div className="flex items-center space-x-3">
            <h1 className="text-sm font-black tracking-widest text-white uppercase">
              MEDICWATCH {userRole === 'SuperAdmin' ? 'SUPERADMIN CONSOLE' : 'COMMAND CENTER'}
            </h1>
            <div className="flex items-center space-x-1.5 bg-emerald-950/40 border border-emerald-800/30 px-2 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[9px] font-mono font-bold text-emerald-400 tracking-wider uppercase">
                CLEARANCE:{userRole.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2 border-r border-slate-800 pr-3">
            {/* 🟢 Dispatcher Tab: Visible to everyone except dedicated SuperAdmin lock-out settings */}
            <button
              onClick={() => setViewMode('DASHBOARD')}
              className={`px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all tracking-wide ${
                viewMode === 'DASHBOARD' ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Incidents
            </button>
            
            {/* 🔐 SuperAdmin Tab Validation: Strictly render link vector if role contains authorized clearance string */}
            {userRole === 'SuperAdmin' && (
              <button
                onClick={() => setViewMode('SUPERADMIN')}
                className={`px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all tracking-wide ${
                  viewMode === 'SUPERADMIN' ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                WORKSPACE MATRIX
              </button>
            )}
          </div>

          <button
            onClick={terminateOperatorSession}
            className="px-3 py-1.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-950 hover:bg-rose-950/40 hover:text-rose-400 border border-slate-800 hover:border-rose-900 rounded-lg transition-all uppercase"
          >
            LOGOUT
          </button>
        </div>
      </header>

      {/* Primary Dynamic Content Node Workspace */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {viewMode === 'SUPERADMIN' && userRole === 'SuperAdmin' ? (
          <div className="flex-1 overflow-y-auto bg-slate-900/20 transition-opacity duration-300">
            <TenantManager />
          </div>
        ) : (
          <>
            <IncidentQueue />
            <FleetMapCanvas />

            {/* Right Column HUD */}
            <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-y-auto p-4 space-y-4 shadow-2xl">
              <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">OPERATION DETAILS</h2>
              
              {selectedIncident ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 shadow-inner">
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

      {/* Unified Command Center Bottom Status Bar Footer */}
      <footer className="h-8 bg-slate-900 border-t border-slate-800 px-6 flex justify-between items-center flex-shrink-0 z-20 text-[10px] font-mono tracking-wider text-slate-500">
        <div className="flex items-center space-x-4">
          <p className="uppercase font-bold text-slate-400">
            &copy; 2026 MEDICWATCH APP
          </p>
          <span className="text-slate-800">|</span>
          <p className="uppercase">
            Product of <span className="text-slate-300 font-bold">Sphere Innovision Ventures</span>
          </p>
        </div>

        <div className="flex items-center space-x-6 uppercase">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-600">SYS_MODE:</span>
            <span className="text-rose-500 font-bold">LIVE</span>
          </div>
          <div className="flex items-center space-x-1.5 hidden md:flex">
            <span className="text-slate-600">LOCATION:</span>
            <span className="text-slate-400">LAGOS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}