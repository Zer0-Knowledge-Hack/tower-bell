import { useNavigation } from '@react-navigation/native'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { HeaderBar } from '../components/common/HeaderBar'
import { Icon } from '../components/common/Icon'
import { useAppStore } from '../store/app.store'
import { colors } from '../utils/colors'

export function NotificationsScreen() {
  const navigation = useNavigation()
  const db = useAppStore((s) => s.db)
  const markNotificationsRead = useAppStore((s) => s.markNotificationsRead)
  const clearNotifications = useAppStore((s) => s.clearNotifications)
  const items = db?.notifications || []

  return (
    <View style={styles.screen}>
      <HeaderBar title='Notifications' subtitle='Peer and beacon alerts' showBell={false} />
      <ScrollView contentContainerStyle={styles.body}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Icon name='arrow-left' size={16} color={colors.ink} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <View style={styles.actions}>
          <Pressable style={styles.action} onPress={markNotificationsRead}>
            <Text style={styles.actionText}>Mark as read</Text>
          </Pressable>
          <Pressable style={styles.action} onPress={clearNotifications}>
            <Text style={[styles.actionText, { color: colors.rose }]}>Clear all</Text>
          </Pressable>
        </View>

        {!items.length ? (
          <View style={styles.empty}>
            <Icon name='bell' size={28} color={colors.sky} />
            <Text style={styles.emptyTitle}>No alerts yet</Text>
            <Text style={styles.emptyText}>
              When a place appears nearby or someone visits your beacon, you will see it here and in
              the bell.
            </Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={[styles.card, !item.read && styles.cardUnread]}>
              <View style={styles.icon}>
                <Icon
                  name={item.kind === 'visitor' ? 'users' : 'radar'}
                  size={16}
                  color={colors.navy}
                />
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

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 16, gap: 10, paddingBottom: 36 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backText: { color: colors.ink, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 8 },
  action: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  actionText: { color: colors.navy, fontWeight: '800', fontSize: 12 },
  empty: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: 'center',
    gap: 8
  },
  emptyTitle: { color: colors.navy, fontWeight: '800', fontSize: 16 },
  emptyText: { color: colors.muted, textAlign: 'center', lineHeight: 20 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    flexDirection: 'row',
    gap: 10
  },
  cardUnread: { borderColor: colors.sky, backgroundColor: '#F4F9FF' },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.greenDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: { color: colors.ink, fontWeight: '800' },
  bodyText: { color: colors.muted, marginTop: 2, fontSize: 13, lineHeight: 18 },
  meta: { color: colors.muted, fontSize: 11, marginTop: 6 }
})
