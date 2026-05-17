import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function TenantManager() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTenantsList = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tenants/list');
      setTenants(res.data);
    } catch (err) {
      console.error('Error fetching tenant directory registries:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTenantPlane = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await api.patch(`/tenants/toggle/${id}`, { status: nextStatus });
      setTenants(prev => prev.map(t => t._id === id ? { ...t, status: nextStatus } : t));
    } catch (err) {
      console.error('Error modifying tenant state boundaries:', err);
    }
  };

  useEffect(() => {
    fetchTenantsList();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">WORKSPACE CONTROL CONSOLE</h3>
          <p className="text-xs text-slate-500">Configure global multi-tenant boundary parameters and platform status settings.</p>
        </div>
        <button onClick={fetchTenantsList} className="px-3 py-1.5 bg-slate-800 text-xs rounded font-bold hover:bg-slate-700">
          Sync Directories
        </button>
      </div>

      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
        {loading ? (
          <div className="p-4 text-xs text-slate-500 italic">Syncing operational workspace nodes...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                <th className="p-3">PROVIDER NAME</th>
                <th className="p-3">NETWORK DOMAIN</th>
                <th className="p-3">TIER STATUS</th>
                <th className="p-3">ACTION NODE CONTROL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs font-mono text-slate-300">
              {tenants.map(t => (
                <tr key={t._id} className="hover:bg-slate-900/40">
                  <td className="p-3 font-sans font-bold text-slate-200">{t.name}</td>
                  <td className="p-3">{t.domain}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                      t.status === 'Active' ? 'bg-emerald-900/40 text-emerald-400' : 'bg-rose-900/40 text-rose-400'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleTenantPlane(t._id, t.status)}
                      className={`px-3 py-1 rounded text-[10px] font-sans font-bold transition-colors ${
                        t.status === 'Active' ? 'bg-rose-950 hover:bg-rose-900 text-rose-400' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {t.status === 'Active' ? 'SUSPEND PLANE' : 'ACTIVATE ACCESS'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}