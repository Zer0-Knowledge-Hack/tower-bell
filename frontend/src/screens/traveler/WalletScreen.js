import { useNavigation } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { HeaderBar } from '../../components/common/HeaderBar';
import { Icon } from '../../components/common/Icon';
import { PromoBanner } from '../../components/common/PromoBanner';
import { RoleGuard } from '../../components/common/RoleGuard';
import { SkeletonWallet } from '../../components/common/Skeleton';
import { useAppStore } from '../../store/app.store';
import { useThemeColors } from '../../utils/useThemeColors';

const PAGE = 5;
const CARD_COLORS = ['#0D47A1', '#1565C0', '#0277BD', '#00695C', '#4527A0'];

export function WalletScreen() {
  const navigation = useNavigation();
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const db = useAppStore((s) => s.db);
  const topUp = useAppStore((s) => s.topUp);
  const send = useAppStore((s) => s.send);
  const wallet = db?.wallet || { balance: 0, transactions: [], loyaltyCards: [] };
  const [hideBalance, setHideBalance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [txPage, setTxPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const balance = Number(wallet.balance).toFixed(2);
  const shown = hideBalance ? '••••••' : `$${balance}`;
  const txVisible = (wallet.transactions || []).slice(0, txPage * PAGE);
  const hasMoreTx = (wallet.transactions || []).length > txVisible.length;

  return (
    <RoleGuard feature="wallet">
      <View style={styles.screen}>
        <HeaderBar
          title="Wallet"
          subtitle="Balance & loyalty cards"
          onSettings={() => navigation.navigate('Settings')}
        />
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {loading ? (
            <SkeletonWallet />
          ) : (
            <>
              <PromoBanner
                onPressCta={() => {
                  navigation.navigate('Discover');
                }}
              />

              <View style={styles.hero}>
                <View style={styles.heroTop}>
                  <View>
                    <Text style={styles.caption}>AVAILABLE BALANCE</Text>
                    <Text style={styles.amount}>{shown}</Text>
                  </View>
                  <Pressable
                    style={styles.eyeBtn}
                    onPress={() => setHideBalance((v) => !v)}
                    accessibilityLabel={hideBalance ? 'Show balance' : 'Hide balance'}
                  >
                    <Icon name={hideBalance ? 'eye-off' : 'eye'} size={18} color="#FFFFFF" />
                  </Pressable>
                </View>
                <View style={styles.actions}>
                  <Action icon="plus" label="Top up" onPress={() => topUp(10)} styles={styles} />
                  <Action icon="send" label="Send" onPress={() => send(5)} styles={styles} />
                  <Action icon="download" label="Receive" onPress={() => topUp(5)} styles={styles} />
                </View>
              </View>

              <View style={styles.sectionRow}>
                <Text style={styles.section}>LOYALTY CARDS</Text>
                <Text style={styles.count}>{wallet.loyaltyCards.length}</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cards}>
                {wallet.loyaltyCards.length ? (
                  wallet.loyaltyCards.map((card, i) => (
                    <View
                      key={card.id}
                      style={[styles.plastic, { backgroundColor: CARD_COLORS[i % CARD_COLORS.length] }]}
                    >
                      <View style={styles.plasticTop}>
                        <Icon name="store" size={18} color="#FFFFFF" />
                        <Text style={styles.chipPts}>{card.points} pts</Text>
                      </View>
                      <Text style={styles.plasticName} numberOfLines={1}>
                        {card.name}
                      </Text>
                      <Text style={styles.plasticPromo} numberOfLines={2}>
                        {card.promotion || 'Loyalty member'}
                      </Text>
                      <Text style={styles.plasticFoot}>TOWERBELL · LOCAL</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyCard}>
                    <Icon name="credit-card" size={22} color={c.sky} />
                    <Text style={styles.emptyTitle}>No cards yet</Text>
                    <Text style={styles.empty}>Save a place from Nearby to create a loyalty card.</Text>
                  </View>
                )}
              </ScrollView>

              <View style={styles.sectionRow}>
                <Text style={styles.section}>ACTIVITY</Text>
                <Text style={styles.count}>{wallet.transactions.length}</Text>
              </View>
              {txVisible.length ? (
                txVisible.map((tx) => (
                  <View key={tx.id} style={styles.tx}>
                    <View style={[styles.txIcon, tx.type === 'in' ? styles.txIn : styles.txOut]}>
                      <Icon
                        name={tx.type === 'in' ? 'arrow-down-left' : 'arrow-up-right'}
                        size={16}
                        color={tx.type === 'in' ? c.success : c.rose}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.txName}>{tx.merchant}</Text>
                      <Text style={styles.txNote}>
                        {tx.note} · {new Date(tx.at).toLocaleString()}
                      </Text>
                    </View>
                    <Text style={[styles.txAmt, { color: tx.type === 'in' ? c.success : c.rose }]}>
                      {tx.type === 'in' ? '+' : '-'}${tx.amount}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.emptyCard}>
                  <Text style={styles.empty}>No transactions yet. Top up to start.</Text>
                </View>
              )}

              {hasMoreTx ? (
                <Pressable style={styles.more} onPress={() => setTxPage((p) => p + 1)}>
                  <Text style={styles.moreText}>Load more</Text>
                </Pressable>
              ) : null}
            </>
          )}
        </ScrollView>
      </View>
    </RoleGuard>
  );
}

function Action({ icon, label, onPress, styles }) {
  return (
    <Pressable style={styles.action} onPress={onPress}>
      <View style={styles.actionIcon}>
        <Icon name={icon} size={16} color="#FFFFFF" />
      </View>
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    body: { padding: 16, gap: 14, paddingBottom: 40 },
    hero: {
      backgroundColor: c.header,
      borderRadius: 22,
      padding: 18,
      gap: 16,
    },
    heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    caption: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
    amount: { color: '#FFFFFF', fontSize: 36, fontWeight: '800', marginTop: 6 },
    eyeBtn: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: 'rgba(255,255,255,0.16)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    actions: { flexDirection: 'row', gap: 10 },
    action: { flex: 1, alignItems: 'center', gap: 6 },
    actionIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: 'rgba(255,255,255,0.16)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
    sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    section: { color: c.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
    count: {
      color: c.sky,
      fontWeight: '800',
      fontSize: 12,
      backgroundColor: c.greenDark,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 999,
      overflow: 'hidden',
    },
    cards: { gap: 12, paddingVertical: 2 },
    plastic: {
      width: 220,
      minHeight: 132,
      borderRadius: 18,
      padding: 16,
      justifyContent: 'space-between',
    },
    plasticTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    chipPts: {
      color: '#0A110F',
      backgroundColor: '#F0A43A',
      fontWeight: '800',
      fontSize: 11,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      overflow: 'hidden',
    },
    plasticName: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginTop: 16 },
    plasticPromo: { color: 'rgba(255,255,255,0.85)', fontSize: 12, lineHeight: 16, marginTop: 4 },
    plasticFoot: { color: 'rgba(255,255,255,0.55)', fontSize: 10, fontWeight: '700', letterSpacing: 1, marginTop: 12 },
    emptyCard: {
      backgroundColor: c.panel,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 16,
      padding: 16,
      gap: 6,
      minWidth: 240,
    },
    emptyTitle: { color: c.ink, fontWeight: '800' },
    empty: { color: c.muted, lineHeight: 18 },
    tx: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: c.panel,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      padding: 12,
    },
    txIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    txIn: { backgroundColor: 'rgba(31,138,76,0.12)' },
    txOut: { backgroundColor: 'rgba(198,40,40,0.12)' },
    txName: { color: c.text, fontWeight: '700' },
    txNote: { color: c.muted, fontSize: 11, marginTop: 2 },
    txAmt: { fontWeight: '800' },
    more: {
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.panel,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    moreText: { color: c.sky, fontWeight: '800' },
  });
}
