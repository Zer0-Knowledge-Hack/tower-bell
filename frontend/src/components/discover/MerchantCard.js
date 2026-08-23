import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../utils/useThemeColors';
import { Icon } from '../common/Icon';
import { StatusBadge } from '../common/StatusBadge';

export function MerchantCard({ merchant, onView }) {
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <Pressable style={styles.card} onPress={() => onView(merchant)}>
      <View style={styles.top}>
        <View style={styles.icon}>
          <Icon name={merchant.icon || 'store'} size={18} color={c.sky} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{merchant.name}</Text>
          <Text style={styles.meta}>
            {merchant.categoryLabel || merchant.category} · {merchant.distance ?? '—'} m
          </Text>
        </View>
        <StatusBadge status={merchant.status} />
      </View>
      {merchant.message || merchant.promotion ? (
        <View style={styles.promoRow}>
          <Icon name="zap" size={13} color={c.gold} />
          <Text style={styles.promo} numberOfLines={2}>
            {merchant.message || merchant.promotion}
          </Text>
        </View>
      ) : null}
      <View style={styles.footer}>
        <View style={styles.signal}>
          {[1, 2, 3, 4, 5].map((n) => (
            <View
              key={n}
              style={[
                styles.bar,
                { height: 4 + n * 2, opacity: n <= (merchant.signal || 3) ? 1 : 0.2 },
              ]}
            />
          ))}
        </View>
        <View style={styles.btn}>
          <Icon name="link" size={13} color={c.sky} />
          <Text style={styles.btnText}>Open</Text>
        </View>
      </View>
    </Pressable>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    card: {
      backgroundColor: c.panel,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 16,
      padding: 14,
      gap: 10,
    },
    top: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    icon: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: c.greenDark,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: { color: c.text, fontSize: 16, fontWeight: '800' },
    meta: { color: c.muted, fontSize: 12, marginTop: 2 },
    promoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
    promo: { color: c.ink, fontSize: 13, fontWeight: '600', flex: 1, lineHeight: 18 },
    footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    signal: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
    bar: { width: 4, backgroundColor: c.sky, borderRadius: 1 },
    btn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: c.greenDark,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    btnText: { color: c.sky, fontWeight: '800', fontSize: 12 },
  });
}
