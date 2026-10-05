import { config } from '@/config/env'

export interface InatObservation {
  id: number
  speciesGuess: string
  scientificName?: string
  commonName?: string
  imageUrl?: string
  observedOn?: string
  placeGuess?: string
  lat?: number
  lng?: number
  uri: string
}

interface InatApiResult {
  results: Array<{
    id: number
    species_guess?: string
    observed_on?: string
    place_guess?: string
    uri: string
    location?: string
    taxon?: {
      name?: string
      preferred_common_name?: string
      default_photo?: { medium_url?: string; square_url?: string }
    }
    photos?: Array<{ url?: string }>
  }>
}

/**
 * Read-only iNaturalist access — no OAuth required.
 * OAuth (authorization code flow) is only needed later for posting
 * observations or reading private user data.
 */
export const inaturalistService = {
  async getNearbyObservations(opts?: {
    lat?: number
    lng?: number
    radiusKm?: number
    perPage?: number
  }): Promise<InatObservation[]> {
    const lat = opts?.lat ?? config.guildford.lat
    const lng = opts?.lng ?? config.guildford.lng
    const radius = opts?.radiusKm ?? 8
    const perPage = opts?.perPage ?? 12

    const url = new URL('https://api.inaturalist.org/v1/observations')
    url.searchParams.set('lat', String(lat))
    url.searchParams.set('lng', String(lng))
    url.searchParams.set('radius', String(radius))
    url.searchParams.set('per_page', String(perPage))
    url.searchParams.set('order_by', 'observed_on')
    url.searchParams.set('order', 'desc')
    url.searchParams.set('photos', 'true')
    url.searchParams.set('quality_grade', 'research,needs_id')

    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(`iNaturalist error ${res.status}`)
    const data = (await res.json()) as InatApiResult

    return data.results.map((r) => {
      const [olat, olng] = (r.location ?? '').split(',').map(Number)
      const photo =
        r.taxon?.default_photo?.medium_url ??
        r.photos?.[0]?.url?.replace('square', 'medium')

      return {
        id: r.id,
        speciesGuess: r.species_guess ?? r.taxon?.preferred_common_name ?? r.taxon?.name ?? 'Unknown',
        scientificName: r.taxon?.name,
        commonName: r.taxon?.preferred_common_name,
        imageUrl: photo,
        observedOn: r.observed_on,
        placeGuess: r.place_guess,
        lat: Number.isFinite(olat) ? olat : undefined,
        lng: Number.isFinite(olng) ? olng : undefined,
        uri: r.uri,
      }
    })
  },
}
