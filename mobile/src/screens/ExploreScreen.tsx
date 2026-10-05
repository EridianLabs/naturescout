import { useMemo, useState } from 'react'
import { ScrollView, View, Text, TextInput, StyleSheet, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Search } from 'lucide-react-native'
import { speciesService } from '@/services/speciesService'
import { placeService } from '@/services/placeService'
import { searchAll, categoryLabel } from '@/utils/search'
import type { DiscoveryFilter } from '@/types'
import { useProgress } from '@/hooks/useProgress'
import { Body, Card, Eyebrow, Pill, Screen, Title, colors, fonts, spacing } from '@/components/ui'
import type { RootStackParamList } from '@/navigation/types'

type Nav = NativeStackNavigationProp<RootStackParamList>

const FILTERS: { id: DiscoveryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'trees', label: 'Trees' },
  { id: 'plants', label: 'Plants' },
  { id: 'birds', label: 'Birds' },
  { id: 'fungi', label: 'Fungi' },
  { id: 'wildlife', label: 'Wildlife' },
  { id: 'places', label: 'Places' },
]

export function ExploreScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<Nav>()
  const { progress, hasDiscovered } = useProgress()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<DiscoveryFilter>('all')

  const searchResults = useMemo(() => (query.trim() ? searchAll(query) : []), [query])
  const species = useMemo(() => speciesService.filter(filter, progress.regionId), [filter, progress.regionId])
  const trees = placeService.getTrees(progress.regionId)
  const places = placeService.getAll(progress.regionId)

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: 120,
          paddingHorizontal: spacing.md,
          gap: 16,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Title>Explore Guildford</Title>
          <Body style={{ marginTop: 8 }}>Search trees, birds, plants, places and more.</Body>
        </View>

        <View style={styles.searchWrap}>
          <Search size={18} color={colors.stone} style={{ marginRight: 8 }} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search trees, birds, plants, places..."
            placeholderTextColor={colors.stone}
            style={styles.searchInput}
          />
        </View>

        {query.trim() ? (
          <View style={{ gap: 8 }}>
            <Text style={styles.meta}>
              {searchResults.length} result{searchResults.length === 1 ? '' : 's'}
            </Text>
            {searchResults.map((r) => (
              <Card
                key={`${r.type}-${r.id}`}
                style={styles.resultCard}
                onPress={() => {
                  if (r.type === 'species') navigation.navigate('SpeciesDetail', { id: r.id })
                  else if (r.type === 'tree') navigation.navigate('TreeDetail', { id: r.id })
                  else if (r.type === 'place') navigation.navigate('PlaceDetail', { id: r.id })
                  else navigation.navigate('MissionDetail', { id: r.id })
                }}
              >
                <Text style={{ fontSize: 24 }}>{r.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{r.title}</Text>
                  <Text style={styles.meta}>
                    {r.subtitle} · {r.type}
                  </Text>
                </View>
              </Card>
            ))}
            {searchResults.length === 0 && (
              <View style={styles.empty}>
                <Body>Nothing matched “{query}”. Try oak, robin, river, fungi…</Body>
              </View>
            )}
          </View>
        ) : (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {FILTERS.map((f) => (
                <Pressable
                  key={f.id}
                  onPress={() => setFilter(f.id)}
                  style={[styles.chip, filter === f.id && styles.chipActive]}
                >
                  <Text style={[styles.chipText, filter === f.id && styles.chipTextActive]}>{f.label}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {(filter === 'all' || filter === 'trees') && (
              <View>
                <View style={styles.rowBetween}>
                  <Eyebrow>Trees near Guildford</Eyebrow>
                  <Pill tone="demo">Demo specimens</Pill>
                </View>
                <View style={{ gap: 10, marginTop: 8 }}>
                  {(filter === 'trees' ? trees : trees.slice(0, 4)).map((t) => {
                    const sp = speciesService.getById(t.speciesId)
                    return (
                      <Card key={t.id} style={{ padding: 14 }} onPress={() => navigation.navigate('TreeDetail', { id: t.id })}>
                        <Text style={styles.cardTitle}>{t.name}</Text>
                        <Text style={styles.meta}>
                          🌳 {sp?.name ?? 'Tree'} · 📍 {t.location.label ?? 'Nearby'}
                        </Text>
                        {(t.isNotable || t.isAncient) && (
                          <View style={{ marginTop: 8 }}>
                            <Pill tone="gold">{t.isAncient ? 'Ancient' : 'Notable'}</Pill>
                          </View>
                        )}
                      </Card>
                    )
                  })}
                </View>
              </View>
            )}

            {filter === 'places' ? (
              <View style={{ gap: 10 }}>
                <Title style={{ fontSize: 22 }}>Places</Title>
                {places.map((p) => (
                  <Card key={p.id} style={{ padding: 14 }} onPress={() => navigation.navigate('PlaceDetail', { id: p.id })}>
                    <Text style={styles.cardTitle}>{p.name}</Text>
                    <Text style={[styles.meta, { textTransform: 'capitalize' }]}>{p.type}</Text>
                    <Body style={{ marginTop: 6 }} numberOfLines={2}>
                      {p.description}
                    </Body>
                  </Card>
                ))}
              </View>
            ) : (
              <View>
                <Title style={{ fontSize: 22, marginBottom: 10 }}>
                  {filter === 'all' ? 'Species to discover' : FILTERS.find((f) => f.id === filter)?.label}
                </Title>
                <View style={{ gap: 10 }}>
                  {species.map((s) => (
                    <Card
                      key={s.id}
                      style={{ padding: 14, flexDirection: 'row', gap: 12, alignItems: 'center' }}
                      onPress={() => navigation.navigate('SpeciesDetail', { id: s.id })}
                    >
                      <View style={[styles.emoji, !hasDiscovered(s.id) && { opacity: 0.45 }]}>
                        <Text style={{ fontSize: 26 }}>{s.image}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{s.name}</Text>
                        <Text style={styles.meta}>
                          {s.image} {categoryLabel(s.category)}
                        </Text>
                        <Text style={[styles.meta, { marginTop: 4 }]}>
                          {s.rarity === 'seasonal' ? 'Seasonal highlight' : s.rarity === 'common' ? 'Common locally' : s.rarity}
                        </Text>
                        <Text style={[styles.meta, { color: colors.moss, marginTop: 6 }]}>Learn more →</Text>
                      </View>
                    </Card>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(27,58,42,0.1)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.charcoal,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(27,58,42,0.1)',
  },
  chipActive: { backgroundColor: colors.forest, borderColor: colors.forest },
  chipText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.charcoalMuted },
  chipTextActive: { color: colors.cream },
  cardTitle: { fontFamily: fonts.display, fontSize: 17, color: colors.forest },
  meta: { fontFamily: fonts.sans, fontSize: 12, color: colors.charcoalMuted },
  resultCard: { padding: 14, flexDirection: 'row', gap: 12, alignItems: 'center' },
  empty: { backgroundColor: colors.creamDark, borderRadius: 18, padding: 24, alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  emoji: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
