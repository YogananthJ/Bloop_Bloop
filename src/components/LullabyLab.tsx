import React, { useState, useEffect } from 'react';
import { ASSETS } from '../utils/assets';
import { sounds, LULLABY_PRESETS, LullabyPreset } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Volume2,
  VolumeX,
  Music,
  Sliders,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export const LullabyLab: React.FC = () => {
  const { mode } = useTheme();
  const isNight = mode === 'night';

  const [selectedPreset, setSelectedPreset] = useState<LullabyPreset>(LULLABY_PRESETS[0]);
  const [playbackState, setPlaybackState] = useState<'stopped' | 'playing' | 'paused'>('stopped');
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [bpm, setBpm] = useState<number>(LULLABY_PRESETS[0].defaultBpm);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.isMuted());

  // Handle Preset Selection
  const handleSelectPreset = (preset: LullabyPreset) => {
    sounds.stopLullaby();
    setPlaybackState('stopped');
    setCurrentStep(-1);
    setSelectedPreset(preset);
    setBpm(preset.defaultBpm);
    sounds.playPop();
  };

  // Play
  const handlePlay = () => {
    sounds.initContext();
    if (playbackState === 'paused') {
      sounds.resumeLullaby();
      setPlaybackState('playing');
    } else {
      sounds.startLullaby(
        selectedPreset,
        bpm,
        (step) => setCurrentStep(step),
        () => {
          setPlaybackState('stopped');
          setCurrentStep(-1);
        }
      );
      setPlaybackState('playing');
    }
  };

  // Pause
  const handlePause = () => {
    sounds.pauseLullaby();
    setPlaybackState('paused');
  };

  // Stop
  const handleStop = () => {
    sounds.stopLullaby();
    setPlaybackState('stopped');
    setCurrentStep(-1);
  };

  // Replay
  const handleReplay = () => {
    sounds.stopLullaby();
    setCurrentStep(-1);
    sounds.startLullaby(
      selectedPreset,
      bpm,
      (step) => setCurrentStep(step),
      () => {
        setPlaybackState('stopped');
        setCurrentStep(-1);
      }
    );
    setPlaybackState('playing');
  };

  // Mute / Unmute
  const handleToggleMute = () => {
    const nextMute = sounds.toggleMute();
    setIsMuted(nextMute);
    if (!nextMute) {
      sounds.playChime(660);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sounds.stopLullaby();
    };
  }, []);

  // Keyboard Space bar shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (playbackState === 'playing') {
          handlePause();
        } else {
          handlePlay();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playbackState, selectedPreset, bpm]);

  return (
    <div className={`min-h-screen py-12 transition-colors ${isNight ? 'bg-[#1C172B]' : 'bg-[#FFF6E8]'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
            <Music className="w-4 h-4" />
            <span>Tier 2 Audio Feature · Real Synthesized Music Box</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
            Bloop's Lullaby Lab
          </h1>
          <p className="text-sm sm:text-base opacity-80 max-w-xl mx-auto">
            Real Web Audio synthesizer generating gentle celesta and music-box melodies. Choose a preset, adjust the tempo, or toggle the required mute switch!
          </p>
        </div>

        {/* WORKSHOP STAGE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Music Box Canvas with Bloop */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className={`rounded-3xl border-4 p-4 shadow-xl relative overflow-hidden transition-colors ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-white'
              }`}
            >
              <div className="relative rounded-2xl overflow-hidden bg-[#FFF6E8] dark:bg-[#151222] border border-black/5">
                <img
                  src={ASSETS.bloopHero}
                  alt="Bloop enjoying lullaby melodies in Cozy Clover Meadow"
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = ASSETS.bloopHeroLocal;
                  }}
                />

                {/* Animated music note overlay on active playback */}
                {playbackState === 'playing' && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center animate-in fade-in duration-300">
                    <div className="absolute top-10 left-12 text-2xl animate-float">🎵</div>
                    <div className="absolute top-20 right-16 text-3xl animate-bounce" style={{ animationDuration: '1.2s' }}>🎶</div>
                    <div className="absolute bottom-16 right-10 text-2xl animate-ping" style={{ animationDuration: '2s' }}>✨</div>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-white/90 dark:bg-[#27213C]/90 backdrop-blur-xs flex items-center justify-between text-xs font-bold shadow-xs">
                  <span className="flex items-center gap-1.5 text-[#8DBA83]">
                    <Sparkles className="w-4 h-4" />
                    <span>Lullaby Engine: {playbackState.toUpperCase()}</span>
                  </span>
                  <span className="opacity-75">{isMuted ? 'Audio Muted' : 'Sound Active'}</span>
                </div>
              </div>
            </div>

            {/* Quick Playback Status Strip */}
            <div
              className={`p-5 rounded-3xl border shadow-xs text-xs space-y-2 ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
              }`}
            >
              <div className="flex justify-between font-bold">
                <span>Current Melody:</span>
                <span className="text-[#8DBA83]">{selectedPreset.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Synthesizer Timbre:</span>
                <span className="font-semibold">Pure Sine Celesta + Octave Glockenspiel</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Progress:</span>
                <span className="font-semibold">
                  {currentStep >= 0 ? `${currentStep + 1} / ${selectedPreset.notes.length} notes` : 'Idle'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Console */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* PRESET SELECTOR (3 Presets) */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border shadow-xs space-y-4 ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
                  1. Select Lullaby Preset
                </span>
                <span className="text-xs opacity-60">3 Music-Box Compositions</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LULLABY_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`min-h-[52px] p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedPreset.id === preset.id
                        ? 'border-[#8DBA83] bg-[#BDE4C6]/20 shadow-xs ring-2 ring-[#8DBA83]'
                        : 'border-black/5 dark:border-white/10 hover:border-[#8DBA83]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl">{preset.icon}</span>
                      {selectedPreset.id === preset.id && (
                        <CheckCircle className="w-4 h-4 text-[#8DBA83]" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs">{preset.name}</div>
                      <div className="text-[10px] opacity-70 leading-tight mt-0.5">{preset.subtitle}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* VISUALIZER: GLOWING MUSIC BOX NOTES */}
            <div
              className={`p-6 rounded-3xl border shadow-xs space-y-3 ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#8DBA83] uppercase tracking-wider">
                  2. Note Visualizer
                </span>
                <span className="opacity-60">{selectedPreset.notes.length} Handcrafted Steps</span>
              </div>

              <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-black/5 dark:bg-black/30 min-h-[64px] items-center justify-center">
                {selectedPreset.notes.map((n, idx) => {
                  const isActive = currentStep === idx;
                  return (
                    <div
                      key={idx}
                      className={`min-w-[36px] h-10 px-2 rounded-xl flex flex-col items-center justify-center text-[11px] font-bold transition-all duration-150 ${
                        isActive
                          ? 'bg-[#FFE29A] text-[#493B43] shadow-lg scale-125 ring-2 ring-[#8DBA83] z-10'
                          : 'bg-white/80 dark:bg-white/10 opacity-70'
                      }`}
                    >
                      <span>{n.note}</span>
                      <span className="text-[8px] opacity-70">{n.duration}b</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CONTROLS: PLAY, PAUSE, STOP, REPLAY, TEMPO & MANDATORY MUTE */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border shadow-xs space-y-6 ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
                  3. Playback Controls & Mute
                </span>
                <span className="text-xs opacity-60">Hit [Space] to Play/Pause</span>
              </div>

              {/* Main Playback Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                {playbackState !== 'playing' ? (
                  <button
                    onClick={handlePlay}
                    className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#8DBA83] text-white font-bold text-sm hover:bg-[#7ba871] shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{playbackState === 'paused' ? 'Resume' : 'Play Lullaby'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#FFE29A] text-[#493B43] font-bold text-sm hover:bg-[#ffd97d] shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Pause className="w-4 h-4 fill-[#493B43]" />
                    <span>Pause</span>
                  </button>
                )}

                <button
                  onClick={handleStop}
                  disabled={playbackState === 'stopped'}
                  className="min-h-[48px] px-4 py-3 rounded-2xl border text-xs font-bold hover:bg-black/5 disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Square className="w-4 h-4" />
                  <span>Stop</span>
                </button>

                <button
                  onClick={handleReplay}
                  className="min-h-[48px] px-4 py-3 rounded-2xl border text-xs font-bold hover:bg-black/5 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Replay</span>
                </button>

                {/* MANDATORY MUTE / UNMUTE SWITCH */}
                <button
                  onClick={handleToggleMute}
                  aria-label={isMuted ? 'Unmute actual audio' : 'Mute actual audio'}
                  className={`min-h-[48px] ml-auto px-4 py-3 rounded-2xl border-2 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
                    isMuted
                      ? 'border-red-400 bg-red-50 text-red-600 dark:bg-red-950/30'
                      : 'border-[#8DBA83] bg-[#BDE4C6]/20 text-[#8DBA83]'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isMuted ? 'Muted (Audio Off)' : 'Audio On'}</span>
                </button>
              </div>

              {/* Tempo Control */}
              <div className="pt-2 border-t border-black/5 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#8DBA83]" />
                    <span>Playback Tempo: {bpm} BPM</span>
                  </span>
                  <div className="flex gap-1.5">
                    {[64, 84, 108].map((presetBpm) => (
                      <button
                        key={presetBpm}
                        onClick={() => {
                          setBpm(presetBpm);
                          sounds.playPop();
                        }}
                        className={`min-h-[36px] px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
                          bpm === presetBpm ? 'bg-[#8DBA83] text-white' : 'hover:bg-black/5'
                        }`}
                      >
                        {presetBpm === 64 ? 'Slow' : presetBpm === 84 ? 'Normal' : 'Brisk'}
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="range"
                  min="50"
                  max="130"
                  value={bpm}
                  onChange={(e) => setBpm(Number(e.target.value))}
                  className="w-full accent-[#8DBA83] cursor-pointer"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
