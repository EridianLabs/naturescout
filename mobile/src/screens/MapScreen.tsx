import { useMemo, useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Rect, Ellipse, Path } from 'react-native-svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { placeService } from '@/services/placeService'
import { missionService } from '@/services/missionService'
import { speciesService } from '@/services/speciesService'
import { Body, Card, DemoBanner, Eyebrow, Pill, Screen, Title, colors, fonts, spacing } from '@/components/ui'
import type { RootStackParamList } from '@/navigation/types'

type Nav = NativeStackNavigationProp<RootStackParamList>

interface MapMarker {
  id: string
  label: string
  subtitle: string
  x: number
  y: number
  href: { screen: keyof RootStackParamList; params?: { id: string } }
  tone: string
}

function project(lat: number, lng: number) {
  const bounds = { north: 51.28, south: 51.2, east: -0.5, west: -0.65 }
  const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * 100
  const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * 100
  return { x: Math.min(92, Math.max(8, x)), y: Math.min(90, Math.max(10, y)) }
}

export function MapScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<Nav>()
  const [selected, setSelected] = useState<MapMarker | null>(null)

  const markers = useMemo(() => {
    const list: MapMarker[] = []
    for (const place of placeService.getAll()) {
      const { x, y } = project(place.location.lat, place.location.lng)
      list.push({
        id: place.id,
        label: place.name,
        subtitle: `${place.type} · Place`,
        x,
        y,
        href: { screen: 'PlaceDetail', params: { id: place.id } },
        tone: place.type === 'river' ? colors.water : place.type === 'woodland' ? colors.forestLight : colors.moss,
      })
    }
    for (const tree of placeService.getNotableTrees()) {
      const { x, y } = project(tree.location.lat, tree.location.lng)
      list.push({
        id: tree.id,
        label: tree.name,
        subtitle: 'Tree · Notable',
        x: x + 2,
        y: y - 2,
        href: { screen: 'TreeDetail', params: { id: tree.id } },
        tone: colors.gold,
      })
    }
    missionService.getSuggested().slice(0, 3).forEach((m, i) => {
      list.push({
        id: m.id,
        label: m.title,
        subtitle: 'Mission',
        x: 20 + i * 25,
        y: 78,
        href: { screen: 'MissionDetail', params: { id: m.id } },
        tone: colors.sky,
      })
    })
    speciesService.getSeasonalHighlights('guildford', 4).forEach((s, i) => {
      list.push({
        id: `disc-${s.id}`,
        label: s.name,
        subtitle: 'Discovery point',
        x: 15 + i * 20,
        y: 22 + (i % 2) * 8,
        href: { screen: 'SpeciesDetail', params: { id: s.id } },
        tone: colors.leaf,
      })
    })
    return list
  }, [])

  return (
    <Screen>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: spacing.md, flex: 1, gap: 14 }}>
        <View>
          <Eyebrow>Nature map</Eyebrow>
          <Title>Guildford</Title>
          <Body style={{ marginTop: 8 }}>
            Parks, woods, waterways, notable trees and discovery points — as a schematic preview.
          </Body>
        </View>
        <DemoBanner text="Schematic map for Guildford demo data — not geographically accurate." />

        <View style={styles.mapShell}>
          <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
            <Defs>
              <SvgGradient id="land" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#e8efdf" />
                <Stop offset="100%" stopColor="#d4e0c8" />
              </SvgGradient>
            </Defs>
            <Rect width="100" height="100" fill="url(#land)" />
            <Ellipse cx="72" cy="28" rx="16" ry="12" fill="#9bb58a" opacity="0.55" />
            <Ellipse cx="30" cy="22" rx="14" ry="10" fill="#a3bc8f" opacity="0.5" />
            <Ellipse cx="78" cy="70" rx="12" ry="14" fill="#8faf6e" opacity="0.45" />
            <Ellipse cx="28" cy="18" rx="10" ry="7" fill="#c4b896" opacity="0.45" />
            <Path
              d="M 18 5 C 25 25, 35 40, 42 55 S 55 80, 48 98"
              fill="none"
              stroke={colors.water}
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.7"
            />
            <Rect x="48" y="30" width="14" height="10" rx="3" fill="#b7cfa5" opacity="0.7" />
            <Ellipse cx="45" cy="85" rx="14" ry="8" fill="#d4e4b8" opacity="0.55" />
          </Svg>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>Guildford · schematic</Text>
          </View>

          {markers.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => setSelected(m)}
              style={[
                styles.marker,
                {
                  left: `${m.x}%`,
                  top: `${m.y}%`,
                  backgroundColor: m.tone,
                  transform: [{ scale: selected?.id === m.id ? 1.25 : 1 }],
                },
              ]}
            />
          ))}

          {selected && (
            <Card style={styles.sheet}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sheetTitle}>{selected.label}</Text>
                  <Text style={styles.sheetSub}>{selected.subtitle}</Text>
                  <View style={{ marginTop: 8 }}>
                    <Pill tone="demo">Demo location</Pill>
                  </View>
                </View>
                <Pressable
                  onPress={() => {
                    if (selected.href.params) {
                      // @ts-expect-error dynamic nav
                      navigation.navigate(selected.href.screen, selected.href.params)
                    } else {
                      // @ts-expect-error dynamic nav
                      navigation.navigate(selected.href.screen)
                    }
                  }}
                >
                  <Text style={styles.link}>Tap to discover →</Text>
                </Pressable>
              </View>
            </Card>
          )}
        </View>

        <View style={styles.legendRow}>
          {[
            [colors.moss, 'Places'],
            [colors.gold, 'Notable trees'],
            [colors.leaf, 'Discoveries'],
            [colors.sky, 'Missions'],
            [colors.water, 'Waterways'],
          ].map(([c, label]) => (
            <View key={label as string} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: c as string }]} />
              <Text style={styles.legendText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  mapShell: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#dfe8d8',
    borderWidth: 1,
    borderColor: 'rgba(27,58,42,0.1)',
    minHeight: 420,
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontFamily: fonts.sansSemi,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.forest,
  },
  marker: {
    position: 'absolute',
    width: 14,
    height: 14,
    marginLeft: -7,
    marginTop: -7,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.white,
  },
  sheet: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    padding: 16,
  },
  sheetTitle: { fontFamily: fonts.display, fontSize: 18, color: colors.forest },
  sheetSub: { fontFamily: fonts.sans, fontSize: 13, color: colors.charcoalMuted, marginTop: 2 },
  link: { fontFamily: fonts.sansSemi, fontSize: 13, color: colors.moss },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 100 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 999 },
  legendText: { fontFamily: fonts.sans, fontSize: 12, color: colors.charcoalMuted },
})
