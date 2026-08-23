import { useNavigation } from '@react-navigation/native'
import { useMemo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useAppStore } from '../../store/app.store'
import { pixelTitle } from '../../utils/pixel'
import { useThemeColors } from '../../utils/useThemeColors'
import { Icon } from './Icon'

export function NotificationBell() {
  const navigation = useNavigation()
  const c = useThemeColors()
  const styles = useMemo(() => makeStyles(c), [c])
  const unread = useAppStore((s) => (s.db?.notifications || []).filter((n) => !n.read).length)

  return (
    <Pressable
      onPress={() => navigation.navigate('Notifications')}
      hitSlop={10}
      style={styles.btn}
      accessibilityLabel='Notifications'
    >
      <Icon name='bell' size={18} color={c.headerText} />
      {unread > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
        </View>
      ) : null}
    </Pressable>
  )
}

function makeStyles(c) {
  return StyleSheet.create({
    btn: {
      width: 34,
      height: 34,
      borderRadius: 0,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: c.border,
      backgroundColor: c.panel,
      cursor: 'pointer'
    },
    badge: {
      position: 'absolute',
      top: -4,
      right: -4,
      minWidth: 16,
      height: 16,
      borderRadius: 0,
      borderWidth: 2,
      borderColor: c.deep,
      backgroundColor: c.gold,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 2
    },
    badgeText: {
      color: c.onAccent || c.deep,
      fontSize: 8,
      fontFamily: pixelTitle
    }
  })
}
