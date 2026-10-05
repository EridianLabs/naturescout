import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '@/hooks/useProgress'
import { progressService } from '@/services/progressService'
import { speciesService } from '@/services/speciesService'
import { Card, ProgressBar, Pill } from '@/components/ui/Primitives'
import { categoryLabel } from '@/utils/search'

export function CollectionPage() {
  const { progress, hasDiscovered } = useProgress()
  const stats = useMemo(() => progressService.getCollectionStats(progress), [progress])
  const allSpecies = speciesService.getAll(progress.regionId)

  const discoveredSet = useMemo(
    () => new Set(progress.discoveries.map((d) => d.speciesId)),
    [progress.discoveries],
  )

  const discoveryDates = useMemo(() => {
    const map = new Map<string, string>()
    for (const d of progress.discoveries) {
      map.set(d.speciesId, d.discoveredAt)
    }
    return map
  }, [progress.discoveries])

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="font-display text-3xl text-forest">Your Nature Collection</h1>
        <p className="mt-2 text-sm text-charcoal-muted">
          A sophisticated field collection — not a cartoon Pokédex.
        </p>
      </header>

      <Card className="p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-moss">Guildford</p>
            <p className="mt-1 font-display text-2xl text-forest">
              {stats.discovered} / {stats.total} discoveries
            </p>
          </div>
          <p className="text-sm font-semibold text-gold">{stats.percent}% explored</p>
        </div>
        <ProgressBar value={stats.percent / 100} className="mt-4" />
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Object.entries(stats.byCategory).map(([label, val]) => (
            <div key={label} className="rounded-xl bg-cream px-3 py-2">
              <p className="text-xs text-charcoal-muted">{label}</p>
              <p className="font-semibold text-forest">
                {val.discovered} / {val.total}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <section>
        <h2 className="mb-4 font-display text-xl text-forest">Species</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {allSpecies.map((s) => {
            const found = discoveredSet.has(s.id) || hasDiscovered(s.id)
            const date = discoveryDates.get(s.id)
            const content = (
              <div
                className={`rounded-2xl border p-4 text-center transition-transform ${
                  found
                    ? 'border-forest/10 bg-white shadow-soft hover:-translate-y-0.5'
                    : 'border-transparent bg-charcoal/90'
                }`}
              >
                <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${found ? 'bg-cream-dark' : 'bg-charcoal'}`}>
                  <span className={found ? '' : 'opacity-25 grayscale contrast-50'}>{s.image}</span>
                </div>
                <p className={`mt-3 truncate text-sm font-medium ${found ? 'text-forest' : 'text-stone-light'}`}>
                  {found ? s.name : '???'}
                </p>
                <p className={`mt-0.5 text-[10px] uppercase tracking-wider ${found ? 'text-charcoal-muted' : 'text-stone'}`}>
                  {categoryLabel(s.category)}
                </p>
                {found && date && (
                  <p className="mt-2 text-[10px] text-stone">
                    {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </p>
                )}
                {!found && <Pill tone="demo">Undiscovered</Pill>}
              </div>
            )

            return found ? (
              <Link key={s.id} to={`/explore/species/${s.id}`}>
                {content}
              </Link>
            ) : (
              <div key={s.id}>{content}</div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
