import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useAppStore } from '../../store/app.store'
import { pixelBody } from '../../utils/pixel'
import { useThemeColors } from '../../utils/useThemeColors'

export function ToastHost() {
  const toast = useAppStore((s) => s.toast)
  const c = useThemeColors()
  const styles = useMemo(() => makeStyles(c), [c])
  if (!toast) return null
  return (
    <View style={styles.wrap}>
      <View style={styles.toast}>
        <Text style={styles.text}>{toast}</Text>
      </View>
    </View>
  )
}

function makeStyles(c) {
  return StyleSheet.create({
    wrap: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 78,
      alignItems: 'center',
      pointerEvents: 'none',
      zIndex: 40
    },
    toast: {
      backgroundColor: c.toastBg || c.sky,
      borderRadius: 0,
      borderWidth: 2,
      borderColor: c.border,
      paddingHorizontal: 14,
      paddingVertical: 10,
      maxWidth: '88%',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.35)'
    },
    text: {
      color: c.toastText || c.onAccent || c.deep,
      fontFamily: pixelBody,
      fontSize: 18,
      letterSpacing: 0.5
    }
  })
}
