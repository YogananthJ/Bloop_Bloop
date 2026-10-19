import React, { useState, useRef, useEffect } from 'react';
import { ASSETS } from '../utils/assets';
import { sounds } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import { Flashlight, Sparkles, RotateCcw, Sliders, Eye, Sun, Star } from 'lucide-react';

export const DreamlightExplorer: React.FC = () => {
  const { mode } = useTheme();
  const isNight = mode === 'night';

  const [flashlightEnabled, setFlashlightEnabled] = useState(true);
  const [lightRadius, setLightRadius] = useState(180);
  const [pointerPos, setPointerPos] = useState({ x: 50, y: 50 }); // percentage
  const [discoveredCount, setDiscoveredCount] = useState<number[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Hidden dream treasures to discover in the dark
  const hiddenTreasures = [
    { id: 1, name: 'Star-Lantern', symbol: '🏮', x: 22, y: 35, note: 'Glows with lavender starlight' },
    { id: 2, name: 'Squeaky Plush Block', symbol: '🧱', x: 74, y: 28, note: 'Bloop’s first prototype block' },
    { id: 3, name: 'Marshmallow Flower', symbol: '🌸', x: 38, y: 72, note: 'Soft petals that smell of vanilla' },
    { id: 4, name: 'Sleeping Hedgehog', symbol: '🦔', x: 82, y: 76, note: 'Pip-Squawk taking a cozy nap' },
    { id: 5, name: 'Dream Chime Bell', symbol: '🔔', x: 18, y: 80, note: 'Tuned to high-C' },
    { id: 6, name: 'Silver Moon Cloud', symbol: '☁️', x: 50, y: 20, note: 'Drifting peaceful sleep mist' },
  ];

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!flashlightEnabled || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setPointerPos({ x, y });
    checkDiscoveries(x, y);
  };

  // Touch move handler
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!flashlightEnabled || !containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
    setPointerPos({ x, y });
    checkDiscoveries(x, y);
  };

  const checkDiscoveries = (x: number, y: number) => {
    hiddenTreasures.forEach((t) => {
      if (!discoveredCount.includes(t.id)) {
        // Distance check in percentage coordinates
        const dist = Math.hypot(x - t.x, y - t.y);
        if (dist < (lightRadius / 500) * 45) {
          sounds.playChime(700 + t.id * 80);
          setDiscoveredCount((prev) => [...prev, t.id]);
        }
      }
    });
  };

  const resetExplorer = () => {
    sounds.playPop();
    setPointerPos({ x: 50, y: 50 });
    setDiscoveredCount([]);
  };

  return (
    <div className={`min-h-screen py-12 transition-colors ${isNight ? 'bg-[#151222]' : 'bg-[#FFF6E8]'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
            <Flashlight className="w-4 h-4" />
            <span>Tier 2 Nighttime Feature · Dreamlight Explorer</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
            Dreamlight Explorer
          </h1>
          <p className="text-sm sm:text-base opacity-80 max-w-xl mx-auto">
            Move your pointer or touch the scene to shine Bloop’s nightlight beam across the moonlit meadow and uncover 6 hidden dream treasures!
          </p>
        </div>

        {/* CONTROLS BAR */}
        <div
          className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl border shadow-xs ${
            isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
          }`}
        >
          {/* Flashlight Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setFlashlightEnabled(!flashlightEnabled);
                sounds.playPop();
              }}
              className={`min-h-[44px] px-4 py-2.5 rounded-2xl border-2 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
                flashlightEnabled
                  ? 'border-[#FFE29A] bg-[#FFE29A]/20 text-[#FFE29A] shadow-xs'
                  : 'border-slate-300 opacity-60 text-current'
              }`}
            >
              <Flashlight className="w-4 h-4" />
              <span>{flashlightEnabled ? 'Nightlight Active' : 'Light Off'}</span>
            </button>

            <button
              onClick={resetExplorer}
              className="min-h-[44px] px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-black/5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Scene</span>
            </button>
          </div>

          {/* Beam Size Slider */}
          <div className="flex items-center gap-3 text-xs font-semibold">
            <Sliders className="w-3.5 h-3.5 text-[#8DBA83]" />
            <span>Beam Radius: {lightRadius}px</span>
            <input
              type="range"
              min="100"
              max="280"
              value={lightRadius}
              onChange={(e) => setLightRadius(Number(e.target.value))}
              className="accent-[#8DBA83] cursor-pointer w-28"
            />
          </div>

          {/* Discovery Counter */}
          <div className="text-xs font-bold text-[#8DBA83] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Discovered: {discoveredCount.length} / 6 Treasures</span>
          </div>
        </div>

        {/* THE NIGHTLIGHT STAGE */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative rounded-3xl overflow-hidden border-4 border-[#4D3F6D] shadow-2xl h-[520px] select-none cursor-crosshair bg-[#100D1C]"
          style={{ touchAction: 'none' }}
        >
          {/* Underlayer: Illuminated Vibrant Meadow & Characters */}
          <div className="absolute inset-0">
            <img
              src={ASSETS.cozyCloverMeadow}
              alt="Nighttime Cozy Clover Meadow"
              className="w-full h-full object-cover filter brightness-95 saturate-120"
              referrerPolicy="no-referrer"
            />

            {/* Canonical Bloop sitting happily in the meadow center */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-64 max-w-[50%] pointer-events-none drop-shadow-2xl">
              <img
                src={ASSETS.bloopHero}
                alt="Bloop the Marshmallow Hippo in the meadow"
                className="w-full h-auto object-contain rounded-2xl"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = ASSETS.bloopHeroLocal;
                }}
              />
            </div>

            {/* The 6 Hidden Treasures positioned across the scene */}
            {hiddenTreasures.map((t) => (
              <div
                key={t.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl bg-white/90 text-[#493B43] shadow-lg flex items-center gap-2 border border-[#FFE29A] transition-transform duration-300"
                style={{ top: `${t.y}%`, left: `${t.x}%` }}
              >
                <span className="text-2xl">{t.symbol}</span>
                <div className="text-[10px] font-bold">
                  <div>{t.name}</div>
                  <div className="text-[#8DBA83]">{t.note}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Night Overlay with Feathered Radial Mask */}
          {flashlightEnabled && (
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                backgroundColor: 'rgba(12, 10, 24, 0.94)',
                maskImage: `radial-gradient(circle ${lightRadius}px at ${pointerPos.x}% ${pointerPos.y}%, transparent 0%, transparent 45%, rgba(0,0,0,0.85) 75%, black 100%)`,
                WebkitMaskImage: `radial-gradient(circle ${lightRadius}px at ${pointerPos.x}% ${pointerPos.y}%, transparent 0%, transparent 45%, rgba(0,0,0,0.85) 75%, black 100%)`,
              }}
            />
          )}

          {/* Soft Lantern Glow Ring Follower */}
          {flashlightEnabled && (
            <div
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#FFE29A]/60 shadow-[0_0_50px_rgba(255,230,120,0.5)] transition-all duration-75"
              style={{
                top: `${pointerPos.y}%`,
                left: `${pointerPos.x}%`,
                width: `${lightRadius * 2}px`,
                height: `${lightRadius * 2}px`,
              }}
            />
          )}

          {/* Overlay Helper Text */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/20 flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-[#FFE29A]" />
            <span>Move pointer or touch to shine nightlight</span>
          </div>
        </div>

        {/* Discovery Summary Strip */}
        <div
          className={`p-6 rounded-3xl border shadow-xs space-y-3 ${
            isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
          }`}
        >
          <div className="font-bold text-xs uppercase tracking-wider text-[#8DBA83]">
            Meadow Treasures Log:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {hiddenTreasures.map((t) => {
              const isFound = discoveredCount.includes(t.id);
              return (
                <div
                  key={t.id}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isFound
                      ? 'border-[#FFE29A] bg-[#FFE29A]/20 shadow-xs scale-102 font-bold'
                      : 'border-black/5 dark:border-white/5 opacity-40'
                  }`}
                >
                  <div className="text-2xl mb-1">{t.symbol}</div>
                  <div className="text-xs">{t.name}</div>
                  <div className="text-[10px] text-[#8DBA83]">
                    {isFound ? 'Discovered!' : 'Hidden in Dark'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
