import React from 'react';
import { Upload, Sparkles, Check, ArrowRight } from './Icons';

export interface SamplePhoto {
  id: string;
  name: string;
  category: 'Interior' | 'Exterior' | 'Garden' | 'Sketch';
  icon: string;
  url: string;
}

export const SAMPLE_PHOTOS_LIST: SamplePhoto[] = [
  {
    id: 'sample_living',
    name: 'Living Room',
    category: 'Interior',
    icon: '🏠',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'sample_kitchen',
    name: 'Kitchen',
    category: 'Interior',
    icon: '🍳',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'sample_exterior',
    name: 'House Facade',
    category: 'Exterior',
    icon: '🏛️',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'sample_garden',
    name: 'Garden Patio',
    category: 'Garden',
    icon: '🌿',
    url: 'https://images.unsplash.com/photo-1558882224-dda166733046?auto=format&fit=crop&w=1200&q=80'
  }
];

interface UploadSectionProps {
  uploadedImage: string | null;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSampleSelect: (sample: SamplePhoto) => void;
  onContinue: () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  uploadedImage,
  selectedCategory,
  onCategorySelect,
  onFileChange,
  onSampleSelect,
  onContinue
}) => {
  const categories = [
    { key: 'Interior', label: '🏠 Interior' },
    { key: 'Garden', label: '🌿 Garden' },
    { key: 'Exterior', label: '🏛️ Exterior' },
    { key: 'Sketch', label: '✏️ Sketch' }
  ];

  return (
    <div className="space-y-8">
      
      {/* HERO SECTION WITH GRADIENT BACKGROUND */}
      <section className="relative rounded-3xl overflow-hidden p-8 sm:p-12 text-center text-white bg-gradient-purple-teal shadow-xl">
        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          
          <h2 className="text-4xl sm:text-5xl font-black font-display tracking-tight text-white drop-shadow-md">
            🏠 HomeLove AI
          </h2>

          <div className="text-lg sm:text-xl font-bold tracking-widest uppercase text-purple-100">
            AI REDESIGN STUDIO
          </div>

          <p className="text-base sm:text-lg font-semibold text-white/90">
            Upload 1 Photo → AI Preserves Structure → 3 Design Options
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>✨ Transform Any Space in Seconds ✨</span>
          </div>

          {/* FOUR PILL BADGES */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3">
            {categories.map((cat) => (
              <span
                key={cat.key}
                className="px-4 py-1.5 rounded-full bg-white text-[#6C63FF] font-bold text-xs shadow-md border border-white/40"
              >
                {cat.label}
              </span>
            ))}
          </div>

        </div>

        {/* Geometric Background Overlay Patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_60%)] pointer-events-none" />
      </section>

      {/* UPLOAD SECTION CARD */}
      <div className="card-surface p-6 sm:p-8 space-y-6">
        
        {/* Dropzone Card */}
        <div className="relative group cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />

          <div className="upload-border-purple rounded-2xl p-8 sm:p-10 text-center transition-all">
            {uploadedImage ? (
              <div className="space-y-4">
                <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-xl max-w-2xl mx-auto border border-purple-200">
                  <img src={uploadedImage} alt="Uploaded Space" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-2">
                    <Upload className="w-8 h-8 text-[#4ECDC4] animate-bounce" />
                    <span>Click or Drag to Change Photo</span>
                  </div>
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#6C63FF] text-white text-xs font-bold shadow-md flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Photo Uploaded
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-100 text-[#6C63FF] flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform">
                  <Upload className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2D3436] dark:text-white font-display">
                    📸 Click to Upload Your Space Photo
                  </h3>
                  <p className="text-xs text-[#636E72] dark:text-gray-400 mt-1">
                    Drag & drop or click to browse (JPG, PNG, WebP)
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-2">
                  {['JPG', 'PNG', 'WebP', 'MAX 10MB'].map((b, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-white/10 text-[#6C63FF] dark:text-purple-300 text-[10px] font-bold">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SPACE CATEGORY SELECTOR */}
        <div className="space-y-3 pt-2">
          <label className="text-sm font-bold text-[#2D3436] dark:text-white flex items-center gap-2">
            <span>Select Space Category:</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map((cat) => {
              const isSel = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => onCategorySelect(cat.key)}
                  className={`py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
                    isSel
                      ? 'bg-[#6C63FF] text-white shadow-purple-500/30 shadow-md ring-2 ring-[#6C63FF]'
                      : 'bg-white dark:bg-white/5 text-[#2D3436] dark:text-gray-200 border border-purple-100 dark:border-white/10 hover:border-[#6C63FF]'
                  }`}
                >
                  <span>{cat.label}</span>
                  {isSel && <Check className="w-4 h-4 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* QUICK EXAMPLE GALLERY */}
        <div className="space-y-3 pt-2">
          <label className="text-sm font-bold text-[#2D3436] dark:text-white flex items-center gap-1.5">
            <span>🔥 Quick Examples</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SAMPLE_PHOTOS_LIST.map((sample) => (
              <div
                key={sample.id}
                onClick={() => onSampleSelect(sample)}
                className={`card-surface p-2.5 rounded-xl cursor-pointer transition-all border flex flex-col items-center text-center gap-2 group ${
                  uploadedImage === sample.url
                    ? 'border-[#6C63FF] ring-2 ring-[#6C63FF]/30 bg-purple-50/50 dark:bg-white/10'
                    : 'border-purple-100 dark:border-white/10 hover:border-[#6C63FF]'
                }`}
              >
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-full h-24 rounded-lg object-cover group-hover:scale-105 transition-transform"
                />
                <span className="text-xs font-bold text-[#2D3436] dark:text-white">
                  {sample.icon} {sample.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CONTINUE TO DESIGN STUDIO BUTTON */}
        <div className="pt-4 text-center">
          <button
            type="button"
            onClick={onContinue}
            disabled={!uploadedImage}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-purple-teal text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mx-auto"
          >
            <span>🚀 Continue to Design Studio</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default UploadSection;
