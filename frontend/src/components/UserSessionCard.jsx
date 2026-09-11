import React from 'react';

export default function UserSessionCard({ user, onSignOut, onOpenNewRequest, onOpenTimetableSync, onOpenSanctions }) {
  const isApprover = user.portalType === 'APPROVER';
  const isCOA = user.portalType === 'COA';
  const isDept = user.portalType === 'DEPT';

  return (
    <div className="space-y-4 font-sans">
      {/* 1. Official Session ID Card */}
      <div className="bg-white dark:bg-slate-900 border-l-4 border-amber-500 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Avatar Circle */}
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-[#1b2a4a] text-white flex items-center justify-center font-bold text-sm tracking-wider border-2 border-slate-300 dark:border-slate-700 shadow">
                {user.initials || 'IR'}
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" title="Online Active"></span>
            </div>

            {/* User Credentials */}
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {user.name}
                </h2>
                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600/40 text-[10px] font-bold px-2 py-0.5 rounded">
                  OFFICIAL • ACTIVE
                </span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-0.5">{user.email}</div>

              {/* Metadata Chips */}
              <div className="flex flex-wrap gap-2 mt-2 text-[11px]">
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 font-medium">
                  User ID: <strong className="text-blue-600 dark:text-blue-400">{user.id}</strong>
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 font-medium">
                  Division: <strong className="text-slate-900 dark:text-white">{user.division}</strong>
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 font-medium">
                  Zone: <strong className="text-slate-900 dark:text-white">{user.zone}</strong>
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 font-medium">
                  Role: <strong className="text-purple-600 dark:text-purple-400">{user.role}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Strict Role-Based Logic */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* 1. APPROVER (Sr. DOM): Only Review & Sanction */}
            {isApprover && (
              <button
                onClick={onOpenSanctions}
                className="flex-1 sm:flex-none px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow transition cursor-pointer flex items-center space-x-1"
              >
                <span>🛡️</span>
                <span>Review Pending Sanctions</span>
              </button>
            )}

            {/* 2. COA: Only Timetable/Goods Ingestion */}
            {isCOA && (
              <button
                onClick={onOpenTimetableSync}
                className="flex-1 sm:flex-none px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg shadow transition cursor-pointer flex items-center space-x-1"
              >
                <span>📊</span>
                <span>Upload Timetable / Goods Feed</span>
              </button>
            )}

            {/* 3. FIELD DEPTS (TMS/TDMS/SMMS): Only New Block Request */}
            {isDept && (
              <button
                onClick={onOpenNewRequest}
                className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow transition cursor-pointer"
              >
                + New Block Request
              </button>
            )}

            <button
              onClick={onSignOut}
              className="flex-1 sm:flex-none px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-semibold text-xs rounded-lg transition cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
          <span>Session Token: Valid (Bearer JWT)</span>
          <span>
            Scope: {isApprover ? 'Statutory Operating Sanction Authority' : isCOA ? 'Traffic Ingestion Gate' : 'Field Engineering Lodging'}
          </span>
        </div>
      </div>

      {/* 2. Authority Banner */}
      <div className="bg-[#0e1726] border border-slate-800 rounded-xl p-4 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
            isApprover 
              ? 'text-emerald-400 bg-emerald-950/80 border-emerald-800' 
              : isCOA 
              ? 'text-purple-400 bg-purple-950/80 border-purple-800' 
              : 'text-blue-400 bg-blue-950/80 border-blue-800'
          }`}>
            {isApprover ? 'OPERATING SANCTION AUTHORITY (Sr. DOM / SECTION CONTROL)' : isCOA ? 'COA DATA INGESTION GATE' : 'FIELD ENGINEERING LODGING GATE'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">CRIS Railway Identity Enforcement</span>
        </div>
        <p className="text-xs text-slate-300">
          {isApprover && 'Authorized: Review AI optimization, execute 1-click shadow bundling, issue official Section Controller Private Numbers (PN), and approve corridor possessions.'}
          {isCOA && 'Authorized: Upload passenger Working Time Table (WTT) schedules, define section running times, and register projected freight/goods train slots.'}
          {isDept && 'Authorized: Submit corridor possession demands for track renewal (TMS), 25kV OHE isolation (TDMS), or signal interlocking maintenance (SMMS).'}
        </p>
      </div>
    </div>
  );
}