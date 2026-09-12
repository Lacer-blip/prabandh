import React from 'react';

export default function UserSessionCard({ user, onSignOut, onOpenNewRequest, onOpenTimetableSync, onOpenSanctions, lang = 'en' }) {
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
                  {lang === 'hi' ? 'आधिकारिक • सक्रिय' : 'OFFICIAL • ACTIVE'}
                </span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-0.5">{user.email}</div>

              {/* Metadata Chips */}
              <div className="flex flex-wrap gap-2 mt-2 text-[11px]">
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 font-medium">
                  {lang === 'hi' ? 'यूज़र आईडी: ' : 'User ID: '}<strong className="text-blue-600 dark:text-blue-400">{user.id}</strong>
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 font-medium">
                  {lang === 'hi' ? 'डिवीजन: ' : 'Division: '}<strong className="text-slate-900 dark:text-white">{user.division}</strong>
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 font-medium">
                  {lang === 'hi' ? 'जोन: ' : 'Zone: '}<strong className="text-slate-900 dark:text-white">{user.zone}</strong>
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 font-medium">
                  {lang === 'hi' ? 'भूमिका: ' : 'Role: '}<strong className="text-blue-700 dark:text-blue-400 font-semibold">{user.portalType}</strong>
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
                <span>{lang === 'hi' ? 'लंबित प्रतिबंधों की समीक्षा करें' : 'Review Pending Sanctions'}</span>
              </button>
            )}

            {/* 2. COA: Only Timetable/Goods Ingestion */}
            {isCOA && (
              <button
                onClick={onOpenTimetableSync}
                className="flex-1 sm:flex-none px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs rounded-lg shadow transition cursor-pointer flex items-center space-x-1"
              >
                <span>{lang === 'hi' ? 'समय सारणी / माल फ़ीड अपलोड करें' : 'Upload Timetable / Goods Feed'}</span>
              </button>
            )}

            {/* 3. FIELD DEPTS (TMS/TDMS/SMMS): Only New Block Request */}
            {isDept && (
              <button
                onClick={onOpenNewRequest}
                className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow transition cursor-pointer"
              >
                {lang === 'hi' ? '+ नया ब्लॉक अनुरोध' : '+ New Block Request'}
              </button>
            )}

            <button
              onClick={onSignOut}
              className="flex-1 sm:flex-none px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-semibold text-xs rounded-lg transition cursor-pointer"
            >
              {lang === 'hi' ? 'साइन आउट' : 'Sign Out'}
            </button>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
          <span>{lang === 'hi' ? 'सत्र टोकन: वैध (बियरर JWT)' : 'Session Token: Valid (Bearer JWT)'}</span>
          <span>
            {lang === 'hi' ? 'स्कोप: ' : 'Scope: '}
            {isApprover 
              ? (lang === 'hi' ? 'वैधानिक संचालन प्रतिबंध प्राधिकरण' : 'Statutory Operating Sanction Authority') 
              : isCOA 
              ? (lang === 'hi' ? 'ट्रैफिक इनजेशन गेट' : 'Traffic Ingestion Gate') 
              : (lang === 'hi' ? 'फील्ड इंजीनियरिंग लॉजिंग' : 'Field Engineering Lodging')}
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
              ? 'text-blue-400 bg-blue-950/80 border-blue-800' 
              : 'text-blue-400 bg-blue-950/80 border-blue-800'
          }`}>
            {isApprover 
              ? (lang === 'hi' ? 'ऑपरेटिंग प्रतिबंध प्राधिकरण (Sr. DOM / सेक्शन कंट्रोल)' : 'OPERATING SANCTION AUTHORITY (Sr. DOM / SECTION CONTROL)') 
              : isCOA 
              ? (lang === 'hi' ? 'COA डेटा इनजेशन गेट' : 'COA DATA INGESTION GATE') 
              : (lang === 'hi' ? 'फील्ड इंजीनियरिंग लॉजिंग गेट' : 'FIELD ENGINEERING LODGING GATE')}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">CRIS Railway Identity Enforcement</span>
        </div>
        <p className="text-xs text-slate-300">
          {isApprover && (lang === 'hi' 
            ? 'अधिकृत: AI अनुकूलन की समीक्षा करें, 1-क्लिक शैडो बंडलिंग निष्पादित करें, आधिकारिक सेक्शन कंट्रोलर प्राइवेट नंबर (PN) जारी करें, और कॉरिडोर पॉसेशन स्वीकृत करें।' 
            : 'Authorized: Review AI optimization, execute 1-click shadow bundling, issue official Section Controller Private Numbers (PN), and approve corridor possessions.')}
          {isCOA && (lang === 'hi' 
            ? 'अधिकृत: यात्री वर्किंग टाइम टेबल (WTT) शेड्यूल अपलोड करें, सेक्शन रनिंग टाइम परिभाषित करें, और अनुमानित माल/गुड्स ट्रेन स्लॉट रजिस्टर करें।' 
            : 'Authorized: Upload passenger Working Time Table (WTT) schedules, define section running times, and register projected freight/goods train slots.')}
          {isDept && (lang === 'hi' 
            ? 'अधिकृत: ट्रैक नवीनीकरण (TMS), 25kV OHE आइसोलेशन (TDMS), या सिग्नल इंटरलॉकिंग रखरखाव (SMMS) के लिए कॉरिडोर पॉसेशन डिमांड सबमिट करें।' 
            : 'Authorized: Submit corridor possession demands for track renewal (TMS), 25kV OHE isolation (TDMS), or signal interlocking maintenance (SMMS).')}
        </p>
      </div>
    </div>
  );
}