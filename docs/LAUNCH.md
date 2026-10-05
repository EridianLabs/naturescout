# Launch guide — NatureScout pilot

Domain: **https://naturescout.co.uk**

**Namecheap DNS steps:** see [GO_LIVE_NAMECHEAP.md](./GO_LIVE_NAMECHEAP.md)

## Honest status

**Ready for:** soft / pilot launch (web + TestFlight)  
**Not ready for:** claiming full geographic accuracy, unpaid App Store review without legal URLs live

---

## Web launch

### 1. MapTiler origins

Allow:

- `http://localhost:5173`
- `https://naturescout.co.uk`
- `https://www.naturescout.co.uk`

### 2. Deploy + connect Namecheap

Follow [GO_LIVE_NAMECHEAP.md](./GO_LIVE_NAMECHEAP.md) (Vercel recommended).

### 3. After deploy

- [ ] https://naturescout.co.uk loads
- [ ] `/map`, `/privacy`, `/terms` work
- [ ] MapTiler tiles load on production

---

## iOS launch (TestFlight)

### Prerequisites

- Apple Developer Program membership
- Expo account
- Live privacy + terms on naturescout.co.uk

### Steps

```bash
cd mobile
npm install
npx eas-cli login
npx eas init
npx eas build --platform ios --profile production
npx eas submit --platform ios --profile production
```

App Store Connect:

1. Create app **NatureScout** (`uk.co.naturescout.app`)
2. Privacy Policy URL → `https://naturescout.co.uk/privacy`
3. Screenshots from Simulator
4. Review notes: “Guildford nature discovery pilot; some seed locations labelled demo”
5. Add TestFlight testers

---

## Pre-flight checklist

- [ ] naturescout.co.uk live on HTTPS
- [ ] `VITE_MAPTILER_KEY` set in host env
- [ ] MapTiler HTTP origins locked
- [ ] `/privacy` and `/terms` reachable
- [ ] PWA install works on mobile Safari
- [ ] Customer-facing copy says **pilot**

## Still blocking a “full” public launch

1. Verified Guildford places/trees (or clear illustrative labelling)
2. Local photography
3. Apple Developer + App Store assets
