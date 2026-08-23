import { useNavigation } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CATEGORY_META } from '../../backend';
import { HeaderBar } from '../components/common/HeaderBar';
import { Icon } from '../components/common/Icon';
import { LoadingBlock } from '../components/common/LoadingBlock';
import { NetworkStatus } from '../components/common/NetworkStatus';
import { RoleGuard } from '../components/common/RoleGuard';
import { LocalMap } from '../components/discover/LocalMap';
import { MerchantCard } from '../components/discover/MerchantCard';
import { MerchantDetailModal } from '../components/discover/MerchantDetailModal';
import { RadarView } from '../components/discover/RadarView';
import { useAppStore, visibleMerchants } from '../store/app.store';
import { useThemeColors } from '../utils/useThemeColors';

const filters = ['All', 'cafeteria', 'restaurant', 'kiosk', 'pharmacy', 'bookstore'];
const views = [
  { id: 'map', label: 'Map', icon: 'map' },
  { id: 'radar', label: 'Radar', icon: 'radar' },
  { id: 'list', label: 'List', icon: 'list' },
];

export function DiscoverScreen() {
  const navigation = useNavigation();
  const c = useThemeColors();
  const ready = useAppStore((s) => s.ready);
  const db = useAppStore((s) => s.db);
  const peers = useAppStore((s) => s.peers);
  const p2pStatus = useAppStore((s) => s.p2pStatus);
  const filter = useAppStore((s) => s.filter);
  const selected = useAppStore((s) => s.selectedMerchant);
  const startScan = useAppStore((s) => s.startScan);
  const setFilter = useAppStore((s) => s.setFilter);
  const setDiscoverView = useAppStore((s) => s.setDiscoverView);
  const selectMerchant = useAppStore((s) => s.selectMerchant);
  const connectPeer = useAppStore((s) => s.connectPeer);
  const saveToWallet = useAppStore((s) => s.saveToWallet);
  const [bootLoading, setBootLoading] = useState(true);

  const view = db?.discoverView || 'map';

  useEffect(() => {
    if (ready) startScan();
  }, [ready, startScan]);

  useEffect(() => {
    const t = setTimeout(() => setBootLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const merchants = useMemo(() => visibleMerchants(), [peers, db, filter]);
  const scanning = p2pStatus === 'scanning';
  const live = p2pStatus !== 'idle';
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <RoleGuard feature="discover">
      <View style={styles.screen}>
        <HeaderBar
          title="Nearby"
          subtitle="Free local map · no Google Maps"
          onSettings={() => navigation.navigate('Settings')}
          right={
            <View style={styles.live}>
              <View style={[styles.ping, { backgroundColor: live ? c.sky : 'rgba(255,255,255,0.45)' }]} />
              <Text style={styles.liveText}>
                {live ? 'LIVE' : 'PAUSED'} · {merchants.length}
              </Text>
            </View>
          }
        />
        <ScrollView
          contentContainerStyle={styles.body}
          refreshControl={<RefreshControl refreshing={scanning} onRefresh={startScan} tintColor={c.sky} />}
        >
          <NetworkStatus network={db?.network} p2pStatus={p2pStatus} peers={merchants.length} />

          <View style={styles.viewRow}>
            {views.map((item) => {
              const on = view === item.id;
              return (
                <Pressable
                  key={item.id}
                  style={[styles.viewBtn, on && styles.viewBtnOn]}
                  onPress={() => setDiscoverView(item.id)}
                >
                  <Icon name={item.icon} size={14} color={on ? c.headerText : c.muted} />
                  <Text style={[styles.viewText, on && styles.viewTextOn]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {bootLoading ? (
            <LoadingBlock label="Preparing local discovery..." />
          ) : (
            <>
              {view === 'map' ? (
                <LocalMap merchants={merchants} selectedId={selected?.id} onSelect={selectMerchant} height={340} />
              ) : null}
              {view === 'radar' ? <RadarView merchants={merchants} onSelect={selectMerchant} /> : null}

              <Text style={styles.hint}>
                {view === 'map'
                  ? ' Tap a pin to open the place.'
                  : 'Tap a point or a card to see the message.'}
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
                {filters.map((item) => (
                  <Pressable
                    key={item}
                    style={[styles.chip, filter === item && styles.chipOn]}
                    onPress={() => setFilter(item)}
                  >
                    <Text style={[styles.chipText, filter === item && styles.chipTextOn]}>
                      {item === 'All' ? 'All' : CATEGORY_META[item]?.label || item}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              {scanning && !merchants.length ? (
                <LoadingBlock compact label="Searching for nearby beacons..." />
              ) : !merchants.length ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyTitle}>Nobody is broadcasting yet</Text>
                  <Text style={styles.empty}>
                    Pull down to scan again. On phone this uses Bluetooth and local network.
                  </Text>
                </View>
              ) : (
                merchants.map((merchant) => (
                  <MerchantCard key={merchant.id} merchant={merchant} onView={selectMerchant} />
                ))
              )}
            </>
          )}
        </ScrollView>
        <MerchantDetailModal
          merchant={selected}
          onClose={() => selectMerchant(null)}
          onConnect={connectPeer}
          onSave={saveToWallet}
        />
      </View>
    </RoleGuard>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    body: { padding: 16, gap: 12, paddingBottom: 32 },
    live: { alignItems: 'flex-end' },
    ping: { width: 8, height: 8, borderRadius: 4, alignSelf: 'flex-end' },
    liveText: { color: c.headerText, fontSize: 10, fontWeight: '800', marginTop: 2 },
    viewRow: { flexDirection: 'row', gap: 8 },
    viewBtn: {
      flex: 1,
      minHeight: 40,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.panel,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    viewBtnOn: { backgroundColor: c.header, borderColor: c.header },
    viewText: { color: c.muted, fontWeight: '800', fontSize: 12 },
    viewTextOn: { color: c.headerText },
    hint: { color: c.muted, fontSize: 12, lineHeight: 17 },
    filters: { gap: 8 },
    chip: {
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.panel,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    chipOn: { borderColor: c.sky, backgroundColor: c.greenDark },
    chipText: { color: c.muted, fontWeight: '700', fontSize: 12 },
    chipTextOn: { color: c.sky },
    emptyBox: {
      backgroundColor: c.panel,
      borderRadius: 14,
      padding: 18,
      borderWidth: 1,
      borderColor: c.border,
    },
    emptyTitle: { color: c.navy, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
    empty: { color: c.muted, textAlign: 'center', lineHeight: 20 },
  });
}
