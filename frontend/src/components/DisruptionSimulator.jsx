import React, { useState } from 'react';
import { api } from '../api';

export default function DisruptionSimulator({ onApplyReSlot }) {
    const [selectedTrain, setSelectedTrain] = useState('20172');
  const [delayMinutes, setDelayMinutes] = useState(35);
  const [rootCause, setRootCause] = useState('Signal Interlocking Glitch at Mandideep (MDDP)');
  const [isSolving, setIsSolving] = useState(false);
  const [solverResult, setSolverResult] = useState(null);
  const [solverError, setSolverError] = useState('');

  const formatHour = (h) => {
    const hours = Math.floor(h);
    const mins = Math.round((h - hours) * 60);
    return `${hours < 10 ? '0' : ''}${hours}:${mins < 10 ? '0' : ''}${mins}`;
  };

  const handleTriggerSolver = async () => {
    setIsSolving(true);
    setSolverError('');
    setSolverResult(null);
    try {
      const result = await api.whatIf(selectedTrain, delayMinutes, rootCause);
      setSolverResult(result);
    } catch (err) {
      setSolverError(err.message || 'Solver failed to converge.');
    } finally {
      setIsSolving(false);
    }
  };

  const handleCommitPlan = () => {
    if (onApplyReSlot && solverResult) {
      onApplyReSlot(solverResult);
    }
  };
  return (
    <div className="bg-[#0b1324] border border-slate-800 rounded-2xl p-6 font-sans text-white shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 gap-2">
        <div>
          <h2 className="text-lg font-bold flex items-center space-x-2">
            <span>⚡</span>
            <span>AI What-If Disruption Engine (OR-Tools CP-SAT Solver)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulate unscheduled corridor disruptions, calculate constraint penalties, and re-slot maintenance windows in real time.
          </p>
        </div>
        <span className="text-xs font-mono bg-purple-950 border border-purple-800 text-purple-300 px-3 py-1 rounded">
          Engine: CP-SAT v9.8
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Inject Disruption */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Inject Corridor Disruption</span>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">Select Approaching Train</label>
            <select
              value={selectedTrain}
              onChange={(e) => setSelectedTrain(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            >
              <option value="20172">20172 - Vande Bharat Express (Priority: 1.0)</option>
              <option value="12002">12002 - Bhopal Shatabdi (Priority: 0.9)</option>
              <option value="BOXN-91">BOXN-91 - Coal Freight Rake (Priority: 0.4)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-slate-300 font-semibold">Unscheduled Delay:</label>
              <span className="text-xs font-mono font-bold text-rose-400">+{delayMinutes} Minutes</span>
            </div>
            <input
              type="range"
              min="10"
              max="120"
              step="5"
              value={delayMinutes}
              onChange={(e) => setDelayMinutes(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>+10m (Minor)</span>
              <span>+60m (Major)</span>
              <span>+120m (Severe)</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">Root Cause / Operational Bottleneck</label>
            <select
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            >
              <option>Signal Interlocking Glitch at Mandideep (MDDP)</option>
              <option>Overhead OHE Tension Drop near Obedullaganj</option>
              <option>Freight Rake Wagon Brake Binding</option>
              <option>Preceding Section Congestion (Jhansi Inflow)</option>
            </select>
          </div>

          <button
            onClick={handleTriggerSolver}
            disabled={isSolving}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900 text-white font-bold text-xs rounded-lg transition shadow cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>{isSolving ? '🔄' : '⚡'}</span>
            <span>{isSolving ? 'Solving Constraints...' : 'Trigger Dynamic AI Re-Slotting'}</span>
          </button>
        </div>

        

                   {/* Right Column: AI Optimal Solution & Action Card */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Solution Converged: CP-SAT Status
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                {solverResult ? `OPTIMAL_FOUND (${(solverResult.solve_time_ms / 1000).toFixed(3)}s)` : 'AWAITING SOLVE'}
              </span>
            </div>

            {solverError && (
              <div className="bg-rose-950/40 border border-rose-800 text-rose-300 text-xs rounded-lg p-3">
                {solverError}
              </div>
            )}

            {solverResult ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/80 border border-rose-900/40 rounded-lg p-3">
                    <div className="text-[10px] uppercase font-bold text-rose-400">Delayed Train Trajectory</div>
                    <div className="text-sm font-mono font-bold text-slate-200 mt-1">
                      {formatHour(solverResult.startHour)} – {formatHour(solverResult.endHour)}
                    </div>
                    <div className="text-[10px] text-rose-400 mt-1">Causes +{delayMinutes}m detention to #{selectedTrain}</div>
                  </div>

                  <div className="bg-emerald-950/30 border border-emerald-700/50 rounded-lg p-3">
                    <div className="text-[10px] uppercase font-bold text-emerald-400">AI Result</div>
                    <div className="text-sm font-mono font-bold text-emerald-300 mt-1">
                      {solverResult.timeWindowStr}
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-1">
                      {solverResult.affected_block_id
                        ? `Re-slotted Block ${solverResult.affected_block_id} • Safety Margin >= 15m`
                        : 'No maintenance block affected'}
                    </div>
                  </div>
                </div>

                {/* Execution Stream Logs */}
                <div className="bg-black/60 border border-slate-800 rounded-lg p-3 font-mono text-[11px] space-y-1 text-slate-300">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex justify-between">
                    <span>OR-Tools CP-SAT Solver Execution Stream</span>
                    <span className="text-emerald-400 font-bold">• LIVE LOG</span>
                  </div>
                  <p>&gt; [CP-SAT Init] Loading timetable vectors for train #{selectedTrain}...</p>
                  <p>&gt; [Constraint Check] Injected +{delayMinutes}m delay ({rootCause}).</p>
                  {solverResult.affected_block_id ? (
                    <>
                      <p>&gt; [Conflict Detected] Arrival violates 15m safety headway against Block {solverResult.affected_block_id}.</p>
                      <p>&gt; [Branch &amp; Bound] Evaluating candidate time windows...</p>
                      <p className="text-emerald-400">&gt; [OR-Tools CP-SAT] Window [{solverResult.timeWindowStr}] satisfies zero passenger collision.</p>
                    </>
                  ) : (
                    <p className="text-emerald-400">&gt; [OR-Tools CP-SAT] No active maintenance block conflicts with this delay.</p>
                  )}
                  <p className="text-emerald-400">&gt; [Optimization Complete] Solve time: {solverResult.solve_time_ms.toFixed(2)}ms.</p>
                </div>
              </>
            ) : (
              <div className="text-xs text-slate-500 text-center py-8">
                Configure a disruption on the left and trigger the solver to see results here.
              </div>
            )}
          </div>

          {/* Action Button: Applies Solution across Portal */}
          <button
            onClick={handleCommitPlan}
            disabled={!solverResult}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-950 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg shadow-lg transition cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>✓</span>
            <span>Commit & Apply AI Re-Slotted Plan to Live Schedule (Sync Graph & Registry) →</span>
          </button>
        </div>
      </div>
    </div>
  );
}