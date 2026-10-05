import type { AdventureTemplate } from '@/types'
import { adventures, getAdventureById } from '@/data/adventures'

export type AdventureTimeOption = 30 | 60 | 90 | 120
export type AdventureThemeOption =
  | 'ancient trees'
  | 'water'
  | 'birds'
  | 'wildflowers'
  | 'woodland'
  | 'wildlife'
  | 'fungi'
  | 'anything'

const THEME_ALIASES: Record<AdventureThemeOption, string[]> = {
  'ancient trees': ['ancient trees', 'trees'],
  water: ['water'],
  birds: ['birds'],
  wildflowers: ['wildflowers'],
  woodland: ['woodland'],
  wildlife: ['wildlife'],
  fungi: ['fungi'],
  anything: [],
}

export const adventureService = {
  getAll(regionId = 'guildford'): AdventureTemplate[] {
    return adventures.filter((a) => a.regionIds.includes(regionId))
  },

  getById(id: string): AdventureTemplate | undefined {
    return getAdventureById(id)
  },

  getFeatured(regionId = 'guildford'): AdventureTemplate {
    return this.getAll(regionId)[0]
  },

  /**
   * Simple local generator: pick the best schematic template matching time + theme.
   * Not a real routing engine — selections are from seeded data only.
   */
  generate(
    timeMinutes: AdventureTimeOption,
    theme: AdventureThemeOption,
    regionId = 'guildford',
  ): AdventureTemplate {
    const pool = this.getAll(regionId)
    const timeTolerance = timeMinutes <= 30 ? 15 : timeMinutes <= 60 ? 20 : 30

    const scored = pool.map((adv) => {
      const timeDiff = Math.abs(adv.estimatedMinutes - timeMinutes)
      const timeScore = timeDiff <= timeTolerance ? 10 - timeDiff / 10 : 3 - timeDiff / 40
      let themeScore = 0
      if (theme === 'anything') {
        themeScore = 5
      } else {
        const aliases = THEME_ALIASES[theme]
        themeScore = adv.themes.some((t) => aliases.includes(t) || t.includes(theme))
          ? 10
          : adv.themes.includes('anything')
            ? 4
            : 0
      }
      return { adv, score: timeScore + themeScore }
    })

    scored.sort((a, b) => b.score - a.score)
    return scored[0]?.adv ?? pool[0]
  },
}
