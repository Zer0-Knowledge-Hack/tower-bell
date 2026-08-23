import { useMemo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useThemeColors } from '../../utils/useThemeColors'
import { BrandLogo } from './BrandLogo'
import { Icon } from './Icon'
import { NotificationBell } from './NotificationBell'

export function HeaderBar({ title, subtitle, right, onSettings, showBell = true }) {
  const c = useThemeColors()
  const styles = useMemo(() => makeStyles(c), [c])

  return (
    <View style={styles.wrap}>
      <View style={styles.left}>
        <BrandLogo size={38} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
        </View>
      </View>
      <View style={styles.right}>
        {right}
        {showBell ? <NotificationBell /> : null}
        {onSettings ? (
          <Pressable onPress={onSettings} hitSlop={10} style={styles.gear}>
            <Icon name='cog' size={18} color={c.headerText} />
          </Pressable>
        ) : null}
      </View>
    </View>
  )
}

function makeStyles(c) {
  return StyleSheet.create({
    wrap: {
      backgroundColor: c.header,
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    left: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
    title: { color: c.headerText, fontSize: 18, fontWeight: '800', letterSpacing: 0.4 },
    sub: { color: 'rgba(255,255,255,0.78)', fontSize: 11, marginTop: 2 },
    right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    gear: {
      width: 34,
      height: 34,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.14)'
    }
  })
}
