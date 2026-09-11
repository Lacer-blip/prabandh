import React, { useState } from 'react';
import { api, setAuthToken } from '../api';

export default function LoginPortal({ onLoginSuccess }) {
  // 'APPROVER' | 'DEPT' | 'COA'
  const [portalMode, setPortalMode] = useState('APPROVER');
  const [email, setEmail] = useState('sr.dom.bpl@railways.gov.in');
  const [password, setPassword] = useState('Rail@2026');
  const [selectedDept, setSelectedDept] = useState('Civil Engineering (TMS)');
  const [errorMsg, setErrorMsg] = useState('');

   const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.endsWith('@railways.gov.in')) {
      setErrorMsg('Access Restricted: Email must belong to the official @railways.gov.in domain.');
      return;
    }

    try {
      const response = await api.login(email, password);
      setAuthToken(response.access_token);
      onLoginSuccess(response.user);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials and try again.');
    }
  };

  const handleSwitchMode = (mode) => {
    setPortalMode(mode);
    setErrorMsg('');
    if (mode === 'APPROVER') {
      setEmail('sr.dom.bpl@railways.gov.in');
    } else if (mode === 'COA') {
      setEmail('coa.feed.bpl@railways.gov.in');
    } else {
      setEmail('civil.bpl@railways.gov.in');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-between font-sans transition-colors">
      <div className="bg-[#0b192c] text-white px-6 py-2.5 flex justify-between items-center text-xs">
        <div className="flex items-center space-x-2">
          <span>🇮🇳</span>
          <span className="font-bold">Government of India • Ministry of Railways</span>
        </div>
        <div className="font-mono text-blue-300">IR-AIS v2.4 (CRIS Architecture)</div>
      </div>

      <div className="max-w-xl w-full mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-serif font-extrabold text-[#8b1e0f] dark:text-amber-500 tracking-wide">
            INDIAN RAILWAYS
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Corridor-Block Optimization & AI Slotting Engine (PS 26027)
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          {/* 3-Way Role Selector */}
          <div className="grid grid-cols-3 text-xs font-bold border-b border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => handleSwitchMode('APPROVER')}
              className={`py-3 text-center transition cursor-pointer ${
                portalMode === 'APPROVER'
                  ? 'bg-emerald-700 text-white border-b-2 border-emerald-400'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🚦 Approver (Sr. DOM)
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode('DEPT')}
              className={`py-3 text-center transition cursor-pointer ${
                portalMode === 'DEPT'
                  ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🛠️ Dept Inputs
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode('COA')}
              className={`py-3 text-center transition cursor-pointer ${
                portalMode === 'COA'
                  ? 'bg-purple-700 text-white border-b-2 border-purple-400'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              📊 COA Traffic Feed
            </button>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs rounded-lg">
                {errorMsg}
              </div>
            )}

            {portalMode === 'DEPT' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Requisitioning Subsystem
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => {
                    setSelectedDept(e.target.value);
                    if (e.target.value.includes('Civil')) setEmail('civil.bpl@railways.gov.in');
                    else if (e.target.value.includes('Traction')) setEmail('trd.bpl@railways.gov.in');
                    else setEmail('st.bpl@railways.gov.in');
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Civil Engineering (TMS Track Maintenance)</option>
                  <option>Traction Distribution (TDMS / 25kV OHE)</option>
                  <option>Signal & Telecom (SMMS Interlocking)</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Railway Email (@railways.gov.in)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Portal Security Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 text-white font-bold text-xs rounded-lg shadow-md transition cursor-pointer ${
                portalMode === 'APPROVER'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : portalMode === 'COA'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Sign In as {portalMode === 'APPROVER' ? 'Operating Sanction Authority' : portalMode === 'COA' ? 'COA Traffic Feeder' : 'Engineering Officer'} →
            </button>
          </form>
        </div>
      </div>

      <div className="bg-[#0b192c] text-slate-400 text-center py-2 text-[10px]">
        Centre for Railway Information Systems (CRIS) • Secure Railway Operations Network
      </div>
    </div>
  );
}