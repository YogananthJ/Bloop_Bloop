import React, { useState } from 'react';
import { ASSETS } from '../utils/assets';
import { sounds } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, RotateCcw, Play, CheckCircle2, AlertCircle, Trophy, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DreamBlock {
  id: string;
  name: string;
  symbol: string;
  color: string;
  note: number;
}

const ALL_BLOCKS: DreamBlock[] = [
  { id: 'foundation', name: 'Cedar Foundation', symbol: '🪵', color: 'bg-[#d8bca6] text-[#493B43]', note: 392.00 },
  { id: 'cloud', name: 'Fluffy Cloud', symbol: '☁️', color: 'bg-[#B9DDF5] text-[#1E3A8A]', note: 440.00 },
  { id: 'sunshine', name: 'Sunshine Smile', symbol: '☀️', color: 'bg-[#FFE29A] text-[#854D0E]', note: 523.25 },
  { id: 'mint', name: 'Meadow Mint', symbol: '🍀', color: 'bg-[#BDE4C6] text-[#14532D]', note: 587.33 },
  { id: 'berry', name: 'Bouncy Berry', symbol: '🫐', color: 'bg-[#D9C8F0] text-[#581C87]', note: 659.25 },
  { id: 'chime', name: 'Musical Bell', symbol: '🔔', color: 'bg-[#F2B8C6] text-[#831843]', note: 783.99 },
  { id: 'star', name: 'Dream Star Crown', symbol: '⭐', color: 'bg-[#FFE29A] text-[#854D0E]', note: 880.00 },
];

type Difficulty = 'easy' | 'medium' | 'builder';

interface GameConfig {
  name: string;
  targetIds: string[]; // Order from bottom to top
  description: string;
}

const DIFFICULTY_CONFIGS: Record<Difficulty, GameConfig> = {
  easy: {
    name: 'Easy: 3-Block Cozy Tower',
    targetIds: ['foundation', 'sunshine', 'star'],
    description: 'Stack Foundation 🪵, Sunshine ☀️, and Crown with Star ⭐.',
  },
  medium: {
    name: 'Medium: 5-Block Meadow Harmony',
    targetIds: ['foundation', 'cloud', 'mint', 'berry', 'star'],
    description: 'Stack Foundation 🪵 → Cloud ☁️ → Mint 🍀 → Berry 🫐 → Star ⭐.',
  },
  builder: {
    name: 'Dream Builder: 7-Block Masterpiece',
    targetIds: ['foundation', 'cloud', 'sunshine', 'mint', 'berry', 'chime', 'star'],
    description: 'A full 7-tier architectural marvel testing ultimate tactile balance!',
  },
};

export const StackTheDreamBlocks: React.FC = () => {
  const { mode } = useTheme();
  const isNight = mode === 'night';

  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentStack, setCurrentStack] = useState<string[]>([]);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [gameWon, setGameWon] = useState<boolean>(false);

  const activeConfig = DIFFICULTY_CONFIGS[difficulty];
  const targetPattern = activeConfig.targetIds;

  // Handle block selection or placement
  const handleSelectBlock = (blockId: string) => {
    if (gameWon) return;

    // Check if block is already stacked
    if (currentStack.includes(blockId)) {
      setFeedbackMessage('This block is already placed in your tower!');
      sounds.playPop();
      return;
    }

    const nextIndex = currentStack.length;
    const expectedId = targetPattern[nextIndex];
    const blockData = ALL_BLOCKS.find((b) => b.id === blockId);

    if (blockId === expectedId) {
      // Correct placement!
      const nextStack = [...currentStack, blockId];
      setCurrentStack(nextStack);
      setMoveCount((prev) => prev + 1);
      setFeedbackMessage(null);

      if (blockData) {
        sounds.playMusicBoxNote(blockData.note, 0.8);
      }

      // Check win condition
      if (nextStack.length === targetPattern.length) {
        setGameWon(true);
        sounds.playVictory();
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#F2B8C6', '#FFE29A', '#BDE4C6', '#D9C8F0'],
          });
        } catch {}
      }
    } else {
      // Incorrect placement!
      setMoveCount((prev) => prev + 1);
      sounds.playPop();
      const expectedBlock = ALL_BLOCKS.find((b) => b.id === expectedId);
      setFeedbackMessage(`Oopsie! The tower needs ${expectedBlock?.name} ${expectedBlock?.symbol} next.`);
    }
  };

  // Drag and drop support
  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.setData('text/plain', blockId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const blockId = e.dataTransfer.getData('text/plain');
    if (blockId) {
      handleSelectBlock(blockId);
    }
  };

  const resetGame = () => {
    sounds.playPop();
    setCurrentStack([]);
    setMoveCount(0);
    setSelectedBlockId(null);
    setFeedbackMessage(null);
    setGameWon(false);
  };

  const switchDifficulty = (diff: Difficulty) => {
    sounds.playPop();
    setDifficulty(diff);
    setCurrentStack([]);
    setMoveCount(0);
    setSelectedBlockId(null);
    setFeedbackMessage(null);
    setGameWon(false);
  };

  return (
    <div className={`min-h-screen py-12 transition-colors ${isNight ? 'bg-[#1C172B]' : 'bg-[#FFF6E8]'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
            <Trophy className="w-4 h-4" />
            <span>Tier 2 Playable Game · Physical Stacking Challenge</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
            Stack the Dream Blocks
          </h1>
          <p className="text-sm sm:text-base opacity-80 max-w-xl mx-auto">
            Help Bloop stack the handcrafted dream blocks in the correct blueprint order. Drag or tap blocks onto the base platform!
          </p>
        </div>

        {/* CONTROLS BAR: DIFFICULTY, STATS & RESET */}
        <div
          className={`p-4 sm:p-6 rounded-3xl border shadow-xs flex flex-wrap items-center justify-between gap-4 ${
            isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
          }`}
        >
          {/* Difficulty Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {(['easy', 'medium', 'builder'] as Difficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => switchDifficulty(diff)}
                className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  difficulty === diff
                    ? 'bg-[#8DBA83] text-white shadow-xs scale-105'
                    : 'bg-black/5 dark:bg-white/10 hover:bg-[#8DBA83]/20'
                }`}
              >
                {diff === 'easy' ? '🌱 Easy (3)' : diff === 'medium' ? '🌿 Medium (5)' : '⭐ Dream Builder (7)'}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs font-bold">
            <div>
              <span className="opacity-70">Moves: </span>
              <span className="text-[#8DBA83] text-sm">{moveCount}</span>
            </div>
            <div>
              <span className="opacity-70">Progress: </span>
              <span className="text-[#8DBA83] text-sm">
                {currentStack.length} / {targetPattern.length}
              </span>
            </div>
            <button
              onClick={resetGame}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-black/5 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* WORKBENCH & GAME STAGE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Target Blueprint & Bloop Cheerleader */}
          <div className="lg:col-span-4 space-y-4">
            {/* Target Blueprint Card */}
            <div
              className={`p-6 rounded-3xl border shadow-xs space-y-3 ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
              }`}
            >
              <div className="text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
                Target Blueprint:
              </div>
              <p className="text-xs opacity-80 leading-relaxed">
                {activeConfig.description}
              </p>

              {/* Blueprint Preview (Top to Bottom visual) */}
              <div className="p-3 rounded-2xl bg-black/5 dark:bg-black/20 flex flex-col-reverse items-center gap-1.5">
                {targetPattern.map((id, idx) => {
                  const b = ALL_BLOCKS.find((item) => item.id === id);
                  const isPlaced = idx < currentStack.length;
                  return (
                    <div
                      key={id}
                      className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between border ${
                        isPlaced
                          ? 'bg-[#BDE4C6] text-[#14532D] border-[#8DBA83]'
                          : 'bg-white/60 dark:bg-white/10 opacity-60 border-dashed border-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{b?.symbol}</span>
                        <span>{b?.name}</span>
                      </span>
                      <span className="text-[10px]">Tier {idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bloop Cheerleader Card */}
            <div
              className={`p-4 rounded-3xl border shadow-xs flex items-center gap-3 ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border-2 border-[#F2B8C6]">
                <img
                  src={ASSETS.bloopHero}
                  alt="Bloop the Marshmallow Hippo cheering"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-xs">
                <div className="font-bold text-[#8DBA83]">Bloop’s Lab Encouragement:</div>
                <div className="opacity-80 italic">
                  {gameWon
                    ? '“Hooray! What a sturdy, squeaky tower!”'
                    : '“Take your time! Physical debugging is all about playful discovery.”'}
                </div>
              </div>
            </div>
          </div>

          {/* Center Column: The Stacking Platform (Drop Target) */}
          <div className="lg:col-span-5 space-y-4">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`rounded-3xl border-4 h-[440px] p-6 flex flex-col items-center justify-end relative shadow-2xl overflow-hidden transition-all ${
                isNight ? 'bg-[#151222] border-[#4D3F6D]' : 'bg-[#FFF6E8] border-white'
              }`}
            >
              {/* Feedback toast banner */}
              {feedbackMessage && !gameWon && (
                <div className="absolute top-4 left-4 right-4 z-20 p-2.5 rounded-2xl bg-red-100 dark:bg-red-950/80 border border-red-300 text-red-700 dark:text-red-300 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{feedbackMessage}</span>
                </div>
              )}

              {/* Win Celebration Banner */}
              {gameWon && (
                <div className="absolute top-4 left-4 right-4 z-20 p-3 rounded-2xl bg-[#BDE4C6] border-2 border-white text-[#14532D] text-center shadow-lg animate-in zoom-in-95">
                  <div className="font-display font-extrabold text-base">
                    🎉 Dream Tower Complete!
                  </div>
                  <div className="text-xs">
                    Solved in {moveCount} moves! Bloop is giving a victory wiggle!
                  </div>
                </div>
              )}

              {/* The Stacking Column (Stacked from bottom up) */}
              <div className="w-56 flex flex-col-reverse items-center gap-1.5 z-10">
                {currentStack.map((id, index) => {
                  const block = ALL_BLOCKS.find((b) => b.id === id);
                  if (!block) return null;
                  return (
                    <div
                      key={id}
                      className={`w-full h-14 rounded-2xl ${block.color} border-2 border-white shadow-md flex items-center justify-between px-4 transition-all duration-300 animate-in slide-in-from-top-4`}
                      style={{
                        transform: `rotate(${(index % 2 === 0 ? 1 : -1) * (index * 0.7)}deg)`,
                      }}
                    >
                      <span className="text-2xl">{block.symbol}</span>
                      <span className="text-xs font-bold">{block.name}</span>
                      <span className="text-[10px] opacity-75">#{index + 1}</span>
                    </div>
                  );
                })}
              </div>

              {/* Cedar Platform Base */}
              <div className="w-64 h-7 bg-[#c89d7c] rounded-t-xl border-2 border-[#a3795b] shadow-inner mt-1 flex items-center justify-center">
                <span className="text-[9px] font-bold text-white tracking-widest uppercase">
                  Padded Cedar Platform
                </span>
              </div>
            </div>

            {gameWon && (
              <div className="flex gap-2">
                <button
                  onClick={resetGame}
                  className="min-h-[44px] flex-1 py-3 px-4 rounded-2xl bg-[#8DBA83] text-white font-bold text-xs hover:bg-[#7ba871] shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Play Again</span>
                </button>
                <button
                  onClick={() => switchDifficulty(difficulty === 'easy' ? 'medium' : difficulty === 'medium' ? 'builder' : 'easy')}
                  className="min-h-[44px] flex-1 py-3 px-4 rounded-2xl border font-bold text-xs hover:bg-black/5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-[#8DBA83]" />
                  <span>Next Difficulty</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Available Dream Blocks Shelf */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#8DBA83]">
              Block Shelf (Tap or Drag):
            </div>

            <div className="space-y-2">
              {ALL_BLOCKS.map((block) => {
                const isStacked = currentStack.includes(block.id);
                return (
                  <div
                    key={block.id}
                    draggable={!isStacked && !gameWon}
                    onDragStart={(e) => handleDragStart(e, block.id)}
                    onClick={() => handleSelectBlock(block.id)}
                    className={`min-h-[50px] p-3 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer select-none ${
                      isStacked
                        ? 'opacity-30 cursor-not-allowed border-slate-300'
                        : `${block.color} border-white shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-95`
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{block.symbol}</span>
                      <span className="text-xs font-bold">{block.name}</span>
                    </div>
                    {isStacked ? (
                      <CheckCircle2 className="w-4 h-4 text-[#8DBA83]" />
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/60">
                        + Stack
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
