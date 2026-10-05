/** XP and level progression utilities */

export const LEVEL_THRESHOLDS = [
  0, // Level 1
  250, // 2
  600, // 3
  1000, // 4
  1500, // 5
  2200, // 6
  3000, // 7
  4000, // 8
  5200, // 9
  6600, // 10
  8200, // 11
  10000, // 12
] as const

export const XP_REWARDS = {
  discoverSpecies: 25,
  discoverNotableTree: 50,
  discoverPlace: 30,
  completeMission: 100, // base; missions also have their own xpReward
  completeAdventure: 150, // base; adventures also have xpReward
  dailyDiscovery: 40,
} as const

export function getLevelForXp(xp: number): number {
  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1
    else break
  }
  return level
}

export function getXpForNextLevel(xp: number): {
  level: number
  currentLevelXp: number
  nextLevelXp: number
  progress: number
  xpIntoLevel: number
  xpNeeded: number
} {
  const level = getLevelForXp(xp)
  const currentLevelXp = LEVEL_THRESHOLDS[level - 1] ?? 0
  const nextLevelXp = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 2000
  const xpIntoLevel = xp - currentLevelXp
  const xpNeeded = nextLevelXp - currentLevelXp
  const progress = Math.min(1, Math.max(0, xpIntoLevel / xpNeeded))
  return { level, currentLevelXp, nextLevelXp, progress, xpIntoLevel, xpNeeded }
}

export function formatXp(xp: number): string {
  return xp.toLocaleString('en-GB')
}
