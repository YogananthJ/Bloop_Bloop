import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import { Copy, Check, Download, Sparkles } from 'lucide-react';

interface StickerItem {
  id: string;
  theme: string;
  caption: string;
  quote: string;
  emoji: string;
  badgeColor: string;
  borderColor: string;
}

export const Stickers: React.FC = () => {
  const { mode } = useTheme();
  const isNight = mode === 'night';

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const stickers: StickerItem[] = [
    {
      id: 'happy',
      theme: 'Happy Bloop',
      caption: 'Pure Marshmallow Joy!',
      quote: '“Giggle until your whiskers tickle!”',
      emoji: '🌸',
      badgeColor: 'bg-[#F2B8C6]/30',
      borderColor: 'border-[#F2B8C6]',
    },
    {
      id: 'curious',
      theme: 'Curious Bloop',
      caption: 'What does this wooden peg do?',
      quote: '“Every button deserves a gentle boing!”',
      emoji: '🪵',
      badgeColor: 'bg-[#FFE29A]/40',
      borderColor: 'border-[#FFE29A]',
    },
    {
      id: 'surprised',
      theme: 'Surprised Bloop',
      caption: 'Boing! It squeaked three feet high!',
      quote: '“Who knew felt could bounce so much?”',
      emoji: '🎈',
      badgeColor: 'bg-[#B9DDF5]/40',
      borderColor: 'border-[#B9DDF5]',
    },
    {
      id: 'sleepy',
      theme: 'Sleepy Bloop',
      caption: 'Counting fluffy clover-sheep...',
      quote: '“Nighty-night, sweet toy kingdom.”',
      emoji: '🌙',
      badgeColor: 'bg-[#D9C8F0]/40',
      borderColor: 'border-[#D9C8F0]',
    },
    {
      id: 'engineer',
      theme: 'Engineer Bloop',
      caption: 'Debugging with wooden pegs!',
      quote: '“Measure with ribbon, tap with mallet!”',
      emoji: '🔧',
      badgeColor: 'bg-[#BDE4C6]/40',
      borderColor: 'border-[#8DBA83]',
    },
    {
      id: 'victory',
      theme: 'Victory Wiggle Bloop',
      caption: 'Bloop-Bug successfully squashed!',
      quote: '“Celebration arpeggio time!”',
      emoji: '🎉',
      badgeColor: 'bg-[#FFE29A]/50',
      borderColor: 'border-[#f5b842]',
    },
    {
      id: 'bug_detected',
      theme: 'Bloop-Bug Detected',
      caption: 'Oopsie! Time for teamwork!',
      quote: '“Every great builder finds bugs.”',
      emoji: '🐛',
      badgeColor: 'bg-[#F2B8C6]/40',
      borderColor: 'border-[#e89eae]',
    },
    {
      id: 'genius',
      theme: 'Tiny Toy Genius',
      caption: 'If it squeaks, Bloop built it!',
      quote: '“Official Meadow Play Lab Seal.”',
      emoji: '⭐',
      badgeColor: 'bg-[#BDE4C6]/50',
      borderColor: 'border-[#8DBA83]',
    },
  ];

  const handleCopyCaption = (sticker: StickerItem) => {
    sounds.playPop();
    const textToCopy = `[Bloop's Little World] ${sticker.theme}: “${sticker.caption}” — ${sticker.quote}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(sticker.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDownloadSticker = (sticker: StickerItem) => {
    sounds.playVictory();
    setDownloadingId(sticker.id);

    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setDownloadingId(null);
      return;
    }

    ctx.fillStyle = '#FFF6E8';
    ctx.beginPath();
    ctx.roundRect(10, 10, 480, 480, 40);
    ctx.fill();

    ctx.lineWidth = 8;
    ctx.strokeStyle = '#F2B8C6';
    ctx.stroke();

    ctx.setLineDash([8, 6]);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#8DBA83';
    ctx.beginPath();
    ctx.roundRect(24, 24, 452, 452, 30);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#493B43';
    ctx.font = 'bold 24px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("Bloop's Little World", 250, 70);

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(250, 200, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#FFE29A';
    ctx.stroke();

    ctx.font = '72px sans-serif';
    ctx.fillText(sticker.emoji, 250, 225);

    ctx.fillStyle = '#493B43';
    ctx.font = 'bold 26px Outfit, sans-serif';
    ctx.fillText(sticker.theme, 250, 330);

    ctx.fillStyle = '#8DBA83';
    ctx.font = 'bold 18px Plus Jakarta Sans, sans-serif';
    ctx.fillText(`“${sticker.caption}”`, 250, 365);

    ctx.fillStyle = '#7a6772';
    ctx.font = 'italic 15px Plus Jakarta Sans, sans-serif';
    ctx.fillText(sticker.quote, 250, 400);

    ctx.fillStyle = '#a6929e';
    ctx.font = '12px Plus Jakarta Sans, sans-serif';
    ctx.fillText('Official Meadow Play Lab Collectible Sticker', 250, 445);

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bloop_sticker_${sticker.id}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      setDownloadingId(null);
    }, 'image/png');
  };

  return (
    <div className={`min-h-screen py-12 transition-colors ${isNight ? 'bg-[#1C172B]' : 'bg-[#FFF6E8]'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Character Sticker Collection · Real Asset Generation</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
            Bloop's Sticker Studio
          </h1>
          <p className="text-sm sm:text-base opacity-80 max-w-xl mx-auto">
            Collect all 8 official Bloop moment badges. Copy captions or download the real collectible 500x500 PNG badge files!
          </p>
        </div>

        {/* 8 STICKERS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stickers.map((sticker) => (
            <div
              key={sticker.id}
              className={`p-6 rounded-3xl border-2 ${sticker.borderColor} shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between ${
                isNight ? 'bg-[#27213C]' : 'bg-white'
              }`}
            >
              <div>
                <div className={`w-full aspect-square rounded-2xl ${sticker.badgeColor} border border-black/5 flex flex-col items-center justify-center p-4 mb-4 relative overflow-hidden group`}>
                  <div className="text-6xl group-hover:scale-115 transition-transform duration-300 drop-shadow-xs">
                    {sticker.emoji}
                  </div>
                  <div className="mt-3 px-3 py-1 bg-white/90 text-[#493B43] rounded-full text-[11px] font-extrabold shadow-xs">
                    {sticker.theme}
                  </div>
                </div>

                <h3 className="font-display font-bold text-base mb-1">
                  {sticker.caption}
                </h3>
                <p className="text-xs opacity-70 italic leading-relaxed mb-4">
                  {sticker.quote}
                </p>
              </div>

              <div className="pt-3 border-t border-black/5 dark:border-white/10 flex gap-2">
                <button
                  onClick={() => handleCopyCaption(sticker)}
                  title="Copy sticker caption"
                  className={`min-h-[44px] flex-1 py-2 px-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                    isNight
                      ? 'bg-[#1C172B] border-[#4D3F6D] text-white'
                      : 'bg-[#FFF6E8] border-[#F2B8C6] text-[#493B43]'
                  }`}
                >
                  {copiedId === sticker.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#8DBA83]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 opacity-70" />
                      <span>Caption</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownloadSticker(sticker)}
                  title="Download real PNG sticker badge"
                  disabled={downloadingId === sticker.id}
                  className="min-h-[44px] flex-1 py-2 px-2.5 rounded-2xl bg-[#8DBA83] hover:bg-[#7ba871] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadingId === sticker.id ? 'Saving...' : 'PNG'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={`p-4 rounded-2xl border text-center text-xs opacity-75 max-w-lg mx-auto ${
          isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/30'
        }`}>
          ✨ Real PNG badges are generated locally via HTML5 Canvas with official felt borders.
        </div>

      </div>
    </div>
  );
};
