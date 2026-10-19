/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar, TabType } from './components/Navbar';
import { Home } from './components/Home';
import { About } from './components/About';
import { PlayLab } from './components/PlayLab';
import { OutfitStudio } from './components/OutfitStudio';
import { ArtGallery } from './components/ArtGallery';
import { Friends } from './components/Friends';
import { Storybook } from './components/Storybook';
import { Stickers } from './components/Stickers';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { EasterEggModal } from './components/EasterEggModal';
import { LullabyLab } from './components/LullabyLab';
import { DreamlightExplorer } from './components/DreamlightExplorer';
import { DreamDeliveryMap } from './components/DreamDeliveryMap';
import { StackTheDreamBlocks } from './components/StackTheDreamBlocks';
import { VisitorMemoryBanner } from './components/VisitorMemoryBanner';

// Lazy-load Tier 3 components for Lighthouse performance optimization
const MeetBloop3D = lazy(() =>
  import('./components/MeetBloop3D').then((module) => ({ default: module.MeetBloop3D }))
);
const DreamGuestbook = lazy(() =>
  import('./components/DreamGuestbook').then((module) => ({ default: module.DreamGuestbook }))
);
const TalkToBloop = lazy(() =>
  import('./components/TalkToBloop').then((module) => ({ default: module.TalkToBloop }))
);

function LoadingSpinner() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3 p-12">
      <div className="w-10 h-10 border-4 border-[#8DBA83]/30 border-t-[#8DBA83] rounded-full animate-spin" />
      <span className="text-xs font-bold text-[#8DBA83]">Loading meadow experience...</span>
    </div>
  );
}

function AppContent() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [easterEggOpen, setEasterEggOpen] = useState(false);

  // Sync with browser hash if available
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as TabType;
      const validTabs: TabType[] = [
        'home',
        'meet3d',
        'guestbook',
        'chat',
        'lullaby',
        'dreamlight',
        'delivery',
        'dreamblocks',
        'storybook',
        'playlab',
        'about',
        'outfits',
        'gallery',
        'friends',
        'stickers',
        'contact',
      ];
      if (validTabs.includes(hash)) {
        setCurrentTab(hash);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSelectTab = (tab: TabType) => {
    setCurrentTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTriggerEasterEgg = () => {
    setEasterEggOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#F2B8C6]/50 selection:text-[#493B43] transition-colors duration-300">
      
      {/* Top Navigation Bar with 3-Zone Contract & Day/Night Toggle */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onTriggerEasterEgg={handleTriggerEasterEgg}
      />

      {/* Feature 03: Bloop Remembers You - Privacy-Conscious Visitor Greeting Banner */}
      <VisitorMemoryBanner onSelectTab={handleSelectTab} />

      {/* Main Page Content Views */}
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          {currentTab === 'home' && (
            <Home
              onSelectTab={handleSelectTab}
              onTriggerEasterEgg={handleTriggerEasterEgg}
            />
          )}
          {currentTab === 'meet3d' && <MeetBloop3D />}
          {currentTab === 'guestbook' && <DreamGuestbook />}
          {currentTab === 'chat' && <TalkToBloop />}
          {currentTab === 'lullaby' && <LullabyLab />}
          {currentTab === 'dreamlight' && <DreamlightExplorer />}
          {currentTab === 'delivery' && <DreamDeliveryMap />}
          {currentTab === 'dreamblocks' && <StackTheDreamBlocks />}
          {currentTab === 'storybook' && <Storybook />}
          {currentTab === 'playlab' && (
            <PlayLab onTriggerEasterEgg={handleTriggerEasterEgg} />
          )}
          {currentTab === 'about' && (
            <About onTriggerEasterEgg={handleTriggerEasterEgg} />
          )}
          {currentTab === 'outfits' && <OutfitStudio />}
          {currentTab === 'gallery' && <ArtGallery />}
          {currentTab === 'friends' && <Friends />}
          {currentTab === 'stickers' && <Stickers />}
          {currentTab === 'contact' && <Contact />}
        </Suspense>
      </main>

      {/* Shared Footer with Back to Top */}
      <Footer
        onSelectTab={handleSelectTab}
        onTriggerEasterEgg={handleTriggerEasterEgg}
      />

      {/* Hidden Easter Egg Interactive Modal */}
      <EasterEggModal
        isOpen={easterEggOpen}
        onClose={() => setEasterEggOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
