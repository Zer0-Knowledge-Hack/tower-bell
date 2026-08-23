import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useThemeColors } from '../../utils/useThemeColors'

export function NetworkStatus({ network, p2pStatus, peers }) {
  const c = useThemeColors()
  const styles = useMemo(() => makeStyles(c), [c])
  const active =
    p2pStatus === 'connected' || p2pStatus === 'scanning' || p2pStatus === 'broadcasting'
  return (
    <View style={styles.wrap}>
      <Row ok={network?.internet} label='Internet' c={c} styles={styles} />
      <Row ok={network?.localNetwork} label='Local net' c={c} styles={styles} />
      <Row ok={network?.bluetooth} label='Bluetooth' c={c} styles={styles} />
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: active ? c.success : c.rose }]} />
        <Text style={[styles.label, { color: active ? c.success : c.muted }]}>
          {p2pStatus === 'broadcasting' ? 'Broadcasting' : active ? 'P2P' : 'Paused'} · {peers}
        </Text>
      </View>
    </View>
  )
}

function Row({ ok, label, c, styles }) {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: ok ? c.success : c.rose }]} />
      <Text style={[styles.label, { color: ok ? c.ink : c.muted }]}>{label}</Text>
    </View>
  )
}

function makeStyles(c) {
  return StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 10,
      backgroundColor: c.panel,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 12,
      paddingVertical: 10
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    dot: { width: 7, height: 7, borderRadius: 4 },
    label: { fontSize: 11, fontWeight: '700' }
  })
}
