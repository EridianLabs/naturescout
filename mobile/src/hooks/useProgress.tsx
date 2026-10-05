import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ActivityIndicator, View } from 'react-native'
import type { UserProgress } from '@/types'
import { progressService } from '@/services/progressService'
import { getXpForNextLevel } from '@/utils/progression'
import { colors } from '@/theme'

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
  const [progress, setProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    void progressService.load().then(setProgress)
  }, [])

  const levelInfo = useMemo(
    () => getXpForNextLevel(progress?.xp ?? 0),
    [progress?.xp],
  )

  const discoverSpecies = useCallback((speciesId: string) => {
    setProgress((p) => (p ? progressService.discoverSpecies(p, speciesId) : p))
  }, [])

  const discoverTree = useCallback((treeId: string) => {
    setProgress((p) => (p ? progressService.discoverTree(p, treeId) : p))
  }, [])

  const discoverPlace = useCallback((placeId: string) => {
    setProgress((p) => (p ? progressService.discoverPlace(p, placeId) : p))
  }, [])

  const toggleMissionObjective = useCallback((missionId: string, objectiveId: string) => {
    setProgress((p) => (p ? progressService.toggleMissionObjective(p, missionId, objectiveId) : p))
  }, [])

  const completeMission = useCallback((missionId: string) => {
    setProgress((p) => (p ? progressService.completeMission(p, missionId) : p))
  }, [])

  const startWalk = useCallback((templateId: string) => {
    let walkId: string | undefined
    setProgress((p) => {
      if (!p) return p
      const next = progressService.startWalk(p, templateId)
      walkId = next.activeWalkId
      return next
    })
    return walkId
  }, [])

  const toggleWalkStop = useCallback((walkId: string, stopId: string) => {
    setProgress((p) => (p ? progressService.toggleWalkStop(p, walkId, stopId) : p))
  }, [])

  const completeWalk = useCallback((walkId: string, xpReward: number, distanceKm: number) => {
    setProgress((p) => (p ? progressService.completeWalk(p, walkId, xpReward, distanceKm) : p))
  }, [])

  const hasDiscovered = useCallback(
    (speciesId: string) => (progress ? progressService.hasDiscovered(progress, speciesId) : false),
    [progress],
  )

  const resetProgress = useCallback(() => {
    setProgress(progressService.reset())
  }, [])

  const updateProfile = useCallback(
    (patch: Partial<Pick<UserProgress, 'displayName' | 'locationLabel'>>) => {
      setProgress((p) => {
        if (!p) return p
        const next = { ...p, ...patch }
        void progressService.save(next)
        return next
      })
    },
    [],
  )

  const value = useMemo(
    () =>
      progress
        ? {
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
          }
        : null,
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

  if (!progress || !value) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream }}>
        <ActivityIndicator color={colors.forest} size="large" />
      </View>
    )
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
