import { StyleSheet, Text, View } from 'react-native'
import { useAppStore } from '../../store/app.store'
import { can } from '../../utils/acl'
import { colors } from '../../utils/colors'

export function RoleGuard({ feature, children }) {
  const role = useAppStore((s) => s.db?.user?.role || 'visitor')
  if (!can(role, feature)) {
    return (
      <View style={styles.box}>
        <Text style={styles.title}>No access</Text>
        <Text style={styles.text}>
          This screen belongs to another role. Each identity only sees its own panel.
        </Text>
      </View>
    )
  }
  return children
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  title: { color: colors.navy, fontWeight: '800', fontSize: 18 },
  text: { color: colors.muted, textAlign: 'center', marginTop: 8, lineHeight: 20 }
})
