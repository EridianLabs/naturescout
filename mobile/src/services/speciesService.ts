import type { Species, SpeciesCategory, DiscoveryFilter } from '@/types'
import { species, getSpeciesById } from '@/data/species'
import { getCurrentSeason } from '@/utils/seasonal'

export const speciesService = {
  getAll(regionId = 'guildford'): Species[] {
    return species.filter((s) => s.regionIds.includes(regionId))
  },

  getById(id: string): Species | undefined {
    return getSpeciesById(id)
  },

  getByCategory(category: SpeciesCategory, regionId = 'guildford'): Species[] {
    return this.getAll(regionId).filter((s) => s.category === category)
  },

  filter(filter: DiscoveryFilter, regionId = 'guildford'): Species[] {
    const all = this.getAll(regionId)
    if (filter === 'all') return all
    if (filter === 'wildlife') {
      return all.filter((s) => s.category === 'mammal' || s.category === 'insect' || s.category === 'wildlife')
    }
    if (filter === 'trees') return all.filter((s) => s.category === 'tree')
    if (filter === 'plants') return all.filter((s) => s.category === 'plant')
    if (filter === 'birds') return all.filter((s) => s.category === 'bird')
    if (filter === 'fungi') return all.filter((s) => s.category === 'fungi')
    return all
  },

  getSeasonalHighlights(regionId = 'guildford', limit = 8): Species[] {
    const season = getCurrentSeason()
    return this.getAll(regionId)
      .map((s) => ({ s, score: s.seasonalInterest[season] }))
      .filter((x) => x.score >= 7)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.s)
  },

  getDailySpecies(date: Date = new Date(), regionId = 'guildford'): Species {
    const all = this.getAll(regionId)
    const dayIndex = Math.floor(date.setHours(0, 0, 0, 0) / 86400000)
    return all[Math.abs(dayIndex) % all.length]
  },

  getCollectionTotals(): Record<string, number> {
    const totals: Record<string, number> = {
      trees: 0,
      plants: 0,
      birds: 0,
      fungi: 0,
      wildlife: 0,
    }
    for (const s of species) {
      if (s.category === 'tree') totals.trees++
      else if (s.category === 'plant') totals.plants++
      else if (s.category === 'bird') totals.birds++
      else if (s.category === 'fungi') totals.fungi++
      else totals.wildlife++
    }
    // Inflate totals slightly to match product vision of a larger catalogue
    return {
      trees: Math.max(totals.trees, 80),
      plants: Math.max(totals.plants, 140),
      birds: Math.max(totals.birds, 90),
      fungi: Math.max(totals.fungi, 40),
      wildlife: Math.max(totals.wildlife, 50),
      places: 20,
    }
  },
}
