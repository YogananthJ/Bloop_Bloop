import React, { useState, useEffect, useRef } from 'react';
import { ASSETS } from '../utils/assets';
import { sounds } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import { MapPin, Sparkles, ChevronRight, CheckCircle2, RotateCcw, Package } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DeliveryStop {
  id: number;
  name: string;
  tagline: string;
  description: string;
  packageType: string;
  icon: string;
  x: number; // percentage in SVG coordinate space
  y: number;
}

export const DreamDeliveryMap: React.FC = () => {
  const { mode } = useTheme();
  const isNight = mode === 'night';

  const [currentStopIndex, setCurrentStopIndex] = useState<number>(0);
  const [routeProgress, setRouteProgress] = useState<number>(0); // 0 to 1
  const [completedRoute, setCompletedRoute] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const stops: DeliveryStop[] = [
    {
      id: 1,
      name: 'Meadow Play Lab',
      tagline: 'Start of the delivery route',
      description: 'Bloop stocks the delivery cart with fresh squeaky blocks, wound-up chime trains, and soft wool ribbons.',
      packageType: '4 Handcrafted Toy Prototypes',
      icon: '🛠️',
      x: 10,
      y: 75,
    },
    {
      id: 2,
      name: 'Marshmallow Flower Patch',
      tagline: 'First package drop-off',
      description: 'A baby duckling receives a pair of mismatched knitted booties that squeak with every joyful waddle.',
      packageType: 'Squeaky Knitted Booties',
      icon: '🌸',
      x: 30,
      y: 35,
    },
    {
      id: 3,
      name: 'Moonbeam Pond',
      tagline: 'Lantern delivery by the water',
      description: 'Luna the bunny receives a glowing acorn lantern to reflect soft stars across the calm nighttime ripples.',
      packageType: 'Nightlight Melody Lantern',
      icon: '🌊',
      x: 52,
      y: 65,
    },
    {
      id: 4,
      name: 'Sleepy Hedgehog Hollow',
      tagline: 'Cozy bedtime toy drop-off',
      description: 'Pip-Squawk curls up under dried honeysuckle vines with a miniature thistle-down cushion for gentle dreams.',
      packageType: 'Cloud-Boing Plush Mat',
      icon: '🦔',
      x: 74,
      y: 28,
    },
    {
      id: 5,
      name: 'Dreamlight Hill',
      tagline: 'Final summit delivery',
      description: 'Mama Willow and Bloop release star-lanterns into the night sky, illuminating all of Cozy Clover Meadow!',
      packageType: 'Meadow Star Constellation',
      icon: '⭐',
      x: 92,
      y: 60,
    },
  ];

  // Scroll synchronization observer
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress while this section is within view
      const start = rect.top;
      const total = rect.height + windowHeight;
      const current = windowHeight - start;
      const rawProgress = Math.max(0, Math.min(1, current / total));

      // Calculate stop index (0 to 4)
      const stopIdx = Math.min(4, Math.floor(rawProgress * 5));
      setRouteProgress(rawProgress);
      setCurrentStopIndex(stopIdx);

      if (rawProgress >= 0.95 && !completedRoute) {
        setCompletedRoute(true);
        sounds.playVictory();
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#F2B8C6', '#FFE29A', '#BDE4C6', '#B9DDF5'],
          });
        } catch {}
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [completedRoute]);

  const selectStop = (idx: number) => {
    sounds.playPop();
    setCurrentStopIndex(idx);
    setRouteProgress(idx / (stops.length - 1));
    sounds.playChime(500 + idx * 110);

    if (idx === stops.length - 1 && !completedRoute) {
      setCompletedRoute(true);
      sounds.playVictory();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F2B8C6', '#FFE29A', '#BDE4C6', '#B9DDF5'],
        });
      } catch {}
    }
  };

  const currentStop = stops[currentStopIndex];

  // Calculate delivery cart marker position along the route
  const currentX = stops[currentStopIndex].x;
  const currentY = stops[currentStopIndex].y;

  return (
    <div
      ref={containerRef}
      className={`min-h-screen py-12 transition-colors ${isNight ? 'bg-[#1C172B]' : 'bg-[#FFF6E8]'}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
            <Package className="w-4 h-4" />
            <span>Tier 2 Feature · Scroll-Synchronized Story Map</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
            Dream Delivery Journey
          </h1>
          <p className="text-sm sm:text-base opacity-80 max-w-xl mx-auto">
            Scroll or tap the stops to follow Bloop’s delivery cart across Cozy Clover Meadow as five magical toy packages arrive at bedtime nests.
          </p>
        </div>

        {/* PROGRESS INDICATOR & STEPPER BUTTONS */}
        <div
          className={`p-4 rounded-3xl border shadow-xs flex flex-wrap items-center justify-between gap-3 ${
            isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            {stops.map((stop, idx) => (
              <button
                key={stop.id}
                onClick={() => selectStop(idx)}
                className={`min-h-[44px] px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentStopIndex === idx
                    ? 'bg-[#8DBA83] text-white shadow-xs scale-105'
                    : 'bg-black/5 dark:bg-white/10 hover:bg-[#8DBA83]/20'
                }`}
              >
                <span>{stop.icon}</span>
                <span>Stop {stop.id}</span>
              </button>
            ))}
          </div>

          <div className="text-xs font-bold text-[#8DBA83] flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Route Progress: {Math.round(routeProgress * 100)}%</span>
          </div>
        </div>

        {/* ILLUSTRATED STORY MAP CANVAS */}
        <div className="relative rounded-3xl overflow-hidden border-4 border-[#F2B8C6]/40 shadow-2xl h-[480px] bg-[#221c38]">
          <img
            src={ASSETS.cozyCloverMeadow}
            alt="Meadow Map Landscape"
            className="w-full h-full object-cover opacity-60 filter brightness-90"
            referrerPolicy="no-referrer"
          />

          {/* SVG Winding Route Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Background path line */}
            <path
              d="M 10 75 Q 20 50, 30 35 T 52 65 T 74 28 T 92 60"
              fill="none"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="1.8"
              strokeDasharray="2, 2"
            />
            {/* Animated active path line */}
            <path
              d="M 10 75 Q 20 50, 30 35 T 52 65 T 74 28 T 92 60"
              fill="none"
              stroke="#FFE29A"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{
                strokeDasharray: 200,
                strokeDashoffset: 200 * (1 - routeProgress),
                transition: 'stroke-dashoffset 0.4s ease-out',
              }}
            />
          </svg>

          {/* 5 Location Stop Markers */}
          {stops.map((stop, idx) => {
            const isPassed = idx <= currentStopIndex;
            const isCurrent = idx === currentStopIndex;
            return (
              <div
                key={stop.id}
                onClick={() => selectStop(idx)}
                title={`${stop.name}: ${stop.tagline}`}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 ${
                  isCurrent ? 'scale-125 z-20' : 'hover:scale-110'
                }`}
                style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg border-2 ${
                    isCurrent
                      ? 'bg-[#FFE29A] border-white ring-4 ring-[#8DBA83]'
                      : isPassed
                      ? 'bg-[#BDE4C6] border-white text-white'
                      : 'bg-white/80 border-slate-300'
                  }`}
                >
                  {stop.icon}
                </div>
                <div className="mt-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-[10px] font-bold text-white text-center whitespace-nowrap shadow-xs">
                  {stop.name}
                </div>
              </div>
            );
          })}

          {/* Bloop Delivery Marker moving along the route */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-500 ease-out pointer-events-none drop-shadow-xl"
            style={{ left: `${currentX}%`, top: `${currentY - 9}%` }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/95 border-2 border-[#8DBA83] p-1 shadow-2xl flex items-center justify-center animate-bounce-toy">
              <img
                src={ASSETS.bloopHero}
                alt="Bloop on delivery"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-[10px] bg-[#8DBA83] text-white font-extrabold px-2 py-0.5 rounded-full text-center mt-0.5 shadow-xs whitespace-nowrap">
              📦 Bloop Delivering
            </div>
          </div>
        </div>

        {/* ACTIVE STOP DOSSIER CARD */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border-2 border-[#8DBA83] shadow-xl space-y-4 ${
            isNight ? 'bg-[#27213C]' : 'bg-white'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/10 pb-3">
            <div>
              <div className="text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
                Stop {currentStop.id} of 5 · {currentStop.tagline}
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl mt-0.5">
                {currentStop.name}
              </h2>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-[#FFE29A]/30 border border-[#FFE29A] text-xs font-bold text-[#493B43] dark:text-[#FFE29A] self-start sm:self-auto flex items-center gap-1.5">
              <span>🎁 Delivering: {currentStop.packageType}</span>
            </div>
          </div>

          <p className="text-sm sm:text-base opacity-90 leading-relaxed">
            {currentStop.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => selectStop((currentStopIndex + 1) % stops.length)}
              className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-[#8DBA83] text-white font-bold text-xs hover:bg-[#7ba871] shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>{currentStopIndex === stops.length - 1 ? 'Restart Delivery Route' : 'Advance to Next Stop'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {completedRoute && (
              <div className="text-xs font-bold text-[#8DBA83] flex items-center gap-1.5 animate-in zoom-in-95">
                <CheckCircle2 className="w-4 h-4 text-[#8DBA83]" />
                <span>All 5 Dream Deliveries Complete! Sweet Dreams, Meadow!</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
