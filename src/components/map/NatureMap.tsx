import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Map, { Marker, NavigationControl, AttributionControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { placeService } from '@/services/placeService'
import { speciesService } from '@/services/speciesService'
import { config, mapTilerStyleUrl } from '@/config/env'
import { Card, DemoBanner, Pill } from '@/components/ui/Primitives'
import { SchematicMap } from './SchematicMap'

type SelectedMarker = {
  id: string
  label: string
  subtitle: string
  href: string
  kind: 'place' | 'tree' | 'discovery'
  isDemo: boolean
}

export function NatureMap() {
  const styleUrl = mapTilerStyleUrl()

  if (!styleUrl) {
    return (
      <div className="space-y-3">
        <DemoBanner>
          Add <code className="font-mono text-[11px]">VITE_MAPTILER_KEY</code> to <code className="font-mono text-[11px]">.env</code> for the live MapTiler map. Showing schematic fallback.
        </DemoBanner>
        <SchematicMap />
      </div>
    )
  }

  return <LiveMap styleUrl={styleUrl} />
}

function LiveMap({ styleUrl }: { styleUrl: string }) {
  const [selected, setSelected] = useState<SelectedMarker | null>(null)

  const markers = useMemo(() => {
    const list: Array<SelectedMarker & { lat: number; lng: number; color: string }> = []

    for (const place of placeService.getAll()) {
      list.push({
        id: place.id,
        label: place.name,
        subtitle: `${place.type} · Place`,
        href: `/explore/places/${place.id}`,
        kind: 'place',
        isDemo: place.isDemo,
        lat: place.location.lat,
        lng: place.location.lng,
        color: place.type === 'river' ? '#4a7a8c' : place.type === 'woodland' ? '#2a5240' : '#5a7d4e',
      })
    }

    for (const tree of placeService.getNotableTrees()) {
      list.push({
        id: tree.id,
        label: tree.name,
        subtitle: 'Tree · Notable',
        href: `/explore/trees/${tree.id}`,
        kind: 'tree',
        isDemo: true,
        lat: tree.location.lat,
        lng: tree.location.lng,
        color: '#c4843a',
      })
    }

    speciesService.getSeasonalHighlights('guildford', 4).forEach((s, i) => {
      const place = placeService.getAll().find((p) => p.speciesIds.includes(s.id))
      if (!place) return
      list.push({
        id: `disc-${s.id}`,
        label: s.name,
        subtitle: 'Seasonal discovery',
        href: `/explore/species/${s.id}`,
        kind: 'discovery',
        isDemo: true,
        lat: place.location.lat + 0.001 * (i % 2 === 0 ? 1 : -1),
        lng: place.location.lng + 0.0015 * (i % 3),
        color: '#8faf6e',
      })
    })

    return list
  }, [])

  return (
    <div className="space-y-4">
      <DemoBanner>
        Live MapTiler basemap. Marker positions from seed/demo data until verified datasets are connected.
      </DemoBanner>

      <div className="relative overflow-hidden rounded-3xl border border-forest/10 shadow-card aspect-[4/5] sm:aspect-[5/4]">
        <Map
          initialViewState={{
            latitude: config.guildford.lat,
            longitude: config.guildford.lng,
            zoom: config.guildford.zoom,
          }}
          mapStyle={styleUrl}
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
        >
          <NavigationControl position="top-right" showCompass={false} />
          <AttributionControl compact position="bottom-right" />

          {markers.map((m) => (
            <Marker
              key={m.id}
              latitude={m.lat}
              longitude={m.lng}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                setSelected(m)
              }}
            >
              <button
                type="button"
                aria-label={m.label}
                className={`h-3.5 w-3.5 rounded-full border-2 border-white shadow-soft transition-transform hover:scale-125 ${
                  selected?.id === m.id ? 'ring-2 ring-forest scale-125' : ''
                }`}
                style={{ backgroundColor: m.color }}
              />
            </Marker>
          ))}
        </Map>

        <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-forest shadow-soft">
          Guildford · MapTiler
        </div>

        {selected && (
          <div className="absolute inset-x-3 bottom-3 z-10 animate-scale-in">
            <Card className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg text-forest">{selected.label}</h3>
                  <p className="text-sm text-charcoal-muted">{selected.subtitle}</p>
                  {selected.isDemo && (
                    <div className="mt-2">
                      <Pill tone="demo">Demo location</Pill>
                    </div>
                  )}
                </div>
                <Link to={selected.href} className="text-sm font-semibold text-moss whitespace-nowrap">
                  Tap to discover →
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-charcoal-muted">
        <Legend color="#5a7d4e" label="Places" />
        <Legend color="#c4843a" label="Notable trees" />
        <Legend color="#8faf6e" label="Discoveries" />
      </div>

      <p className="text-[11px] text-stone">
        Map data © MapTiler © OpenStreetMap contributors
      </p>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}
