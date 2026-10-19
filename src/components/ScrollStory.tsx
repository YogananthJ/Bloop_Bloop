import React, { useState } from 'react';
import { ASSETS } from '../utils/assets';
import { sounds } from '../utils/audio';
import { BookOpen, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';

interface ScrollStoryProps {
  isNightMode?: boolean;
}

export const ScrollStory: React.FC<ScrollStoryProps> = ({ isNightMode = false }) => {
  const [activeScene, setActiveScene] = useState(0);

  const storyScenes = [
    {
      id: 1,
      title: 'Scene 1 — A Cloudy Little Beginning',
      tagline: 'Born from morning cloud mist and sweet clover',
      narrative:
        '“One little cloud floated over a meadow full of marshmallow flowers. And from that cloud came a very curious little hippo named Bloop.”',
      image: ASSETS.cozyCloverMeadow,
      icon: '☁️',
      color: 'border-[#B9DDF5] bg-[#B9DDF5]/15',
      note: 'The meadow smelled of vanilla and dew drops.',
    },
    {
      id: 2,
      title: 'Scene 2 — Two Colorful Pegs',
      tagline: 'A branch, two pegs, and the first boing',
      narrative:
        '“Bloop wondered what would happen if the pegs went into the branch. Squeak! Boing! A brand-new toy was born.”',
      image: ASSETS.toyProjectsCollection,
      icon: '🪵',
      color: 'border-[#FFE29A] bg-[#FFE29A]/15',
      note: 'An accidental discovery that launched a lifelong passion.',
    },
    {
      id: 3,
      title: 'Scene 3 — Meadow Play Lab',
      tagline: 'Physical debugging and tactile coding',
      narrative:
        '“With every little experiment, Bloop learned something new. A mistake was never the end. It was another idea waiting to happen.”',
      image: ASSETS.meadowPlayLab,
      icon: '🛠️',
      color: 'border-[#BDE4C6] bg-[#BDE4C6]/15',
      note: 'Soft felt gears, wooden mallets, and endless giggles.',
    },
    {
      id: 4,
      title: 'Scene 4 — A Kingdom of Giggles',
      tagline: 'A safe haven for every little creature',
      narrative:
        '“Bloop had a big dream: a world where every little creature could feel welcome, brave, and happy.”',
      image: ASSETS.friendsCrew,
      icon: '🏰',
      color: 'border-[#F2B8C6] bg-[#F2B8C6]/15',
      note: 'No animal feels bored, lonely, or afraid of making mistakes.',
    },
  ];

  return (
    <section className={`py-16 transition-colors ${isNightMode ? 'bg-[#201A30]' : 'bg-[#FFF6E8]'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Scroll-Driven Story</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight">
            “A Little Hippo with a Big Idea”
          </h2>
          <p className="text-sm opacity-80 leading-relaxed">
            Follow Bloop’s journey from a fluffy morning cloud to the founding of Meadow Play Lab.
          </p>

          {/* Stepper Progress Indicator */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {storyScenes.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveScene(idx);
                  sounds.playPop();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer min-h-[36px] ${
                  activeScene === idx
                    ? 'bg-[#8DBA83] text-white shadow-xs scale-105'
                    : isNightMode
                    ? 'bg-[#2A233D] text-[#B8A9C9] hover:bg-[#332B4D]'
                    : 'bg-white text-[#493B43]/70 hover:bg-[#F2B8C6]/20'
                }`}
              >
                <span>{s.icon}</span>
                <span>Scene {s.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Story Scenes Sequence */}
        <div className="space-y-12">
          {storyScenes.map((scene, idx) => {
            const isSelected = activeScene === idx;
            return (
              <div
                key={scene.id}
                onMouseEnter={() => setActiveScene(idx)}
                className={`rounded-3xl border-2 transition-all duration-300 p-6 sm:p-8 ${
                  isSelected
                    ? `${scene.color} shadow-lg ring-2 ring-[#8DBA83]`
                    : isNightMode
                    ? 'bg-[#27213C] border-[#4D3F6D] opacity-85 hover:opacity-100'
                    : 'bg-white border-[#F2B8C6]/40 opacity-90 hover:opacity-100'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left: Illustration Framing */}
                  <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-black/10 shadow-sm relative group">
                    <img
                      src={scene.image}
                      alt={scene.title}
                      className="w-full h-auto object-cover aspect-16/9 max-h-72 transition-transform duration-500 group-hover:scale-102"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-xs font-bold text-[#493B43] shadow-xs">
                      {scene.icon} Scene 0{scene.id}
                    </div>
                  </div>

                  {/* Right: Narrative Prose */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
                        {scene.tagline}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-2xl sm:text-3xl">
                      {scene.title}
                    </h3>

                    <blockquote className="p-4 rounded-2xl bg-white/60 dark:bg-black/20 border-l-4 border-[#8DBA83] text-base sm:text-lg italic font-medium leading-relaxed">
                      {scene.narrative}
                    </blockquote>

                    <p className="text-xs opacity-75">
                      💡 <strong>Meadow Lore:</strong> {scene.note}
                    </p>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          sounds.playChime(500 + idx * 120);
                          setActiveScene((idx + 1) % storyScenes.length);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8DBA83] hover:underline cursor-pointer"
                      >
                        <span>{idx < 3 ? 'Continue to Next Scene' : 'Cycle to Beginning'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
