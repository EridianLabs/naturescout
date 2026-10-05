import { useMemo, useState } from 'react'
import { ScrollView, View, Text, TextInput, StyleSheet, Linking } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useProgress } from '@/hooks/useProgress'
import { progressService } from '@/services/progressService'
import { formatXp } from '@/utils/progression'
import { Body, Button, Card, Pill, Screen, Title, colors, fonts, spacing } from '@/components/ui'

/** Update after web deploy — used for App Store privacy/terms links */
const LEGAL_BASE = 'https://naturescout.co.uk'

export function ProfileScreen() {
  const insets = useSafeAreaInsets()
  const { progress, levelInfo, resetProgress, updateProfile } = useProgress()
  const stats = useMemo(() => progressService.getCollectionStats(progress), [progress])
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(progress.displayName)

  const badges = progress.badges.length
    ? progress.badges
    : progressService.getAllBadges().map((b) => ({ ...b, unlockedAt: undefined as string | undefined }))

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
          <Title>Your Explorer Profile</Title>
          <Body style={{ marginTop: 8 }}>{progress.locationLabel}</Body>
        </View>

        <Card style={{ overflow: 'hidden' }}>
          <LinearGradient colors={[colors.forest, colors.forestLight]} style={{ padding: 20 }}>
            <Text style={styles.eyebrow}>Nature Explorer</Text>
            {editing ? (
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={styles.nameInput}
                  placeholderTextColor="rgba(245,240,232,0.5)"
                />
                <Button
                  label="Save"
                  variant="secondary"
                  onPress={() => {
                    updateProfile({ displayName: name.trim() || 'Explorer' })
                    setEditing(false)
                  }}
                />
              </View>
            ) : (
              <View>
                <Text style={styles.name} onPress={() => setEditing(true)}>
                  {progress.displayName}
                </Text>
                <Text style={styles.hint}>Tap to edit name</Text>
              </View>
            )}
            <View style={[styles.rowBetween, { marginTop: 18 }]}>
              <View>
                <Text style={styles.hint}>Level {levelInfo.level}</Text>
                <Text style={styles.xp}>{formatXp(progress.xp)} XP</Text>
              </View>
              <Text style={styles.hint}>
                {levelInfo.xpIntoLevel} / {levelInfo.xpNeeded} to next
              </Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${levelInfo.progress * 100}%` }]} />
            </View>
          </LinearGradient>
        </Card>

        <View style={styles.stats}>
          {[
            ['Discoveries', stats.discovered],
            ['Missions completed', progress.completedMissionIds.length],
            ['Places explored', progress.completedPlaceIds.length],
            ['Km explored', Math.round(progress.kmExplored)],
          ].map(([label, value]) => (
            <Card key={label as string} style={styles.statCard}>
              <Text style={styles.meta}>{label}</Text>
              <Text style={styles.statValue}>{value}</Text>
            </Card>
          ))}
        </View>

        <View>
          <Title style={{ fontSize: 22, marginBottom: 12 }}>Badges</Title>
          <View style={styles.badgeGrid}>
            {badges.map((b) => {
              const unlocked = Boolean(b.unlockedAt)
              return (
                <Card key={b.id} style={[styles.badgeCard, !unlocked && { opacity: 0.45 }]}>
                  <Text style={{ fontSize: 28 }}>{b.icon}</Text>
                  <Text style={styles.badgeName}>{b.name}</Text>
                  <Text style={styles.meta}>{b.description}</Text>
                  {unlocked ? (
                    <View style={{ marginTop: 8 }}>
                      <Pill tone="forest">Unlocked</Pill>
                    </View>
                  ) : (
                    <Text style={[styles.meta, { marginTop: 8, textTransform: 'uppercase', letterSpacing: 1 }]}>
                      Locked
                    </Text>
                  )}
                </Card>
              )
            })}
          </View>
        </View>

        <Pill tone="demo">Pilot profile · progress saved on this device</Pill>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Text style={styles.link} onPress={() => Linking.openURL(`${LEGAL_BASE}/privacy`)}>
            Privacy
          </Text>
          <Text style={styles.link} onPress={() => Linking.openURL(`${LEGAL_BASE}/terms`)}>
            Terms
          </Text>
        </View>
        <Button label="Reset pilot progress" variant="secondary" onPress={resetProgress} />
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  eyebrow: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.mossLight,
  },
  name: { fontFamily: fonts.display, fontSize: 30, color: colors.cream, marginTop: 6 },
  hint: { fontFamily: fonts.sans, fontSize: 12, color: 'rgba(245,240,232,0.65)' },
  xp: { fontFamily: fonts.display, fontSize: 24, color: colors.cream },
  nameInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.cream,
    fontFamily: fonts.sans,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  track: {
    marginTop: 12,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: colors.mossLight, borderRadius: 999 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { width: '48%', padding: 14 },
  meta: { fontFamily: fonts.sans, fontSize: 11, color: colors.charcoalMuted, textAlign: 'center' },
  statValue: { fontFamily: fonts.display, fontSize: 24, color: colors.forest, marginTop: 4 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeCard: { width: '48%', padding: 14, alignItems: 'center' },
  badgeName: { fontFamily: fonts.sansSemi, fontSize: 13, color: colors.forest, marginTop: 8, textAlign: 'center' },
  link: { fontFamily: fonts.sansSemi, fontSize: 14, color: colors.moss },
})
