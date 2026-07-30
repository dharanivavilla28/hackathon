import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, Wand2, RefreshCw } from './Icons';

interface ChatEditPanelProps {
  onApplyEdit: (instruction: string) => Promise<void>;
  isLoading: boolean;
}

const SAMPLE_REFINEMENTS = [
  "Make the walls warm beige and add a navy sofa",
  "Add ambient warm LED backlighting behind furniture",
  "Change floor to light herringbone oak wood",
  "Add tall fiddle-leaf fig plants in corners",
  "Make space look bright with morning sunlight"
];

export const ChatEditPanel: React.FC<ChatEditPanelProps> = ({ onApplyEdit, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await onApplyEdit(input.trim());
    setInput('');
  };

  const handleChipClick = (sample: string) => {
    setInput(sample);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-display">Chat-to-Edit Refinement</h3>
            <p className="text-xs text-gray-400">Iteratively tweak colors, materials, furniture & lighting</p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-semibold bg-white/5 border border-white/10 rounded-full text-amber-300">
          Conversational Mode
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='e.g., "Make walls warm beige. Add a navy blue sofa against left wall."'
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all disabled:opacity-50"
          />
          <Wand2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-semibold text-sm flex items-center gap-2 shadow-gold-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Refining...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Apply Edit</span>
            </>
          )}
        </button>
      </form>

      <div className="space-y-2">
        <div className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Quick Refinement Suggestions:
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_REFINEMENTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(sample)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white transition-all text-left truncate max-w-full"
            >
              "{sample}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
