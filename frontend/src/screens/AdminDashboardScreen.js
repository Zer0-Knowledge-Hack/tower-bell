import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { HeaderBar } from '../components/common/HeaderBar'
import { RoleGuard } from '../components/common/RoleGuard'
import { Icon } from '../components/common/Icon'
import { CATEGORIES, CATEGORY_META } from '../../backend'
import { useAppStore } from '../store/app.store'
import { colors } from '../utils/colors'

export function AdminDashboardScreen() {
  const navigation = useNavigation()
  const db = useAppStore((s) => s.db)
  const registerBusiness = useAppStore((s) => s.registerBusiness)
  const deleteMerchant = useAppStore((s) => s.deleteMerchant)
  const [form, setForm] = useState({ name: '', category: 'cafeteria', message: '' })
  const [errors, setErrors] = useState({})
  const [tab, setTab] = useState('register')

  const onRegister = async () => {
    const result = await registerBusiness(form)
    setErrors(result.errors || {})
    if (result.ok) setForm({ name: '', category: 'cafeteria', message: '' })
  }

  return (
    <RoleGuard feature='admin'>
      <View style={styles.screen}>
        <HeaderBar
          title='Admin'
          subtitle='Local business registry'
          onSettings={() => navigation.navigate('Settings')}
        />
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.tabs}>
            {[
              ['register', 'Register Business'],
              ['manage', 'Manage Merchants'],
              ['peers', 'View All Peers'],
              ['logs', 'System Logs']
            ].map(([key, label]) => (
              <Pressable
                key={key}
                style={[styles.tab, tab === key && styles.tabOn]}
                onPress={() => setTab(key)}
              >
                <Text style={[styles.tabText, tab === key && { color: colors.white }]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          {tab === 'register' ? (
            <View style={{ gap: 10 }}>
              <Field
                label='Name'
                value={form.name}
                onChangeText={(v) => setForm({ ...form, name: v })}
                error={errors.name}
              />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {CATEGORIES.map((key) => (
                  <Pressable
                    key={key}
                    onPress={() => setForm({ ...form, category: key })}
                    style={[styles.tab, form.category === key && styles.tabOn]}
                  >
                    <Text
                      style={[styles.tabText, form.category === key && { color: colors.white }]}
                    >
                      {CATEGORY_META[key].label}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Field
                label='Message'
                value={form.message}
                onChangeText={(v) => setForm({ ...form, message: v })}
                error={errors.message}
              />
              <Pressable style={styles.primary} onPress={onRegister}>
                <Text style={styles.primaryText}>Register</Text>
              </Pressable>
            </View>
          ) : null}

          {tab === 'manage' ? (
            (db.registeredMerchants || []).length ? (
              db.registeredMerchants.map((item) => (
                <View key={item.id} style={styles.item}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemMeta}>
                      {item.category} · {item.message || item.promotion}
                    </Text>
                  </View>
                  <Pressable onPress={() => deleteMerchant(item.id)}>
                    <Icon name='trash' size={18} color={colors.rose} />
                  </Pressable>
                </View>
              ))
            ) : (
              <Text style={styles.empty}>No managed businesses yet.</Text>
            )
          ) : null}

          {tab === 'peers' ? (
            <Text style={styles.empty}>
              Admin Traveler scan results are not shown in this role.
            </Text>
          ) : null}

          {tab === 'logs' ? (
            (db.logs || []).length ? (
              db.logs.map((log, i) => (
                <Text key={`${log.at}-${i}`} style={styles.log}>
                  {log.at} {log.message}
                </Text>
              ))
            ) : (
              <Text style={styles.empty}>No logs yet.</Text>
            )
          ) : null}
        </ScrollView>
      </View>
    </RoleGuard>
  )
}

function Field({ label, error, ...props }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && { borderColor: colors.rose }]}
        placeholderTextColor={colors.muted}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 16, gap: 10, paddingBottom: 36 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { color: colors.text, fontWeight: '700' },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tab: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  tabOn: { backgroundColor: colors.green, borderColor: colors.green },
  tabText: { color: colors.muted, fontWeight: '800', fontSize: 11 },
  label: { color: colors.text, fontWeight: '700', fontSize: 12 },
  input: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    minHeight: 46,
    paddingHorizontal: 12,
    color: colors.text
  },
  error: { color: colors.rose, fontSize: 12 },
  primary: {
    backgroundColor: colors.green,
    borderRadius: 10,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryText: { color: colors.bg, fontWeight: '800' },
  item: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  itemName: { color: colors.text, fontWeight: '800' },
  itemMeta: { color: colors.muted, fontSize: 12 },
  empty: { color: colors.muted },
  log: { color: colors.muted, fontSize: 11, fontFamily: 'monospace' },
  denied: { padding: 24 },
  deniedText: { color: colors.rose, textAlign: 'center' }
})
