import type { Season, SeasonalHighlight } from '@/types'

export const MONTH_TO_SEASON: Record<number, Season> = {
  0: 'winter',
  1: 'winter',
  2: 'spring',
  3: 'spring',
  4: 'spring',
  5: 'summer',
  6: 'summer',
  7: 'summer',
  8: 'autumn',
  9: 'autumn',
  10: 'autumn',
  11: 'winter',
}

export const SEASON_LABELS: Record<Season, string> = {
  spring: 'Spring',
  summer: 'Summer',
  autumn: 'Autumn',
  winter: 'Winter',
}

export const SEASON_THEMES: Record<
  Season,
  { title: string; themes: string[]; suggestedMissionTags: string[] }
> = {
  spring: {
    title: 'Spring awakening',
    themes: ['blossom', 'bluebells', 'nesting birds', 'frogspawn', 'new leaves'],
    suggestedMissionTags: ['blossom', 'bluebell', 'birds', 'fresh-growth'],
  },
  summer: {
    title: 'High summer',
    themes: ['wildflowers', 'butterflies', 'bees', 'dragonflies', 'berries'],
    suggestedMissionTags: ['wildflower', 'insect', 'butterfly', 'meadow'],
  },
  autumn: {
    title: 'Autumn colours',
    themes: ['fungi', 'falling leaves', 'conkers', 'berries', 'migrating birds'],
    suggestedMissionTags: ['fungi', 'leaves', 'conker', 'autumn', 'berries'],
  },
  winter: {
    title: 'Winter stillness',
    themes: ['bare trees', 'winter birds', 'moss', 'fungi', 'frost'],
    suggestedMissionTags: ['winter-bird', 'moss', 'bare-tree', 'frost'],
  },
}

export const seasonalHighlights: SeasonalHighlight[] = [
  {
    id: 'sh-autumn-colours',
    title: 'Autumn colours are arriving',
    description: 'Woodlands around Guildford are beginning to change colour.',
    icon: '🍂',
    season: 'autumn',
    bestTime: 'This week',
    relatedSpeciesIds: ['sp-english-oak', 'sp-beech', 'sp-horse-chestnut', 'sp-silver-birch'],
    relatedTags: ['autumn', 'leaves', 'woodland'],
    regionIds: ['guildford', 'surrey'],
  },
  {
    id: 'sh-fungi-season',
    title: 'Fungi season',
    description: 'Cooler, wetter conditions mean this is a great time to explore woodland floors.',
    icon: '🍄',
    season: 'autumn',
    bestTime: 'Peak now',
    relatedSpeciesIds: ['sp-fly-agaric', 'sp-birch-polypore', 'sp-chicken-of-woods', 'sp-shaggy-inkcap', 'sp-sulphur-tuft', 'sp-penny-bun', 'sp-amethyst-deceiver'],
    relatedTags: ['fungi', 'woodland'],
    regionIds: ['guildford', 'surrey'],
  },
  {
    id: 'sh-ancient-trees',
    title: 'Ancient trees',
    description: 'There are notable trees waiting to be discovered around Guildford.',
    icon: '🌳',
    season: 'autumn',
    bestTime: 'Year-round',
    relatedSpeciesIds: ['sp-english-oak', 'sp-beech', 'sp-yew'],
    relatedTags: ['ancient', 'notable', 'trees'],
    regionIds: ['guildford', 'surrey'],
  },
  {
    id: 'sh-conkers',
    title: 'Conker season',
    description: 'Horse chestnuts are dropping glossy brown seeds — a classic autumn find.',
    icon: '🌰',
    season: 'autumn',
    bestTime: 'September–October',
    relatedSpeciesIds: ['sp-horse-chestnut'],
    relatedTags: ['conker', 'autumn'],
    regionIds: ['guildford', 'surrey'],
  },
  {
    id: 'sh-winter-birds',
    title: 'Winter birdwatching',
    description: 'With leaves gone, garden and park birds are easier to spot.',
    icon: '🐦',
    season: 'winter',
    bestTime: 'Cold clear mornings',
    relatedSpeciesIds: ['sp-robin', 'sp-blue-tit', 'sp-blackbird', 'sp-woodpigeon'],
    relatedTags: ['winter-bird', 'birds'],
    regionIds: ['guildford', 'surrey'],
  },
  {
    id: 'sh-moss-frost',
    title: 'Moss & frost patterns',
    description: 'Look closely at tree bases and stone walls for rich green moss after frost.',
    icon: '❄️',
    season: 'winter',
    bestTime: 'Frosty mornings',
    relatedSpeciesIds: ['sp-common-moss'],
    relatedTags: ['moss', 'frost'],
    regionIds: ['guildford', 'surrey'],
  },
  {
    id: 'sh-bare-trees',
    title: 'Architecture of bare trees',
    description: 'Winter reveals the full shape of oaks, beeches and limes.',
    icon: '🌲',
    season: 'winter',
    bestTime: 'Year-round structure',
    relatedSpeciesIds: ['sp-english-oak', 'sp-beech', 'sp-lime'],
    relatedTags: ['bare-tree', 'trees'],
    regionIds: ['guildford', 'surrey'],
  },
  {
    id: 'sh-bluebells',
    title: 'Bluebell carpets',
    description: 'Surrey woodlands can light up with bluebells in spring.',
    icon: '💙',
    season: 'spring',
    bestTime: 'Mid–late April',
    relatedSpeciesIds: ['sp-bluebell'],
    relatedTags: ['bluebell', 'woodland', 'spring'],
    regionIds: ['guildford', 'surrey'],
  },
  {
    id: 'sh-blossom',
    title: 'Blossom & fresh leaves',
    description: 'Hawthorn, blackthorn and cherry bring the first white and pink blooms.',
    icon: '🌸',
    season: 'spring',
    bestTime: 'March–May',
    relatedSpeciesIds: ['sp-hawthorn', 'sp-blackthorn', 'sp-wild-cherry'],
    relatedTags: ['blossom', 'fresh-growth'],
    regionIds: ['guildford', 'surrey'],
  },
  {
    id: 'sh-nesting',
    title: 'Nesting birds',
    description: 'Listen for song and watch for nesting activity in parks and hedges.',
    icon: '🪺',
    season: 'spring',
    bestTime: 'Dawn chorus',
    relatedSpeciesIds: ['sp-robin', 'sp-blackbird', 'sp-great-tit', 'sp-wren'],
    relatedTags: ['birds', 'nesting'],
    regionIds: ['guildford', 'surrey'],
  },
  {
    id: 'sh-wildflowers',
    title: 'Meadow wildflowers',
    description: 'Commons and riverside edges fill with colour through summer.',
    icon: '🌼',
    season: 'summer',
    bestTime: 'June–August',
    relatedSpeciesIds: ['sp-oxeye-daisy', 'sp-common-knapweed', 'sp-red-clover', 'sp-foxglove'],
    relatedTags: ['wildflower', 'meadow'],
    regionIds: ['guildford', 'surrey'],
  },
  {
    id: 'sh-butterflies',
    title: 'Butterflies & bees',
    description: 'Warm days bring pollinators to gardens, meadows and riverside paths.',
    icon: '🦋',
    season: 'summer',
    bestTime: 'Sunny afternoons',
    relatedSpeciesIds: ['sp-peacock-butterfly', 'sp-red-admiral', 'sp-bumblebee', 'sp-honeybee'],
    relatedTags: ['insect', 'butterfly', 'bee'],
    regionIds: ['guildford', 'surrey'],
  },
  {
    id: 'sh-dragonflies',
    title: 'Dragonflies by water',
    description: 'The River Wey and ponds are good places to watch dragonflies patrol.',
    icon: '🪲',
    season: 'summer',
    bestTime: 'Still warm days',
    relatedSpeciesIds: ['sp-emperor-dragonfly', 'sp-common-darter'],
    relatedTags: ['dragonfly', 'water'],
    regionIds: ['guildford', 'surrey'],
  },
]

export function getSeasonForDate(date: Date = new Date()): Season {
  return MONTH_TO_SEASON[date.getMonth()]
}

export function getHighlightsForSeason(season: Season, regionId = 'guildford'): SeasonalHighlight[] {
  return seasonalHighlights.filter(
    (h) => h.season === season && h.regionIds.includes(regionId),
  )
}
