import React from 'react';
import { Check } from './Icons';

export interface StylePresetItem {
  id: string;
  name: string;
  icon: string;
  colors: string[];
  desc: string;
  tag: string;
}

export const STYLE_PRESETS_DATA: StylePresetItem[] = [
  {
    id: 'japandi',
    name: 'Japandi Organic',
    icon: '🏯',
    colors: ['#F5F0E8', '#EFE6D5', '#D4C5A9', '#708090', '#2C2C2C'],
    desc: 'Minimalist Japanese + Scandinavian warmth with natural materials',
    tag: 'Most Popular',
  },
  {
    id: 'scandinavian',
    name: 'Nordic Light',
    icon: '❄️',
    colors: ['#FFFFFF', '#E8E0D5', '#C4B5A0', '#B0C4DE', '#F5F5F5'],
    desc: 'Light, airy spaces with natural timber and cozy textures',
    tag: 'Bright & Airy',
  },
  {
    id: 'industrial',
    name: 'Industrial Loft',
    icon: '🏗️',
    colors: ['#2C2C2C', '#8B4513', '#D4C5A9', '#1A1A1A', '#B22222'],
    desc: 'Exposed brick, raw concrete, matte iron & aged leather',
    tag: 'Edgy',
  },
  {
    id: 'modern_luxury',
    name: 'Modern Luxury',
    icon: '✨',
    colors: ['#FFFFFF', '#D4AF37', '#C0C0C0', '#708090', '#F5F5F5'],
    desc: 'Polished marble surfaces with brushed gold & brass accents',
    tag: 'Premium',
  },
  {
    id: 'warm_organic',
    name: 'Terracotta & Clay',
    icon: '🧱',
    colors: ['#E2725B', '#C49A6C', '#8B7D6B', '#D2691E', '#F4A460'],
    desc: 'Earthy plaster, lime wash textures & warm Mediterranean tones',
    tag: 'Earthy',
  },
  {
    id: 'biophilic',
    name: 'Biophilic Sanctuary',
    icon: '🌿',
    colors: ['#2E7D32', '#81C784', '#A5D6A7', '#6B8E23', '#F5F5F5'],
    desc: 'Indoor nature, living walls, raw wood & abundant sunlight',
    tag: 'Nature',
  },
];

interface StylePresetCardsProps {
  selectedPreset: string;
  onSelectPreset: (presetId: string) => void;
}

export const StylePresetCards: React.FC<StylePresetCardsProps> = ({
  selectedPreset,
  onSelectPreset,
}) => {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-extrabold font-display flex items-center gap-2" style={{ color: 'var(--text-dark)' }}>
          <span
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #4ECDC4)' }}
          >
            🎨
          </span>
          Select Your Design Style
        </h3>
        <p className="text-sm mt-1 ml-10" style={{ color: 'var(--text-grey)' }}>
          Choose the aesthetic that best matches your vision
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STYLE_PRESETS_DATA.map((preset) => {
          const isSelected = selectedPreset === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className="preset-card relative rounded-2xl p-5 cursor-pointer"
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(108,99,255,0.06), rgba(78,205,196,0.04))'
                  : 'var(--surface-white)',
                border: isSelected
                  ? '2px solid var(--primary-purple)'
                  : '1.5px solid var(--border-subtle)',
                boxShadow: isSelected
                  ? '0 8px 30px rgba(108,99,255,0.2)'
                  : 'var(--card-shadow)',
              }}
            >
              {/* Tag Badge */}
              <div className="absolute top-3.5 right-3.5 flex items-center gap-1">
                {isSelected && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--primary-purple)' }}
                  >
                    <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                  </div>
                )}
                {!isSelected && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      background: 'rgba(108,99,255,0.08)',
                      color: 'var(--primary-purple)',
                      border: '1px solid rgba(108,99,255,0.15)',
                    }}
                  >
                    {preset.tag}
                  </span>
                )}
              </div>

              {/* Icon */}
              <div className="text-3xl mb-3">{preset.icon}</div>

              {/* Title */}
              <h4
                className="text-base font-extrabold font-display mb-1"
                style={{ color: isSelected ? 'var(--primary-purple)' : 'var(--text-dark)' }}
              >
                {preset.name}
              </h4>

              {/* Description */}
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-grey)' }}>
                {preset.desc}
              </p>

              {/* Color Swatches */}
              <div
                className="flex items-center gap-1.5 pt-3"
                style={{ borderTop: '1px solid var(--border-subtle)' }}
              >
                <span className="text-[10px] font-semibold mr-1" style={{ color: 'var(--text-light)' }}>Palette</span>
                {preset.colors.map((c, i) => (
                  <div
                    key={i}
                    className="relative group/swatch"
                    title={c}
                  >
                    <span
                      className="block w-5 h-5 rounded-full border transition-transform group-hover/swatch:scale-125"
                      style={{
                        backgroundColor: c,
                        borderColor: 'rgba(0,0,0,0.1)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                      }}
                    />
                  </div>
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
