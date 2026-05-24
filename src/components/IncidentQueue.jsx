import React, { useState } from 'react';
import { useDispatch } from '../context/DispatchContext';

export default function IncidentQueue() {
  const { incidents, addOrUpdateIncident, selectedIncident, setSelectedIncident } = useDispatch();
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [showSimulator, setShowSimulator] = useState(false);

  // High-fidelity Mock Emergency Generator Data Array
  const mockScenarios = [
    {
      _id: "MW-SIM-" + Math.floor(1000 + Math.random() * 9000),
      status: "PENDING_DISPATCH",
      severity: "CRITICAL",
      location: { coordinates: [3.3515, 6.4446] }, // Ikoyi, Lagos coordinates
      patientId: {
        name: "Adeleye Oyebanji",
        medicalProfile: { bloodType: "A+", allergies: ["Penicillin", "Sulfa"] }
      }
    },
    {
      _id: "MW-SIM-" + Math.floor(1000 + Math.random() * 9000),
      status: "RESPONDER_EN_ROUTE",
      severity: "SERIOUS",
      location: { coordinates: [3.3792, 6.5244] }, // Lagos Mainland coordinates
      patientId: {
        name: "Ajala Adepoju",
        medicalProfile: { bloodType: "O-", allergies: ["None Reported"] }
      }
    },
    {
      _id: "MW-SIM-" + Math.floor(1000 + Math.random() * 9000),
      status: "PENDING_DISPATCH",
      severity: "MINOR",
      location: { coordinates: [3.2474, 6.6018] }, // Ikeja coordinates
      patientId: {
        name: "Arthur Pendelton",
        medicalProfile: { bloodType: "B+", allergies: ["Aspirin"] }
      }
    }
  ];

  const injectSimulatedSignal = (scenario) => {
    // Inject the selected scenario directly into our global state layer
    addOrUpdateIncident(scenario);
    setSelectedIncident(scenario);
  };

  // Filter the active incidents array based on the operator's toggle choice
  const filteredIncidents = (incidents || []).filter(incident => {
    if (severityFilter === 'ALL') return true;
    return incident.severity === severityFilter;
  });

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-hidden flex-shrink-0 relative">
      
      {/* Queue Controller Header */}
      <div className="p-4 border-b border-slate-800 space-y-3 flex-shrink-0 bg-slate-900/50">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">ACTIVE INCIDENT QUEUE</h2>
          <button 
            onClick={() => setShowSimulator(!showSimulator)}
            className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 hover:bg-rose-950/40 text-rose-400 border border-slate-800 hover:border-rose-900 transition-colors uppercase"
          >
            {showSimulator ? '✕ CLOSE SIM' : '⚙️ SIMULATOR'}
          </button>
        </div>
        
        <div className="text-2xl font-black text-white flex items-baseline space-x-2">
          <span>{filteredIncidents.length}</span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Signals Monitored</span>
        </div>

        {/* Tactical Filter Tabs Block */}
        <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800">
          {['ALL', 'CRITICAL', 'SERIOUS', 'MINOR'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSeverityFilter(filter)}
              className={`py-1 text-[9px] font-mono font-black rounded transition-all ${
                severityFilter === filter 
                  ? filter === 'CRITICAL' ? 'bg-rose-600 text-white' : filter === 'SERIOUS' ? 'bg-amber-600 text-white' : filter === 'MINOR' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {filter === 'ALL' ? 'ALL' : filter.substring(0, 4)}
            </button>
          ))}
        </div>
      </div>

      {/* Hidden Collapsible Telemetry Simulation Control Deck */}
      {showSimulator && (
        <div className="bg-slate-950 border-b border-slate-800 p-3 space-y-2 flex-shrink-0 z-10 animate-fadeIn">
          <p className="text-[9px] font-mono font-bold text-slate-500 tracking-wider uppercase">INJECT LIVE SIMULATION VECTORS:</p>
          <div className="flex flex-col space-y-1.5">
            {mockScenarios.map((scen, idx) => (
              <button
                key={idx}
                onClick={() => injectSimulatedSignal(scen)}
                className="w-full p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left rounded-md transition-colors flex justify-between items-center"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-200">{scen.patientId.name}</span>
                  <span className="text-[8px] font-mono text-slate-500 uppercase">LOC: [{scen.location.coordinates.join(', ')}]</span>
                </div>
                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  scen.severity === 'CRITICAL' ? 'bg-rose-950/40 text-rose-400 border border-rose-900' :
                  scen.severity === 'SERIOUS' ? 'bg-amber-950/40 text-amber-400 border border-amber-900' :
                  'bg-emerald-950/40 text-emerald-400 border border-emerald-900'
                }`}>
                  {scen.severity}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Incident List Scrolling Element */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0 bg-slate-950/20">
        {filteredIncidents.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center p-4">
            <p className="text-xs text-slate-600 italic">No active tactical signals match current filtering clearance.</p>
          </div>
        ) : (
          filteredIncidents.map((incident) => {
            const isSelected = selectedIncident?._id === incident._id;
            return (
              <div
                key={incident._id}
                onClick={() => setSelectedIncident(incident)}
                className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-slate-900 border-rose-500 shadow-md shadow-rose-950/10' 
                    : incident.severity === 'CRITICAL' 
                      ? 'bg-slate-900/50 border-rose-950/60 hover:border-rose-900/50 pulse-critical' 
                      : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-slate-500 font-bold truncate max-w-[140px]">
                    #{incident._id}
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    incident.severity === 'CRITICAL' ? 'bg-rose-950/50 text-rose-400' :
                    incident.severity === 'SERIOUS' ? 'bg-amber-950/50 text-amber-400' :
                    'bg-emerald-950/50 text-emerald-400'
                  }`}>
                    {incident.severity}
                  </span>
                </div>
                
                <p className="text-xs font-bold text-slate-200 mt-2">
                  {incident.patientId?.name || 'Anonymous Node'}
                </p>
                
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800/60 text-[9px] font-mono text-slate-500">
                  <span className="uppercase tracking-wider">STATUS:</span>
                  <span className={`font-bold ${
                    incident.status === 'PENDING_DISPATCH' ? 'text-amber-500' : 'text-sky-400'
                  }`}>
                    {incident.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
