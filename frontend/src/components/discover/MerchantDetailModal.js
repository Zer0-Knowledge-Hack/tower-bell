import { useMemo, useState } from 'react'
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { pixelBody, pixelTitle } from '../../utils/pixel'
import { useThemeColors } from '../../utils/useThemeColors'
import { Icon } from '../common/Icon'
import { StatusBadge } from '../common/StatusBadge'

export function MerchantDetailModal({ merchant, onClose, onConnect, onSave, connecting = false }) {
  const c = useThemeColors()
  const styles = useMemo(() => makeStyles(c), [c])
  const [savedFlash, setSavedFlash] = useState(false)
  if (!merchant) return null
  const schedule = merchant.schedule || {}
  const peer = String(merchant.peerId || merchant.id)

  // Saving is instant, so the sheet holds for a beat to show it landed before
  // closing itself. Without the pause the modal just vanishes and the toast is
  // the only feedback the traveler gets.
  const handleSave = () => {
    onSave(merchant)
    setSavedFlash(true)
    setTimeout(() => {
      setSavedFlash(false)
      onClose()
    }, 700)
  }

  return (
    <Modal visible transparent animationType='fade' onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.head}>
            <Pressable onPress={onClose} hitSlop={8}>
              <Icon name='arrow-left' size={20} color={c.sky} />
            </Pressable>
            <View style={styles.icon}>
              <Icon name={merchant.icon || 'store'} size={18} color={c.sky} />
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

          <View style={styles.actions}>
            <Pressable
              style={[styles.primary, connecting && styles.primaryBusy]}
              disabled={connecting}
              onPress={() => {
                onConnect(merchant)
                onClose()
              }}
            >
              {connecting ? (
                <ActivityIndicator color={c.onAccent || c.deep} />
              ) : (
                <>
                  <Icon name='link' size={14} color={c.onAccent || c.deep} />
                  <Text style={styles.primaryText}>CONNECT P2P</Text>
                </>
              )}
            </Pressable>
            <Pressable style={styles.secondary} onPress={handleSave}>
              <Icon name='credit-card' size={14} color={c.sky} />
              <Text style={styles.secondaryText}>{savedFlash ? 'SAVED!' : 'SAVE PROMO'}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

function makeStyles(c) {
  return StyleSheet.create({
    overlay: { flex: 1, backgroundColor: c.overlay, justifyContent: 'flex-end' },
    sheet: {
      backgroundColor: c.panel,
      borderTopWidth: 2,
      borderColor: c.border,
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
      borderColor: c.border,
      backgroundColor: c.greenDark,
      alignItems: 'center',
      justifyContent: 'center'
    },
    name: { color: c.text, fontSize: 22, fontFamily: pixelBody },
    meta: { color: c.muted, fontSize: 16, marginTop: 2, fontFamily: pixelBody },
    section: {
      color: c.sky,
      fontSize: 8,
      fontFamily: pixelTitle,
      letterSpacing: 1,
      marginTop: 8
    },
    promo: { color: c.gold, fontSize: 18, fontFamily: pixelBody },
    line: { color: c.text, fontSize: 16, fontFamily: pixelBody },
    actions: { marginTop: 14, gap: 8 },
    primary: {
      backgroundColor: c.sky,
      borderRadius: 0,
      borderWidth: 2,
      borderColor: c.border,
      minHeight: 48,
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    },
    primaryBusy: { opacity: 0.7 },
    primaryText: {
      color: c.onAccent || c.deep,
      fontFamily: pixelTitle,
      fontSize: 10
    },
    secondary: {
      backgroundColor: 'transparent',
      borderRadius: 0,
      borderWidth: 2,
      borderColor: c.border,
      minHeight: 48,
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    },
    secondaryText: {
      color: c.sky,
      fontFamily: pixelTitle,
      fontSize: 10
    }
  })
}
