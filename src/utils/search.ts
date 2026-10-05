import type { SearchResult, SpeciesCategory } from '@/types'
import { species } from '@/data/species'
import { trees } from '@/data/trees'
import { places } from '@/data/places'
import { missions } from '@/data/missions'
import { getSpeciesById } from '@/data/species'

const CATEGORY_ICONS: Record<string, string> = {
  tree: '🌳',
  plant: '🌸',
  bird: '🐦',
  mammal: '🦊',
  fungi: '🍄',
  insect: '🦋',
  wildlife: '🦌',
  park: '🏞️',
  woodland: '🌲',
  river: '💧',
  heath: '🌿',
  meadow: '🌼',
  reserve: '🛡️',
  common: '🟩',
  viewpoint: '🌄',
}

function matchesQuery(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase())
}

export function searchAll(query: string, limit = 30): SearchResult[] {
  const q = query.trim()
  if (!q) return []

  const results: SearchResult[] = []

  for (const s of species) {
    const hay = [s.name, s.scientificName, s.category, s.description, ...s.tags, ...s.identifyingFeatures].join(' ')
    if (matchesQuery(hay, q)) {
      results.push({
        id: s.id,
        title: s.name,
        subtitle: s.scientificName,
        category: s.category,
        icon: s.image,
        href: `/explore/species/${s.id}`,
        type: 'species',
      })
    }
  }

  for (const t of trees) {
    const sp = getSpeciesById(t.speciesId)
    const hay = [t.name, t.description, t.seasonalInterest, sp?.name ?? '', t.location.label ?? ''].join(' ')
    if (matchesQuery(hay, q)) {
      results.push({
        id: t.id,
        title: t.name,
        subtitle: sp?.name ?? 'Tree',
        category: 'tree',
        icon: '🌳',
        href: `/explore/trees/${t.id}`,
        type: 'tree',
      })
    }
  }

  for (const p of places) {
    const hay = [p.name, p.type, p.description, ...p.highlights].join(' ')
    if (matchesQuery(hay, q)) {
      results.push({
        id: p.id,
        title: p.name,
        subtitle: p.type,
        category: p.type,
        icon: CATEGORY_ICONS[p.type] ?? '🏞️',
        href: `/explore/places/${p.id}`,
        type: 'place',
      })
    }
  }

  for (const m of missions) {
    const hay = [m.title, m.description, m.category].join(' ')
    if (matchesQuery(hay, q)) {
      results.push({
        id: m.id,
        title: m.title,
        subtitle: `${m.xpReward} XP · ${m.difficulty}`,
        category: m.category,
        icon: m.icon,
        href: `/missions/${m.id}`,
        type: 'mission',
      })
    }
  }

  return results.slice(0, limit)
}

export function categoryLabel(category: SpeciesCategory | string): string {
  const map: Record<string, string> = {
    tree: 'Tree',
    plant: 'Plant',
    bird: 'Bird',
    mammal: 'Mammal',
    fungi: 'Fungi',
    insect: 'Insect',
    wildlife: 'Wildlife',
  }
  return map[category] ?? category.charAt(0).toUpperCase() + category.slice(1)
}

export function rarityLabel(rarity: string): string {
  return rarity.toUpperCase()
}
