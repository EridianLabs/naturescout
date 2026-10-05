/**
 * Geograph Britain & Ireland — photos may be reused with attribution.
 * Deep-links work without a key. Optional API key can be added later.
 * @see https://www.geograph.org.uk/help/api
 */

import { config } from '@/config/env'

export const GEOGRAPH_ATTRIBUTION =
  'Photographs © contributors to Geograph Britain and Ireland, reused with attribution.'

export const geographService = {
  /** Search page for a place/topic around Guildford */
  searchUrl(query: string): string {
    const q = encodeURIComponent(`${query} Guildford`)
    return `https://www.geograph.org.uk/search.php?q=${q}`
  },

  hasApiKey(): boolean {
    return Boolean(config.geographApiKey)
  },

  attributionLine(photographer?: string, photoTitle?: string): string {
    if (photographer && photoTitle) {
      return `“${photoTitle}” © ${photographer} / Geograph Britain & Ireland`
    }
    return GEOGRAPH_ATTRIBUTION
  },
}
