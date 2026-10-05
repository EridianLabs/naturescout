import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '@/hooks/useProgress'
import { progressService } from '@/services/progressService'
import { formatXp } from '@/utils/progression'
import { Card, Button, Pill } from '@/components/ui/Primitives'

export function ProfilePage() {
  const { progress, levelInfo, resetProgress, updateProfile } = useProgress()
  const stats = useMemo(() => progressService.getCollectionStats(progress), [progress])
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(progress.displayName)

  const badges = progress.badges.length
    ? progress.badges
    : progressService.getAllBadges().map((b) => ({ ...b, unlockedAt: undefined as string | undefined }))

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="font-display text-3xl text-forest">Your Explorer Profile</h1>
        <p className="mt-2 text-sm text-charcoal-muted">{progress.locationLabel}</p>
      </header>

      <Card className="overflow-hidden p-0">
        <div className="bg-gradient-to-br from-forest to-forest-light px-5 py-7 text-cream">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-moss-light">
            Nature Explorer
          </p>
          {editing ? (
            <div className="mt-3 flex gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 rounded-xl border-0 bg-white/15 px-3 py-2 text-cream outline-none placeholder:text-cream/50"
              />
              <Button
                variant="secondary"
                onClick={() => {
                  updateProfile({ displayName: name.trim() || 'Explorer' })
                  setEditing(false)
                }}
              >
                Save
              </Button>
            </div>
          ) : (
            <button type="button" onClick={() => setEditing(true)} className="mt-1 text-left">
              <h2 className="font-display text-3xl">{progress.displayName}</h2>
              <p className="text-xs text-cream/60">Tap to edit name</p>
            </button>
          )}
          <div className="mt-5 flex items-end justify-between">
            <div>
              <p className="text-sm text-cream/70">Level {levelInfo.level}</p>
              <p className="font-display text-2xl">{formatXp(progress.xp)} XP</p>
            </div>
            <p className="text-xs text-cream/60">
              {levelInfo.xpIntoLevel} / {levelInfo.xpNeeded} to next
            </p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-moss-light transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, levelInfo.progress * 100))}%` }}
            />
          </div>
        </div>
      </Card>

      <section className="grid grid-cols-2 gap-3">
        {[
          { label: 'Discoveries', value: stats.discovered },
          { label: 'Missions completed', value: progress.completedMissionIds.length },
          { label: 'Places explored', value: progress.completedPlaceIds.length },
          { label: 'Km explored', value: Math.round(progress.kmExplored) },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-xs text-charcoal-muted">{s.label}</p>
            <p className="mt-1 font-display text-2xl text-forest">{s.value}</p>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl text-forest">Badges</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {badges.map((b) => {
            const unlocked = Boolean(b.unlockedAt)
            return (
              <Card
                key={b.id}
                className={`p-4 text-center ${unlocked ? '' : 'opacity-45 grayscale'}`}
              >
                <div className="text-3xl">{b.icon}</div>
                <p className="mt-2 text-sm font-semibold text-forest">{b.name}</p>
                <p className="mt-1 text-[11px] leading-snug text-charcoal-muted">{b.description}</p>
                {unlocked ? (
                  <div className="mt-2">
                    <Pill tone="forest">Unlocked</Pill>
                  </div>
                ) : (
                  <p className="mt-2 text-[10px] uppercase tracking-wider text-stone">Locked</p>
                )}
              </Card>
            )
          })}
        </div>
      </section>

      <section className="space-y-3">
        <Pill tone="demo">Pilot profile · progress saved on this device</Pill>
        <div className="flex gap-4 text-sm">
          <Link to="/privacy" className="font-medium text-moss">
            Privacy
          </Link>
          <Link to="/terms" className="font-medium text-moss">
            Terms
          </Link>
        </div>
        <Button variant="secondary" className="w-full" onClick={resetProgress}>
          Reset pilot progress
        </Button>
      </section>
    </div>
  )
}
