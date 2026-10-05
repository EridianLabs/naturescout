import type { NatureMission, Season } from '@/types'
import { missions, getMissionById } from '@/data/missions'
import { getCurrentSeason } from '@/utils/seasonal'

export const missionService = {
  getAll(): NatureMission[] {
    return missions
  },

  getById(id: string): NatureMission | undefined {
    return getMissionById(id)
  },

  getSuggested(season: Season = getCurrentSeason(), limit = 4): NatureMission[] {
    const seasonal = missions.filter(
      (m) => !m.seasonHint || m.seasonHint.includes(season),
    )
    const preferred = seasonal.filter((m) => m.seasonHint?.includes(season))
    const pool = preferred.length >= limit ? preferred : seasonal
    return pool.slice(0, limit)
  },

  getRelatedToSpecies(speciesId: string): NatureMission[] {
    return missions.filter((m) => m.relatedSpeciesIds.includes(speciesId))
  },
}
