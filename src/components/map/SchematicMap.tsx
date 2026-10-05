import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { placeService } from '@/services/placeService'
import { missionService } from '@/services/missionService'
import { speciesService } from '@/services/speciesService'
import { Card, DemoBanner, Pill } from '@/components/ui/Primitives'
import type { NaturePlace, Tree } from '@/types'

type MarkerKind = 'place' | 'tree' | 'mission' | 'discovery'

interface MapMarker {
  id: string
  kind: MarkerKind
  label: string
  subtitle: string
  x: number
  y: number
  href: string
  tone: string
}

function project(lat: number, lng: number, bounds: { north: number; south: number; east: number; west: number }) {
  const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * 100
  const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * 100
  return {
    x: Math.min(92, Math.max(8, x)),
    y: Math.min(90, Math.max(10, y)),
  }
}

export function SchematicMap() {
  const [selected, setSelected] = useState<MapMarker | null>(null)
  const bounds = { north: 51.28, south: 51.2, east: -0.5, west: -0.65 }

  const markers = useMemo(() => {
    const list: MapMarker[] = []

    for (const place of placeService.getAll()) {
      const { x, y } = project(place.location.lat, place.location.lng, bounds)
      list.push({
        id: place.id,
        kind: 'place',
        label: place.name,
        subtitle: `${place.type} · Place`,
        x,
        y,
        href: `/explore/places/${place.id}`,
        tone: place.type === 'river' ? '#4a7a8c' : place.type === 'woodland' ? '#2a5240' : '#5a7d4e',
      })
    }

    for (const tree of placeService.getNotableTrees()) {
      const { x, y } = project(tree.location.lat, tree.location.lng, bounds)
      list.push({
        id: tree.id,
        kind: 'tree',
        label: tree.name,
        subtitle: 'Tree · Notable',
        x: x + 2,
        y: y - 2,
        href: `/explore/trees/${tree.id}`,
        tone: '#c4843a',
      })
    }

    const missions = missionService.getSuggested().slice(0, 3)
    missions.forEach((m, i) => {
      list.push({
        id: m.id,
        kind: 'mission',
        label: m.title,
        subtitle: 'Mission',
        x: 20 + i * 25,
        y: 78,
        href: `/missions/${m.id}`,
        tone: '#6b8f9e',
      })
    })

    speciesService.getSeasonalHighlights('guildford', 4).forEach((s, i) => {
      list.push({
        id: `disc-${s.id}`,
        kind: 'discovery',
        label: s.name,
        subtitle: 'Discovery point',
        x: 15 + i * 20,
        y: 22 + (i % 2) * 8,
        href: `/explore/species/${s.id}`,
        tone: '#8faf6e',
      })
    })

    return list
  }, [])

  return (
    <div className="space-y-4">
      <DemoBanner>
        Schematic map for Guildford demo data — not geographically accurate. Replace with a real map provider later.
      </DemoBanner>

      <div className="relative overflow-hidden rounded-3xl border border-forest/10 bg-[#dfe8d8] shadow-card aspect-[4/5] sm:aspect-[5/4]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e8efdf" />
              <stop offset="100%" stopColor="#d4e0c8" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#land)" />
          {/* Soft woodland blobs */}
          <ellipse cx="72" cy="28" rx="16" ry="12" fill="#9bb58a" opacity="0.55" />
          <ellipse cx="30" cy="22" rx="14" ry="10" fill="#a3bc8f" opacity="0.5" />
          <ellipse cx="78" cy="70" rx="12" ry="14" fill="#8faf6e" opacity="0.45" />
          {/* Heath */}
          <ellipse cx="28" cy="18" rx="10" ry="7" fill="#c4b896" opacity="0.45" />
          {/* River Wey schematic curve */}
          <path
            d="M 18 5 C 25 25, 35 40, 42 55 S 55 80, 48 98"
            fill="none"
            stroke="#4a7a8c"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M 20 8 C 27 28, 37 42, 44 56 S 56 82, 50 96"
            fill="none"
            stroke="#6b9aab"
            strokeWidth="0.8"
            opacity="0.5"
          />
          {/* Parks */}
          <rect x="48" y="30" width="14" height="10" rx="3" fill="#b7cfa5" opacity="0.7" />
          <rect x="38" y="48" width="10" height="8" rx="2" fill="#c5d8b4" opacity="0.65" />
          {/* Meadow */}
          <ellipse cx="45" cy="85" rx="14" ry="8" fill="#d4e4b8" opacity="0.55" />
        </svg>

        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-forest shadow-soft">
          Guildford · schematic
        </div>

        {markers.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setSelected(m)}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
            aria-label={m.label}
          >
            <span
              className={`block h-3.5 w-3.5 rounded-full border-2 border-white shadow-soft ${
                selected?.id === m.id ? 'ring-2 ring-forest scale-125' : ''
              }`}
              style={{ backgroundColor: m.tone }}
            />
          </button>
        ))}

        {selected && (
          <div className="absolute inset-x-3 bottom-3 animate-scale-in">
            <Card className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg text-forest">{selected.label}</h3>
                  <p className="text-sm text-charcoal-muted">{selected.subtitle}</p>
                  <Pill tone="demo" >Demo location</Pill>
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
        <Legend color="#6b8f9e" label="Missions" />
        <Legend color="#4a7a8c" label="Waterways" />
      </div>
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

export function PlaceSummary({ place }: { place: NaturePlace }) {
  return (
    <Card className="p-4" href={`/explore/places/${place.id}`}>
      <h3 className="font-display text-base text-forest">{place.name}</h3>
      <p className="text-xs capitalize text-charcoal-muted">{place.type}</p>
      <p className="mt-2 line-clamp-2 text-sm text-charcoal-muted">{place.description}</p>
    </Card>
  )
}

export function TreeSummary({ tree }: { tree: Tree }) {
  const species = speciesService.getById(tree.speciesId)
  return (
    <Card className="p-4" href={`/explore/trees/${tree.id}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-base text-forest">{tree.name}</h3>
          <p className="text-xs text-charcoal-muted">
            🌳 {species?.name ?? 'Tree'} · 📍 {tree.location.label ?? 'Nearby'}
          </p>
        </div>
        {(tree.isNotable || tree.isAncient) && <Pill tone="gold">{tree.isAncient ? 'Ancient' : 'Notable'}</Pill>}
      </div>
    </Card>
  )
}
