import React, { useState } from 'react';
import { TabType } from './Navbar';
import { ASSETS } from '../utils/assets';
import { sounds } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import { BloopEmoteStage, BloopEmote } from './BloopEmoteStage';
import { ScrollStory } from './ScrollStory';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Users,
  Compass,
  Play,
  Wrench,
  ChevronDown,
  Music,
  Flashlight,
  Package,
  Trophy,
  Box,
  Heart,
  MessageSquare,
} from 'lucide-react';

interface HomeProps {
  onSelectTab: (tab: TabType) => void;
  onTriggerEasterEgg: () => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectTab, onTriggerEasterEgg }) => {
  const { mode } = useTheme();
  const isNight = mode === 'night';

  const [currentEmote, setCurrentEmote] = useState<BloopEmote>('idle');
  const [bloopSqueakCount, setBloopSqueakCount] = useState(0);

  const handleHeroBloopClick = () => {
    sounds.playSqueak();
    const next = bloopSqueakCount + 1;
    setBloopSqueakCount(next);

    const cycle: BloopEmote[] = ['happy-wave', 'excited-bounce', 'giggle-boing', 'curious-tilt', 'proud-wiggle'];
    setCurrentEmote(cycle[next % cycle.length]);

    if (next >= 3) {
      setBloopSqueakCount(0);
      onTriggerEasterEgg();
    }
  };

  // Tier 3 Legendary Feature Cards
  const tier3Features = [
    {
      id: 'meet3d' as TabType,
      title: 'Meet Bloop in 3D',
      badge: 'Tier 3 · Three.js WebGL',
      description: 'Dedicated WebGL viewport with camera orbit, zoom, PBR studio lighting, and GLTF/GLB model inspection.',
      icon: <Box className="w-5 h-5 text-[#8DBA83]" />,
      actionText: 'Enter 3D Viewport',
      color: 'border-[#8DBA83]',
    },
    {
      id: 'guestbook' as TabType,
      title: 'Leave a Dream for Bloop',
      badge: 'Tier 3 · Live Database',
      description: 'Shared persistent guestbook backed by our live database API with moderation, star themes, and Supabase support.',
      icon: <Heart className="w-5 h-5 text-[#F2B8C6]" />,
      actionText: 'Whisper a Dream',
      color: 'border-[#F2B8C6]',
    },
    {
      id: 'chat' as TabType,
      title: 'Talk to Bloop',
      badge: 'Tier 3 · Conversational Chat',
      description: 'Interactive character chatbot responding as Bloop the Marshmallow Hippo via Gemini AI or rule-based dialogue engine.',
      icon: <MessageSquare className="w-5 h-5 text-[#B9DDF5]" />,
      actionText: 'Start Chatting',
      color: 'border-[#B9DDF5]',
    },
  ];

  // Tier 2 Feature Spotlight Cards
  const tier2Features = [
    {
      id: 'lullaby' as TabType,
      title: 'Bloop’s Lullaby Lab',
      badge: 'Tier 2 · Real Synthesizer',
      description: 'Web Audio music box synthesizer with 3 presets (Marshmallow Moon, Cozy Clover, Twinkle Train), tempo control, and required mute.',
      icon: <Music className="w-5 h-5 text-[#8DBA83]" />,
      actionText: 'Compose & Listen',
      color: 'border-[#8DBA83]',
    },
    {
      id: 'dreamlight' as TabType,
      title: 'Dreamlight Explorer',
      badge: 'Tier 2 · Nightlight Beam',
      description: 'Feathered flashlight beam revealing 6 hidden dream treasures, star-lanterns, and sleeping critters across the moonlit meadow.',
      icon: <Flashlight className="w-5 h-5 text-[#FFE29A]" />,
      actionText: 'Shine Flashlight',
      color: 'border-[#FFE29A]',
    },
    {
      id: 'delivery' as TabType,
      title: 'Dream Delivery Map',
      badge: 'Tier 2 · Scroll Sync Route',
      description: 'Animated SVG route across Cozy Clover Meadow with 5 stops, delivery cart marker, and summit star celebration.',
      icon: <Package className="w-5 h-5 text-[#B9DDF5]" />,
      actionText: 'Follow Delivery Cart',
      color: 'border-[#B9DDF5]',
    },
    {
      id: 'dreamblocks' as TabType,
      title: 'Stack the Dream Blocks',
      badge: 'Tier 2 · Playable Mini-Game',
      description: 'Complete stacking game with 3 difficulty levels, drag-drop or tap placement, move counter, and validation.',
      icon: <Trophy className="w-5 h-5 text-[#F2B8C6]" />,
      actionText: 'Play Stacking Game',
      color: 'border-[#F2B8C6]',
    },
  ];

  const toyPreviewItems = [
    {
      id: 'giggle',
      title: 'Giggle-Block Tower v1.0',
      tagline: 'Plush stacking cubes with musical giggles',
      badge: 'Bestseller',
      color: 'border-[#F2B8C6]',
      icon: '🧱',
    },
    {
      id: 'trampoline',
      title: 'Cloud-Boing Trampoline',
      tagline: 'Dandelion-cotton springy launchpad',
      badge: 'High Bounce',
      color: 'border-[#BDE4C6]',
      icon: '☁️',
    },
    {
      id: 'lantern',
      title: 'Nightlight Melody Lantern',
      tagline: 'Carved acorn star-projector & soft lullaby',
      badge: 'Bedtime Favorite',
      color: 'border-[#FFE29A]',
      icon: '✨',
    },
    {
      id: 'marble',
      title: 'Bouncy-Berry Marble Run',
      tagline: 'Winding bamboo track with tiny felt bells',
      badge: 'Sensory Sound',
      color: 'border-[#D9C8F0]',
      icon: '🫐',
    },
  ];

  return (
    <div className="space-y-16">
      
      {/* SECTION 1: HERO SCENE */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-black/5 dark:border-white/10">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute text-xl opacity-60 animate-float"
              style={{
                top: `${12 + i * 14}%`,
                left: `${8 + i * 16}%`,
                animationDelay: `${i * 1.3}s`,
                animationDuration: `${5 + i * 2}s`,
              }}
            >
              {isNight ? '✦' : '🌾'}
            </div>
          ))}
          <div className="absolute top-10 right-16 text-3xl opacity-50 animate-pulse-soft">
            {isNight ? '🌙' : '🤍'}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Hero Copy & Actions */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
                <span>Meadow Play Lab</span>
                <span aria-hidden="true">·</span>
                <span>Junior Play Engineer</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-balance">
                Tiny Toys. <br />
                Big Giggles. <br />
                <span className="text-[#8DBA83]">One Very Squishy Engineer.</span>
              </h1>

              <p className="text-base sm:text-lg opacity-85 leading-relaxed max-w-xl mx-auto lg:mx-0">
                “Meet Bloop, the little Marshmallow Hippo who turns tiny ideas into wonderfully squeaky, bouncy toys. Welcome to Meadow Play Lab!”
              </p>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/10 border border-[#F2B8C6]/50 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#8DBA83]" />
                <span>Move your pointer or tap Bloop to trigger animated emotes!</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => {
                    onSelectTab('playlab');
                    sounds.playPop();
                  }}
                  className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 rounded-2xl bg-[#8DBA83] text-white font-bold text-sm hover:bg-[#7ba871] shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Bloop’s World</span>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('friends');
                    sounds.playPop();
                  }}
                  className={`w-full sm:w-auto min-h-[48px] px-7 py-3.5 rounded-2xl border font-bold text-sm shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isNight
                      ? 'bg-[#27213C] border-[#4D3F6D] text-[#F3ECF8] hover:bg-[#332B4D]'
                      : 'bg-white border-[#F2B8C6] text-[#493B43] hover:bg-[#F2B8C6]/20'
                  }`}
                >
                  <Users className="w-4 h-4 text-[#8DBA83]" />
                  <span>Meet the Friends</span>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-center lg:justify-start gap-1.5 text-xs opacity-60">
                <span>Scroll down to experience Bloop’s story & Tier 2 features</span>
                <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
              </div>
            </div>

            {/* Right Column: Bloop Emote Stage */}
            <div className="lg:col-span-6 flex justify-center">
              <BloopEmoteStage
                currentEmote={currentEmote}
                onEmoteChange={setCurrentEmote}
                onBloopClick={handleHeroBloopClick}
                isNightMode={isNight}
              />
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: TIER 3 LEGENDARY FEATURE SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <div className="text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
            Tier 3 Legendary Upgrades
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl">
            Meet Bloop in 3D, Chat & Leave Dreams
          </h2>
          <p className="text-sm opacity-75 max-w-xl mx-auto">
            Experience the new Three.js WebGL viewport, chat live with Bloop, and leave your wish in the live persistent guestbook!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {tier3Features.map((feat) => (
            <div
              key={feat.id}
              onClick={() => {
                onSelectTab(feat.id);
                sounds.playPop();
              }}
              className={`p-6 rounded-3xl border-2 ${feat.color} shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group ${
                isNight ? 'bg-[#27213C]' : 'bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF6E8] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-bold text-[#8DBA83] px-2.5 py-1 rounded-full bg-[#8DBA83]/15">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg mb-1">
                  {feat.title}
                </h3>
                <p className="text-xs opacity-75 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs font-bold text-[#8DBA83]">
                <span>{feat.actionText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* SECTION 2B: TIER 2 FEATURE SPOTLIGHT CARDS */}
        <div className="text-center space-y-2 mb-8 pt-4 border-t border-black/5 dark:border-white/10">
          <div className="text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
            Tier 2 Interactive Adventures
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl">
            Musical Lullabies, Nightlight Beam & Dream Delivery
          </h2>
          <p className="text-xs sm:text-sm opacity-75 max-w-xl mx-auto">
            From synthesizing real music-box lullabies to following the delivery cart route across the meadow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tier2Features.map((feat) => (
            <div
              key={feat.id}
              onClick={() => {
                onSelectTab(feat.id);
                sounds.playPop();
              }}
              className={`p-6 rounded-3xl border-2 ${feat.color} shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group ${
                isNight ? 'bg-[#27213C]' : 'bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF6E8] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-bold text-[#8DBA83] px-2.5 py-1 rounded-full bg-[#8DBA83]/15">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg mb-1">
                  {feat.title}
                </h3>
                <p className="text-xs opacity-75 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs font-bold text-[#8DBA83]">
                <span>{feat.actionText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: SCROLL-DRIVEN STORY JOURNEY */}
      <ScrollStory isNightMode={isNight} />

      {/* SECTION 4: INTRODUCTION TO MEADOW PLAY LAB WORKSHOP */}
      <section className="py-12 border-y border-black/5 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 rounded-3xl overflow-hidden border-2 border-[#F2B8C6]/40 shadow-md">
              <img
                src={ASSETS.meadowPlayLab}
                alt="Meadow Play Lab miniature toy workshop with wooden workbenches"
                className="w-full h-auto object-cover aspect-16/9 hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
                Where The Squeaks Begin
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl">
                Welcome to Meadow Play Lab
              </h2>
              <p className="text-sm sm:text-base opacity-85 leading-relaxed">
                Under the weeping willow, Bloop and the crew design handcrafted toys using wooden code boards, colored pegs, and plenty of happy laughter. Every toy is tested for maximum hugs and gentle bounces!
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className={`p-4 rounded-2xl border ${isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-[#FFF6E8] border-[#F2B8C6]/40'}`}>
                  <div className="text-2xl mb-1">🪵</div>
                  <div className="font-bold text-xs">Tactile Peg Coding</div>
                  <div className="text-[11px] opacity-70">Pegs set bounce & sound</div>
                </div>
                <div className={`p-4 rounded-2xl border ${isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-[#FFF6E8] border-[#F2B8C6]/40'}`}>
                  <div className="text-2xl mb-1">🎀</div>
                  <div className="font-bold text-xs">100% Felt & Plush</div>
                  <div className="text-[11px] opacity-70">Safe, gentle materials</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onSelectTab('playlab');
                    sounds.playPop();
                  }}
                  className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#8DBA83] text-white font-bold text-xs hover:bg-[#7ba871] shadow-xs cursor-pointer transition-all"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Enter Play Lab Workspace</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: FOUR TOY INVENTIONS PREVIEWS */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-[#8DBA83] uppercase tracking-wider mb-1">
              Handcrafted Portfolio
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl">
              Featured Toy Inventions
            </h2>
          </div>
          <button
            onClick={() => {
              onSelectTab('playlab');
              sounds.playPop();
            }}
            className={`min-h-[44px] inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-2xl border transition-all cursor-pointer ${
              isNight ? 'bg-[#27213C] border-[#4D3F6D] text-white' : 'bg-white border-[#F2B8C6] text-[#493B43]'
            }`}
          >
            <span>Play All 4 Toys in Sandbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {toyPreviewItems.map((toy) => (
            <div
              key={toy.id}
              onClick={() => {
                onSelectTab('playlab');
                sounds.playPop();
              }}
              className={`p-6 rounded-3xl border-2 ${toy.color} shadow-xs hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group ${
                isNight ? 'bg-[#27213C]' : 'bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF6E8] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {toy.icon}
                  </div>
                  <span className="text-[11px] font-bold opacity-70">
                    {toy.badge}
                  </span>
                </div>
                <h3 className="font-display font-bold text-base mb-1">
                  {toy.title}
                </h3>
                <p className="text-xs opacity-75 leading-relaxed">
                  {toy.tagline}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs font-bold text-[#8DBA83]">
                <span>Try interactive demo</span>
                <Play className="w-3.5 h-3.5 fill-[#8DBA83]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: STORYBOOK TEASER */}
      <section className={`py-16 border-t border-black/5 dark:border-white/10 ${isNight ? 'bg-[#221C35]' : 'bg-white/60'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9C8F0]/40 text-xs font-bold text-[#493B43] dark:text-[#F3ECF8]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Storybook (3 Chapters with Page-Turn)</span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl">
            “The Little Engine That Could Squeak”
          </h2>

          <p className="text-sm sm:text-base opacity-85 leading-relaxed max-w-xl mx-auto">
            When a miniature wooden train loses its wheels on the clover tracks, Bloop and the meadow crew craft soft squeaky cushions and deliver star-lanterns over the hill!
          </p>

          <div>
            <button
              onClick={() => {
                onSelectTab('storybook');
                sounds.playPop();
              }}
              className="min-h-[48px] px-7 py-3.5 rounded-2xl bg-[#D9C8F0] text-[#493B43] font-bold text-sm hover:bg-[#cdb7e9] shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read The Story (3 Chapters)</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
