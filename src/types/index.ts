/** Core domain types for NatureScout.
 * Designed so Guildford seed data can later be swapped for real APIs.
 */

export type SpeciesCategory =
  | 'tree'
  | 'plant'
  | 'bird'
  | 'mammal'
  | 'fungi'
  | 'insect'
  | 'wildlife'

export type PlaceType =
  | 'park'
  | 'woodland'
  | 'river'
  | 'heath'
  | 'meadow'
  | 'reserve'
  | 'common'
  | 'viewpoint'

export type Rarity = 'common' | 'uncommon' | 'seasonal' | 'notable' | 'rare'

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export type MissionCategory =
  | 'trees'
  | 'seasonal'
  | 'wildlife'
  | 'places'
  | 'habit'
  | 'birds'
  | 'fungi'
  | 'exploration'

export type MissionDifficulty = 'easy' | 'medium' | 'hard'

export type DiscoveryFilter =
  | 'all'
  | 'trees'
  | 'plants'
  | 'birds'
  | 'fungi'
  | 'wildlife'
  | 'places'

export interface Coordinates {
  lat: number
  lng: number
}

/** All coordinates are DEMO/SAMPLE unless marked verified. */
export interface GeoPoint extends Coordinates {
  isDemo: boolean
  label?: string
}

export interface SeasonalInterest {
  spring: number // 0–10 visibility/interest score
  summer: number
  autumn: number
  winter: number
  notes?: string
}

export interface Species {
  id: string
  name: string
  scientificName: string
  category: SpeciesCategory
  description: string
  identifyingFeatures: string[]
  howToRecognise: string
  seasonalInterest: SeasonalInterest
  rarity: Rarity
  /** Emoji or icon key used until real photography is wired */
  image: string
  tags: string[]
  regionIds: string[]
  lookForTips?: string[]
}

export interface Tree {
  id: string
  name: string
  speciesId: string
  location: GeoPoint
  placeId?: string
  isNotable: boolean
  isAncient: boolean
  estimatedAgeYears?: number
  girthCm?: number
  description: string
  seasonalInterest: string
  regionIds: string[]
  isDemo: true
}

export interface NaturePlace {
  id: string
  name: string
  type: PlaceType
  location: GeoPoint
  description: string
  highlights: string[]
  speciesIds: string[]
  treeIds: string[]
  bestSeasons: Season[]
  approxSizeHa?: number
  regionIds: string[]
  isDemo: true
}

export interface NatureObservation {
  id: string
  speciesId: string
  placeId?: string
  treeId?: string
  location?: GeoPoint
  discoveredAt: string // ISO date
  notes?: string
  xpAwarded: number
}

export interface MissionObjective {
  id: string
  label: string
  targetCount: number
  relatedSpeciesIds?: string[]
  relatedPlaceTypes?: PlaceType[]
  relatedTags?: string[]
}

export interface NatureMission {
  id: string
  title: string
  description: string
  category: MissionCategory
  difficulty: MissionDifficulty
  xpReward: number
  objectives: MissionObjective[]
  relatedSpeciesIds: string[]
  relatedPlaceIds: string[]
  seasonHint?: Season[]
  estimatedMinutes?: number
  icon: string
}

export interface AdventureStop {
  id: string
  label: string
  type: 'tree' | 'place' | 'species' | 'habitat'
  refId: string
  description: string
}

export interface AdventureTemplate {
  id: string
  title: string
  description: string
  themes: string[]
  estimatedMinutes: number
  distanceKm: number
  stops: AdventureStop[]
  highlights: string[]
  xpReward: number
  regionIds: string[]
  isSchematic: true
}

export interface Walk {
  id: string
  title: string
  templateId: string
  startedAt: string
  completedAt?: string
  completedStopIds: string[]
  xpAwarded?: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: string
}

export interface UserProgress {
  displayName: string
  locationLabel: string
  regionId: string
  xp: number
  discoveries: NatureObservation[]
  completedMissionIds: string[]
  missionProgress: Record<string, Record<string, number>>
  completedPlaceIds: string[]
  badges: Badge[]
  kmExplored: number
  activeWalkId?: string
  walks: Walk[]
  dailyDiscovery?: {
    speciesId: string
    date: string
    discovered: boolean
  }
  createdAt: string
}

export interface SeasonalHighlight {
  id: string
  title: string
  description: string
  icon: string
  season: Season
  bestTime: string
  relatedSpeciesIds: string[]
  relatedTags: string[]
  regionIds: string[]
}

export interface Region {
  id: string
  name: string
  parentId?: string
  country: string
  center: GeoPoint
  /** Approximate demo bounds for schematic maps */
  bounds: {
    north: number
    south: number
    east: number
    west: number
  }
}

export interface NearbyDiscovery {
  id: string
  name: string
  category: SpeciesCategory | 'place'
  distanceMiles: number
  refType: 'species' | 'tree' | 'place'
  refId: string
  icon: string
}

export interface SearchResult {
  id: string
  title: string
  subtitle: string
  category: string
  icon: string
  href: string
  type: 'species' | 'tree' | 'place' | 'mission'
}

export interface CollectionStats {
  discovered: number
  total: number
  percent: number
  byCategory: Record<string, { discovered: number; total: number }>
}
