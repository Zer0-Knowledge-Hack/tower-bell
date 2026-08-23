import { useNavigation } from '@react-navigation/native'
import { useMemo } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { HeaderBar } from '../../components/common/HeaderBar'
import { RoleGuard } from '../../components/common/RoleGuard'
import { useAppStore } from '../../store/app.store'
import { pixelBody } from '../../utils/pixel'
import { useThemeColors } from '../../utils/useThemeColors'

export function VisitorsScreen() {
  const navigation = useNavigation()
  const c = useThemeColors()
  const styles = useMemo(() => makeStyles(c), [c])
  const db = useAppStore((s) => s.db)
  const beacon = db?.beacon || {}

  return (
    <RoleGuard feature='visitors'>
      <View style={styles.screen}>
        <HeaderBar
          title='HITS'
          subtitle='Scanners that reached your beacon'
          onSettings={() => navigation.navigate('Settings')}
        />
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.card}>
            <Text style={styles.label}>Travelers who saw you</Text>
            <Text style={styles.value}>{beacon.peersSeen || 0}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Unique links</Text>
            <Text style={styles.value}>{beacon.uniqueConnections || 0}</Text>
          </View>
          <Text style={styles.note}>
            This is the visitor event from the nucleus. Keep the beacon on air so scanners can copy
            your record.
          </Text>
        </ScrollView>
      </View>
    </RoleGuard>
  )
}

function makeStyles(c) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    body: { padding: 16, gap: 12 },
    card: {
      backgroundColor: c.panel,
      borderRadius: 0,
      padding: 16,
      borderWidth: 2,
      borderColor: c.border
    },
    label: { color: c.muted, fontFamily: pixelBody, fontSize: 16 },
    value: { color: c.sky, fontSize: 36, fontFamily: pixelBody, marginTop: 6 },
    note: { color: c.muted, lineHeight: 22, fontFamily: pixelBody, fontSize: 16 }
  })
}
