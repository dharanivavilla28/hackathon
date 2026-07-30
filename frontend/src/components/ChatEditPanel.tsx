import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, Wand2, RefreshCw } from './Icons';

interface ChatEditPanelProps {
  onApplyEdit: (instruction: string) => Promise<void>;
  isLoading: boolean;
}

const SAMPLE_REFINEMENTS = [
  'Make the walls warm beige and add a navy velvet sofa',
  'Add warm LED ambient backlighting behind furniture',
  'Change floor to light herringbone oak wood',
  'Add tall fiddle-leaf fig plants in corners',
  'Make space look bright with morning sunlight filtering in',
];

export const ChatEditPanel: React.FC<ChatEditPanelProps> = ({ onApplyEdit, isLoading }) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await onApplyEdit(input.trim());
    setInput('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #FF8E53, #FF6B6B)' }}
          >
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold font-display" style={{ color: 'var(--text-dark)' }}>
              Chat-to-Edit Refinement
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-grey)' }}>
              Iteratively tweak colors, materials, furniture & lighting
            </p>
          </div>
        </div>
        <span
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{
            background: 'rgba(255,107,107,0.1)',
            color: '#FF6B6B',
            border: '1px solid rgba(255,107,107,0.2)',
          }}
        >
          ✦ AI Powered
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder='e.g. "Make walls warm beige. Add a navy blue sofa."'
            disabled={isLoading}
            className="w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all outline-none pr-10"
            style={{
              background: 'var(--bg-secondary)',
              border: isFocused ? '1.5px solid var(--primary-purple)' : '1.5px solid var(--border-subtle)',
              color: 'var(--text-dark)',
              boxShadow: isFocused ? '0 0 0 3px rgba(108,99,255,0.1)' : undefined,
            }}
          />
          <Wand2
            className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ width: '16px', height: '16px', color: 'var(--text-light)' }}
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, #6C63FF, #4ECDC4)',
            boxShadow: input.trim() ? '0 4px 15px rgba(108,99,255,0.3)' : undefined,
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            if (input.trim() && !isLoading) {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 25px rgba(108,99,255,0.4)';
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = '';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = input.trim() ? '0 4px 15px rgba(108,99,255,0.3)' : '';
          }}
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

      {/* Quick Refinements */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--text-grey)' }}>
          <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--primary-purple)' }} />
          Quick refinement suggestions:
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_REFINEMENTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInput(sample)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-left"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-grey)',
                maxWidth: '100%',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--primary-purple)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--primary-purple)';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(108,99,255,0.06)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-grey)';
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-secondary)';
              }}
            >
              "{sample}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatEditPanel;
