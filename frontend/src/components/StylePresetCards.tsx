import React from 'react';
import { Check } from './Icons';

export interface StylePresetItem {
  id: string;
  name: string;
  icon: string;
  colors: string[];
  desc: string;
}

export const STYLE_PRESETS_DATA: StylePresetItem[] = [
  {
    id: 'japandi',
    name: 'Japandi Organic',
    icon: '🏯',
    colors: ['#F5F0E8', '#EFE6D5', '#D4C5A9', '#708090', '#2C2C2C'],
    desc: 'Minimalist Japanese + Scandinavian warmth'
  },
  {
    id: 'scandinavian',
    name: 'Nordic Light',
    icon: '❄️',
    colors: ['#FFFFFF', '#E8E0D5', '#C4B5A0', '#B0C4DE', '#F5F5F5'],
    desc: 'Light, airy spaces with natural timber'
  },
  {
    id: 'industrial',
    name: 'Industrial Loft',
    icon: '🏗️',
    colors: ['#2C2C2C', '#8B4513', '#D4C5A9', '#1A1A1A', '#B22222'],
    desc: 'Exposed brick, matte iron & leather'
  },
  {
    id: 'modern_luxury',
    name: 'Modern Luxury Marble',
    icon: '✨',
    colors: ['#FFFFFF', '#D4AF37', '#C0C0C0', '#708090', '#F5F5F5'],
    desc: 'Polished marble with brass accents'
  },
  {
    id: 'warm_organic',
    name: 'Warm Terracotta & Clay',
    icon: '🧱',
    colors: ['#E2725B', '#C49A6C', '#8B7D6B', '#D2691E', '#F4A460'],
    desc: 'Earthy plaster & lime wash textures'
  },
  {
    id: 'biophilic',
    name: 'Biophilic Sanctuary',
    icon: '🌿',
    colors: ['#2E7D32', '#81C784', '#A5D6A7', '#6B8E23', '#F5F5F5'],
    desc: 'Indoor nature, living walls & sunlight'
  }
];

interface StylePresetCardsProps {
  selectedPreset: string;
  onSelectPreset: (presetId: string) => void;
}

export const StylePresetCards: React.FC<StylePresetCardsProps> = ({
  selectedPreset,
  onSelectPreset
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-[#2D3436] dark:text-white font-display flex items-center gap-2">
          <span>🎨 Select Your Style</span>
        </h3>
        <p className="text-xs text-[#636E72] dark:text-gray-400">
          Choose a design aesthetic for your space
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STYLE_PRESETS_DATA.map((preset) => {
          const isSelected = selectedPreset === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className={`card-surface p-5 rounded-2xl cursor-pointer transition-all border relative flex flex-col justify-between ${
                isSelected
                  ? 'border-[#6C63FF] ring-2 ring-[#6C63FF] shadow-lg scale-[1.02] bg-purple-50/30 dark:bg-white/10'
                  : 'border-purple-100 dark:border-white/10 hover:border-[#6C63FF]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="text-3xl mb-2">{preset.icon}</div>
                {isSelected && (
                  <span className="w-6 h-6 rounded-full bg-[#6C63FF] text-white flex items-center justify-center font-bold shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-extrabold text-base text-[#2D3436] dark:text-white font-display">
                  {preset.name}
                </h4>
                <p className="text-xs text-[#636E72] dark:text-gray-400 mt-1 mb-3">
                  {preset.desc}
                </p>
              </div>

              {/* 5 Color Swatch Circles */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-purple-100 dark:border-white/10">
                {preset.colors.map((c, i) => (
                  <span
                    key={i}
                    className="w-5 h-5 rounded-full border border-gray-300 dark:border-white/20 shadow-sm shrink-0"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StylePresetCards;
