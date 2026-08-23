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

/** Phone frame size for judges on desktop (approx 9:19.5). */
const PHONE_W = 390

export default function App() {
  const hydrate = useAppStore((s) => s.hydrate)
  const ready = useAppStore((s) => s.ready)
  const c = useThemeColors()
  const { width, height } = useWindowDimensions()
  const isWeb = Platform.OS === 'web'
  // Judges open this from a PC: always use phone-in-desktop chrome on web.
  const desktopChrome = isWeb
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

  if (!desktopChrome) {
    return (
      <SafeAreaProvider>
        <View style={styles.shell}>
          <SafeAreaView style={styles.safeNative} edges={['top']}>
            <StatusBar style='light' />
            <View style={styles.phoneNative}>
              {appBody}
              <ToastHost />
            </View>
          </SafeAreaView>
        </View>
      </SafeAreaProvider>
    )
  }

  // Wide: aside left + phone center. Narrow web: aside above phone (still framed).
  const sideBySide = width >= 860

  return (
    <SafeAreaProvider>
      <View style={[styles.shell, styles.shellWeb]}>
        <StatusBar style='light' />
        <View style={[styles.desktopRow, !sideBySide && styles.desktopStack]}>
          <DesktopAside styles={styles} compact={!sideBySide} />
          <View style={styles.deviceColumn}>
            <Text style={styles.deviceLabel}>JUDGE DEMO · PHONE FRAME</Text>
            <View style={styles.phoneFrame}>
              <SafeAreaView style={styles.safeFill} edges={['top']}>
                <View style={styles.navHost}>{appBody}</View>
                <ToastHost />
              </SafeAreaView>
            </View>
            <Text style={styles.deviceHint}>
              Click SCAN or BEACON on the left — or the cards inside the phone.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  )
}

function DesktopAside({ styles, compact }) {
  const pickRole = useAppStore((s) => s.pickRole)
  const picked = useAppStore((s) => !!s.db?.pickedRole)
  const role = useAppStore((s) => s.db?.user?.role)

  return (
    <View style={[styles.aside, compact && styles.asideCompact]} accessibilityRole='complementary'>
      <BrandLogo size={compact ? 56 : 72} />
      <Text style={styles.asideBrand}>TOWERBELL</Text>
      <Text style={styles.asideTeam}>ZERO-KNOLAGE · WEB DEMO</Text>
      <Text style={styles.asideLead}>
        Desktop shell for judges. The frame is the Expo phone UI (mock swarm). Real P2P is pear
        install.
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.asideCard,
          styles.asideCardBtn,
          role === 'visitor' && picked && styles.asideCardActive,
          pressed && styles.asideCardPressed
        ]}
        onPress={() => pickRole('visitor')}
        accessibilityRole='button'
        accessibilityLabel='Start SCAN traveler mode'
      >
        <Text style={styles.asideCardTitle}>▶ SCAN</Text>
        <Text style={styles.asideCardBody}>
          Traveler. Wait a few seconds for Café Rivadavia and nearby shops.
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.asideCard,
          styles.asideCardBtn,
          role === 'merchant' && picked && styles.asideCardActive,
          pressed && styles.asideCardPressed
        ]}
        onPress={() => pickRole('merchant')}
        accessibilityRole='button'
        accessibilityLabel='Start BEACON shop mode'
      >
        <Text style={styles.asideCardTitle}>▶ BEACON</Text>
        <Text style={styles.asideCardBody}>
          Shop. Start broadcasting name, hours and today’s promo.
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
      <Text style={styles.asideFoot}>
        {picked
          ? `Mode on: ${role === 'merchant' ? 'BEACON' : 'SCAN'}`
          : 'Pick a mode to enter the app.'}
      </Text>
    </View>
  )
}

function makeStyles(c, height) {
  const phoneH = Math.min(Math.max(Math.floor(height - 100), 560), Math.floor(PHONE_W * (19.5 / 9)))
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
      ...(Platform.OS === 'web'
        ? {
            backgroundImage:
              'linear-gradient(rgba(28,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(28,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '32px 32px, 32px 32px'
          }
        : null)
    },
    safeNative: { flex: 1, backgroundColor: c.deep, width: '100%' },
    phoneNative: { flex: 1, backgroundColor: c.bg, width: '100%' },
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
    desktopRow: {
      flex: 1,
      width: '100%',
      maxWidth: 1100,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 36,
      paddingHorizontal: 28,
      paddingVertical: 20
    },
    desktopStack: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      overflow: 'auto'
    },
    deviceColumn: { alignItems: 'center', gap: 10, flexShrink: 0 },
    deviceLabel: {
      color: c.gold,
      fontFamily: pixelTitle,
      fontSize: 8,
      letterSpacing: 1.5,
      textAlign: 'center'
    },
    deviceHint: {
      color: c.muted,
      fontFamily: pixelBody,
      fontSize: 16,
      textAlign: 'center',
      maxWidth: PHONE_W
    },
    phoneFrame: {
      width: PHONE_W,
      height: phoneH,
      maxWidth: '100%',
      backgroundColor: c.bg,
      borderWidth: 3,
      borderColor: c.border,
      overflow: 'hidden',
      ...(Platform.OS === 'web'
        ? {
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '8px 8px 0 rgba(92,225,255,0.22)'
          }
        : null)
    },
    aside: {
      width: 300,
      maxWidth: '100%',
      gap: 12,
      padding: 8,
      flexShrink: 1
    },
    asideCompact: {
      width: '100%',
      maxWidth: 520,
      paddingBottom: 8
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
    asideCardBtn: { cursor: 'pointer' },
    asideCardPressed: {
      backgroundColor: c.greenDark,
      borderColor: c.sky
    },
    asideCardActive: {
      borderColor: c.ok || c.success || '#3DFF9A',
      backgroundColor: c.greenDark
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
