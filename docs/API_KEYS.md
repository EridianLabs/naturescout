# API keys & live data

## MapTiler (live basemap)

1. Create a key at [MapTiler Cloud](https://cloud.maptiler.com/)
2. Copy `.env.example` → `.env`
3. Set:

```bash
VITE_MAPTILER_KEY=your_key_here
```

4. In MapTiler dashboard → API key → **Allowed HTTP origins**:
   - `https://naturescout.co.uk`
   - `https://www.naturescout.co.uk`
   - `http://localhost:5173`

5. Restart Vite (`npm run dev`)

The Map screen uses MapLibre + MapTiler **Outdoor** style. Without a key it falls back to the schematic SVG map.

## iNaturalist (live nearby observations)

**Reading** nearby observations needs **no OAuth** — we call the public API:

`GET https://api.inaturalist.org/v1/observations?lat=…&lng=…`

The [authorization code flow](https://www.inaturalist.org/pages/api+reference#authorization_code_flow) is only needed later for:

- posting observations as a user
- reading private account data

Optional env (for a future “share to iNaturalist” feature):

```bash
VITE_INATURALIST_APP_ID=
VITE_INATURALIST_APP_SECRET=
```

Create an app at: https://www.inaturalist.org/oauth/applications

## Geograph Britain & Ireland

Reuse is allowed **with attribution**. We show:

> Photographs © contributors to Geograph Britain and Ireland, reused with attribution.

Deep-links to Geograph search work without a key. Optional API key later:

```bash
VITE_GEOGRAPH_API_KEY=
```

## Security note

Frontend keys are visible in the browser. Restrict MapTiler origins. Prefer rotating any key that was pasted into chat or committed by mistake.
