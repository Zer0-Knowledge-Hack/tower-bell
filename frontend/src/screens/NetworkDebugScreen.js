import { useNavigation } from '@react-navigation/native'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { HeaderBar } from '../components/common/HeaderBar'
import { RoleGuard } from '../components/common/RoleGuard'
import { storage } from '../api/storage.service'
import { useAppStore } from '../store/app.store'
import { colors } from '../utils/colors'

export function NetworkDebugScreen() {
  const navigation = useNavigation()
  const db = useAppStore((s) => s.db)
  const p2pStatus = useAppStore((s) => s.p2pStatus)
  const peers = useAppStore((s) => s.peers)
  const setNetwork = useAppStore((s) => s.setNetwork)
  const startScan = useAppStore((s) => s.startScan)

  return (
    <RoleGuard feature='network'>
      <View style={styles.screen}>
        <HeaderBar
          title='Network'
          subtitle={`Status ${p2pStatus}`}
          onSettings={() => navigation.navigate('Settings')}
        />
        <ScrollView contentContainerStyle={styles.body}>
          <Toggle
            label='Internet'
            value={db?.network?.internet}
            onPress={() => setNetwork({ internet: !db.network.internet })}
          />
          <Toggle
            label='Local Network / mDNS'
            value={db?.network?.localNetwork}
            onPress={() => setNetwork({ localNetwork: !db.network.localNetwork })}
          />
          <Toggle
            label='Bluetooth'
            value={db?.network?.bluetooth}
            onPress={() => setNetwork({ bluetooth: !db.network.bluetooth })}
          />
          <Pressable style={styles.scan} onPress={startScan}>
            <Text style={styles.scanText}>P2P Scan</Text>
          </Pressable>
          {/* <Text style={styles.meta}>Peers in memory: {peers.length}</Text>
        <Text style={styles.json} selectable>
          {db ? storage.exportJson(db) : '{}'}
        </Text> */}
        </ScrollView>
      </View>
    </RoleGuard>
  )
}

function Toggle({ label, value, onPress }) {
  return (
    <Pressable style={styles.toggle} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.switch, value && styles.switchOn]}>
        <View style={[styles.knob, value && styles.knobOn]} />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 16, gap: 10, paddingBottom: 36 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { color: colors.text, fontWeight: '700' },
  toggle: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: { color: colors.text, fontWeight: '700' },
  switch: { width: 46, height: 28, borderRadius: 14, backgroundColor: colors.border, padding: 3 },
  switchOn: { backgroundColor: colors.green },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.text },
  knobOn: { alignSelf: 'flex-end' },
  scan: {
    backgroundColor: colors.green,
    borderRadius: 10,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scanText: { color: colors.bg, fontWeight: '800' },
  meta: { color: colors.muted },
  json: { color: colors.muted, fontSize: 11, fontFamily: 'monospace' }
})
