import { Platform } from 'react-native'

let Notifications = null

async function loadNotifications() {
  if (Notifications) return Notifications
  try {
    Notifications = await import('expo-notifications')
    if (Platform.OS !== 'web') {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: true
        })
      })
    }
  } catch {
    Notifications = null
  }
  return Notifications
}

export async function ensureNotificationChannel() {
  const mod = await loadNotifications()
  if (!mod || Platform.OS !== 'android') return
  await mod.setNotificationChannelAsync('towerbell', {
    name: 'Towerbell',
    importance: mod.AndroidImportance.HIGH,
    vibrationPattern: [0, 180, 100, 180],
    lightColor: '#0D47A1'
  })
}

export async function notifyLocal({ title, body, data = {} }) {
  const mod = await loadNotifications()
  if (!mod) return false

  if (Platform.OS === 'web') {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      // eslint-disable-next-line no-new
      new Notification(title, { body, icon: '/favicon.png' })
      return true
    }
    return false
  }

  await ensureNotificationChannel()
  await mod.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true
    },
    trigger: null
  })
  return true
}
