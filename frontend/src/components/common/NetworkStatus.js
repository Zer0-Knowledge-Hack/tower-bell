import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { pixelBody } from '../../utils/pixel'
import { useThemeColors } from '../../utils/useThemeColors'

export function NetworkStatus({ p2pStatus, peers }) {
  const c = useThemeColors()
  const styles = useMemo(() => makeStyles(c), [c])
  const active =
    p2pStatus === 'connected' || p2pStatus === 'scanning' || p2pStatus === 'broadcasting'
  return (
    <View style={styles.wrap}>
      <Row ok={active} label={p2pStatus === 'broadcasting' ? 'BEACON' : 'SWARM'} c={c} styles={styles} />
      <Row ok={peers > 0} label={`${peers} NEAR`} c={c} styles={styles} />
    </View>
  )
}

function Row({ ok, label, c, styles }) {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: ok ? c.success : c.rose }]} />
      <Text style={[styles.label, { color: ok ? c.sky : c.muted }]}>{label}</Text>
    </View>
  )
}

function makeStyles(c) {
  return StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 12,
      backgroundColor: c.panel,
      borderRadius: 0,
      borderWidth: 2,
      borderColor: c.border,
      paddingHorizontal: 12,
      paddingVertical: 10
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dot: { width: 8, height: 8, borderRadius: 0 },
    label: { fontSize: 16, fontFamily: pixelBody }
  })
}
