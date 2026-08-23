import { useEffect, useRef } from 'react'
import { Animated, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { colors, statusColor } from '../../utils/colors'

function positionFor(index, total, distance) {
  const angle = (index / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2
  const r = Math.min(40, 18 + (distance / 500) * 24)
  return { left: `${50 + Math.cos(angle) * r}%`, top: `${50 + Math.sin(angle) * r}%` }
}

export function RadarView({ merchants, onSelect }) {
  const pulse = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 2400,
        useNativeDriver: Platform.OS !== 'web'
      })
    )
    loop.start()
    return () => loop.stop()
  }, [pulse])

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.7] })
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] })

  return (
    <View style={styles.box}>
      <View style={styles.ring} />
      <View style={[styles.ring, styles.mid]} />
      <View style={[styles.ring, styles.inner]} />
      <Animated.View style={[styles.pulse, { transform: [{ scale }], opacity }]} />
      <View style={styles.core}>
        <Image source={require('../../../assets/owl.png')} style={styles.owl} />
      </View>
      {merchants.map((m, i) => {
        const pos = positionFor(i, merchants.length, m.distance || 120)
        const color = statusColor[m.status] || colors.sky
        return (
          <Pressable key={m.id} style={[styles.dotWrap, pos]} onPress={() => onSelect(m)}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            <Text numberOfLines={1} style={styles.label}>
              {m.name}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    height: 300,
    borderRadius: 20,
    backgroundColor: colors.deep,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ring: {
    position: 'absolute',
    width: '78%',
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(84,173,246,0.28)'
  },
  mid: { width: '52%' },
  inner: { width: '26%' },
  pulse: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: colors.sky
  },
  core: {
    width: 52,
    height: 52,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.sky,
    backgroundColor: '#000'
  },
  owl: { width: '100%', height: '100%' },
  dotWrap: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -20 }, { translateY: -10 }],
    width: 80
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  label: {
    marginTop: 4,
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
    backgroundColor: 'rgba(7,21,54,0.72)',
    paddingHorizontal: 4,
    overflow: 'hidden',
    borderRadius: 4
  }
})
