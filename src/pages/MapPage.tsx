import { NatureMap } from '@/components/map/NatureMap'
import { NearbyObservations } from '@/components/map/NearbyObservations'
import { hasMapTiler } from '@/config/env'

export function MapPage() {
  const live = hasMapTiler()

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-moss">Nature map</p>
        <h1 className="mt-1 font-display text-3xl text-forest">Guildford</h1>
        <p className="mt-2 text-sm text-charcoal-muted">
          {live
            ? 'Live outdoor basemap with parks, woods, waterways and discovery points overlaid.'
            : 'Parks, woods, waterways, notable trees and discovery points — schematic until MapTiler is configured.'}
        </p>
      </header>
      <NatureMap />
      <NearbyObservations />
    </div>
  )
}
