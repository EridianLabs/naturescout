import type { Badge, CollectionStats, NatureObservation, UserProgress, Walk } from '@/types'
import { STORAGE_KEY, loadJson, saveJson } from '@/utils/storage'
import { XP_REWARDS } from '@/utils/progression'
import { speciesService } from './speciesService'
import { placeService } from './placeService'
import { missionService } from './missionService'

const ALL_BADGES: Omit<Badge, 'unlockedAt'>[] = [
  { id: 'badge-first', name: 'First Discovery', description: 'Logged your first species', icon: '🏅' },
  { id: 'badge-tree-hunter', name: 'Tree Hunter', description: 'Discovered 5 trees', icon: '🏅' },
  { id: 'badge-woodland', name: 'Woodland Explorer', description: 'Visited a woodland', icon: '🏅' },
  { id: 'badge-river', name: 'River Explorer', description: 'Visited a river', icon: '🏅' },
  { id: 'badge-10', name: '10 Discoveries', description: 'Reached 10 discoveries', icon: '🏅' },
  { id: 'badge-50', name: '50 Discoveries', description: 'Reached 50 discoveries', icon: '🏅' },
  { id: 'badge-seasonal', name: 'Seasonal Explorer', description: 'Completed a seasonal mission', icon: '🏅' },
]

function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

export function createDefaultProgress(): UserProgress {
  const daily = speciesService.getDailySpecies()
  return {
    displayName: 'Alex',
    locationLabel: 'Guildford, Surrey',
    regionId: 'guildford',
    xp: 1840,
    discoveries: [],
    completedMissionIds: [],
    missionProgress: {},
    completedPlaceIds: [],
    badges: [],
    kmExplored: 42,
    walks: [],
    dailyDiscovery: {
      speciesId: daily.id,
      date: todayKey(),
      discovered: false,
    },
    createdAt: new Date().toISOString(),
  }
}

/** Seed a richer demo profile so Collection/Profile feel alive on first launch */
export function createDemoProgress(): UserProgress {
  const base = createDefaultProgress()
  const seedIds = [
    'sp-english-oak',
    'sp-robin',
    'sp-horse-chestnut',
    'sp-blue-tit',
    'sp-beech',
    'sp-fox',
    'sp-fly-agaric',
    'sp-blackbird',
    'sp-silver-birch',
    'sp-grey-squirrel',
    'sp-yew',
    'sp-heron',
    'sp-hawthorn',
    'sp-bumblebee',
    'sp-alder',
    'sp-wren',
    'sp-holly',
    'sp-peacock-butterfly',
    'sp-ash',
    'sp-woodpigeon',
    'sp-rowan',
    'sp-red-admiral',
    'sp-bramble',
    'sp-great-tit',
  ]

  const discoveries: NatureObservation[] = seedIds.map((id, i) => ({
    id: `obs-seed-${id}`,
    speciesId: id,
    discoveredAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
    xpAwarded: XP_REWARDS.discoverSpecies,
  }))

  // Also seed a few tree discoveries
  const treeSeeds = ['tree-ancient-oak', 'tree-stoke-chestnut', 'tree-chantry-yew']
  for (const tid of treeSeeds) {
    const tree = placeService.getTreeById(tid)
    if (!tree) continue
    if (discoveries.some((d) => d.speciesId === tree.speciesId)) continue
  }

  base.discoveries = discoveries
  base.completedMissionIds = ['mission-first-discovery', 'mission-30-min']
  base.completedPlaceIds = [
    'place-river-wey',
    'place-stoke-park',
    'place-castle-grounds',
    'place-chantry-wood',
  ]
  base.badges = [
    { ...ALL_BADGES[0], unlockedAt: new Date().toISOString() },
    { ...ALL_BADGES[1], unlockedAt: new Date().toISOString() },
    { ...ALL_BADGES[2], unlockedAt: new Date().toISOString() },
    { ...ALL_BADGES[3], unlockedAt: new Date().toISOString() },
    { ...ALL_BADGES[4], unlockedAt: new Date().toISOString() },
  ]
  base.xp = 1840
  base.kmExplored = 42
  return base
}

function ensureDaily(progress: UserProgress): UserProgress {
  const today = todayKey()
  if (progress.dailyDiscovery?.date === today) return progress
  const daily = speciesService.getDailySpecies()
  return {
    ...progress,
    dailyDiscovery: { speciesId: daily.id, date: today, discovered: false },
  }
}

function evaluateBadges(progress: UserProgress): Badge[] {
  const unlocked = new Map(progress.badges.map((b) => [b.id, b]))
  const now = new Date().toISOString()
  const discoveredSpecies = new Set(progress.discoveries.map((d) => d.speciesId))
  const treeCount = [...discoveredSpecies].filter((id) => {
    const s = speciesService.getById(id)
    return s?.category === 'tree'
  }).length

  const checks: Array<{ id: string; ok: boolean }> = [
    { id: 'badge-first', ok: progress.discoveries.length >= 1 },
    { id: 'badge-tree-hunter', ok: treeCount >= 5 },
    {
      id: 'badge-woodland',
      ok: progress.completedPlaceIds.some((id) => placeService.getById(id)?.type === 'woodland'),
    },
    {
      id: 'badge-river',
      ok: progress.completedPlaceIds.some((id) => placeService.getById(id)?.type === 'river'),
    },
    { id: 'badge-10', ok: progress.discoveries.length >= 10 },
    { id: 'badge-50', ok: progress.discoveries.length >= 50 },
    {
      id: 'badge-seasonal',
      ok: progress.completedMissionIds.some((id) => missionService.getById(id)?.category === 'seasonal'),
    },
  ]

  for (const check of checks) {
    if (check.ok && !unlocked.has(check.id)) {
      const def = ALL_BADGES.find((b) => b.id === check.id)
      if (def) unlocked.set(check.id, { ...def, unlockedAt: now })
    }
  }

  return ALL_BADGES.map((b) => unlocked.get(b.id) ?? { ...b })
}

export const progressService = {
  async load(): Promise<UserProgress> {
    const stored = await loadJson<UserProgress | null>(STORAGE_KEY, null)
    if (!stored) {
      const demo = createDemoProgress()
      await this.save(demo)
      return demo
    }
    const withDaily = ensureDaily(stored)
    if (withDaily !== stored) await this.save(withDaily)
    return withDaily
  },

  async save(progress: UserProgress): Promise<void> {
    await saveJson(STORAGE_KEY, progress)
  },

  reset(): UserProgress {
    const fresh = createDemoProgress()
    void this.save(fresh)
    return fresh
  },

  hasDiscovered(progress: UserProgress, speciesId: string): boolean {
    return progress.discoveries.some((d) => d.speciesId === speciesId)
  },

  discoverSpecies(progress: UserProgress, speciesId: string, extraXp = 0): UserProgress {
    if (this.hasDiscovered(progress, speciesId)) return progress
    const xp = XP_REWARDS.discoverSpecies + extraXp
    const observation: NatureObservation = {
      id: `obs-${speciesId}-${Date.now()}`,
      speciesId,
      discoveredAt: new Date().toISOString(),
      xpAwarded: xp,
    }
    let next: UserProgress = {
      ...progress,
      xp: progress.xp + xp,
      discoveries: [...progress.discoveries, observation],
    }
    if (progress.dailyDiscovery?.speciesId === speciesId) {
      next = {
        ...next,
        dailyDiscovery: { ...progress.dailyDiscovery, discovered: true },
        xp: next.xp + XP_REWARDS.dailyDiscovery,
      }
    }
    next.badges = evaluateBadges(next)
    this.save(next)
    return next
  },

  discoverTree(progress: UserProgress, treeId: string): UserProgress {
    const tree = placeService.getTreeById(treeId)
    if (!tree) return progress
    const bonus = tree.isNotable || tree.isAncient ? XP_REWARDS.discoverNotableTree - XP_REWARDS.discoverSpecies : 0
    let next = this.discoverSpecies(progress, tree.speciesId, bonus)
    if (tree.placeId && !next.completedPlaceIds.includes(tree.placeId)) {
      next = {
        ...next,
        completedPlaceIds: [...next.completedPlaceIds, tree.placeId],
        xp: next.xp + XP_REWARDS.discoverPlace,
      }
      next.badges = evaluateBadges(next)
      this.save(next)
    }
    return next
  },

  discoverPlace(progress: UserProgress, placeId: string): UserProgress {
    if (progress.completedPlaceIds.includes(placeId)) return progress
    const next: UserProgress = {
      ...progress,
      completedPlaceIds: [...progress.completedPlaceIds, placeId],
      xp: progress.xp + XP_REWARDS.discoverPlace,
      kmExplored: progress.kmExplored + 0.5,
    }
    next.badges = evaluateBadges(next)
    this.save(next)
    return next
  },

  toggleMissionObjective(
    progress: UserProgress,
    missionId: string,
    objectiveId: string,
  ): UserProgress {
    const mission = missionService.getById(missionId)
    if (!mission) return progress
    const current = progress.missionProgress[missionId] ?? {}
    const obj = mission.objectives.find((o) => o.id === objectiveId)
    if (!obj) return progress
    const prev = current[objectiveId] ?? 0
    const nextVal = prev >= obj.targetCount ? 0 : obj.targetCount
    const missionProgress = {
      ...progress.missionProgress,
      [missionId]: { ...current, [objectiveId]: nextVal },
    }
    let next: UserProgress = { ...progress, missionProgress }

    const allDone = mission.objectives.every(
      (o) => (missionProgress[missionId][o.id] ?? 0) >= o.targetCount,
    )
    if (allDone && !next.completedMissionIds.includes(missionId)) {
      next = {
        ...next,
        completedMissionIds: [...next.completedMissionIds, missionId],
        xp: next.xp + mission.xpReward,
      }
    }
    next.badges = evaluateBadges(next)
    this.save(next)
    return next
  },

  completeMission(progress: UserProgress, missionId: string): UserProgress {
    const mission = missionService.getById(missionId)
    if (!mission || progress.completedMissionIds.includes(missionId)) return progress
    const filled: Record<string, number> = {}
    for (const o of mission.objectives) filled[o.id] = o.targetCount
    const next: UserProgress = {
      ...progress,
      missionProgress: { ...progress.missionProgress, [missionId]: filled },
      completedMissionIds: [...progress.completedMissionIds, missionId],
      xp: progress.xp + mission.xpReward,
    }
    next.badges = evaluateBadges(next)
    this.save(next)
    return next
  },

  startWalk(progress: UserProgress, templateId: string): UserProgress {
    const walk: Walk = {
      id: `walk-${Date.now()}`,
      title: templateId,
      templateId,
      startedAt: new Date().toISOString(),
      completedStopIds: [],
    }
    const next = { ...progress, activeWalkId: walk.id, walks: [...progress.walks, walk] }
    this.save(next)
    return next
  },

  toggleWalkStop(progress: UserProgress, walkId: string, stopId: string): UserProgress {
    const walks = progress.walks.map((w) => {
      if (w.id !== walkId) return w
      const has = w.completedStopIds.includes(stopId)
      return {
        ...w,
        completedStopIds: has
          ? w.completedStopIds.filter((id) => id !== stopId)
          : [...w.completedStopIds, stopId],
      }
    })
    const next = { ...progress, walks }
    this.save(next)
    return next
  },

  completeWalk(progress: UserProgress, walkId: string, xpReward: number, distanceKm: number): UserProgress {
    const walks = progress.walks.map((w) =>
      w.id === walkId
        ? { ...w, completedAt: new Date().toISOString(), xpAwarded: xpReward }
        : w,
    )
    const next: UserProgress = {
      ...progress,
      walks,
      activeWalkId: undefined,
      xp: progress.xp + xpReward,
      kmExplored: progress.kmExplored + distanceKm,
    }
    this.save(next)
    return next
  },

  getCollectionStats(progress: UserProgress): CollectionStats {
    const totals = speciesService.getCollectionTotals()
    const discoveredIds = new Set(progress.discoveries.map((d) => d.speciesId))
    const byCategory: CollectionStats['byCategory'] = {
      Trees: { discovered: 0, total: totals.trees },
      Plants: { discovered: 0, total: totals.plants },
      Birds: { discovered: 0, total: totals.birds },
      Fungi: { discovered: 0, total: totals.fungi },
      Wildlife: { discovered: 0, total: totals.wildlife },
      Places: { discovered: progress.completedPlaceIds.length, total: totals.places },
    }

    for (const id of discoveredIds) {
      const s = speciesService.getById(id)
      if (!s) continue
      if (s.category === 'tree') byCategory.Trees.discovered++
      else if (s.category === 'plant') byCategory.Plants.discovered++
      else if (s.category === 'bird') byCategory.Birds.discovered++
      else if (s.category === 'fungi') byCategory.Fungi.discovered++
      else byCategory.Wildlife.discovered++
    }

    const discovered =
      byCategory.Trees.discovered +
      byCategory.Plants.discovered +
      byCategory.Birds.discovered +
      byCategory.Fungi.discovered +
      byCategory.Wildlife.discovered +
      byCategory.Places.discovered

    const total = Object.values(totals).reduce((a, b) => a + b, 0)
    return {
      discovered,
      total,
      percent: Math.round((discovered / total) * 100),
      byCategory,
    }
  },

  getAllBadges(): Omit<Badge, 'unlockedAt'>[] {
    return ALL_BADGES
  },
}
