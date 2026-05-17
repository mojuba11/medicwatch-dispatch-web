import React, { useState } from 'react';

export default function LiveAudioStream({ activeIncidentId }) {
  const [isMonitoring, setIsMonitoring] = useState(false);

  if (!activeIncidentId) return null;

  return (
    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">SECURE FIELD COMMUNICATIONS</h4>
        <div className={`h-2 w-2 rounded-full ${isMonitoring ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
      </div>

      <p className="text-xs text-slate-500">
        Access real-time, encrypted microphone data arrays routed from the incident environment.
      </p>

      <button
        onClick={() => setIsMonitoring(!isMonitoring)}
        className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all tracking-wider uppercase ${
          isMonitoring 
            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
        }`}
      >
        {isMonitoring ? '⏹️ TERMINATE LIVE CHANNEL MONITOR' : '🎙️ CAPTURE FIELD MICROPHONE STREAM'}
      </button>
    </div>
  );
}