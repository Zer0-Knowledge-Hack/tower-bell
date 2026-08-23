import { StyleSheet, Text, View } from 'react-native'
import { colors, statusColor } from '../../utils/colors'
import { pixelTitle } from '../../utils/pixel'

const labels = { open: 'OPEN', busy: 'BUSY', closed: 'CLOSED' }

export function StatusBadge({ status = 'open' }) {
  const color = statusColor[status] || colors.muted
  return (
    <View style={[styles.row, { borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{labels[status] || String(status).toUpperCase()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 0,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  text: { fontSize: 8, fontFamily: pixelTitle, letterSpacing: 0.6 }
})
