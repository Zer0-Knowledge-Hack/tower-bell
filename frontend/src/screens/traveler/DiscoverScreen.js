import { useNavigation } from '@react-navigation/native'
import { useEffect, useMemo, useState } from 'react'
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { CATEGORY_META } from '../../../backend'
import { HeaderBar } from '../../components/common/HeaderBar'
import { Icon } from '../../components/common/Icon'
import { LoadingBlock } from '../../components/common/LoadingBlock'
import { NetworkStatus } from '../../components/common/NetworkStatus'
import { PromoBanner } from '../../components/common/PromoBanner'
import { RoleGuard } from '../../components/common/RoleGuard'
import { SkeletonList } from '../../components/common/Skeleton'
import { LocalMap } from '../../components/discover/LocalMap'
import { MerchantCard } from '../../components/discover/MerchantCard'
import { MerchantDetailModal } from '../../components/discover/MerchantDetailModal'
import { RadarView } from '../../components/discover/RadarView'
import { useAppStore, visibleMerchants } from '../../store/app.store'
import { useThemeColors } from '../../utils/useThemeColors'

const PAGE = 4
const filters = [
  { id: 'All', label: 'All', icon: 'compass' },
  { id: 'cafeteria', label: 'Cafe', icon: 'coffee' },
  { id: 'restaurant', label: 'Food', icon: 'restaurant' },
  { id: 'kiosk', label: 'Kiosk', icon: 'store' },
  { id: 'pharmacy', label: 'Pharmacy', icon: 'plus' },
  { id: 'bookstore', label: 'Books', icon: 'book' }
]
const views = [
  { id: 'map', label: 'Map', icon: 'map' },
  { id: 'radar', label: 'Radar', icon: 'radar' },
  { id: 'list', label: 'List', icon: 'list' }
]
const sorts = [
  { id: 'near', label: 'Nearest' },
  { id: 'open', label: 'Open now' },
  { id: 'signal', label: 'Best signal' }
]

export function DiscoverScreen() {
  const navigation = useNavigation()
  const c = useThemeColors()
  const ready = useAppStore((s) => s.ready)
  const db = useAppStore((s) => s.db)
  const peers = useAppStore((s) => s.peers)
  const p2pStatus = useAppStore((s) => s.p2pStatus)
  const filter = useAppStore((s) => s.filter)
  const selected = useAppStore((s) => s.selectedMerchant)
  const startScan = useAppStore((s) => s.startScan)
  const setFilter = useAppStore((s) => s.setFilter)
  const setDiscoverView = useAppStore((s) => s.setDiscoverView)
  const selectMerchant = useAppStore((s) => s.selectMerchant)
  const connectPeer = useAppStore((s) => s.connectPeer)
  const saveToWallet = useAppStore((s) => s.saveToWallet)
  const [bootLoading, setBootLoading] = useState(true)
  const [sort, setSort] = useState('near')
  const [page, setPage] = useState(1)
  const [connecting, setConnecting] = useState(false)

  const view = db?.discoverView || 'map'

  useEffect(() => {
    if (ready) startScan()
  }, [ready, startScan])

  useEffect(() => {
    const t = setTimeout(() => setBootLoading(false), 900)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    setPage(1)
  }, [filter, sort])

  const merchants = useMemo(() => {
    let list = [...visibleMerchants()]
    if (sort === 'open')
      list = list.filter((m) => m.status === 'open').concat(list.filter((m) => m.status !== 'open'))
    if (sort === 'near') list.sort((a, b) => (a.distance || 999) - (b.distance || 999))
    if (sort === 'signal') list.sort((a, b) => (b.signal || 0) - (a.signal || 0))
    return list
  }, [peers, db, filter, sort])

  const visible = merchants.slice(0, page * PAGE)
  const hasMore = merchants.length > visible.length
  const scanning = p2pStatus === 'scanning'
  const live = p2pStatus !== 'idle'
  const styles = useMemo(() => makeStyles(c), [c])

  const onConnect = async (merchant) => {
    setConnecting(true)
    await connectPeer(merchant)
    setTimeout(() => setConnecting(false), 500)
  }

  return (
    <RoleGuard feature='discover'>
      <View style={styles.screen}>
        <HeaderBar
          title='SCAN'
          subtitle='Nearby beacons · no server'
          onSettings={() => navigation.navigate('Settings')}
          right={
            <View style={styles.live}>
              <View
                style={[styles.ping, { backgroundColor: live ? c.sky : 'rgba(255,255,255,0.45)' }]}
              />
              <Text style={styles.liveText}>
                {live ? 'LIVE' : 'PAUSED'} · {merchants.length}
              </Text>
            </View>
          }
        />
        <ScrollView
          contentContainerStyle={styles.body}
          refreshControl={
            <RefreshControl refreshing={scanning} onRefresh={startScan} tintColor={c.sky} />
          }
        >
          <PromoBanner
            onPressCta={() => {
              setDiscoverView('map')
              setFilter('All')
            }}
          />

          <NetworkStatus network={db?.network} p2pStatus={p2pStatus} peers={merchants.length} />

          <View style={styles.viewRow}>
            {views.map((item) => {
              const on = view === item.id
              return (
                <Pressable
                  key={item.id}
                  style={[styles.viewBtn, on && styles.viewBtnOn]}
                  onPress={() => setDiscoverView(item.id)}
                >
                  <Icon name={item.icon} size={14} color={on ? c.headerText : c.muted} />
                  <Text style={[styles.viewText, on && styles.viewTextOn]}>{item.label}</Text>
                </Pressable>
              )
            })}
          </View>

          {bootLoading ? (
            <SkeletonList count={3} />
          ) : (
            <>
              {view === 'map' ? (
                <LocalMap
                  merchants={merchants}
                  selectedId={selected?.id}
                  onSelect={selectMerchant}
                  height={320}
                />
              ) : null}
              {view === 'radar' ? (
                <RadarView merchants={merchants} onSelect={selectMerchant} />
              ) : null}

              <View style={styles.filterHead}>
                <Icon name='filter' size={14} color={c.sky} />
                <Text style={styles.filterTitle}>Filters</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filters}
              >
                {filters.map((item) => {
                  const on = filter === item.id
                  return (
                    <Pressable
                      key={item.id}
                      style={[styles.chip, on && styles.chipOn]}
                      onPress={() => setFilter(item.id)}
                    >
                      <Icon name={item.icon} size={13} color={on ? c.sky : c.muted} />
                      <Text style={[styles.chipText, on && styles.chipTextOn]}>{item.label}</Text>
                    </Pressable>
                  )
                })}
              </ScrollView>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filters}
              >
                {sorts.map((item) => {
                  const on = sort === item.id
                  return (
                    <Pressable
                      key={item.id}
                      style={[styles.sortChip, on && styles.sortChipOn]}
                      onPress={() => setSort(item.id)}
                    >
                      <Text style={[styles.sortText, on && styles.sortTextOn]}>{item.label}</Text>
                    </Pressable>
                  )
                })}
              </ScrollView>

              <View style={styles.listHead}>
                <Text style={styles.listTitle}>Places nearby</Text>
                <Text style={styles.listMeta}>
                  Showing {visible.length} of {merchants.length}
                </Text>
              </View>

              {scanning && !merchants.length ? (
                <>
                  <LoadingBlock compact label='Searching for nearby beacons...' />
                  <SkeletonList count={2} />
                </>
              ) : !merchants.length ? (
                <View style={styles.emptyBox}>
                  <Icon name='radar' size={28} color={c.sky} />
                  <Text style={styles.emptyTitle}>Nobody is broadcasting yet</Text>
                  <Text style={styles.empty}>
                    Pull down to scan again. On phone this uses Bluetooth and local network.
                  </Text>
                </View>
              ) : (
                <>
                  {visible.map((merchant) => (
                    <MerchantCard key={merchant.id} merchant={merchant} onView={selectMerchant} />
                  ))}
                  {hasMore ? (
                    <Pressable style={styles.more} onPress={() => setPage((p) => p + 1)}>
                      <Text style={styles.moreText}>Load more places</Text>
                      <Icon name='chevron-down' size={16} color={c.sky} />
                    </Pressable>
                  ) : (
                    <Text style={styles.end}>You are all caught up</Text>
                  )}
                </>
              )}
            </>
          )}
        </ScrollView>
        <MerchantDetailModal
          merchant={selected}
          connecting={connecting}
          onClose={() => selectMerchant(null)}
          onConnect={onConnect}
          onSave={saveToWallet}
        />
      </View>
    </RoleGuard>
  )
}

function makeStyles(c) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    body: { padding: 16, gap: 12, paddingBottom: 36 },
    live: { alignItems: 'flex-end' },
    ping: { width: 8, height: 8, borderRadius: 4, alignSelf: 'flex-end' },
    liveText: { color: c.headerText, fontSize: 10, fontWeight: '800', marginTop: 2 },
    viewRow: { flexDirection: 'row', gap: 8 },
    viewBtn: {
      flex: 1,
      minHeight: 42,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.panel,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6
    },
    viewBtnOn: { backgroundColor: c.header, borderColor: c.header },
    viewText: { color: c.muted, fontWeight: '800', fontSize: 12 },
    viewTextOn: { color: c.headerText },
    filterHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
    filterTitle: { color: c.muted, fontWeight: '800', fontSize: 11, letterSpacing: 0.6 },
    filters: { gap: 8 },
    chip: {
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.panel,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6
    },
    chipOn: { borderColor: c.sky, backgroundColor: c.greenDark },
    chipText: { color: c.muted, fontWeight: '700', fontSize: 12 },
    chipTextOn: { color: c.sky },
    sortChip: {
      backgroundColor: c.panelAlt,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderWidth: 1,
      borderColor: c.border
    },
    sortChipOn: { backgroundColor: c.header, borderColor: c.header },
    sortText: { color: c.muted, fontWeight: '700', fontSize: 12 },
    sortTextOn: { color: c.headerText },
    listHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    listTitle: { color: c.ink, fontWeight: '800', fontSize: 15 },
    listMeta: { color: c.muted, fontSize: 11, fontWeight: '600' },
    emptyBox: {
      backgroundColor: c.panel,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      gap: 8
    },
    emptyTitle: { color: c.navy, fontWeight: '800', textAlign: 'center' },
    empty: { color: c.muted, textAlign: 'center', lineHeight: 20 },
    more: {
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.panel,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12
    },
    moreText: { color: c.sky, fontWeight: '800' },
    end: { color: c.muted, textAlign: 'center', fontSize: 12, paddingVertical: 8 }
  })
}
