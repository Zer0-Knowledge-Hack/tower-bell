import { StatusBar } from 'expo-status-bar'
import { useEffect, useMemo } from 'react'
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
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

const DESKTOP_BREAK = 900
const FRAME_BREAK = 560

export default function App() {
  const hydrate = useAppStore((s) => s.hydrate)
  const ready = useAppStore((s) => s.ready)
  const c = useThemeColors()
  const { width, height } = useWindowDimensions()
  const isWeb = Platform.OS === 'web'
  const desktop = isWeb && width >= DESKTOP_BREAK
  const framed = isWeb && width >= FRAME_BREAK
  const styles = useMemo(() => makeStyles(c, height), [c, height])

  useEffect(() => {
    loadPixelFonts()
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (!isWeb || typeof document === 'undefined') return undefined
    const root = document.getElementById('root')
    const prev = {
      htmlH: document.documentElement.style.height,
      bodyH: document.body.style.height,
      bodyM: document.body.style.margin,
      bodyO: document.body.style.overflow,
      rootH: root?.style.height
    }
    document.documentElement.style.height = '100%'
    document.body.style.height = '100%'
    document.body.style.margin = '0'
    document.body.style.overflow = 'hidden'
    if (root) root.style.height = '100%'
    return () => {
      document.documentElement.style.height = prev.htmlH
      document.body.style.height = prev.bodyH
      document.body.style.margin = prev.bodyM
      document.body.style.overflow = prev.bodyO
      if (root) root.style.height = prev.rootH
    }
  }, [isWeb])

  const appBody = ready ? (
    <AppNavigator />
  ) : (
    <View style={styles.boot}>
      <BrandLogo size={112} />
      <Text style={styles.bootTitle}>TOWERBELL</Text>
      <Text style={styles.bootLead}>OWL TOWER · SCAN / BEACON</Text>
      <ActivityIndicator color={c.sky} style={{ marginTop: 16 }} />
      <Text style={styles.bootLoading}>boot sequence...</Text>
    </View>
  )

  return (
    <SafeAreaProvider>
      <View style={[styles.shell, framed && styles.shellWeb]}>
        <StatusBar style='light' />
        {desktop ? (
          <View style={styles.desktopRow}>
            <DesktopAside styles={styles} />
            <View style={styles.deviceColumn}>
              <Text style={styles.deviceLabel}>PHONE FRAME · USE THE APP INSIDE</Text>
              <View style={[styles.phone, styles.phoneWeb, styles.phoneDesktop]}>
                <SafeAreaView style={styles.safeFill} edges={['top']}>
                  <View style={styles.navHost}>{appBody}</View>
                  <ToastHost />
                </SafeAreaView>
              </View>
              <Text style={styles.deviceHint}>Mouse + scroll work. Tabs at the bottom.</Text>
            </View>
          </View>
        ) : (
          <SafeAreaView style={[styles.safe, framed && styles.safeFramed]} edges={['top']}>
            {framed ? <Text style={styles.deviceLabel}>TOWERBELL DEMO</Text> : null}
            <View style={[styles.phone, framed && styles.phoneWeb]}>
              <View style={styles.navHost}>{appBody}</View>
              <ToastHost />
            </View>
          </SafeAreaView>
        )}
      </View>
    </SafeAreaProvider>
  )
}

function DesktopAside({ styles }) {
  const pickRole = useAppStore((s) => s.pickRole)

  return (
    <View style={styles.aside} accessibilityRole='complementary'>
      <BrandLogo size={72} />
      <Text style={styles.asideBrand}>TOWERBELL</Text>
      <Text style={styles.asideTeam}>ZERO-KNOLAGE · WEB DEMO</Text>
      <Text style={styles.asideLead}>
        Click a mode here or inside the phone. Same scan / beacon contract as the Pear CLI — mock
        swarm on web.
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.asideCard,
          styles.asideCardBtn,
          pressed && styles.asideCardPressed
        ]}
        onPress={() => pickRole('visitor')}
        accessibilityRole='button'
        accessibilityLabel='Start SCAN traveler mode'
      >
        <Text style={styles.asideCardTitle}>▶ SCAN</Text>
        <Text style={styles.asideCardBody}>
          Traveler mode. Wait a few seconds for Café Rivadavia and nearby shops.
        </Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.asideCard,
          styles.asideCardBtn,
          pressed && styles.asideCardPressed
        ]}
        onPress={() => pickRole('merchant')}
        accessibilityRole='button'
        accessibilityLabel='Start BEACON shop mode'
      >
        <Text style={styles.asideCardTitle}>▶ BEACON</Text>
        <Text style={styles.asideCardBody}>
          Shop mode. Start broadcasting your name, hours and promo.
        </Text>
      </Pressable>

      <Pressable
        style={styles.asideBtn}
        onPress={() => Linking.openURL('/')}
        accessibilityRole='link'
        accessibilityLabel='Back to landing'
      >
        <Text style={styles.asideBtnText}>← BACK TO LANDING</Text>
      </Pressable>
      <Text style={styles.asideFoot}>Real P2P: pear install (not this page).</Text>
    </View>
  )
}

function makeStyles(c, height) {
  const frameH = Math.min(Math.max(height - 96, 560), 820)
  return StyleSheet.create({
    shell: {
      flex: 1,
      backgroundColor: c.deep,
      ...(Platform.OS === 'web' ? { height: '100%' } : null)
    },
    shellWeb: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.shell,
      backgroundImage:
        Platform.OS === 'web'
          ? 'linear-gradient(rgba(28,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(28,255,255,0.05) 1px, transparent 1px)'
          : undefined,
      backgroundSize: Platform.OS === 'web' ? '32px 32px, 32px 32px' : undefined
    },
    safe: { flex: 1, backgroundColor: c.deep, width: '100%' },
    safeFramed: { maxWidth: 480, alignItems: 'center', paddingVertical: 16 },
    safeFill: {
      flex: 1,
      backgroundColor: c.bg,
      width: '100%',
      height: '100%',
      minHeight: 0
    },
    navHost: {
      flex: 1,
      width: '100%',
      minHeight: 0,
      ...(Platform.OS === 'web' ? { height: '100%', display: 'flex' } : null)
    },
    phone: { flex: 1, backgroundColor: c.bg, width: '100%', minHeight: 0 },
    phoneWeb: {
      maxWidth: 430,
      width: '100%',
      alignSelf: 'center',
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: c.border,
      backgroundColor: c.bg,
      minHeight: 0
    },
    phoneDesktop: {
      height: frameH,
      maxHeight: frameH,
      flexGrow: 0,
      flexShrink: 0,
      borderWidth: 3,
      ...(Platform.OS === 'web'
        ? { display: 'flex', flexDirection: 'column', boxShadow: '8px 8px 0 rgba(92,225,255,0.22)' }
        : null)
    },
    desktopRow: {
      flex: 1,
      width: '100%',
      maxWidth: 1100,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 40,
      paddingHorizontal: 32,
      paddingVertical: 24
    },
    deviceColumn: { alignItems: 'center', gap: 10 },
    deviceLabel: {
      color: c.gold,
      fontFamily: pixelTitle,
      fontSize: 8,
      letterSpacing: 1.5,
      marginBottom: 4,
      textAlign: 'center'
    },
    deviceHint: {
      color: c.muted,
      fontFamily: pixelBody,
      fontSize: 16,
      textAlign: 'center'
    },
    aside: {
      width: 320,
      maxWidth: '100%',
      gap: 12,
      padding: 8
    },
    asideBrand: {
      color: c.sky,
      fontFamily: pixelTitle,
      fontSize: 12,
      letterSpacing: 2,
      marginTop: 8
    },
    asideTeam: {
      color: c.gold,
      fontFamily: pixelBody,
      fontSize: 18,
      letterSpacing: 2
    },
    asideLead: {
      color: c.ink,
      fontFamily: pixelBody,
      fontSize: 18,
      lineHeight: 22,
      marginTop: 4,
      marginBottom: 8
    },
    asideCard: {
      borderWidth: 2,
      borderColor: c.border,
      backgroundColor: c.panel,
      padding: 12,
      gap: 6
    },
    asideCardBtn: {
      cursor: 'pointer'
    },
    asideCardPressed: {
      backgroundColor: c.greenDark,
      borderColor: c.sky
    },
    asideCardTitle: {
      color: c.sky,
      fontFamily: pixelTitle,
      fontSize: 9,
      letterSpacing: 1
    },
    asideCardBody: {
      color: c.muted,
      fontFamily: pixelBody,
      fontSize: 17,
      lineHeight: 20
    },
    asideBtn: {
      marginTop: 8,
      borderWidth: 2,
      borderColor: c.sky,
      backgroundColor: c.sky,
      paddingVertical: 12,
      paddingHorizontal: 14,
      alignItems: 'center',
      cursor: 'pointer'
    },
    asideBtnText: {
      color: c.deep,
      fontFamily: pixelTitle,
      fontSize: 9,
      letterSpacing: 1
    },
    asideFoot: {
      color: c.muted,
      fontFamily: pixelBody,
      fontSize: 15,
      marginTop: 4
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
