import { Link } from 'react-router-dom'

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <Link to="/" className="text-sm text-moss">
        ← Back to NatureScout
      </Link>
      <header>
        <h1 className="font-display text-3xl text-forest">{title}</h1>
        <p className="mt-2 text-xs text-charcoal-muted">Last updated: {updated}</p>
      </header>
      <div className="space-y-4 text-sm leading-relaxed text-charcoal-muted">{children}</div>
    </div>
  )
}

export function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="5 October 2026">
      <p>
        NatureScout is a nature discovery app currently in pilot for Guildford, Surrey. We designed the MVP to
        keep personal data on your device wherever possible.
      </p>
      <h2 className="font-display text-lg text-forest">What we store on your device</h2>
      <p>
        Explorer progress (discoveries, missions, XP, display name) is saved in your browser or phone storage
        (localStorage / AsyncStorage). It is not uploaded to a NatureScout server in this pilot version.
      </p>
      <h2 className="font-display text-lg text-forest">Third-party services</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>MapTiler / OpenStreetMap</strong> — map tiles may be requested when you open the Map screen.
        </li>
        <li>
          <strong>iNaturalist</strong> — public observation data may be fetched for “nearby sightings”.
        </li>
        <li>
          <strong>Geograph</strong> — we may link to Geograph with attribution; we do not upload your photos.
        </li>
      </ul>
      <p>
        Those providers process technical request data (such as IP address) under their own policies.
      </p>
      <h2 className="font-display text-lg text-forest">Location</h2>
      <p>
        This pilot uses a demo Guildford starting point for distance estimates. We do not require continuous
        GPS tracking in the current build.
      </p>
      <h2 className="font-display text-lg text-forest">Contact</h2>
      <p>
        For privacy questions about this pilot, contact{' '}
        <a className="text-moss" href="mailto:hello@naturescout.co.uk">
          hello@naturescout.co.uk
        </a>
        .
      </p>
    </LegalPage>
  )
}

export function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="5 October 2026">
      <p>
        NatureScout is provided as a pilot product for exploring nature ideas around Guildford. By using the app
        you agree to these terms.
      </p>
      <h2 className="font-display text-lg text-forest">Pilot / demo content</h2>
      <p>
        Some locations, tree records, and adventure routes are schematic or illustrative until verified against
        public datasets. Do not treat demo coordinates as navigational guidance.
      </p>
      <h2 className="font-display text-lg text-forest">Outdoor safety</h2>
      <p>
        You are responsible for your own safety outdoors, including weather, terrain, access rights, and wildlife.
        NatureScout is not a substitute for maps, wayfinding, or professional advice.
      </p>
      <h2 className="font-display text-lg text-forest">Fungi & foraging</h2>
      <p>
        Never eat wild fungi or plants based on in-app information. Content is for discovery and education only.
      </p>
      <h2 className="font-display text-lg text-forest">Intellectual property</h2>
      <p>
        NatureScout branding and original content belong to the project operators. Map data © MapTiler /
        OpenStreetMap contributors. iNaturalist and Geograph content remain owned by their respective
        contributors and must be attributed as required.
      </p>
      <h2 className="font-display text-lg text-forest">No warranty</h2>
      <p>
        The pilot is provided “as is” without warranties of accuracy or uninterrupted availability.
      </p>
    </LegalPage>
  )
}
