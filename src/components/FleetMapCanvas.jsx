import React from 'react';
import { useDispatch } from '../context/DispatchContext';

export default function FleetMapCanvas() {
  const { selectedIncident, responders } = useDispatch();

  return (
    <div className="flex-1 bg-slate-950 relative flex items-center justify-center">
      {/* Background Grid Pattern Mock Layout */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

      <div className="text-center z-10 space-y-2">
        <div className="text-4xl">🗺️</div>
        <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase">TACTICAL VECTOR FLEET MAP</h2>
        {selectedIncident ? (
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg max-w-sm">
            <p className="text-xs text-rose-400 font-bold">LOCKED INCIDENT: {selectedIncident._id}</p>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Target Lat/Lon: {selectedIncident.coordinates.latitude}, {selectedIncident.coordinates.longitude}
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-600 italic">Select an entry from the left queue to display tracking lines</p>
        )}
      </div>

      {/* Floating Fleet Registry HUD Overlay */}
      <div className="absolute bottom-6 right-6 p-4 bg-slate-900/90 border border-slate-800 rounded-xl max-w-xs shadow-2xl backdrop-blur-md">
        <h4 className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">LIVE FIELD PERSONNEL LOGS</h4>
        <div className="mt-2 space-y-1.5 text-xs">
          {Object.values(responders).length === 0 ? (
            <p className="text-slate-500 italic">No field personnel currently on shift.</p>
          ) : (
            Object.values(responders).map((res) => (
              <div key={res.id} className="flex justify-between items-center text-slate-300 font-mono">
                <span className="text-emerald-400 font-bold">🚑 Medic-{res.id.slice(-4)}</span>
                <span>Active Duty</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}