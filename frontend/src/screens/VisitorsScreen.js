import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HeaderBar } from '../components/common/HeaderBar';
import { RoleGuard } from '../components/common/RoleGuard';
import { useAppStore } from '../store/app.store';
import { colors } from '../utils/colors';

export function VisitorsScreen() {
  const navigation = useNavigation();
  const db = useAppStore((s) => s.db);
  const beacon = db?.beacon || {};

  return (
    <RoleGuard feature="visitors">
      <View style={styles.screen}>
        <HeaderBar
          title="Visitors"
          subtitle="Who came near your beacon"
          onSettings={() => navigation.navigate('Settings')}
        />
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.card}>
            <Text style={styles.label}>Travelers who saw you</Text>
            <Text style={styles.value}>{beacon.peersSeen || 0}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Unique connections</Text>
            <Text style={styles.value}>{beacon.uniqueConnections || 0}</Text>
          </View>
          <Text style={styles.note}>
            You only see your own shop. Travelers cannot open this screen. If nobody appears, make sure the beacon is on air.
          </Text>
        </ScrollView>
      </View>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 16, gap: 12 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { color: colors.muted, fontWeight: '700' },
  value: { color: colors.navy, fontSize: 32, fontWeight: '800', marginTop: 6 },
  note: { color: colors.muted, lineHeight: 20 },
});
