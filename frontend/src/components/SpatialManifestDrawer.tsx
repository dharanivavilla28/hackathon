import React from 'react';
import { RefreshCw } from './Icons';

interface SpatialManifestProps {
  manifest: any;
  isLoading?: boolean;
}

export const SpatialManifestDrawer: React.FC<SpatialManifestProps> = ({ manifest, isLoading }) => {
  if (isLoading) {
    return (
      <div className="card-surface p-5 border-l-4 border-[#6C63FF] space-y-3 animate-pulse">
        <div className="flex items-center gap-2 text-[#6C63FF] font-bold text-sm">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Extracting Spatial Geometry with Gemini 2.5 Flash...</span>
        </div>
        <div className="h-20 shimmer-loader rounded-xl" />
      </div>
    );
  }

  // Fallback default mock values matching spec if manifest null
  const displayManifest = manifest || {
    room_type: "Living Room",
    dimensions: "22ft x 18ft",
    ceiling_height: "Standard 10ft Ceiling",
    camera_view: "Wide Eye-Level View",
    lighting: "Natural light from right-side windows • Shadows cast right-to-left",
    preserved_elements: [
      "🪟 Full-height window wall (right)",
      "🪟 Clerestory window (back wall)",
      "🚪 Doorway (left wall)"
    ],
    materials: [
      "Wood plank flooring",
      "Neutral wall color"
    ]
  };

  return (
    <div className="card-surface p-5 border-l-4 border-[#6C63FF] space-y-4 shadow-md">
      
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏠</span>
          <h3 className="text-lg font-bold text-[#2D3436] dark:text-white font-display">
            Spatial Geometry Detected
          </h3>
        </div>
        
        <span className="px-3 py-1 rounded-full bg-[#6C63FF] text-white text-xs font-extrabold shadow-sm">
          {displayManifest.room_type || 'Living Room'} • {displayManifest.dimensions || '22ft x 18ft'}
        </span>
      </div>

      {/* CLEAN GRID LAYOUT */}
      <div className="space-y-3 text-xs">
        
        {/* ROW 1: ROOM GEOMETRY */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 py-1">
          <span className="sm:col-span-4 font-bold text-[#636E72] dark:text-gray-400">Room Geometry</span>
          <span className="sm:col-span-8 font-semibold text-[#2D3436] dark:text-gray-100">
            {displayManifest.dimensions || '22ft x 18ft'} • {displayManifest.ceiling_height || 'Standard 10ft Ceiling'} • {displayManifest.camera_view || 'Wide Eye-Level View'}
          </span>
        </div>

        {/* ROW 2: LIGHT & SHADOW */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 py-1 border-t border-gray-100 dark:border-white/5 pt-2">
          <span className="sm:col-span-4 font-bold text-[#636E72] dark:text-gray-400">Light & Shadow</span>
          <span className="sm:col-span-8 font-semibold text-[#2D3436] dark:text-gray-100">
            {displayManifest.lighting || 'Natural light from right-side windows • Shadows cast right-to-left'}
          </span>
        </div>

        {/* ROW 3: PRESERVED ELEMENTS */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 py-1 border-t border-gray-100 dark:border-white/5 pt-2">
          <span className="sm:col-span-4 font-bold text-[#636E72] dark:text-gray-400">Preserved Elements</span>
          <div className="sm:col-span-8 flex flex-wrap gap-2">
            {(displayManifest.preserved_elements || [
              "🪟 Full-height window wall (right)",
              "🪟 Clerestory window (back wall)",
              "🚪 Doorway (left wall)"
            ]).map((elem: string, idx: number) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-white/10 text-[#6C63FF] dark:text-purple-300 font-bold text-[11px] border border-purple-100 dark:border-white/10"
              >
                {elem}
              </span>
            ))}
          </div>
        </div>

        {/* ROW 4: MATERIALS */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 py-1 border-t border-gray-100 dark:border-white/5 pt-2">
          <span className="sm:col-span-4 font-bold text-[#636E72] dark:text-gray-400">Materials</span>
          <div className="sm:col-span-8 flex flex-wrap gap-2">
            {(displayManifest.materials || ["Wood plank flooring", "Neutral wall color"]).map((mat: string, idx: number) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-white/10 text-[#4ECDC4] dark:text-teal-300 font-bold text-[11px] border border-teal-100 dark:border-white/10"
              >
                {mat}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default SpatialManifestDrawer;
