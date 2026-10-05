# NatureScout 🌿

Discover interesting nature around you — and find reasons to go outside.

**NatureScout** is a nature discovery **pilot** focused on **Guildford, Surrey, UK**, designed to expand to Surrey, the UK and beyond.

> What’s interesting in nature around me today?

## Status

| Surface | Status |
|---------|--------|
| Web app | Pilot-ready (MapTiler + iNaturalist + PWA) |
| iOS (Expo) | Pilot-ready for TestFlight via EAS |
| Verified local inventory | Partial — some demo seed data remains |

Full launch steps: **[docs/LAUNCH.md](docs/LAUNCH.md)**  
Go live on Namecheap: **[docs/GO_LIVE_NAMECHEAP.md](docs/GO_LIVE_NAMECHEAP.md)**

Domain: **https://naturescout.co.uk**

## Quick start

### Web

```bash
npm install
cp .env.example .env   # add VITE_MAPTILER_KEY
npm run dev
```

### iOS

```bash
cd mobile
npm install
npx expo start --ios
```

## Deploy web

- **Vercel:** `vercel --prod` (set `VITE_MAPTILER_KEY`)
- **Netlify:** connect repo or publish `dist/` after `npm run build`

Config files: `vercel.json`, `netlify.toml`

## Stack

- Web: React + TypeScript + Vite + Tailwind + MapLibre/MapTiler
- iOS: Expo + React Native
- Local seed data + device persistence (no backend required for pilot)

## Docs

- [Launch checklist](docs/LAUNCH.md)
- [API keys](docs/API_KEYS.md)
- [Future data sources](docs/FUTURE_DATA.md)
