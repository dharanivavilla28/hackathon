import React from 'react';
import { Search, Globe, Cloud, Sparkles } from './Icons';

export const StatusBarFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#080a0d] py-3 px-4 sm:px-8 text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono sticky bottom-0 z-30 backdrop-blur-md">
      {/* Left side Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-gray-300">
          <Search className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[11px]">HomeLove AI Studio v1.0</span>
        </div>
        <span className="hidden sm:inline text-gray-600">•</span>
        <div className="hidden sm:flex items-center gap-1.5 text-amber-400 text-[11px]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Structure Preserved (Gemini 2.5 + Imagen 3)</span>
        </div>
      </div>

      {/* Center Tech Credit */}
      <div className="text-[11px] text-gray-500 font-sans">
        Powered by Vertex AI (Gemini 2.5 Flash, Imagen 3 & Veo 3.1)
      </div>

      {/* Right status items matching mockup */}
      <div className="flex items-center gap-4 text-[11px]">
        <span className="flex items-center gap-1 text-gray-300">
          <Globe className="w-3 h-3 text-blue-400" /> ENG
        </span>
        <span className="text-gray-600">•</span>
        <span className="text-blue-400 font-bold">WAVE</span>
        <span className="text-gray-600">•</span>
        <span>30-07-2026</span>
        <span className="text-gray-600">•</span>
        <span className="flex items-center gap-1 text-sky-300">
          24°C <Cloud className="w-3 h-3 text-sky-400" />
        </span>
      </div>
    </footer>
  );
};

export default StatusBarFooter;
