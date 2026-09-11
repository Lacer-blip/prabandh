import React from 'react';

export default function GovHeader({ theme, onToggleTheme, textSize, onChangeTextSize }) {
  return (
    <header className="w-full border-b border-slate-300 dark:border-slate-800 font-sans select-none">
      {/* Continuous Marquee Animation */}
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .railway-ticker-track {
          display: inline-flex;
          white-space: nowrap;
          animation: marqueeScroll 28s linear infinite;
        }
        .railway-ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* 1. Top Government Utility Strip */}
      <div className="bg-[#0b192c] text-slate-200 text-[11px] px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between border-b border-blue-900/40">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-white tracking-wide">🇮🇳 Government of India</span>
          <span className="text-slate-500">•</span>
          <span>Ministry of Railways</span>
          <span className="bg-blue-600/40 text-blue-200 px-2 py-0.5 rounded text-[10px] font-mono border border-blue-500/30">
            IR-AIS v2.4
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline-flex items-center text-[10px] bg-emerald-900/50 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
            Live SQLite API Mode
          </span>

          {/* Text Size Accessibility */}
          <div className="flex items-center space-x-1 text-[11px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            <span className="text-slate-400 mr-1 text-[10px]">Text Size:</span>
            <button onClick={() => onChangeTextSize('sm')} className={`px-1 rounded hover:text-white ${textSize === 'sm' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}>A-</button>
            <button onClick={() => onChangeTextSize('base')} className={`px-1 rounded hover:text-white ${textSize === 'base' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}>A</button>
            <button onClick={() => onChangeTextSize('lg')} className={`px-1 rounded hover:text-white ${textSize === 'lg' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}>A+</button>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={onToggleTheme}
            className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-0.5 rounded border border-slate-700 text-white text-[11px] transition cursor-pointer"
          >
            {theme === 'dark' ? <span>☀️ Light Mode</span> : <span>🌙 Dark Mode</span>}
          </button>
        </div>
      </div>

      {/* 2. Main Official Railway Branding Banner */}
      <div className="bg-white dark:bg-slate-900 px-4 sm:px-8 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: National Emblem from public/emblem.webp */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 flex items-center justify-center">
              <img
                src="/emblem.webp"
                alt="State Emblem of India"
                className="h-16 w-auto object-contain select-none drop-shadow-sm"
              />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#8b1e0f] dark:text-amber-500 tracking-wider">
                  INDIAN RAILWAYS
                </h1>
                <span className="bg-blue-700 text-white text-xs px-2 py-0.5 rounded font-mono font-bold tracking-tight">
                  IR-AIS v2.4
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                Block Request & AI Slotting Engine • भारतीय रेल ब्लॉक अनुरोध व कृत्रिम मेधा स्लॉटिंग प्रणाली
              </p>
            </div>
          </div>

          {/* Right: G20, 75 Azadi & Blue Railway Logo */}
          <div className="flex items-center space-x-5 sm:space-x-6 flex-shrink-0">
            {/* G20 Bharat */}
            <div className="flex flex-col items-center justify-center text-center select-none">
              <div className="flex items-center space-x-1">
                <span className="text-xl sm:text-2xl font-black text-[#f97316] tracking-tighter leading-none">G2</span>
                <div className="w-5 h-5 rounded-full bg-gradient-to-b from-[#0284c7] via-[#38bdf8] to-[#ea580c] flex items-center justify-center shadow-inner">
                  <span className="text-[9px] text-white font-bold">🌐</span>
                </div>
              </div>
              <span className="text-[7px] font-extrabold tracking-wider text-slate-800 dark:text-slate-200 uppercase mt-0.5">
                भारत 2023 INDIA
              </span>
              <span className="text-[5px] text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                ONE EARTH • ONE FAMILY
              </span>
            </div>

            {/* 75 Azadi Ka Amrit Mahotsav */}
            <div className="flex flex-col items-center justify-center text-center select-none">
              <div className="relative leading-none">
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1.5 flex flex-col justify-between">
                  <div className="h-0.5 bg-[#ff9933] rounded-full"></div>
                  <div className="h-0.5 bg-white rounded-full"></div>
                  <div className="h-0.5 bg-[#138808] rounded-full"></div>
                </div>
                <span className="text-xl sm:text-2xl font-black text-slate-700 dark:text-slate-300 tracking-tight">75</span>
              </div>
              <span className="text-[8px] font-bold text-slate-800 dark:text-slate-200 leading-tight mt-0.5">
                आज़ादी का
              </span>
              <span className="text-[7px] text-[#0284c7] dark:text-blue-400 font-semibold leading-none">
                अमृत महोत्सव
              </span>
            </div>

            {/* Blue Railway Logo from public/railway-logo.webp */}
            <div className="flex items-center justify-center select-none">
              <img
                src="/railway-logo.webp"
                alt="Indian Railways Official Blue Seal"
                className="h-12 sm:h-14 w-auto object-contain select-none drop-shadow-sm hover:scale-105 transition-transform"
              />
            </div>
          </div>

        </div>
      </div>

      {/* 3. Live Animated Corridor Marquee / Ticker Bar */}
      <div className="bg-[#1b2a4a] text-white text-xs flex items-stretch overflow-hidden border-t border-b border-blue-900/60 shadow-inner h-9">
        <div className="bg-[#d97706] text-slate-950 font-bold px-3 py-2 flex items-center uppercase text-[11px] tracking-wider whitespace-nowrap z-10 shadow-md">
          CORRIDOR MONITOR
        </div>
        <div className="bg-slate-900 px-3 py-2 text-rose-400 font-bold text-[11px] whitespace-nowrap flex items-center border-r border-slate-700 z-10 shadow-md">
          conflict review.
        </div>

        <div className="flex-1 overflow-hidden relative flex items-center">
          <div className="railway-ticker-track items-center space-x-8 text-[11px] text-slate-200 cursor-pointer">
            <span>
              <strong className="text-amber-400">● Bhopal – Itarsi Section:</strong> Power Block Active (25kV OHE isolation verified).
            </span>
            <span className="text-slate-400">|</span>
            <span>
              <strong className="text-blue-400">⚡ AI Slotting Engine:</strong> 94.2% Corridor line efficiency index maintained.
            </span>
            <span className="text-slate-400">|</span>
            <span>
              <strong className="text-emerald-400">✓ Headway Margin:</strong> Minimum 15 mins safety buffer strictly enforced.
            </span>
            <span className="text-slate-400">|</span>
            <span>
              <strong className="text-amber-400">● Bina – Jhansi Section:</strong> Normal Operations (MPS 110 km/h).
            </span>
            <span className="text-slate-400">|</span>
            <span>
              <strong className="text-purple-400">⚙️ Shadow Block Engine:</strong> Auto-bundling 2 pending possessions on Down Main Line.
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
