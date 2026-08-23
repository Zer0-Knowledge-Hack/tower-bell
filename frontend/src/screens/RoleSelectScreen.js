import { useMemo } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { BrandLogo } from '../components/common/BrandLogo'
import { Icon } from '../components/common/Icon'
import { useAppStore } from '../store/app.store'
import { useThemeColors } from '../utils/useThemeColors'

const cards = [
  {
    role: 'visitor',
    icon: 'compass',
    name: 'Traveler',
    kicker: 'Scanner mode',
    text: 'Walk the neighborhood and see cafes, kiosks and pharmacies on the local map. No account needed.'
  },
  {
    role: 'merchant',
    icon: 'signal',
    name: 'Shop',
    kicker: 'Beacon mode',
    text: 'Broadcast your place. Nearby travelers see your name, hours and promo instantly.'
  }
]

export function RoleSelectScreen() {
  const pickRole = useAppStore((s) => s.pickRole)
  const c = useThemeColors()
  const styles = useMemo(() => makeStyles(c), [c])

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.body}>
      <View style={styles.hero}>
        <BrandLogo size={88} />
        <Text style={styles.brand}>TOWERBELL</Text>
        <Text style={styles.title}>Who are you today?</Text>
        <Text style={styles.lead}>
          Pick a role. Travelers search the map. Shops broadcast their beacon.
        </Text>
      </View>

      {cards.map((card) => (
        <Pressable key={card.role} style={styles.card} onPress={() => pickRole(card.role)}>
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

      <Pressable style={styles.admin} onPress={() => pickRole('admin')}>
        <Icon name='shield' size={16} color={c.muted} />
        <Text style={styles.adminText}>Enter as admin (demo)</Text>
      </Pressable>
    </ScrollView>
  )
}

function makeStyles(c) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    body: { padding: 20, paddingTop: 36, paddingBottom: 40, gap: 12 },
    hero: { alignItems: 'center', marginBottom: 8, gap: 8 },
    brand: { color: c.sky, fontWeight: '800', letterSpacing: 3, marginTop: 6 },
    title: { color: c.ink, fontSize: 28, fontWeight: '800', textAlign: 'center' },
    lead: { color: c.muted, textAlign: 'center', lineHeight: 20, maxWidth: 320 },
    card: {
      backgroundColor: c.panel,
      borderRadius: 18,
      padding: 16,
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: c.border
    },
    icon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: c.greenDark,
      alignItems: 'center',
      justifyContent: 'center'
    },
    kicker: { color: c.sky, fontWeight: '800', fontSize: 11, letterSpacing: 0.6 },
    name: { color: c.ink, fontWeight: '800', fontSize: 18, marginTop: 2 },
    text: { color: c.muted, marginTop: 4, fontSize: 13, lineHeight: 18 },
    admin: {
      marginTop: 8,
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 10
    },
    adminText: { color: c.muted, fontWeight: '700' }
  })
}
