import { useMemo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useThemeColors } from '../../utils/useThemeColors'
import { pixelBody, pixelTitle } from '../../utils/pixel'
import { BrandLogo } from './BrandLogo'
import { Icon } from './Icon'
import { NotificationBell } from './NotificationBell'

export function HeaderBar({ title, subtitle, right, onSettings, showBell = true }) {
  const c = useThemeColors()
  const styles = useMemo(() => makeStyles(c), [c])

  return (
    <View style={styles.wrap}>
      <View style={styles.hud} />
      <View style={styles.left}>
        <BrandLogo size={40} />
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
      paddingHorizontal: 12,
      paddingTop: 10,
      paddingBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 2,
      borderBottomColor: c.border
    },
    hud: {
      position: 'absolute',
      top: 6,
      left: 6,
      right: 6,
      bottom: 6,
      borderWidth: 1,
      borderColor: 'rgba(28,255,255,0.25)',
      pointerEvents: 'none'
    },
    left: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
    title: {
      color: c.headerText,
      fontSize: 11,
      fontFamily: pixelTitle,
      letterSpacing: 1
    },
    sub: { color: c.muted, fontSize: 16, fontFamily: pixelBody, marginTop: 4 },
    right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    gear: {
      width: 34,
      height: 34,
      borderRadius: 0,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: c.border,
      backgroundColor: c.panel
    }
  })
}
