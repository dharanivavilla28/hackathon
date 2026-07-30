import React, { useState } from 'react';
import { Eye, ShieldCheck, Layers, ChevronDown, ChevronUp, Sun, Sparkles, Box } from './Icons';

interface StructuralElement {
  element: string;
  position: string;
  type: string;
  dimensions_estimate?: string;
}

interface SpatialManifest {
  space_type?: string;
  confidence_score?: number;
  room_proportions?: {
    estimated_dimensions?: string;
    ceiling_type?: string;
    perspective_angle?: string;
  };
  structural_elements?: StructuralElement[];
  openings?: {
    windows?: string;
    doors?: string;
  };
  existing_furniture_or_features?: string[];
  lighting_and_atmosphere?: {
    primary_light_source?: string;
    shadow_direction?: string;
    current_color_palette?: string[];
  };
  preservation_rules?: string[];
}

interface SpatialManifestDrawerProps {
  manifest: SpatialManifest | null;
  isLoading?: boolean;
}

export const SpatialManifestDrawer: React.FC<SpatialManifestDrawerProps> = ({ manifest, isLoading }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="glass-panel rounded-2xl p-5 border border-amber-500/30 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <div className="h-4 w-48 bg-white/10 rounded mb-1.5"></div>
            <div className="h-3 w-64 bg-white/5 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!manifest) return null;

  return (
    <div className="glass-panel rounded-2xl border border-amber-500/30 overflow-hidden shadow-glow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Spatial Geometric Manifest</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                Gemini 2.5 Vision
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Identified: <span className="text-amber-300 font-medium">{manifest.space_type || 'Room Space'}</span> • {manifest.room_proportions?.estimated_dimensions || 'Perspective Grid Extracted'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Structure Preserved</span>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 pt-3 border-t border-white/10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-1">
                <Box className="w-3.5 h-3.5 text-amber-400" /> Room Geometry
              </div>
              <p className="text-xs text-gray-400">
                <strong className="text-gray-200">Scale:</strong> {manifest.room_proportions?.estimated_dimensions || 'Standard'}<br />
                <strong className="text-gray-200">Ceiling:</strong> {manifest.room_proportions?.ceiling_type || 'Standard'}<br />
                <strong className="text-gray-200">Angle:</strong> {manifest.room_proportions?.perspective_angle || 'Wide'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Daylight & Shadow
              </div>
              <p className="text-xs text-gray-400">
                <strong className="text-gray-200">Light Source:</strong> {manifest.lighting_and_atmosphere?.primary_light_source || 'Natural Ambient'}<br />
                <strong className="text-gray-200">Shadow:</strong> {manifest.lighting_and_atmosphere?.shadow_direction || 'Diffused'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-1">
                <Eye className="w-3.5 h-3.5 text-amber-400" /> Structural Constraints
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                {(manifest.structural_elements || []).slice(0, 3).map((el, i) => (
                  <div key={i} className="truncate">
                    • <span className="text-gray-200 font-medium">{el.element}</span> ({el.position})
                  </div>
                ))}
              </div>
            </div>
          </div>

          {(manifest.preservation_rules || []).length > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
              <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> Structural Integrity Rules Injected into Generator:
              </div>
              <ul className="list-disc list-inside text-gray-300 space-y-0.5">
                {manifest.preservation_rules?.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
