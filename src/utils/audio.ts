/**
 * Web Audio API synthesizer for playful, tactile toy sounds and Bloop's Lullaby Lab.
 * Zero external audio files required, instant latency, full user mute control.
 */

export interface LullabyNote {
  note: string;
  freq: number;
  duration: number; // in beats
}

export interface LullabyPreset {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  defaultBpm: number;
  icon: string;
  notes: LullabyNote[];
}

export const LULLABY_PRESETS: LullabyPreset[] = [
  {
    id: 'marshmallow-moon',
    name: 'Marshmallow Moon',
    subtitle: 'Slow, dreamy, and gentle notes',
    description: 'A soothing, cloud-soft bedtime melody designed for counting clover sheep.',
    defaultBpm: 68,
    icon: '🌙',
    notes: [
      { note: 'C4', freq: 261.63, duration: 1.5 },
      { note: 'E4', freq: 329.63, duration: 1 },
      { note: 'G4', freq: 392.00, duration: 1.5 },
      { note: 'B4', freq: 493.88, duration: 1 },
      { note: 'C5', freq: 523.25, duration: 2 },
      { note: 'A4', freq: 440.00, duration: 1 },
      { note: 'G4', freq: 392.00, duration: 1.5 },
      { note: 'E4', freq: 329.63, duration: 1.5 },
      { note: 'F4', freq: 349.23, duration: 1 },
      { note: 'G4', freq: 392.00, duration: 1 },
      { note: 'E4', freq: 329.63, duration: 1.5 },
      { note: 'D4', freq: 293.66, duration: 1 },
      { note: 'C4', freq: 261.63, duration: 2.5 },
    ],
  },
  {
    id: 'cozy-clover',
    name: 'Cozy Clover',
    subtitle: 'Warm, playful, and soothing notes',
    description: 'A gentle waltz through morning dew and sweet clover blossoms.',
    defaultBpm: 84,
    icon: '🍀',
    notes: [
      { note: 'G4', freq: 392.00, duration: 1 },
      { note: 'C5', freq: 523.25, duration: 1 },
      { note: 'D5', freq: 587.33, duration: 1 },
      { note: 'E5', freq: 659.25, duration: 2 },
      { note: 'G5', freq: 783.99, duration: 1.5 },
      { note: 'E5', freq: 659.25, duration: 1 },
      { note: 'D5', freq: 587.33, duration: 1.5 },
      { note: 'C5', freq: 523.25, duration: 2 },
      { note: 'A4', freq: 440.00, duration: 1 },
      { note: 'C5', freq: 523.25, duration: 1 },
      { note: 'D5', freq: 587.33, duration: 1.5 },
      { note: 'C5', freq: 523.25, duration: 2.5 },
    ],
  },
  {
    id: 'twinkle-train',
    name: 'Twinkle Toy Train',
    subtitle: 'Light, rhythmic music-box melody',
    description: 'A cheerful, clockwork music-box chug along the miniature wooden tracks.',
    defaultBpm: 96,
    icon: '🚂',
    notes: [
      { note: 'C5', freq: 523.25, duration: 1 },
      { note: 'C5', freq: 523.25, duration: 1 },
      { note: 'G5', freq: 783.99, duration: 1 },
      { note: 'G5', freq: 783.99, duration: 1 },
      { note: 'A5', freq: 880.00, duration: 1 },
      { note: 'A5', freq: 880.00, duration: 1 },
      { note: 'G5', freq: 783.99, duration: 2 },
      { note: 'F5', freq: 698.46, duration: 1 },
      { note: 'F5', freq: 698.46, duration: 1 },
      { note: 'E5', freq: 659.25, duration: 1 },
      { note: 'E5', freq: 659.25, duration: 1 },
      { note: 'D5', freq: 587.33, duration: 1 },
      { note: 'D5', freq: 587.33, duration: 1 },
      { note: 'C5', freq: 523.25, duration: 2.5 },
    ],
  },
];

class SoundController {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  // Lullaby playback engine state
  private activeTimeouts: NodeJS.Timeout[] = [];
  private isPlayingLullaby: boolean = false;
  private currentNoteIndex: number = 0;
  private activePreset: LullabyPreset = LULLABY_PRESETS[0];
  private currentBpm: number = 72;
  private onStepCallback: ((step: number) => void) | null = null;
  private onFinishCallback: (() => void) | null = null;

  constructor() {
    const savedMute = localStorage.getItem('bloop_sound_muted');
    if (savedMute !== null) {
      this.muted = savedMute === 'true';
    }
  }

  public initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    localStorage.setItem('bloop_sound_muted', String(this.muted));
    return this.muted;
  }

  public setMute(muted: boolean) {
    this.muted = muted;
    localStorage.setItem('bloop_sound_muted', String(this.muted));
  }

  /**
   * Synthesize a single celesta/music-box chime tone with pure sine + subtle bell overtone.
   */
  public playMusicBoxNote(freq: number, durationSeconds: number = 1.0) {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Primary gentle fundamental
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.linearRampToValueAtTime(0.24, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + durationSeconds + 0.05);

      // Subtle warm bell octave overtone for music-box feel
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);

      gain2.gain.setValueAtTime(0.0001, now);
      gain2.gain.linearRampToValueAtTime(0.06, now + 0.015);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds * 0.5);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now);
      osc2.stop(now + durationSeconds * 0.55);
    } catch {}
  }

  /**
   * Squeak sound: Bloop's musical marshmallow belly squeak!
   */
  public playSqueak() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.18);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.24);
    } catch {}
  }

  /**
   * Boing sound: Cloud trampoline bounce!
   */
  public playBoing() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.09);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.28);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {}
  }

  /**
   * Pop / Peg Click: Wooden block placement
   */
  public playPop() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  /**
   * Chime: Quick star bell
   */
  public playChime(noteFrequency: number = 784) {
    this.playMusicBoxNote(noteFrequency, 0.7);
  }

  /**
   * Victory Fanfare: Musical arpeggio
   */
  public playVictory() {
    if (this.muted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playMusicBoxNote(freq, 0.8);
      }, idx * 110);
    });
  }

  // =========================================================================
  // LULLABY LAB ENGINE IMPLEMENTATION
  // =========================================================================

  public startLullaby(
    preset: LullabyPreset,
    bpm: number,
    onStep: (step: number) => void,
    onFinish: () => void,
    startFromIndex: number = 0
  ) {
    this.stopLullaby();
    this.initContext();

    this.activePreset = preset;
    this.currentBpm = bpm;
    this.onStepCallback = onStep;
    this.onFinishCallback = onFinish;
    this.isPlayingLullaby = true;
    this.currentNoteIndex = startFromIndex;

    const beatDurationMs = (60 / bpm) * 1000;
    let accumulatedDelay = 0;

    for (let i = startFromIndex; i < preset.notes.length; i++) {
      const noteItem = preset.notes[i];
      const stepIndex = i;
      const currentDelay = accumulatedDelay;

      const timer = setTimeout(() => {
        if (!this.isPlayingLullaby) return;

        this.currentNoteIndex = stepIndex;
        if (this.onStepCallback) {
          this.onStepCallback(stepIndex);
        }

        // Synthesize the note
        const noteDurationSec = (noteItem.duration * beatDurationMs) / 1000;
        this.playMusicBoxNote(noteItem.freq, Math.max(0.6, noteDurationSec));

        // When the last note is hit
        if (stepIndex === preset.notes.length - 1) {
          const finishTimer = setTimeout(() => {
            this.isPlayingLullaby = false;
            this.currentNoteIndex = 0;
            if (this.onFinishCallback) this.onFinishCallback();
          }, noteDurationSec * 1000);
          this.activeTimeouts.push(finishTimer);
        }
      }, currentDelay);

      this.activeTimeouts.push(timer);
      accumulatedDelay += noteItem.duration * beatDurationMs;
    }
  }

  public pauseLullaby() {
    this.clearLullabyTimers();
    this.isPlayingLullaby = false;
  }

  public resumeLullaby() {
    if (!this.activePreset) return;
    this.startLullaby(
      this.activePreset,
      this.currentBpm,
      this.onStepCallback || (() => {}),
      this.onFinishCallback || (() => {}),
      this.currentNoteIndex
    );
  }

  public stopLullaby() {
    this.clearLullabyTimers();
    this.isPlayingLullaby = false;
    this.currentNoteIndex = 0;
  }

  private clearLullabyTimers() {
    this.activeTimeouts.forEach((t) => clearTimeout(t));
    this.activeTimeouts = [];
  }
}

export const sounds = new SoundController();
