import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { speciesService } from '@/services/speciesService'
import { missionService } from '@/services/missionService'
import { placeService } from '@/services/placeService'
import { useProgress } from '@/hooks/useProgress'
import { Button, Card, DemoBanner, Pill } from '@/components/ui/Primitives'
import { SeasonBars } from '@/components/discover/Cards'
import { categoryLabel, rarityLabel } from '@/utils/search'

export function SpeciesDetailPage() {
  const { id } = useParams()
  const { discoverSpecies, hasDiscovered, completeMission } = useProgress()
  const species = id ? speciesService.getById(id) : undefined

  if (!species) {
    return <NotFound label="Species" />
  }

  const discovered = hasDiscovered(species.id)
  const relatedMissions = missionService.getRelatedToSpecies(species.id)
  const nearbyPlaces = placeService
    .getAll()
    .filter((p) => p.speciesIds.includes(species.id))
    .slice(0, 3)
  const relatedTrees = placeService
    .getTrees()
    .filter((t) => t.speciesId === species.id)
    .slice(0, 3)

  return (
    <div className="space-y-8 animate-fade-in">
      <Link to="/explore" className="inline-flex items-center gap-1 text-sm text-charcoal-muted hover:text-forest">
        <ArrowLeft size={16} /> Explore
      </Link>

      <header>
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-5xl shadow-soft">
          {species.image}
        </div>
        <h1 className="font-display text-3xl text-forest md:text-4xl">{species.name}</h1>
        <p className="mt-1 italic text-charcoal-muted">{species.scientificName}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Pill>
            {species.image} {categoryLabel(species.category)}
          </Pill>
          <Pill tone="forest">{rarityLabel(species.rarity)}</Pill>
          <Pill tone="demo">Guildford area</Pill>
        </div>
      </header>

      <DemoBanner>Species guidance is educational demo content — verify with local field guides.</DemoBanner>

      <section>
        <h2 className="font-display text-xl text-forest">How to recognise it</h2>
        <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">{species.howToRecognise}</p>
      </section>

      <section>
        <h2 className="font-display text-xl text-forest">Look for</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {species.identifyingFeatures.map((f) => (
            <li key={f} className="rounded-xl bg-white px-4 py-3 text-sm shadow-soft border border-forest/5">
              {f}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl text-forest">When to see it</h2>
        <Card className="p-5">
          <SeasonBars interest={species.seasonalInterest} />
          {species.seasonalInterest.notes && (
            <p className="mt-3 text-xs text-charcoal-muted">{species.seasonalInterest.notes}</p>
          )}
        </Card>
      </section>

      {(nearbyPlaces.length > 0 || relatedTrees.length > 0) && (
        <section>
          <h2 className="mb-3 font-display text-xl text-forest">Nearby discoveries</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedTrees.map((t) => (
              <Card key={t.id} className="p-4" href={`/explore/trees/${t.id}`}>
                <p className="font-display text-forest">{t.name}</p>
                <p className="text-xs text-charcoal-muted">{t.location.label}</p>
              </Card>
            ))}
            {nearbyPlaces.map((p) => (
              <Card key={p.id} className="p-4" href={`/explore/places/${p.id}`}>
                <p className="font-display text-forest">{p.name}</p>
                <p className="text-xs capitalize text-charcoal-muted">{p.type}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {relatedMissions[0] && (
        <section>
          <h2 className="mb-3 font-display text-xl text-forest">Nature mission</h2>
          <Card className="p-5">
            <p className="font-display text-lg text-forest">{relatedMissions[0].title}</p>
            <p className="mt-1 text-sm text-charcoal-muted">{relatedMissions[0].description}</p>
            <div className="mt-4 flex items-center justify-between">
              <Pill tone="gold">+{relatedMissions[0].xpReward} XP</Pill>
              <Button variant="secondary" onClick={() => completeMission(relatedMissions[0].id)}>
                Complete
              </Button>
            </div>
          </Card>
        </section>
      )}

      <Button className="w-full" disabled={discovered} onClick={() => discoverSpecies(species.id)}>
        {discovered ? 'Already in your collection' : 'Mark as discovered · +25 XP'}
      </Button>
    </div>
  )
}

export function TreeDetailPage() {
  const { id } = useParams()
  const { discoverTree, hasDiscovered } = useProgress()
  const tree = id ? placeService.getTreeById(id) : undefined
  const species = tree ? speciesService.getById(tree.speciesId) : undefined

  if (!tree || !species) return <NotFound label="Tree" />

  return (
    <div className="space-y-8 animate-fade-in">
      <Link to="/explore" className="inline-flex items-center gap-1 text-sm text-charcoal-muted">
        <ArrowLeft size={16} /> Explore
      </Link>
      <header>
        <p className="text-4xl">🌳</p>
        <h1 className="mt-2 font-display text-3xl text-forest">{tree.name}</h1>
        <p className="mt-1 text-sm text-charcoal-muted">
          🌳 {species.name} · 📍 {tree.location.label}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {tree.isAncient && <Pill tone="gold">⭐ Ancient tree</Pill>}
          {tree.isNotable && !tree.isAncient && <Pill tone="gold">⭐ Notable tree</Pill>}
          <Pill tone="demo">Demo specimen</Pill>
        </div>
      </header>
      <DemoBanner>
        Tree age, girth and coordinates are illustrative sample data until verified against public inventories.
      </DemoBanner>
      <p className="text-sm leading-relaxed text-charcoal-muted">{tree.description}</p>
      <Card className="space-y-2 p-5 text-sm">
        {tree.estimatedAgeYears && (
          <p>
            <span className="text-charcoal-muted">Estimated age: </span>
            ~{tree.estimatedAgeYears} years
          </p>
        )}
        {tree.girthCm && (
          <p>
            <span className="text-charcoal-muted">Approx. girth: </span>
            {tree.girthCm} cm
          </p>
        )}
        <p>
          <span className="text-charcoal-muted">Seasonal interest: </span>
          {tree.seasonalInterest}
        </p>
      </Card>
      <Link to={`/explore/species/${species.id}`} className="block text-sm font-semibold text-moss">
        Learn about {species.name} →
      </Link>
      <Button
        className="w-full"
        disabled={hasDiscovered(species.id)}
        onClick={() => discoverTree(tree.id)}
      >
        {hasDiscovered(species.id) ? 'Species already collected' : `Discover this tree · +${tree.isNotable ? 50 : 25} XP`}
      </Button>
    </div>
  )
}

export function PlaceDetailPage() {
  const { id } = useParams()
  const { discoverPlace, progress } = useProgress()
  const place = id ? placeService.getById(id) : undefined

  if (!place) return <NotFound label="Place" />

  const visited = progress.completedPlaceIds.includes(place.id)
  const relatedSpecies = place.speciesIds
    .map((sid) => speciesService.getById(sid))
    .filter(Boolean)

  return (
    <div className="space-y-8 animate-fade-in">
      <Link to="/explore" className="inline-flex items-center gap-1 text-sm text-charcoal-muted">
        <ArrowLeft size={16} /> Explore
      </Link>
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-moss capitalize">{place.type}</p>
        <h1 className="mt-1 font-display text-3xl text-forest">{place.name}</h1>
        <Pill tone="demo">Demo place data</Pill>
      </header>
      <p className="text-sm leading-relaxed text-charcoal-muted">{place.description}</p>
      <div className="flex flex-wrap gap-2">
        {place.highlights.map((h) => (
          <Pill key={h}>{h}</Pill>
        ))}
      </div>
      <section>
        <h2 className="mb-3 font-display text-xl text-forest">What you might find</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {relatedSpecies.map((s) =>
            s ? (
              <Card key={s.id} className="p-4" href={`/explore/species/${s.id}`}>
                <span className="text-2xl">{s.image}</span>
                <p className="mt-1 font-display text-forest">{s.name}</p>
              </Card>
            ) : null,
          )}
        </div>
      </section>
      <Button className="w-full" disabled={visited} onClick={() => discoverPlace(place.id)}>
        {visited ? 'Place explored' : 'Mark as explored · +30 XP'}
      </Button>
    </div>
  )
}

function NotFound({ label }: { label: string }) {
  return (
    <div className="py-20 text-center">
      <p className="font-display text-2xl text-forest">{label} not found</p>
      <Link to="/explore" className="mt-4 inline-block text-sm text-moss">
        Back to Explore
      </Link>
    </div>
  )
}
