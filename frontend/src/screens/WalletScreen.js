import { useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { HeaderBar } from '../components/common/HeaderBar';
import { RoleGuard } from '../components/common/RoleGuard';
import { Icon } from '../components/common/Icon';
import { useAppStore } from '../store/app.store';
import { colors } from '../utils/colors';

export function WalletScreen() {
  const navigation = useNavigation();
  const db = useAppStore((s) => s.db);
  const topUp = useAppStore((s) => s.topUp);
  const send = useAppStore((s) => s.send);
  const wallet = db?.wallet || { balance: 0, transactions: [], loyaltyCards: [] };

  return (
    <RoleGuard feature="wallet">
    <View style={styles.screen}>
      <HeaderBar
        title="Wallet"
        subtitle={`Balance: $${Number(wallet.balance).toFixed(2)}`}
        onSettings={() => navigation.navigate('Settings')}
      />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.balance}>
          <Text style={styles.caption}>TOTAL</Text>
          <Text style={styles.amount}>${Number(wallet.balance).toFixed(2)}</Text>
          <View style={styles.actions}>
            <Action icon="plus" label="Top Up" onPress={() => topUp(10)} />
            <Action icon="send" label="Send" onPress={() => send(5)} />
            <Action icon="download" label="Receive" onPress={() => topUp(5)} />
          </View>
        </View>

        <Text style={styles.section}>SAVED PROMOS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cards}>
          {wallet.loyaltyCards.length ? (
            wallet.loyaltyCards.map((card) => (
              <View key={card.id} style={styles.loyalty}>
                <Icon name="store" size={18} color={colors.green} />
                <Text style={styles.cardName}>{card.name}</Text>
                <Text style={styles.cardPts}>{card.points} pts</Text>
                <Text style={styles.cardPromo} numberOfLines={2}>{card.promotion}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.empty}>Save a place from Discover to create a card.</Text>
          )}
        </ScrollView>

        <Text style={styles.section}>TRANSACTIONS</Text>
        {wallet.transactions.length ? (
          wallet.transactions.map((tx) => (
            <View key={tx.id} style={styles.tx}>
              <View style={styles.txIcon}>
                <Icon
                  name={tx.type === 'in' ? 'arrow-down-left' : 'arrow-up-right'}
                  size={16}
                  color={tx.type === 'in' ? colors.green : colors.rose}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txName}>{tx.merchant}</Text>
                <Text style={styles.txNote}>{tx.note} · {new Date(tx.at).toLocaleString()}</Text>
              </View>
              <Text style={[styles.txAmt, { color: tx.type === 'in' ? colors.green : colors.rose }]}>
                {tx.type === 'in' ? '+' : '-'}${tx.amount}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No transactions yet.</Text>
        )}
      </ScrollView>
    </View>
    </RoleGuard>
  );
}

function Action({ icon, label, onPress }) {
  return (
    <Pressable style={styles.action} onPress={onPress}>
      <Icon name={icon} size={16} color={colors.white} />
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 16, gap: 12, paddingBottom: 36 },
  balance: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 18,
  },
  caption: { color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  amount: { color: colors.text, fontSize: 36, fontWeight: '800', marginVertical: 8 },
  actions: { flexDirection: 'row', gap: 8 },
  action: {
    flex: 1,
    backgroundColor: colors.green,
    borderRadius: 10,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionText: { color: colors.white, fontWeight: '800', fontSize: 12 },
  section: { color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  cards: { gap: 10 },
  loyalty: {
    width: 180,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  cardName: { color: colors.text, fontWeight: '800' },
  cardPts: { color: colors.green, fontWeight: '800' },
  cardPromo: { color: colors.muted, fontSize: 12 },
  empty: { color: colors.muted },
  tx: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
  },
  txIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.panelAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txName: { color: colors.text, fontWeight: '700' },
  txNote: { color: colors.muted, fontSize: 11, marginTop: 2 },
  txAmt: { fontWeight: '800' },
});
