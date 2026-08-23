import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useThemeColors } from '../../utils/useThemeColors'

export function LoadingBlock({ label = 'Loading...', compact = false }) {
  const c = useThemeColors()
  return (
    <View
      style={[
        styles.wrap,
        compact && styles.compact,
        { backgroundColor: c.panel, borderColor: c.border }
      ]}
    >
      <ActivityIndicator color={c.sky} size={compact ? 'small' : 'large'} />
      <Text style={[styles.label, { color: c.muted }]}>{label}</Text>
    </View>
  )
}

export function FullScreenLoader({
  title = 'Towerbell',
  subtitle = 'Preparing your local map...'
}) {
  const c = useThemeColors()
  return (
    <View style={[styles.full, { backgroundColor: c.deep }]}>
      <ActivityIndicator color={c.sky} size='large' />
      <Text style={[styles.title, { color: c.headerText }]}>{title}</Text>
      <Text style={[styles.sub, { color: 'rgba(255,255,255,0.7)' }]}>{subtitle}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 140
  },
  compact: { minHeight: 72, paddingVertical: 14 },
  label: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  full: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  title: { fontSize: 22, fontWeight: '800', marginTop: 8 },
  sub: { fontSize: 13 }
})
