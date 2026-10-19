import React, { useState, useEffect } from 'react';
import { sounds } from '../utils/audio';
import { visitorMemory } from '../utils/visitorMemory';
import { useTheme } from '../context/ThemeContext';
import {
  Heart,
  Send,
  Sparkles,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface DreamEntry {
  id: string;
  name: string;
  message: string;
  theme: string;
  isAnonymous?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const DreamGuestbook: React.FC = () => {
  const { mode } = useTheme();
  const isNight = mode === 'night';

  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [theme, setTheme] = useState<string>('starlight');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  // Filter State
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showSchemaGuide, setShowSchemaGuide] = useState<boolean>(false);
  const [copiedSchema, setCopiedSchema] = useState<boolean>(false);

  // Backend connection status
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const isSupabaseConfigured = Boolean(
    supabaseUrl && !supabaseUrl.includes('your-project-id') && import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  // Pre-fill name from returning visitor memory if available
  useEffect(() => {
    const profile = visitorMemory.getProfile();
    if (profile.nickname) {
      setName(profile.nickname);
    }
  }, []);

  // Fetch Dreams from Persistent Backend API
  const fetchDreams = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/guestbook');
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setDreams(data.data);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: any) {
      console.warn('Failed to load guestbook from server API:', err?.message || err);
      setErrorMessage('Could not load guestbook dreams from server. Please click refresh to retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDreams();
  }, []);

  // Submit Dream Handler
  const handleSubmitDream = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    // Client-side validation
    if (!isAnonymous && !trimmedName) {
      setErrorMessage('Please enter your name or check "Submit Anonymously".');
      return;
    }

    if (!trimmedMessage || trimmedMessage.length < 3) {
      setErrorMessage('Please write a dream of at least 3 characters.');
      return;
    }

    if (trimmedMessage.length > 300) {
      setErrorMessage('Dream message cannot exceed 300 characters.');
      return;
    }

    setSubmitting(true);
    sounds.playPop();

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          message: trimmedMessage,
          theme,
          isAnonymous,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || `Failed to submit dream (HTTP ${res.status})`);
      }

      // If user provided a nickname and had none saved, remember it
      if (trimmedName && !isAnonymous) {
        visitorMemory.setNickname(trimmedName);
      }

      // Add to local state and reset form
      setDreams((prev) => [result.data, ...prev]);
      setMessage('');
      setSuccessToast('Your dream has landed softly in Bloop’s starlight jar! ✨');
      sounds.playVictory();

      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#F2B8C6', '#FFE29A', '#BDE4C6', '#D9C8F0'],
        });
      } catch {}

      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit dream to database.');
    } finally {
      setSubmitting(false);
    }
  };

  const copySchemaToClipboard = () => {
    const sqlSchema = `-- Bloop's Dream Guestbook Supabase Schema
create table if not exists dream_guestbook (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 40),
  message text not null check (char_length(trim(message)) between 3 and 300),
  theme text default 'starlight',
  is_anonymous boolean default false,
  status text default 'approved' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

-- Row Level Security (RLS)
alter table dream_guestbook enable row level security;

-- Public Read Policy: Allow anyone to read approved dreams
create policy "Public can read approved dreams"
  on dream_guestbook for select
  using (status = 'approved');

-- Public Insert Policy: Allow anyone to submit dreams
create policy "Public can insert dreams"
  on dream_guestbook for insert
  with check (status = 'approved' and char_length(trim(message)) <= 300);`;

    navigator.clipboard.writeText(sqlSchema);
    setCopiedSchema(true);
    sounds.playPop();
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const filteredDreams = dreams.filter((d) => {
    if (activeFilter === 'all') return true;
    return d.theme === activeFilter;
  });

  const themeBadges: Record<string, { label: string; icon: string; style: string }> = {
    starlight: { label: 'Starlight', icon: '✨', style: 'bg-amber-100 text-amber-900 border-amber-200' },
    clover: { label: 'Clover', icon: '🍀', style: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
    marshmallow: { label: 'Marshmallow', icon: '🌸', style: 'bg-pink-100 text-pink-900 border-pink-200' },
    lavender: { label: 'Lavender', icon: '💜', style: 'bg-purple-100 text-purple-900 border-purple-200' },
    sunshine: { label: 'Sunshine', icon: '☀️', style: 'bg-yellow-100 text-yellow-900 border-yellow-200' },
  };

  return (
    <div className={`min-h-screen py-12 transition-colors ${isNight ? 'bg-[#1C172B]' : 'bg-[#FFF6E8]'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
            <Heart className="w-4 h-4" />
            <span>Tier 3 Feature 02 · Live Persistent Guestbook</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
            Leave a Dream for Bloop
          </h1>
          <p className="text-sm sm:text-base opacity-80 max-w-xl mx-auto">
            A real, persistent shared guestbook backed by our live database. Leave a warm wish for Bloop and read approved dreams from visitors worldwide!
          </p>
        </div>

        {/* CONNECTION STATUS & SCHEMA GUIDE BAR */}
        <div
          className={`p-4 rounded-3xl border shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs font-semibold ${
            isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <Database className="w-3.5 h-3.5 text-[#8DBA83]" />
            <span>
              Database Status:{' '}
              <strong className="text-[#8DBA83]">
                {isSupabaseConfigured ? 'Supabase Cloud Database (Active)' : 'Live Persistent Server Database (Active)'}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDreams}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl border flex items-center gap-1.5 hover:bg-black/5 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setShowSchemaGuide(!showSchemaGuide)}
              className="px-3 py-1.5 rounded-xl bg-[#8DBA83]/15 text-[#8DBA83] hover:bg-[#8DBA83]/25 font-bold cursor-pointer transition-colors"
            >
              {showSchemaGuide ? 'Hide Supabase SQL' : 'Supabase SQL Schema'}
            </button>
          </div>
        </div>

        {/* SUPABASE SQL & RLS INTEGRATION GUIDE DROPDOWN */}
        {showSchemaGuide && (
          <div
            className={`p-6 rounded-3xl border-2 border-[#8DBA83] shadow-md space-y-4 animate-in fade-in duration-200 ${
              isNight ? 'bg-[#221C35] text-[#F3ECF8]' : 'bg-[#FFF9F2] text-[#493B43]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-display font-bold text-base text-[#8DBA83]">
                <ShieldCheck className="w-4 h-4" />
                <span>Supabase PostgreSQL Schema & Row Level Security (RLS)</span>
              </div>
              <button
                onClick={copySchemaToClipboard}
                className="px-3 py-1.5 rounded-xl bg-[#8DBA83] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
              >
                {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSchema ? 'Copied SQL!' : 'Copy SQL Script'}</span>
              </button>
            </div>

            <p className="text-xs opacity-80 leading-relaxed">
              To connect your own external Supabase instance, run this SQL script in your Supabase SQL Editor and set{' '}
              <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in your environment.
            </p>

            <pre className="p-4 rounded-2xl bg-black/80 text-emerald-400 text-[11px] font-mono overflow-x-auto leading-relaxed border border-white/10">
{`-- 1. Create table with length constraints
create table if not exists dream_guestbook (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 40),
  message text not null check (char_length(trim(message)) between 3 and 300),
  theme text default 'starlight',
  is_anonymous boolean default false,
  status text default 'approved' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

-- 2. Enable Row Level Security
alter table dream_guestbook enable row level security;

-- 3. Public read policy for approved dreams
create policy "Public can read approved dreams"
  on dream_guestbook for select using (status = 'approved');

-- 4. Public submission policy with character limits
create policy "Public can insert dreams"
  on dream_guestbook for insert
  with check (status = 'approved' and char_length(trim(message)) <= 300);`}
            </pre>
          </div>
        )}

        {/* MAIN GRID: SUBMISSION FORM & DREAMS DISPLAY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Submit a Dream Form */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className={`p-6 sm:p-8 rounded-3xl border-2 shadow-xl space-y-5 ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/50'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
                  Write Your Wish
                </span>
                <h2 className="font-display font-bold text-2xl mt-0.5">
                  Whisper a Dream
                </h2>
                <p className="text-xs opacity-75 mt-1 leading-relaxed">
                  Your message will be safely stored in the meadow database and shared with Bloop!
                </p>
              </div>

              {/* Feedback messages */}
              {errorMessage && (
                <div className="p-3 rounded-2xl bg-red-100 dark:bg-red-950/80 border border-red-300 text-red-700 dark:text-red-300 text-xs font-bold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successToast && (
                <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successToast}</span>
                </div>
              )}

              <form onSubmit={handleSubmitDream} className="space-y-4">
                {/* Name / Nickname Input */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 opacity-90">
                    Your Name or Nickname
                  </label>
                  <input
                    type="text"
                    maxLength={40}
                    disabled={isAnonymous || submitting}
                    placeholder={isAnonymous ? 'Secret Meadow Friend (Anonymous)' : 'e.g. Alex, Maya, or Builder Pip'}
                    value={isAnonymous ? '' : name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#8DBA83] disabled:opacity-50 ${
                      isNight ? 'bg-[#1C172B] border-[#4D3F6D] text-white' : 'bg-[#FFF6E8] border-[#F2B8C6]'
                    }`}
                  />
                </div>

                {/* Anonymous Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="accent-[#8DBA83] w-4 h-4 cursor-pointer rounded"
                  />
                  <span>Submit anonymously as a Secret Meadow Friend</span>
                </label>

                {/* Dream Theme Selection */}
                <div>
                  <label className="block text-xs font-bold mb-1.5 opacity-90">
                    Dream Theme
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {Object.entries(themeBadges).map(([key, val]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setTheme(key);
                          sounds.playPop();
                        }}
                        className={`min-h-[40px] p-2 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center ${
                          theme === key
                            ? 'border-[#8DBA83] bg-[#8DBA83]/20 shadow-xs ring-2 ring-[#8DBA83]'
                            : 'border-black/5 dark:border-white/10 hover:border-[#8DBA83]/50'
                        }`}
                      >
                        <span className="text-base">{val.icon}</span>
                        <span className="text-[9px] mt-0.5">{val.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold opacity-90">
                      Your Dream Message
                    </label>
                    <span className="text-[10px] opacity-60">
                      {message.length} / 300 characters
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    maxLength={300}
                    disabled={submitting}
                    placeholder="Whisper a warm wish or creative toy idea for Bloop..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`w-full p-4 rounded-2xl border text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#8DBA83] resize-none leading-relaxed ${
                      isNight ? 'bg-[#1C172B] border-[#4D3F6D] text-white' : 'bg-[#FFF6E8] border-[#F2B8C6]'
                    }`}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || !message.trim()}
                  className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-[#8DBA83] text-white font-bold text-sm hover:bg-[#7ba871] shadow-md hover:shadow-lg disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Delivering Dream...' : 'Send Dream to Bloop'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: List of Approved Dreams */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-[#8DBA83] flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter:</span>
                </span>
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeFilter === 'all'
                      ? 'bg-[#8DBA83] text-white'
                      : 'bg-black/5 dark:bg-white/10 hover:bg-black/10'
                  }`}
                >
                  All Dreams ({dreams.length})
                </button>
                {Object.entries(themeBadges).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setActiveFilter(key)}
                    className={`min-h-[36px] px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      activeFilter === key
                        ? 'bg-[#8DBA83] text-white'
                        : 'bg-black/5 dark:bg-white/10 hover:bg-black/10'
                    }`}
                  >
                    <span>{val.icon}</span>
                    <span>{val.label}</span>
                  </button>
                ))}
              </div>

              <span className="text-xs opacity-60">
                {filteredDreams.length} message{filteredDreams.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Dreams Stream */}
            {loading ? (
              <div className="p-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 mx-auto text-[#8DBA83] animate-spin" />
                <div className="text-xs font-bold opacity-75">
                  Reading starlight dreams from the database...
                </div>
              </div>
            ) : filteredDreams.length === 0 ? (
              <div
                className={`p-10 rounded-3xl border text-center space-y-3 ${
                  isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
                }`}
              >
                <div className="text-4xl">🌟</div>
                <h3 className="font-display font-bold text-lg">No dreams in this jar yet</h3>
                <p className="text-xs opacity-75 max-w-sm mx-auto">
                  Be the very first friend to whisper a dream into Bloop’s starlight jar!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                {filteredDreams.map((dream) => {
                  const badge = themeBadges[dream.theme] || themeBadges.starlight;
                  const dateStr = new Date(dream.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <article
                      key={dream.id}
                      className={`p-5 rounded-3xl border shadow-xs transition-all hover:shadow-md space-y-2.5 ${
                        isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-[#F2B8C6]/20 flex items-center justify-center text-sm font-bold">
                            {badge.icon}
                          </span>
                          <div>
                            <span className="font-display font-bold text-sm block">
                              {dream.name}
                            </span>
                            <span className="text-[10px] opacity-60">
                              {dateStr}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.style}`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      {/* Safely Rendered User Content */}
                      <p className="text-xs sm:text-sm opacity-90 leading-relaxed break-words">
                        “{dream.message}”
                      </p>
                    </article>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
