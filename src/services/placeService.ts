import type { NaturePlace, Tree, NearbyDiscovery } from '@/types'
import { places, getPlaceById } from '@/data/places'
import { trees, getTreeById, getNotableTrees } from '@/data/trees'
import { speciesService } from './speciesService'
import { DEMO_USER_LOCATION } from '@/data/geo'
import { distanceMiles } from '@/utils/geo'

export const placeService = {
  getAll(regionId = 'guildford'): NaturePlace[] {
    return places.filter((p) => p.regionIds.includes(regionId))
  },

  getById(id: string): NaturePlace | undefined {
    return getPlaceById(id)
  },

  getTrees(regionId = 'guildford'): Tree[] {
    return trees.filter((t) => t.regionIds.includes(regionId))
  },

  getTreeById(id: string): Tree | undefined {
    return getTreeById(id)
  },

  getNotableTrees(regionId = 'guildford'): Tree[] {
    return getNotableTrees().filter((t) => t.regionIds.includes(regionId))
  },

  getNearby(
    origin = DEMO_USER_LOCATION,
    radiusMiles = 1,
    regionId = 'guildford',
  ): NearbyDiscovery[] {
    const results: NearbyDiscovery[] = []

    for (const tree of this.getTrees(regionId)) {
      const d = distanceMiles(origin, tree.location)
      if (d <= radiusMiles) {
        const sp = speciesService.getById(tree.speciesId)
        results.push({
          id: tree.id,
          name: tree.name,
          category: 'tree',
          distanceMiles: d,
          refType: 'tree',
          refId: tree.id,
          icon: sp?.image ?? '🌳',
        })
      }
    }

    for (const place of this.getAll(regionId)) {
      const d = distanceMiles(origin, place.location)
      if (d <= radiusMiles) {
        results.push({
          id: place.id,
          name: place.name,
          category: 'place',
          distanceMiles: d,
          refType: 'place',
          refId: place.id,
          icon: place.type === 'river' ? '💧' : place.type === 'woodland' ? '🌲' : '🏞️',
        })
      }
    }

    // Include a few species as "likely nearby" demo discoveries using place proximity
    for (const sp of speciesService.getSeasonalHighlights(regionId, 6)) {
      const relatedPlace = this.getAll(regionId).find((p) => p.speciesIds.includes(sp.id))
      if (!relatedPlace) continue
      const d = distanceMiles(origin, relatedPlace.location)
      if (d <= radiusMiles) {
        results.push({
          id: `near-${sp.id}`,
          name: sp.name,
          category: sp.category,
          distanceMiles: d + 0.05,
          refType: 'species',
          refId: sp.id,
          icon: sp.image,
        })
      }
    }

    return results.sort((a, b) => a.distanceMiles - b.distanceMiles)
  },

  countNearbyByCategory(origin = DEMO_USER_LOCATION, radiusMiles = 1, regionId = 'guildford') {
    const nearby = this.getNearby(origin, radiusMiles, regionId)
    const counts = {
      trees: 0,
      plants: 0,
      birds: 0,
      insects: 0,
      fungi: 0,
      places: 0,
      total: nearby.length,
    }
    for (const n of nearby) {
      if (n.category === 'tree') counts.trees++
      else if (n.category === 'plant') counts.plants++
      else if (n.category === 'bird') counts.birds++
      else if (n.category === 'insect') counts.insects++
      else if (n.category === 'fungi') counts.fungi++
      else if (n.category === 'place') counts.places++
    }
    return counts
  },
}
