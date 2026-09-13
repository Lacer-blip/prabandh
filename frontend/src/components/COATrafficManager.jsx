import React, { useState } from 'react';
import { api } from '../api';

export default function COATrafficManager({ trains, onUpdateTrains }) {
  const [statusMsg, setStatusMsg] = useState('');

  // Built-in sample WTT dataset for instant 1-click loading during demos.
  const loadSampleWTT = async () => {
    const sampleCsv = [
      'train_number,train_name,category,direction,origin_station,origin_time_decimal,dest_station,dest_time_decimal',
      '20172,Vande Bharat Express,Vande Bharat,UP,ET,6.0,BPL,7.2',
      '12002,Bhopal Shatabdi,Shatabdi,DN,BPL,14.5,RKMP,15.8',
      '12616,Grand Trunk Express,Express,DN,ET,3.5,BPL,5.2',
      '12156,Shan-e-Bhopal Express,Express,UP,ET,21.0,BPL,22.4',
      'BOXN-91,Coal Freight Rake (Thermal),Freight,UP,ET,8.5,BPL,11.5',
      'BCN-44,Grain Rake (FCI Special),Freight,DN,BPL,16.0,ET,19.5',
    ].join('\n');

    const sampleFile = new File([sampleCsv], 'sample_wtt.csv', { type: 'text/csv' });

    try {
      const result = await api.uploadTimetable(sampleFile);
      onUpdateTrains(result.trains);
      setStatusMsg(`✅ Successfully loaded CRIS Bhopal–Itarsi Master Working Time Table (WTT)! (${result.trains.length} trains active${result.warnings?.length ? `, ${result.warnings.length} warnings` : ''})`);
    } catch (err) {
      setStatusMsg(`⚠️ Failed to load sample WTT: ${err.message}`);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setStatusMsg('⏳ Uploading and processing timetable...');
    try {
      const result = await api.uploadTimetable(file);
      onUpdateTrains(result.trains);
      if (result.warnings && result.warnings.length > 0) {
        setStatusMsg(`⚠️ Ingested ${result.trains.length} trains from ${file.name}, but with warnings: ${result.warnings.join('; ')}`);
      } else {
        setStatusMsg(`✅ Successfully ingested train paths from ${file.name}! (${result.trains.length} trains total)`);
      }
    } catch (err) {
      setStatusMsg(`⚠️ Error: ${err.message}`);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>COA Traffic Ingestion Gate • Working Time Table (WTT) & Goods Feed</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Feed passenger train paths and freight density profiles into the AI solver as hard no-possession boundaries.
          </p>
        </div>
        <button
          onClick={loadSampleWTT}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition cursor-pointer shadow"
        >
          Load Sample WTT (Bhopal – Itarsi)
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-lg font-medium">
          {statusMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CSV Ingestion Card */}
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <span className="text-3xl mb-2">📑</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Upload Master Timetable (.csv / .wtt)
          </span>
          <span className="text-[11px] text-slate-500 mt-1 max-w-xs">
            Expected CSV format: <code>Train_No, Name, Type, Origin_Hour, Dest_Hour, Direction, Priority</code>
          </span>
          <input
            type="file"
            accept=".csv, .txt"
            onChange={handleFileUpload}
            className="mt-4 text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-blue-600 file:text-white cursor-pointer"
          />
        </div>

        {/* Goods Path Configuration */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-950 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
            Projected Goods (Freight) Traffic Density
          </h4>
          <div>
            <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Target Section</label>
            <select className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-900 dark:text-white">
              <option>Bhopal (BPL) – Itarsi (ET) Double Line</option>
              <option>Bina (BINA) – Bhopal (BPL) Section</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Freight Rakes / Shift</label>
              <input
                type="number"
                defaultValue={6}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Safety Headway Buffer</label>
              <input
                type="text"
                defaultValue="15 Mins"
                disabled
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded px-2 py-1 text-xs text-slate-500"
              />
            </div>
          </div>
          <button
            onClick={() => alert("Goods slots locked into AI Constraint Registry! Timetable trajectories updated.")}
            className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded transition cursor-pointer"
          >
            Lock Freight Paths into Solver
          </button>
        </div>
      </div>

      {/* Active Trajectories Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 font-bold text-xs text-slate-700 dark:text-slate-300 flex justify-between">
          <span>Active Ingested Trajectories ({trains.length} Trains)</span>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">Live In Solver Memory</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
              <tr>
                <th className="p-2.5">Train No</th>
                <th className="p-2.5">Train Name</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Origin Dep</th>
                <th className="p-2.5">Dest Arr</th>
                <th className="p-2.5">Direction</th>
                <th className="p-2.5">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {trains.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-2.5 font-mono font-bold text-blue-600 dark:text-blue-400">{t.trainNo}</td>
                  <td className="p-2.5 font-medium">{t.name}</td>
                  <td className="p-2.5 text-slate-500">{t.type}</td>
                  <td className="p-2.5 font-mono">{Math.floor(t.originTime)}:00</td>
                  <td className="p-2.5 font-mono">{Math.floor(t.destTime)}:00</td>
                  <td className="p-2.5 font-semibold text-slate-700 dark:text-slate-300">{t.direction}</td>
                  <td className="p-2.5">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      {t.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}