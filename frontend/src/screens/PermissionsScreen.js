import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { BrandLogo } from '../components/common/BrandLogo'
import { HeaderBar } from '../components/common/HeaderBar'
import { Icon } from '../components/common/Icon'
import { useAppStore } from '../store/app.store'
import { colors } from '../utils/colors'
import { PEAR_NOTES, PEAR_PERMISSIONS } from '../utils/permissions'

export function PermissionsScreen() {
  const navigation = useNavigation()
  const db = useAppStore((s) => s.db)
  const setPermission = useAppStore((s) => s.setPermission)
  const grantAllPermissions = useAppStore((s) => s.grantAllPermissions)
  const completePermissions = useAppStore((s) => s.completePermissions)
  const [busy, setBusy] = useState(false)
  const granted = db?.permissions || {}
  const asGate = !db?.permissionsReady
  const count = PEAR_PERMISSIONS.filter((item) => granted[item.id]).length

  const onGrantAll = async () => {
    setBusy(true)
    await grantAllPermissions()
    setBusy(false)
  }

  return (
    <View style={styles.screen}>
      {!asGate ? <HeaderBar title='Permissions' subtitle='Requested when going native' /> : null}
      <ScrollView contentContainerStyle={styles.body}>
        {asGate ? (
          <View style={styles.hero}>
            <BrandLogo size={72} />
            <Text style={styles.heroTitle}>One more step</Text>
            <Text style={styles.heroLead}>
              Towerbell finds nearby places over Bluetooth, local network, and background mode. We
              ask for all permissions now so scanning and the beacon work.
            </Text>
          </View>
        ) : (
          <Pressable style={styles.back} onPress={() => navigation.goBack()}>
            <Icon name='arrow-left' size={16} color={colors.ink} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        )}

        <Text style={styles.meta}>
          {count}/{PEAR_PERMISSIONS.length} ready · {PEAR_NOTES.runtime} ·{' '}
          {PEAR_NOTES.transport.join(' / ')}
        </Text>

        {PEAR_PERMISSIONS.map((item) => {
          const on = !!granted[item.id]
          return (
            <Pressable
              key={item.id}
              style={[styles.card, on && styles.cardOn]}
              onPress={() => setPermission(item.id)}
            >
              <View style={styles.icon}>
                <Icon name={item.icon} size={18} color={colors.navy} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.reason}>{item.reason}</Text>
              </View>
              <View style={[styles.pill, on && styles.pillOn]}>
                <Text style={[styles.pillText, on && { color: colors.white }]}>
                  {on ? 'ON' : 'ASK'}
                </Text>
              </View>
            </Pressable>
          )
        })}

        <Pressable
          style={[styles.primary, busy && { opacity: 0.7 }]}
          onPress={onGrantAll}
          disabled={busy}
        >
          <Text style={styles.primaryText}>{busy ? 'Requesting permissions...' : 'Allow all'}</Text>
        </Pressable>

        {asGate ? (
          <Pressable style={styles.ghost} onPress={completePermissions}>
            <Text style={styles.ghostText}>Continue and ask later</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 16, gap: 10, paddingBottom: 36 },
  hero: { alignItems: 'center', gap: 8, paddingTop: 12, paddingBottom: 4 },
  heroTitle: { color: colors.ink, fontSize: 26, fontWeight: '800' },
  heroLead: { color: colors.muted, textAlign: 'center', lineHeight: 20 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { color: colors.ink, fontWeight: '700' },
  meta: { color: colors.muted, fontSize: 12 },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  cardOn: { borderColor: colors.sky },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.greenDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: { color: colors.navy, fontWeight: '800' },
  reason: { color: colors.muted, marginTop: 4, fontSize: 12, lineHeight: 17 },
  pill: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  pillOn: { backgroundColor: colors.navy, borderColor: colors.navy },
  pillText: { color: colors.muted, fontWeight: '800', fontSize: 11 },
  primary: {
    backgroundColor: colors.navy,
    borderRadius: 14,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6
  },
  primaryText: { color: colors.white, fontWeight: '800', fontSize: 16 },
  ghost: { alignItems: 'center', paddingVertical: 10 },
  ghostText: { color: colors.muted, fontWeight: '700' }
})
