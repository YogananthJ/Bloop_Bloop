import React from 'react';
import { TabType } from './Navbar';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Heart, ArrowUp } from 'lucide-react';
import { sounds } from '../utils/audio';

interface FooterProps {
  onSelectTab: (tab: TabType) => void;
  onTriggerEasterEgg: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onTriggerEasterEgg }) => {
  const { mode } = useTheme();
  const isNight = mode === 'night';

  const scrollToTop = () => {
    sounds.playPop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={`border-t pt-12 pb-10 transition-colors ${
        isNight
          ? 'bg-[#151222] border-[#4D3F6D]/50 text-[#F3ECF8]'
          : 'bg-[#FFF6E8] border-[#F2B8C6]/40 text-[#493B43]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Tagline */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🦛</span>
              <span className="font-display font-bold text-lg">
                Bloop's Little World
              </span>
            </div>
            <p className="text-sm italic opacity-85">
              “If it squeaks, bounces, or makes you laugh, Bloop built it!”
            </p>
            <p className="text-xs opacity-70 leading-relaxed">
              Meadow Play Lab · Cozy Clover Meadow. Handcrafted interactive character portfolio with real Web Audio synthesizer, nightlight beam, and dream delivery map.
            </p>
          </div>

          {/* Tier 3 & Tier 2 Interactive Features */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider mb-3 text-[#8DBA83]">
              Tier 3 & 2 Features
            </h4>
            <ul className="space-y-2 text-xs opacity-80 font-medium">
              <li>
                <button
                  onClick={() => onSelectTab('meet3d')}
                  className="hover:text-[#8DBA83] transition-colors cursor-pointer min-h-[32px] flex items-center"
                >
                  🧊 Meet Bloop in 3D (WebGL)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('guestbook')}
                  className="hover:text-[#8DBA83] transition-colors cursor-pointer min-h-[32px] flex items-center"
                >
                  💌 Live Dream Guestbook
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('chat')}
                  className="hover:text-[#8DBA83] transition-colors cursor-pointer min-h-[32px] flex items-center"
                >
                  💬 Talk to Bloop (Chatbot)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('lullaby')}
                  className="hover:text-[#8DBA83] transition-colors cursor-pointer min-h-[32px] flex items-center"
                >
                  🎵 Lullaby Lab (Real Synth)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('dreamlight')}
                  className="hover:text-[#8DBA83] transition-colors cursor-pointer min-h-[32px] flex items-center"
                >
                  🔦 Dreamlight Explorer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('delivery')}
                  className="hover:text-[#8DBA83] transition-colors cursor-pointer min-h-[32px] flex items-center"
                >
                  🗺️ Dream Delivery Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('dreamblocks')}
                  className="hover:text-[#8DBA83] transition-colors cursor-pointer min-h-[32px] flex items-center"
                >
                  🧱 Stack Dream Blocks
                </button>
              </li>
            </ul>
          </div>

          {/* Tier 1 Portfolio & Lab */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider mb-3 text-[#8DBA83]">
              Portfolio & Lab
            </h4>
            <ul className="space-y-2 text-xs opacity-80 font-medium">
              <li>
                <button
                  onClick={() => onSelectTab('about')}
                  className="hover:text-[#8DBA83] transition-colors cursor-pointer min-h-[32px] flex items-center"
                >
                  About Bloop & Dossier
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('playlab')}
                  className="hover:text-[#8DBA83] transition-colors cursor-pointer min-h-[32px] flex items-center"
                >
                  Play Lab (4 Toy Sandboxes)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('outfits')}
                  className="hover:text-[#8DBA83] transition-colors cursor-pointer min-h-[32px] flex items-center"
                >
                  Outfit & Tool Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('gallery')}
                  className="hover:text-[#8DBA83] transition-colors cursor-pointer min-h-[32px] flex items-center"
                >
                  Art Gallery & Lightbox
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('friends')}
                  className="hover:text-[#8DBA83] transition-colors cursor-pointer min-h-[32px] flex items-center"
                >
                  Developer Friends Crew
                </button>
              </li>
            </ul>
          </div>

          {/* Collectibles & Contact */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider mb-3 text-[#8DBA83]">
              Fun & Notes
            </h4>
            <ul className="space-y-2 text-xs opacity-80 font-medium">
              <li>
                <button
                  onClick={() => onSelectTab('stickers')}
                  className="hover:text-[#8DBA83] transition-colors cursor-pointer min-h-[32px] flex items-center"
                >
                  Character Stickers Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('contact')}
                  className="hover:text-[#8DBA83] transition-colors cursor-pointer min-h-[32px] flex items-center"
                >
                  Send a Note to Bloop
                </button>
              </li>
              <li>
                <button
                  onClick={onTriggerEasterEgg}
                  className="hover:text-[#8DBA83] transition-colors flex items-center gap-1 cursor-pointer text-[#8DBA83] min-h-[32px]"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Hidden Bloop-Bug Secret</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Back to Top */}
        <div className="pt-6 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-70">
          <div>
            © {new Date().getFullYear()} Bloop's Little World. Handcrafted with plush felt & tactile care.
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span>Built with love & soft giggles</span>
              <Heart className="w-3.5 h-3.5 text-[#F2B8C6] fill-[#F2B8C6]" />
            </div>
            <button
              onClick={scrollToTop}
              title="Return to top"
              className="min-h-[44px] min-w-[44px] p-2 rounded-xl border border-current/20 hover:border-[#8DBA83] hover:text-[#8DBA83] transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
