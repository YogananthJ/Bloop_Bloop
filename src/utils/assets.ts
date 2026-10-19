
/**
 * Asset paths for Bloop's Little World.
 * Uses Vite-compatible imports for production builds.
 * Preserves the canonical Bloop character reference.
 */

import bloopHeroLocalImage from '../assets/images/bloop_hero_1792389936220.jpg';
import cozyCloverMeadowImage from '../assets/images/cozy_clover_meadow_1792389860524.jpg';
import meadowPlayLabImage from '../assets/images/meadow_play_lab_1792389862825.jpg';
import friendsCrewImage from '../assets/images/crew_with_bloop_1792395121366.jpg';
import friendsCrewOriginalImage from '../assets/images/friends_crew_portrait_1792389862754.jpg';
import toyProjectsCollectionImage from '../assets/images/toy_projects_collection_1792389862917.jpg';

// Keep the original public URL for the canonical Bloop reference.
const bloopHeroImage = '/b34fa565-2488-4c6c-a483-8a71e3f8c102.jpg';

export const ASSETS = {
  // Canonical Bloop reference
  bloopHero: bloopHeroImage,
  bloopHeroLocal: bloopHeroLocalImage,

  // Meadow & Workshop environments
  cozyCloverMeadow: cozyCloverMeadowImage,
  meadowPlayLab: meadowPlayLabImage,

  // Toy Projects Showcase & Friends Crew
  // Update this mapping after confirming the actual file exists.
  toyProjectsCollection: toyProjectsCollectionImage,
  friendsCrew: friendsCrewImage,
  friendsCrewOriginal: friendsCrewOriginalImage,
  friendsCrewWithBloop: friendsCrewImage,

  // Outfit Concept Illustrations
  // These paths are retained until the actual files are confirmed.
  outfitEngineer: '/src/assets/images/outfit_engineer_1792395119292.jpg',
  outfitBedtime: '/src/assets/images/outfit_bedtime_1792395121771.jpg',
  outfitPlush: '/src/assets/images/outfit_plush_1792395123422.jpg',
};
