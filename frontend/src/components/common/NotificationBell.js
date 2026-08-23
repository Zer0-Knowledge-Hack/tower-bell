import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../../store/app.store';
import { colors } from '../../utils/colors';
import { Icon } from './Icon';

export function NotificationBell() {
  const navigation = useNavigation();
  const unread = useAppStore((s) => (s.db?.notifications || []).filter((n) => !n.read).length);

  return (
    <Pressable
      onPress={() => navigation.navigate('Notifications')}
      hitSlop={10}
      style={styles.btn}
      accessibilityLabel="Notifications"
    >
      <Icon name="bell" size={18} color={colors.white} />
      {unread > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F0A43A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: colors.deep, fontSize: 9, fontWeight: '800' },
});
