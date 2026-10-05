import { useMemo, useState } from 'react'
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Check, Circle } from 'lucide-react-native'
import { missionService } from '@/services/missionService'
import { adventureService, type AdventureThemeOption, type AdventureTimeOption } from '@/services/adventureService'
import { useProgress } from '@/hooks/useProgress'
import { Body, Button, Card, DemoBanner, Eyebrow, Pill, ProgressBar, Screen, Title, colors, fonts, spacing } from '@/components/ui'
import type { RootStackParamList } from '@/navigation/types'

type Nav = NativeStackNavigationProp<RootStackParamList>

export function MissionDetailScreen() {
  const insets = useSafeAreaInsets()
  const route = useRoute<RouteProp<RootStackParamList, 'MissionDetail'>>()
  const navigation = useNavigation()
  const { progress, toggleMissionObjective, completeMission } = useProgress()
  const mission = missionService.getById(route.params.id)

  if (!mission) {
    return (
      <Screen>
        <View style={{ padding: 24, paddingTop: insets.top + 24 }}>
          <Title>Mission not found</Title>
          <Button label="Go back" onPress={() => navigation.goBack()} />
        </View>
      </Screen>
    )
  }

  const completed = progress.completedMissionIds.includes(mission.id)
  const objProgress = progress.missionProgress[mission.id] ?? {}

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 40, paddingHorizontal: spacing.md, gap: 16 }}>
        <Button label="← Back" variant="ghost" onPress={() => navigation.goBack()} />
        <Text style={{ fontSize: 40 }}>{mission.icon}</Text>
        <Title>{mission.title}</Title>
        <Body>{mission.description}</Body>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Pill>{mission.difficulty}</Pill>
          <Pill tone="gold">+{mission.xpReward} XP</Pill>
        </View>
        <Card style={{ padding: 16, gap: 12 }}>
          {mission.objectives.map((obj) => {
            const done = (objProgress[obj.id] ?? 0) >= obj.targetCount
            return (
              <Pressable
                key={obj.id}
                onPress={() => toggleMissionObjective(mission.id, obj.id)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
              >
                {done ? <Check size={18} color={colors.moss} /> : <Circle size={18} color={colors.stoneLight} />}
                <Text
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: 14,
                    color: done ? colors.charcoalMuted : colors.charcoal,
                    textDecorationLine: done ? 'line-through' : 'none',
                  }}
                >
                  {obj.label}
                </Text>
              </Pressable>
            )
          })}
        </Card>
        {!completed && <Button label="Mark mission complete" onPress={() => completeMission(mission.id)} />}
        {completed && <Text style={{ textAlign: 'center', fontFamily: fonts.sansSemi, color: colors.moss }}>Mission complete</Text>}
      </ScrollView>
    </Screen>
  )
}

export function AdventureGenerateScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<Nav>()
  const [time, setTime] = useState<AdventureTimeOption>(60)
  const [theme, setTheme] = useState<AdventureThemeOption>('anything')
  const preview = useMemo(() => adventureService.generate(time, theme), [time, theme])

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

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 40, paddingHorizontal: spacing.md, gap: 18 }}>
        <Button label="← Back" variant="ghost" onPress={() => navigation.goBack()} />
        <Title>Build an adventure</Title>
        <Body>A simple local generator using seeded Guildford data — not live routing.</Body>
        <DemoBanner text="Generated adventures are schematic templates selected from demo data." />

        <Eyebrow>Time</Eyebrow>
        <View style={styles.chips}>
          {times.map((t) => (
            <Pressable key={t} onPress={() => setTime(t)} style={[styles.chip, time === t && styles.chipActive]}>
              <Text style={[styles.chipText, time === t && styles.chipTextActive]}>
                {t === 120 ? '2 hours' : `${t} min`}
              </Text>
            </Pressable>
          ))}
        </View>

        <Eyebrow>What do you want to discover?</Eyebrow>
        <View style={styles.chips}>
          {themes.map((t) => (
            <Pressable key={t.id} onPress={() => setTheme(t.id)} style={[styles.chip, theme === t.id && styles.chipActive]}>
              <Text style={[styles.chipText, theme === t.id && styles.chipTextActive]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        <Card style={{ padding: 18 }}>
          <Eyebrow>Your adventure</Eyebrow>
          <Text style={styles.cardTitle}>{preview.title}</Text>
          <Body style={{ marginTop: 4 }}>
            Estimated time · {preview.estimatedMinutes} minutes · {preview.distanceKm} km
          </Body>
          <Text style={[styles.meta, { color: colors.moss, marginTop: 12 }]}>You'll discover:</Text>
          {preview.highlights.map((h) => (
            <Text key={h} style={styles.meta}>
              {h}
            </Text>
          ))}
          <View style={{ marginTop: 16 }}>
            <Button label="Start Adventure" onPress={() => navigation.navigate('Adventure', { id: preview.id })} />
          </View>
        </Card>
      </ScrollView>
    </Screen>
  )
}

export function AdventureScreen() {
  const insets = useSafeAreaInsets()
  const route = useRoute<RouteProp<RootStackParamList, 'Adventure'>>()
  const navigation = useNavigation<Nav>()
  const { progress, startWalk, toggleWalkStop, completeWalk, discoverSpecies, discoverTree, discoverPlace } =
    useProgress()
  const adventure = adventureService.getById(route.params.id)
  const [done, setDone] = useState(false)

  if (!adventure) {
    return (
      <Screen>
        <View style={{ padding: 24, paddingTop: insets.top + 24 }}>
          <Title>Adventure not found</Title>
          <Button label="Go back" onPress={() => navigation.goBack()} />
        </View>
      </Screen>
    )
  }

  const walk =
    progress.walks.find((w) => w.templateId === adventure.id && !w.completedAt) ??
    progress.walks.find((w) => w.id === progress.activeWalkId && w.templateId === adventure.id)
  const completedStops = walk?.completedStopIds ?? []
  const progressPct = adventure.stops.length ? completedStops.length / adventure.stops.length : 0

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
      <Screen>
        <View style={{ flex: 1, justifyContent: 'center', padding: 24, paddingTop: insets.top + 40, gap: 14 }}>
          <Text style={{ fontSize: 48, textAlign: 'center' }}>🎉</Text>
          <Title style={{ textAlign: 'center' }}>Adventure complete</Title>
          <Text style={{ textAlign: 'center', fontFamily: fonts.sansSemi, fontSize: 18, color: colors.gold }}>
            +{adventure.xpReward} XP
          </Text>
          <Body style={{ textAlign: 'center' }}>
            {adventure.stops.length} discoveries added · schematic route finished
          </Body>
          <Button label="View Collection" onPress={() => navigation.navigate('MainTabs', { screen: 'CollectionTab' })} />
          <Button label="Back to Discover" variant="secondary" onPress={() => navigation.navigate('MainTabs', { screen: 'DiscoverTab' })} />
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 40, paddingHorizontal: spacing.md, gap: 16 }}>
        <Button label="← Back" variant="ghost" onPress={() => navigation.goBack()} />
        <Eyebrow>Adventure mode</Eyebrow>
        <Title style={{ textTransform: 'uppercase', letterSpacing: 1 }}>{adventure.title}</Title>
        <Body>
          {adventure.distanceKm} km · ~{adventure.estimatedMinutes} min
        </Body>
        <DemoBanner text="This is a schematic adventure checklist — not turn-by-turn navigation." />
        <Card style={{ padding: 16, gap: 14 }}>
          {adventure.stops.map((stop, i) => {
            const checked = completedStops.includes(stop.id)
            return (
              <Pressable
                key={stop.id}
                onPress={() => handleToggle(stop.id, stop.refId, stop.type)}
                style={{ flexDirection: 'row', gap: 10 }}
              >
                <Text style={styles.meta}>{i + 1}.</Text>
                {checked ? <Check size={18} color={colors.moss} /> : <Circle size={18} color={colors.stoneLight} />}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: fonts.sansMedium,
                      color: checked ? colors.charcoalMuted : colors.forest,
                      textDecorationLine: checked ? 'line-through' : 'none',
                    }}
                  >
                    {stop.label}
                  </Text>
                  <Text style={styles.meta}>{stop.description}</Text>
                </View>
              </Pressable>
            )
          })}
          <View style={{ marginTop: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={styles.meta}>Progress</Text>
              <Text style={{ fontFamily: fonts.sansSemi, color: colors.forest }}>{Math.round(progressPct * 100)}%</Text>
            </View>
            <ProgressBar value={progressPct} />
          </View>
        </Card>
        {!walk && <Button label="Begin tracking" onPress={() => startWalk(adventure.id)} />}
        <Button
          label={progressPct >= 1 ? 'Complete adventure' : 'Complete adventure early'}
          disabled={progressPct < 1 && completedStops.length === 0}
          onPress={handleComplete}
        />
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(27,58,42,0.1)',
  },
  chipActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  chipText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.charcoalMuted },
  chipTextActive: { color: colors.cream },
  cardTitle: { fontFamily: fonts.display, fontSize: 24, color: colors.forest, marginTop: 6 },
  meta: { fontFamily: fonts.sans, fontSize: 13, color: colors.charcoalMuted, marginTop: 2 },
})
