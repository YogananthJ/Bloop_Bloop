import React, { useState, useEffect } from 'react';
import { X, CheckCircle, RotateCcw, Wrench } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({ isOpen, onClose }) => {
  const { mode } = useTheme();
  const isNight = mode === 'night';

  const [isFixed, setIsFixed] = useState(false);
  const [gearRotation, setGearRotation] = useState(45);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFixBug = () => {
    sounds.playPop();
    setGearRotation(0);
    setIsFixed(true);
    sounds.playVictory();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F2B8C6', '#BDE4C6', '#FFE29A', '#B9DDF5'],
      });
    } catch {}
  };

  const handleReset = () => {
    sounds.playPop();
    setIsFixed(false);
    setGearRotation(45);
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="easter-egg-title"
    >
      <div
        className={`relative w-full max-w-md rounded-3xl border-2 shadow-2xl p-6 sm:p-8 text-center overflow-hidden transition-colors ${
          isNight ? 'bg-[#27213C] border-[#4D3F6D] text-[#F3ECF8]' : 'bg-[#FFF6E8] border-[#F2B8C6] text-[#493B43]'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 min-w-[44px] min-h-[44px] p-2.5 rounded-full hover:bg-black/10 transition-colors cursor-pointer flex items-center justify-center"
          aria-label="Close Bloop-Bug celebration"
        >
          <X className="w-5 h-5" />
        </button>

        {!isFixed ? (
          <div>
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#FFE29A] flex items-center justify-center text-4xl shadow-xs animate-bounce-toy">
              🐛
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-[#F2B8C6]/40 text-xs font-bold mb-2">
              Secret Toy Button Activated 3 Times!
            </div>

            {/* Exact Master Prompt Headline */}
            <h3 id="easter-egg-title" className="font-display font-extrabold text-2xl mb-2">
              “Bloop-Bug detected!”
            </h3>

            {/* Exact Master Prompt Message */}
            <p className="text-sm opacity-85 mb-6 leading-relaxed">
              “Oopsie! A tiny toy bug escaped the workshop. Bloop fixed it with one squeaky idea. Every bug is just another chance to learn!”
            </p>

            {/* Interactive Gear Display */}
            <div
              className={`w-32 h-32 mx-auto mb-6 rounded-2xl border flex items-center justify-center relative shadow-inner ${
                isNight ? 'bg-[#1C172B] border-[#4D3F6D]' : 'bg-white/70 border-[#F2B8C6]/50'
              }`}
            >
              <div
                style={{ transform: `rotate(${gearRotation}deg)` }}
                className="w-16 h-16 rounded-full border-4 border-dashed border-[#F2B8C6] bg-[#BDE4C6] flex items-center justify-center transition-transform duration-500 ease-out shadow-sm cursor-pointer"
                onClick={handleFixBug}
                title="Tap to align the gear!"
              >
                <Wrench className="w-6 h-6 text-[#493B43] animate-pulse" />
              </div>
              <span className="absolute bottom-1.5 text-[10px] opacity-60 font-medium">
                Misaligned gear (+45°)
              </span>
            </div>

            <button
              onClick={handleFixBug}
              className="min-h-[48px] w-full py-3.5 px-6 rounded-2xl bg-[#8DBA83] text-white font-bold text-sm hover:bg-[#7ba871] shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Wrench className="w-4 h-4" />
              <span>Fix the Bloop-Bug!</span>
            </button>
          </div>
        ) : (
          <div className="animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#BDE4C6] flex items-center justify-center text-4xl shadow-md">
              🎉
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-[#BDE4C6]/60 text-xs font-bold mb-2">
              Bug Resolved with Joy!
            </div>

            <h3 className="font-display font-extrabold text-2xl mb-2">
              All Squeaky & Fixed!
            </h3>

            <p className="text-sm opacity-85 mb-6 leading-relaxed">
              Hooray! The workshop gear snapped into rhythm. Bloop gives a proud wiggle!
            </p>

            <div
              className={`p-4 rounded-2xl border shadow-xs mb-6 text-left flex items-center gap-3 ${
                isNight ? 'bg-[#1C172B] border-[#4D3F6D]' : 'bg-white border-[#BDE4C6]'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#FFE29A] flex items-center justify-center text-2xl shrink-0">
                ⭐
              </div>
              <div>
                <div className="font-bold text-xs">Junior Play Engineer Star</div>
                <div className="text-[11px] opacity-70">Awarded for curiosity and joyful debugging</div>
              </div>
              <CheckCircle className="w-5 h-5 text-[#8DBA83] ml-auto shrink-0" />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="min-h-[44px] flex-1 py-2.5 px-4 rounded-xl border text-xs font-bold hover:bg-black/5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play Again</span>
              </button>
              <button
                onClick={onClose}
                className="min-h-[44px] flex-1 py-2.5 px-4 rounded-xl bg-[#F2B8C6] text-xs font-bold text-[#493B43] hover:bg-[#E89EAE] transition-all cursor-pointer"
              >
                Keep Exploring!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
