import { Link } from 'react-router-dom'
import type { Species, NatureMission, SeasonalHighlight, AdventureTemplate, NearbyDiscovery } from '@/types'
import { Card, Pill, Button, ProgressBar } from '@/components/ui/Primitives'
import { categoryLabel, rarityLabel } from '@/utils/search'
import { formatDistance } from '@/utils/geo'
import { Check, Circle } from 'lucide-react'

export function SeasonalCard({ highlight }: { highlight: SeasonalHighlight }) {
  return (
    <Card className="min-w-[260px] snap-start p-5" href="/explore">
      <div className="mb-3 text-3xl">{highlight.icon}</div>
      <h3 className="font-display text-lg text-forest leading-snug">{highlight.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">{highlight.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <Pill tone="gold">Best time</Pill>
        <span className="text-xs font-medium text-charcoal-muted">{highlight.bestTime}</span>
      </div>
      {highlight.id === 'sh-fungi-season' && (
        <p className="mt-3 text-xs font-medium text-moss">7 species worth looking for</p>
      )}
    </Card>
  )
}

export function AdventureCard({ adventure }: { adventure: AdventureTemplate }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="bg-gradient-to-br from-forest via-forest-light to-moss px-5 py-6 text-cream">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-moss-light">
          Your next adventure
        </p>
        <h3 className="mt-2 font-display text-2xl leading-tight">{adventure.title}</h3>
        <p className="mt-2 text-sm text-cream/80">
          {adventure.distanceKm} km · ~{adventure.estimatedMinutes} min
        </p>
        <ul className="mt-4 space-y-1.5 text-sm text-cream/90">
          {adventure.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-between gap-3 bg-white px-5 py-4">
        <Pill tone="demo">Schematic route</Pill>
        <Link to={`/adventure/${adventure.id}`}>
          <Button>Start Adventure</Button>
        </Link>
      </div>
    </Card>
  )
}

export function MissionCard({
  mission,
  progress,
  completed,
  onToggle,
  onComplete,
}: {
  mission: NatureMission
  progress: Record<string, number>
  completed: boolean
  onToggle: (objectiveId: string) => void
  onComplete: () => void
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{mission.icon}</span>
            <h3 className="font-display text-lg text-forest">{mission.title}</h3>
          </div>
          <p className="mt-1 text-sm text-charcoal-muted">{mission.description}</p>
        </div>
        <Pill tone={completed ? 'forest' : 'gold'}>+{mission.xpReward} XP</Pill>
      </div>
      <ul className="mt-4 space-y-2">
        {mission.objectives.map((obj) => {
          const done = (progress[obj.id] ?? 0) >= obj.targetCount
          return (
            <li key={obj.id}>
              <button
                type="button"
                onClick={() => onToggle(obj.id)}
                className="flex w-full items-center gap-2 rounded-lg px-1 py-1 text-left text-sm hover:bg-cream"
              >
                {done ? (
                  <Check size={16} className="text-moss" />
                ) : (
                  <Circle size={16} className="text-stone-light" />
                )}
                <span className={done ? 'text-charcoal-muted line-through' : 'text-charcoal'}>
                  {obj.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      {!completed && (
        <div className="mt-4">
          <Button variant="secondary" className="w-full" onClick={onComplete}>
            Mark mission complete
          </Button>
        </div>
      )}
      {completed && (
        <p className="mt-4 text-center text-xs font-semibold uppercase tracking-wider text-moss">
          Completed
        </p>
      )}
    </Card>
  )
}

export function SpeciesCard({ species, discovered }: { species: Species; discovered?: boolean }) {
  return (
    <Card className="p-4" href={`/explore/species/${species.id}`}>
      <div className="flex items-start gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${
            discovered === false ? 'bg-charcoal/90 text-transparent' : 'bg-cream-dark'
          }`}
        >
          <span className={discovered === false ? 'opacity-30 grayscale' : ''}>{species.image}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base text-forest">{species.name}</h3>
          <p className="text-xs text-charcoal-muted">
            {species.image} {categoryLabel(species.category)}
          </p>
          <p className="mt-1 text-xs text-stone">
            {species.rarity === 'seasonal'
              ? 'Seasonal highlight'
              : species.rarity === 'common'
                ? 'Common locally'
                : rarityLabel(species.rarity).toLowerCase()}
          </p>
          <p className="mt-2 text-xs font-medium text-moss">Learn more →</p>
        </div>
      </div>
    </Card>
  )
}

export function DailyDiscoveryCard({
  species,
  discovered,
  onDiscover,
}: {
  species: Species
  discovered: boolean
  onDiscover: () => void
}) {
  return (
    <Card className="p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
        Today&apos;s discovery
      </p>
      <div className="mt-3 flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cream-dark text-4xl">
          {species.image}
        </div>
        <div className="flex-1">
          <p className="text-xs text-charcoal-muted">Today&apos;s species</p>
          <h3 className="font-display text-xl text-forest">{species.name}</h3>
          <p className="mt-2 text-xs font-medium text-moss">Look for:</p>
          <ul className="mt-1 space-y-0.5 text-sm text-charcoal-muted">
            {species.identifyingFeatures.slice(0, 3).map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4">
        {discovered ? (
          <p className="text-center text-sm font-medium text-moss">Discovered today ✓</p>
        ) : (
          <Button className="w-full" onClick={onDiscover}>
            Discover
          </Button>
        )}
      </div>
    </Card>
  )
}

export function NearbySection({
  total,
  counts,
  nearest,
}: {
  total: number
  counts: { trees: number; plants: number; birds: number; insects: number; fungi: number; places: number }
  nearest: NearbyDiscovery[]
}) {
  const cats = [
    { icon: '🌳', label: 'Trees', n: counts.trees },
    { icon: '🌸', label: 'Plants', n: counts.plants },
    { icon: '🐦', label: 'Birds', n: counts.birds },
    { icon: '🦋', label: 'Insects', n: counts.insects },
    { icon: '🍄', label: 'Fungi', n: counts.fungi },
    { icon: '🏞️', label: 'Places', n: counts.places },
  ]

  return (
    <div>
      <SectionTitle eyebrow="What's nearby" title={`${total} discoveries nearby`} />
      <p className="mb-4 text-sm text-charcoal-muted">Within about 1 mile of the demo starting point.</p>
      <div className="mb-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {cats.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-3 text-center shadow-soft border border-forest/5">
            <div className="text-xl">{c.icon}</div>
            <div className="mt-1 text-[10px] font-medium text-charcoal-muted">{c.label}</div>
            <div className="text-sm font-semibold text-forest">{c.n}</div>
          </div>
        ))}
      </div>
      <Card className="p-5">
        <h3 className="font-display text-base text-forest">Nearest discoveries</h3>
        <ol className="mt-3 space-y-2">
          {nearest.slice(0, 5).map((n, i) => (
            <li key={n.id}>
              <Link
                to={
                  n.refType === 'species'
                    ? `/explore/species/${n.refId}`
                    : n.refType === 'tree'
                      ? `/explore/trees/${n.refId}`
                      : `/explore/places/${n.refId}`
                }
                className="flex items-center justify-between rounded-xl px-2 py-2 text-sm hover:bg-cream"
              >
                <span>
                  <span className="mr-2 text-charcoal-muted">{i + 1}.</span>
                  {n.icon} {n.name}
                </span>
                <span className="text-xs text-stone">{formatDistance(n.distanceMiles)}</span>
              </Link>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  )
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-2">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-moss">{eyebrow}</p>
      <h2 className="font-display text-xl text-forest md:text-2xl">{title}</h2>
    </div>
  )
}

export function SeasonBars({ interest }: { interest: Species['seasonalInterest'] }) {
  const rows = [
    { label: 'Spring', value: interest.spring },
    { label: 'Summer', value: interest.summer },
    { label: 'Autumn', value: interest.autumn },
    { label: 'Winter', value: interest.winter },
  ]
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3 text-sm">
          <span className="w-16 text-charcoal-muted">{r.label}</span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-cream-dark">
            <div
              className="h-full rounded-full bg-moss"
              style={{ width: `${r.value * 10}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export { ProgressBar }
