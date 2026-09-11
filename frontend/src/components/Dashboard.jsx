import React from 'react';

export default function Dashboard({ stats = {}, conflicts = [], onExecuteShadowMerge }) {
  return (
    <div className="space-y-6 font-sans">
      {/* Header Section with High Contrast Colors */}
      <div className="border-b border-slate-300 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Divisional Operations Command Hub
        </h1>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
          West Central Railway • Real-time Corridor Possession & Asset Slotting
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[#0b1324] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Active Blocks Today
          </div>
          <div className="text-2xl font-black text-blue-400 mt-1 font-mono">
            {stats.active_blocks_today ?? 2}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Bhopal – Itarsi Corridor</div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#0b1324] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Pending Sanctions
          </div>
          <div className="text-2xl font-black text-amber-400 mt-1 font-mono">
            {stats.pending_approvals ?? 1}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Awaiting Operating Approval</div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#0b1324] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            AI Bundled Shadow Slots
          </div>
          <div className="text-2xl font-black text-purple-400 mt-1 font-mono">
            {stats.ai_optimized_slots ?? 3}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">2.5 hrs Line Downtime Saved</div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#0b1324] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Corridor Efficiency Rating
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
            {stats.line_efficiency_rating ?? "98.4%"}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Safety Headway Compliant</div>
        </div>
      </div>

      {/* Conflicts & Optimization Alerts */}
      {conflicts && conflicts.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span>Active Corridor Conflicts ({conflicts.length})</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">Spatial & Temporal Collision Monitor</span>
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
                      OVERLAP CLASH
                    </span>
                    <h3 className="text-sm font-bold text-slate-100">
                      Corridor Overlap Detected: {c.block_a} & {c.block_b}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {c.section} ({c.track}) • Competing window: {c.overlap_window}
                  </p>
                </div>

                <button
                  onClick={() => onExecuteShadowMerge(c.conflict_id)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg shadow-md transition cursor-pointer flex items-center space-x-1.5"
                >
                  <span>⚡</span>
                  <span>Execute 1-Click Shadow Bundling</span>
                </button>
              </div>

              <div className="bg-black/40 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-300 flex items-start space-x-3">
                <span className="text-purple-400 text-base">🤖</span>
                <div>
                  <strong className="text-purple-300">AI Solver Recommendation:</strong> {c.ai_recommendation}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#0b1324] border border-slate-800 rounded-xl p-6 text-center text-white space-y-2">
          <div className="text-3xl">✅</div>
          <h3 className="text-sm font-bold text-emerald-400">All Corridor Demands Synchronized</h3>
          <p className="text-xs text-slate-400">
            No active spatial or temporal clashes on Bhopal Division. All current maintenance windows are safely bundled.
          </p>
        </div>
      )}
    </div>
  );
}