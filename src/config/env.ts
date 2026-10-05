/** Central client-side config. Missing keys degrade gracefully. */

export const config = {
  maptilerKey: import.meta.env.VITE_MAPTILER_KEY as string | undefined,
  inaturalistAppId: import.meta.env.VITE_INATURALIST_APP_ID as string | undefined,
  inaturalistAppSecret: import.meta.env.VITE_INATURALIST_APP_SECRET as string | undefined,
  geographApiKey: import.meta.env.VITE_GEOGRAPH_API_KEY as string | undefined,
  guildford: {
    lat: 51.2362,
    lng: -0.5704,
    zoom: 12.4,
  },
} as const

export function hasMapTiler(): boolean {
  return Boolean(config.maptilerKey && config.maptilerKey !== 'your_maptiler_key_here')
}

/** MapTiler outdoor style — good fit for a nature product */
export function mapTilerStyleUrl(): string | null {
  if (!hasMapTiler()) return null
  return `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${config.maptilerKey}`
}
