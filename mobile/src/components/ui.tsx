import type { ReactNode } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
} from 'react-native'
import { colors, fonts, radii, spacing } from '@/theme'

export function Screen({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.screen, style]}>{children}</View>
}

export function Card({
  children,
  style,
  onPress,
}: {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  onPress?: () => void
}) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.card, style, pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] }]}>
        {children}
      </Pressable>
    )
  }
  return <View style={[styles.card, style]}>{children}</View>
}

export function Eyebrow({ children, color = colors.moss }: { children: ReactNode; color?: string }) {
  return <Text style={[styles.eyebrow, { color }]}>{children}</Text>
}

export function Title({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.title, style]}>{children}</Text>
}

export function Body({
  children,
  style,
  numberOfLines,
}: {
  children: ReactNode
  style?: StyleProp<TextStyle>
  numberOfLines?: number
}) {
  return (
    <Text style={[styles.body, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  )
}

export function Pill({
  children,
  tone = 'default',
}: {
  children: ReactNode
  tone?: 'default' | 'gold' | 'forest' | 'demo'
}) {
  const tones = {
    default: { bg: colors.creamDark, fg: colors.charcoalMuted },
    gold: { bg: 'rgba(196,132,58,0.15)', fg: colors.gold },
    forest: { bg: 'rgba(27,58,42,0.1)', fg: colors.forest },
    demo: { bg: 'rgba(139,134,128,0.2)', fg: colors.charcoalMuted },
  }
  const t = tones[tone]
  return (
    <View style={[styles.pill, { backgroundColor: t.bg }]}>
      <Text style={[styles.pillText, { color: t.fg }]}>{children}</Text>
    </View>
  )
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
}: {
  label: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
}) {
  const variants = {
    primary: { bg: colors.forest, fg: colors.cream, border: colors.forest },
    secondary: { bg: colors.white, fg: colors.forest, border: 'rgba(27,58,42,0.15)' },
    ghost: { bg: 'transparent', fg: colors.forest, border: 'transparent' },
  }
  const v = variants[variant]
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
        },
      ]}
    >
      <Text style={[styles.buttonText, { color: v.fg }]}>{label}</Text>
    </Pressable>
  )
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, value * 100))}%` }]} />
    </View>
  )
}

export function DemoBanner({ text = 'Demo / schematic data — not verified field records' }: { text?: string }) {
  return (
    <View style={styles.demo}>
      <Text style={styles.demoText}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(27,58,42,0.05)',
    shadowColor: colors.forest,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  eyebrow: {
    fontFamily: fonts.sansSemi,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.forest,
    letterSpacing: -0.5,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.charcoalMuted,
  },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radii.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
  },
  button: {
    borderRadius: radii.full,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fonts.sansSemi,
    fontSize: 14,
  },
  track: {
    height: 8,
    borderRadius: radii.full,
    backgroundColor: colors.creamDark,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.full,
    backgroundColor: colors.moss,
  },
  demo: {
    backgroundColor: 'rgba(139,134,128,0.15)',
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  demoText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.charcoalMuted,
  },
})

export { colors, fonts, spacing, radii }
