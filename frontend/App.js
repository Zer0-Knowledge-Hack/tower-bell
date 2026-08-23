import { StatusBar } from 'expo-status-bar'
import { useEffect, useMemo } from 'react'
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { BrandLogo } from './src/components/common/BrandLogo'
import { ToastHost } from './src/components/common/ToastHost'
import { AppNavigator } from './src/navigation/AppNavigator'
import { useAppStore } from './src/store/app.store'
import { useThemeColors } from './src/utils/useThemeColors'
import { loadPixelFonts, pixelBody, pixelTitle } from './src/utils/pixel'

export default function App() {
  const hydrate = useAppStore((s) => s.hydrate)
  const ready = useAppStore((s) => s.ready)
  const c = useThemeColors()
  const { width } = useWindowDimensions()
  const framed = Platform.OS === 'web' && width > 520
  const styles = useMemo(() => makeStyles(c), [c])

  useEffect(() => {
    loadPixelFonts()
    hydrate()
  }, [hydrate])

  return (
    <SafeAreaProvider>
      <View style={[styles.shell, framed && styles.shellWeb]}>
        <SafeAreaView style={styles.safe} edges={['top']}>
          <StatusBar style='light' />
          <View style={[styles.phone, framed && styles.phoneWeb]}>
            {ready ? (
              <AppNavigator />
            ) : (
              <View style={styles.boot}>
                <BrandLogo size={112} />
                <Text style={styles.bootTitle}>TOWERBELL</Text>
                <Text style={styles.bootLead}>OWL TOWER · SCAN / BEACON</Text>
                <ActivityIndicator color={c.sky} style={{ marginTop: 16 }} />
                <Text style={styles.bootLoading}>boot sequence...</Text>
              </View>
            )}
            <ToastHost />
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  )
}

function makeStyles(c) {
  return StyleSheet.create({
    shell: { flex: 1, backgroundColor: c.deep },
    shellWeb: { alignItems: 'center', backgroundColor: c.shell },
    safe: { flex: 1, backgroundColor: c.deep, width: '100%', maxWidth: 480 },
    phone: { flex: 1, backgroundColor: c.bg, width: '100%' },
    phoneWeb: {
      maxWidth: 430,
      width: '100%',
      alignSelf: 'center',
      overflow: 'hidden',
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderColor: c.border
    },
    boot: {
      flex: 1,
      backgroundColor: c.deep,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      padding: 24
    },
    bootTitle: {
      color: c.sky,
      fontSize: 16,
      fontFamily: pixelTitle,
      letterSpacing: 2,
      marginTop: 10
    },
    bootLead: {
      color: c.muted,
      fontSize: 18,
      fontFamily: pixelBody,
      textAlign: 'center',
      letterSpacing: 1
    },
    bootLoading: { color: c.muted, fontSize: 16, fontFamily: pixelBody, marginTop: 8 }
  })
}
