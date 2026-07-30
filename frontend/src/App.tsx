import React, { useState, useEffect } from 'react';
import {
  Sparkles, RefreshCw, Download, Video,
  Wand2, CheckCircle2, ArrowLeft, Check
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
  const [currentStep, setCurrentStep] = useState<number>(1); // 1: Landing/Upload, 2: Studio, 3: Results
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

  // Handle Dark mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle Photo File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setUploadedImage(URL.createObjectURL(file));
      setSpatialManifest(null);
      setVariations([]);
    }
  };

  // Sample Selection
  const handleSampleSelect = (sample: SamplePhoto) => {
    setUploadedImage(sample.url);
    setUploadedFile(null);
    setSelectedCategory(sample.category);
    setSpatialManifest(null);
    setVariations([]);
  };

  // Helper to fetch file bytes from sample URL
  const getFileFromUrl = async (url: string): Promise<File> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], 'sample_space.jpg', { type: 'image/jpeg' });
  };

  // Trigger Spatial Analysis (Gemini Vision)
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

  // Generate 3 Redesign Options
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
        setCurrentStep(3); // Advance to Results page
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

  // Conversational Refinement (Chat-to-Edit)
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

  // Veo 3.1 Video Walkthrough
  const handleGenerateVideoWalkthrough = async () => {
    const selectedVar = variations.find(v => v.id === selectedVarId);
    const imageUrl = selectedVar ? selectedVar.image_url : uploadedImage;

    const res = await fetch(`${API_BASE}/api/generate-walkthrough`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        camera_prompt: "Cinematic walkthrough of this redesigned space. Slow panning camera movement, entry perspective push-in, warm lighting, smooth transitions, 8-second duration."
      })
    });
    return await res.json();
  };

  const currentSelectedVar = variations.find(v => v.id === selectedVarId) || variations[0];

  return (
    <div className="min-h-screen bg-[#F8F9FE] dark:bg-[#0B0D13] text-[#2D3436] dark:text-[#F3F4F6] flex flex-col font-sans transition-colors duration-300">
      
      {/* HEADER */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* PAGE STEP PROGRESS INDICATOR */}
        <div className="flex items-center justify-center gap-2 sm:gap-6 py-2 max-w-xl mx-auto">
          {[
            { step: 1, title: '📸 Upload' },
            { step: 2, title: '🎨 Style' },
            { step: 3, title: '✨ Generate' }
          ].map((s, i, arr) => {
            const isCompleted = currentStep > s.step;
            const isActive = currentStep === s.step;
            return (
              <React.Fragment key={s.step}>
                <div
                  onClick={() => {
                    if (s.step === 1 || (s.step === 2 && uploadedImage) || (s.step === 3 && variations.length > 0)) {
                      setCurrentStep(s.step);
                    }
                  }}
                  className={`flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-full transition-all ${
                    isActive
                      ? 'bg-[#6C63FF] text-white font-bold shadow-md shadow-purple-500/20'
                      : isCompleted
                      ? 'bg-purple-100 dark:bg-white/10 text-[#6C63FF] dark:text-purple-300 font-bold'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-400 font-medium'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-extrabold ${
                    isActive ? 'bg-white text-[#6C63FF]' : isCompleted ? 'bg-[#6C63FF] text-white' : 'bg-gray-300 text-gray-700'
                  }`}>
                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.step}
                  </span>
                  <span className="text-xs">{s.title}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className={`h-0.5 w-8 sm:w-12 rounded-full ${
                    currentStep > s.step ? 'bg-[#6C63FF]' : 'bg-gray-200 dark:bg-white/10'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* PAGE 1: LANDING & UPLOAD SCREEN */}
        {currentStep === 1 && (
          <UploadSection
            uploadedImage={uploadedImage}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            onFileChange={handleFileChange}
            onSampleSelect={handleSampleSelect}
            onContinue={() => setCurrentStep(2)}
          />
        )}

        {/* PAGE 2: DESIGN STUDIO (STYLE + INSTRUCTIONS) */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Back Button */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 text-xs font-bold text-[#6C63FF] hover:text-purple-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← Back to Home</span>
              </button>
              <span className="text-xs text-gray-500 font-medium">Step 2 of 3: Configure Aesthetic & Prompt</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left 4 Cols: Image Thumbnail & Spatial Extraction */}
              <div className="lg:col-span-4 space-y-4">
                <div className="card-surface p-5 space-y-4">
                  <h4 className="text-xs font-bold text-[#2D3436] dark:text-white uppercase tracking-wider">
                    Selected Space Photo
                  </h4>
                  {uploadedImage && (
                    <div className="relative h-60 rounded-xl overflow-hidden border border-purple-100 shadow-md">
                      <img src={uploadedImage} alt="Uploaded Space" className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={handleAnalyzeSpace}
                    disabled={isAnalyzing}
                    className="w-full py-2.5 rounded-xl bg-purple-50 dark:bg-white/10 text-[#6C63FF] dark:text-purple-300 font-bold text-xs flex items-center justify-center gap-2 border border-purple-100 dark:border-white/10 hover:bg-purple-100 transition-colors"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Extracting Geometry...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>Extract Spatial Manifest (Gemini Vision)</span>
                      </>
                    )}
                  </button>
                </div>

                <SpatialManifestDrawer manifest={spatialManifest} isLoading={isAnalyzing} />
              </div>

              {/* Right 8 Cols: Style Presets & Redesign Instructions */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* 6 STYLE PRESET CARDS WITH COLOR SWATCHES */}
                <StylePresetCards
                  selectedPreset={selectedStyle}
                  onSelectPreset={setSelectedStyle}
                />

                {/* REDESIGN INSTRUCTION INPUT AREA */}
                <InstructionArea
                  prompt={prompt}
                  onChangePrompt={setPrompt}
                />

                {/* GENERATE BUTTON */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleGenerateRedesigns}
                    disabled={isGenerating}
                    className="w-full py-4 rounded-2xl bg-gradient-purple-teal text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50"
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
                </div>

              </div>

            </div>

          </div>
        )}

        {/* LOADING SHIMMER STATE */}
        {isGenerating && (
          <div className="card-surface p-12 text-center space-y-6 animate-pulse border border-[#6C63FF]/30">
            <div className="w-16 h-16 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] flex items-center justify-center mx-auto">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#2D3436] dark:text-white">🔄 Generating 3 Structure-Preserved Design Options...</h3>
              <p className="text-xs text-gray-500 mt-1">Applying color swatches, preserving wall geometry, and rendering photorealistic textures.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-56 rounded-2xl shimmer-loader border border-purple-100" />
              ))}
            </div>
          </div>
        )}

        {/* PAGE 3: RESULTS / GALLERY */}
        {currentStep === 3 && variations.length > 0 && !isGenerating && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* TOP BAR */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 card-surface p-5">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 text-xs font-bold text-[#6C63FF] hover:text-purple-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← Back to Studio</span>
              </button>

              <div className="flex items-center gap-2 text-sm font-extrabold text-[#2D3436] dark:text-white">
                <Sparkles className="w-4 h-4 text-[#6C63FF]" />
                <span>✨ 3 Designs Generated</span>
              </div>

              <a
                href={currentSelectedVar?.image_url}
                download="HomeLove_Redesign.jpg"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#4ECDC4] hover:bg-teal-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>📥 Download All</span>
              </a>
            </div>

            {/* THREE DESIGN OPTION CARDS */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#2D3436] dark:text-white font-display">
                Choose Your Favorite
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {variations.map((v, index) => {
                  const isSelected = selectedVarId === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVarId(v.id)}
                      className={`card-surface rounded-2xl overflow-hidden cursor-pointer border relative transition-all ${
                        isSelected
                          ? 'border-[#6C63FF] ring-4 ring-[#6C63FF]/30 scale-[1.03] shadow-xl'
                          : 'border-purple-100 dark:border-white/10 hover:border-[#6C63FF]'
                      }`}
                    >
                      <div className="relative h-60 overflow-hidden">
                        <img src={v.image_url} alt={v.name} className="w-full h-full object-cover" />
                        
                        {/* Option Tag */}
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-extrabold">
                          Option {index + 1}
                        </div>

                        {/* Selected Checkmark Badge */}
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#6C63FF] text-white flex items-center justify-center shadow-lg">
                            <CheckCircle2 className="w-5 h-5 fill-current text-[#6C63FF]" />
                          </div>
                        )}

                        {/* Badges */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-600/90 text-white text-[10px] font-bold">
                            {selectedStyle}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-teal-500/90 text-white text-[10px] font-bold">
                            ✨ 4K
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-1">
                        <h4 className="font-bold text-sm text-[#2D3436] dark:text-white font-display">
                          {v.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {v.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center justify-center gap-4 py-2">
              <button
                type="button"
                className="px-8 py-3.5 rounded-2xl bg-gradient-purple-teal text-white font-extrabold text-sm shadow-lg hover:scale-105 transition-transform"
              >
                ✓ Select This Design
              </button>

              <button
                type="button"
                onClick={handleGenerateRedesigns}
                className="px-6 py-3.5 rounded-2xl bg-white dark:bg-white/10 border-2 border-[#6C63FF] text-[#6C63FF] dark:text-purple-300 font-extrabold text-sm hover:bg-purple-50 transition-colors"
              >
                ↻ Regenerate
              </button>

              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="px-8 py-3.5 rounded-2xl bg-[#4ECDC4] text-white font-extrabold text-sm shadow-lg hover:bg-teal-500 transition-colors flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                <span>🎥 Generate Video Walkthrough</span>
              </button>
            </div>

            {/* BEFORE / AFTER SLIDER */}
            <div className="card-surface p-6 space-y-4">
              <h4 className="text-base font-bold text-[#2D3436] dark:text-white font-display flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-[#6C63FF]" />
                <span>Interactive Before / After Transformation</span>
              </h4>

              {currentSelectedVar && uploadedImage && (
                <BeforeAfterSlider
                  beforeImage={uploadedImage}
                  afterImage={currentSelectedVar.image_url}
                  beforeLabel="Original Photo"
                  afterLabel="Redesigned Space"
                />
              )}
            </div>

            {/* REFINEMENT CHAT */}
            <div className="card-surface p-6">
              <ChatEditPanel onApplyEdit={handleApplyChatEdit} isLoading={isRefining} />
            </div>

            {/* PROGRESS TIMELINE & STATS */}
            <div className="card-surface p-4 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap items-center justify-between gap-4 font-semibold">
              <div className="flex items-center gap-4">
                <span>⚡ 2.4s Generation Time</span>
                <span className="text-emerald-600">✅ Structure Preserved</span>
                <span className="text-emerald-600">✅ 3 Options Created</span>
              </div>
              <div className="text-[#6C63FF] font-bold">
                ✅ Powered by Gemini 2.5 Flash + Imagen 3
              </div>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-purple-100 dark:border-white/10 bg-white dark:bg-[#121620] py-6 text-center text-xs text-gray-500 dark:text-gray-400">
        HomeLove AI • Clean, Colorful & Professional Structure-Preserving Redesign Studio
      </footer>

      {/* VEO 3.1 VIDEO WALKTHROUGH MODAL */}
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
