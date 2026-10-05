/**
 * Future data source adapters.
 *
 * The MVP uses local seed data via services in src/services/.
 * When connecting real APIs, implement these interfaces and swap the
 * service implementations — UI components should not import raw datasets.
 */

import type {
  Species,
  Tree,
  NaturePlace,
  NatureMission,
  AdventureTemplate,
  Coordinates,
  NearbyDiscovery,
} from '@/types'

export interface SpeciesDataSource {
  list(regionId: string): Promise<Species[]>
  get(id: string): Promise<Species | null>
  search(query: string, regionId: string): Promise<Species[]>
}

export interface PlaceDataSource {
  list(regionId: string): Promise<NaturePlace[]>
  get(id: string): Promise<NaturePlace | null>
  nearby(origin: Coordinates, radiusMiles: number, regionId: string): Promise<NearbyDiscovery[]>
}

export interface TreeDataSource {
  list(regionId: string): Promise<Tree[]>
  get(id: string): Promise<Tree | null>
  notable(regionId: string): Promise<Tree[]>
}

export interface MissionDataSource {
  list(regionId: string): Promise<NatureMission[]>
  get(id: string): Promise<NatureMission | null>
}

export interface AdventureDataSource {
  list(regionId: string): Promise<AdventureTemplate[]>
  get(id: string): Promise<AdventureTemplate | null>
  generate(params: {
    regionId: string
    timeMinutes: number
    themes: string[]
    origin?: Coordinates
  }): Promise<AdventureTemplate>
}

export interface MapDataSource {
  /** Return tiles / vector layers / GeoJSON for a region */
  getRegionMap(regionId: string): Promise<{
    provider: 'schematic' | 'mapbox' | 'maplibre' | 'google' | 'osm'
    center: Coordinates
    geojson?: unknown
  }>
}

/**
 * Suggested wiring when credentials exist:
 *
 * - OpenStreetMap / Overpass: parks, waterways, footpaths
 * - Ancient Tree Inventory: notable/ancient trees
 * - GBIF / iNaturalist: species occurrence records
 * - UK biodiversity / NBN Atlas: verified local records
 * - Local authority open data: greenspace polygons
 * - Weather APIs: condition-aware seasonal prompts
 *
 * Keep regionId as the primary scoping key so Guildford → Surrey → UK
 * expansion does not require rewriting consumers.
 */
export const DATA_SOURCE_TODO = {
  osm: 'Replace schematic map with MapLibre + OSM tiles; query Overpass for leisure=park, natural=wood, waterway=river.',
  ati: 'Ingest Ancient Tree Inventory points into TreeDataSource with verified=true flag.',
  inaturalist: 'Map iNaturalist taxa + observations into Species + optional NatureObservation sync.',
  gbif: 'Use GBIF occurrence search bounded by region bbox for rarity/seasonal heuristics.',
  rightsOfWay: 'Overlay PROW/open access layers for adventure generation constraints.',
  weather: 'Combine Met Office / Open-Meteo with seasonal engine for “today’s conditions”.',
} as const
