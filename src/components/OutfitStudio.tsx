import React, { useState } from 'react';
import { ASSETS } from '../utils/assets';
import { sounds } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Check, Hammer, Search, Moon } from 'lucide-react';

export const OutfitStudio: React.FC = () => {
  const { mode } = useTheme();
  const isNight = mode === 'night';

  const [selectedOutfit, setSelectedOutfit] = useState<'original' | 'engineer' | 'bedtime'>('engineer');
  const [activeTool, setActiveTool] = useState<'hammer' | 'lens' | 'booties' | null>(null);
  const [isInspecting, setIsInspecting] = useState(false);

  const [viewMode, setViewMode] = useState<'tryon' | 'concept'>('tryon');

  const outfits = [
    {
      id: 'engineer' as const,
      name: "The Engineer's Apron",
      subtitle: 'Official Meadow Play Lab Uniform',
      description:
        'Mint-green felt bib-apron with double-stitched cotton thread, a large kangaroo pouch stocked with 5 colored wooden code-pegs, a felt coiled measuring tape, and an emergency squishy squeaker in the lapel.',
      color: 'border-[#8DBA83]',
      tag: 'Workplace Ready',
      conceptImage: ASSETS.outfitEngineer,
      altText: "Handcrafted mint-green felt Engineer's Apron with wooden pegs on cedar workbench",
      accessories: ['Kangaroo Pouch', 'Wooden Code-Pegs', 'Emergency Squeaker', 'Measuring Ribbon'],
    },
    {
      id: 'bedtime' as const,
      name: 'Bedtime Dreamer Outfit',
      subtitle: 'For Counting Clover Sheep & Stargazing',
      description:
        'Light lavender sleep-cap dotted with soft yellow felt stars and a fluffy pom-pom, paired with cozy wool-knitted booties that let out a tiny harmonic squeak with every sleepy waddle.',
      color: 'border-[#D9C8F0]',
      tag: 'Cozy Rest',
      conceptImage: ASSETS.outfitBedtime,
      altText: 'Handcrafted lavender star sleep-cap and knitted booties resting on a twilight bedtime pillow',
      accessories: ['Star Sleep-Cap', 'Squeaky Knitted Booties', 'Feather Bookmark'],
    },
    {
      id: 'original' as const,
      name: 'Canonical Marshmallow Plush',
      subtitle: 'Pure Natural Softness',
      description:
        'Bloop’s original plush coat, handcrafted from sweet morning marshmallow felt with gentle morning clover breeze and pure squishability.',
      color: 'border-[#F2B8C6]',
      tag: 'Natural Form',
      conceptImage: ASSETS.outfitPlush,
      altText: 'Canonical Bloop the Marshmallow Hippo blowing a dandelion clock in a sunlit clover meadow',
      accessories: ['Dandelion Stem', 'Pure Plush Coat', 'Heart Cloud Breeze'],
    },
  ];

  const tools = [
    {
      id: 'hammer' as const,
      name: 'Soft Wooden Hammer',
      role: 'Peg Alignment Mallet',
      description: 'Rounded cedarwood mallet with padded felt head for tapping code-pegs safely into wooden boards without splinters.',
      action: () => sounds.playPop(),
      icon: <Hammer className="w-5 h-5 text-[#8DBA83]" />,
    },
    {
      id: 'lens' as const,
      name: 'Oversized Jelly Magnifying Glass',
      role: 'Texture & Stitch Inspector',
      description: 'Flexible jelly-resin lens that magnifies felt plush fibers and helps detect misaligned toy gears.',
      action: () => {
        sounds.playChime(880);
        setIsInspecting(!isInspecting);
      },
      icon: <Search className="w-5 h-5 text-[#8DBA83]" />,
    },
    {
      id: 'booties' as const,
      name: 'Squeaky Knitted Booties',
      role: 'Harmonic Pacing Footwear',
      description: 'Knitted pastel socks with hidden air-cushion squeakers in the heels that chime with every step.',
      action: () => sounds.playSqueak(),
      icon: <Moon className="w-5 h-5 text-[#8DBA83]" />,
    },
  ];

  return (
    <div className={`min-h-screen py-12 transition-colors ${isNight ? 'bg-[#1C172B]' : 'bg-[#FFF6E8]'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
            <span>Meadow Wardrobe & Tools · Outfit Concepts</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
            Bloop's Outfit Studio
          </h1>
          <p className="text-sm sm:text-base opacity-80 max-w-xl mx-auto">
            Explore Bloop's handcrafted work attire, cozy sleepwear, and specialized soft-engineering tools.
          </p>
        </div>

        {/* MAIN STAGE & CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Character Stage & Concept Viewport */}
          <div className="lg:col-span-6 space-y-4">
            <div
              className={`rounded-3xl overflow-hidden border-4 shadow-xl p-3 relative transition-colors ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-white'
              }`}
            >
              {/* Header Badges & View Switcher */}
              <div className="flex items-center justify-between gap-2 mb-3 px-1">
                <div className="px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1C172B]/90 backdrop-blur-xs border border-[#F2B8C6]/50 shadow-xs text-xs font-bold text-[#493B43] dark:text-[#F3ECF8] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8DBA83]" />
                  <span>
                    {selectedOutfit === 'engineer'
                      ? "The Engineer's Apron"
                      : selectedOutfit === 'bedtime'
                      ? 'Bedtime Dreamer'
                      : 'Original Plush'}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-[#FFF6E8] dark:bg-[#1C172B] p-1 rounded-2xl border border-black/5 dark:border-white/10 text-xs font-bold">
                  <button
                    onClick={() => {
                      setViewMode('tryon');
                      sounds.playPop();
                    }}
                    className={`px-3 py-1 rounded-xl transition-all ${
                      viewMode === 'tryon'
                        ? 'bg-[#8DBA83] text-white shadow-xs'
                        : 'text-[#493B43]/70 dark:text-white/70 hover:text-[#493B43]'
                    }`}
                  >
                    Bloop Try-On
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('concept');
                      sounds.playPop();
                    }}
                    className={`px-3 py-1 rounded-xl transition-all ${
                      viewMode === 'concept'
                        ? 'bg-[#8DBA83] text-white shadow-xs'
                        : 'text-[#493B43]/70 dark:text-white/70 hover:text-[#493B43]'
                    }`}
                  >
                    Concept Art
                  </button>
                </div>
              </div>

              {/* Main Image Viewport */}
              <div className="relative rounded-2xl overflow-hidden bg-[#FFF6E8] aspect-4/3 flex items-center justify-center">
                {viewMode === 'tryon' ? (
                  <>
                    <img
                      src={ASSETS.bloopHero}
                      alt="Bloop the Marshmallow Hippo in Outfit Studio"
                      className="w-full h-full object-cover select-none animate-float-slow"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = ASSETS.bloopHeroLocal;
                      }}
                    />

                    {/* OVERLAY: Engineer's Apron Concept */}
                    {selectedOutfit === 'engineer' && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center animate-in fade-in duration-300">
                        <div className="absolute bottom-[20%] w-[50%] h-[40%] rounded-3xl bg-[#BDE4C6]/30 border-2 border-[#8DBA83]/60 backdrop-blur-[0.5px] shadow-inner flex flex-col justify-end p-2.5">
                          <div className="w-full h-1/2 bg-[#BDE4C6]/70 rounded-2xl border border-[#8DBA83] flex items-center justify-around px-2 shadow-xs">
                            <span className="w-2.5 h-5 bg-[#F2B8C6] rounded-t-sm shadow-xs" title="Pink peg" />
                            <span className="w-2.5 h-5 bg-[#FFE29A] rounded-t-sm shadow-xs" title="Yellow peg" />
                            <span className="w-2.5 h-5 bg-[#8DBA83] rounded-t-sm shadow-xs" title="Mint peg" />
                            <span className="text-[10px]" title="Emergency Squeaker">📢</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* OVERLAY: Bedtime Sleep-Cap Concept */}
                    {selectedOutfit === 'bedtime' && (
                      <div className="absolute inset-0 pointer-events-none animate-in fade-in duration-300">
                        <div className="absolute top-[10%] left-[28%] w-[42%] h-[26%] rounded-t-full rounded-bl-3xl bg-[#D9C8F0]/40 border-2 border-[#b89fe0]/70 backdrop-blur-[0.5px] -rotate-12 flex items-start justify-center pt-1.5">
                          <span className="text-xs">⭐ ✨ ⭐</span>
                        </div>
                        <div className="absolute bottom-[16%] left-[32%] w-[16%] h-[12%] rounded-2xl bg-[#D9C8F0]/70 border border-[#b89fe0] flex items-center justify-center text-[10px]">
                          🧦
                        </div>
                        <div className="absolute bottom-[14%] right-[32%] w-[16%] h-[12%] rounded-2xl bg-[#D9C8F0]/70 border border-[#b89fe0] flex items-center justify-center text-[10px]">
                          🧦
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <img
                    src={outfits.find((o) => o.id === selectedOutfit)?.conceptImage}
                    alt={outfits.find((o) => o.id === selectedOutfit)?.altText}
                    className="w-full h-full object-cover animate-in fade-in duration-300"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                )}

                {isInspecting && (
                  <div
                    className="absolute z-30 w-32 h-32 rounded-full border-4 border-[#8DBA83] bg-white/30 backdrop-blur-[2px] shadow-2xl pointer-events-none flex items-center justify-center"
                    style={{
                      top: '40%',
                      left: '35%',
                      boxShadow: '0 0 0 1000px rgba(0, 0, 0, 0.25)',
                    }}
                  >
                    <div className="text-[10px] bg-white/90 px-2 py-0.5 rounded-full font-bold text-[#493B43]">
                      Plush 2.5x Zoom
                    </div>
                  </div>
                )}
              </div>

              {/* Try-on Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                {outfits.map((outfit) => (
                  <button
                    key={outfit.id}
                    onClick={() => {
                      setSelectedOutfit(outfit.id);
                      sounds.playPop();
                    }}
                    className={`min-h-[44px] p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 active:scale-95 ${
                      selectedOutfit === outfit.id
                        ? 'bg-[#BDE4C6] border-[#8DBA83] text-[#493B43] shadow-xs'
                        : isNight
                        ? 'bg-[#1C172B] border-[#4D3F6D] text-white/80'
                        : 'bg-white border-[#F2B8C6]/40 text-[#493B43]/75'
                    }`}
                  >
                    <span>{outfit.id === 'engineer' ? '🔧 Apron' : outfit.id === 'bedtime' ? '🌙 Bedtime' : '🌸 Plush'}</span>
                    <span className="text-[10px] opacity-70 font-normal">{outfit.tag}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Detailed Product-Style Concept Cards */}
          <div className="lg:col-span-6 space-y-6">
            {outfits
              .filter((o) => o.id === selectedOutfit)
              .map((outfit) => (
                <div
                  key={outfit.id}
                  className={`p-6 sm:p-8 rounded-3xl border-2 shadow-xs space-y-5 ${
                    outfit.color
                  } ${isNight ? 'bg-[#27213C]' : 'bg-white'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
                      {outfit.subtitle}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/70 dark:bg-white/10 text-[11px] font-bold border border-black/5">
                      {outfit.tag}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-2xl">
                    {outfit.name}
                  </h3>

                  {/* Dedicated Concept Image Thumbnail */}
                  <div className="rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm relative group">
                    <img
                      src={outfit.conceptImage}
                      alt={outfit.altText}
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-102 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-xs text-[11px] text-white font-medium flex items-center justify-between">
                      <span>Concept Still-Life Illustration</span>
                      <span className="text-[#FFE29A]">Handcrafted 3D</span>
                    </div>
                  </div>

                  <p className="text-sm opacity-85 leading-relaxed">
                    {outfit.description}
                  </p>

                  <div className="pt-2">
                    <div className="text-xs font-bold mb-2">Included Accessories & Props:</div>
                    <div className="flex flex-wrap gap-2">
                      {outfit.accessories.map((acc, i) => (
                        <div
                          key={i}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 ${
                            isNight ? 'bg-[#1C172B] border-[#4D3F6D]' : 'bg-[#FFF6E8] border-[#F2B8C6]/40'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 text-[#8DBA83]" />
                          <span>{acc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

            {/* Specialized Engineering Tools */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border shadow-xs space-y-4 ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
              }`}
            >
              <div className="text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
                Tactile Tools & Accessories
              </div>
              <h3 className="font-display font-bold text-xl">
                Junior Play Engineer Toolbelt
              </h3>
              <p className="text-xs opacity-75">
                Click any tool below to test its sound and interactive capability!
              </p>

              <div className="space-y-3 pt-1">
                {tools.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setActiveTool(t.id);
                      t.action();
                    }}
                    className={`min-h-[44px] p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 group active:scale-98 ${
                      isNight
                        ? 'bg-[#1C172B] border-[#4D3F6D] hover:border-[#8DBA83]'
                        : 'bg-[#FFF6E8] border-[#F2B8C6]/30 hover:border-[#8DBA83]'
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#27213C] border border-[#F2B8C6]/40 group-hover:scale-110 transition-transform shrink-0">
                      {t.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{t.name}</span>
                        <span className="text-[10px] text-[#8DBA83] font-bold group-hover:underline">
                          Test Tool
                        </span>
                      </div>
                      <div className="text-[11px] opacity-70 mb-1">{t.role}</div>
                      <div className="text-xs opacity-80 leading-relaxed">{t.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
