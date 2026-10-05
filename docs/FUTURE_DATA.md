# Future data integration

NatureScout’s MVP runs entirely on local seed data. The service layer
(`src/services/`) and adapter interfaces (`src/services/adapters.ts`) are the
swap points for real public datasets.

## Design principle

- **UI → services → data sources**
- Never import `src/data/*` from page components once real APIs arrive
- Scope everything by `regionId` (`guildford` → `surrey` → `uk` → …)
- Keep an explicit `isDemo` / `verified` flag on geographic claims

## Suggested integrations

### Mapping

| Source | Use |
|--------|-----|
| OpenStreetMap + MapLibre GL | Basemap, parks, woods, water |
| Overpass API | Query `leisure=park`, `natural=wood`, `waterway=*` |
| Ordnance Survey OpenData | Higher-quality UK basemaps / greenspace |
| Google Maps / Mapbox | Only if product later needs commercial SDKs |

Replace `SchematicMap` with a `MapView` that implements `MapDataSource`.

### Trees

| Source | Use |
|--------|-----|
| Ancient Tree Inventory | Notable / ancient specimens |
| Local Tree Officer / council open data | Street & park trees |
| Woodland Trust | Ancient woodland context |

### Biodiversity

| Source | Use |
|--------|-----|
| iNaturalist | Observations, community IDs, photos |
| GBIF | Occurrence density & phenology |
| NBN Atlas | UK verified records |
| RSPB / BTO | Bird seasonal guidance |

### Access & routes

| Source | Use |
|--------|-----|
| Public rights of way | Legal walking network |
| OpenAccess / CRoW | Access land |
| Local authority PROW exports | Surrey / Guildford paths |

### Weather & seasons

| Source | Use |
|--------|-----|
| Open-Meteo | Free weather for “good day to go” |
| Met Office | UK-focused forecasts |

Combine with `src/utils/seasonal.ts` rather than hard-coding seasonal UI.

## Migration checklist

1. Implement a concrete `*DataSource` from `adapters.ts`
2. Point the matching `*Service` at the new source (feature flag if needed)
3. Mark seed records as `isDemo: true` until replaced
4. Add caching + offline fallback to seed data
5. Expand `regions.ts` hierarchy without changing route structure

## What not to do in MVP

- Do not call external APIs without keys/config
- Do not claim schematic coordinates are survey-accurate
- Do not fabricate Ancient Tree Inventory records
