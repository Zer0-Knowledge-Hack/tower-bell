import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useThemeColors } from '../../utils/useThemeColors';
import { Icon } from './Icon';

const BANNERS = [
  {
    id: 'b1',
    kicker: 'TODAY NEAR YOU',
    title: '2x1 coffee until 6PM',
    body: 'Open Cafe Rivadavia on the map and save the promo.',
    cta: 'Open map',
    tone: 'navy',
  },
  {
    id: 'b2',
    kicker: 'OFFLINE FIRST',
    title: 'No internet? Still discover.',
    body: 'Towerbell finds shops over local P2P — keep Bluetooth on.',
    cta: 'How it works',
    tone: 'sky',
  },
  {
    id: 'b3',
    kicker: 'SHOP MODE',
    title: 'Broadcast your kiosk',
    body: 'Switch identity in Settings and go live in one tap.',
    cta: 'Go live',
    tone: 'gold',
  },
];

export function PromoBanner({ onPressCta }) {
  const c = useThemeColors();
  const { width } = useWindowDimensions();
  const cardW = Math.min(width - 48, 360);
  const [index, setIndex] = useState(0);
  const scrollRef = useRef(null);
  const styles = makeStyles(c);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % BANNERS.length;
        scrollRef.current?.scrollTo({ x: next * (cardW + 12), animated: true });
        return next;
      });
    }, 4200);
    return () => clearInterval(timer);
  }, [cardW]);

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Icon name="megaphone" size={14} color={c.sky} />
        <Text style={styles.headText}>Highlights</Text>
      </View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        decelerationRate="fast"
        snapToInterval={cardW + 12}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / (cardW + 12));
          setIndex(Math.max(0, Math.min(BANNERS.length - 1, i)));
        }}
      >
        {BANNERS.map((item) => (
          <Pressable
            key={item.id}
            style={[styles.card, { width: cardW }, toneStyle(item.tone, c)]}
            onPress={() => onPressCta?.(item)}
          >
            <Text style={styles.kicker}>{item.kicker}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
            <View style={styles.cta}>
              <Text style={styles.ctaText}>{item.cta}</Text>
              <Icon name="arrow-up-right" size={14} color="#FFFFFF" />
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {BANNERS.map((item, i) => (
          <View key={item.id} style={[styles.dot, i === index && styles.dotOn]} />
        ))}
      </View>
    </View>
  );
}

function toneStyle(tone, c) {
  if (tone === 'sky') return { backgroundColor: c.sky };
  if (tone === 'gold') return { backgroundColor: c.gold };
  return { backgroundColor: c.header };
}

function makeStyles(c) {
  return StyleSheet.create({
    wrap: { gap: 8 },
    head: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    headText: { color: c.muted, fontWeight: '800', fontSize: 11, letterSpacing: 0.8 },
    card: {
      borderRadius: 18,
      padding: 16,
      minHeight: 132,
      justifyContent: 'space-between',
    },
    kicker: { color: 'rgba(255,255,255,0.75)', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
    title: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginTop: 6 },
    body: { color: 'rgba(255,255,255,0.88)', fontSize: 13, lineHeight: 18, marginTop: 4 },
    cta: {
      alignSelf: 'flex-start',
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(0,0,0,0.18)',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
    },
    ctaText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
    dots: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.border },
    dotOn: { backgroundColor: c.sky, width: 16 },
  });
}
