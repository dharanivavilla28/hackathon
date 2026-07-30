import React, { useState } from 'react';
import { Play, Volume2, X, Sparkles, Loader2 } from './Icons';

interface VideoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  redesignImageUrl: string;
  onGenerateVideo: () => Promise<any>;
}

export const VideoWalkthroughModal: React.FC<VideoWalkthroughModalProps> = ({
  isOpen,
  onClose,
  redesignImageUrl,
  onGenerateVideo
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [selectedCameraMode, setSelectedCameraMode] = useState('slow_pan');

  if (!isOpen) return null;

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setError('');
    try {
      await onGenerateVideo();
    } catch (err: any) {
      setError(err?.message || 'Video walkthrough generation encountered an error.');
    } finally {
      setIsGenerating(false);
    }
  };

  const cameraOptions = [
    { id: 'slow_pan', label: 'Slow Cinematic Pan', desc: '8 seconds, smooth entry perspective' },
    { id: 'quick_entry', label: 'Quick Entry Push-In', desc: '5 seconds, dynamic transition' },
    { id: 'full_walkthrough', label: 'Full Walkthrough', desc: '12 seconds, multiple room angles' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#161A23] rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-100 dark:border-white/10 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#4ECDC4]/10 text-[#4ECDC4] flex items-center justify-center text-2xl font-bold">
            🎥
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#2D3436] dark:text-white font-display">
              Generate Cinematic Walkthrough
            </h3>
            <p className="text-xs text-[#636E72] dark:text-gray-400">
              Selected Design: Option 1
            </p>
          </div>
        </div>

        {/* Video Preview Box (16:9 ratio) */}
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-gray-200 dark:border-white/10 group shadow-inner">
          <img src={redesignImageUrl} alt="Video Preview" className="w-full h-full object-cover opacity-80" />
          
          {/* Play Button Overlay (White circle with Teal background) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handleStartGeneration}
              disabled={isGenerating}
              className="w-16 h-16 rounded-full bg-[#4ECDC4] text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
            >
              <Play className="w-8 h-8 fill-current ml-1" />
            </button>
          </div>

          {/* Bottom Controls Bar */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-mono">
            <span>8s • 1080p • With Audio</span>
            <Volume2 className="w-4 h-4 text-[#4ECDC4]" />
          </div>
        </div>

        {/* Camera Options Radio Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#2D3436] dark:text-white uppercase tracking-wider">
            Select Camera Trajectory:
          </label>
          <div className="space-y-2">
            {cameraOptions.map((opt) => (
              <label
                key={opt.id}
                onClick={() => setSelectedCameraMode(opt.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedCameraMode === opt.id
                    ? 'border-[#4ECDC4] bg-teal-50/40 dark:bg-white/10'
                    : 'border-gray-200 dark:border-white/10 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedCameraMode === opt.id ? 'border-[#4ECDC4] bg-[#4ECDC4]' : 'border-gray-400'
                  }`}>
                    {selectedCameraMode === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-[#2D3436] dark:text-white">{opt.label}</div>
                    <div className="text-[10px] text-gray-500">{opt.desc}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            ⏹️ Cancel
          </button>
          
          <button
            onClick={handleStartGeneration}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-[#4ECDC4] hover:bg-teal-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synthesizing Motion...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>📥 Download Video Walkthrough</span>
              </>
            )}
          </button>
        </div>

        {/* Info Text */}
        <p className="text-[11px] text-gray-500 text-center">
          💡 Powered by Veo 3.1 — 5-10 second cinematic walkthroughs with synchronized audio
        </p>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs">
            {error}
          </div>
        )}

      </div>
    </div>
  );
};

export default VideoWalkthroughModal;
