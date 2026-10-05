import { Link } from 'react-router-dom'
import { useProgress } from '@/hooks/useProgress'
import { getSeasonalContext, greetingForHour } from '@/utils/seasonal'
import { adventureService } from '@/services/adventureService'
import { missionService } from '@/services/missionService'
import { placeService } from '@/services/placeService'
import { speciesService } from '@/services/speciesService'
import { SectionHeader } from '@/components/ui/Primitives'
import {
  SeasonalCard,
  AdventureCard,
  MissionCard,
  DailyDiscoveryCard,
  NearbySection,
} from '@/components/discover/Cards'

export function DiscoverPage() {
  const {
    progress,
    discoverSpecies,
    toggleMissionObjective,
    completeMission,
    hasDiscovered,
  } = useProgress()

  const seasonal = getSeasonalContext(progress.regionId)
  const featured = adventureService.getFeatured(progress.regionId)
  const missions = missionService.getSuggested(seasonal.season, 3)
  const daily = speciesService.getDailySpecies(new Date(), progress.regionId)
  const nearby = placeService.getNearby()
  const counts = placeService.countNearbyByCategory()
  const greeting = greetingForHour()

  const dailyDone =
    progress.dailyDiscovery?.speciesId === daily.id && progress.dailyDiscovery.discovered

  return (
    <div className="space-y-10 animate-fade-in">
      <header className="safe-top">
        <p className="text-sm text-charcoal-muted">
          {greeting}, {progress.displayName}
        </p>
        <p className="mt-0.5 text-xs font-medium text-moss">{progress.locationLabel}</p>
        <h1 className="mt-5 font-display text-[2rem] leading-[1.15] text-forest text-balance md:text-4xl">
          What&apos;s happening in nature near you?
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-charcoal-muted md:text-base">
          Discover what&apos;s worth seeing, spotting and exploring this week.
        </p>
      </header>

      <section>
        <SectionHeader eyebrow="This week" title={seasonal.title} />
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-hide">
          {seasonal.highlights.map((h, i) => (
            <div key={h.id} className={`animate-fade-up stagger-${i + 1}`}>
              <SeasonalCard highlight={h} />
            </div>
          ))}
        </div>
      </section>

      <section className="animate-fade-up stagger-2">
        <AdventureCard adventure={featured} />
      </section>

      <section>
        <DailyDiscoveryCard
          species={daily}
          discovered={dailyDone || hasDiscovered(daily.id)}
          onDiscover={() => discoverSpecies(daily.id)}
        />
      </section>

      <section>
        <SectionHeader
          eyebrow="Nature missions"
          title="Something to look for"
          action={
            <Link to="/explore" className="text-xs font-semibold text-moss">
              See all
            </Link>
          }
        />
        <div className="space-y-4">
          {missions.map((m) => (
            <MissionCard
              key={m.id}
              mission={m}
              progress={progress.missionProgress[m.id] ?? {}}
              completed={progress.completedMissionIds.includes(m.id)}
              onToggle={(objId) => toggleMissionObjective(m.id, objId)}
              onComplete={() => completeMission(m.id)}
            />
          ))}
        </div>
      </section>

      <section>
        <NearbySection total={counts.total} counts={counts} nearest={nearby} />
      </section>

      <section className="rounded-3xl bg-forest px-5 py-6 text-cream">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-moss-light">
          Plan a walk
        </p>
        <h2 className="mt-2 font-display text-2xl">Generate an adventure</h2>
        <p className="mt-2 text-sm text-cream/75">
          Choose how long you have and what you want to discover.
        </p>
        <Link
          to="/adventure/generate"
          className="mt-4 inline-flex rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-forest"
        >
          Build my adventure
        </Link>
      </section>
    </div>
  )
}
