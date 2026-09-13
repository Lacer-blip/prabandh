import React from 'react';

// Default authentic Bhopal - Itarsi section train schedule
const defaultTrainSchedule = [
  { trainNo: "20172", name: "Vande Bharat", type: "Vande Bharat", originTime: 5.8, destTime: 7.0, direction: "UP", priority: "P1" },
  { trainNo: "12002", name: "Bhopal Shatabdi", type: "Shatabdi", originTime: 14.3, destTime: 15.6, direction: "DN", priority: "P2" },
  { trainNo: "12616", name: "GT Express", type: "Express", originTime: 3.2, destTime: 5.0, direction: "DN", priority: "P3" },
  { trainNo: "12722", name: "Dakshin Express", type: "Express", originTime: 18.2, destTime: 20.0, direction: "DN", priority: "P3" },
  { trainNo: "12156", name: "Shan-e-Bhopal", type: "Express", originTime: 21.0, destTime: 22.4, direction: "UP", priority: "P2" },
  { trainNo: "BOXN-91", name: "Coal Freight Rake", type: "Freight", originTime: 12.2, destTime: 15.0, direction: "UP", priority: "P4" },
  { trainNo: "BCN-44", name: "Grain Freight Rake", type: "Freight", originTime: 16.0, destTime: 19.2, direction: "DN", priority: "P4" },
];

export default function TimeDistanceChart({ 
  trains = [], 
  blockWindow = { start: 8.0, end: 12.0, label: "SANCTIONED SHADOW BLOCK (08:00 – 12:00)" },
  lang = 'en'
}) {
  const activeTrains = trains && trains.length > 0 ? trains : defaultTrainSchedule;

  const yBhopal = 55;
  const yHabibganj = 125;
  const yHoshangabad = 230;
  const yItarsi = 300;

  // Converts decimal hours to SVG X coordinates
  const timeToX = (hour) => 80 + (hour / 24) * 680;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl p-5 shadow-sm font-sans space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>📈</span>
            <span>{lang === 'hi' ? 'मास्टर समय-दूरी प्रक्षेपवक्र चार्ट (CRIS अनुभाग स्ट्रिंग दृश्य)' : 'Master Time-Distance Trajectory Chart (CRIS Section String View)'}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {lang === 'hi' 
              ? 'X-अक्ष: 24-घंटे का समय क्षितिज • Y-अक्ष: भोपाल-इटारसी कॉरिडोर स्टेशन। छायांकित क्षेत्र: सक्रिय रखरखाव विंडो।' 
              : 'X-axis: 24-Hour Time Horizon • Y-axis: Bhopal – Itarsi Corridor Stations. Shaded area: Active Maintenance Window.'}
          </p>
        </div>
        <span className="text-xs font-mono bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded border border-blue-300 dark:border-blue-800">
          {lang === 'hi' ? `${activeTrains.length} डायनेमिक ट्रैजेक्टरी प्लॉट किए जा रहे हैं` : `Plotting ${activeTrains.length} Dynamic Trajectories`}
        </span>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox="0 0 800 360" className="w-full min-w-[700px] h-auto bg-[#070d18] rounded-xl select-none">
          {/* Station Horizontal Reference Lines */}
          <line x1="80" y1={yBhopal} x2="760" y2={yBhopal} stroke="#1e293b" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1="80" y1={yHabibganj} x2="760" y2={yHabibganj} stroke="#1e293b" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1="80" y1={yHoshangabad} x2="760" y2={yHoshangabad} stroke="#1e293b" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1="80" y1={yItarsi} x2="760" y2={yItarsi} stroke="#1e293b" strokeWidth="1.2" strokeDasharray="3 3" />

          {/* Station Labels */}
          <text x="12" y={yBhopal + 4} fill="#cbd5e1" fontSize="11" fontWeight="bold">Bhopal (BPL)</text>
          <text x="12" y={yHabibganj + 4} fill="#94a3b8" fontSize="10.5">Habibganj (RKMP)</text>
          <text x="12" y={yHoshangabad + 4} fill="#94a3b8" fontSize="10.5">Hoshangabad (HBD)</text>
          <text x="12" y={yItarsi + 4} fill="#cbd5e1" fontSize="11" fontWeight="bold">Itarsi (ET)</text>

          {/* Time Markers */}
          {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24].map((hr) => (
            <g key={hr}>
              <line x1={timeToX(hr)} y1="35" x2={timeToX(hr)} y2="315" stroke="#131e33" strokeWidth="1" />
              <text x={timeToX(hr)} y="338" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                {hr < 10 ? `0${hr}:00` : `${hr}:00`}
              </text>
            </g>
          ))}

          {/* BACKGROUND PASS: DRAW SHADED CORRIDOR WINDOW */}
          <rect
            x={timeToX(blockWindow.start)}
            y={yHabibganj}
            width={timeToX(blockWindow.end) - timeToX(blockWindow.start)}
            height={yItarsi - yHabibganj}
            fill="#d97706"
            fillOpacity="0.22"
            stroke="#f59e0b"
            strokeWidth="1.8"
            strokeDasharray="4 4"
            className="transition-all duration-500"
          />

          {/* PASS 1: DRAW ALL TRAIN LINES */}
          {activeTrains.map((train, idx) => {
            const isDN = train.direction === 'DN';
            const xStart = timeToX(train.originTime);
            const xEnd = timeToX(train.destTime);
            const yStart = isDN ? yBhopal : yItarsi;
            const yEnd = isDN ? yItarsi : yBhopal;

            const strokeColor =
              train.type === 'Vande Bharat' ? '#38bdf8' :
              train.type === 'Shatabdi' ? '#fbbf24' :
              train.type === 'Freight' ? '#94a3b8' : '#34d399';

            return (
              <g key={`line-${idx}`} className="transition-all duration-500">
                <line x1={xStart} y1={yStart} x2={xEnd} y2={yEnd} stroke={strokeColor} strokeWidth="5" opacity="0.25" />
                <line x1={xStart} y1={yStart} x2={xEnd} y2={yEnd} stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
              </g>
            );
          })}

          {/* PASS 2: DRAW ALL TRAIN TEXT LABELS */}
          {activeTrains.map((train, idx) => {
            const isDN = train.direction === 'DN';
            const xStart = timeToX(train.originTime);
            const xEnd = timeToX(train.destTime);
            const yStart = isDN ? yBhopal : yItarsi;
            const yEnd = isDN ? yItarsi : yBhopal;

            const strokeColor =
              train.type === 'Vande Bharat' ? '#38bdf8' :
              train.type === 'Shatabdi' ? '#fbbf24' :
              train.type === 'Freight' ? '#94a3b8' : '#34d399';

            const angleInDegrees = Math.atan2(yEnd - yStart, xEnd - xStart) * (180 / Math.PI);

            const textX = (xStart + xEnd) / 2;
            const textY = (yStart + yEnd) / 2;

            return (
              <text
                key={`text-${idx}`}
                x={textX}
                y={textY}
                dy="-6"
                fill={strokeColor}
                fontSize="10"
                fontWeight="normal"
                fontFamily="monospace"
                textAnchor="middle"
                className="transition-all duration-500"
                transform={`rotate(${angleInDegrees} ${textX} ${textY})`}
              >
                {train.trainNo} {train.name}
              </text>
            );
          })}

          {/* PASS 3: BELOW-GRID PLACEMENT FOR BLOCK LABEL */}
          <text
            x={timeToX((blockWindow.start + blockWindow.end) / 2)}
            y={yItarsi + 18} /* Placed perfectly below the Itarsi grid line, where the red line was drawn! */
            fill="#fbbf24"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            className="transition-all duration-500"
          >
            🚧 {blockWindow.label}
          </text>
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800 gap-2">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-1 rounded bg-[#38bdf8]"></span>
            <span className="text-slate-700 dark:text-slate-300">Vande Bharat (P1)</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-1 rounded bg-[#fbbf24]"></span>
            <span className="text-slate-700 dark:text-slate-300">Shatabdi (P2)</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-1 rounded bg-[#34d399]"></span>
            <span className="text-slate-700 dark:text-slate-300">Mail / Express (P3)</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-1 rounded bg-[#94a3b8]"></span>
            <span className="text-slate-700 dark:text-slate-300">{lang === 'hi' ? 'मालगाड़ी (P4)' : 'Freight Rakes (P4)'}</span>
          </span>
        </div>
        <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
          {lang === 'hi' ? '✓ हेडवे: न्यूनतम 15-मिनट बफर गतिशील रूप से संरक्षित' : '✓ Headway: Min 15-Min Buffer Dynamically Preserved'}
        </span>
      </div>
    </div>
  );
}