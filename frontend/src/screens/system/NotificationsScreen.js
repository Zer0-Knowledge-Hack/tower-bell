import { useNavigation } from '@react-navigation/native'
import { useMemo } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { HeaderBar } from '../../components/common/HeaderBar'
import { Icon } from '../../components/common/Icon'
import { useAppStore } from '../../store/app.store'
import { pixelBody, pixelTitle } from '../../utils/pixel'
import { useThemeColors } from '../../utils/useThemeColors'

export function NotificationsScreen() {
  const navigation = useNavigation()
  const c = useThemeColors()
  const styles = useMemo(() => makeStyles(c), [c])
  const db = useAppStore((s) => s.db)
  const markNotificationsRead = useAppStore((s) => s.markNotificationsRead)
  const clearNotifications = useAppStore((s) => s.clearNotifications)
  const items = db?.notifications || []

  return (
    <View style={styles.screen}>
      <HeaderBar title='NOTIFICATIONS' subtitle='Peer and beacon alerts' showBell={false} />
      <ScrollView contentContainerStyle={styles.body}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Icon name='arrow-left' size={16} color={c.ink} />
          <Text style={styles.backText}>BACK</Text>
        </Pressable>

        <View style={styles.actions}>
          <Pressable style={styles.action} onPress={markNotificationsRead}>
            <Text style={styles.actionText}>MARK READ</Text>
          </Pressable>
          <Pressable style={[styles.action, styles.actionDanger]} onPress={clearNotifications}>
            <Text style={[styles.actionText, { color: c.rose }]}>CLEAR</Text>
          </Pressable>
        </View>

        {!items.length ? (
          <View style={styles.empty}>
            <Icon name='bell' size={28} color={c.sky} />
            <Text style={styles.emptyTitle}>NO ALERTS YET</Text>
            <Text style={styles.emptyText}>
              When a place appears nearby or someone visits your beacon, it shows here and on the
              bell.
            </Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={[styles.card, !item.read && styles.cardUnread]}>
              {!item.read ? <View style={styles.unreadPip} /> : null}
              <View style={styles.icon}>
                <Icon name={item.kind === 'visitor' ? 'users' : 'radar'} size={16} color={c.sky} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.bodyText}>{item.body}</Text>
                <Text style={styles.meta}>{new Date(item.at).toLocaleString()}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

function makeStyles(c) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    body: { padding: 16, gap: 10, paddingBottom: 36 },
    back: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    backText: {
      color: c.ink,
      fontFamily: pixelTitle,
      fontSize: 9,
      letterSpacing: 1
    },
    actions: { flexDirection: 'row', gap: 8 },
    action: {
      backgroundColor: c.panel,
      borderWidth: 2,
      borderColor: c.border,
      borderRadius: 0,
      paddingHorizontal: 12,
      paddingVertical: 10,
      cursor: 'pointer'
    },
    actionDanger: { borderColor: c.rose },
    actionText: {
      color: c.sky,
      fontFamily: pixelTitle,
      fontSize: 8,
      letterSpacing: 0.5
    },
    empty: {
      backgroundColor: c.panel,
      borderRadius: 0,
      borderWidth: 2,
      borderColor: c.border,
      padding: 24,
      alignItems: 'center',
      gap: 8
    },
    emptyTitle: {
      color: c.sky,
      fontFamily: pixelTitle,
      fontSize: 10,
      letterSpacing: 1
    },
    emptyText: {
      color: c.muted,
      textAlign: 'center',
      lineHeight: 20,
      fontFamily: pixelBody,
      fontSize: 17
    },
    card: {
      backgroundColor: c.panel,
      borderRadius: 0,
      borderWidth: 2,
      borderColor: c.border,
      padding: 12,
      flexDirection: 'row',
      gap: 10,
      alignItems: 'flex-start'
    },
    cardUnread: {
      borderColor: c.highlightBorder || c.sky,
      backgroundColor: c.unread || c.highlight
    },
    unreadPip: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      backgroundColor: c.gold
    },
    icon: {
      width: 34,
      height: 34,
      borderRadius: 0,
      borderWidth: 2,
      borderColor: c.border,
      backgroundColor: c.greenDark,
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      color: c.ink,
      fontFamily: pixelTitle,
      fontSize: 9,
      letterSpacing: 0.4
    },
    bodyText: {
      color: c.muted,
      marginTop: 4,
      fontSize: 16,
      lineHeight: 20,
      fontFamily: pixelBody
    },
    meta: {
      color: c.muted,
      fontSize: 14,
      marginTop: 6,
      fontFamily: pixelBody
    }
  })
}
