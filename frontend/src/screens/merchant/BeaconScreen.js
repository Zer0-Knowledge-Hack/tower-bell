import { useNavigation } from '@react-navigation/native'
import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { HeaderBar } from '../../components/common/HeaderBar'
import { RoleGuard } from '../../components/common/RoleGuard'
import { Icon } from '../../components/common/Icon'
import { CATEGORIES, CATEGORY_META } from '../../../backend'
import { useAppStore } from '../../store/app.store'
import { useThemeColors } from '../../utils/useThemeColors'

export function BeaconScreen() {
  const navigation = useNavigation()
  const c = useThemeColors()
  const styles = useMemo(() => makeStyles(c), [c])
  const db = useAppStore((s) => s.db)
  const saveBeacon = useAppStore((s) => s.saveBeacon)
  const setBroadcasting = useAppStore((s) => s.setBroadcasting)
  const beacon = db?.beacon || {}
  const [form, setForm] = useState(null)
  const [errors, setErrors] = useState({})
  const data = form || {
    name: beacon.name || '',
    category: beacon.category || 'kiosk',
    status: beacon.status || 'open',
    message: beacon.message || '',
    hours: beacon.hours || ''
  }

  const patch = (key, value) => {
    setForm({ ...data, [key]: value })
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const onSave = async () => {
    const result = await saveBeacon(data)
    setErrors(result.errors || {})
    if (result.ok) setForm(null)
  }

  const onToggle = async () => {
    const result = await setBroadcasting(!beacon.broadcasting)
    if (!result.ok) {
      setForm(data)
      setErrors(result.errors || {})
    }
  }

  return (
    <RoleGuard feature='beacon'>
      <View style={styles.screen}>
        <HeaderBar
          title='My shop'
          subtitle='How nearby travelers see you'
          onSettings={() => navigation.navigate('Settings')}
          right={
            <Text style={styles.airBadge}>{beacon.broadcasting ? 'ON AIR' : 'PAUSED'}</Text>
          }
        />
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps='handled'>
          <View style={[styles.card, beacon.broadcasting && styles.cardOn]}>
            <View style={styles.row}>
              <View style={styles.pulse}>
                <Icon
                  name='signal'
                  size={22}
                  color={beacon.broadcasting ? c.sky : c.muted}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{beacon.name}</Text>
                <Text style={styles.meta}>{beacon.category}</Text>
              </View>
            </View>
            <Text style={styles.promo}>{beacon.message}</Text>
            <Text style={styles.help}>
              {beacon.broadcasting
                ? 'Nearby travelers can already see you. Keep the phone unlocked or allow background mode.'
                : 'When you start, your name, category, and message are shared with anyone scanning nearby.'}
            </Text>
            <Pressable
              style={[styles.toggle, beacon.broadcasting && styles.toggleStop]}
              onPress={onToggle}
            >
              <Icon
                name={beacon.broadcasting ? 'x' : 'signal'}
                size={16}
                color={beacon.broadcasting ? c.rose : c.sky}
              />
              <Text style={[styles.toggleText, beacon.broadcasting && { color: c.rose }]}>
                {beacon.broadcasting ? 'Stop broadcasting' : 'Start broadcasting'}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.section}>DETAILS SHOWN NEARBY</Text>
          <Field
            label='Name'
            value={data.name}
            onChangeText={(v) => patch('name', v)}
            error={errors.name}
            c={c}
            styles={styles}
          />
          <Text style={styles.label}>Category</Text>
          <View style={styles.chips}>
            {CATEGORIES.map((key) => (
              <Pressable
                key={key}
                style={[styles.chip, data.category === key && styles.chipOn]}
                onPress={() => patch('category', key)}
              >
                <Text style={[styles.chipText, data.category === key && styles.chipTextOn]}>
                  {CATEGORY_META[key].label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.label}>Status</Text>
          <View style={styles.chips}>
            {['open', 'closed'].map((status) => (
              <Pressable
                key={status}
                style={[styles.chip, data.status === status && styles.chipOn]}
                onPress={() => patch('status', status)}
              >
                <Text style={[styles.chipText, data.status === status && styles.chipTextOn]}>
                  {status}
                </Text>
              </Pressable>
            ))}
          </View>
          <Field
            label='Message'
            value={data.message}
            onChangeText={(v) => patch('message', v)}
            error={errors.message}
            c={c}
            styles={styles}
          />
          <Field
            label='Hours HH:MM-HH:MM'
            value={data.hours}
            onChangeText={(v) => patch('hours', v)}
            error={errors.hours}
            c={c}
            styles={styles}
          />
          <Pressable style={styles.save} onPress={onSave}>
            <Icon name='edit' size={16} color={c.headerText} />
            <Text style={styles.saveText}>Save changes</Text>
          </Pressable>

          <Text style={styles.section}>TODAY</Text>
          <View style={styles.stats}>
            <Stat label='Peers today' value={beacon.peersSeen || 0} styles={styles} />
            <Stat label='Connections' value={beacon.uniqueConnections || 0} styles={styles} />
          </View>
        </ScrollView>
      </View>
    </RoleGuard>
  )
}

function Field({ label, error, c, styles, ...props }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputErr]}
        placeholderTextColor={c.muted}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

function Stat({ label, value, styles }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statVal}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

function makeStyles(c) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    body: { padding: 16, gap: 12, paddingBottom: 36 },
    airBadge: { color: c.headerText, fontWeight: '800', fontSize: 11 },
    card: {
      backgroundColor: c.panel,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      padding: 14,
      gap: 12
    },
    cardOn: { borderColor: c.sky },
    row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    pulse: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: c.greenDark,
      alignItems: 'center',
      justifyContent: 'center'
    },
    name: { color: c.text, fontSize: 18, fontWeight: '800' },
    meta: { color: c.muted },
    promo: { color: c.navy, fontWeight: '600' },
    help: { color: c.muted, fontSize: 13, lineHeight: 18 },
    toggle: {
      borderWidth: 1,
      borderColor: c.sky,
      borderRadius: 10,
      minHeight: 46,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    },
    toggleStop: { borderColor: c.rose },
    toggleText: { color: c.sky, fontWeight: '800' },
    section: { color: c.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 4 },
    label: { color: c.text, fontSize: 12, fontWeight: '700' },
    input: {
      backgroundColor: c.panel,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 10,
      minHeight: 46,
      paddingHorizontal: 12,
      color: c.text
    },
    inputErr: { borderColor: c.rose },
    error: { color: c.rose, fontSize: 12 },
    save: {
      backgroundColor: c.header,
      borderRadius: 10,
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    },
    saveText: { color: c.headerText, fontWeight: '800' },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      backgroundColor: c.panelAlt,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 8
    },
    chipOn: { backgroundColor: c.header, borderColor: c.header },
    chipText: { color: c.ink, fontWeight: '700', fontSize: 12 },
    chipTextOn: { color: c.headerText },
    stats: { flexDirection: 'row', gap: 10 },
    stat: {
      flex: 1,
      backgroundColor: c.panel,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      padding: 14
    },
    statVal: { color: c.sky, fontSize: 24, fontWeight: '800' },
    statLabel: { color: c.muted, marginTop: 4 }
  })
}
