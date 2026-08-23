import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { colors } from '../../utils/colors'
import { pixelBody, pixelTitle } from '../../utils/pixel'
import { Icon } from '../common/Icon'
import { StatusBadge } from '../common/StatusBadge'

export function MerchantDetailModal({ merchant, onClose }) {
  if (!merchant) return null
  const schedule = merchant.schedule || {}
  const peer = String(merchant.peerId || merchant.id)
  return (
    <Modal visible transparent animationType='fade' onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.head}>
            <Pressable onPress={onClose} hitSlop={8}>
              <Icon name='arrow-left' size={20} color={colors.sky} />
            </Pressable>
            <View style={styles.icon}>
              <Icon name={merchant.icon || 'store'} size={18} color={colors.sky} />
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

          <Pressable style={styles.primary} onPress={onClose}>
            <Text style={styles.primaryText}>OK</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.82)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.panel,
    borderTopWidth: 2,
    borderColor: colors.border,
    borderRadius: 0,
    padding: 20,
    gap: 8
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.greenDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: { color: colors.text, fontSize: 22, fontFamily: pixelBody },
  meta: { color: colors.muted, fontSize: 16, marginTop: 2, fontFamily: pixelBody },
  section: {
    color: colors.sky,
    fontSize: 8,
    fontFamily: pixelTitle,
    letterSpacing: 1,
    marginTop: 8
  },
  promo: { color: colors.sky, fontSize: 18, fontFamily: pixelBody },
  line: { color: colors.text, fontSize: 16, fontFamily: pixelBody },
  primary: {
    marginTop: 12,
    backgroundColor: colors.deep,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: colors.border,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryText: { color: colors.sky, fontFamily: pixelTitle, fontSize: 10 }
})
