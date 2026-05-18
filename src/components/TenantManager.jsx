import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function TenantManager() {
  const [activeTab, setActiveTab] = useState('REGISTRY'); // REGISTRY, PROVISION, or DEPLOY
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [systemLogs, setSystemLogs] = useState([]);

  // Form States - Provision New Tenant Group
  const [tenantName, setTenantName] = useState('');
  const [tenantDomain, setTenantDomain] = useState('');

  // Form States - Deploy New User Profile
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [selectedRole, setSelectedRole] = useState('Dispatcher');

  // Status message overlays
  const [feedback, setFeedback] = useState({ message: '', isError: false });

  // Fetch all existing tenants using your exact route endpoint vector
  const fetchTenantsList = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tenants/list');
      // Gracefully handle dynamic object structures from array wrapper vectors
      setTenants(res.data.tenants || res.data || []);
      addLogEntry("INFRASTRUCTURE", "Global tenant allocation directory synchronized successfully.");
    } catch (err) {
      console.error('Error fetching tenant directory registries:', err);
      addLogEntry("CRITICAL", "Failed to clear global tenant lookup collections.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle active tenant execution plane status bounds
  const toggleTenantPlane = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await api.patch(`/tenants/toggle/${id}`, { status: nextStatus });
      setTenants(prev => prev.map(t => t._id === id ? { ...t, status: nextStatus } : t));
      addLogEntry("SECURITY", `Modified tenant allocation [${id}] access configuration to: ${nextStatus}`);
      displayFeedback(`Tenant status successfully changed to ${nextStatus}.`);
    } catch (err) {
      console.error('Error modifying tenant state boundaries:', err);
      const errMsg = err.response?.data?.error || "Status vector mutation failure.";
      displayFeedback(errMsg, true);
      addLogEntry("FAULT", `Tenant status toggle rejected: ${errMsg}`);
    }
  };

  // Handler: Register a completely new tenant boundary onto the system cluster
  const handleProvisionTenant = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tenants', { name: tenantName, domain: tenantDomain });
      addLogEntry("PROVISION", `Successfully deployed tenant space: ${tenantName} (${tenantDomain})`);
      displayFeedback(`Organization boundary "${tenantName}" provisioned successfully!`);
      
      setTenantName('');
      setTenantDomain('');
      fetchTenantsList(); // Refresh baseline list directory
      setActiveTab('REGISTRY'); // Swap view straight back to core tracking console
    } catch (err) {
      const errMsg = err.response?.data?.error || "Failed to compile tenant database allocation.";
      displayFeedback(errMsg, true);
      addLogEntry("FAULT", `Tenant provisioning rejected: ${errMsg}`);
    }
  };

  // Handler: Deploy User Node straight into selected Tenant validation parameters
  const handleDeployUser = async (e) => {
    e.preventDefault();
    if (!selectedTenantId) {
      displayFeedback("Validation Fault: A target tenant allocation key is mandatory.", true);
      return;
    }

    try {
      // Hits your registration pipeline vector we validated via curl console terminal
      await api.post('/auth/register', {
        name: userName,
        email: userEmail,
        password: userPassword,
        tenantId: selectedTenantId,
        role: selectedRole
      });

      addLogEntry("USER_DEPLOY", `Provisioned ${selectedRole} profile linked to target scope [${selectedTenantId}]`);
      displayFeedback(`Successfully deployed ${selectedRole} into organization database context!`);
      
      setUserName('');
      setUserEmail('');
      setUserPassword('');
    } catch (err) {
      const errMsg = err.response?.data?.error || "Security token execution matrix mismatch.";
      displayFeedback(errMsg, true);
      addLogEntry("FAULT", `Operator profile deployment failure: ${errMsg}`);
    }
  };

  const addLogEntry = (type, action) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setSystemLogs(prev => [`[${timestamp}] ${type.toUpperCase()}: ${action}`, ...prev]);
  };

  const displayFeedback = (message, isError = false) => {
    setFeedback({ message, isError });
    setTimeout(() => setFeedback({ message: '', isError: false }), 5000);
  };

  useEffect(() => {
    fetchTenantsList();
    addLogEntry("SECURITY", "SuperAdmin core security matrix context initialized.");
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-100 font-sans">
      
      {/* Top Console Telemetry Action Head Block */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest">WORKSPACE MATRIX CONTROL CONSOLE</h3>
          <p className="text-xs text-slate-500 mt-0.5">Configure global multi-tenant boundary parameters and platform status settings.</p>
        </div>
        
        {/* Navigation Tab Engine Sub-Cluster */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setActiveTab('REGISTRY')} 
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg uppercase tracking-wider transition-all ${activeTab === 'REGISTRY' ? 'bg-rose-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'}`}
          >
            Tenant Registry
          </button>
          <button 
            onClick={() => setActiveTab('PROVISION')} 
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg uppercase tracking-wider transition-all ${activeTab === 'PROVISION' ? 'bg-rose-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'}`}
          >
            + Provision Tenant
          </button>
          <button 
            onClick={() => setActiveTab('DEPLOY')} 
            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg uppercase tracking-wider transition-all ${activeTab === 'DEPLOY' ? 'bg-rose-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'}`}
          >
            Deploy Operator
          </button>
          <button onClick={fetchTenantsList} className="px-3 py-1.5 bg-slate-800 text-[11px] rounded-lg font-bold hover:bg-slate-700 uppercase border border-slate-700/40">
            Sync Directories
          </button>
        </div>
      </div>

      {/* Operation Feedback Notice Banner */}
      {feedback.message && (
        <div className={`p-3 rounded-xl border text-[11px] font-mono font-bold uppercase tracking-wide transition-all ${
          feedback.isError ? 'bg-rose-950/40 border-rose-800 text-rose-400' : 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
        }`}>
          {feedback.isError ? '⚠️ CRITICAL FAULT: ' : '🏁 ACTION ACKNOWLEDGED: '} {feedback.message}
        </div>
      )}

      {/* Dynamic View Panels Layer Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Main Column: Controlled Form Modules vs Directory Table Display */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === 'REGISTRY' && (
            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 shadow-2xl">
              {loading ? (
                <div className="p-8 text-xs font-mono text-slate-500 italic flex items-center justify-center">
                  Syncing operational workspace nodes from Atlas cluster...
                </div>
              ) : tenants.length === 0 ? (
                <div className="p-8 text-center text-xs font-sans text-slate-500 border border-dashed border-slate-800 m-4 rounded-xl">
                  No active tenant infrastructure nodes committed to global lookup directory.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                        <th className="p-3 pl-4">PROVIDER NAME</th>
                        <th className="p-3">NETWORK DOMAIN</th>
                        <th className="p-3">TIER STATUS</th>
                        <th className="p-3 text-right pr-4">ACTION NODE CONTROL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-xs font-mono text-slate-300">
                      {tenants.map(t => (
                        <tr key={t._id} className="hover:bg-slate-900/30 transition-colors group">
                          <td className="p-3 pl-4 font-sans font-bold text-slate-200">
                            <div>{t.name}</div>
                            <span className="text-[9px] text-slate-600 font-mono select-all block mt-0.5 font-normal tracking-tight">ID: {t._id}</span>
                          </td>
                          <td className="p-3 text-slate-400">{t.domain || 'N/A'}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wide ${
                              t.status === 'Active' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/30' : 'bg-rose-950/60 text-rose-400 border border-rose-900/30'
                            }`}>
                              {t.status || 'Active'}
                            </span>
                          </td>
                          <td className="p-3 text-right pr-4">
                            <button
                              onClick={() => toggleTenantPlane(t._id, t.status || 'Active')}
                              className={`px-3 py-1 rounded-lg text-[10px] font-sans font-bold transition-colors ${
                                (t.status || 'Active') === 'Active' 
                                  ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-900/40' 
                                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60'
                              }`}
                            >
                              {(t.status || 'Active') === 'Active' ? 'SUSPEND PLANE' : 'ACTIVATE ACCESS'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'PROVISION' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-xl">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Provision Enterprise Tenant Container</h4>
              <form onSubmit={handleProvisionTenant} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Organization Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Lagos Central Emergency Services"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Network Domain Filter</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: lagosmedics.gov.ng"
                    value={tenantDomain}
                    onChange={(e) => setTenantDomain(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
                <button type="submit" className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl tracking-wider uppercase transition-colors shadow-md">
                  AUTHORIZE ENTERPRISE ALLOCATION
                </button>
              </form>
            </div>
          )}

          {activeTab === 'DEPLOY' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-xl">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Deploy Operator Sub-Node Workspace</h4>
              <form onSubmit={handleDeployUser} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Parent Tenant Target Allocation</label>
                  <select
                    required
                    value={selectedTenantId}
                    onChange={(e) => setSelectedTenantId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 transition-colors"
                  >
                    <option value="">-- SELECT PARENT CONTEXT ID BOUNDARY --</option>
                    {tenants.map(t => (
                      <option key={t._id} value={t._id}>{t.name} ({t.domain || 'No Domain'})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Operator Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Emmanuel Maiguwa"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">System Authorization Clearance</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 transition-colors"
                    >
                      <option value="Dispatcher">Dispatcher (Control Room Coordination)</option>
                      <option value="Paramedic">Paramedic (Field Fleet Response)</option>
                      <option value="Patient">Patient (Public Web Portal Entry)</option>
                      <option value="SuperAdmin">SuperAdmin (Root Structural Access)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Secure Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="operator@domain.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Initial Security Access Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
                <button type="submit" className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl tracking-wider uppercase transition-colors shadow-md">
                  AUTHORIZE OPERATOR SYSTEM INGRESS
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Right Column: Immutable Structural Security Audit Trails */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl h-fit flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Immutable Matrix Audit Trails</h4>
            <span className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest">Live telemetry buffer</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/60 max-h-80 overflow-y-auto font-mono text-[10px] text-slate-400 space-y-2 shadow-inner">
            {systemLogs.map((log, idx) => (
              <div key={idx} className="border-b border-slate-900/60 pb-1.5 last:border-0 leading-relaxed break-all">
                {log.includes('CRITICAL') || log.includes('FAULT') ? (
                  <span className="text-rose-500 font-bold">{log}</span>
                ) : log.includes('PROVISION') || log.includes('USER_DEPLOY') ? (
                  <span className="text-cyan-400 font-medium">{log}</span>
                ) : (
                  <span className="text-emerald-400">{log}</span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}