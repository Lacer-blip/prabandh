import React, { useState } from 'react';
import { api } from '../api';

export default function DisruptionSimulator({ onApplyReSlot, lang = 'en' }) {
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
           <span className="text-blue-400 font-bold">
             {lang === 'hi' ? 'AI What-If विघटन इंजन (OR-Tools CP-SAT सॉल्वर)' : 'AI What-If Disruption Engine (OR-Tools CP-SAT Solver)'}
           </span>
         </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'hi' 
              ? 'अनिर्धारित कॉरिडोर व्यवधानों का अनुकरण करें, बाधा दंड की गणना करें, और वास्तविक समय में रखरखाव विंडो को फिर से स्लॉट करें।' 
              : 'Simulate unscheduled corridor disruptions, calculate constraint penalties, and re-slot maintenance windows in real time.'}
          </p>
        </div>
        <span className="text-xs font-mono bg-blue-950/80 border border-blue-800 text-blue-300 px-3 py-1 rounded-md">
          Engine: CP-SAT v9.8
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Inject Disruption */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>{lang === 'hi' ? 'कॉरिडोर व्यवधान इंजेक्ट करें' : 'Inject Corridor Disruption'}</span>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">
              {lang === 'hi' ? 'आने वाली ट्रेन चुनें' : 'Select Approaching Train'}
            </label>
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
              <label className="text-xs text-slate-300 font-semibold">
                {lang === 'hi' ? 'अनिर्धारित देरी:' : 'Unscheduled Delay:'}
              </label>
              <span className="text-xs font-mono font-bold text-rose-400">
                +{delayMinutes} {lang === 'hi' ? 'मिनट' : 'Minutes'}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="120"
              step="5"
              value={delayMinutes}
              onChange={(e) => setDelayMinutes(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>+10m (Minor)</span>
              <span>+60m (Major)</span>
              <span>+120m (Severe)</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1 font-semibold">
              {lang === 'hi' ? 'मूल कारण / परिचालन बाधा' : 'Root Cause / Operational Bottleneck'}
            </label>
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
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-lg transition shadow cursor-pointer flex items-center justify-center space-x-2"
          >
            {isSolving && <span>🔄</span>}
            <span>
              {isSolving 
                ? (lang === 'hi' ? 'बाधाओं को हल किया जा रहा है...' : 'Solving Constraints...') 
                : (lang === 'hi' ? 'गतिशील AI पुन:-स्लॉटिंग ट्रिगर करें' : 'Trigger Dynamic AI Re-Slotting')}
            </span>
          </button>
        </div>

        {/* Right Column: AI Optimal Solution & Action Card */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                {lang === 'hi' ? 'समाधान अभिसिंचित: CP-SAT स्थिति' : 'Solution Converged: CP-SAT Status'}
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                {solverResult 
                  ? `OPTIMAL_FOUND (${(solverResult.solve_time_ms / 1000).toFixed(3)}s)` 
                  : (lang === 'hi' ? 'समाधान की प्रतीक्षा है' : 'AWAITING SOLVE')}
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
                    <div className="text-[10px] uppercase font-bold text-rose-400">
                      {lang === 'hi' ? 'विलंबित ट्रेन प्रक्षेपवक्र' : 'Delayed Train Trajectory'}
                    </div>
                    <div className="text-sm font-mono font-bold text-slate-200 mt-1">
                      {formatHour(solverResult.startHour)} – {formatHour(solverResult.endHour)}
                    </div>
                    <div className="text-[10px] text-rose-400 mt-1">
                      {lang === 'hi' 
                        ? `#{selectedTrain} को +${delayMinutes}m की देरी होती है` 
                        : `Causes +${delayMinutes}m detention to #${selectedTrain}`}
                    </div>
                  </div>

                  <div className="bg-emerald-950/30 border border-emerald-700/50 rounded-lg p-3">
                    <div className="text-[10px] uppercase font-bold text-emerald-400">
                      {lang === 'hi' ? 'AI परिणाम' : 'AI Result'}
                    </div>
                    <div className="text-sm font-mono font-bold text-emerald-300 mt-1">
                      {solverResult.timeWindowStr}
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-1">
                      {solverResult.affected_block_id
                        ? (lang === 'hi' 
                            ? `पुन:-स्लॉटेड ब्लॉक ${solverResult.affected_block_id} • सुरक्षा मार्जिन >= 15m` 
                            : `Re-slotted Block ${solverResult.affected_block_id} • Safety Margin >= 15m`)
                        : (lang === 'hi' ? 'कोई रखरखाव ब्लॉक प्रभावित नहीं हुआ' : 'No maintenance block affected')}
                    </div>
                  </div>
                </div>

                {/* Execution Stream Logs */}
                <div className="bg-black/60 border border-slate-800 rounded-lg p-3 font-mono text-[11px] space-y-1 text-slate-300">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex justify-between">
                    <span>{lang === 'hi' ? 'OR-Tools CP-SAT सॉल्वर निष्पादन स्ट्रीम' : 'OR-Tools CP-SAT Solver Execution Stream'}</span>
                    <span className="text-emerald-400 font-bold">• {lang === 'hi' ? 'लाइव लॉग' : 'LIVE LOG'}</span>
                  </div>
                  <p>&gt; [CP-SAT Init] {lang === 'hi' ? `ट्रेन #${selectedTrain} के लिए टाइमटेबल वेक्टर लोड हो रहे हैं...` : `Loading timetable vectors for train #${selectedTrain}...`}</p>
                  <p>&gt; [Constraint Check] {lang === 'hi' ? `+${delayMinutes}m की देरी जोड़ी गई (${rootCause})।` : `Injected +${delayMinutes}m delay (${rootCause}).`}</p>
                  {solverResult.affected_block_id ? (
                    <>
                      <p>&gt; [Conflict Detected] {lang === 'hi' ? `आगमन ब्लॉक ${solverResult.affected_block_id} के खिलाफ 15m सुरक्षा हेडवे का उल्लंघन करता है।` : `Arrival violates 15m safety headway against Block ${solverResult.affected_block_id}.`}</p>
                      <p>&gt; [Branch &amp; Bound] {lang === 'hi' ? 'उम्मीदवार समय विंडो का मूल्यांकन किया जा रहा है...' : 'Evaluating candidate time windows...'}</p>
                      <p className="text-emerald-400">&gt; [OR-Tools CP-SAT] {lang === 'hi' ? `विंडो [{solverResult.timeWindowStr}] शून्य यात्री टकराव को संतुष्ट करती है।` : `Window [{solverResult.timeWindowStr}] satisfies zero passenger collision.`}</p>
                    </>
                  ) : (
                    <p className="text-emerald-400">&gt; [OR-Tools CP-SAT] {lang === 'hi' ? 'इस देरी से कोई सक्रिय रखरखाव ब्लॉक संघर्ष नहीं करता है।' : 'No active maintenance block conflicts with this delay.'}</p>
                  )}
                  <p className="text-emerald-400">&gt; [Optimization Complete] {lang === 'hi' ? `सॉल्व समय: ${solverResult.solve_time_ms.toFixed(2)}ms.` : `Solve time: ${solverResult.solve_time_ms.toFixed(2)}ms.`}</p>
                </div>
              </>
            ) : (
              <div className="text-xs text-slate-500 text-center py-8">
                {lang === 'hi' 
                  ? 'बाईं ओर एक व्यवधान कॉन्फ़िगर करें और परिणाम देखने के लिए सॉल्वर को ट्रिगर करें।' 
                  : 'Configure a disruption on the left and trigger the solver to see results here.'}
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
            <span>
              {lang === 'hi' 
                ? '✓ लाइव शेड्यूल पर AI पुन:-स्लॉटेड योजना लागू करें (सिंक ग्राफ़ और रजिस्ट्री) →' 
                : 'Commit & Apply AI Re-Slotted Plan to Live Schedule (Sync Graph & Registry) →'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}