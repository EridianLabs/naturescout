# NatureScout iOS (Expo)

Native iOS companion to the NatureScout web pilot — same Guildford discovery experience and visual system.

## Develop

```bash
npm install
npx expo start --ios
```

## Pilot / TestFlight release

1. Deploy the **web** app so `/privacy` and `/terms` are public.
2. Update `LEGAL_BASE` in `src/screens/ProfileScreen.tsx` to that domain.
3. Apple Developer account + Expo login.
4. Configure EAS:

```bash
npx eas-cli login
npx eas init
npx eas build --platform ios --profile production
npx eas submit --platform ios --profile production
```

See [../docs/LAUNCH.md](../docs/LAUNCH.md) for the full checklist.

## Bundle id

`uk.co.naturescout.app`

## Notes

- Progress persists on-device via AsyncStorage
- MapTiler live map is currently on **web**; iOS still uses the schematic map until a native MapLibre build is added
- Seed locations remain demo-labelled until verified datasets are connected
