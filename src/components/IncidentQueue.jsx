import React from 'react';
import { useDispatch } from '../context/DispatchContext';

export default function IncidentQueue() {
  const { incidents, selectedIncident, setSelectedIncident } = useDispatch();

  const getPriorityColorStyle = (category) => {
    switch (category) {
      case 'HEART': return 'border-l-4 border-l-rose-500 text-rose-400';
      case 'BREATHING': return 'border-l-4 border-l-amber-500 text-amber-400';
      default: return 'border-l-4 border-l-sky-500 text-sky-400';
    }
  };

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
        <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">ACTIVE INCIDENT QUEUE</h2>
        <p className="text-xl font-extrabold text-white mt-1">{incidents.length} Emergency Signals</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {incidents.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm italic">
            No unresolved emergency signals in queue.
          </div>
        ) : (
          incidents.map((incident) => {
            const isSelected = selectedIncident && selectedIncident._id === incident._id;
            const isPending = incident.status === 'PENDING_DISPATCH';

            return (
              <div
                key={incident._id}
                onClick={() => setSelectedIncident(incident)}
                className={`p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer transition-all hover:border-slate-700 ${
                  isSelected ? 'ring-2 ring-rose-500' : ''
                } ${isPending && incident.triageCategory === 'HEART' ? 'pulse-critical' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-xs font-extrabold tracking-wide ${getPriorityColorStyle(incident.triageCategory)} pl-2`}>
                    {incident.triageCategory}
                  </span>
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                    {incident.status.replace('_', ' ')}
                  </span>
                </div>
                
                <h3 className="text-sm font-bold text-slate-200 mt-2">
                  Patient Node ID: {incident.patientId?.name || incident.patientId ? incident.patientId._id?.slice(-6) : 'Unknown'}
                </h3>
                
                <p className="text-xs text-slate-500 font-mono mt-1 truncate">
                  Lat: {incident.coordinates?.latitude.toFixed(4)}, Lon: {incident.coordinates?.longitude.toFixed(4)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}