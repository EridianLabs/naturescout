import { useEffect, useState } from 'react'
import { inaturalistService, type InatObservation } from '@/services/inaturalistService'
import { geographService, GEOGRAPH_ATTRIBUTION } from '@/services/geographService'
import { Card, Pill } from '@/components/ui/Primitives'

export function NearbyObservations() {
  const [items, setItems] = useState<InatObservation[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    inaturalistService
      .getNearbyObservations({ radiusKm: 10, perPage: 8 })
      .then((data) => {
        if (!cancelled) {
          setItems(data)
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) setError('Could not load live observations right now.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-moss">
          Live from iNaturalist
        </p>
        <h2 className="font-display text-xl text-forest md:text-2xl">Recent nearby sightings</h2>
        <p className="mt-1 text-sm text-charcoal-muted">
          Real community observations around Guildford — no login required for reading.
        </p>
      </div>

      {loading && (
        <p className="text-sm text-charcoal-muted animate-pulse">Loading observations…</p>
      )}
      {error && <p className="text-sm text-gold">{error}</p>}

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((obs) => (
          <a
            key={obs.id}
            href={obs.uri}
            target="_blank"
            rel="noreferrer"
            className="block"
          >
            <Card className="overflow-hidden p-0 transition-transform hover:-translate-y-0.5">
              {obs.imageUrl ? (
                <img
                  src={obs.imageUrl}
                  alt={obs.speciesGuess}
                  className="h-36 w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-36 items-center justify-center bg-cream-dark text-3xl">🌿</div>
              )}
              <div className="p-4">
                <h3 className="font-display text-base text-forest">{obs.commonName ?? obs.speciesGuess}</h3>
                {obs.scientificName && (
                  <p className="text-xs italic text-charcoal-muted">{obs.scientificName}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  <Pill tone="demo">iNaturalist</Pill>
                  {obs.observedOn && <Pill>{obs.observedOn}</Pill>}
                </div>
              </div>
            </Card>
          </a>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-forest/5 p-4 shadow-soft">
        <p className="text-sm text-charcoal-muted">
          Looking for local landscape photography? Browse{' '}
          <a
            className="font-semibold text-moss underline-offset-2 hover:underline"
            href={geographService.searchUrl('nature')}
            target="_blank"
            rel="noreferrer"
          >
            Geograph around Guildford
          </a>
          .
        </p>
        <p className="mt-2 text-[11px] text-stone">{GEOGRAPH_ATTRIBUTION}</p>
      </div>
    </section>
  )
}
