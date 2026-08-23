import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '../../utils/colors'
import { Icon } from '../common/Icon'
import { StatusBadge } from '../common/StatusBadge'

export function MerchantDetailModal({ merchant, onClose, onConnect, onSave }) {
  if (!merchant) return null
  const schedule = merchant.schedule || {}
  const peer = String(merchant.peerId || merchant.id)
  return (
    <Modal visible transparent animationType='slide' onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.head}>
            <Pressable onPress={onClose} hitSlop={8}>
              <Icon name='arrow-left' size={20} color={colors.text} />
            </Pressable>
            <View style={styles.icon}>
              <Icon name={merchant.icon || 'store'} size={18} color={colors.navy} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{merchant.name}</Text>
              <Text style={styles.meta}>
                {merchant.categoryLabel || merchant.category} · {merchant.distance} m
              </Text>
            </View>
            <StatusBadge status={merchant.status} />
          </View>

          <Text style={styles.section}>MESSAGE</Text>
          <Text style={styles.promo}>
            {merchant.message || merchant.promotion || 'No promo yet'}
          </Text>

          <Text style={styles.section}>HOURS</Text>
          <Text style={styles.line}>{merchant.hours || schedule.monFri || '—'}</Text>

          <Text style={styles.section}>PEER</Text>
          <Text style={styles.line}>
            {peer.slice(0, 6)}...{peer.slice(-4)}
          </Text>
          <View style={styles.signalRow}>
            <Text style={styles.line}>Signal</Text>
            <View style={styles.bars}>
              {[1, 2, 3, 4, 5].map((n) => (
                <View
                  key={n}
                  style={[
                    styles.bar,
                    { height: 6 + n * 3, opacity: n <= (merchant.signal || 3) ? 1 : 0.25 }
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={styles.primary}
              onPress={() => {
                onConnect(merchant)
                onClose()
              }}
            >
              <Text style={styles.primaryText}>Connect</Text>
            </Pressable>
            <Pressable
              style={styles.secondary}
              onPress={() => {
                onSave(merchant)
                onClose()
              }}
            >
              <Text style={styles.secondaryText}>Save to Wallet</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(7,21,54,0.72)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.panel,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    gap: 8
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.greenDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: { color: colors.text, fontSize: 18, fontWeight: '800' },
  meta: { color: colors.muted, fontSize: 12, marginTop: 2 },
  section: { color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 8 },
  promo: { color: colors.navy, fontSize: 15, fontWeight: '700' },
  line: { color: colors.text, fontSize: 13 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  primary: {
    flex: 1,
    backgroundColor: colors.navy,
    borderRadius: 12,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryText: { color: colors.white, fontWeight: '800' },
  secondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.navy,
    borderRadius: 12,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  secondaryText: { color: colors.navy, fontWeight: '800' },
  signalRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  bar: { width: 5, backgroundColor: colors.sky, borderRadius: 1 }
})
