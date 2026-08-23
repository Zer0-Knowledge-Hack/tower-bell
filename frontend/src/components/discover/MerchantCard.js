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
        <Text style={styles.promo}>{merchant.message || merchant.promotion}</Text>
      ) : null}
      <View style={styles.btn}>
        <Text style={styles.btnText}>View place</Text>
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
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: c.greenDark,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: { color: c.text, fontSize: 16, fontWeight: '800' },
    meta: { color: c.muted, fontSize: 12, marginTop: 2 },
    promo: { color: c.sky, fontSize: 13, fontWeight: '600' },
    btn: {
      alignSelf: 'flex-start',
      backgroundColor: c.greenDark,
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    btnText: { color: c.sky, fontWeight: '800', fontSize: 12 },
  });
}
