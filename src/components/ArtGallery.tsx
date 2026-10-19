import React, { useState, useEffect } from 'react';
import { ASSETS } from '../utils/assets';
import { sounds } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import { Image, X, ChevronLeft, ChevronRight, Sparkles, ZoomIn } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  category: 'Environments' | 'Craft & Toys' | 'Characters';
  description: string;
  image: string;
  lore: string;
}

export const ArtGallery: React.FC = () => {
  const { mode } = useTheme();
  const isNight = mode === 'night';

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      title: 'Cozy Clover Meadow at Morning Sunrise',
      category: 'Environments',
      description: 'A wide panoramic pastel meadow with soft rolling hills, tiny yellow and blue flowers, floating dandelion seeds, and the ancient Sweet Willow Tree.',
      image: ASSETS.cozyCloverMeadow,
      lore: 'The birthplace of Bloop, where sweet marshmallow flowers bloom under gentle morning clouds.',
    },
    {
      id: 2,
      title: 'Meadow Play Lab Workshop',
      category: 'Environments',
      description: 'Miniature cedar workshop equipped with rounded workbenches, rainbow wooden pegs, felt gears, and woven baskets of chimes.',
      image: ASSETS.meadowPlayLab,
      lore: 'Bloop’s headquarters where physical debugging and tactile coding occur every morning.',
    },
    {
      id: 3,
      title: 'The Four Handcrafted Toy Prototypes',
      category: 'Craft & Toys',
      description: 'Giggle-Block Tower, Cloud-Boing Trampoline, Nightlight Melody Lantern, and Bouncy-Berry Marble Run assembled together.',
      image: ASSETS.toyProjectsCollection,
      lore: 'Handcrafted prototypes built strictly from cedarwood, felt, and thistle-down springs.',
    },
    {
      id: 4,
      title: 'The Meadow Developer Crew With Bloop',
      category: 'Characters',
      description: 'Bloop the Marshmallow Hippo seated in the center with Pickle the QA Duckling, Pip-Squawk the Trackwright Hedgehog, Luna the UI Bunny, and Mama Willow the Mentor.',
      image: ASSETS.friendsCrewWithBloop,
      lore: 'The devoted team behind every squeak, bounce, and lullaby in the meadow, photographed together on their clover picnic blanket.',
    },
    {
      id: 5,
      title: 'Bloop With Dandelion Clock',
      category: 'Characters',
      description: 'The canonical portrait of Bloop the Marshmallow Hippo sitting in the clover meadow blowing fluffy dandelion seeds.',
      image: ASSETS.bloopHero,
      lore: 'Bloop testing wind resistance and bubble buoyancy in his natural habitat.',
    },
    {
      id: 6,
      title: "The Engineer's Apron Workshop Setup",
      category: 'Craft & Toys',
      description: 'Mint-green felt bib apron with wooden pegs in kangaroo pouch, measuring ribbon, and cedar mallet.',
      image: ASSETS.outfitEngineer,
      lore: 'Tailored specifically for Meadow Play Lab physical programming and gear alignment experiments.',
    },
    {
      id: 7,
      title: 'Bedtime Dreamer Cap & Chime Booties',
      category: 'Craft & Toys',
      description: 'Soft lavender sleep cap with yellow felt stars, paired with cozy hand-knitted pastel booties.',
      image: ASSETS.outfitBedtime,
      lore: 'Crafted for counting clover sheep and floating peacefully into starlight dreams.',
    },
  ];

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  // Lightbox keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        nextLightbox();
      } else if (e.key === 'ArrowLeft') {
        prevLightbox();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const openLightbox = (index: number) => {
    sounds.playPop();
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    sounds.playPop();
    setLightboxIndex(null);
  };

  const nextLightbox = () => {
    sounds.playChime(660);
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevLightbox = () => {
    sounds.playChime(520);
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const currentItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div className={`min-h-screen py-12 transition-colors ${isNight ? 'bg-[#1C172B]' : 'bg-[#FFF6E8]'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
            <Image className="w-4 h-4" />
            <span>Visual Concept Gallery</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
            Art of Bloop's World
          </h1>
          <p className="text-sm sm:text-base opacity-80 max-w-xl mx-auto">
            Explore high-fidelity illustrations of the cozy environments, handcrafted toy prototypes, and meadow companions.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {['All', 'Environments', 'Craft & Toys', 'Characters'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  sounds.playPop();
                }}
                className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#8DBA83] text-white shadow-xs'
                    : isNight
                    ? 'bg-[#27213C] text-[#B8A9C9] hover:bg-[#332B4D]'
                    : 'bg-white text-[#493B43]/75 hover:bg-[#F2B8C6]/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* MASONRY / BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className={`rounded-3xl overflow-hidden border-2 transition-all cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 ${
                isNight ? 'bg-[#27213C] border-[#4D3F6D]' : 'bg-white border-[#F2B8C6]/40'
              }`}
            >
              <div className="relative overflow-hidden aspect-4/3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-bold text-[#493B43] shadow-xs">
                  {item.category}
                </div>
                <div className="absolute bottom-3 right-3 p-2 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-display font-bold text-base line-clamp-1 group-hover:text-[#8DBA83] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs opacity-75 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="pt-2 text-[11px] font-semibold text-[#8DBA83] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Click to view in Lightbox</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FULLSCREEN LIGHTBOX MODAL */}
        {currentItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-label={currentItem.title}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 z-20 min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Close image lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              onClick={prevLightbox}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Previous artwork"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={nextLightbox}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Next artwork"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Content Container */}
            <div className="relative max-w-4xl w-full bg-[#FFF6E8] dark:bg-[#27213C] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 flex flex-col max-h-[90vh]">
              <div className="relative bg-black flex items-center justify-center overflow-hidden max-h-[60vh]">
                <img
                  src={currentItem.image}
                  alt={currentItem.title}
                  className="max-h-[60vh] w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-3 overflow-y-auto">
                <div className="flex items-center justify-between text-xs text-[#8DBA83] font-bold">
                  <span className="uppercase tracking-wider">{currentItem.category}</span>
                  <span>{lightboxIndex! + 1} of {filteredItems.length}</span>
                </div>
                <h2 className="font-display font-bold text-2xl text-[#493B43] dark:text-[#F3ECF8]">
                  {currentItem.title}
                </h2>
                <p className="text-sm text-[#493B43]/85 dark:text-[#F3ECF8]/85 leading-relaxed">
                  {currentItem.description}
                </p>
                <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-black/20 border border-black/5 text-xs text-[#493B43]/80 dark:text-[#F3ECF8]/80 italic">
                  🌿 {currentItem.lore}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
