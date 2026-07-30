import React, { useState, useEffect } from 'react';
import { Home, Search, Sun, Moon, Globe } from './Icons';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery = '',
  onSearchChange,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [lang, setLang] = useState('EN');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();

      setCurrentTime(timeStr);
      setCurrentDate(`${day}-${month}-${year}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-white dark:bg-[#121620] border-b border-purple-100 dark:border-white/10 sticky top-0 z-40 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#4ECDC4] flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Home className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-gradient-purple font-display">
              HomeLove AI
            </h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold tracking-wider uppercase">
              AI Redesign Studio
            </p>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Search for design inspiration..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-50 dark:bg-white/5 border border-purple-100 dark:border-white/10 text-gray-800 dark:text-gray-100 placeholder-gray-400 text-xs focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-purple-400/20 transition-all"
            />
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
          
          {/* Dark / Light Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-white/20 transition-colors"
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-purple-50 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#6C63FF]" />
              <span>{lang} ▼</span>
            </button>

            {isLangOpen && (
              <div className="absolute top-full right-0 mt-1 w-28 bg-white dark:bg-[#1A1F2C] rounded-2xl p-1.5 shadow-xl border border-purple-100 dark:border-white/10 z-50">
                {[
                  { code: 'EN', name: 'English' },
                  { code: 'HI', name: 'Hindi' },
                  { code: 'TA', name: 'Tamil' },
                  { code: 'TE', name: 'Telugu' }
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setIsLangOpen(false); }}
                    className="w-full px-3 py-1.5 rounded-xl text-left text-xs hover:bg-purple-50 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 font-medium"
                  >
                    {l.code} ({l.name})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Weather Widget */}
          <div className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-white/5 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-white/10">
            <span>🌤️ 25°C</span>
          </div>

          {/* Date & Time */}
          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10">
            <span>{currentDate || '30-07-2026'}</span>
            <span className="text-[#6C63FF] font-bold">{currentTime || '21:51'}</span>
          </div>

        </div>

      </div>
    </header>
  );
};

export default Header;
