import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { DefaultTheme, DarkTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useMemo } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon } from '../components/common/Icon'
import { AdminDashboardScreen } from '../screens/AdminDashboardScreen'
import { BeaconScreen } from '../screens/BeaconScreen'
import { DiscoverScreen } from '../screens/DiscoverScreen'
import { NetworkDebugScreen } from '../screens/NetworkDebugScreen'
import { NotificationsScreen } from '../screens/NotificationsScreen'
import { PermissionsScreen } from '../screens/PermissionsScreen'
import { RoleSelectScreen } from '../screens/RoleSelectScreen'
import { SettingsScreen } from '../screens/SettingsScreen'
import { VisitorsScreen } from '../screens/VisitorsScreen'
import { useAppStore } from '../store/app.store'
import { useThemeColors } from '../utils/useThemeColors'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function RoleTabBar({ icons, children }) {
  const insets = useSafeAreaInsets()
  const c = useThemeColors()
  const bottom = Math.max(insets.bottom, 8)
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: c.sky,
        tabBarInactiveTintColor: c.muted,
        tabBarLabelStyle: { fontSize: 10, fontFamily: 'monospace', fontWeight: '400' },
        tabBarStyle: {
          backgroundColor: c.deep,
          borderTopColor: c.border,
          borderTopWidth: 2,
          height: 56 + bottom,
          paddingBottom: bottom,
          paddingTop: 6
        },
        tabBarIcon: ({ color, size }) => <Icon name={icons[route.name]} size={size} color={color} />
      })}
    >
      {children}
    </Tab.Navigator>
  )
}

function VisitorTabs() {
  return (
    <RoleTabBar icons={{ Discover: 'compass' }}>
      <Tab.Screen name='Discover' component={DiscoverScreen} options={{ title: 'SCAN' }} />
    </RoleTabBar>
  )
}

function MerchantTabs() {
  return (
    <RoleTabBar icons={{ Beacon: 'signal', Hits: 'users' }}>
      <Tab.Screen name='Beacon' component={BeaconScreen} options={{ title: 'BEACON' }} />
      <Tab.Screen name='Hits' component={VisitorsScreen} options={{ title: 'HITS' }} />
    </RoleTabBar>
  )
}

function AdminTabs() {
  return (
    <RoleTabBar icons={{ Admin: 'shield', Red: 'wifi' }}>
      <Tab.Screen name='Admin' component={AdminDashboardScreen} options={{ title: 'Admin' }} />
      <Tab.Screen name='Red' component={NetworkDebugScreen} options={{ title: 'Network' }} />
    </RoleTabBar>
  )
}

function RoleTabs() {
  const role = useAppStore((s) => s.db?.user?.role || 'visitor')
  if (role === 'merchant') return <MerchantTabs />
  if (role === 'admin') return <AdminTabs />
  return <VisitorTabs />
}

export function AppNavigator() {
  const ready = useAppStore((s) => s.ready)
  const picked = useAppStore((s) => s.db?.pickedRole)
  const role = useAppStore((s) => s.db?.user?.role || 'visitor')
  const darkMode = useAppStore((s) => !!s.db?.darkMode)
  const c = useThemeColors()

  const theme = useMemo(
    () => ({
      ...(darkMode ? DarkTheme : DefaultTheme),
      colors: {
        ...(darkMode ? DarkTheme.colors : DefaultTheme.colors),
        background: c.bg,
        card: c.panel,
        text: c.ink,
        border: c.border,
        primary: c.sky
      }
    }),
    [c, darkMode]
  )

  if (!ready) {
    return null
  }

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg } }}
      >
        {!picked ? (
          <Stack.Screen name='RoleSelect' component={RoleSelectScreen} />
        ) : (
          <>
            <Stack.Screen name='Main' component={RoleTabs} key={role} />
            <Stack.Screen name='Settings' component={SettingsScreen} />
            <Stack.Screen name='Permissions' component={PermissionsScreen} />
            <Stack.Screen name='Notifications' component={NotificationsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
