import React, { useState } from 'react';
import { Mic, MicOff, Sparkles } from './Icons';

interface InstructionAreaProps {
  prompt: string;
  onChangePrompt: (newPrompt: string) => void;
}

const ACTION_CHIPS = [
  { label: '🎨 Change Color', text: 'Change wall color to warm beige and accent color to sage green.' },
  { label: '🛋️ Add Sofa', text: 'Add a navy blue sofa against the left wall with matching throw pillows.' },
  { label: '🪟 Add Window', text: 'Add floor-to-ceiling glass windows for natural sunlight.' },
  { label: '🗑️ Declutter', text: 'De-clutter the space, remove old items and create an open minimalist layout.' },
  { label: '🌿 Add Plants', text: 'Add tall fiddle-leaf fig plants in the corners for a biophilic feel.' },
  { label: '💡 Lighting', text: 'Add warm ambient recessed lighting and a modern statement pendant light.' },
];

export const InstructionArea: React.FC<InstructionAreaProps> = ({
  prompt,
  onChangePrompt,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [charCount, setCharCount] = useState(prompt.length);

  const handleChange = (val: string) => {
    onChangePrompt(val);
    setCharCount(val.length);
  };

  const handleChipClick = (chipText: string) => {
    const newPrompt = prompt.trim() ? `${prompt.trim()} ${chipText}` : chipText;
    handleChange(newPrompt);
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      if (!isListening) {
        setIsListening(true);
        setTimeout(() => {
          const appended = prompt
            ? `${prompt} Add warm ambient lighting and hardwood oak floors.`
            : 'Add warm ambient lighting and hardwood oak floors.';
          handleChange(appended);
          setIsListening(false);
        }, 2000);
      } else {
        setIsListening(false);
      }
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      if (!isListening) {
        setIsListening(true);
        recognition.start();
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          handleChange(prompt ? `${prompt} ${transcript}` : transcript);
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
      } else {
        setIsListening(false);
        recognition.stop();
      }
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h3 className="text-xl font-extrabold font-display flex items-center gap-2" style={{ color: 'var(--text-dark)' }}>
          <span
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)' }}
          >
            ✍️
          </span>
          Describe Your Redesign
        </h3>
        <p className="text-sm mt-1 ml-10" style={{ color: 'var(--text-grey)' }}>
          Be specific about colors, furniture placement, and materials for best results
        </p>
      </div>

      {/* Textarea card */}
      <div
        className="relative rounded-2xl transition-all"
        style={{
          background: 'var(--surface-white)',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <textarea
          rows={5}
          value={prompt}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Example: Make walls warm beige. Add a navy blue velvet sofa against the left wall. Put a wooden coffee table in the center. Add a tall fiddle-leaf fig plant in the right corner. Warm pendant lighting above."
          className="w-full bg-transparent text-sm resize-none focus:outline-none p-5 pr-16"
          style={{
            color: 'var(--text-dark)',
            minHeight: '130px',
          }}
        />

        {/* Bottom bar inside textarea card */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <span className="text-xs" style={{ color: 'var(--text-light)' }}>
            {charCount > 0 ? `${charCount} characters` : '💡 Tip: Be specific for better results'}
          </span>

          {/* Voice mic button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            title="🎤 Voice Input"
            className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all"
            style={{
              background: isListening
                ? 'linear-gradient(135deg, #FF6B6B, #FF8E53)'
                : 'linear-gradient(135deg, #6C63FF, #4ECDC4)',
              boxShadow: isListening
                ? '0 4px 15px rgba(255,107,107,0.5)'
                : '0 4px 15px rgba(108,99,255,0.3)',
              animation: isListening ? 'pulse-glow 1s ease-in-out infinite' : undefined,
            }}
          >
            {isListening ? <MicOff className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} /> : <Mic className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />}
          </button>
        </div>
      </div>

      {/* Voice status */}
      {isListening && (
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold animate-fadeIn"
          style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', color: '#FF6B6B' }}
        >
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-current"
                style={{
                  height: '16px',
                  animation: `float ${0.6 + i * 0.15}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
          <span>Listening... Speak your design instructions</span>
        </div>
      )}

      {/* Quick-action chips */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--text-grey)' }}>
          <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--primary-purple)' }} />
          Quick suggestions — click to add:
        </div>
        <div className="flex flex-wrap gap-2">
          {ACTION_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(chip.text)}
              className="chip-purple"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default InstructionArea;
