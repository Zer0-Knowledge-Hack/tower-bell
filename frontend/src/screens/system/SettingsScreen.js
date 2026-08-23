import { useNavigation } from '@react-navigation/native'
import { useMemo } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { HeaderBar } from '../../components/common/HeaderBar'
import { Icon } from '../../components/common/Icon'
import { useAppStore } from '../../store/app.store'
import { can, ROLE_LABELS } from '../../utils/acl'
import { pixelBody, pixelTitle } from '../../utils/pixel'
import { useThemeColors } from '../../utils/useThemeColors'

const roles = ['visitor', 'merchant', 'admin']

export function SettingsScreen() {
  const navigation = useNavigation()
  const c = useThemeColors()
  const styles = useMemo(() => makeStyles(c), [c])
  const db = useAppStore((s) => s.db)
  const setRole = useAppStore((s) => s.setRole)
  const setDarkMode = useAppStore((s) => s.setDarkMode)
  const reset = useAppStore((s) => s.reset)
  const role = db?.user?.role || 'visitor'
  const darkMode = db?.darkMode !== false

  return (
    <View style={styles.screen}>
      <HeaderBar title='SETTINGS' subtitle={`Active: ${ROLE_LABELS[role]}`} showBell={false} />
      <ScrollView contentContainerStyle={styles.body}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Icon name='arrow-left' size={16} color={c.ink} />
          <Text style={styles.backText}>BACK</Text>
        </Pressable>

        <Text style={styles.section}>APPEARANCE</Text>
        <Pressable style={styles.nav} onPress={() => setDarkMode(!darkMode)}>
          <Icon name={darkMode ? 'moon' : 'sun'} size={18} color={c.sky} />
          <View style={{ flex: 1 }}>
            <Text style={styles.navText}>{darkMode ? 'DARK MODE' : 'LIGHT MODE'}</Text>
            <Text style={styles.hint}>Tap to switch palette. Map tiles follow too.</Text>
          </View>
          <View style={[styles.switch, darkMode && styles.switchOn]}>
            <View style={[styles.knob, darkMode && styles.knobOn]} />
          </View>
        </Pressable>

        <Text style={styles.section}>SWITCH IDENTITY</Text>
        <Text style={styles.hint}>Each role opens a different panel. Easy to demo.</Text>
        {roles.map((item) => (
          <Pressable
            key={item}
            style={[styles.row, role === item && styles.rowOn]}
            onPress={() => setRole(item)}
          >
            <Text style={[styles.rowText, role === item && styles.rowTextOn]}>
              {ROLE_LABELS[item].toUpperCase()}
            </Text>
            {role === item ? <Icon name='check-circle' size={18} color={c.sky} /> : null}
          </Pressable>
        ))}

        <Text style={styles.section}>SYSTEM</Text>
        <NavRow
          icon='compass'
          label='About / pitch for judges'
          onPress={() => navigation.navigate('About')}
          c={c}
          styles={styles}
        />
        <NavRow
          icon='bell'
          label='Notifications'
          onPress={() => navigation.navigate('Notifications')}
          c={c}
          styles={styles}
        />
        <NavRow
          icon='shield'
          label='Phone permissions'
          onPress={() => navigation.navigate('Permissions')}
          c={c}
          styles={styles}
        />
        {can(role, 'network') ? (
          <Text style={styles.hint}>Network and admin tools exist only in the Admin identity.</Text>
        ) : null}

        <Pressable style={styles.reset} onPress={reset}>
          <Icon name='trash' size={16} color={c.rose} />
          <Text style={styles.resetText}>RESET</Text>
        </Pressable>
      </ScrollView>
    </View>
  )
}

function NavRow({ icon, label, onPress, c, styles }) {
  return (
    <Pressable style={styles.nav} onPress={onPress}>
      <Icon name={icon} size={18} color={c.sky} />
      <Text style={styles.navText}>{label.toUpperCase()}</Text>
    </Pressable>
  )
}

function makeStyles(c) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    body: { padding: 16, gap: 10, paddingBottom: 36 },
    back: { flexDirection: 'row', alignItems: 'center', gap: 8, cursor: 'pointer' },
    backText: { color: c.ink, fontFamily: pixelTitle, fontSize: 9, letterSpacing: 1 },
    section: {
      color: c.gold,
      fontSize: 9,
      fontFamily: pixelTitle,
      letterSpacing: 1,
      marginTop: 8
    },
    hint: { color: c.muted, fontSize: 16, lineHeight: 20, fontFamily: pixelBody },
    row: {
      backgroundColor: c.panel,
      borderWidth: 2,
      borderColor: c.border,
      borderRadius: 0,
      padding: 14,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer'
    },
    rowOn: {
      backgroundColor: c.highlight,
      borderColor: c.highlightBorder || c.sky
    },
    rowText: { color: c.ink, fontFamily: pixelTitle, fontSize: 9 },
    rowTextOn: { color: c.sky },
    nav: {
      backgroundColor: c.panel,
      borderWidth: 2,
      borderColor: c.border,
      borderRadius: 0,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer'
    },
    navText: { color: c.ink, fontFamily: pixelTitle, fontSize: 8, letterSpacing: 0.4, flex: 1 },
    switch: {
      width: 44,
      height: 24,
      borderRadius: 0,
      borderWidth: 2,
      borderColor: c.border,
      backgroundColor: c.panelAlt,
      padding: 2,
      justifyContent: 'center'
    },
    switchOn: { backgroundColor: c.sky, borderColor: c.sky },
    knob: {
      width: 16,
      height: 16,
      borderRadius: 0,
      backgroundColor: c.muted
    },
    knobOn: { alignSelf: 'flex-end', backgroundColor: c.onAccent || c.deep },
    reset: {
      marginTop: 12,
      borderWidth: 2,
      borderColor: c.rose,
      borderRadius: 0,
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: c.panel,
      cursor: 'pointer'
    },
    resetText: { color: c.rose, fontFamily: pixelTitle, fontSize: 9, letterSpacing: 1 }
  })
}
