import { useNavigation } from '@react-navigation/native'
import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { CATEGORIES, CATEGORY_META } from '../../../backend'
import { HeaderBar } from '../../components/common/HeaderBar'
import { Icon } from '../../components/common/Icon'
import { RoleGuard } from '../../components/common/RoleGuard'
import { useAppStore } from '../../store/app.store'
import { pixelBody, pixelTitle } from '../../utils/pixel'
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
          title='BEACON'
          subtitle='What travelers receive nearby'
          onSettings={() => navigation.navigate('Settings')}
          right={<Text style={styles.air}>{beacon.broadcasting ? 'ON AIR' : 'IDLE'}</Text>}
        />
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps='handled'>
          <View style={[styles.card, beacon.broadcasting && styles.cardOn]}>
            <View style={styles.row}>
              <View style={styles.pulse}>
                <Icon name='signal' size={22} color={beacon.broadcasting ? c.success : c.muted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{beacon.name}</Text>
                <Text style={styles.meta}>{beacon.category}</Text>
              </View>
            </View>
            <Text style={styles.promo}>{beacon.message}</Text>
            <Text style={styles.help}>
              {beacon.broadcasting
                ? 'Your record is on the swarm. Nearby scanners can copy it.'
                : 'Start broadcasting to publish name, category and promo over scan().'}
            </Text>
            <Pressable
              style={[styles.toggle, beacon.broadcasting && styles.toggleStop]}
              onPress={onToggle}
            >
              <Text style={[styles.toggleText, beacon.broadcasting && { color: c.rose }]}>
                {beacon.broadcasting ? 'STOP BEACON' : 'START BEACON'}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.section}>RECORD</Text>
          <Field
            styles={styles}
            c={c}
            label='Name'
            value={data.name}
            onChangeText={(v) => patch('name', v)}
            error={errors.name}
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
            styles={styles}
            c={c}
            label='Message'
            value={data.message}
            onChangeText={(v) => patch('message', v)}
            error={errors.message}
          />
          <Field
            styles={styles}
            c={c}
            label='Hours HH:MM-HH:MM'
            value={data.hours}
            onChangeText={(v) => patch('hours', v)}
            error={errors.hours}
          />
          <Pressable style={styles.save} onPress={onSave}>
            <Icon name='edit' size={16} color={c.sky} />
            <Text style={styles.saveText}>SAVE RECORD</Text>
          </Pressable>

          <Text style={styles.section}>HITS</Text>
          <View style={styles.stats}>
            <Stat styles={styles} label='Seen' value={beacon.peersSeen || 0} />
            <Stat styles={styles} label='Links' value={beacon.uniqueConnections || 0} />
          </View>
        </ScrollView>
      </View>
    </RoleGuard>
  )
}

function Field({ styles, c, label, error, ...props }) {
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

function Stat({ styles, label, value }) {
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
    air: { color: c.sky, fontFamily: pixelTitle, fontSize: 8 },
    card: {
      backgroundColor: c.panel,
      borderWidth: 2,
      borderColor: c.border,
      borderRadius: 0,
      padding: 14,
      gap: 12
    },
    cardOn: { borderColor: c.success },
    row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    pulse: {
      width: 48,
      height: 48,
      borderRadius: 0,
      borderWidth: 2,
      borderColor: c.border,
      backgroundColor: c.greenDark,
      alignItems: 'center',
      justifyContent: 'center'
    },
    name: { color: c.text, fontSize: 22, fontFamily: pixelBody },
    meta: { color: c.muted, fontFamily: pixelBody, fontSize: 16 },
    promo: { color: c.sky, fontFamily: pixelBody, fontSize: 18 },
    help: { color: c.muted, fontSize: 16, lineHeight: 20, fontFamily: pixelBody },
    toggle: {
      borderWidth: 2,
      borderColor: c.success,
      borderRadius: 0,
      minHeight: 46,
      alignItems: 'center',
      justifyContent: 'center'
    },
    toggleStop: { borderColor: c.rose },
    toggleText: { color: c.success, fontFamily: pixelTitle, fontSize: 9 },
    section: {
      color: c.sky,
      fontSize: 8,
      fontFamily: pixelTitle,
      letterSpacing: 1,
      marginTop: 4
    },
    label: { color: c.text, fontSize: 16, fontFamily: pixelBody },
    input: {
      backgroundColor: c.panel,
      borderWidth: 2,
      borderColor: c.border,
      borderRadius: 0,
      minHeight: 46,
      paddingHorizontal: 12,
      color: c.text,
      fontFamily: pixelBody,
      fontSize: 18
    },
    inputErr: { borderColor: c.rose },
    error: { color: c.rose, fontSize: 14, fontFamily: pixelBody },
    save: {
      backgroundColor: c.deep,
      borderRadius: 0,
      borderWidth: 2,
      borderColor: c.border,
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    },
    saveText: { color: c.sky, fontFamily: pixelTitle, fontSize: 9 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      backgroundColor: c.panel,
      borderWidth: 2,
      borderColor: c.border,
      borderRadius: 0,
      paddingHorizontal: 10,
      paddingVertical: 8
    },
    chipOn: { backgroundColor: c.greenDark, borderColor: c.sky },
    chipText: { color: c.ink, fontFamily: pixelBody, fontSize: 16 },
    chipTextOn: { color: c.sky },
    stats: { flexDirection: 'row', gap: 10 },
    stat: {
      flex: 1,
      backgroundColor: c.panel,
      borderWidth: 2,
      borderColor: c.border,
      borderRadius: 0,
      padding: 14
    },
    statVal: { color: c.sky, fontSize: 28, fontFamily: pixelBody },
    statLabel: { color: c.muted, marginTop: 4, fontFamily: pixelBody }
  })
}
