import React, { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Smooth progress animation
    const progressTimer1 = setTimeout(() => setProgress(55), 350);
    const progressTimer2 = setTimeout(() => setProgress(88), 750);
    const progressTimer3 = setTimeout(() => setProgress(100), 1050);

    // Initiate smooth fade out after initial application preparation
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 1250);

    // Completely unmount after fade transition completes
    const unmountTimer = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 1650);

    return () => {
      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      clearTimeout(progressTimer3);
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading GRANTLY platform"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F8F9FC] transition-opacity duration-400 ease-in-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#635BFF]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Main Centered Brand Card */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-sm w-full">
        {/* Brand Logo with Smooth Entrance */}
        <div className="relative mb-5 transform transition-all duration-500 ease-out animate-in zoom-in-90 fade-in">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#635BFF] via-[#7B4DFF] to-[#8B5CF6] flex items-center justify-center text-white shadow-xl shadow-[#635BFF]/30">
            <GraduationCap className="w-9 h-9 sm:w-11 sm:h-11" />
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#635BFF] to-[#8B5CF6] opacity-30 blur-md -z-10 animate-pulse" />
        </div>

        {/* Brand Name */}
        <div className="flex items-center gap-2 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-[#151827]">
            GRANTLY
          </h1>
          <span className="text-[11px] font-bold uppercase tracking-wider bg-[#635BFF]/10 text-[#635BFF] px-2 py-0.5 rounded-md border border-[#635BFF]/20">
            Intelligence
          </span>
        </div>

        {/* Official Tagline */}
        <p className="text-sm sm:text-base font-semibold text-[#4A5568] tracking-wide mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
          Your Future. Your Opportunities.
        </p>

        {/* Subtle Minimal Loading Indicator */}
        <div className="w-48 sm:w-56 h-1.5 bg-[#E8EAF1] rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#635BFF] to-[#8B5CF6] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-[11px] text-[#8F9AA8] font-medium mt-3 tracking-wider uppercase">
          Initializing Command Center...
        </p>
      </div>
    </div>
  );
};
