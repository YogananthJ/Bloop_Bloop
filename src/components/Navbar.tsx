import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Menu,
  X,
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  Home as HomeIcon,
  Compass,
  Sparkle,
  Heart,
  Palette,
  Users,
  Image,
  Sticker,
  Mail,
  Box,
  Music,
  Flashlight,
  Package,
  Trophy,
  BookOpen,
  MessageSquare,
  Info,
} from 'lucide-react';
import { sounds } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

export type TabType =
  | 'home'
  | 'meet3d'
  | 'guestbook'
  | 'chat'
  | 'lullaby'
  | 'dreamlight'
  | 'delivery'
  | 'dreamblocks'
  | 'storybook'
  | 'playlab'
  | 'about'
  | 'outfits'
  | 'gallery'
  | 'friends'
  | 'stickers'
  | 'contact';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onTriggerEasterEgg?: () => void;
}

interface DestinationItem {
  id: TabType;
  label: string;
  shortLabel?: string;
  desc?: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onTriggerEasterEgg,
}) => {
  const { mode, toggleMode } = useTheme();
  const isNight = mode === 'night';
  const [isMuted, setIsMuted] = useState(sounds.isMuted());

  // Dropdown States for Desktop
  const [openDropdown, setOpenDropdown] = useState<'meadow' | 'experiences' | null>(null);
  const meadowDropdownRef = useRef<HTMLDivElement>(null);
  const experiencesDropdownRef = useRef<HTMLDivElement>(null);

  // Mobile Drawer State & Accordions
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState<{
    meadow: boolean;
    experiences: boolean;
  }>({
    meadow: false,
    experiences: false,
  });

  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // -------------------------------------------------------------
  // DESTINATION DEFINITIONS (Grouped Exactly per Specification)
  // -------------------------------------------------------------

  // Group 1: Explore the Meadow
  const exploreMeadowItems: DestinationItem[] = [
    {
      id: 'about',
      label: 'About Bloop Dossier',
      shortLabel: 'About Bloop',
      desc: 'Character specs, bio & meadow lore',
      icon: <Info className="w-4 h-4 text-[#8DBA83]" />,
    },
    {
      id: 'outfits',
      label: 'Outfit Studio',
      shortLabel: 'Outfits',
      desc: 'Aprons, sleep-caps & concept artwork',
      icon: <Palette className="w-4 h-4 text-[#F2B8C6]" />,
    },
    {
      id: 'playlab',
      label: 'Play Lab (4 Toys)',
      shortLabel: 'Play Lab',
      desc: 'Tactile interactive toy sandbox',
      icon: <Compass className="w-4 h-4 text-[#FFE29A]" />,
      badge: '4 Toys',
    },
    {
      id: 'friends',
      label: 'Friends Crew',
      shortLabel: 'Friends',
      desc: 'Pickle, Pip-Squawk, Luna & Mama Willow',
      icon: <Users className="w-4 h-4 text-[#BDE4C6]" />,
    },
    {
      id: 'gallery',
      label: 'Art Gallery & Lightbox',
      shortLabel: 'Art Gallery',
      desc: 'Storybook illustrations & crew portrait',
      icon: <Image className="w-4 h-4 text-[#D9C8F0]" />,
    },
    {
      id: 'stickers',
      label: 'Character Stickers',
      shortLabel: 'Stickers',
      desc: 'Collect & copy tactile meadow badges',
      icon: <Sticker className="w-4 h-4 text-[#FFE29A]" />,
    },
    {
      id: 'contact',
      label: 'Contact Bloop',
      shortLabel: 'Contact',
      desc: 'Send a note or new toy suggestion',
      icon: <Mail className="w-4 h-4 text-[#B9DDF5]" />,
    },
  ];

  // Group 2: Special Experiences
  const specialExperiencesItems: DestinationItem[] = [
    {
      id: 'meet3d',
      label: 'Meet Bloop in 3D (WebGL)',
      shortLabel: '3D Bloop',
      desc: 'Dedicated 3D viewport with camera orbit',
      icon: <Box className="w-4 h-4 text-[#8DBA83]" />,
      badge: 'WebGL',
    },
    {
      id: 'lullaby',
      label: 'Lullaby Lab (Real Synth)',
      shortLabel: 'Lullaby Lab',
      desc: 'Web Audio music box melodies & BPM control',
      icon: <Music className="w-4 h-4 text-[#D9C8F0]" />,
      badge: 'Synth',
    },
    {
      id: 'dreamlight',
      label: 'Dreamlight Explorer (Nightlight)',
      shortLabel: 'Dreamlight',
      desc: 'Flashlight beam discovering meadow secrets',
      icon: <Flashlight className="w-4 h-4 text-[#FFE29A]" />,
      badge: 'Nightlight',
    },
    {
      id: 'delivery',
      label: 'Dream Delivery Map (Scroll Sync)',
      shortLabel: 'Delivery Map',
      desc: 'Animated SVG meadow route with 5 stops',
      icon: <Package className="w-4 h-4 text-[#B9DDF5]" />,
      badge: 'Scroll Sync',
    },
    {
      id: 'dreamblocks',
      label: 'Stack Dream Blocks (Mini-Game)',
      shortLabel: 'Stack Blocks',
      desc: 'Tactile stacking game with 3 difficulty modes',
      icon: <Trophy className="w-4 h-4 text-[#F2B8C6]" />,
      badge: 'Mini-Game',
    },
    {
      id: 'storybook',
      label: 'Interactive Storybook (3D Page Turn)',
      shortLabel: 'Storybook',
      desc: 'Full-page animated origin story book',
      icon: <BookOpen className="w-4 h-4 text-[#8DBA83]" />,
      badge: '3D Page',
    },
    {
      id: 'guestbook',
      label: 'Live Dream Guestbook (Database)',
      shortLabel: 'Guestbook',
      desc: 'Shared persistent dreams with star themes',
      icon: <Heart className="w-4 h-4 text-[#F2B8C6]" />,
      badge: 'Database',
    },
    {
      id: 'chat',
      label: 'Talk to Bloop (Character Chat)',
      shortLabel: 'Talk to Bloop',
      desc: 'Chat with Bloop the Play Engineer',
      icon: <MessageSquare className="w-4 h-4 text-[#B9DDF5]" />,
      badge: 'Chatbot',
    },
  ];

  const isMeadowActive = exploreMeadowItems.some((item) => item.id === currentTab);
  const isExperiencesActive = specialExperiencesItems.some((item) => item.id === currentTab);

  // -------------------------------------------------------------
  // CONTROLS HANDLERS
  // -------------------------------------------------------------
  const handleToggleSound = () => {
    const nextState = sounds.toggleMute();
    setIsMuted(nextState);
    if (!nextState) {
      sounds.playSqueak();
    }
  };

  const handleToggleTheme = () => {
    sounds.playPop();
    toggleMode();
  };

  const handleSqueakBloop = () => {
    sounds.playSqueak();
    if (onTriggerEasterEgg) {
      onTriggerEasterEgg();
    }
  };

  const handleNavigate = (tab: TabType) => {
    sounds.playPop();
    onSelectTab(tab);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  // -------------------------------------------------------------
  // OUTSIDE CLICK & ESCAPE KEY LISTENERS
  // -------------------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        meadowDropdownRef.current &&
        !meadowDropdownRef.current.contains(target) &&
        experiencesDropdownRef.current &&
        !experiencesDropdownRef.current.contains(target)
      ) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
          sounds.playPop();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // -------------------------------------------------------------
  // BACKGROUND SCROLL LOCK DURING MOBILE DRAWER OPEN
  // -------------------------------------------------------------
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Auto-focus close button when drawer opens for accessibility
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  const toggleAccordion = (group: 'meadow' | 'experiences') => {
    sounds.playPop();
    setExpandedAccordions((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 shadow-xs ${
        isNight
          ? 'bg-[#1C172B]/92 border-[#4D3F6D]/50 text-[#F3ECF8]'
          : 'bg-[#FFF6E8]/92 border-[#F2B8C6]/40 text-[#493B43]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* ========================================================= */}
        {/* LEFT: ORIGINAL BLOOP LOGO & TITLE WORDMARK               */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-2 sm:gap-2.5 group text-left cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8DBA83] rounded-2xl p-1 transition-transform active:scale-95"
            aria-label="Bloop's Little World - Return to Home"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F2B8C6] flex items-center justify-center text-lg sm:text-xl shadow-xs group-hover:scale-105 transition-transform shrink-0 border border-white/40">
              🦛
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base sm:text-lg lg:text-xl tracking-tight transition-colors whitespace-nowrap block group-hover:text-[#8DBA83] leading-none">
                Bloop’s Little World
              </span>
              <span className="text-[10px] text-[#8DBA83] font-bold tracking-wider uppercase hidden sm:block mt-0.5">
                Meadow Play Lab
              </span>
            </div>
          </button>
        </div>

        {/* ========================================================= */}
        {/* CENTER: DESKTOP COMPACT HORIZONTAL NAVIGATION             */}
        {/* Fits cleanly from 1024px up without wrapping or clipping  */}
        {/* ========================================================= */}
        <nav
          className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold"
          aria-label="Desktop Navigation"
        >
          {/* 1. Home Direct Link */}
          <button
            onClick={() => handleNavigate('home')}
            className={`relative px-3 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8DBA83] ${
              currentTab === 'home'
                ? 'font-bold text-[#8DBA83] bg-[#8DBA83]/15'
                : isNight
                ? 'text-[#B8A9C9] hover:text-white hover:bg-white/5'
                : 'text-[#493B43]/80 hover:text-[#493B43] hover:bg-[#F2B8C6]/20'
            }`}
          >
            <HomeIcon className="w-3.5 h-3.5" />
            <span>Home</span>
            {currentTab === 'home' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#8DBA83]" />
            )}
          </button>

          {/* 2. About Bloop Direct Link */}
          <button
            onClick={() => handleNavigate('about')}
            className={`relative px-3 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8DBA83] ${
              currentTab === 'about'
                ? 'font-bold text-[#8DBA83] bg-[#8DBA83]/15'
                : isNight
                ? 'text-[#B8A9C9] hover:text-white hover:bg-white/5'
                : 'text-[#493B43]/80 hover:text-[#493B43] hover:bg-[#F2B8C6]/20'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>About Bloop</span>
            {currentTab === 'about' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#8DBA83]" />
            )}
          </button>

          {/* 3. Play Lab Direct Link */}
          <button
            onClick={() => handleNavigate('playlab')}
            className={`relative px-3 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8DBA83] ${
              currentTab === 'playlab'
                ? 'font-bold text-[#8DBA83] bg-[#8DBA83]/15'
                : isNight
                ? 'text-[#B8A9C9] hover:text-white hover:bg-white/5'
                : 'text-[#493B43]/80 hover:text-[#493B43] hover:bg-[#F2B8C6]/20'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Play Lab</span>
            {currentTab === 'playlab' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#8DBA83]" />
            )}
          </button>

          {/* 4. Friends & Gallery (Explore the Meadow Dropdown) */}
          <div className="relative" ref={meadowDropdownRef}>
            <button
              onClick={() => {
                sounds.playPop();
                setOpenDropdown(openDropdown === 'meadow' ? null : 'meadow');
              }}
              aria-expanded={openDropdown === 'meadow'}
              aria-haspopup="true"
              className={`relative px-3 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8DBA83] ${
                isMeadowActive
                  ? 'font-bold text-[#8DBA83] bg-[#8DBA83]/15'
                  : isNight
                  ? 'text-[#B8A9C9] hover:text-white hover:bg-white/5'
                  : 'text-[#493B43]/80 hover:text-[#493B43] hover:bg-[#F2B8C6]/20'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Friends & Gallery</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === 'meadow' ? 'rotate-180' : ''
                }`}
              />
              {isMeadowActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#8DBA83]" />
              )}
            </button>

            {/* Dropdown Menu Panel */}
            {openDropdown === 'meadow' && (
              <div
                className={`absolute left-0 top-full mt-2 w-72 rounded-2xl border-2 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  isNight
                    ? 'bg-[#27213C] border-[#4D3F6D] text-white shadow-black/50'
                    : 'bg-white border-[#F2B8C6]/50 text-[#493B43] shadow-stone-300/50'
                }`}
              >
                <div className="px-3 py-1.5 mb-1 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#8DBA83] uppercase tracking-wider">
                    Explore the Meadow
                  </span>
                  <span className="text-[10px] opacity-60">7 destinations</span>
                </div>

                <div className="space-y-0.5">
                  {exploreMeadowItems.map((item) => {
                    const isSelected = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 min-h-[40px] ${
                          isSelected
                            ? 'bg-[#8DBA83]/20 text-[#8DBA83] font-bold'
                            : isNight
                            ? 'hover:bg-[#342C4E] text-[#E8DDF2]'
                            : 'hover:bg-[#F2B8C6]/15 text-[#493B43]'
                        }`}
                      >
                        <span className="shrink-0">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold truncate flex items-center gap-1.5">
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#FFE29A] text-[#854D0E] font-bold">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.desc && (
                            <div className="text-[10px] opacity-60 truncate">
                              {item.desc}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#8DBA83] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 5. Dream Experiences Dropdown */}
          <div className="relative" ref={experiencesDropdownRef}>
            <button
              onClick={() => {
                sounds.playPop();
                setOpenDropdown(openDropdown === 'experiences' ? null : 'experiences');
              }}
              aria-expanded={openDropdown === 'experiences'}
              aria-haspopup="true"
              className={`relative px-3 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8DBA83] ${
                isExperiencesActive
                  ? 'font-bold text-[#8DBA83] bg-[#8DBA83]/15'
                  : isNight
                  ? 'text-[#B8A9C9] hover:text-white hover:bg-white/5'
                  : 'text-[#493B43]/80 hover:text-[#493B43] hover:bg-[#F2B8C6]/20'
              }`}
            >
              <Sparkle className="w-3.5 h-3.5 text-[#FFE29A]" />
              <span>Dream Experiences</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === 'experiences' ? 'rotate-180' : ''
                }`}
              />
              {isExperiencesActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#8DBA83]" />
              )}
            </button>

            {/* Dropdown Menu Panel (Two-Column Layout for 8 Experiences) */}
            {openDropdown === 'experiences' && (
              <div
                className={`absolute right-0 lg:left-0 top-full mt-2 w-84 sm:w-96 rounded-2xl border-2 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  isNight
                    ? 'bg-[#27213C] border-[#4D3F6D] text-white shadow-black/50'
                    : 'bg-white border-[#F2B8C6]/50 text-[#493B43] shadow-stone-300/50'
                }`}
              >
                <div className="px-3 py-1.5 mb-1.5 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#8DBA83] uppercase tracking-wider">
                    Special Experiences
                  </span>
                  <span className="text-[10px] opacity-60">8 interactive worlds</span>
                </div>

                <div className="space-y-0.5 max-h-[65vh] overflow-y-auto pr-1">
                  {specialExperiencesItems.map((item) => {
                    const isSelected = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 min-h-[42px] ${
                          isSelected
                            ? 'bg-[#8DBA83]/20 text-[#8DBA83] font-bold'
                            : isNight
                            ? 'hover:bg-[#342C4E] text-[#E8DDF2]'
                            : 'hover:bg-[#F2B8C6]/15 text-[#493B43]'
                        }`}
                      >
                        <span className="shrink-0">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold truncate flex items-center justify-between gap-1">
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#FFE29A] text-[#854D0E] font-bold shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.desc && (
                            <div className="text-[10px] opacity-60 truncate">
                              {item.desc}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#8DBA83] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* ========================================================= */}
        {/* RIGHT: CONTROLS & MOBILE HAMBURGER BUTTON                 */}
        {/* ========================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Day / Night Mood Toggle */}
          <button
            onClick={handleToggleTheme}
            aria-label={isNight ? 'Switch to Day Mode' : 'Switch to Moonlight Mode'}
            title={isNight ? 'Switch to Day Mode' : 'Switch to Moonlight Mode'}
            className={`min-w-[40px] sm:min-w-[44px] min-h-[40px] sm:min-h-[44px] p-2 sm:p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-1.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8DBA83] ${
              isNight
                ? 'bg-[#2A233D] border-[#FFE29A]/50 text-[#FFE29A] hover:bg-[#382F52]'
                : 'bg-white border-[#F2B8C6] text-[#493B43] hover:bg-[#F2B8C6]/20'
            }`}
          >
            {isNight ? (
              <Moon className="w-4 h-4 fill-[#FFE29A]" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
            )}
            <span className="hidden xl:inline text-xs font-bold">
              {isNight ? 'Moonlight' : 'Day Mode'}
            </span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? 'Unmute website audio' : 'Mute website audio'}
            title={isMuted ? 'Unmute website audio' : 'Mute website audio'}
            className={`min-w-[40px] sm:min-w-[44px] min-h-[40px] sm:min-h-[44px] p-2 sm:p-2.5 rounded-2xl border transition-colors cursor-pointer flex items-center justify-center focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8DBA83] ${
              isNight
                ? 'bg-[#2A233D] border-[#4D3F6D] text-[#F3ECF8] hover:bg-[#382F52]'
                : 'bg-white border-[#F2B8C6] text-[#493B43] hover:bg-[#F2B8C6]/20'
            }`}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 opacity-50" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#8DBA83]" />
            )}
          </button>

          {/* Squeak Bloop / Play Easter Egg Button (Desktop & Tablet) */}
          <button
            onClick={handleSqueakBloop}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] sm:min-h-[44px] text-xs font-bold text-[#493B43] bg-[#BDE4C6] border border-[#8DBA83]/30 rounded-2xl hover:bg-[#A9DAC4] hover:shadow-xs active:scale-95 transition-all whitespace-nowrap cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8DBA83]"
            title="Squeak Bloop's belly for gentle toy sounds!"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#493B43]" />
            <span>Squeak Bloop</span>
          </button>

          {/* Mobile & Tablet Drawer Hamburger Toggle */}
          <button
            onClick={() => {
              sounds.playPop();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className={`lg:hidden min-w-[40px] sm:min-w-[44px] min-h-[40px] sm:min-h-[44px] p-2 sm:p-2.5 rounded-2xl border transition-colors flex items-center justify-center cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8DBA83] ${
              isNight
                ? 'bg-[#2A233D] border-[#4D3F6D] text-white hover:bg-[#382F52]'
                : 'bg-white border-[#F2B8C6] text-[#493B43] hover:bg-[#F2B8C6]/20'
            }`}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE NAVIGATION DRAWER (ACCORDION ARCHITECTURE)          */}
      {/* Layered overlay with backdrop, independent scroll & ESC   */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="fixed inset-0 z-[9999] lg:hidden flex justify-end w-full h-[100dvh] overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
        >
          {/* Backdrop Layer */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => {
              sounds.playPop();
              setMobileMenuOpen(false);
            }}
            aria-hidden="true"
          />

          {/* Drawer Slide-In Panel */}
          <div
            ref={drawerRef}
            className={`relative z-10 w-full max-w-none sm:max-w-md h-full flex flex-col shadow-2xl border-l transition-transform duration-300 animate-in slide-in-from-right overflow-hidden ${
              isNight
                ? 'bg-[#1C172B] border-[#4D3F6D] text-[#F3ECF8]'
                : 'bg-[#FFF6E8] border-[#F2B8C6] text-[#493B43]'
            }`}
          >
            {/* Drawer Header (Fixed at top of drawer) */}
            <div
              className={`px-4 py-3.5 border-b flex items-center justify-between shrink-0 ${
                isNight
                  ? 'border-[#4D3F6D]/50 bg-[#221C35]'
                  : 'border-[#F2B8C6]/40 bg-[#FFF2DE]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#F2B8C6] flex items-center justify-center text-base shadow-xs shrink-0 border border-white/40">
                  🦛
                </div>
                <div>
                  <div className="font-display font-extrabold text-sm tracking-tight leading-tight">
                    Bloop’s Little World
                  </div>
                  <div className="text-[10px] text-[#8DBA83] font-bold uppercase tracking-wider">
                    Navigation Drawer
                  </div>
                </div>
              </div>

              <button
                ref={closeButtonRef}
                onClick={() => {
                  sounds.playPop();
                  setMobileMenuOpen(false);
                }}
                className={`min-w-[44px] min-h-[44px] p-2 rounded-xl flex items-center justify-center border transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8DBA83] ${
                  isNight
                    ? 'border-[#4D3F6D] text-white hover:bg-white/10'
                    : 'border-[#F2B8C6] text-[#493B43] hover:bg-[#F2B8C6]/20'
                }`}
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-3">
              
              {/* Top Item: Home Direct Button */}
              <button
                onClick={() => handleNavigate('home')}
                className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-between min-h-[48px] cursor-pointer border ${
                  currentTab === 'home'
                    ? 'bg-[#8DBA83] text-white border-[#7BA871] shadow-sm'
                    : isNight
                    ? 'bg-[#27213C] border-[#4D3F6D]/60 text-[#F3ECF8] hover:bg-[#332B4D]'
                    : 'bg-white border-[#F2B8C6]/50 text-[#493B43] hover:bg-[#F2B8C6]/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="p-1.5 rounded-xl bg-white/20">
                    <HomeIcon className="w-4 h-4" />
                  </span>
                  <span>Home</span>
                </div>
                {currentTab === 'home' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                )}
              </button>

              {/* Accordion Group 1: Explore the Meadow */}
              <div
                className={`rounded-2xl border transition-colors overflow-hidden ${
                  isNight ? 'border-[#4D3F6D]/60 bg-[#241E34]' : 'border-[#F2B8C6]/50 bg-white/80'
                }`}
              >
                <button
                  onClick={() => toggleAccordion('meadow')}
                  className={`w-full px-4 py-3.5 flex items-center justify-between min-h-[48px] cursor-pointer text-left transition-colors ${
                    isMeadowActive
                      ? 'text-[#8DBA83] font-bold'
                      : isNight
                      ? 'text-[#F3ECF8]'
                      : 'text-[#493B43]'
                  }`}
                  aria-expanded={expandedAccordions.meadow}
                >
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-4 h-4 text-[#8DBA83]" />
                    <span className="text-sm font-extrabold tracking-tight">
                      Explore the Meadow
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8DBA83]/20 text-[#8DBA83] font-bold">
                      7
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      expandedAccordions.meadow ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedAccordions.meadow && (
                  <div
                    className={`px-2 pb-2.5 pt-1 space-y-1 border-t animate-in fade-in duration-200 ${
                      isNight ? 'border-[#4D3F6D]/40 bg-[#1C172B]/60' : 'border-[#F2B8C6]/30 bg-[#FFF9F0]'
                    }`}
                  >
                    {exploreMeadowItems.map((item) => {
                      const isSelected = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigate(item.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between min-h-[44px] ${
                            isSelected
                              ? 'bg-[#8DBA83] text-white font-bold shadow-xs'
                              : isNight
                              ? 'text-[#E8DDF2] hover:bg-white/10'
                              : 'text-[#493B43] hover:bg-[#F2B8C6]/20'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="shrink-0">{item.icon}</span>
                            <span className="text-xs truncate">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ml-2 ${
                                isSelected
                                  ? 'bg-white/30 text-white'
                                  : 'bg-[#FFE29A] text-[#854D0E]'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion Group 2: Special Experiences */}
              <div
                className={`rounded-2xl border transition-colors overflow-hidden ${
                  isNight ? 'border-[#4D3F6D]/60 bg-[#241E34]' : 'border-[#F2B8C6]/50 bg-white/80'
                }`}
              >
                <button
                  onClick={() => toggleAccordion('experiences')}
                  className={`w-full px-4 py-3.5 flex items-center justify-between min-h-[48px] cursor-pointer text-left transition-colors ${
                    isExperiencesActive
                      ? 'text-[#8DBA83] font-bold'
                      : isNight
                      ? 'text-[#F3ECF8]'
                      : 'text-[#493B43]'
                  }`}
                  aria-expanded={expandedAccordions.experiences}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#FFE29A]" />
                    <span className="text-sm font-extrabold tracking-tight">
                      Special Experiences
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFE29A]/30 text-[#B45309] font-bold">
                      8
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      expandedAccordions.experiences ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedAccordions.experiences && (
                  <div
                    className={`px-2 pb-2.5 pt-1 space-y-1 border-t animate-in fade-in duration-200 ${
                      isNight ? 'border-[#4D3F6D]/40 bg-[#1C172B]/60' : 'border-[#F2B8C6]/30 bg-[#FFF9F0]'
                    }`}
                  >
                    {specialExperiencesItems.map((item) => {
                      const isSelected = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigate(item.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between min-h-[44px] ${
                            isSelected
                              ? 'bg-[#8DBA83] text-white font-bold shadow-xs'
                              : isNight
                              ? 'text-[#E8DDF2] hover:bg-white/10'
                              : 'text-[#493B43] hover:bg-[#F2B8C6]/20'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="shrink-0">{item.icon}</span>
                            <span className="text-xs truncate">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ml-2 ${
                                isSelected
                                  ? 'bg-white/30 text-white'
                                  : 'bg-[#FFE29A] text-[#854D0E]'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Drawer Footer Controls (Pinned at bottom with safe-area padding) */}
            <div
              className={`p-4 border-t shrink-0 space-y-2.5 pb-[max(1rem,env(safe-area-inset-bottom))] ${
                isNight ? 'border-[#4D3F6D]/50 bg-[#171324]' : 'border-[#F2B8C6]/40 bg-[#FFF0D9]'
              }`}
            >
              <div className="grid grid-cols-2 gap-2">
                {/* Theme Toggle Button */}
                <button
                  onClick={handleToggleTheme}
                  className={`min-h-[44px] px-3 py-2 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-colors cursor-pointer ${
                    isNight
                      ? 'bg-[#2A233D] border-[#FFE29A]/40 text-[#FFE29A]'
                      : 'bg-white border-[#F2B8C6] text-[#493B43]'
                  }`}
                >
                  {isNight ? (
                    <Moon className="w-4 h-4 fill-[#FFE29A]" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
                  )}
                  <span>{isNight ? 'Moonlight' : 'Day Mode'}</span>
                </button>

                {/* Sound Toggle Button */}
                <button
                  onClick={handleToggleSound}
                  className={`min-h-[44px] px-3 py-2 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-colors cursor-pointer ${
                    isNight
                      ? 'bg-[#2A233D] border-[#4D3F6D] text-[#F3ECF8]'
                      : 'bg-white border-[#F2B8C6] text-[#493B43]'
                  }`}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 opacity-50" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-[#8DBA83]" />
                  )}
                  <span>{isMuted ? 'Muted' : 'Sound On'}</span>
                </button>
              </div>

              {/* Squeak Bloop Action */}
              <button
                onClick={() => {
                  handleSqueakBloop();
                  setMobileMenuOpen(false);
                }}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#BDE4C6] hover:bg-[#A9DAC4] text-[#493B43] font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-xs cursor-pointer border border-[#8DBA83]/30"
              >
                <Sparkles className="w-4 h-4 text-[#493B43]" />
                <span>Squeak Bloop's Belly!</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
