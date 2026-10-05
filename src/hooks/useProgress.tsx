import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { UserProgress } from '@/types'
import { progressService } from '@/services/progressService'
import { getXpForNextLevel } from '@/utils/progression'

interface ProgressContextValue {
  progress: UserProgress
  levelInfo: ReturnType<typeof getXpForNextLevel>
  discoverSpecies: (speciesId: string) => void
  discoverTree: (treeId: string) => void
  discoverPlace: (placeId: string) => void
  toggleMissionObjective: (missionId: string, objectiveId: string) => void
  completeMission: (missionId: string) => void
  startWalk: (templateId: string) => string | undefined
  toggleWalkStop: (walkId: string, stopId: string) => void
  completeWalk: (walkId: string, xpReward: number, distanceKm: number) => void
  hasDiscovered: (speciesId: string) => boolean
  resetProgress: () => void
  updateProfile: (patch: Partial<Pick<UserProgress, 'displayName' | 'locationLabel'>>) => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(() => progressService.load())

  const levelInfo = useMemo(() => getXpForNextLevel(progress.xp), [progress.xp])

  const discoverSpecies = useCallback((speciesId: string) => {
    setProgress((p) => progressService.discoverSpecies(p, speciesId))
  }, [])

  const discoverTree = useCallback((treeId: string) => {
    setProgress((p) => progressService.discoverTree(p, treeId))
  }, [])

  const discoverPlace = useCallback((placeId: string) => {
    setProgress((p) => progressService.discoverPlace(p, placeId))
  }, [])

  const toggleMissionObjective = useCallback((missionId: string, objectiveId: string) => {
    setProgress((p) => progressService.toggleMissionObjective(p, missionId, objectiveId))
  }, [])

  const completeMission = useCallback((missionId: string) => {
    setProgress((p) => progressService.completeMission(p, missionId))
  }, [])

  const startWalk = useCallback((templateId: string) => {
    let walkId: string | undefined
    setProgress((p) => {
      const next = progressService.startWalk(p, templateId)
      walkId = next.activeWalkId
      return next
    })
    return walkId
  }, [])

  const toggleWalkStop = useCallback((walkId: string, stopId: string) => {
    setProgress((p) => progressService.toggleWalkStop(p, walkId, stopId))
  }, [])

  const completeWalk = useCallback((walkId: string, xpReward: number, distanceKm: number) => {
    setProgress((p) => progressService.completeWalk(p, walkId, xpReward, distanceKm))
  }, [])

  const hasDiscovered = useCallback(
    (speciesId: string) => progressService.hasDiscovered(progress, speciesId),
    [progress],
  )

  const resetProgress = useCallback(() => {
    setProgress(progressService.reset())
  }, [])

  const updateProfile = useCallback(
    (patch: Partial<Pick<UserProgress, 'displayName' | 'locationLabel'>>) => {
      setProgress((p) => {
        const next = { ...p, ...patch }
        progressService.save(next)
        return next
      })
    },
    [],
  )

  const value = useMemo(
    () => ({
      progress,
      levelInfo,
      discoverSpecies,
      discoverTree,
      discoverPlace,
      toggleMissionObjective,
      completeMission,
      startWalk,
      toggleWalkStop,
      completeWalk,
      hasDiscovered,
      resetProgress,
      updateProfile,
    }),
    [
      progress,
      levelInfo,
      discoverSpecies,
      discoverTree,
      discoverPlace,
      toggleMissionObjective,
      completeMission,
      startWalk,
      toggleWalkStop,
      completeWalk,
      hasDiscovered,
      resetProgress,
      updateProfile,
    ],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
