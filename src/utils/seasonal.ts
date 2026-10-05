import type { Season } from '@/types'
import {
  getSeasonForDate,
  getHighlightsForSeason,
  SEASON_LABELS,
  SEASON_THEMES,
} from '@/data/seasonal'

export function getCurrentSeason(date: Date = new Date()): Season {
  return getSeasonForDate(date)
}

export function getSeasonLabel(season: Season): string {
  return SEASON_LABELS[season]
}

export function getSeasonalContext(regionId = 'guildford', date: Date = new Date()) {
  const season = getSeasonForDate(date)
  const month = date.toLocaleString('en-GB', { month: 'long' })
  const themes = SEASON_THEMES[season]
  const highlights = getHighlightsForSeason(season, regionId)
  return {
    season,
    seasonLabel: SEASON_LABELS[season],
    month,
    themes: themes.themes,
    title: themes.title,
    suggestedMissionTags: themes.suggestedMissionTags,
    highlights,
  }
}

export function greetingForHour(hour: number = new Date().getHours()): string {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
