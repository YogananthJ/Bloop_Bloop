import React, { useState, useEffect, useRef } from 'react';
import { ASSETS } from '../utils/assets';
import { sounds } from '../utils/audio';
import { Sparkles, Heart, HelpCircle, Moon, Music, Smile } from 'lucide-react';

export type BloopEmote = 'idle' | 'happy-wave' | 'curious-tilt' | 'excited-bounce' | 'proud-wiggle' | 'sleepy-nod' | 'giggle-boing';

interface BloopEmoteStageProps {
  currentEmote?: BloopEmote;
  onEmoteChange?: (emote: BloopEmote) => void;
  showEmoteToolbar?: boolean;
  onBloopClick?: () => void;
  className?: string;
  isNightMode?: boolean;
}

export const BloopEmoteStage: React.FC<BloopEmoteStageProps> = ({
  currentEmote: externalEmote,
  onEmoteChange,
  showEmoteToolbar = true,
  onBloopClick,
  className = '',
  isNightMode = false,
}) => {
  const [internalEmote, setInternalEmote] = useState<BloopEmote>('idle');
  const activeEmote = externalEmote || internalEmote;

  // Pointer tracking offset
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const emoteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Floating particles associated with current emote
  const [particles, setParticles] = useState<{ id: number; symbol: string; x: number; y: number }[]>([]);

  const triggerEmote = (emote: BloopEmote) => {
    if (emoteTimeoutRef.current) clearTimeout(emoteTimeoutRef.current);

    setInternalEmote(emote);
    if (onEmoteChange) onEmoteChange(emote);

    // Audio sound for emote
    if (emote === 'happy-wave') {
      sounds.playSqueak();
      spawnParticles('🤍');
    } else if (emote === 'curious-tilt') {
      sounds.playPop();
      spawnParticles('💭');
    } else if (emote === 'excited-bounce') {
      sounds.playBoing();
      spawnParticles('✨');
    } else if (emote === 'proud-wiggle') {
      sounds.playVictory();
      spawnParticles('⭐');
    } else if (emote === 'sleepy-nod') {
      sounds.playChime(440);
      spawnParticles('💤');
    } else if (emote === 'giggle-boing') {
      sounds.playSqueak();
      spawnParticles('🌸');
    }

    // Reset back to idle after animation finishes
    const duration = emote === 'sleepy-nod' ? 2400 : emote === 'curious-tilt' ? 1600 : 1200;
    emoteTimeoutRef.current = setTimeout(() => {
      setInternalEmote('idle');
      if (onEmoteChange) onEmoteChange('idle');
    }, duration);
  };

  const spawnParticles = (symbol: string) => {
    const newItems = [
      { id: Date.now() + 1, symbol, x: 25 + Math.random() * 20, y: 20 + Math.random() * 20 },
      { id: Date.now() + 2, symbol, x: 55 + Math.random() * 20, y: 20 + Math.random() * 20 },
    ];
    setParticles(newItems);
    setTimeout(() => {
      setParticles([]);
    }, 1200);
  };

  // Pointer move handler (desktop)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Small bounded tilt (-8 to +8px)
    const deltaX = Math.max(-10, Math.min(10, (e.clientX - centerX) / 18));
    const deltaY = Math.max(-8, Math.min(8, (e.clientY - centerY) / 18));

    setPointerOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    // Gently return to resting position
    setPointerOffset({ x: 0, y: 0 });
  };

  // Touch tap handler (mobile)
  const handleTouchTap = () => {
    triggerEmote('excited-bounce');
    if (onBloopClick) onBloopClick();
  };

  const handleCardClick = () => {
    if (activeEmote === 'idle') {
      triggerEmote('happy-wave');
    } else if (activeEmote === 'happy-wave') {
      triggerEmote('excited-bounce');
    } else {
      triggerEmote('giggle-boing');
    }
    if (onBloopClick) onBloopClick();
  };

  // CSS class corresponding to active emote
  const getEmoteAnimationClass = () => {
    switch (activeEmote) {
      case 'happy-wave':
        return 'animate-bloop-wave';
      case 'curious-tilt':
        return 'animate-bloop-curious';
      case 'excited-bounce':
        return 'animate-bloop-bounce';
      case 'proud-wiggle':
        return 'animate-bloop-wiggle';
      case 'sleepy-nod':
        return 'animate-bloop-sleepy';
      case 'giggle-boing':
        return 'animate-bloop-giggle';
      case 'idle':
      default:
        return 'animate-bloop-idle';
    }
  };

  const emoteButtons: { id: BloopEmote; label: string; icon: string }[] = [
    { id: 'happy-wave', label: 'Wave', icon: '👋' },
    { id: 'curious-tilt', label: 'Curious', icon: '🧐' },
    { id: 'excited-bounce', label: 'Bounce', icon: '🎈' },
    { id: 'giggle-boing', label: 'Giggle', icon: '🌸' },
    { id: 'proud-wiggle', label: 'Wiggle', icon: '✨' },
    { id: 'sleepy-nod', label: 'Sleepy', icon: '🌙' },
  ];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Bloop Interactive Stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchEnd={handleTouchTap}
        onClick={handleCardClick}
        className="relative group max-w-md sm:max-w-lg w-full cursor-pointer select-none"
        title="Tap or click Bloop to trigger a cheerful emote!"
      >
        {/* Soft Ambient Glow based on Day/Night Mode */}
        <div
          className={`absolute -inset-2 rounded-3xl opacity-60 blur-xl transition-all duration-700 pointer-events-none ${
            isNightMode
              ? 'bg-linear-to-r from-[#FFE29A]/20 via-[#D9C8F0]/30 to-[#B9DDF5]/20'
              : 'bg-linear-to-r from-[#F2B8C6]/40 via-[#FFE29A]/30 to-[#BDE4C6]/40'
          }`}
        />

        {/* Character Card Framing */}
        <div
          className={`relative rounded-3xl overflow-hidden border-4 shadow-xl transition-all duration-300 ease-out ${
            isNightMode
              ? 'bg-[#27213C] border-[#4D3F6D] shadow-purple-950/40'
              : 'bg-white/80 border-white shadow-[#493B43]/10'
          }`}
          style={{
            transform: `translate(${pointerOffset.x}px, ${pointerOffset.y}px) rotate(${pointerOffset.x * 0.15}deg)`,
            transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          {/* Active Emote Overlay Badge */}
          <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-xs backdrop-blur-md transition-all duration-300 border bg-white/90 text-[#493B43] border-[#F2B8C6]/50">
            <span className="animate-spin-slow">
              {activeEmote === 'happy-wave'
                ? '👋'
                : activeEmote === 'curious-tilt'
                ? '🧐'
                : activeEmote === 'excited-bounce'
                ? '🎈'
                : activeEmote === 'proud-wiggle'
                ? '⭐'
                : activeEmote === 'sleepy-nod'
                ? '🌙'
                : activeEmote === 'giggle-boing'
                ? '🌸'
                : '🦛'}
            </span>
            <span className="capitalize">
              {activeEmote === 'idle' ? 'Bloop is cozy' : activeEmote.replace('-', ' ')}
            </span>
          </div>

          {/* Floating Emote Particles */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute z-30 pointer-events-none text-2xl animate-ping"
              style={{ top: `${p.y}%`, left: `${p.x}%` }}
            >
              {p.symbol}
            </div>
          ))}

          {/* The Unchanged Canonical Bloop Image */}
          <div className={`relative ${getEmoteAnimationClass()}`}>
            <img
              src={ASSETS.bloopHero}
              alt="Bloop the Marshmallow Hippo sitting in Cozy Clover Meadow"
              className="w-full h-auto object-cover select-none pointer-events-none"
              referrerPolicy="no-referrer"
              fetchPriority="high"
              loading="eager"
              onError={(e) => {
                (e.target as HTMLImageElement).src = ASSETS.bloopHeroLocal;
              }}
            />
          </div>

          {/* Bottom Card Strip */}
          <div
            className={`p-3.5 border-t flex items-center justify-between backdrop-blur-xs transition-colors ${
              isNightMode
                ? 'bg-[#27213C]/95 border-[#4D3F6D] text-[#F3ECF8]'
                : 'bg-white/90 border-white/60 text-[#493B43]'
            }`}
          >
            <div>
              <div className="font-display font-bold text-xs">Bloop-Bloop</div>
              <div className="text-[11px] opacity-75">Junior Play Engineer</div>
            </div>
            <div className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#8DBA83]/20 text-[#8DBA83] border border-[#8DBA83]/30">
              Tap for Emotes!
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Emote Toolbar */}
      {showEmoteToolbar && (
        <div className="mt-4 w-full max-w-md">
          <div className="text-center mb-2 text-[11px] font-bold uppercase tracking-wider text-[#8DBA83]">
            Choose an Animated Emote:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-white/70 backdrop-blur-xs border border-[#F2B8C6]/30 shadow-xs">
            {emoteButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={(e) => {
                  e.stopPropagation();
                  triggerEmote(btn.id);
                }}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                  activeEmote === btn.id
                    ? 'bg-[#BDE4C6] text-[#493B43] shadow-xs scale-105'
                    : 'bg-transparent text-[#493B43]/80 hover:bg-[#FFF6E8] hover:text-[#493B43]'
                }`}
              >
                <span>{btn.icon}</span>
                <span className="hidden sm:inline">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
