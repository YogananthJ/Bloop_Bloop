import React, { useState, useEffect } from 'react';
import { visitorMemory, VisitorProfile } from '../utils/visitorMemory';
import { sounds } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Heart, RotateCcw, Check, MessageSquare, Music, Shield, ArrowRight } from 'lucide-react';
import { TabType } from './Navbar';
import bloopHi from '../assets/images/hi_bloop.png';


interface VisitorMemoryBannerProps {
  onSelectTab: (tab: TabType) => void;
}

export const VisitorMemoryBanner: React.FC<VisitorMemoryBannerProps> = ({ onSelectTab }) => {
  const { mode } = useTheme();
  const isNight = mode === 'night';

  const [profile, setProfile] = useState<VisitorProfile | null>(null);
  const [nicknameInput, setNicknameInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showFirstVisitPrompt, setShowFirstVisitPrompt] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    const current = visitorMemory.getProfile();
    setProfile(current);

    if (!current.hasVisited) {
      setShowFirstVisitPrompt(true);
      // Mark visited on mount so subsequent loads recognize the visitor
      visitorMemory.recordVisit();
    } else {
      // Increment visit count for this session
      const updated = visitorMemory.recordVisit(current.nickname);
      setProfile(updated);
    }
  }, []);

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicknameInput.trim()) return;

    sounds.playPop();
    const updated = visitorMemory.setNickname(nicknameInput.trim());
    setProfile(updated);
    setIsEditing(false);
    setShowFirstVisitPrompt(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleDismissFirstVisit = () => {
    sounds.playPop();
    setShowFirstVisitPrompt(false);
  };

  const handleResetMemory = () => {
    sounds.playPop();
    visitorMemory.resetMemory();
    setProfile({
      nickname: '',
      hasVisited: false,
      firstVisitDate: new Date().toISOString(),
      lastVisitDate: new Date().toISOString(),
      visitCount: 1,
    });
    setNicknameInput('');
    setIsEditing(false);
  };

  if (!profile) return null;

  const displayName = profile.nickname || 'Friend';
  const isReturning = profile.hasVisited && profile.visitCount > 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      {/* 1. FIRST VISIT WELCOME MODAL / BANNER */}
      {showFirstVisitPrompt && (
        <div
          className={`p-6 sm:p-8 rounded-3xl border-2 shadow-xl transition-all relative overflow-hidden animate-in fade-in zoom-in-95 ${
            isNight
              ? 'bg-[#27213C] border-[#FFE29A]/50 text-white'
              : 'bg-white border-[#F2B8C6] text-[#493B43]'
          }`}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-[#F2B8C6]/30 border-2 border-[#F2B8C6] flex items-center justify-center shrink-0 animate-bounce-toy overflow-hidden">
              <img
                src={bloopHi}
                alt="Bloop waving hello"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8DBA83]/15 text-[#8DBA83] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Feature 03 · Bloop Remembers You</span>
              </div>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl">
                “Boing-boing! Welcome to my little world!”
              </h3>
              <p className="text-sm opacity-85 leading-relaxed max-w-2xl">
                “What should I call you, friend? If you'd like, you can save a friendly nickname so I remember you whenever you return to the meadow!”
              </p>
              <div className="flex items-center gap-1.5 text-[11px] opacity-70">
                <Shield className="w-3 h-3 text-[#8DBA83]" />
                <span>Stored 100% locally in your browser. Zero tracking, zero telemetry.</span>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSaveNickname} className="w-full md:w-auto shrink-0 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={30}
                  placeholder="Your nickname (e.g. Alex)"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  className={`px-4 py-3 rounded-2xl border text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#8DBA83] ${
                    isNight ? 'bg-[#1C172B] border-[#4D3F6D] text-white' : 'bg-[#FFF6E8] border-[#F2B8C6]'
                  }`}
                  aria-label="Your nickname"
                />
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-3 rounded-2xl bg-[#8DBA83] text-white font-bold text-xs hover:bg-[#7ba871] shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Check className="w-4 h-4" />
                  <span>Remember Me</span>
                </button>
              </div>

              <div className="flex justify-center md:justify-end">
                <button
                  type="button"
                  onClick={handleDismissFirstVisit}
                  className="text-xs opacity-60 hover:opacity-100 hover:underline cursor-pointer py-1"
                >
                  Continue as quiet guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. RETURNING VISITOR PERSONA CARD (When not in first-visit prompt) */}
      {!showFirstVisitPrompt && (
        <div
          className={`p-4 sm:p-5 rounded-3xl border shadow-xs transition-all flex flex-col md:flex-row items-center justify-between gap-4 ${
            isNight ? 'bg-[#221C35] border-[#4D3F6D]/50' : 'bg-white/80 border-[#F2B8C6]/40'
          }`}
        >
          {/* Greeting Side */}
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#BDE4C6]/30 border border-[#8DBA83] flex items-center justify-center shrink-0 overflow-hidden">
              {profile.nickname ? (
                <span className="text-2xl">🌟</span>
              ) : (
                <img
                  src={bloopHi}
                  alt="Bloop"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="font-display font-bold text-base sm:text-lg">
                  {profile.nickname
                    ? `“Yay, ${profile.nickname} is back in the meadow!”`
                    : '“Boing-boing! Welcome back to Bloop’s World!”'}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FFE29A] text-[#854D0E] font-bold">
                  Visit #{profile.visitCount}
                </span>
              </div>
              <p className="text-xs opacity-75 mt-0.5">
                Bloop was just testing clockwork gears with Pip-Squawk! What shall we explore?
              </p>
            </div>
          </div>

          {/* Quick Shortcuts & Nickname Edit Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => {
                onSelectTab('chat');
                sounds.playPop();
              }}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#8DBA83]/15 text-[#8DBA83] hover:bg-[#8DBA83]/25 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Talk to Bloop</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('guestbook');
                sounds.playPop();
              }}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#FFE29A]/20 text-[#925C05] dark:text-[#FFE29A] hover:bg-[#FFE29A]/30 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Leave a Dream</span>
            </button>

            {/* Edit / Reset memory buttons */}
            {isEditing ? (
              <form onSubmit={handleSaveNickname} className="flex gap-1.5 items-center">
                <input
                  type="text"
                  maxLength={30}
                  placeholder="New nickname"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold w-32 ${
                    isNight ? 'bg-[#1C172B] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]'
                  }`}
                  aria-label="New nickname"
                />
                <button
                  type="submit"
                  className="min-h-[36px] px-2.5 py-1.5 rounded-xl bg-[#8DBA83] text-white text-xs font-bold cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs opacity-60 hover:opacity-100 px-1.5 cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setNicknameInput(profile.nickname);
                    setIsEditing(true);
                  }}
                  className="text-[11px] opacity-70 hover:opacity-100 hover:underline px-2 py-1.5 cursor-pointer"
                >
                  {profile.nickname ? 'Change Nickname' : '+ Add Nickname'}
                </button>
                <button
                  onClick={handleResetMemory}
                  title="Forget saved nickname and reset local visitor memory"
                  className="text-[11px] opacity-50 hover:opacity-100 hover:text-red-500 p-1.5 cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Forget Me</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mini Toast */}
      {savedToast && (
        <div className="mt-2 text-center text-xs font-bold text-[#8DBA83] animate-in fade-in">
          ✨ Bloop has written your nickname in his plush clover notebook!
        </div>
      )}
    </div>
  );
};
