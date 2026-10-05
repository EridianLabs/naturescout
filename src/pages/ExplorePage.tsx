import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { speciesService } from '@/services/speciesService'
import { placeService } from '@/services/placeService'
import { searchAll } from '@/utils/search'
import type { DiscoveryFilter } from '@/types'
import { SpeciesCard } from '@/components/discover/Cards'
import { TreeSummary, PlaceSummary } from '@/components/map/SchematicMap'
import { useProgress } from '@/hooks/useProgress'
import { Pill } from '@/components/ui/Primitives'

const FILTERS: { id: DiscoveryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'trees', label: 'Trees' },
  { id: 'plants', label: 'Plants' },
  { id: 'birds', label: 'Birds' },
  { id: 'fungi', label: 'Fungi' },
  { id: 'wildlife', label: 'Wildlife' },
  { id: 'places', label: 'Places' },
]

export function ExplorePage() {
  const { progress, hasDiscovered } = useProgress()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<DiscoveryFilter>('all')

  const searchResults = useMemo(() => (query.trim() ? searchAll(query) : []), [query])
  const species = useMemo(() => speciesService.filter(filter, progress.regionId), [filter, progress.regionId])
  const trees = placeService.getTrees(progress.regionId)
  const places = placeService.getAll(progress.regionId)

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-display text-3xl text-forest">Explore Guildford</h1>
        <p className="mt-2 text-sm text-charcoal-muted">
          Search trees, birds, plants, places and more.
        </p>
      </header>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search trees, birds, plants, places..."
          className="w-full rounded-2xl border border-forest/10 bg-white py-3.5 pl-11 pr-4 text-sm shadow-soft outline-none placeholder:text-stone focus:border-moss/40 focus:ring-2 focus:ring-moss/20"
        />
      </div>

      {query.trim() ? (
        <div className="space-y-2">
          <p className="text-xs font-medium text-charcoal-muted">
            {searchResults.length} result{searchResults.length === 1 ? '' : 's'}
          </p>
          {searchResults.map((r) => (
            <Link
              key={`${r.type}-${r.id}`}
              to={r.href}
              className="flex items-center gap-3 rounded-2xl border border-forest/5 bg-white px-4 py-3 shadow-soft"
            >
              <span className="text-2xl">{r.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-forest">{r.title}</p>
                <p className="truncate text-xs capitalize text-charcoal-muted">
                  {r.subtitle} · {r.type}
                </p>
              </div>
            </Link>
          ))}
          {searchResults.length === 0 && (
            <p className="rounded-2xl bg-cream-dark px-4 py-8 text-center text-sm text-charcoal-muted">
              Nothing matched “{query}”. Try oak, robin, river, fungi…
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  filter === f.id
                    ? 'bg-forest text-cream'
                    : 'bg-white text-charcoal-muted border border-forest/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {(filter === 'all' || filter === 'trees') && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-xl text-forest">Trees near Guildford</h2>
                <Pill tone="demo">Demo specimens</Pill>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {(filter === 'trees' ? trees : trees.slice(0, 4)).map((t) => (
                  <TreeSummary key={t.id} tree={t} />
                ))}
              </div>
            </section>
          )}

          {filter === 'places' ? (
            <section>
              <h2 className="mb-3 font-display text-xl text-forest">Places</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {places.map((p) => (
                  <PlaceSummary key={p.id} place={p} />
                ))}
              </div>
            </section>
          ) : (
            <section>
              <h2 className="mb-3 font-display text-xl text-forest">
                {filter === 'all' ? 'Species to discover' : FILTERS.find((f) => f.id === filter)?.label}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {species.map((s) => (
                  <SpeciesCard key={s.id} species={s} discovered={hasDiscovered(s.id)} />
                ))}
              </div>
            </section>
          )}

          {filter === 'all' && (
            <section>
              <h2 className="mb-3 font-display text-xl text-forest">Places</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {places.slice(0, 6).map((p) => (
                  <PlaceSummary key={p.id} place={p} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
