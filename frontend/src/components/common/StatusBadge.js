import { StyleSheet, Text, View } from 'react-native'
import { colors, statusColor } from '../../utils/colors'

const labels = { open: 'OPEN', busy: 'BUSY', closed: 'CLOSED' }

export function StatusBadge({ status = 'open' }) {
  const color = statusColor[status] || colors.muted
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{labels[status] || String(status).toUpperCase()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  text: { fontSize: 11, fontWeight: '800', letterSpacing: 0.6 }
})
