import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useThemeColors } from '../../utils/useThemeColors';

function Bone({ width = '100%', height = 14, radius = 8, style }) {
  const c = useThemeColors();
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.85, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.35, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: c.border,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  const c = useThemeColors();
  return (
    <View style={[styles.card, { backgroundColor: c.panel, borderColor: c.border }]}>
      <View style={styles.row}>
        <Bone width={44} height={44} radius={12} />
        <View style={{ flex: 1, gap: 8 }}>
          <Bone width="70%" height={14} />
          <Bone width="45%" height={12} />
        </View>
        <Bone width={56} height={20} radius={999} />
      </View>
      <Bone width="90%" height={12} />
      <Bone width={88} height={32} radius={10} />
    </View>
  );
}

export function SkeletonWallet() {
  const c = useThemeColors();
  return (
    <View style={{ gap: 12 }}>
      <View style={[styles.hero, { backgroundColor: c.header }]}>
        <Bone width={100} height={12} style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
        <Bone width={160} height={36} style={{ backgroundColor: 'rgba(255,255,255,0.3)', marginTop: 12 }} />
        <View style={[styles.row, { marginTop: 18 }]}>
          <Bone width="30%" height={40} radius={12} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <Bone width="30%" height={40} radius={12} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <Bone width="30%" height={40} radius={12} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
        </View>
      </View>
      <View style={styles.row}>
        <Bone width={200} height={120} radius={18} />
        <Bone width={200} height={120} radius={18} />
      </View>
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <View style={{ gap: 10 }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  hero: { borderRadius: 20, padding: 18 },
});
