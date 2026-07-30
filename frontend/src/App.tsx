import React, { useState, useEffect } from 'react';
import {
  Sparkles, RefreshCw, Download, Video, CheckCircle2, ArrowLeft
} from './components/Icons';
import { Header } from './components/Header';
import { UploadSection, SAMPLE_PHOTOS_LIST, type SamplePhoto } from './components/UploadSection';
import { StylePresetCards } from './components/StylePresetCards';
import { InstructionArea } from './components/InstructionArea';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { SpatialManifestDrawer } from './components/SpatialManifestDrawer';
import { ChatEditPanel } from './components/ChatEditPanel';
import { VideoWalkthroughModal } from './components/VideoWalkthroughModal';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<string>('Interior');
  const [selectedStyle, setSelectedStyle] = useState<string>('japandi');
  const [prompt, setPrompt] = useState<string>(
    'Make walls warm beige. Add a navy blue sofa against the left wall. Put a wooden coffee table in the center. Add a tall plant in the right corner.'
  );

  const [uploadedImage, setUploadedImage] = useState<string | null>(SAMPLE_PHOTOS_LIST[0].url);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);

  const [spatialManifest, setSpatialManifest] = useState<any>(null);
  const [variations, setVariations] = useState<any[]>([]);
  const [selectedVarId, setSelectedVarId] = useState<string>('var_1');

  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setUploadedImage(URL.createObjectURL(file));
      setSpatialManifest(null);
      setVariations([]);
    }
  };

  const handleSampleSelect = (sample: SamplePhoto) => {
    setUploadedImage(sample.url);
    setUploadedFile(null);
    setSelectedCategory(sample.category);
    setSpatialManifest(null);
    setVariations([]);
  };

  const getFileFromUrl = async (url: string): Promise<File> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], 'sample_space.jpg', { type: 'image/jpeg' });
  };

  const handleAnalyzeSpace = async () => {
    if (!uploadedImage) return;
    setIsAnalyzing(true);
    try {
      let fileToUpload = uploadedFile;
      if (!fileToUpload) {
        fileToUpload = await getFileFromUrl(uploadedImage);
      }
      const formData = new FormData();
      formData.append('file', fileToUpload);

      const res = await fetch(`${API_BASE}/api/analyze-space`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.manifest) {
        setSpatialManifest(data.manifest);
      }
    } catch (err) {
      console.error("Spatial analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateRedesigns = async () => {
    if (!uploadedImage) return;
    setIsGenerating(true);
    try {
      let fileToUpload = uploadedFile;
      if (!fileToUpload) {
        fileToUpload = await getFileFromUrl(uploadedImage);
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('prompt', prompt);
      formData.append('style_key', selectedStyle);
      if (spatialManifest) {
        formData.append('manifest_json', JSON.stringify(spatialManifest));
      }

      const res = await fetch(`${API_BASE}/api/generate-redesigns`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.variations) {
        const formattedVars = data.variations.map((v: any) => ({
          ...v,
          image_url: v.image_url.startsWith('http') ? v.image_url : `${API_BASE}${v.image_url}`
        }));
        setVariations(formattedVars);
        setSelectedVarId(formattedVars[0]?.id || 'var_1');
        setCurrentStep(3);
      }
      if (data.spatial_manifest && !spatialManifest) {
        setSpatialManifest(data.spatial_manifest);
      }
    } catch (err) {
      console.error("Generate redesigns error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyChatEdit = async (instruction: string) => {
    const selectedVar = variations.find(v => v.id === selectedVarId);
    if (!selectedVar) return;

    setIsRefining(true);
    try {
      const res = await fetch(`${API_BASE}/api/chat-edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: selectedVar.image_url,
          refinement_prompt: instruction,
          spatial_manifest: spatialManifest
        })
      });
      const data = await res.json();
      if (data.updated_image_url) {
        const fullUrl = data.updated_image_url.startsWith('http')
          ? data.updated_image_url
          : `${API_BASE}${data.updated_image_url}`;

        setVariations(prev => prev.map(v => v.id === selectedVarId ? { ...v, image_url: fullUrl } : v));
      }
    } catch (err) {
      console.error("Chat edit error:", err);
    } finally {
      setIsRefining(false);
    }
  };

  const handleGenerateVideoWalkthrough = async () => {
    const selectedVar = variations.find(v => v.id === selectedVarId);
    const imageUrl = selectedVar ? selectedVar.image_url : uploadedImage;

    const res = await fetch(`${API_BASE}/api/generate-walkthrough`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        camera_prompt: "Cinematic walkthrough of this redesigned space. Slow panning camera movement, entry perspective push-in, warm lighting, smooth transitions."
      })
    });
    return await res.json();
  };

  const currentSelectedVar = variations.find(v => v.id === selectedVarId) || variations[0];

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-400"
      style={{ background: 'var(--bg-main)', color: 'var(--text-dark)' }}
    >
      <Header
        currentStep={currentStep}
        onStepClick={(step) => {
          if (step === 1 || (step === 2 && uploadedImage) || (step === 3 && variations.length > 0)) {
            setCurrentStep(step);
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ══════════════════════════════════════════
            PAGE 1: UPLOAD
        ══════════════════════════════════════════ */}
        {currentStep === 1 && (
          <UploadSection
            uploadedImage={uploadedImage}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            onFileChange={handleFileChange}
            onSampleSelect={handleSampleSelect}
            onContinue={() => {
              setCurrentStep(2);
              if (!spatialManifest) {
                handleAnalyzeSpace();
              }
            }}
          />
        )}

        {/* ══════════════════════════════════════════
            PAGE 2: STYLE & INSTRUCTIONS
        ══════════════════════════════════════════ */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-fadeIn">

            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 text-sm font-bold transition-all group"
                style={{ color: 'var(--primary-purple)' }}
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>

              <div className="text-center">
                <h2
                  className="text-2xl font-extrabold font-display"
                  style={{ color: 'var(--text-dark)' }}
                >
                  Configure Your Design
                </h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-grey)' }}>
                  Step 2 of 3 — Choose style & describe your vision
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold" style={{ color: 'var(--text-grey)' }}>
                <span className="text-green-500">✅ Upload</span>
                <span>→</span>
                <span style={{ color: 'var(--primary-purple)' }}>⬤ Style</span>
                <span>→</span>
                <span style={{ color: 'var(--text-light)' }}>○ Generate</span>
              </div>
            </div>

            {/* Preview of uploaded image (small strip) */}
            {uploadedImage && (
              <div className="card-surface p-4 flex items-center gap-4">
                <img
                  src={uploadedImage}
                  alt="Your space"
                  className="w-20 h-16 rounded-xl object-cover flex-shrink-0"
                  style={{ border: '2px solid var(--primary-purple)' }}
                />
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-dark)' }}>Your Space</p>
                  <p className="text-xs" style={{ color: 'var(--text-grey)' }}>{selectedCategory} • Ready for redesign</p>
                </div>
                <div className="ml-auto">
                  <SpatialManifestDrawer manifest={spatialManifest} isLoading={isAnalyzing} />
                </div>
              </div>
            )}

            {/* SPATIAL MANIFEST */}
            {!uploadedImage && (
              <SpatialManifestDrawer manifest={spatialManifest} isLoading={isAnalyzing} />
            )}

            {/* STYLE SELECTION */}
            <div className="card-surface p-6">
              <StylePresetCards
                selectedPreset={selectedStyle}
                onSelectPreset={setSelectedStyle}
              />
            </div>

            {/* INSTRUCTIONS */}
            <div className="card-surface p-6">
              <InstructionArea
                prompt={prompt}
                onChangePrompt={setPrompt}
              />
            </div>

            {/* GENERATE BUTTON */}
            <div>
              <button
                type="button"
                onClick={handleGenerateRedesigns}
                disabled={isGenerating}
                className="w-full h-14 rounded-2xl text-white font-extrabold text-base flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #6C63FF 0%, #4ECDC4 100%)',
                  boxShadow: '0 8px 30px rgba(108,99,255,0.4)',
                }}
                onMouseEnter={(e) => {
                  if (!isGenerating) {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 40px rgba(108,99,255,0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = '';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 30px rgba(108,99,255,0.4)';
                }}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Generating 3 Design Options...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>✨ Generate 3 Design Options</span>
                  </>
                )}
              </button>
              <p className="text-center text-xs mt-2" style={{ color: 'var(--text-light)' }}>
                Powered by Gemini 2.5 Flash + Imagen 4 Ultra · ~15-30 seconds
              </p>
            </div>

          </div>
        )}

        {/* ══════════════════════════════════════════
            GENERATING SHIMMER STATE (overlay)
        ══════════════════════════════════════════ */}
        {isGenerating && (
          <div className="card-surface p-10 text-center space-y-6 animate-fadeIn" style={{ border: '1px solid rgba(108,99,255,0.2)' }}>
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto"
              style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(78,205,196,0.1))', border: '1px solid rgba(108,99,255,0.2)' }}
            >
              <RefreshCw className="w-10 h-10 animate-spin" style={{ color: 'var(--primary-purple)' }} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold font-display" style={{ color: 'var(--text-dark)' }}>
                🔄 Generating 3 Structure-Preserved Designs...
              </h3>
              <p className="text-sm mt-2" style={{ color: 'var(--text-grey)' }}>
                Applying color swatches, preserving wall geometry, rendering photorealistic materials
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 rounded-2xl shimmer-loader" />
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            PAGE 3: RESULTS
        ══════════════════════════════════════════ */}
        {currentStep === 3 && variations.length > 0 && !isGenerating && (
          <div className="space-y-8 animate-fadeIn">

            {/* Top Bar */}
            <div className="card-surface p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 text-sm font-bold group transition-all"
                style={{ color: 'var(--primary-purple)' }}
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Studio</span>
              </button>

              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" style={{ color: 'var(--primary-purple)' }} />
                <h2 className="text-xl font-extrabold font-display" style={{ color: 'var(--text-dark)' }}>
                  ✨ 3 Designs Generated
                </h2>
              </div>

              <a
                href={currentSelectedVar?.image_url}
                download="HomeLove_Redesign.jpg"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-all"
                style={{
                  background: 'linear-gradient(135deg, #4ECDC4, #44a08d)',
                  boxShadow: '0 4px 15px rgba(78,205,196,0.3)',
                }}
              >
                <Download className="w-4 h-4" />
                <span>📥 Download</span>
              </a>
            </div>

            {/* Before / After Slider */}
            <div className="card-surface p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold font-display" style={{ color: 'var(--text-dark)' }}>
                  Transformation Overview
                </h3>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-grey)' }}>
                  ← Drag to compare →
                </span>
              </div>

              {currentSelectedVar && uploadedImage && (
                <BeforeAfterSlider
                  beforeImage={uploadedImage}
                  afterImage={currentSelectedVar.image_url}
                  beforeLabel="Original"
                  afterLabel="Redesigned"
                />
              )}
            </div>

            {/* 3 Design Options Gallery */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-extrabold font-display" style={{ color: 'var(--text-dark)' }}>
                  Choose Your Favorite
                </h3>
                <p className="text-xs mt-1" style={{ color: 'var(--text-grey)' }}>
                  Click any design to select it for download or further refinement
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {variations.map((v, index) => {
                  const isSelected = selectedVarId === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVarId(v.id)}
                      className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group"
                      style={{
                        border: isSelected ? '3px solid var(--primary-purple)' : '1.5px solid var(--border-subtle)',
                        boxShadow: isSelected ? '0 8px 35px rgba(108,99,255,0.3)' : 'var(--card-shadow)',
                        transform: isSelected ? 'translateY(-4px) scale(1.01)' : undefined,
                        background: 'var(--surface-white)',
                      }}
                    >
                      <div className="relative overflow-hidden" style={{ height: '220px' }}>
                        <img
                          src={v.image_url}
                          alt={v.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Option badge */}
                        <div
                          className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-bold"
                          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
                        >
                          Option {index + 1}
                        </div>

                        {/* Selected badge */}
                        {isSelected && (
                          <div
                            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ background: 'var(--primary-purple)', boxShadow: '0 4px 12px rgba(108,99,255,0.5)' }}
                          >
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                        )}

                        {/* Bottom badges */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                          <span
                            className="px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold"
                            style={{ background: 'rgba(108,99,255,0.85)', backdropFilter: 'blur(8px)' }}
                          >
                            {selectedStyle}
                          </span>
                          <span
                            className="px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold"
                            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
                          >
                            ✨ HD
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <h4 className="font-extrabold text-sm font-display" style={{ color: 'var(--text-dark)' }}>
                          {v.name}
                        </h4>
                        <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-grey)' }}>
                          {v.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 py-2">
              <button
                type="button"
                className="h-12 px-8 rounded-2xl text-white font-extrabold text-sm transition-all"
                style={{
                  background: 'linear-gradient(135deg, #6C63FF, #4ECDC4)',
                  boxShadow: '0 4px 20px rgba(108,99,255,0.35)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 30px rgba(108,99,255,0.45)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = '';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(108,99,255,0.35)';
                }}
              >
                ✓ Select This Design
              </button>

              <button
                type="button"
                onClick={handleGenerateRedesigns}
                className="h-12 px-6 rounded-2xl font-extrabold text-sm transition-all"
                style={{
                  background: 'var(--surface-white)',
                  border: '2px solid var(--primary-purple)',
                  color: 'var(--primary-purple)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(108,99,255,0.06)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-white)';
                  (e.currentTarget as HTMLButtonElement).style.transform = '';
                }}
              >
                ↻ Regenerate
              </button>

              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="h-12 px-8 rounded-2xl text-white font-extrabold text-sm flex items-center gap-2 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #4ECDC4, #44a08d)',
                  boxShadow: '0 4px 20px rgba(78,205,196,0.35)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 30px rgba(78,205,196,0.45)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = '';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(78,205,196,0.35)';
                }}
              >
                <Video className="w-4 h-4" />
                <span>🎥 Generate Video Walkthrough</span>
              </button>
            </div>

            {/* Chat Refinement */}
            <div className="card-surface p-6">
              <ChatEditPanel onApplyEdit={handleApplyChatEdit} isLoading={isRefining} />
            </div>

            {/* Stats Footer */}
            <div
              className="rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-bold"
              style={{
                background: 'linear-gradient(135deg, rgba(108,99,255,0.06), rgba(78,205,196,0.04))',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex flex-wrap items-center gap-4" style={{ color: 'var(--text-grey)' }}>
                <span>⚡ ~2.4s Generation Time</span>
                <span className="text-emerald-500">✅ Structure Preserved</span>
                <span className="text-emerald-500">✅ 3 Options Created</span>
              </div>
              <div style={{ color: 'var(--primary-purple)' }}>
                ✅ Powered by Gemini 2.5 + Imagen 4 Ultra
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ── FOOTER ── */}
      <footer
        className="w-full py-6 text-center text-xs font-semibold"
        style={{
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--surface-white)',
          color: 'var(--text-grey)',
        }}
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span>🏠 <strong style={{ color: 'var(--primary-purple)' }}>HomeLove AI Studio</strong></span>
          <span style={{ color: 'var(--border-medium)' }}>•</span>
          <span>Powered by Vertex AI (Gemini 2.5 Flash, Imagen 4 & Veo 3.1)</span>
          <span style={{ color: 'var(--border-medium)' }}>•</span>
          <span>Hackathon Demo · July 2026</span>
        </div>
      </footer>

      {/* VIDEO MODAL */}
      <VideoWalkthroughModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        redesignImageUrl={currentSelectedVar?.image_url || uploadedImage || ''}
        onGenerateVideo={handleGenerateVideoWalkthrough}
      />
    </div>
  );
}

export default App;
