import { useMemo } from 'react'
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useProgress } from '@/hooks/useProgress'
import { progressService } from '@/services/progressService'
import { speciesService } from '@/services/speciesService'
import { categoryLabel } from '@/utils/search'
import { Body, Card, Pill, ProgressBar, Screen, Title, colors, fonts, spacing } from '@/components/ui'
import type { RootStackParamList } from '@/navigation/types'

type Nav = NativeStackNavigationProp<RootStackParamList>

export function CollectionScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<Nav>()
  const { progress, hasDiscovered } = useProgress()
  const stats = useMemo(() => progressService.getCollectionStats(progress), [progress])
  const allSpecies = speciesService.getAll(progress.regionId)
  const discoveredSet = useMemo(
    () => new Set(progress.discoveries.map((d) => d.speciesId)),
    [progress.discoveries],
  )
  const discoveryDates = useMemo(() => {
    const map = new Map<string, string>()
    for (const d of progress.discoveries) map.set(d.speciesId, d.discoveredAt)
    return map
  }, [progress.discoveries])

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: 120,
          paddingHorizontal: spacing.md,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Title>Your Nature Collection</Title>
          <Body style={{ marginTop: 8 }}>A sophisticated field collection — not a cartoon Pokédex.</Body>
        </View>

        <Card style={{ padding: 18 }}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.moss}>Guildford</Text>
              <Text style={styles.bigStat}>
                {stats.discovered} / {stats.total} discoveries
              </Text>
            </View>
            <Text style={styles.gold}>{stats.percent}% explored</Text>
          </View>
          <View style={{ marginTop: 14 }}>
            <ProgressBar value={stats.percent / 100} />
          </View>
          <View style={styles.statGrid}>
            {Object.entries(stats.byCategory).map(([label, val]) => (
              <View key={label} style={styles.statCell}>
                <Text style={styles.meta}>{label}</Text>
                <Text style={styles.statValue}>
                  {val.discovered} / {val.total}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        <View>
          <Title style={{ fontSize: 22, marginBottom: 12 }}>Species</Title>
          <View style={styles.grid}>
            {allSpecies.map((s) => {
              const found = discoveredSet.has(s.id) || hasDiscovered(s.id)
              const date = discoveryDates.get(s.id)
              const card = (
                <View style={[styles.speciesCard, !found && styles.speciesHidden]}>
                  <View style={[styles.emoji, !found && { backgroundColor: colors.charcoal }]}>
                    <Text style={{ fontSize: 28, opacity: found ? 1 : 0.25 }}>{s.image}</Text>
                  </View>
                  <Text style={[styles.speciesName, !found && { color: colors.stoneLight }]}>
                    {found ? s.name : '???'}
                  </Text>
                  <Text style={styles.meta}>{categoryLabel(s.category)}</Text>
                  {found && date ? (
                    <Text style={[styles.meta, { marginTop: 6 }]}>
                      {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </Text>
                  ) : (
                    <View style={{ marginTop: 6 }}>
                      <Pill tone="demo">Undiscovered</Pill>
                    </View>
                  )}
                </View>
              )
              return found ? (
                <Pressable key={s.id} style={{ width: '48%' }} onPress={() => navigation.navigate('SpeciesDetail', { id: s.id })}>
                  {card}
                </Pressable>
              ) : (
                <View key={s.id} style={{ width: '48%' }}>
                  {card}
                </View>
              )
            })}
          </View>
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  moss: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.moss },
  bigStat: { fontFamily: fonts.display, fontSize: 24, color: colors.forest, marginTop: 4 },
  gold: { fontFamily: fonts.sansSemi, fontSize: 14, color: colors.gold },
  meta: { fontFamily: fonts.sans, fontSize: 11, color: colors.charcoalMuted },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  statCell: { width: '48%', backgroundColor: colors.cream, borderRadius: 14, padding: 10 },
  statValue: { fontFamily: fonts.sansSemi, fontSize: 15, color: colors.forest, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  speciesCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(27,58,42,0.08)',
  },
  speciesHidden: { backgroundColor: '#2a2a2a', borderColor: 'transparent' },
  emoji: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speciesName: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.forest, marginTop: 10, textAlign: 'center' },
})
