import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { HeaderBar } from '../components/common/HeaderBar';
import { Icon } from '../components/common/Icon';
import { useAppStore } from '../store/app.store';
import { can, ROLE_LABELS } from '../utils/acl';
import { useThemeColors } from '../utils/useThemeColors';

const roles = ['visitor', 'merchant', 'admin'];

export function SettingsScreen() {
  const navigation = useNavigation();
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const db = useAppStore((s) => s.db);
  const setRole = useAppStore((s) => s.setRole);
  const setDarkMode = useAppStore((s) => s.setDarkMode);
  const reset = useAppStore((s) => s.reset);
  const role = db?.user?.role || 'visitor';
  const darkMode = !!db?.darkMode;

  return (
    <View style={styles.screen}>
      <HeaderBar title="Settings" subtitle={`Active identity: ${ROLE_LABELS[role]}`} showBell={false} />
      <ScrollView contentContainerStyle={styles.body}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={16} color={c.ink} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.section}>APPEARANCE</Text>
        <Pressable style={styles.nav} onPress={() => setDarkMode(!darkMode)}>
          <Icon name={darkMode ? 'moon' : 'sun'} size={18} color={c.sky} />
          <View style={{ flex: 1 }}>
            <Text style={styles.navText}>{darkMode ? 'Dark mode' : 'Light mode'}</Text>
            <Text style={styles.hint}>Tap to switch. The map theme updates too.</Text>
          </View>
          <View style={[styles.switch, darkMode && styles.switchOn]}>
            <View style={[styles.knob, darkMode && styles.knobOn]} />
          </View>
        </Pressable>

        <Text style={styles.section}>SWITCH IDENTITY</Text>
        <Text style={styles.hint}>Each role opens a different panel. Easy to demo.</Text>
        {roles.map((item) => (
          <Pressable key={item} style={[styles.row, role === item && styles.rowOn]} onPress={() => setRole(item)}>
            <Text style={[styles.rowText, role === item && { color: c.headerText }]}>{ROLE_LABELS[item]}</Text>
            {role === item ? <Icon name="check-circle" size={18} color={c.headerText} /> : null}
          </Pressable>
        ))}

        <Text style={styles.section}>SYSTEM</Text>
        <NavRow icon="bell" label="Notifications" onPress={() => navigation.navigate('Notifications')} c={c} styles={styles} />
        <NavRow icon="shield" label="Phone permissions" onPress={() => navigation.navigate('Permissions')} c={c} styles={styles} />
        {can(role, 'network') ? (
          <Text style={styles.hint}>Network and admin tools exist only in the Admin identity.</Text>
        ) : null}

        <Pressable style={styles.reset} onPress={reset}>
          <Icon name="trash" size={16} color={c.rose} />
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function NavRow({ icon, label, onPress, c, styles }) {
  return (
    <Pressable style={styles.nav} onPress={onPress}>
      <Icon name={icon} size={18} color={c.sky} />
      <Text style={styles.navText}>{label}</Text>
    </Pressable>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    body: { padding: 16, gap: 10, paddingBottom: 36 },
    back: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    backText: { color: c.ink, fontWeight: '700' },
    section: { color: c.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 8 },
    hint: { color: c.muted, fontSize: 12, lineHeight: 17 },
    row: {
      backgroundColor: c.panel,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      padding: 14,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    rowOn: { backgroundColor: c.header, borderColor: c.header },
    rowText: { color: c.ink, fontWeight: '800' },
    nav: {
      backgroundColor: c.panel,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    navText: { color: c.ink, fontWeight: '700' },
    switch: {
      width: 46,
      height: 28,
      borderRadius: 14,
      backgroundColor: c.border,
      padding: 3,
      justifyContent: 'center',
    },
    switchOn: { backgroundColor: c.sky },
    knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: c.panel },
    knobOn: { alignSelf: 'flex-end', backgroundColor: '#fff' },
    reset: {
      marginTop: 12,
      borderWidth: 1,
      borderColor: c.rose,
      borderRadius: 12,
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: c.panel,
    },
    resetText: { color: c.rose, fontWeight: '800' },
  });
}
