import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Circle } from 'lucide-react'
import { missionService } from '@/services/missionService'
import { adventureService } from '@/services/adventureService'
import { useProgress } from '@/hooks/useProgress'
import { Button, Card, DemoBanner, Pill, ProgressBar } from '@/components/ui/Primitives'
import { useMemo, useState } from 'react'
import type { AdventureThemeOption, AdventureTimeOption } from '@/services/adventureService'

export function MissionDetailPage() {
  const { id } = useParams()
  const { progress, toggleMissionObjective, completeMission } = useProgress()
  const mission = id ? missionService.getById(id) : undefined

  if (!mission) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-2xl text-forest">Mission not found</p>
        <Link to="/" className="mt-4 inline-block text-sm text-moss">
          Back home
        </Link>
      </div>
    )
  }

  const completed = progress.completedMissionIds.includes(mission.id)
  const objProgress = progress.missionProgress[mission.id] ?? {}

  return (
    <div className="space-y-6 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-charcoal-muted">
        <ArrowLeft size={16} /> Discover
      </Link>
      <header>
        <span className="text-4xl">{mission.icon}</span>
        <h1 className="mt-2 font-display text-3xl text-forest">{mission.title}</h1>
        <p className="mt-2 text-sm text-charcoal-muted">{mission.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Pill>{mission.difficulty}</Pill>
          <Pill tone="gold">+{mission.xpReward} XP</Pill>
          {mission.estimatedMinutes && <Pill>{mission.estimatedMinutes} min</Pill>}
        </div>
      </header>
      <Card className="p-5">
        <ul className="space-y-3">
          {mission.objectives.map((obj) => {
            const done = (objProgress[obj.id] ?? 0) >= obj.targetCount
            return (
              <li key={obj.id}>
                <button
                  type="button"
                  onClick={() => toggleMissionObjective(mission.id, obj.id)}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-cream"
                >
                  {done ? <Check className="text-moss" size={18} /> : <Circle className="text-stone-light" size={18} />}
                  <span className={done ? 'line-through text-charcoal-muted' : ''}>{obj.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </Card>
      {!completed && (
        <Button className="w-full" onClick={() => completeMission(mission.id)}>
          Mark mission complete
        </Button>
      )}
      {completed && <p className="text-center font-semibold text-moss">Mission complete</p>}
    </div>
  )
}

export function AdventureGeneratePage() {
  const navigate = useNavigate()
  const [time, setTime] = useState<AdventureTimeOption>(60)
  const [theme, setTheme] = useState<AdventureThemeOption>('anything')

  const times: AdventureTimeOption[] = [30, 60, 90, 120]
  const themes: { id: AdventureThemeOption; label: string }[] = [
    { id: 'ancient trees', label: 'Ancient trees' },
    { id: 'water', label: 'Water' },
    { id: 'birds', label: 'Birds' },
    { id: 'wildflowers', label: 'Wildflowers' },
    { id: 'woodland', label: 'Woodland' },
    { id: 'wildlife', label: 'Wildlife' },
    { id: 'fungi', label: 'Fungi' },
    { id: 'anything', label: 'Anything' },
  ]

  const preview = useMemo(() => adventureService.generate(time, theme), [time, theme])

  return (
    <div className="space-y-8 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-charcoal-muted">
        <ArrowLeft size={16} /> Discover
      </Link>
      <header>
        <h1 className="font-display text-3xl text-forest">Build an adventure</h1>
        <p className="mt-2 text-sm text-charcoal-muted">
          A simple local generator using seeded Guildford data — not live routing.
        </p>
      </header>
      <DemoBanner>Generated adventures are schematic templates selected from demo data.</DemoBanner>

      <section>
        <h2 className="mb-3 font-display text-lg text-forest">Time</h2>
        <div className="flex flex-wrap gap-2">
          {times.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTime(t)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                time === t ? 'bg-forest text-cream' : 'bg-white border border-forest/10 text-charcoal-muted'
              }`}
            >
              {t === 120 ? '2 hours' : `${t} min`}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg text-forest">What do you want to discover?</h2>
        <div className="flex flex-wrap gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                theme === t.id ? 'bg-forest text-cream' : 'bg-white border border-forest/10 text-charcoal-muted'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <Card className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-moss">Your adventure</p>
        <h3 className="mt-2 font-display text-2xl text-forest">{preview.title}</h3>
        <p className="mt-1 text-sm text-charcoal-muted">
          Estimated time · {preview.estimatedMinutes} minutes · {preview.distanceKm} km
        </p>
        <p className="mt-4 text-xs font-medium text-moss">You&apos;ll discover:</p>
        <ul className="mt-2 space-y-1 text-sm text-charcoal-muted">
          {preview.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <Button className="mt-5 w-full" onClick={() => navigate(`/adventure/${preview.id}`)}>
          Start Adventure
        </Button>
      </Card>
    </div>
  )
}

export function AdventurePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { progress, startWalk, toggleWalkStop, completeWalk, discoverSpecies, discoverTree, discoverPlace } =
    useProgress()
  const adventure = id ? adventureService.getById(id) : undefined
  const [done, setDone] = useState(false)

  if (!adventure) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-2xl text-forest">Adventure not found</p>
        <Link to="/" className="mt-4 inline-block text-sm text-moss">
          Back home
        </Link>
      </div>
    )
  }

  const walk =
    progress.walks.find((w) => w.templateId === adventure.id && !w.completedAt) ??
    progress.walks.find((w) => w.id === progress.activeWalkId && w.templateId === adventure.id)

  const completedStops = walk?.completedStopIds ?? []
  const progressPct = adventure.stops.length
    ? completedStops.length / adventure.stops.length
    : 0

  const ensureWalk = () => {
    if (walk) return walk.id
    return startWalk(adventure.id)
  }

  const handleToggle = (stopId: string, refId: string, type: string) => {
    const walkId = ensureWalk()
    if (!walkId) return
    toggleWalkStop(walkId, stopId)
    if (type === 'species') discoverSpecies(refId)
    if (type === 'tree') discoverTree(refId)
    if (type === 'place' || type === 'habitat') discoverPlace(refId)
  }

  const handleComplete = () => {
    const walkId = ensureWalk()
    if (!walkId) return
    // mark all stops
    for (const stop of adventure.stops) {
      if (!completedStops.includes(stop.id)) {
        toggleWalkStop(walkId, stop.id)
        if (stop.type === 'species') discoverSpecies(stop.refId)
        if (stop.type === 'tree') discoverTree(stop.refId)
        if (stop.type === 'place' || stop.type === 'habitat') discoverPlace(stop.refId)
      }
    }
    completeWalk(walkId, adventure.xpReward, adventure.distanceKm)
    setDone(true)
  }

  if (done) {
    return (
      <div className="space-y-6 py-10 text-center animate-scale-in">
        <p className="text-5xl">🎉</p>
        <h1 className="font-display text-3xl text-forest">Adventure complete</h1>
        <p className="text-lg text-gold font-semibold">+{adventure.xpReward} XP</p>
        <p className="text-sm text-charcoal-muted">
          {adventure.stops.length} discoveries added · schematic route finished
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => navigate('/collection')}>View Collection</Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Back to Discover
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-charcoal-muted">
        <ArrowLeft size={16} /> Discover
      </Link>
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-moss">
          Adventure mode
        </p>
        <h1 className="mt-1 font-display text-3xl uppercase tracking-wide text-forest">
          {adventure.title}
        </h1>
        <p className="mt-2 text-sm text-charcoal-muted">
          {adventure.distanceKm} km · ~{adventure.estimatedMinutes} min
        </p>
      </header>
      <DemoBanner>
        This is a schematic adventure checklist — not turn-by-turn navigation.
      </DemoBanner>

      <Card className="p-5">
        <ol className="space-y-4">
          {adventure.stops.map((stop, i) => {
            const checked = completedStops.includes(stop.id)
            return (
              <li key={stop.id}>
                <button
                  type="button"
                  onClick={() => handleToggle(stop.id, stop.refId, stop.type)}
                  className="flex w-full items-start gap-3 rounded-xl px-2 py-2 text-left hover:bg-cream"
                >
                  <span className="mt-0.5 text-charcoal-muted">{i + 1}.</span>
                  {checked ? (
                    <Check className="mt-0.5 text-moss" size={18} />
                  ) : (
                    <Circle className="mt-0.5 text-stone-light" size={18} />
                  )}
                  <span>
                    <span className={`block font-medium ${checked ? 'text-charcoal-muted line-through' : 'text-forest'}`}>
                      {stop.label}
                    </span>
                    <span className="text-xs text-charcoal-muted">{stop.description}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-charcoal-muted">Progress</span>
            <span className="font-semibold text-forest">{Math.round(progressPct * 100)}%</span>
          </div>
          <ProgressBar value={progressPct} />
        </div>
      </Card>

      {!walk && (
        <Button className="w-full" onClick={() => startWalk(adventure.id)}>
          Begin tracking
        </Button>
      )}

      <Button
        className="w-full"
        disabled={progressPct < 1 && completedStops.length === 0}
        onClick={handleComplete}
      >
        {progressPct >= 1 ? 'Complete adventure' : 'Complete adventure early'}
      </Button>
    </div>
  )
}
