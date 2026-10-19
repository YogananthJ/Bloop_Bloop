import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import { Mail, Send, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Contact: React.FC = () => {
  const { mode } = useTheme();
  const isNight = mode === 'night';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('New Toy Idea');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ name: string; topic: string; message: string } | null>(null);

  const validate = () => {
    const errs: { name?: string; email?: string; message?: string } = {};

    if (!name.trim()) {
      errs.name = 'Please tell us your friendly name or nickname!';
    } else if (name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters long.';
    }

    if (!email.trim()) {
      errs.email = 'Please provide an email address so we can reply!';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email format (e.g. friend@meadow.com).';
    }

    if (!message.trim()) {
      errs.message = 'Please write a little note or toy idea!';
    } else if (message.trim().length < 5) {
      errs.message = 'Message should be at least 5 characters long.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      sounds.playPop();
      return;
    }

    sounds.playVictory();
    setSubmittedData({ name, topic, message });
    setSubmitted(true);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F2B8C6', '#BDE4C6', '#FFE29A', '#B9DDF5'],
      });
    } catch {}
  };

  const handleReset = () => {
    sounds.playPop();
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
    setSubmittedData(null);
  };

  return (
    <div className={`min-h-screen py-12 transition-colors ${isNight ? 'bg-[#1C172B]' : 'bg-[#FFF6E8]'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* HEADER WITH EXACT TITLE FROM SECTION 17 */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
            <Mail className="w-4 h-4" />
            <span>Meadow Mailbox · Direct Line to Bloop</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
            “Got a Little Idea? Let’s Make It Squeak!”
          </h1>
          <p className="text-sm sm:text-base opacity-80 max-w-xl mx-auto">
            Have a squeaky toy idea, found a sneaky Bloop-Bug, or just want to send a cozy high-five?
          </p>
        </div>

        {/* CONTACT FORM CONTAINER */}
        <div
          className={`rounded-3xl border-2 p-6 sm:p-10 shadow-xl transition-colors ${
            isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/50'
          }`}
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label htmlFor="name-input" className="block text-xs font-bold">
                    Your Name or Nickname *
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="e.g. Daisy or Little Bear"
                    className={`min-h-[48px] w-full px-4 py-3 rounded-2xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-[#8DBA83] transition-all ${
                      isNight ? 'bg-[#1C172B] text-white' : 'bg-[#FFF6E8] text-[#493B43]'
                    } ${errors.name ? 'border-red-400' : 'border-[#F2B8C6]/50'}`}
                  />
                  {errors.name && (
                    <div className="flex items-center gap-1 text-[11px] text-red-500 font-semibold mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email-input" className="block text-xs font-bold">
                    Your Email Address *
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="e.g. friend@meadowplaylab.com"
                    className={`min-h-[48px] w-full px-4 py-3 rounded-2xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-[#8DBA83] transition-all ${
                      isNight ? 'bg-[#1C172B] text-white' : 'bg-[#FFF6E8] text-[#493B43]'
                    } ${errors.email ? 'border-red-400' : 'border-[#F2B8C6]/50'}`}
                  />
                  {errors.email && (
                    <div className="flex items-center gap-1 text-[11px] text-red-500 font-semibold mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold">
                  What are we talking about today?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['New Toy Idea', 'Bloop-Bug Report', 'Meadow High-Five', 'Playdate Request'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTopic(t);
                        sounds.playPop();
                      }}
                      className={`min-h-[44px] p-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                        topic === t
                          ? 'bg-[#BDE4C6] border-[#8DBA83] text-[#493B43] shadow-xs'
                          : isNight
                          ? 'bg-[#1C172B] border-[#4D3F6D] text-white/80 hover:bg-[#332B4D]'
                          : 'bg-[#FFF6E8] border-[#F2B8C6]/40 text-[#493B43]/70 hover:bg-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message-input" className="block text-xs font-bold">
                  Your Message or Toy Blueprint *
                </label>
                <textarea
                  id="message-input"
                  rows={4}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                  }}
                  placeholder="Tell Bloop what makes you giggle, how high the toy should bounce, or what color pegs you'd pick!"
                  className={`w-full px-4 py-3 rounded-2xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-[#8DBA83] transition-all ${
                    isNight ? 'bg-[#1C172B] text-white' : 'bg-[#FFF6E8] text-[#493B43]'
                  } ${errors.message ? 'border-red-400' : 'border-[#F2B8C6]/50'}`}
                />
                {errors.message && (
                  <div className="flex items-center gap-1 text-[11px] text-red-500 font-semibold mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.message}</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] opacity-80 leading-relaxed">
                ℹ️ <strong>Demo & Verification Notice:</strong> This interactive form validates inputs and presents a verified local preview. You can also send a real message directly via{' '}
                <a
                  href={`mailto:mjyogananth@gmail.com?subject=Note%20for%20Bloop:%20${encodeURIComponent(topic)}&body=${encodeURIComponent(message)}`}
                  className="font-bold text-[#8DBA83] hover:underline"
                >
                  mjyogananth@gmail.com
                </a>.
              </div>

              <div>
                <button
                  type="submit"
                  className="min-h-[48px] w-full py-4 px-6 rounded-2xl bg-[#8DBA83] hover:bg-[#7ba871] text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Note into Bloop's Mailbox</span>
                </button>
              </div>

            </form>
          ) : (
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#BDE4C6] flex items-center justify-center text-4xl shadow-md">
                💌
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-[#BDE4C6]/60 text-xs font-bold text-[#493B43]">
                Note Received in Meadow Mailbox!
              </div>

              <h2 className="font-display font-bold text-3xl">
                Thank You, {submittedData?.name}!
              </h2>

              <p className="text-sm opacity-85 max-w-md mx-auto leading-relaxed">
                Bloop caught your message with his stubby paws and gave a merry squeak! Our Meadow QA crew is already reviewing your <strong>{submittedData?.topic}</strong>.
              </p>

              <div className={`max-w-md mx-auto p-4 rounded-2xl border text-left text-xs space-y-1.5 ${
                isNight ? 'bg-[#1C172B] border-[#4D3F6D]' : 'bg-[#FFF6E8] border-[#F2B8C6]/40'
              }`}>
                <div className="font-bold flex items-center justify-between">
                  <span>Topic: {submittedData?.topic}</span>
                  <CheckCircle className="w-4 h-4 text-[#8DBA83]" />
                </div>
                <div className="opacity-80 italic">“{submittedData?.message}”</div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="min-h-[44px] px-6 py-3 rounded-2xl border text-xs font-bold hover:bg-black/5 shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Send Another Note</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
