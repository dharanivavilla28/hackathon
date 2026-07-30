import React, { useState, useEffect } from 'react';
import { Home, Search, Sun, Moon, Globe, User, Check, Sparkles } from './Icons';

interface HeaderProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const STEPS = [
  { step: 1, label: 'Upload', emoji: '📸', desc: 'Add your space' },
  { step: 2, label: 'Style', emoji: '🎨', desc: 'Choose aesthetic' },
  { step: 3, label: 'Generate', emoji: '✨', desc: 'AI magic' },
];

const LANGUAGES = [
  { code: 'EN', flag: '🇺🇸', name: 'English' },
  { code: 'HI', flag: '🇮🇳', name: 'Hindi' },
  { code: 'TA', flag: '🇮🇳', name: 'Tamil' },
  { code: 'TE', flag: '🇮🇳', name: 'Telugu' },
];

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onStepClick,
  searchQuery = '',
  onSearchChange,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [lang, setLang] = useState('EN');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full sticky top-0 z-50 transition-all duration-300"
      style={{
        background: isDarkMode
          ? 'rgba(11, 13, 21, 0.92)'
          : 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: `1px solid ${isDarkMode ? 'rgba(124,116,255,0.12)' : 'rgba(108,99,255,0.10)'}`,
        boxShadow: isDarkMode
          ? '0 4px 30px rgba(0,0,0,0.4)'
          : '0 4px 30px rgba(108,99,255,0.06)',
      }}
    >
      {/* ── ROW 1: MAIN NAVIGATION ── */}
      <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center justify-between gap-4">

        {/* Logo */}
        <div
          className="flex items-center gap-2.5 shrink-0 cursor-pointer group"
          onClick={() => onStepClick(1)}
        >
          <div className="relative w-9 h-9 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-purple-teal flex items-center justify-center text-white shadow-lg group-hover:shadow-purple-500/30 transition-shadow">
              <Home className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
            </div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          </div>
          <div className="leading-tight">
            <h1 className="text-xl font-extrabold text-gradient-purple font-display tracking-tight leading-none">
              HomeLove AI
            </h1>
            <span className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: 'var(--text-light)', letterSpacing: '0.1em' }}>
              REDESIGN STUDIO
            </span>
          </div>
        </div>

        {/* Center: Step Progress (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          {STEPS.map((s, i) => {
            const isCompleted = currentStep > s.step;
            const isActive = currentStep === s.step;
            return (
              <React.Fragment key={s.step}>
                <button
                  type="button"
                  onClick={() => onStepClick(s.step)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-purple-teal text-white shadow-lg'
                      : isCompleted
                        ? 'text-white bg-[#4ECDC4]'
                        : 'text-[var(--text-grey)] hover:text-[var(--primary-purple)] hover:bg-[rgba(108,99,255,0.06)]'
                  }`}
                  style={{
                    boxShadow: isActive ? '0 4px 15px rgba(108,99,255,0.35)' : undefined,
                  }}
                >
                  {/* Circle number */}
                  <span
                    className={`w-6 h-6 rounded-full text-[11px] font-extrabold flex items-center justify-center flex-shrink-0 transition-all ${
                      isActive
                        ? 'bg-white text-[#6C63FF]'
                        : isCompleted
                          ? 'bg-white text-[#4ECDC4]'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-grey)]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : s.step}
                  </span>
                  <span className="text-xs font-bold">{s.emoji} {s.label}</span>
                </button>

                {i < STEPS.length - 1 && (
                  <div
                    className="h-0.5 w-8 rounded-full transition-all duration-500"
                    style={{
                      background: currentStep > s.step
                        ? 'linear-gradient(90deg, #6C63FF, #4ECDC4)'
                        : 'var(--border-subtle)',
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            title="Toggle theme"
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{
              background: isDarkMode ? 'rgba(124,116,255,0.15)' : 'rgba(108,99,255,0.08)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {isDarkMode
              ? <Sun className="w-4.5 h-4.5 text-amber-400" style={{ width: '18px', height: '18px' }} />
              : <Moon className="w-4.5 h-4.5 text-[#6C63FF]" style={{ width: '18px', height: '18px' }} />
            }
          </button>

          {/* User Avatar */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer text-white font-bold text-xs"
            style={{
              background: 'linear-gradient(135deg, #6C63FF, #4ECDC4)',
              boxShadow: '0 4px 12px rgba(108,99,255,0.35)',
            }}
          >
            <User className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
          </div>
        </div>
      </div>

      {/* ── ROW 2: UTILITY BAR ── */}
      <div
        className="max-w-7xl mx-auto px-5 py-2 flex items-center justify-between gap-4"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ width: '13px', height: '13px', color: isSearchFocused ? 'var(--primary-purple)' : 'var(--text-light)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search designs or styles..."
            className="w-full pl-8 pr-3 py-1.5 text-xs font-medium rounded-lg transition-all outline-none"
            style={{
              background: 'var(--bg-secondary)',
              border: isSearchFocused ? '1.5px solid var(--primary-purple)' : '1.5px solid var(--border-subtle)',
              color: 'var(--text-dark)',
              boxShadow: isSearchFocused ? '0 0 0 3px rgba(108,99,255,0.1)' : undefined,
            }}
          />
        </div>

        {/* Right Utils */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-dark)',
              }}
            >
              <Globe className="w-3.5 h-3.5 text-[#6C63FF]" style={{ width: '13px', height: '13px' }} />
              <span>{LANGUAGES.find(l => l.code === lang)?.flag} {lang}</span>
              <span style={{ color: 'var(--text-light)' }}>▾</span>
            </button>

            {isLangOpen && (
              <div
                className="absolute top-full right-0 mt-1.5 w-36 rounded-xl p-1 z-50 animate-fadeInScale"
                style={{
                  background: 'var(--surface-white)',
                  border: '1px solid var(--border-medium)',
                  boxShadow: 'var(--card-shadow-hover)',
                }}
              >
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setIsLangOpen(false); }}
                    className="w-full px-3 py-2 rounded-lg text-left text-xs font-semibold flex items-center gap-2 transition-all"
                    style={{
                      color: lang === l.code ? 'var(--primary-purple)' : 'var(--text-dark)',
                      background: lang === l.code ? 'rgba(108,99,255,0.08)' : 'transparent',
                    }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.name}</span>
                    {lang === l.code && <Check className="w-3 h-3 ml-auto stroke-[3]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Time */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-grey)',
            }}
          >
            <span>🕐 {time}</span>
          </div>

          {/* Weather */}
          <div
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold"
            style={{
              background: 'rgba(96, 165, 250, 0.1)',
              border: '1px solid rgba(96,165,250,0.2)',
              color: '#3B82F6',
            }}
          >
            🌤️ 24°C
          </div>
        </div>
      </div>

      {/* ── MOBILE: Step indicator row ── */}
      <div
        className="md:hidden max-w-7xl mx-auto px-5 py-2.5 flex items-center justify-center gap-3"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        {STEPS.map((s, i) => {
          const isCompleted = currentStep > s.step;
          const isActive = currentStep === s.step;
          return (
            <React.Fragment key={s.step}>
              <button
                type="button"
                onClick={() => onStepClick(s.step)}
                className="flex items-center gap-1.5 text-[11px] font-bold transition-all"
                style={{ color: isActive || isCompleted ? 'var(--primary-purple)' : 'var(--text-light)' }}
              >
                <span
                  className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-extrabold"
                  style={{
                    background: isActive ? 'linear-gradient(135deg,#6C63FF,#4ECDC4)' : isCompleted ? '#4ECDC4' : 'var(--bg-secondary)',
                    color: isActive || isCompleted ? 'white' : 'var(--text-grey)',
                  }}
                >
                  {isCompleted ? '✓' : s.step}
                </span>
                {s.label}
              </button>
              {i < STEPS.length - 1 && (
                <div className="h-0.5 w-6 rounded-full" style={{ background: 'var(--border-subtle)' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </header>
  );
};

export default Header;
