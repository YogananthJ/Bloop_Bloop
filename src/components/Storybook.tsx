import React, { useState, useEffect, useRef } from 'react';
import { ASSETS } from '../utils/assets';
import { sounds } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import { Volume2, VolumeX, ChevronLeft, ChevronRight, BookOpen, Play, Square, RotateCcw, CheckCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StoryChapter {
  number: number;
  title: string;
  subtitle: string;
  image: string;
  paragraphs: string[];
  lesson: string;
  illustrationScene: string;
}

export const Storybook: React.FC = () => {
  const { mode } = useTheme();
  const isNight = mode === 'night';

  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [isStoryFinished, setIsStoryFinished] = useState<boolean>(false);
  const [isReadingAloud, setIsReadingAloud] = useState<boolean>(false);
  const [ambientSoundMuted, setAmbientSoundMuted] = useState<boolean>(false);

  // Touch swipe tracking
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const chapters: StoryChapter[] = [
    {
      number: 1,
      title: 'Chapter 1 — The Train That Lost Its Wheels',
      subtitle: 'A bumpy morning on the clover track',
      image: ASSETS.cozyCloverMeadow,
      illustrationScene: '🚂 💨 💨 ═════ 🍀 🍀 🌾 🌸',
      lesson: 'Every adventure begins with an unexpected bump.',
      paragraphs: [
        'The morning sun was warm and golden over Cozy Clover Meadow. Little chug-chug noises usually floated across the breeze, but today, silence hung over the tracks.',
        'Down near the sweet honeysuckle bend, a little wooden train had tumbled onto a soft patch of moss. Its carved cedar wheels had slipped off the track, and its painted smokestack gave only a quiet whimper.',
        '“Oh dear,” gasped Pickle the duckling, waddling close in his striped sock. “The little train cannot deliver the bedtime lullaby bells without its wheels!”',
        'Bloop arrived with his mint-green engineer’s apron flapping gently in the wind. He examined the rails with his jelly magnifying glass and smiled gently. “Don’t worry, little train. In Meadow Play Lab, we never give up!”',
      ],
    },
    {
      number: 2,
      title: 'Chapter 2 — The Great Toy Repair',
      subtitle: 'Teamwork, trial, and error in the workshop',
      image: ASSETS.meadowPlayLab,
      illustrationScene: '🦛 🔍 ⚙️ 🦆 🦔 🐰 🐑 🪵',
      lesson: 'Mistakes are simply toys waiting to find their right song.',
      paragraphs: [
        'Pip-Squawk adjusted his tiny round spectacles and peered under the train’s wooden chassis. “Look here! The axle didn’t break—the felt gears are just jammed with sweet clover pollen!”',
        'At first, the friends tried using rigid cedar pegs, but the train rattled too harshly. Then Pickle suggested dandelion thistle springs, but they bounced the train right off the rails!',
        'Bloop let out a merry little squeak from his marshmallow belly. “What if we don’t use hard steel wheels? What if we craft bouncy, soft felt cushions so the train rolls in perfect harmony?”',
        'With a gentle tap of Bloop’s soft hammer—*pop!*—the four pastel-cushioned wheels locked into alignment with a gentle musical chime.',
      ],
    },
    {
      number: 3,
      title: 'Chapter 3 — A Delivery of Dreams',
      subtitle: 'Delivering star-lanterns over the clover hill',
      image: ASSETS.toyProjectsCollection,
      illustrationScene: '🚂 💨 ✨ 🌙 ✦ ✦ 🏔️ 🌟',
      lesson: 'Kindness, patience, and play light up the whole kingdom.',
      paragraphs: [
        'As the little train rolled forward, its wheels didn’t screech or clatter. Instead, they let out cheerful musical chimes with every turn: *squeak-boing, chime-chime!*',
        'Luna hung glowing acorn star-lanterns from the passenger windows, while Mama Willow poured warm chamomile tea into little wooden cups for the journey.',
        'Up and over the clover hill the little train steamed, delivering warm star-lanterns and soothing bedtime melodies to every sleeping animal nest in the meadow.',
        'Bloop gave a happy victory wiggle. The Play Kingdom was safe, cozy, and filled with sweet dreams. Another Bloop-Bug fixed with kindness and play!',
      ],
    },
  ];

  const currentChapter = chapters[currentChapterIndex];

  // Flip page action
  const turnPage = (nextIndex: number, direction: 'next' | 'prev') => {
    if (isFlipping) return;
    stopReadAloud();
    sounds.playPop();

    setFlipDirection(direction);
    setIsFlipping(true);

    setTimeout(() => {
      if (nextIndex >= chapters.length) {
        setIsStoryFinished(true);
        sounds.playVictory();
        try {
          confetti({
            particleCount: 85,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#F2B8C6', '#FFE29A', '#BDE4C6', '#D9C8F0'],
          });
        } catch {}
      } else {
        setCurrentChapterIndex(nextIndex);
        setIsStoryFinished(false);
        if (!ambientSoundMuted) {
          sounds.playChime(500 + nextIndex * 120);
        }
      }
      setIsFlipping(false);
    }, 280);
  };

  const restartStory = () => {
    sounds.playPop();
    setIsStoryFinished(false);
    setCurrentChapterIndex(0);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' || e.code === 'Space') {
        e.preventDefault();
        if (currentChapterIndex < chapters.length - 1) {
          turnPage(currentChapterIndex + 1, 'next');
        } else if (!isStoryFinished) {
          turnPage(chapters.length, 'next');
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (isStoryFinished) {
          setIsStoryFinished(false);
        } else if (currentChapterIndex > 0) {
          turnPage(currentChapterIndex - 1, 'prev');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapterIndex, isStoryFinished, isFlipping]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;

    // Swipe left (next page)
    if (diff > 50) {
      if (currentChapterIndex < chapters.length - 1) {
        turnPage(currentChapterIndex + 1, 'next');
      } else if (!isStoryFinished) {
        turnPage(chapters.length, 'next');
      }
    }
    // Swipe right (prev page)
    else if (diff < -50) {
      if (isStoryFinished) {
        setIsStoryFinished(false);
      } else if (currentChapterIndex > 0) {
        turnPage(currentChapterIndex - 1, 'prev');
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Web Speech API Read Aloud
  const handleReadAloud = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isReadingAloud) {
      stopReadAloud();
      return;
    }

    window.speechSynthesis.cancel();
    const fullText = `${currentChapter.title}. ${currentChapter.paragraphs.join(' ')}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.9;
    utterance.pitch = 1.05;

    utterance.onend = () => setIsReadingAloud(false);
    utterance.onerror = () => setIsReadingAloud(false);

    window.speechSynthesis.speak(utterance);
    setIsReadingAloud(true);
  };

  const stopReadAloud = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsReadingAloud(false);
  };

  useEffect(() => {
    return () => stopReadAloud();
  }, []);

  return (
    <div
      className={`min-h-screen py-12 transition-colors ${isNight ? 'bg-[#1C172B]' : 'bg-[#FFF6E8]'}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* STORYBOOK HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Tier 2 Feature · 3D Interactive Storybook</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight">
            The Little Engine That Could Squeak
          </h1>
          <p className="text-xs sm:text-sm opacity-75">
            Swipe, click, or use Left/Right arrow keys to flip through the illustrated chapters.
          </p>
        </div>

        {/* CONTROLS BAR */}
        <div
          className={`flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl border shadow-xs ${
            isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
          }`}
        >
          {/* Chapter Selector */}
          <div className="flex items-center gap-2">
            {chapters.map((ch, idx) => (
              <button
                key={ch.number}
                onClick={() => turnPage(idx, idx > currentChapterIndex ? 'next' : 'prev')}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentChapterIndex === idx && !isStoryFinished
                    ? 'bg-[#8DBA83] text-white shadow-xs'
                    : 'bg-black/5 dark:bg-white/10 hover:bg-[#8DBA83]/20'
                }`}
              >
                Chapter {ch.number}
              </button>
            ))}
          </div>

          {/* Voice Read Aloud & Sound */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReadAloud}
              disabled={isStoryFinished}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 active:scale-95 ${
                isReadingAloud
                  ? 'bg-[#F2B8C6] text-[#493B43]'
                  : 'bg-black/5 dark:bg-white/10 hover:bg-black/10'
              }`}
            >
              {isReadingAloud ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isReadingAloud ? 'Stop Voice' : 'Read Aloud'}</span>
            </button>

            <button
              onClick={() => {
                setAmbientSoundMuted(!ambientSoundMuted);
                sounds.playPop();
              }}
              title={ambientSoundMuted ? 'Unmute chimes' : 'Mute chimes'}
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl border flex items-center justify-center cursor-pointer hover:bg-black/5"
            >
              {ambientSoundMuted ? <VolumeX className="w-4 h-4 opacity-50" /> : <Volume2 className="w-4 h-4 text-[#8DBA83]" />}
            </button>
          </div>
        </div>

        {/* 3D BOOK PAGE CONTAINER */}
        <div style={{ perspective: '1200px' }}>
          {!isStoryFinished ? (
            <article
              className={`rounded-3xl border-2 shadow-2xl overflow-hidden p-6 sm:p-10 space-y-6 relative transition-all duration-300 ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/50'
              } ${
                isFlipping
                  ? flipDirection === 'next'
                    ? 'rotate-y-12 opacity-50 scale-95'
                    : '-rotate-y-12 opacity-50 scale-95'
                  : 'rotate-y-0 opacity-100 scale-100'
              }`}
            >
              {/* Scene Visual & Chapter Banner */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#8DBA83]">
                  <span>CHAPTER {currentChapter.number} OF 3</span>
                  <span className="opacity-60 italic">{currentChapter.lesson}</span>
                </div>

                <div className="rounded-2xl overflow-hidden border border-black/10 shadow-xs max-h-72">
                  <img
                    src={currentChapter.image}
                    alt={`Illustration for Chapter ${currentChapter.number}`}
                    className="w-full h-auto object-cover max-h-72"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div
                  className={`py-2 px-4 rounded-xl border text-center text-sm tracking-widest select-none ${
                    isNight ? 'bg-[#1C172B] border-[#4D3F6D]' : 'bg-[#FFF6E8] border-[#FFE29A]'
                  }`}
                >
                  {currentChapter.illustrationScene}
                </div>
              </div>

              {/* Story Narrative */}
              <div className="space-y-4 pt-2">
                <div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl">
                    {currentChapter.title}
                  </h2>
                  <div className="text-xs font-semibold text-[#8DBA83] mt-0.5">
                    {currentChapter.subtitle}
                  </div>
                </div>

                <div className="space-y-4 text-sm sm:text-base opacity-90 leading-relaxed">
                  {currentChapter.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>

              {/* Page-Turn Bottom Controls */}
              <div className="pt-6 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                <button
                  onClick={() => turnPage(currentChapterIndex - 1, 'prev')}
                  disabled={currentChapterIndex === 0}
                  className={`min-h-[44px] px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentChapterIndex === 0
                      ? 'opacity-30 cursor-not-allowed border-slate-300'
                      : 'hover:bg-black/5'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <span className="text-xs opacity-60 font-semibold">
                  Page {currentChapterIndex + 1} / 3 · Swipe left/right
                </span>

                <button
                  onClick={() => turnPage(currentChapterIndex + 1, 'next')}
                  className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-[#8DBA83] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer hover:bg-[#7ba871] shadow-xs active:scale-95"
                >
                  <span>{currentChapterIndex === chapters.length - 1 ? 'Finish Story' : 'Next Page'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ) : (
            /* END OF STORY COMPLETION SCREEN */
            <div
              className={`rounded-3xl border-2 p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-300 ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#BDE4C6]'
              }`}
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-[#BDE4C6] flex items-center justify-center text-5xl shadow-md">
                ⭐
              </div>

              <div className="inline-block px-3.5 py-1 rounded-full bg-[#BDE4C6]/40 text-xs font-bold text-[#8DBA83]">
                Storybook Complete!
              </div>

              <h2 className="font-display font-extrabold text-3xl sm:text-4xl">
                Sweet Dreams, Meadow Friends!
              </h2>

              <p className="text-sm sm:text-base opacity-85 max-w-lg mx-auto leading-relaxed">
                You’ve finished <strong>“The Little Engine That Could Squeak.”</strong> Bloop and the meadow crew wish you a night filled with gentle starlight and warm cuddles.
              </p>

              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <button
                  onClick={restartStory}
                  className="min-h-[48px] px-7 py-3 rounded-2xl bg-[#8DBA83] text-white font-bold text-xs hover:bg-[#7ba871] shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restart Story from Chapter 1</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
