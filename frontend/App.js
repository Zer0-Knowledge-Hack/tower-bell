import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BrandLogo } from './src/components/common/BrandLogo';
import { ToastHost } from './src/components/common/ToastHost';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAppStore } from './src/store/app.store';
import { useThemeColors } from './src/utils/useThemeColors';

export default function App() {
  const hydrate = useAppStore((s) => s.hydrate);
  const ready = useAppStore((s) => s.ready);
  const c = useThemeColors();
  const darkMode = useAppStore((s) => !!s.db?.darkMode);
  const { width } = useWindowDimensions();
  const framed = Platform.OS === 'web' && width > 520;
  const styles = useMemo(() => makeStyles(c), [c]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <SafeAreaProvider>
      <View style={[styles.shell, framed && styles.shellWeb]}>
        <SafeAreaView style={styles.safe} edges={['top']}>
          <StatusBar style={darkMode ? 'light' : 'light'} />
          <View style={[styles.phone, framed && styles.phoneWeb]}>
            {ready ? (
              <AppNavigator />
            ) : (
              <View style={styles.boot}>
                <BrandLogo size={96} />
                <Text style={styles.bootTitle}>Towerbell</Text>
                <Text style={styles.bootLead}>Local map · P2P discovery</Text>
                <ActivityIndicator color={c.sky} style={{ marginTop: 16 }} />
                <Text style={styles.bootLoading}>Loading...</Text>
              </View>
            )}
            <ToastHost />
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    shell: { flex: 1, backgroundColor: c.header },
    shellWeb: { alignItems: 'center', backgroundColor: c.shell },
    safe: { flex: 1, backgroundColor: c.header, width: '100%', maxWidth: 480 },
    phone: { flex: 1, backgroundColor: c.bg, width: '100%' },
    phoneWeb: {
      maxWidth: 430,
      width: '100%',
      alignSelf: 'center',
      overflow: 'hidden',
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: c.border,
    },
    boot: {
      flex: 1,
      backgroundColor: c.deep,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: 24,
    },
    bootTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '800', letterSpacing: 1, marginTop: 8 },
    bootLead: { color: 'rgba(255,255,255,0.72)', fontSize: 14, textAlign: 'center' },
    bootLoading: { color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 8 },
  });
}
