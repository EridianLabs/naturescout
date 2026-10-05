import type { Region } from '@/types'

/** Geographic hierarchy — Guildford → Surrey → UK → expand later */
export const regions: Region[] = [
  {
    id: 'uk',
    name: 'United Kingdom',
    country: 'UK',
    center: { lat: 54.0, lng: -2.0, isDemo: true },
    bounds: { north: 59.0, south: 49.8, east: 2.0, west: -8.0 },
  },
  {
    id: 'surrey',
    name: 'Surrey',
    parentId: 'uk',
    country: 'UK',
    center: { lat: 51.25, lng: -0.4, isDemo: true },
    bounds: { north: 51.45, south: 51.05, east: 0.05, west: -0.85 },
  },
  {
    id: 'guildford',
    name: 'Guildford',
    parentId: 'surrey',
    country: 'UK',
    center: { lat: 51.2362, lng: -0.5704, isDemo: true, label: 'Guildford town centre (demo)' },
    bounds: { north: 51.28, south: 51.2, east: -0.5, west: -0.65 },
  },
]

export const DEFAULT_REGION_ID = 'guildford'

export function getRegion(id: string): Region | undefined {
  return regions.find((r) => r.id === id)
}
