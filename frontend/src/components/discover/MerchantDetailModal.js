import { useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../utils/useThemeColors';
import { Icon } from '../common/Icon';
import { StatusBadge } from '../common/StatusBadge';

export function MerchantDetailModal({ merchant, onClose, onConnect, onSave, connecting = false }) {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const [savedFlash, setSavedFlash] = useState(false);
  if (!merchant) return null;

  const schedule = merchant.schedule || {};
  const peer = String(merchant.peerId || merchant.id);

  const handleSave = () => {
    onSave(merchant);
    setSavedFlash(true);
    setTimeout(() => {
      setSavedFlash(false);
      onClose();
    }, 700);
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />
          <View style={styles.head}>
            <Pressable onPress={onClose} hitSlop={8} style={styles.iconBtn}>
              <Icon name="arrow-left" size={18} color={c.text} />
            </Pressable>
            <View style={styles.icon}>
              <Icon name={merchant.icon || 'store'} size={18} color={c.sky} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{merchant.name}</Text>
              <Text style={styles.meta}>
                {merchant.categoryLabel || merchant.category} · {merchant.distance ?? '—'} m away
              </Text>
            </View>
            <StatusBadge status={merchant.status} />
          </View>

          <View style={styles.infoGrid}>
            <Info icon="zap" label="Promo" value={merchant.message || merchant.promotion || 'No promo yet'} c={c} styles={styles} />
            <Info icon="clock" label="Hours" value={merchant.hours || schedule.monFri || '—'} c={c} styles={styles} />
            <Info
              icon="link"
              label="Peer ID"
              value={`${peer.slice(0, 6)}…${peer.slice(-4)}`}
              c={c}
              styles={styles}
            />
          </View>

          <View style={styles.signalBox}>
            <Text style={styles.section}>SIGNAL</Text>
            <View style={styles.bars}>
              {[1, 2, 3, 4, 5].map((n) => (
                <View
                  key={n}
                  style={[
                    styles.bar,
                    { height: 8 + n * 4, opacity: n <= (merchant.signal || 3) ? 1 : 0.2 },
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={[styles.primary, connecting && { opacity: 0.7 }]}
              disabled={connecting}
              onPress={() => {
                onConnect(merchant);
                onClose();
              }}
            >
              {connecting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Icon name="link" size={16} color="#FFFFFF" />
                  <Text style={styles.primaryText}>Connect P2P</Text>
                </>
              )}
            </Pressable>
            <Pressable style={styles.secondary} onPress={handleSave}>
              <Icon name="credit-card" size={16} color={c.sky} />
              <Text style={styles.secondaryText}>{savedFlash ? 'Saved!' : 'Save promo'}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Info({ icon, label, value, c, styles }) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoIcon}>
        <Icon name={icon} size={14} color={c.sky} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    overlay: { flex: 1, backgroundColor: c.overlay, justifyContent: 'flex-end' },
    sheet: {
      backgroundColor: c.panel,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      gap: 10,
      paddingBottom: 28,
    },
    handle: {
      alignSelf: 'center',
      width: 42,
      height: 4,
      borderRadius: 2,
      backgroundColor: c.border,
      marginBottom: 4,
    },
    head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    iconBtn: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: c.panelAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: c.greenDark,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: { color: c.text, fontSize: 18, fontWeight: '800' },
    meta: { color: c.muted, fontSize: 12, marginTop: 2 },
    infoGrid: { gap: 8, marginTop: 4 },
    infoCard: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      backgroundColor: c.panelAlt,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: c.border,
    },
    infoIcon: {
      width: 30,
      height: 30,
      borderRadius: 8,
      backgroundColor: c.panel,
      alignItems: 'center',
      justifyContent: 'center',
    },
    infoLabel: { color: c.muted, fontSize: 10, fontWeight: '800', letterSpacing: 0.6 },
    infoValue: { color: c.text, fontSize: 13, fontWeight: '700', marginTop: 2 },
    section: { color: c.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
    signalBox: { gap: 8, marginTop: 4 },
    bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
    bar: { width: 8, backgroundColor: c.sky, borderRadius: 2 },
    actions: { flexDirection: 'row', gap: 10, marginTop: 8 },
    primary: {
      flex: 1,
      backgroundColor: c.header,
      borderRadius: 14,
      minHeight: 50,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
    },
    primaryText: { color: '#FFFFFF', fontWeight: '800' },
    secondary: {
      flex: 1,
      borderWidth: 1,
      borderColor: c.sky,
      borderRadius: 14,
      minHeight: 50,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
      backgroundColor: c.greenDark,
    },
    secondaryText: { color: c.sky, fontWeight: '800' },
  });
}
