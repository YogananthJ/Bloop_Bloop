
import React, { useState } from 'react';
import { ASSETS } from '../utils/assets';
import { sounds } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, X } from 'lucide-react';

import pickleImage from '../assets/images/pickle.png';
import pipSquawkImage from '../assets/images/pip_squawk.png';
import lunaImage from '../assets/images/luna.png';
import mamaWillowImage from '../assets/images/mama_willow.png';

interface Friend {
  id: string;
  name: string;
  image: string;
  species: string;
  profession: string;
  role: string;
  avatarEmoji: string;
  accentColor: string;
  borderColor: string;
  badge: string;
  equipment: string;
  philosophy: string;
  interactiveLabel: string;
  funFact: string;
}

export const Friends: React.FC = () => {
  const { mode } = useTheme();
  const isNight = mode === 'night';

  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [wisdomText, setWisdomText] = useState<string | null>(null);

  const friendsList: Friend[] = [
    {
      id: 'pickle',
      name: 'Pickle',
      image: pickleImage,
      species: 'Bright Yellow Duckling',
      profession: 'Quality Assurance & Beta Tester',
      role: 'Stress-tests toys, drops them off clover logs, and discovers sneaky Bloop-Bugs before toys leave the lab.',
      avatarEmoji: '🦆',
      accentColor: 'bg-[#FFE29A]/40',
      borderColor: 'border-[#FFE29A]',
      badge: 'Chief Bug Finder',
      equipment: 'Mismatched knitted socks (one polka dot, one striped) for maximum grip & slip-testing.',
      philosophy: '“If it cannot survive a triple duck-waddle tumble, it is not ready for the meadow!”',
      interactiveLabel: 'Test Pickle’s Squeaky Sock',
      funFact: 'Can detect an unaligned wooden peg from fifteen feet away purely by listening to the bounce note.',
    },
    {
      id: 'pipsquawk',
      name: 'Pip-Squawk',
      image: pipSquawkImage,
      species: 'Tiny Blue Hedgehog',
      profession: 'Backend Infrastructure & Builder',
      role: 'Constructs wooden tracks, interlocking bamboo slides, counterweight levers, and sturdy workbench frames.',
      avatarEmoji: '🦔',
      accentColor: 'bg-[#B9DDF5]/40',
      borderColor: 'border-[#B9DDF5]',
      badge: 'Master Trackwright',
      equipment: 'Felt quills for storing wooden pegs, tiny round wooden spectacles, and a mini carpenter’s ruler.',
      philosophy: '“Solid foundations mean smoother rolls. Measure twice, sand thrice, smile forever.”',
      interactiveLabel: 'Spin Pip’s Felt Gear',
      funFact: 'Builds miniature scaffolding out of dried lavender twigs and honeysuckle vine rope.',
    },
    {
      id: 'luna',
      name: 'Luna',
      image: lunaImage,
      species: 'Pastel-Purple Bunny',
      profession: 'UI & Sensory Designer',
      role: 'Develops friendly colors, velvety fabric textures, soothing sound chimes, and gentle sensory experiences.',
      avatarEmoji: '🐰',
      accentColor: 'bg-[#D9C8F0]/40',
      borderColor: 'border-[#D9C8F0]',
      badge: 'Sensory Architect',
      equipment: 'Color swatch booklet made of pressed wildflower petals and a soft velvet velvet-ribbon lanyard.',
      philosophy: '“Softness is not just a texture; it is a feeling of safety, welcome, and peaceful joy.”',
      interactiveLabel: 'Explore Luna’s Petal Palette',
      funFact: 'Her long floppy ears can hear the subtlest change in a lullaby chime’s resonance.',
    },
    {
      id: 'mamawillow',
      name: 'Mama Willow',
      image: mamaWillowImage,
      species: 'Gentle Fluffy Mother Sheep',
      profession: 'Senior Project Manager & Mentor',
      role: 'Supports the crew, encourages patience when tests fail, and helps solve the most puzzling Bloop-Bugs.',
      avatarEmoji: '🐑',
      accentColor: 'bg-[#BDE4C6]/40',
      borderColor: 'border-[#BDE4C6]',
      badge: 'Mentor & Guardian',
      equipment: 'Cozy hand-knitted cardigan with deep pockets filled with clover blossom biscuits and dried chamomile.',
      philosophy: '“Every mistake is simply a toy that hasn’t found its right song yet. Drink warm tea and try again.”',
      interactiveLabel: 'Ask Mama Willow for Advice',
      funFact: 'Has never raised her voice in sixty years; her gentle hum can calm the windiest meadow storm.',
    },
  ];

  const handleFriendInteractive = (friend: Friend) => {
    if (friend.id === 'pickle') {
      sounds.playSqueak();
    } else if (friend.id === 'pipsquawk') {
      sounds.playPop();
    } else if (friend.id === 'luna') {
      sounds.playChime(880);
    } else if (friend.id === 'mamawillow') {
      sounds.playChime(523.25);

      const quotes = [
        '“Take a deep breath, little engineer. The best toys take time to sprout.”',
        '“A wobble today is tomorrow’s joyful bounce!”',
        '“Have a warm sip of chamomile tea before you tighten the gear.”',
      ];

      setWisdomText(quotes[Math.floor(Math.random() * quotes.length)]);
    }
  };

  return (
    <div
      className={`min-h-screen py-12 transition-colors ${
        isNight ? 'bg-[#1C172B]' : 'bg-[#FFF6E8]'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8DBA83] uppercase tracking-wider">
            <span>Meadow Developer Crew · Character Profiles</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight">
            Meet Bloop&apos;s Friends
          </h1>

          <p className="text-sm sm:text-base opacity-80 max-w-xl mx-auto">
            The extraordinary critters who test, construct, design, and guide every toy at the Meadow Play Lab.
          </p>
        </div>

        {/* HERO CREW PORTRAIT */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#F2B8C6]/40 shadow-md bg-white">
          <img
            src={ASSETS.friendsCrewWithBloop}
            alt="The Meadow Developer Crew with Bloop and friends"
            className="w-full h-auto object-cover max-h-[460px] aspect-16/9"
            referrerPolicy="no-referrer"
            loading="lazy"
          />

          <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-2xl bg-white/90 dark:bg-[#27213C]/90 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-bold text-[#493B43] dark:text-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8DBA83] animate-pulse" />
              <span>The Meadow Play Lab Official Team Photo</span>
            </div>

            <span className="text-[#8DBA83] font-medium">
              Pip-Squawk · Pickle ·{' '}
              <strong className="font-extrabold text-[#F2B8C6] drop-shadow-xs">
                Bloop (Center)
              </strong>{' '}
              · Luna · Mama Willow
            </span>
          </div>
        </div>

        {/* FOUR CHARACTER CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {friendsList.map((friend) => (
            <div
              key={friend.id}
              onClick={() => {
                setSelectedFriend(friend);
                setWisdomText(null);
                handleFriendInteractive(friend);
              }}
              className={`p-6 rounded-3xl border-2 ${friend.borderColor} shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group ${
                isNight ? 'bg-[#27213C]' : 'bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl ${friend.accentColor} flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs overflow-hidden shrink-0`}
                  >
                    <img
                      src={friend.image}
                      alt={friend.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border border-black/5 ${
                      isNight ? 'bg-[#1C172B]' : 'bg-[#FFF6E8]'
                    }`}
                  >
                    {friend.badge}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl mb-0.5">
                  {friend.name}
                </h3>

                <div className="text-xs font-semibold text-[#8DBA83] mb-1">
                  {friend.species}
                </div>

                <div className="text-[11px] font-bold opacity-70 uppercase tracking-wider mb-3">
                  {friend.profession}
                </div>

                <p className="text-xs opacity-80 leading-relaxed mb-4">
                  {friend.role}
                </p>
              </div>

              <div className="pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs font-bold text-[#8DBA83]">
                <span>View Full Dossier</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CHARACTER PROFILE MODAL */}
        {selectedFriend && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedFriend.name} character profile`}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedFriend(null);
              }
            }}
          >
            <div
              className={`relative w-full max-w-lg rounded-3xl border-2 shadow-2xl p-6 sm:p-8 space-y-5 overflow-hidden ${
                isNight
                  ? 'bg-[#27213C] border-[#4D3F6D] text-[#F3ECF8]'
                  : 'bg-[#FFF6E8] border-[#F2B8C6] text-[#493B43]'
              }`}
            >
              <button
                onClick={() => setSelectedFriend(null)}
                className="absolute top-4 right-4 min-w-[44px] min-h-[44px] p-2.5 rounded-full hover:bg-black/10 transition-colors cursor-pointer flex items-center justify-center"
                aria-label="Close friend dossier"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 pr-10">
                <div
                  className={`w-16 h-16 rounded-2xl ${selectedFriend.accentColor} flex items-center justify-center shadow-xs overflow-hidden shrink-0`}
                >
                  <img
                    src={selectedFriend.image}
                    alt={selectedFriend.name}
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div>
                  <div className="text-[11px] font-bold text-[#8DBA83] uppercase tracking-wider">
                    {selectedFriend.profession}
                  </div>

                  <h3 className="font-display font-bold text-2xl">
                    {selectedFriend.name}
                  </h3>

                  <div className="text-xs opacity-70">
                    {selectedFriend.species}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-black/20 border border-black/5 italic text-xs sm:text-sm leading-relaxed">
                {selectedFriend.philosophy}
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-white/60 dark:bg-black/20 border border-black/5">
                  <div className="font-bold mb-0.5">
                    Signature Equipment:
                  </div>
                  <div className="opacity-80">
                    {selectedFriend.equipment}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/60 dark:bg-black/20 border border-black/5">
                  <div className="font-bold mb-0.5">
                    Meadow Secret Fact:
                  </div>
                  <div className="opacity-80">
                    {selectedFriend.funFact}
                  </div>
                </div>
              </div>

              {selectedFriend.id === 'mamawillow' && wisdomText && (
                <div className="p-3 rounded-xl bg-[#BDE4C6]/40 border border-[#8DBA83] text-xs font-medium animate-in fade-in text-[#493B43]">
                  ☕ <strong>Mama Willow says:</strong> {wisdomText}
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleFriendInteractive(selectedFriend)}
                  className="min-h-[44px] flex-1 py-3 px-4 rounded-2xl bg-[#8DBA83] text-white font-bold text-xs hover:bg-[#7ba871] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{selectedFriend.interactiveLabel}</span>
                </button>

                <button
                  onClick={() => setSelectedFriend(null)}
                  className="min-h-[44px] py-3 px-5 rounded-2xl border text-xs font-bold cursor-pointer hover:bg-black/5"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
