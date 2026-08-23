import { StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../../store/app.store';
import { colors } from '../../utils/colors';

export function ToastHost() {
  const toast = useAppStore((s) => s.toast);
  if (!toast) return null;
  return (
    <View style={styles.wrap}>
      <View style={styles.toast}>
        <Text style={styles.text}>{toast}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 78,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  toast: {
    backgroundColor: colors.navy,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '88%',
  },
  text: { color: colors.white, fontWeight: '700', fontSize: 13 },
});
