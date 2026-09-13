import React, { useState, useEffect } from 'react';

// Live Clock Widget Component
function LiveClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = time.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace(/ /g, '-');

  const formattedTime = time.toTimeString().split(' ')[0];

  return (
    <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300">
      <span className="text-amber-400">{formattedDate}</span>
      <span className="text-white">[{formattedTime}]</span>
    </div>
  );
}

export default function GovHeader({ theme, onToggleTheme, textSize, onChangeTextSize, lang, onToggleLang }) {
  return (
    <header className="w-full border-b border-slate-300 dark:border-slate-800 font-sans select-none">
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .railway-ticker-track {
          display: inline-flex;
          white-space: nowrap;
          /* Changed from 28s to 40s to accommodate the 4 items */
          animation: marqueeScroll 40s linear infinite; 
        }
        .railway-ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* 1. Top Government Utility Strip (3-Column Layout) */}
      <div className="bg-[#0b192c] text-slate-200 text-[11px] px-4 sm:px-8 py-1.5 grid grid-cols-1 md:grid-cols-3 items-center border-b border-blue-900/40">
        
        {/* Left: Gov Info */}
        <div className="flex items-center space-x-2 justify-start">
          <span className="font-bold text-white tracking-wide">
            {lang === 'hi' ? '🇮🇳 भारत सरकार' : '🇮🇳 Government of India'}
          </span>
          <span className="text-slate-500">•</span>
          <span>{lang === 'hi' ? 'रेल मंत्रालय' : 'Ministry of Railways'}</span>
        </div>

        {/* Middle: PRABANDH Full Form & Live Clock */}
        <div className="flex flex-col items-center justify-center my-1 md:my-0 text-center">
          <span className="font-mono font-bold tracking-wider text-emerald-400 text-[11px]">
            {lang === 'hi' 
              ? 'प्रबंध (PRABANDH) — प्लेटफॉर्म रिसोर्स एलोकेशन एंड ब्लॉक नेटवर्क डेटा हब' 
              : 'PRABANDH: Platform for Railway Asset Block Allocation & Network Data Hub'}
          </span>
          <div className="mt-0.5">
            <LiveClockWidget />
          </div>
        </div>

        {/* Right: Language Switch, Text Size, & Theme Toggle */}
        <div className="flex items-center space-x-3 justify-end">
          
          {/* Language Switch Button */}
          <button
            onClick={onToggleLang}
            className="flex items-center space-x-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded border border-amber-500 text-[11px] transition cursor-pointer"
          >
            <span>🌐 {lang === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>

          {/* Text Size Accessibility */}
          <div className="flex items-center space-x-1 text-[11px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            <span className="text-slate-400 mr-1 text-[10px]">{lang === 'hi' ? 'फ़ॉन्ट:' : 'Text:'}</span>
            <button onClick={() => onChangeTextSize('sm')} className={`px-1 rounded hover:text-white ${textSize === 'sm' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}>A-</button>
            <button onClick={() => onChangeTextSize('base')} className={`px-1 rounded hover:text-white ${textSize === 'base' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}>A</button>
            <button onClick={() => onChangeTextSize('lg')} className={`px-1 rounded hover:text-white ${textSize === 'lg' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}>A+</button>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={onToggleTheme}
            className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-0.5 rounded border border-slate-700 text-white text-[11px] transition cursor-pointer"
          >
            {theme === 'light' ? <span>🌙 Dark</span> : <span>☀️ Light</span>}
          </button>
        </div>
      </div>

      {/* 2. Main Official Railway Branding Banner */}
      <div className="bg-white dark:bg-slate-900 px-4 sm:px-8 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
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
                  {lang === 'hi' ? 'भारतीय रेल' : 'INDIAN RAILWAYS'}
                </h1>
                <span className="bg-teal-700 text-white text-xs px-2 py-0.5 rounded font-mono font-bold tracking-tight">
                  PRABANDH
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                {lang === 'hi' 
                  ? 'ब्लॉक अनुरोध और कृत्रिम मेधा स्लॉटिंग प्रणाली • Block Request & AI Slotting Engine' 
                  : 'Block Request & AI Slotting Engine • भारतीय रेल ब्लॉक अनुरोध व कृत्रिम मेधा स्लॉटिंग प्रणाली'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-5 sm:space-x-6 flex-shrink-0">
            <img 
              src="/brics-logo-lg.png.jpg" 
              alt="BRICS India 2026" 
              className="h-12 w-auto object-contain select-none" 
            />
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
          {lang === 'hi' ? 'कॉरिडोर मॉनिटर' : 'CORRIDOR MONITOR'}
        </div>
        <div className="bg-slate-900 px-3 py-2 text-rose-400 font-bold text-[11px] uppercase whitespace-nowrap flex items-center border-r border-slate-700 z-10 shadow-md">
          {lang === 'hi' ? 'टकराव समीक्षा' : 'CONFLICT REVIEW'}
        </div>

        <div className="flex-1 overflow-hidden relative flex items-center">
          <div className="railway-ticker-track items-center space-x-8 text-[11px] text-slate-200 cursor-pointer">
            {/* Item 1 */}
            <span>
              <strong className="text-amber-400">{lang === 'hi' ? '● भोपाल - इटारसी सेक्शन:' : '● Bhopal – Itarsi Section:'}</strong> {lang === 'hi' ? 'पावर ब्लॉक सक्रिय (25kV OHE आइसोलेशन सत्यापित)।' : 'Power Block Active (25kV OHE isolation verified).'}
            </span>

            <span className="text-slate-400">|</span>
            
            {/* Item 2 */}
            <span>
              <strong className="text-blue-400">{lang === 'hi' ? 'AI स्लॉटिंग इंजन:' : 'AI Slotting Engine:'}</strong> {lang === 'hi' ? '94.2% कॉरिडोर लाइन दक्षता सूचकांक बनाए रखा गया।' : '94.2% Corridor line efficiency index maintained.'}
            </span>

            <span className="text-slate-400">|</span>
            
            {/* Item 3 */}
            <span>
              <strong className="text-emerald-400">{lang === 'hi' ? '● बीना - झाँसी सेक्शन:' : '● Bina – Jhansi Section:'}</strong> {lang === 'hi' ? 'इलेक्ट्रॉनिक इंटरलॉकिंग अंशांकन प्रगति पर है।' : 'Electronic Interlocking calibration in progress.'}
            </span>

            <span className="text-slate-400">|</span>
            
            {/* Item 4 - Updated from rose-400 to blue-400 */}
            <span>
              <strong className="text-blue-400">{lang === 'hi' ? '● सतर्कता आदेश:' : '● Caution Order:'}</strong> {lang === 'hi' ? 'नागपुर - इटारसी डाउन लाइन पर 20 किमी/घंटा TSR सक्रिय है।' : 'TSR 20 km/h active on Nagpur - Itarsi Down Line.'}
            </span>

          </div>
        </div>
      </div>
    </header>
  );
}