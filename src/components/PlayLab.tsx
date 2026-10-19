import React, { useState } from 'react';
import { ASSETS } from '../utils/assets';
import { sounds } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Play, RotateCcw, Volume2, VolumeX, CheckCircle, Wrench, Bug } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PlayLabProps {
  onTriggerEasterEgg: () => void;
}

export const PlayLab: React.FC<PlayLabProps> = ({ onTriggerEasterEgg }) => {
  const { mode } = useTheme();
  const isNight = mode === 'night';

  const [activeToyTab, setActiveToyTab] = useState<number>(1);
  const [easterEggClicks, setEasterEggClicks] = useState<number>(0);

  // Easter Egg button click tracker
  const handleEasterEggTriggerClick = () => {
    sounds.playPop();
    const next = easterEggClicks + 1;
    setEasterEggClicks(next);
    if (next >= 3) {
      setEasterEggClicks(0);
      onTriggerEasterEgg();
    }
  };

  // -------------------------------------------------------------
  // TOY 1: GIGGLE-BLOCK TOWER STATE
  // -------------------------------------------------------------
  const blockTypes = [
    { id: 1, name: 'Plush Foundation Block', color: 'bg-[#F2B8C6]', face: '😊', note: 440 },
    { id: 2, name: 'Sunshine Giggle Block', color: 'bg-[#FFE29A]', face: '😄', note: 523.25 },
    { id: 3, name: 'Meadow Mint Wink Block', color: 'bg-[#BDE4C6]', face: '😉', note: 659.25 },
    { id: 4, name: 'Star-Crown Cap Block', color: 'bg-[#D9C8F0]', face: '⭐', note: 783.99 },
  ];
  const [stackedBlocks, setStackedBlocks] = useState<number[]>([]);
  const [towerComplete, setTowerComplete] = useState(false);

  const handleAddBlock = (id: number) => {
    if (stackedBlocks.includes(id)) return;
    const block = blockTypes.find((b) => b.id === id);
    if (block) sounds.playChime(block.note);

    const next = [...stackedBlocks, id];
    setStackedBlocks(next);

    if (next.length === blockTypes.length) {
      setTowerComplete(true);
      sounds.playVictory();
      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#F2B8C6', '#FFE29A', '#BDE4C6', '#D9C8F0'],
        });
      } catch {}
    }
  };

  const handleResetTower = () => {
    sounds.playPop();
    setStackedBlocks([]);
    setTowerComplete(false);
  };

  // -------------------------------------------------------------
  // TOY 2: CLOUD-BOING TRAMPOLINE STATE
  // -------------------------------------------------------------
  const [trampolineOffset, setTrampolineOffset] = useState(0);
  const [starHeight, setStarHeight] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);

  const triggerTrampolineBounce = (power: number = 100) => {
    if (isBouncing) return;
    setIsBouncing(true);
    sounds.playBoing();

    setTrampolineOffset(22);
    setTimeout(() => {
      setTrampolineOffset(-12);
      setStarHeight(power);

      setTimeout(() => setTrampolineOffset(0), 200);

      setTimeout(() => {
        setStarHeight(0);
        sounds.playPop();
        setIsBouncing(false);
      }, 700);
    }, 150);
  };

  // -------------------------------------------------------------
  // TOY 3: NIGHTLIGHT MELODY LANTERN STATE
  // -------------------------------------------------------------
  const [lanternOn, setLanternOn] = useState(false);
  const [lanternAudioMuted, setLanternAudioMuted] = useState(false);

  const toggleLantern = () => {
    const next = !lanternOn;
    setLanternOn(next);
    sounds.playPop();
    if (next && !lanternAudioMuted) {
      sounds.playChime(784);
    }
  };

  // -------------------------------------------------------------
  // TOY 4: BOUNCY-BERRY MARBLE RUN STATE
  // -------------------------------------------------------------
  const [berryActive, setBerryActive] = useState(false);
  const [activeBell, setActiveBell] = useState<number | null>(null);
  const [collectedBerries, setCollectedBerries] = useState(0);

  const dropBerry = () => {
    if (berryActive) return;
    setBerryActive(true);
    sounds.playPop();

    const bells = [
      { delay: 350, note: 523.25, bellId: 1 },
      { delay: 800, note: 659.25, bellId: 2 },
      { delay: 1300, note: 783.99, bellId: 3 },
      { delay: 1800, note: 1046.50, bellId: 4 },
    ];

    bells.forEach((b) => {
      setTimeout(() => {
        sounds.playChime(b.note);
        setActiveBell(b.bellId);
        setTimeout(() => setActiveBell(null), 300);
      }, b.delay);
    });

    setTimeout(() => {
      sounds.playBoing();
      setCollectedBerries((prev) => prev + 1);
      setBerryActive(false);
    }, 2300);
  };

  const projectCards = [
    {
      id: 1,
      name: 'Giggle-Block Tower v1.0',
      label: 'Interactive Prototype',
      description: 'A colorful tower of plush felt blocks engineered to make a delightful harmonic squeak when stacked in perfect balance.',
      color: 'border-[#F2B8C6]',
      icon: '🧱',
    },
    {
      id: 2,
      name: 'Cloud-Boing Trampoline',
      label: 'Kinetic Experiment',
      description: 'A soft, bouncy mat woven from thistle down and clover dandelion-cotton, with variable launch heights.',
      color: 'border-[#BDE4C6]',
      icon: '☁️',
    },
    {
      id: 3,
      name: 'Nightlight Melody Lantern',
      label: 'Sensory Bedtime Dream',
      description: 'A cozy carved cedar acorn lamp that illuminates peaceful constellations while chiming sweet lullaby notes.',
      color: 'border-[#FFE29A]',
      icon: '✨',
    },
    {
      id: 4,
      name: 'Bouncy-Berry Marble Run',
      label: 'Acoustic Track',
      description: 'A winding bamboo shoot chute where ripe meadow berries roll through four tuned felt bells into a cedar basin.',
      color: 'border-[#D9C8F0]',
      icon: '🫐',
    },
  ];

  return (
    <div className={`min-h-screen py-12 transition-colors ${isNight ? 'bg-[#1C172B]' : 'bg-[#FFF6E8]'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
            <Wrench className="w-4 h-4" />
            <span>Meadow Play Lab · Physical Prototyping</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
            Play Lab Toy Projects
          </h1>
          <p className="text-sm sm:text-base opacity-80 max-w-xl mx-auto">
            Test Bloop's four official fictional toy inventions. Real interactive sandboxes built with squishy care!
          </p>
        </div>

        {/* WORKSHOP BANNER & SECRET EASTER EGG TOY BUTTON */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#F2B8C6]/40 shadow-md">
          <img
            src={ASSETS.meadowPlayLab}
            alt="Meadow Play Lab miniature toy workshop with wooden workbenches"
            className="w-full h-auto object-cover max-h-80"
            referrerPolicy="no-referrer"
          />
          {/* Secret Easter Egg Trigger Tool Button */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={handleEasterEggTriggerClick}
              title="A curious little workshop button... wonder what happens if tapped?"
              className={`min-w-[44px] min-h-[44px] p-2.5 rounded-2xl border-2 backdrop-blur-md shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                isNight
                  ? 'bg-[#27213C]/90 border-[#FFE29A] text-[#FFE29A]'
                  : 'bg-white/90 border-[#F2B8C6] text-[#493B43]'
              }`}
            >
              <Bug className="w-4 h-4 text-[#8DBA83]" />
              <span className="text-xs font-bold">
                Toy Squeaker ({easterEggClicks}/3)
              </span>
            </button>
          </div>

          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-white/85 backdrop-blur-xs text-xs font-bold text-[#493B43] flex items-center justify-between">
            <span>Meadow Play Lab Workbench #1</span>
            <span className="text-[#8DBA83] font-semibold">Active Inventions: 4 Prototypes</span>
          </div>
        </div>

        {/* 4 PROJECT CARDS WITH 'TEST IN SANDBOX' */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projectCards.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                setActiveToyTab(project.id);
                sounds.playPop();
              }}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                project.color
              } ${
                activeToyTab === project.id
                  ? 'ring-2 ring-[#8DBA83] shadow-md scale-102'
                  : 'shadow-xs hover:shadow-md'
              } ${isNight ? 'bg-[#27213C]' : 'bg-white'}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF6E8] flex items-center justify-center text-2xl shadow-xs">
                    {project.icon}
                  </div>
                  <span className="text-[10px] font-bold text-[#8DBA83] px-2.5 py-1 rounded-full bg-[#8DBA83]/15">
                    {project.label}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg mb-1">
                  {project.name}
                </h3>
                <p className="text-xs opacity-75 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-bold text-[#8DBA83]">
                <span>{activeToyTab === project.id ? 'Active in Sandbox' : 'Switch to this Toy'}</span>
                <Play className="w-3.5 h-3.5 fill-[#8DBA83]" />
              </div>
            </div>
          ))}
        </div>

        {/* INTERACTIVE WORKBENCH STAGE */}
        <div
          className={`rounded-3xl border-2 p-6 sm:p-10 shadow-xl transition-colors ${
            isNight
              ? 'bg-[#27213C] border-[#4D3F6D]'
              : 'bg-white border-[#F2B8C6]/50'
          }`}
        >
          {/* TOY 1: GIGGLE-BLOCK TOWER */}
          {activeToyTab === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-4">
                <div>
                  <div className="text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
                    Toy 01 · Physical Stacking
                  </div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl">
                    Giggle-Block Tower v1.0
                  </h2>
                  <p className="text-xs sm:text-sm opacity-75 mt-1">
                    Click each plush block to stack the tower. Completing all four tiers triggers celebratory musical chords!
                  </p>
                </div>
                <button
                  onClick={handleResetTower}
                  className="min-h-[44px] self-start sm:self-auto px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-black/5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Blocks</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Visual Tower Box */}
                <div
                  className={`lg:col-span-7 rounded-2xl h-96 flex flex-col items-center justify-end p-6 relative overflow-hidden border ${
                    isNight ? 'bg-[#1C172B] border-[#4D3F6D]' : 'bg-[#FFF6E8] border-[#F2B8C6]/30'
                  }`}
                >
                  {towerComplete && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#BDE4C6] border-2 border-white px-4 py-1.5 rounded-full text-xs font-extrabold text-[#493B43] shadow-md animate-bounce flex items-center gap-1.5">
                      <span>🎉 Tower Complete! Harmonic Giggles!</span>
                    </div>
                  )}

                  <div className="w-48 flex flex-col-reverse items-center gap-1">
                    {stackedBlocks.map((id, index) => {
                      const block = blockTypes.find((b) => b.id === id);
                      if (!block) return null;
                      return (
                        <div
                          key={id}
                          className={`w-full h-18 rounded-2xl ${block.color} border-2 border-white shadow-md flex items-center justify-between px-4 transition-all duration-300 animate-in slide-in-from-top-4`}
                          style={{
                            transform: `rotate(${(index % 2 === 0 ? 1 : -1) * (index * 0.8)}deg)`,
                          }}
                        >
                          <span className="text-2xl">{block.face}</span>
                          <span className="text-xs font-bold text-[#493B43]">{block.name}</span>
                          <span className="text-[10px] text-[#493B43]/60">Tier {index + 1}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="w-64 h-5 bg-[#c89d7c] rounded-t-lg border-2 border-[#a3795b] shadow-inner mt-1 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white tracking-widest uppercase">
                      Padded Cedar Base
                    </span>
                  </div>
                </div>

                {/* Stacking Buttons */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="text-xs font-bold">
                    Stack blocks into the tower ({stackedBlocks.length}/4 placed):
                  </div>
                  {blockTypes.map((block) => {
                    const isStacked = stackedBlocks.includes(block.id);
                    return (
                      <button
                        key={block.id}
                        disabled={isStacked}
                        onClick={() => handleAddBlock(block.id)}
                        className={`min-h-[44px] w-full p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                          isStacked
                            ? 'opacity-40 cursor-not-allowed border-slate-300'
                            : `${block.color} border-white shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-98`
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{block.face}</span>
                          <div className="text-left">
                            <div className="text-xs font-bold text-[#493B43]">{block.name}</div>
                            <div className="text-[11px] text-[#493B43]/70">{block.note} Hz</div>
                          </div>
                        </div>
                        {isStacked ? (
                          <CheckCircle className="w-4 h-4 text-[#8DBA83]" />
                        ) : (
                          <span className="text-xs font-bold text-[#493B43] px-2.5 py-1 bg-white/70 rounded-lg">
                            + Stack
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TOY 2: CLOUD-BOING TRAMPOLINE */}
          {activeToyTab === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-4">
                <div>
                  <div className="text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
                    Toy 02 · Soft Kinetic Physics
                  </div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl">
                    Cloud-Boing Trampoline
                  </h2>
                  <p className="text-xs sm:text-sm opacity-75 mt-1">
                    Tap to trigger a safe spring-loaded launch of soft dandelion cotton into the air!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div
                  className={`lg:col-span-8 rounded-2xl h-96 relative flex flex-col items-center justify-end pb-8 overflow-hidden border ${
                    isNight ? 'bg-[#1C172B] border-[#4D3F6D]' : 'bg-[#B9DDF5]/20 border-[#B9DDF5]'
                  }`}
                >
                  <div
                    className="absolute text-5xl transition-transform duration-300 ease-out"
                    style={{
                      bottom: `${100 + starHeight * 1.6}px`,
                      transform: `rotate(${starHeight * 2}deg) scale(${starHeight > 0 ? 1.15 : 1})`,
                    }}
                  >
                    ⭐
                  </div>

                  <div
                    className="w-72 h-14 bg-white rounded-full border-4 border-[#BDE4C6] shadow-md flex items-center justify-center transition-transform duration-150"
                    style={{
                      transform: `translateY(${trampolineOffset}px) scaleX(${1 + trampolineOffset * 0.01})`,
                    }}
                  >
                    <div className="text-xs font-bold text-[#8DBA83] select-none">
                      Dandelion-Cotton Mat
                    </div>
                  </div>

                  <div className="w-56 flex justify-between px-4 mt-1">
                    <div className="w-3 h-8 bg-[#8DBA83] rounded-b-md" />
                    <div className="w-3 h-8 bg-[#8DBA83] rounded-b-md" />
                    <div className="w-3 h-8 bg-[#8DBA83] rounded-b-md" />
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-3">
                  <div className="text-xs font-bold">Select Launch Energy:</div>
                  <button
                    onClick={() => triggerTrampolineBounce(60)}
                    disabled={isBouncing}
                    className="min-h-[44px] w-full py-3 px-4 rounded-2xl bg-[#BDE4C6] hover:bg-[#a5dbc0] text-[#493B43] font-bold text-xs shadow-xs transition-all flex items-center justify-between cursor-pointer active:scale-98"
                  >
                    <span>Gentle Boing (Low)</span>
                    <span>60 cm ☁️</span>
                  </button>
                  <button
                    onClick={() => triggerTrampolineBounce(110)}
                    disabled={isBouncing}
                    className="min-h-[44px] w-full py-3 px-4 rounded-2xl bg-[#FFE29A] hover:bg-[#ffd97d] text-[#493B43] font-bold text-xs shadow-xs transition-all flex items-center justify-between cursor-pointer active:scale-98"
                  >
                    <span>Super Boing (High)</span>
                    <span>110 cm 🚀</span>
                  </button>
                  <button
                    onClick={() => triggerTrampolineBounce(160)}
                    disabled={isBouncing}
                    className="min-h-[44px] w-full py-3 px-4 rounded-2xl bg-[#F2B8C6] hover:bg-[#e89eae] text-[#493B43] font-bold text-xs shadow-xs transition-all flex items-center justify-between cursor-pointer active:scale-98"
                  >
                    <span>Mega Dandelion Launch!</span>
                    <span>160 cm ✨</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TOY 3: NIGHTLIGHT MELODY LANTERN */}
          {activeToyTab === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-4">
                <div>
                  <div className="text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
                    Toy 03 · Bedtime Sensory Luminescence
                  </div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl">
                    Nightlight Melody Lantern
                  </h2>
                  <p className="text-xs sm:text-sm opacity-75 mt-1">
                    Toggle the carved cedar acorn switch to cast gentle glowing stars across the room.
                  </p>
                </div>
                <button
                  onClick={() => setLanternAudioMuted(!lanternAudioMuted)}
                  className="min-h-[44px] px-3.5 py-2 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {lanternAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#8DBA83]" />}
                  <span>{lanternAudioMuted ? 'Muted' : 'Sound On'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div
                  className={`lg:col-span-8 rounded-2xl h-96 relative flex flex-col items-center justify-center p-6 transition-all duration-700 overflow-hidden border ${
                    lanternOn ? 'bg-[#151222] border-[#FFE29A]' : isNight ? 'bg-[#1C172B] border-[#4D3F6D]' : 'bg-[#FFF6E8] border-[#F2B8C6]/40'
                  }`}
                >
                  {lanternOn && (
                    <div className="absolute inset-0 pointer-events-none animate-in fade-in duration-500">
                      {[...Array(16)].map((_, idx) => (
                        <div
                          key={idx}
                          className="absolute text-yellow-200 animate-pulse"
                          style={{
                            top: `${10 + (idx * 23) % 80}%`,
                            left: `${8 + (idx * 37) % 85}%`,
                            fontSize: `${10 + (idx % 3) * 6}px`,
                            animationDelay: `${idx * 0.3}s`,
                          }}
                        >
                          ✦
                        </div>
                      ))}
                      <div className="absolute top-8 right-12 text-4xl text-yellow-100 animate-float">
                        🌙
                      </div>
                    </div>
                  )}

                  <div
                    onClick={toggleLantern}
                    title="Click acorn lamp to toggle!"
                    className={`relative z-10 w-36 h-48 rounded-t-3xl rounded-b-full border-4 transition-all duration-500 flex flex-col items-center justify-between p-4 cursor-pointer shadow-xl ${
                      lanternOn
                        ? 'bg-[#ffe8a3] border-[#f5b842] shadow-[0_0_60px_rgba(255,230,120,0.6)]'
                        : 'bg-[#d8bca6] border-[#8c674b]'
                    }`}
                  >
                    <div className="w-28 h-10 bg-[#8c674b] rounded-t-2xl border-b-2 border-white/20 flex items-center justify-center -mt-6">
                      <div className="w-3 h-5 bg-[#664630] -mt-4 rounded-full" />
                    </div>
                    <div className="space-y-2 text-center">
                      <div className={`text-xl ${lanternOn ? 'text-[#8c674b]' : 'text-white/60'}`}>★</div>
                      <div className={`text-sm ${lanternOn ? 'text-[#8c674b]' : 'text-white/60'}`}>✦ ☾ ✦</div>
                    </div>
                    <div className="text-[10px] font-bold text-[#8c674b] bg-white/70 px-2.5 py-0.5 rounded-full">
                      {lanternOn ? 'GLOWING' : 'OFF'}
                    </div>
                  </div>

                  <div className="mt-4 text-xs font-semibold z-10">
                    {lanternOn ? 'Click to dim nightlight' : 'Click to illuminate stars'}
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-4">
                  <button
                    onClick={toggleLantern}
                    className={`min-h-[44px] w-full py-3.5 px-4 rounded-2xl font-bold text-xs shadow-xs transition-all cursor-pointer ${
                      lanternOn
                        ? 'bg-[#493B43] text-white hover:bg-black'
                        : 'bg-[#FFE29A] text-[#493B43] hover:bg-[#ffd97d]'
                    }`}
                  >
                    {lanternOn ? 'Turn Off Nightlight' : 'Turn On Nightlight (Lullaby Glow)'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TOY 4: BOUNCY-BERRY MARBLE RUN */}
          {activeToyTab === 4 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-4">
                <div>
                  <div className="text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
                    Toy 04 · Kinetic Auditory Track
                  </div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl">
                    Bouncy-Berry Marble Run
                  </h2>
                  <p className="text-xs sm:text-sm opacity-75 mt-1">
                    Drop a berry and follow its journey down bamboo tracks to hear tuned harmonic felt bells!
                  </p>
                </div>
                <div className="text-xs font-bold text-[#8DBA83] bg-[#8DBA83]/20 px-3 py-1.5 rounded-xl">
                  Caught Berries: {collectedBerries}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div
                  className={`lg:col-span-8 rounded-2xl h-96 p-6 relative flex flex-col justify-between overflow-hidden border ${
                    isNight ? 'bg-[#1C172B] border-[#4D3F6D]' : 'bg-[#FFF6E8] border-[#F2B8C6]/30'
                  }`}
                >
                  {/* Track 1 */}
                  <div className="relative">
                    <div className="w-3/4 h-3 bg-[#b5c78a] rounded-full border border-[#8a9d5f] shadow-xs rotate-2 flex items-center justify-end pr-8">
                      <div
                        className={`w-6 h-6 rounded-full bg-[#FFE29A] border-2 border-white flex items-center justify-center text-[10px] shadow-xs transition-transform ${
                          activeBell === 1 ? 'scale-150 rotate-12' : ''
                        }`}
                      >
                        🔔
                      </div>
                    </div>
                  </div>

                  {/* Track 2 */}
                  <div className="relative flex justify-end">
                    <div className="w-3/4 h-3 bg-[#b5c78a] rounded-full border border-[#8a9d5f] shadow-xs -rotate-2 flex items-center justify-start pl-8">
                      <div
                        className={`w-6 h-6 rounded-full bg-[#BDE4C6] border-2 border-white flex items-center justify-center text-[10px] shadow-xs transition-transform ${
                          activeBell === 2 ? 'scale-150 -rotate-12' : ''
                        }`}
                      >
                        🔔
                      </div>
                    </div>
                  </div>

                  {/* Track 3 */}
                  <div className="relative">
                    <div className="w-3/4 h-3 bg-[#b5c78a] rounded-full border border-[#8a9d5f] shadow-xs rotate-2 flex items-center justify-end pr-12">
                      <div className="flex gap-4">
                        <div
                          className={`w-6 h-6 rounded-full bg-[#B9DDF5] border-2 border-white flex items-center justify-center text-[10px] shadow-xs transition-transform ${
                            activeBell === 3 ? 'scale-150 rotate-12' : ''
                          }`}
                        >
                          🔔
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full bg-[#D9C8F0] border-2 border-white flex items-center justify-center text-[10px] shadow-xs transition-transform ${
                            activeBell === 4 ? 'scale-150 -rotate-12' : ''
                          }`}
                        >
                          🔔
                        </div>
                      </div>
                    </div>
                  </div>

                  {berryActive && (
                    <div className="absolute top-10 left-12 w-6 h-6 rounded-full bg-linear-to-tr from-purple-600 to-pink-500 shadow-md animate-bounce border border-white text-[10px] flex items-center justify-center text-white">
                      🫐
                    </div>
                  )}

                  <div className="w-full flex justify-center">
                    <div className="w-44 h-10 bg-[#c89d7c] rounded-b-3xl border-2 border-[#a3795b] shadow-inner flex items-center justify-center gap-1">
                      <span className="text-xs">🫐 x {collectedBerries}</span>
                      <span className="text-[10px] text-white font-bold ml-1">Basin</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-4">
                  <button
                    onClick={dropBerry}
                    disabled={berryActive}
                    className="min-h-[44px] w-full py-4 px-6 rounded-2xl bg-[#8DBA83] hover:bg-[#7ba871] text-white font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{berryActive ? 'Berry Rolling...' : 'Drop Bouncy Berry!'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
