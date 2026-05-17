import React, { useState } from 'react';

export default function LoginGateway({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthenticationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock verification sequence for local deployment / instant boot
    setTimeout(() => {
      if (email === 'admin@medicwatch.com' && password === 'controlroom2026') {
        localStorage.setItem('dispatch_token', 'SECURE_JWT_TELEMETRY_KEY');
        onLoginSuccess();
      } else {
        setError('CRITICAL FAULT: Invalid Operator Credentials or Security Token Clearance.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-between font-sans select-none relative overflow-hidden p-6">
      {/* Visual background grid pattern effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60"></div>
      
      {/* Invisible top spacer element to force absolute vertical layout balance */}
      <div className="h-4"></div>
      
      {/* Central Terminal Authorization Gateway Card */}
      <div className="w-full max-w-md p-8 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md z-10 relative">
        {/* Branding header */}
        <div className="flex flex-col items-center space-y-3 mb-8 text-center">
          <div className="h-12 w-12 rounded-xl bg-rose-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-rose-600/20 animate-pulse">
            MW
          </div>
          <div>
            <h1 className="text-md font-black tracking-widest text-white uppercase">MEDICWATCH GATEWAY</h1>
            <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mt-1">
              OPERATIONS COMMAND AUTHENTICATION REQUIRED
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-rose-950/40 border border-rose-800 rounded-lg text-[11px] font-mono font-bold text-rose-400 uppercase tracking-wide">
            {error}
          </div>
        )}

        <form onSubmit={handleAuthenticationSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              OPERATOR ID / EMAIL
            </label>
            <input
              type="email"
              required
              placeholder="admin@medicwatch.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              SECURITY ENCRYPTION PASSWORD
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-800 text-white text-xs font-bold rounded-xl transition-colors tracking-widest uppercase shadow-lg shadow-rose-600/10"
          >
            {loading ? 'INITIALIZING MATRIX LINK...' : 'AUTHORIZE COMMAND DECK ACCESS'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
            SECURE DATA STREAM // CLEARANCE LEVEL 03
          </p>
        </div>
      </div>

      {/* Corporate Compliance & Ownership Footer */}
      <footer className="z-10 text-center space-y-1">
        <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
          &copy; 2026 MedicWatch App. All Rights Reserved.
        </p>
        <p className="text-[9px] font-mono text-slate-600 tracking-widest uppercase">
          Proprietary Intelligence Platform Engineered by{' '}
          <span className="text-slate-400 font-bold tracking-normal">Sphere Innovision Ventures</span>
        </p>
      </footer>
    </div>
  );
}