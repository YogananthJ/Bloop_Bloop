import React, { useState } from 'react';
import { ASSETS } from '../utils/assets';
import { sounds } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Heart, Wrench, Award, CheckCircle } from 'lucide-react';

interface AboutProps {
  onTriggerEasterEgg: () => void;
}

export const About: React.FC<AboutProps> = ({ onTriggerEasterEgg }) => {
  const { mode } = useTheme();
  const isNight = mode === 'night';

  const [bellyBoings, setBellyBoings] = useState(0);
  const [activePeg, setActivePeg] = useState<number | null>(null);

  const woodenPegs = [
    { id: 1, color: 'bg-[#F2B8C6]', label: 'Pink Squeak', note: 523.25 },
    { id: 2, color: 'bg-[#FFE29A]', label: 'Yellow Boing', note: 659.25 },
    { id: 3, color: 'bg-[#BDE4C6]', label: 'Mint Roll', note: 783.99 },
    { id: 4, color: 'bg-[#B9DDF5]', label: 'Sky Chime', note: 880.00 },
    { id: 5, color: 'bg-[#D9C8F0]', label: 'Lavender Melody', note: 1046.50 },
  ];

  const handlePegClick = (peg: typeof woodenPegs[0]) => {
    setActivePeg(peg.id);
    sounds.playChime(peg.note);
    setTimeout(() => setActivePeg(null), 300);
  };

  const handleBellySqueak = () => {
    sounds.playSqueak();
    setBellyBoings((prev) => prev + 1);
    if (bellyBoings + 1 >= 3) {
      onTriggerEasterEgg();
    }
  };

  const originMilestones = [
    {
      chapter: '01',
      title: 'A Cloud and a Marshmallow Flower',
      description:
        'Born in the heart of Cozy Clover Meadow when a gentle puffy morning cloud drifted too close to a sweet marshmallow flower patch. Bloop emerged with a plush felt coat and an insatiable curiosity.',
      badge: 'Birth of Bloop',
      icon: '☁️',
    },
    {
      chapter: '02',
      title: 'Baby Animals in Need of Giggles',
      description:
        'Wandering through clover paths, Bloop found baby hedgehogs and timid ducklings looking for joyful ways to learn, move, and share smiles without any scary rules.',
      badge: 'The Mission',
      icon: '🐣',
    },
    {
      chapter: '03',
      title: 'The World’s First Squeaky Bouncy-Block',
      description:
        'Bloop picked up two oversized wooden pegs and snapped them into a fallen tree branch. By pure squishy accident, it bounced three feet high and let out a happy squeak!',
      badge: 'Accidental Genius',
      icon: '🪵',
    },
    {
      chapter: '04',
      title: 'The Ultimate Play Kingdom',
      description:
        'Today, Bloop works alongside the Meadow Developer Crew to build a magical kingdom where no animal feels bored, lonely, or afraid of making mistakes.',
      badge: 'Present Day',
      icon: '🏰',
    },
  ];

  return (
    <div className={`min-h-screen py-12 transition-colors ${isNight ? 'bg-[#1C172B]' : 'bg-[#FFF6E8]'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Official Character Dossier · Meadow Play Lab</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
            Meet Bloop the Marshmallow Hippo
          </h1>
          <p className="text-base sm:text-lg opacity-80 italic max-w-xl mx-auto">
            “If it squeaks, bounces, or makes you laugh, Bloop built it!”
          </p>
        </div>

        {/* 5 DOSSIER FIELDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Canonical Character Portrait Card */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className={`rounded-3xl overflow-hidden border-4 shadow-lg p-2 transition-colors ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-white'
              }`}
            >
              <img
                src={ASSETS.bloopHero}
                alt="Bloop the Marshmallow Hippo official dossier portrait"
                className="w-full h-auto rounded-2xl object-cover aspect-4/3"
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = ASSETS.bloopHeroLocal;
                }}
              />
              <div className="p-4 text-center">
                <button
                  onClick={handleBellySqueak}
                  className="min-h-[44px] w-full py-3 px-4 rounded-2xl bg-[#F2B8C6] hover:bg-[#E89EAE] text-[#493B43] font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Squeak Bloop's Belly ({bellyBoings} squeaks)</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Sheet */}
            <div
              className={`p-6 rounded-3xl border shadow-xs space-y-3 transition-colors ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
              }`}
            >
              <div className="text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
                Key Vital Records
              </div>
              <div className="divide-y divide-black/5 dark:divide-white/10 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="opacity-70 font-medium">Full Name</span>
                  <span className="font-bold">Bloop (Bloop-Bloop)</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="opacity-70 font-medium">Species</span>
                  <span className="font-bold">Marshmallow Hippo</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="opacity-70 font-medium">Current Role</span>
                  <span className="font-bold">Junior Play Engineer</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="opacity-70 font-medium">Workplace</span>
                  <span className="font-bold">Meadow Play Lab</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="opacity-70 font-medium">Favorite Squeak Tone</span>
                  <span className="font-bold text-[#8DBA83]">High-C Boing (523 Hz)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dossier Tabs / Detailed Specs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Field 1: Name */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border shadow-xs space-y-2 transition-colors ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#8DBA83] uppercase">
                <Award className="w-4 h-4" />
                <span>1. Official Name & Identity</span>
              </div>
              <h3 className="font-display font-bold text-2xl">
                Bloop, affectionately called “Bloop-Bloop”
              </h3>
              <p className="text-xs sm:text-sm opacity-85 leading-relaxed">
                Known across Cozy Clover Meadow by little critters as “Bloop-Bloop.” Whenever he waddles through the clover patch, his paws make a soft <em>pat-pat</em> and his belly emits a merry harmonic whistle!
              </p>
            </div>

            {/* Field 2: What Bloop Is */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border shadow-xs space-y-3 transition-colors ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#8DBA83] uppercase">
                <Heart className="w-4 h-4 text-[#F2B8C6]" />
                <span>2. What Bloop Is & Personality</span>
              </div>
              <h3 className="font-display font-bold text-2xl">
                Pastel-Pink Marshmallow Hippo
              </h3>
              <p className="text-xs sm:text-sm opacity-85 leading-relaxed">
                A pastel-pink Marshmallow Hippo with a plush-soft, rounded body, sparkling dark eyes, tiny rounded ears, stubby paws, and a musical squeak-boing belly that resonates when hugged.
              </p>
              
              <div className="pt-2">
                <div className="text-xs font-bold mb-2">Personality Traits:</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    'Curious & Observant',
                    'Gentle & Warm',
                    'Easily Delighted',
                    'Slightly Clumsy',
                    'Deeply Caring',
                    'Enthusiastic Builder',
                    'Persistent Debugger',
                  ].map((trait, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 rounded-full border font-medium ${
                        isNight ? 'bg-[#1C172B] border-[#4D3F6D]' : 'bg-[#FFF6E8] border-[#F2B8C6]/50'
                      }`}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Field 3: What Bloop Does & Talents */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border shadow-xs space-y-4 transition-colors ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#8DBA83] uppercase">
                <Wrench className="w-4 h-4" />
                <span>3. Profession, Talents & Hobbies</span>
              </div>
              <h3 className="font-display font-bold text-2xl">
                Junior Play Engineer & Toy Developer
              </h3>
              <p className="text-xs sm:text-sm opacity-85 leading-relaxed">
                Bloop specializes in <strong>Physical Debugging & Tactile Coding</strong>. Rather than typing on keyboards, Bloop uses a <strong>Wooden Code Board</strong> with colored wooden pegs to determine how handcrafted toys bounce, roll, squeak, and play melodies!
              </p>

              {/* Interactive Wooden Code Board Simulation */}
              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  isNight ? 'bg-[#1C172B] border-[#4D3F6D]' : 'bg-[#FFF6E8] border-[#FFE29A]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Interactive Wooden Code Board</span>
                  <span className="text-[11px] opacity-70 font-normal">Tap pegs to test frequencies</span>
                </div>
                <div className="flex items-center justify-center gap-3 py-2">
                  {woodenPegs.map((peg) => (
                    <button
                      key={peg.id}
                      onClick={() => handlePegClick(peg)}
                      title={`Tap ${peg.label}`}
                      className={`min-h-[56px] w-12 rounded-t-xl rounded-b-md ${peg.color} border-2 border-white shadow-sm flex flex-col items-center justify-between py-1 transition-all cursor-pointer ${
                        activePeg === peg.id ? '-translate-y-2 shadow-md ring-2 ring-[#8DBA83]' : 'hover:-translate-y-1'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-white/70" />
                      <span className="text-[10px] font-bold text-[#493B43]">{peg.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1 text-xs opacity-85">
                <strong>Bloop's Hobbies:</strong> Collecting tickly feathers, testing soft foam mats for maximum squishiness, and catching morning bubbles on his snout.
              </div>
            </div>

            {/* Field 5: Official Tagline Card */}
            <div className="p-6 rounded-3xl bg-[#BDE4C6]/30 border-2 border-[#BDE4C6] shadow-xs text-center space-y-1">
              <div className="text-[11px] font-bold text-[#8DBA83] uppercase tracking-wider">
                Official Credo & Tagline
              </div>
              <div className="font-display font-extrabold text-xl sm:text-2xl text-[#493B43]">
                “If it squeaks, bounces, or makes you laugh, Bloop built it!”
              </div>
            </div>

          </div>
        </div>

        {/* Field 4: Origin Story Timeline */}
        <div className="space-y-8 pt-8 border-t border-black/5 dark:border-white/10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
              4. The Illustrated Origin Story
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl">
              How Bloop Became a Toy Engineer
            </h2>
            <p className="text-xs sm:text-sm opacity-75">
              From a sweet marshmallow flower patch to the ultimate Play Kingdom
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {originMilestones.map((m, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border shadow-xs relative flex flex-col justify-between hover:shadow-md transition-all ${
                  isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF6E8] flex items-center justify-center text-2xl border border-[#F2B8C6]/30 shadow-xs">
                      {m.icon}
                    </div>
                    <span className="font-display font-extrabold text-sm text-[#8DBA83]">
                      Ch. {m.chapter}
                    </span>
                  </div>

                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">
                    {m.badge}
                  </div>

                  <h3 className="font-display font-bold text-base mb-2">
                    {m.title}
                  </h3>

                  <p className="text-xs opacity-80 leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 flex items-center gap-1.5 text-[11px] font-semibold text-[#8DBA83]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Canonical Meadow Lore</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
