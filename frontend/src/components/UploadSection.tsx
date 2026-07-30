import React, { useState, useRef } from 'react';
import { Upload, Check, ArrowRight, Sparkles } from './Icons';

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

const CATEGORIES = [
  { key: 'Interior', label: 'Interior', emoji: '🏠', desc: 'Rooms & living spaces' },
  { key: 'Exterior', label: 'Exterior', emoji: '🏛️', desc: 'Facades & entry' },
  { key: 'Garden', label: 'Garden', emoji: '🌿', desc: 'Outdoor & patio' },
  { key: 'Sketch', label: 'Sketch', emoji: '✏️', desc: 'Floor plan or sketch' },
];

const FEATURE_PILLS = [
  { icon: '🧠', label: 'Gemini 2.5 Flash' },
  { icon: '🖼️', label: 'Imagen 4 Ultra' },
  { icon: '🎬', label: 'Veo 3.1 Video' },
  { icon: '⚡', label: 'Instant Results' },
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
  onContinue,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const syntheticEvent = {
        target: { files: [file] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onFileChange(syntheticEvent);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* ── HERO BANNER ── */}
      <section
        className="relative rounded-3xl overflow-hidden"
        style={{ minHeight: '280px' }}
      >
        {/* Animated gradient background */}
        <div className="hero-gradient-animated absolute inset-0" />
        
        {/* Decorative geometric orbs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-32 h-32 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-14 space-y-5">
          
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase"
            style={{ background: 'rgba(255,255,255,0.25)', color: 'white', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-POWERED INTERIOR DESIGN STUDIO</span>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight font-display drop-shadow-lg">
              Transform Any Space
            </h2>
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight font-display"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              in <span style={{ color: '#FFF176', textShadow: '0 0 30px rgba(255,241,118,0.6)' }}>Seconds</span>
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-base sm:text-lg font-medium max-w-lg" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Upload 1 photo → AI understands structure → Generates 3 stunning design options
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {FEATURE_PILLS.map((pill) => (
              <span
                key={pill.label}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}
              >
                <span>{pill.icon}</span>
                <span>{pill.label}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT GRID: Upload + Categories ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Upload Area (left / wider) */}
        <div className="lg:col-span-3 card-surface p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold font-display" style={{ color: 'var(--text-dark)' }}>
                Upload Your Space
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-grey)' }}>
                Drag & drop, click, or pick a sample below
              </p>
            </div>
            {uploadedImage && (
              <span className="badge-teal flex items-center gap-1">
                <Check className="w-3 h-3 stroke-[3]" /> Photo Ready
              </span>
            )}
          </div>

          {/* Drop Zone */}
          <div
            className={`upload-zone relative rounded-2xl transition-all ${isDragging ? 'dragging' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />

            {uploadedImage ? (
              <div className="relative group">
                <img
                  src={uploadedImage}
                  alt="Uploaded Space"
                  className="w-full rounded-xl object-cover transition-all"
                  style={{ maxHeight: '300px', minHeight: '200px' }}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white text-sm font-bold">Click to change photo</span>
                </div>
                {/* Bottom label */}
                <div
                  className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
                  style={{ background: 'rgba(108,99,255,0.85)', backdropFilter: 'blur(8px)' }}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  Photo Loaded
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform animate-float"
                  style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(78,205,196,0.12))', border: '1px solid rgba(108,99,255,0.15)' }}
                >
                  <Upload className="w-8 h-8" style={{ color: 'var(--primary-purple)' }} />
                </div>
                <div>
                  <h4 className="text-base font-bold font-display" style={{ color: 'var(--text-dark)' }}>
                    Drop your photo here
                  </h4>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-grey)' }}>
                    or click anywhere to browse
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {['JPG', 'PNG', 'WebP', 'HEIC'].map((fmt) => (
                    <span
                      key={fmt}
                      className="px-2 py-0.5 rounded text-[11px] font-bold"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-grey)', border: '1px solid var(--border-subtle)' }}
                    >
                      {fmt}
                    </span>
                  ))}
                  <span className="text-[11px]" style={{ color: 'var(--text-light)' }}>up to 10 MB</span>
                </div>
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, #6C63FF, #4ECDC4)', boxShadow: '0 4px 15px rgba(108,99,255,0.3)' }}
                >
                  Browse Files
                </button>
              </div>
            )}
          </div>

          {/* Format info */}
          <p className="text-center text-xs" style={{ color: 'var(--text-light)' }}>
            🔒 Your images are processed securely and never stored
          </p>
        </div>

        {/* Right: Category + Sample gallery */}
        <div className="lg:col-span-2 space-y-5">

          {/* Category Selector */}
          <div className="card-surface p-5 space-y-4">
            <div>
              <h3 className="text-base font-extrabold font-display" style={{ color: 'var(--text-dark)' }}>
                Space Category
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-grey)' }}>
                What type of space is this?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {CATEGORIES.map((cat) => {
                const isSel = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => onCategorySelect(cat.key)}
                    className="relative p-3 rounded-xl text-left transition-all duration-200 group"
                    style={{
                      background: isSel ? 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(78,205,196,0.08))' : 'var(--bg-secondary)',
                      border: isSel ? '2px solid var(--primary-purple)' : '1.5px solid var(--border-subtle)',
                      boxShadow: isSel ? '0 4px 15px rgba(108,99,255,0.2)' : undefined,
                    }}
                  >
                    <span className="text-xl mb-1 block">{cat.emoji}</span>
                    <span
                      className="text-xs font-bold block"
                      style={{ color: isSel ? 'var(--primary-purple)' : 'var(--text-dark)' }}
                    >
                      {cat.label}
                    </span>
                    <span className="text-[10px] block" style={{ color: 'var(--text-grey)' }}>
                      {cat.desc}
                    </span>
                    {isSel && (
                      <div
                        className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--primary-purple)' }}
                      >
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sample Gallery */}
          <div className="card-surface p-5 space-y-4">
            <div>
              <h3 className="text-base font-extrabold font-display" style={{ color: 'var(--text-dark)' }}>
                Try a Sample
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-grey)' }}>
                Click to instantly load an example photo
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {SAMPLE_PHOTOS_LIST.map((sample) => {
                const isActive = uploadedImage === sample.url;
                return (
                  <div
                    key={sample.id}
                    onClick={() => onSampleSelect(sample)}
                    className="relative rounded-xl overflow-hidden cursor-pointer group transition-all duration-200"
                    style={{
                      border: isActive ? '2.5px solid var(--primary-purple)' : '1.5px solid var(--border-subtle)',
                      boxShadow: isActive ? '0 4px 15px rgba(108,99,255,0.25)' : undefined,
                    }}
                  >
                    <img
                      src={sample.url}
                      alt={sample.name}
                      className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      className="px-2 py-1.5 flex items-center gap-1"
                      style={{ background: 'var(--surface-white)', borderTop: '1px solid var(--border-subtle)' }}
                    >
                      <span className="text-xs">{sample.icon}</span>
                      <span className="text-[11px] font-bold" style={{ color: 'var(--text-dark)' }}>
                        {sample.name}
                      </span>
                    </div>
                    {isActive && (
                      <div
                        className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--primary-purple)' }}
                      >
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTINUE BUTTON ── */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onContinue}
          disabled={!uploadedImage}
          className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-white font-extrabold text-base transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: uploadedImage
              ? 'linear-gradient(135deg, #6C63FF 0%, #4ECDC4 100%)'
              : 'rgba(108,99,255,0.5)',
            boxShadow: uploadedImage ? '0 8px 30px rgba(108,99,255,0.4)' : undefined,
          }}
          onMouseEnter={(e) => {
            if (uploadedImage) {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px) scale(1.02)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 40px rgba(108,99,255,0.5)';
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = '';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = uploadedImage ? '0 8px 30px rgba(108,99,255,0.4)' : '';
          }}
        >
          <span>🚀 Continue to Design Studio</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
};

export default UploadSection;
