import { useMemo } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { BrandLogo } from '../components/common/BrandLogo'
import { Icon } from '../components/common/Icon'
import { useAppStore } from '../store/app.store'
import { pixelBody, pixelTitle } from '../utils/pixel'
import { useThemeColors } from '../utils/useThemeColors'

const cards = [
  {
    role: 'visitor',
    icon: 'compass',
    name: 'SCAN',
    kicker: 'Traveler',
    text: 'Walk nearby. See shops that are broadcasting right now. No account.'
  },
  {
    role: 'merchant',
    icon: 'signal',
    name: 'BEACON',
    kicker: 'Shop',
    text: 'Turn on your tower. Travelers around you get your name, hours and promo.'
  }
]

export function RoleSelectScreen() {
  const pickRole = useAppStore((s) => s.pickRole)
  const c = useThemeColors()
  const styles = useMemo(() => makeStyles(c), [c])

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.body}>
      <View style={styles.hero}>
        <BrandLogo size={120} />
        <Text style={styles.brand}>TOWERBELL</Text>
        <Text style={styles.team}>ZERO-KNOLAGE</Text>
        <Text style={styles.title}>CHOOSE MODE</Text>
        <Text style={styles.lead}>
          Same nucleus as the CLI: scan() finds beacons. beacon() broadcasts your shop.
        </Text>
      </View>

      {cards.map((card) => (
        <Pressable
          key={card.role}
          style={styles.card}
          accessibilityRole='button'
          accessibilityLabel={card.name}
          onPress={() => pickRole(card.role)}
        >
          <View style={styles.icon}>
            <Icon name={card.icon} size={22} color={c.sky} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.kicker}>{card.kicker}</Text>
            <Text style={styles.name}>{card.name}</Text>
            <Text style={styles.text}>{card.text}</Text>
          </View>
          <Icon name='arrow-up-right' size={18} color={c.sky} />
        </Pressable>
      ))}

      <Image
        source={require('../../assets/owl-team.jpg')}
        style={styles.teamArt}
        resizeMode='contain'
      />
    </ScrollView>
  )
}

function makeStyles(c) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    body: { padding: 16, paddingTop: 28, paddingBottom: 40, gap: 12 },
    hero: { alignItems: 'center', marginBottom: 8, gap: 8 },
    brand: {
      color: c.sky,
      fontFamily: pixelTitle,
      fontSize: 12,
      letterSpacing: 3,
      marginTop: 8
    },
    team: { color: c.gold, fontFamily: pixelBody, fontSize: 18, letterSpacing: 4 },
    title: {
      color: c.ink,
      fontSize: 14,
      fontFamily: pixelTitle,
      textAlign: 'center',
      marginTop: 6
    },
    lead: {
      color: c.muted,
      textAlign: 'center',
      lineHeight: 20,
      maxWidth: 340,
      fontFamily: pixelBody,
      fontSize: 18
    },
    card: {
      backgroundColor: c.panel,
      borderRadius: 0,
      padding: 14,
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: c.border
    },
    icon: {
      width: 48,
      height: 48,
      borderRadius: 0,
      borderWidth: 2,
      borderColor: c.border,
      backgroundColor: c.greenDark,
      alignItems: 'center',
      justifyContent: 'center'
    },
    kicker: {
      color: c.sky,
      fontFamily: pixelTitle,
      fontSize: 8,
      letterSpacing: 1
    },
    name: {
      color: c.ink,
      fontFamily: pixelTitle,
      fontSize: 14,
      marginTop: 4
    },
    text: { color: c.muted, marginTop: 4, fontSize: 16, lineHeight: 20, fontFamily: pixelBody },
    teamArt: {
      width: '100%',
      height: 160,
      marginTop: 8,
      borderWidth: 2,
      borderColor: c.border,
      backgroundColor: '#000'
    }
  })
}
