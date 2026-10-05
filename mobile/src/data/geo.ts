/** Shared Guildford demo coordinates.
 * DEMO ONLY — approximate positions for schematic map / distance calculations.
 * Replace with verified public datasets before claiming real locations.
 */

export const DEMO_USER_LOCATION = {
  lat: 51.2362,
  lng: -0.5704,
  isDemo: true as const,
  label: 'Demo starting point — Guildford centre',
}

/** Rough relative offsets from centre for schematic layout (not real GPS accuracy) */
export const DEMO_POINTS = {
  riverWey: { lat: 51.234, lng: -0.575, isDemo: true as const, label: 'River Wey (demo)' },
  stokePark: { lat: 51.248, lng: -0.565, isDemo: true as const, label: 'Stoke Park (demo)' },
  pewleyDown: { lat: 51.228, lng: -0.555, isDemo: true as const, label: 'Pewley Down (demo)' },
  chantryWood: { lat: 51.222, lng: -0.548, isDemo: true as const, label: 'Chantry Wood (demo)' },
  whitmoorCommon: { lat: 51.26, lng: -0.58, isDemo: true as const, label: 'Whitmoor Common (demo)' },
  riverside: { lat: 51.238, lng: -0.578, isDemo: true as const, label: 'Riverside path (demo)' },
  castleGrounds: { lat: 51.2345, lng: -0.572, isDemo: true as const, label: 'Castle Grounds (demo)' },
  meridianField: { lat: 51.242, lng: -0.56, isDemo: true as const, label: 'Meridian Field area (demo)' },
  shalfordMeadow: { lat: 51.218, lng: -0.568, isDemo: true as const, label: 'Shalford Meadow (demo)' },
  onslowArboretum: { lat: 51.24, lng: -0.59, isDemo: true as const, label: 'Onslow Arboretum (demo)' },
  downsLink: { lat: 51.215, lng: -0.55, isDemo: true as const, label: 'Downs Link area (demo)' },
  moreden: { lat: 51.25, lng: -0.55, isDemo: true as const, label: 'Morden area walk (demo)' },
  quarryPark: { lat: 51.232, lng: -0.562, isDemo: true as const, label: 'Quarry / hill park (demo)' },
  millmead: { lat: 51.233, lng: -0.576, isDemo: true as const, label: 'Millmead (demo)' },
  spectrum: { lat: 51.245, lng: -0.575, isDemo: true as const, label: 'Spectrum lakes area (demo)' },
}
