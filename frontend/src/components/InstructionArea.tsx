import React, { useState } from 'react';
import { Mic, MicOff } from './Icons';

interface InstructionAreaProps {
  prompt: string;
  onChangePrompt: (newPrompt: string) => void;
}

export const InstructionArea: React.FC<InstructionAreaProps> = ({
  prompt,
  onChangePrompt
}) => {
  const [isListening, setIsListening] = useState(false);

  const quickActionChips = [
    { label: '🎨 Change Color', text: 'Change wall color to warm beige and accent color to sage.' },
    { label: '🛋️ Add Furniture', text: 'Add a navy blue sofa left and wooden coffee table center.' },
    { label: '🪟 Add Window', text: 'Add large sunlit glass windows for natural daylight.' },
    { label: '🗑️ Remove Item', text: 'Remove unnecessary clutter and open up space.' },
    { label: '🌿 Add Plants', text: 'Add tall fiddle leaf fig indoor plants in corners.' },
    { label: '💡 Change Lighting', text: 'Add warm pendant lights and ambient recessed lighting.' }
  ];

  const handleChipClick = (chipText: string) => {
    if (!prompt.trim()) {
      onChangePrompt(chipText);
    } else {
      onChangePrompt(`${prompt.trim()} ${chipText}`);
    }
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      if (!isListening) {
        setIsListening(true);
        setTimeout(() => {
          const appended = prompt ? `${prompt} Add warm ambient lighting and hardwood oak floors.` : 'Add warm ambient lighting and hardwood oak floors.';
          onChangePrompt(appended);
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
          onChangePrompt(prompt ? `${prompt} ${transcript}` : transcript);
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
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-[#2D3436] dark:text-white font-display">
          ✏️ Describe Your Redesign
        </h3>
        <p className="text-xs text-[#636E72] dark:text-gray-400">
          Tell us exactly what you want to change
        </p>
      </div>

      {/* Input Box with Voice Mic Button */}
      <div className="card-surface p-4 relative border border-purple-100 dark:border-white/10 shadow-sm">
        <textarea
          rows={4}
          value={prompt}
          onChange={(e) => onChangePrompt(e.target.value)}
          placeholder="Example: Make walls warm beige. Add a navy blue sofa against the left wall. Put a wooden coffee table in the center. Add a tall plant in the right corner."
          className="w-full bg-transparent text-[#2D3436] dark:text-white placeholder-gray-400 text-sm focus:outline-none resize-none pr-12"
        />

        {/* Circular Purple Voice Mic Button */}
        <button
          type="button"
          onClick={toggleVoiceInput}
          title="🎤 Voice Input"
          className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-all ${
            isListening ? 'bg-red-500 animate-pulse scale-110' : 'bg-[#6C63FF] hover:bg-purple-700'
          }`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      </div>

      <p className="text-xs text-[#636E72] dark:text-gray-400">
        💡 Be specific about colors, furniture placement, and materials
      </p>

      {/* Quick Action Chips */}
      <div className="flex flex-wrap gap-2 pt-1">
        {quickActionChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleChipClick(chip.text)}
            className="px-3.5 py-1.5 rounded-full bg-white dark:bg-white/5 border border-purple-200 dark:border-white/10 text-xs font-semibold text-[#6C63FF] dark:text-purple-300 hover:bg-[#6C63FF] hover:text-white transition-all shadow-sm"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InstructionArea;
