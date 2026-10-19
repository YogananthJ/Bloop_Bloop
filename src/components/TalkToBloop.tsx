import React, { useState, useEffect, useRef } from 'react';
import { ASSETS } from '../utils/assets';
import { sounds } from '../utils/audio';
import { visitorMemory } from '../utils/visitorMemory';
import { useTheme } from '../context/ThemeContext';
import {
  MessageSquare,
  Send,
  Sparkles,
  RotateCcw,
  Bot,
  User,
  Wrench,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bloop' | 'user';
  text: string;
  timestamp: string;
}

export const TalkToBloop: React.FC = () => {
  const { mode } = useTheme();
  const isNight = mode === 'night';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activeEngineMode, setActiveEngineMode] = useState<'ai' | 'rule-based'>('ai');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const profile = visitorMemory.getProfile();
  const visitorName = profile.nickname || 'Friend';

  // Suggested Prompts
  const suggestedQuestions = [
    'What are you building today?',
    'Tell me about the Wooden Code Board.',
    'How do you fix a toy?',
    'Can you tell me a bedtime story?',
    'What do your friends do?',
  ];

  // Initialize with Bloop's warm welcome
  useEffect(() => {
    const greetingText = profile.nickname
      ? `*boing-boing!* Yay, ${profile.nickname}! Welcome back to Meadow Play Lab! I have my mint apron on and chamomile tea brewing. What shall we tinker with today? *gentle belly squeak*`
      : `*boing-boing!* Hello friend! I'm Bloop, the Marshmallow Hippo and Junior Play Engineer at Meadow Play Lab! What would you like to explore or build together? *happy ear wiggle*`;

    setMessages([
      {
        id: 'msg-welcome',
        sender: 'bloop',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, []);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Send Message Handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    sounds.playPop();
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          nickname: profile.nickname,
          history: messages.slice(-6).map((m) => ({ role: m.sender, content: m.text })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      setActiveEngineMode(data.mode === 'ai' ? 'ai' : 'rule-based');

      // Add Bloop's response with subtle sound
      setTimeout(() => {
        const bloopReply = data.reply || '*squeak!* Bloop agrees with high cheerful bounces!';
        setMessages((prev) => [
          ...prev,
          {
            id: 'bloop-' + Date.now(),
            sender: 'bloop',
            text: bloopReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsTyping(false);
        sounds.playSqueak();
      }, 400);
    } catch (err) {
      console.warn('API chat failed, using local rule-based engine:', err);
      setActiveEngineMode('rule-based');

      // Local rule-based fallback
      setTimeout(() => {
        const fallbackReply = generateClientBloopReply(text, profile.nickname);
        setMessages((prev) => [
          ...prev,
          {
            id: 'bloop-' + Date.now(),
            sender: 'bloop',
            text: fallbackReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsTyping(false);
        sounds.playSqueak();
      }, 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    sounds.playPop();
    const greetingText = profile.nickname
      ? `*boing-boing!* Fresh workbench cleared for ${profile.nickname}! Let's build a whole new toy! What are you thinking?`
      : `*boing-boing!* Fresh cedar workbench ready! What shall we dream up next, friend?`;

    setMessages([
      {
        id: 'msg-' + Date.now(),
        sender: 'bloop',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className={`min-h-screen py-12 transition-colors ${isNight ? 'bg-[#1C172B]' : 'bg-[#FFF6E8]'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>Tier 3 Feature 04 · Conversational Character Chat</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
            Talk to Bloop
          </h1>
          <p className="text-sm sm:text-base opacity-80 max-w-xl mx-auto">
            Chat live with Bloop the Marshmallow Hippo! Ask about toy inventions, how to fix Bloop-Bugs, or listen to a gentle meadow bedtime tale.
          </p>
        </div>

        {/* CHAT STATUS & CONTROL BAR */}
        <div
          className={`p-3.5 sm:p-4 rounded-3xl border shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs ${
            isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">
              Mode:{' '}
              <strong className="text-[#8DBA83]">
                {activeEngineMode === 'ai' ? 'Meadow AI Model (Gemini Flash)' : 'Rule-Based Character Engine'}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {profile.nickname && (
              <span className="text-[11px] opacity-75 hidden sm:inline">
                Talking to: <strong>{profile.nickname}</strong>
              </span>
            )}
            <button
              onClick={handleResetChat}
              className="px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-bold hover:bg-black/5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Conversation</span>
            </button>
          </div>
        </div>

        {/* SUGGESTED PROMPTS PILLS */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#8DBA83] flex items-center gap-1 mr-1">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Try asking:</span>
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className={`min-h-[36px] px-3 py-1.5 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                isNight
                  ? 'bg-[#27213C] border-[#4D3F6D] text-[#F3ECF8] hover:border-[#8DBA83]'
                  : 'bg-white border-[#F2B8C6] text-[#493B43] hover:border-[#8DBA83] hover:bg-[#F2B8C6]/15'
              }`}
            >
              {q}
            </button>
          ))}
        </div>

        {/* CHAT CONTAINER */}
        <div
          className={`rounded-3xl border-2 shadow-2xl flex flex-col h-[560px] overflow-hidden ${
            isNight ? 'bg-[#151222] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/50'
          }`}
        >
          {/* Message Thread */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isBloop = msg.sender === 'bloop';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isBloop ? 'justify-start' : 'justify-end'}`}
                >
                  {/* Bloop Avatar */}
                  {isBloop && (
                    <div className="w-10 h-10 rounded-2xl overflow-hidden shrink-0 border border-[#F2B8C6] shadow-xs">
                      <img
                        src={ASSETS.bloopHero}
                        alt="Bloop avatar"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Speech Bubble */}
                  <div
                    className={`max-w-[82%] sm:max-w-[70%] p-4 rounded-3xl text-xs sm:text-sm leading-relaxed space-y-1 shadow-xs ${
                      isBloop
                        ? isNight
                          ? 'bg-[#27213C] text-[#F3ECF8] border border-[#4D3F6D] rounded-tl-xs'
                          : 'bg-[#FFF6E8] text-[#493B43] border border-[#FFE29A] rounded-tl-xs'
                        : 'bg-[#8DBA83] text-white rounded-tr-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[10px] font-bold opacity-60 mb-0.5">
                      <span>{isBloop ? 'Bloop-Bloop' : visitorName}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  {/* User Avatar */}
                  {!isBloop && (
                    <div className="w-10 h-10 rounded-2xl bg-[#FFE29A] text-[#854D0E] font-bold flex items-center justify-center shrink-0 shadow-xs">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl overflow-hidden shrink-0 border border-[#F2B8C6]">
                  <img
                    src={ASSETS.bloopHero}
                    alt="Bloop avatar"
                    className="w-full h-full object-cover animate-bounce-toy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div
                  className={`p-3.5 rounded-3xl text-xs flex items-center gap-2 rounded-tl-xs ${
                    isNight ? 'bg-[#27213C] text-white' : 'bg-[#FFF6E8] text-[#493B43]'
                  }`}
                >
                  <span className="opacity-70">Bloop is thinking of a squeaky idea...</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8DBA83] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8DBA83] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8DBA83] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div
            className={`p-3 sm:p-4 border-t flex items-center gap-2 ${
              isNight ? 'bg-[#1C172B] border-[#4D3F6D]' : 'bg-[#FFF9F2] border-[#F2B8C6]/40'
            }`}
          >
            <textarea
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Bloop anything (e.g. How does the wooden code board work?)..."
              className={`flex-1 px-4 py-3 rounded-2xl border text-xs sm:text-sm font-medium resize-none focus:outline-hidden focus:ring-2 focus:ring-[#8DBA83] max-h-24 ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D] text-white' : 'bg-white border-[#F2B8C6]'
              }`}
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isTyping}
              className="min-h-[48px] px-5 py-3 rounded-2xl bg-[#8DBA83] text-white font-bold text-xs hover:bg-[#7ba871] shadow-xs active:scale-95 disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              aria-label="Send message to Bloop"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// Client-side rule-based character engine fallback
function generateClientBloopReply(query: string, nickname?: string): string {
  const q = query.toLowerCase();
  const name = nickname ? ` ${nickname}` : ' friend';

  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return `*boing-boing!* Hello${name}! Bloop is giving a happy marshmallow wiggle! What fun project shall we create together today?`;
  }
  if (q.includes('building') || q.includes('working') || q.includes('project')) {
    return `Right now in the Play Lab, I am polishing the Cloud-Boing Trampoline! We added dandelion cotton tufts so it gives the springiest, softest bounce in the meadow: *boing!*`;
  }
  if (q.includes('code board') || q.includes('wooden') || q.includes('peg')) {
    return `The Wooden Code Board is so fun! We slot in pastel colored pegs—green for gentle hums, yellow for musical giggles, and blue for chime bells! No screens, just squishy, clicky wooden engineering!`;
  }
  if (q.includes('fix') || q.includes('broken') || q.includes('bug')) {
    return `In Meadow Play Lab, broken toys are called Bloop-Bugs! We don't get upset; we sip chamomile tea, add softer felt washers, and turn every rattle into a cheerful chime!`;
  }
  if (q.includes('friend') || q.includes('pickle') || q.includes('pip') || q.includes('luna')) {
    return `My meadow crew is the best! Pickle the duckling wears mismatched knitted socks, Pip-Squawk wears round wooden spectacles, Luna loves star-lanterns, and Mama Willow gives the warmest hugs!`;
  }
  if (q.includes('story') || q.includes('bedtime') || q.includes('sleep')) {
    return `*yawns softly and wiggles ears* Once upon a twilight, a tiny chime train steamed over the clover hill, delivering star-lanterns to sleeping hedgehogs. Snuggle warm and dream happy dreams${name}!`;
  }
  if (q.includes('squeak') || q.includes('belly') || q.includes('marshmallow')) {
    return `*squeeeaaak!* Bloop's tummy is plush and squishy! Tap my portrait on the Home page anytime for an extra squeak!`;
  }

  return `*curious ear wiggle* What a wonderfully creative question${name}! In our workshop, every question is the start of a new playful adventure. Let's test it out together! *boing-boing!*`;
}
