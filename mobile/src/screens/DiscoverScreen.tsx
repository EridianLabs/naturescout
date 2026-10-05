import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Check, Circle } from 'lucide-react-native'
import { useProgress } from '@/hooks/useProgress'
import { getSeasonalContext, greetingForHour } from '@/utils/seasonal'
import { adventureService } from '@/services/adventureService'
import { missionService } from '@/services/missionService'
import { placeService } from '@/services/placeService'
import { speciesService } from '@/services/speciesService'
import { formatDistance } from '@/utils/geo'
import {
  Body,
  Button,
  Card,
  Eyebrow,
  Pill,
  ProgressBar,
  Screen,
  Title,
  colors,
  fonts,
  spacing,
} from '@/components/ui'
import type { RootStackParamList } from '@/navigation/types'

type Nav = NativeStackNavigationProp<RootStackParamList>

export function DiscoverScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<Nav>()
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
    (progress.dailyDiscovery?.speciesId === daily.id && progress.dailyDiscovery.discovered) ||
    hasDiscovered(daily.id)

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: 120,
          paddingHorizontal: spacing.md,
          gap: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.greeting}>
            {greeting}, {progress.displayName}
          </Text>
          <Text style={styles.location}>{progress.locationLabel}</Text>
          <Title style={{ marginTop: 18, fontSize: 32, lineHeight: 38 }}>
            What's happening in nature near you?
          </Title>
          <Body style={{ marginTop: 10 }}>
            Discover what's worth seeing, spotting and exploring this week.
          </Body>
        </View>

        <View>
          <Eyebrow>This week</Eyebrow>
          <Title style={{ fontSize: 22, marginBottom: 12 }}>{seasonal.title}</Title>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {seasonal.highlights.map((h) => (
              <Card key={h.id} style={styles.seasonCard} onPress={() => navigation.navigate('MainTabs', { screen: 'ExploreTab' })}>
                <Text style={{ fontSize: 28 }}>{h.icon}</Text>
                <Text style={styles.cardTitle}>{h.title}</Text>
                <Body style={{ marginTop: 8 }}>{h.description}</Body>
                <View style={styles.rowBetween}>
                  <Pill tone="gold">Best time</Pill>
                  <Text style={styles.meta}>{h.bestTime}</Text>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>

        <Card style={{ overflow: 'hidden' }}>
          <LinearGradient colors={[colors.forest, colors.forestLight, colors.moss]} style={styles.adventureHero}>
            <Text style={styles.adventureEyebrow}>Your next adventure</Text>
            <Text style={styles.adventureTitle}>{featured.title}</Text>
            <Text style={styles.adventureMeta}>
              {featured.distanceKm} km · ~{featured.estimatedMinutes} min
            </Text>
            {featured.highlights.map((item) => (
              <Text key={item} style={styles.adventureItem}>
                {item}
              </Text>
            ))}
          </LinearGradient>
          <View style={[styles.rowBetween, { padding: 16 }]}>
            <Pill tone="demo">Schematic route</Pill>
            <Button label="Start Adventure" onPress={() => navigation.navigate('Adventure', { id: featured.id })} />
          </View>
        </Card>

        <Card style={{ padding: 18 }}>
          <Eyebrow color={colors.gold}>Today's discovery</Eyebrow>
          <View style={{ flexDirection: 'row', gap: 14, marginTop: 8 }}>
            <View style={styles.emojiBox}>
              <Text style={{ fontSize: 34 }}>{daily.image}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.meta}>Today's species</Text>
              <Text style={styles.cardTitle}>{daily.name}</Text>
              <Text style={[styles.meta, { marginTop: 8, color: colors.moss }]}>Look for:</Text>
              {daily.identifyingFeatures.slice(0, 3).map((f) => (
                <Text key={f} style={styles.meta}>
                  {f}
                </Text>
              ))}
            </View>
          </View>
          <View style={{ marginTop: 14 }}>
            {dailyDone ? (
              <Text style={[styles.meta, { textAlign: 'center', color: colors.moss }]}>Discovered today ✓</Text>
            ) : (
              <Button label="Discover" onPress={() => discoverSpecies(daily.id)} />
            )}
          </View>
        </Card>

        <View>
          <Eyebrow>Nature missions</Eyebrow>
          <Title style={{ fontSize: 22, marginBottom: 12 }}>Something to look for</Title>
          <View style={{ gap: 12 }}>
            {missions.map((m) => {
              const completed = progress.completedMissionIds.includes(m.id)
              const objProgress = progress.missionProgress[m.id] ?? {}
              return (
                <Card key={m.id} style={{ padding: 16 }}>
                  <View style={styles.rowBetween}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <Text style={styles.cardTitle}>
                        {m.icon} {m.title}
                      </Text>
                      <Body style={{ marginTop: 4 }}>{m.description}</Body>
                    </View>
                    <Pill tone={completed ? 'forest' : 'gold'}>+{m.xpReward} XP</Pill>
                  </View>
                  <View style={{ marginTop: 12, gap: 8 }}>
                    {m.objectives.map((obj) => {
                      const done = (objProgress[obj.id] ?? 0) >= obj.targetCount
                      return (
                        <Pressable
                          key={obj.id}
                          onPress={() => toggleMissionObjective(m.id, obj.id)}
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                        >
                          {done ? (
                            <Check size={16} color={colors.moss} />
                          ) : (
                            <Circle size={16} color={colors.stoneLight} />
                          )}
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
                  </View>
                  {!completed && (
                    <View style={{ marginTop: 12 }}>
                      <Button label="Mark mission complete" variant="secondary" onPress={() => completeMission(m.id)} />
                    </View>
                  )}
                </Card>
              )
            })}
          </View>
        </View>

        <View>
          <Eyebrow>What's nearby</Eyebrow>
          <Title style={{ fontSize: 22 }}>{counts.total} discoveries nearby</Title>
          <Body style={{ marginTop: 6, marginBottom: 12 }}>Within about 1 mile of the demo starting point.</Body>
          <View style={styles.nearbyGrid}>
            {[
              ['🌳', 'Trees', counts.trees],
              ['🌸', 'Plants', counts.plants],
              ['🐦', 'Birds', counts.birds],
              ['🦋', 'Insects', counts.insects],
              ['🍄', 'Fungi', counts.fungi],
              ['🏞️', 'Places', counts.places],
            ].map(([icon, label, n]) => (
              <View key={label as string} style={styles.nearbyCell}>
                <Text style={{ fontSize: 18 }}>{icon}</Text>
                <Text style={styles.meta}>{label}</Text>
                <Text style={{ fontFamily: fonts.sansSemi, color: colors.forest }}>{n}</Text>
              </View>
            ))}
          </View>
          <Card style={{ padding: 16, marginTop: 12 }}>
            <Text style={styles.cardTitle}>Nearest discoveries</Text>
            {nearby.slice(0, 5).map((n, i) => (
              <Pressable
                key={n.id}
                onPress={() => {
                  if (n.refType === 'species') navigation.navigate('SpeciesDetail', { id: n.refId })
                  else if (n.refType === 'tree') navigation.navigate('TreeDetail', { id: n.refId })
                  else navigation.navigate('PlaceDetail', { id: n.refId })
                }}
                style={styles.nearbyRow}
              >
                <Text style={{ flex: 1, fontFamily: fonts.sans, color: colors.charcoal }}>
                  {i + 1}. {n.icon} {n.name}
                </Text>
                <Text style={styles.meta}>{formatDistance(n.distanceMiles)}</Text>
              </Pressable>
            ))}
          </Card>
        </View>

        <LinearGradient colors={[colors.forest, colors.forestLight]} style={styles.cta}>
          <Text style={styles.adventureEyebrow}>Plan a walk</Text>
          <Text style={styles.adventureTitle}>Generate an adventure</Text>
          <Text style={[styles.adventureMeta, { marginBottom: 14 }]}>
            Choose how long you have and what you want to discover.
          </Text>
          <Button label="Build my adventure" variant="secondary" onPress={() => navigation.navigate('AdventureGenerate')} />
        </LinearGradient>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  greeting: { fontFamily: fonts.sans, fontSize: 14, color: colors.charcoalMuted },
  location: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.moss, marginTop: 2 },
  seasonCard: { width: 260, padding: 18 },
  cardTitle: { fontFamily: fonts.display, fontSize: 18, color: colors.forest, marginTop: 8 },
  meta: { fontFamily: fonts.sans, fontSize: 12, color: colors.charcoalMuted },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  adventureHero: { padding: 20 },
  adventureEyebrow: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.mossLight,
  },
  adventureTitle: { fontFamily: fonts.display, fontSize: 26, color: colors.cream, marginTop: 8 },
  adventureMeta: { fontFamily: fonts.sans, fontSize: 13, color: 'rgba(245,240,232,0.8)', marginTop: 6 },
  adventureItem: { fontFamily: fonts.sans, fontSize: 14, color: 'rgba(245,240,232,0.92)', marginTop: 6 },
  emojiBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearbyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  nearbyCell: {
    width: '31%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(27,58,42,0.05)',
  },
  nearbyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.creamDark,
    marginTop: 4,
  },
  cta: { borderRadius: 24, padding: 20 },
})
