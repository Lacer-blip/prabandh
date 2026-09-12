import React from 'react';

export default function Dashboard({ stats = {}, conflicts = [], onExecuteShadowMerge, lang = 'en' }) {
  return (
    <div className="space-y-6 font-sans">
      {/* Header Section with High Contrast Colors */}
      <div className="border-b border-slate-300 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {lang === 'hi' ? 'मंडलीय ऑपरेशंस कमांड हब' : 'Divisional Operations Command Hub'}
        </h1>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
          {lang === 'hi' 
            ? 'पश्चिम मध्य रेलवे • वास्तविक समय कॉरिडोर अधिकार और संपत्ति स्लॉटिंग' 
            : 'West Central Railway • Real-time Corridor Possession & Asset Slotting'}
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[#0b1324] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {lang === 'hi' ? 'आज के सक्रिय ब्लॉक' : 'Active Blocks Today'}
          </div>
          <div className="text-2xl font-black text-blue-400 mt-1 font-mono">
            {stats.active_blocks_today ?? 2}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {lang === 'hi' ? 'भोपाल - इटारसी कॉरिडोर' : 'Bhopal – Itarsi Corridor'}
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#0b1324] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {lang === 'hi' ? 'लंबित प्रतिबंध' : 'Pending Sanctions'}
          </div>
          <div className="text-2xl font-black text-amber-400 mt-1 font-mono">
            {stats.pending_approvals ?? 1}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {lang === 'hi' ? 'ऑपरेटिंग अनुमोदन की प्रतीक्षा है' : 'Awaiting Operating Approval'}
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#0b1324] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {lang === 'hi' ? 'AI बंडल किए गए शैडो स्लॉट' : 'AI Bundled Shadow Slots'}
          </div>
          <div className="text-2xl font-black text-rose-400 mt-1 font-mono">
            {stats.ai_optimized_slots ?? 3}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {lang === 'hi' ? '2.5 घंटे लाइन डाउनटाइम बचाया गया' : '2.5 hrs Line Downtime Saved'}
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#0b1324] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {lang === 'hi' ? 'कॉरिडोर दक्षता रेटिंग' : 'Corridor Efficiency Rating'}
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
            {stats.line_efficiency_rating ?? "98.4%"}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {lang === 'hi' ? 'सुरक्षा हेडवे अनुपालन' : 'Safety Headway Compliant'}
          </div>
        </div>
      </div>

      {/* Conflicts & Optimization Alerts */}
      {conflicts && conflicts.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span>
                {lang === 'hi' 
                  ? `सक्रिय कॉरिडोर टकराव (${conflicts.length})` 
                  : `Active Corridor Conflicts (${conflicts.length})`}
              </span>
            </h2>
            <span className="text-xs font-mono text-slate-500">
              {lang === 'hi' ? 'स्थानिक और लौकिक टक्कर मॉनिटर' : 'Spatial & Temporal Collision Monitor'}
            </span>
          </div>

          {conflicts.map((c) => (
            <div
              key={c.conflict_id}
              className="bg-[#0b1324] border-l-4 border-rose-500 border border-slate-800 rounded-xl p-5 shadow-md space-y-4 text-white"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-rose-950/80 border border-rose-800 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded">
                      {lang === 'hi' ? 'ओवरलैप क्लैश' : 'OVERLAP CLASH'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100">
                      {lang === 'hi' ? 'कॉरिडोर ओवरलैप का पता चला:' : 'Corridor Overlap Detected:'} {c.block_a} & {c.block_b}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {c.section} ({c.track}) • {lang === 'hi' ? 'प्रतिस्पर्धी विंडो:' : 'Competing window:'} {c.overlap_window}
                  </p>
                </div>

                <button
                  onClick={() => onExecuteShadowMerge(c.conflict_id)}
                  className="px-4 py-2 bg-transparent border border-blue-500 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 font-bold text-xs rounded-lg transition cursor-pointer"
                >
                  <span>{lang === 'hi' ? '1-क्लिक शैडो बंडलिंग निष्पादित करें' : 'Execute 1-Click Shadow Bundling'}</span>
                </button>
              </div>

              <div className="bg-black/40 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-300 flex items-start space-x-3">
                <span className="text-emerald-400">🤖</span>
                <div>
                  <strong className="text-emerald-400">
                    {lang === 'hi' ? 'AI सॉल्वर अनुशंसा:' : 'AI Solver Recommendation:'}
                  </strong> {c.ai_recommendation}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#0b1324] border border-slate-800 rounded-xl p-6 text-center text-white space-y-2">
          <div className="text-3xl">✅</div>
          <h3 className="text-sm font-bold text-emerald-400">
            {lang === 'hi' ? 'सभी कॉरिडोर मांगें सिंक्रनाइज़ हैं' : 'All Corridor Demands Synchronized'}
          </h3>
          <p className="text-xs text-slate-400">
            {lang === 'hi' 
              ? 'भोपाल डिवीजन पर कोई सक्रिय स्थानिक या लौकिक संघर्ष नहीं है। सभी वर्तमान रखरखाव विंडो सुरक्षित रूप से बंडल की गई हैं।' 
              : 'No active spatial or temporal clashes on Bhopal Division. All current maintenance windows are safely bundled.'}
          </p>
        </div>
      )}
    </div>
  );
}