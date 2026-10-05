import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native'
import { speciesService } from '@/services/speciesService'
import { placeService } from '@/services/placeService'
import { missionService } from '@/services/missionService'
import { useProgress } from '@/hooks/useProgress'
import { categoryLabel, rarityLabel } from '@/utils/search'
import { Body, Button, Card, DemoBanner, Eyebrow, Pill, Screen, Title, colors, fonts, spacing } from '@/components/ui'
import type { RootStackParamList } from '@/navigation/types'

export function SpeciesDetailScreen() {
  const insets = useSafeAreaInsets()
  const route = useRoute<RouteProp<RootStackParamList, 'SpeciesDetail'>>()
  const navigation = useNavigation()
  const { discoverSpecies, hasDiscovered, completeMission } = useProgress()
  const species = speciesService.getById(route.params.id)

  if (!species) {
    return (
      <Screen>
        <View style={{ padding: 24, paddingTop: insets.top + 24 }}>
          <Title>Species not found</Title>
          <Button label="Go back" onPress={() => navigation.goBack()} />
        </View>
      </Screen>
    )
  }

  const discovered = hasDiscovered(species.id)
  const relatedMissions = missionService.getRelatedToSpecies(species.id)
  const relatedTrees = placeService.getTrees().filter((t) => t.speciesId === species.id).slice(0, 3)
  const nearbyPlaces = placeService.getAll().filter((p) => p.speciesIds.includes(species.id)).slice(0, 3)
  const seasons = [
    ['Spring', species.seasonalInterest.spring],
    ['Summer', species.seasonalInterest.summer],
    ['Autumn', species.seasonalInterest.autumn],
    ['Winter', species.seasonalInterest.winter],
  ] as const

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 40, paddingHorizontal: spacing.md, gap: 18 }}>
        <Button label="← Back" variant="ghost" onPress={() => navigation.goBack()} />
        <View style={styles.emojiLarge}>
          <Text style={{ fontSize: 44 }}>{species.image}</Text>
        </View>
        <View>
          <Title>{species.name}</Title>
          <Text style={styles.scientific}>{species.scientificName}</Text>
          <View style={styles.pills}>
            <Pill>
              {species.image} {categoryLabel(species.category)}
            </Pill>
            <Pill tone="forest">{rarityLabel(species.rarity)}</Pill>
            <Pill tone="demo">Guildford area</Pill>
          </View>
        </View>
        <DemoBanner text="Species guidance is educational demo content — verify with local field guides." />
        <View>
          <Eyebrow>How to recognise it</Eyebrow>
          <Body>{species.howToRecognise}</Body>
        </View>
        <View>
          <Eyebrow>Look for</Eyebrow>
          <View style={{ gap: 8, marginTop: 8 }}>
            {species.identifyingFeatures.map((f) => (
              <Card key={f} style={{ padding: 12 }}>
                <Text style={styles.feature}>{f}</Text>
              </Card>
            ))}
          </View>
        </View>
        <View>
          <Eyebrow>When to see it</Eyebrow>
          <Card style={{ padding: 16, gap: 10, marginTop: 8 }}>
            {seasons.map(([label, value]) => (
              <View key={label} style={styles.seasonRow}>
                <Text style={styles.seasonLabel}>{label}</Text>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${value * 10}%` }]} />
                </View>
              </View>
            ))}
          </Card>
        </View>
        {(relatedTrees.length > 0 || nearbyPlaces.length > 0) && (
          <View>
            <Eyebrow>Nearby discoveries</Eyebrow>
            <View style={{ gap: 8, marginTop: 8 }}>
              {relatedTrees.map((t) => (
                <Card key={t.id} style={{ padding: 14 }}>
                  <Text style={styles.feature}>{t.name}</Text>
                  <Text style={styles.meta}>{t.location.label}</Text>
                </Card>
              ))}
              {nearbyPlaces.map((p) => (
                <Card key={p.id} style={{ padding: 14 }}>
                  <Text style={styles.feature}>{p.name}</Text>
                  <Text style={[styles.meta, { textTransform: 'capitalize' }]}>{p.type}</Text>
                </Card>
              ))}
            </View>
          </View>
        )}
        {relatedMissions[0] && (
          <Card style={{ padding: 16 }}>
            <Eyebrow>Nature mission</Eyebrow>
            <Text style={styles.feature}>{relatedMissions[0].title}</Text>
            <Body style={{ marginTop: 4 }}>{relatedMissions[0].description}</Body>
            <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Pill tone="gold">+{relatedMissions[0].xpReward} XP</Pill>
              <Button label="Complete" variant="secondary" onPress={() => completeMission(relatedMissions[0].id)} />
            </View>
          </Card>
        )}
        <Button
          label={discovered ? 'Already in your collection' : 'Mark as discovered · +25 XP'}
          disabled={discovered}
          onPress={() => discoverSpecies(species.id)}
        />
      </ScrollView>
    </Screen>
  )
}

export function TreeDetailScreen() {
  const insets = useSafeAreaInsets()
  const route = useRoute<RouteProp<RootStackParamList, 'TreeDetail'>>()
  const navigation = useNavigation()
  const { discoverTree, hasDiscovered } = useProgress()
  const tree = placeService.getTreeById(route.params.id)
  const species = tree ? speciesService.getById(tree.speciesId) : undefined

  if (!tree || !species) {
    return (
      <Screen>
        <View style={{ padding: 24, paddingTop: insets.top + 24 }}>
          <Title>Tree not found</Title>
          <Button label="Go back" onPress={() => navigation.goBack()} />
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 40, paddingHorizontal: spacing.md, gap: 16 }}>
        <Button label="← Back" variant="ghost" onPress={() => navigation.goBack()} />
        <Text style={{ fontSize: 40 }}>🌳</Text>
        <Title>{tree.name}</Title>
        <Text style={styles.meta}>
          🌳 {species.name} · 📍 {tree.location.label}
        </Text>
        <View style={styles.pills}>
          {tree.isAncient && <Pill tone="gold">⭐ Ancient tree</Pill>}
          {tree.isNotable && !tree.isAncient && <Pill tone="gold">⭐ Notable tree</Pill>}
          <Pill tone="demo">Demo specimen</Pill>
        </View>
        <DemoBanner text="Tree age, girth and coordinates are illustrative sample data until verified." />
        <Body>{tree.description}</Body>
        <Card style={{ padding: 16, gap: 8 }}>
          {tree.estimatedAgeYears ? <Text style={styles.feature}>Estimated age: ~{tree.estimatedAgeYears} years</Text> : null}
          {tree.girthCm ? <Text style={styles.feature}>Approx. girth: {tree.girthCm} cm</Text> : null}
          <Text style={styles.feature}>Seasonal interest: {tree.seasonalInterest}</Text>
        </Card>
        <Button
          label={
            hasDiscovered(species.id)
              ? 'Species already collected'
              : `Discover this tree · +${tree.isNotable ? 50 : 25} XP`
          }
          disabled={hasDiscovered(species.id)}
          onPress={() => discoverTree(tree.id)}
        />
      </ScrollView>
    </Screen>
  )
}

export function PlaceDetailScreen() {
  const insets = useSafeAreaInsets()
  const route = useRoute<RouteProp<RootStackParamList, 'PlaceDetail'>>()
  const navigation = useNavigation()
  const { discoverPlace, progress } = useProgress()
  const place = placeService.getById(route.params.id)

  if (!place) {
    return (
      <Screen>
        <View style={{ padding: 24, paddingTop: insets.top + 24 }}>
          <Title>Place not found</Title>
          <Button label="Go back" onPress={() => navigation.goBack()} />
        </View>
      </Screen>
    )
  }

  const visited = progress.completedPlaceIds.includes(place.id)

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 40, paddingHorizontal: spacing.md, gap: 16 }}>
        <Button label="← Back" variant="ghost" onPress={() => navigation.goBack()} />
        <Eyebrow>{place.type}</Eyebrow>
        <Title>{place.name}</Title>
        <Pill tone="demo">Demo place data</Pill>
        <Body>{place.description}</Body>
        <View style={styles.pills}>
          {place.highlights.map((h) => (
            <Pill key={h}>{h}</Pill>
          ))}
        </View>
        <Eyebrow>What you might find</Eyebrow>
        <View style={{ gap: 8 }}>
          {place.speciesIds.map((id) => {
            const s = speciesService.getById(id)
            if (!s) return null
            return (
              <Card key={id} style={{ padding: 14, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <Text style={{ fontSize: 24 }}>{s.image}</Text>
                <Text style={styles.feature}>{s.name}</Text>
              </Card>
            )
          })}
        </View>
        <Button
          label={visited ? 'Place explored' : 'Mark as explored · +30 XP'}
          disabled={visited}
          onPress={() => discoverPlace(place.id)}
        />
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  emojiLarge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scientific: { fontFamily: fonts.sans, fontSize: 14, fontStyle: 'italic', color: colors.charcoalMuted, marginTop: 4 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  feature: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.forest },
  meta: { fontFamily: fonts.sans, fontSize: 12, color: colors.charcoalMuted },
  seasonRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  seasonLabel: { width: 60, fontFamily: fonts.sans, fontSize: 13, color: colors.charcoalMuted },
  track: { flex: 1, height: 10, borderRadius: 999, backgroundColor: colors.creamDark, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.moss, borderRadius: 999 },
})
