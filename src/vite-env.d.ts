/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPTILER_KEY?: string
  readonly VITE_INATURALIST_APP_ID?: string
  readonly VITE_INATURALIST_APP_SECRET?: string
  readonly VITE_GEOGRAPH_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
