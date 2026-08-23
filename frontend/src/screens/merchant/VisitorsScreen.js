import { useNavigation } from '@react-navigation/native'
import { useMemo } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { HeaderBar } from '../../components/common/HeaderBar'
import { Icon } from '../../components/common/Icon'
import { RoleGuard } from '../../components/common/RoleGuard'
import { useAppStore } from '../../store/app.store'
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
          title='Visitors'
          subtitle='Who came near your beacon'
          onSettings={() => navigation.navigate('Settings')}
        />
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.card}>
            <View style={styles.iconWrap}>
              <Icon name='users' size={20} color={c.sky} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Travelers who saw you</Text>
              <Text style={styles.value}>{beacon.peersSeen || 0}</Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.iconWrap}>
              <Icon name='link' size={20} color={c.sky} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Unique connections</Text>
              <Text style={styles.value}>{beacon.uniqueConnections || 0}</Text>
            </View>
          </View>
          <Text style={styles.note}>
            You only see your own shop. Travelers cannot open this screen. If nobody appears, make
            sure the beacon is on air.
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
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: c.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14
    },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: c.greenDark,
      alignItems: 'center',
      justifyContent: 'center'
    },
    label: { color: c.muted, fontWeight: '700' },
    value: { color: c.navy, fontSize: 32, fontWeight: '800', marginTop: 4 },
    note: { color: c.muted, lineHeight: 20 }
  })
}
