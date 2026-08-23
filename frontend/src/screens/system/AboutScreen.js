import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BrandLogo } from '../../components/common/BrandLogo';
import { HeaderBar } from '../../components/common/HeaderBar';
import { Icon } from '../../components/common/Icon';
import { PITCH } from '../../constants/pitch';
import { useThemeColors } from '../../utils/useThemeColors';

export function AboutScreen() {
  const navigation = useNavigation();
  const c = useThemeColors();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <View style={styles.screen}>
      <HeaderBar title="About Towerbell" subtitle="Pitch for judges" showBell={false} />
      <ScrollView contentContainerStyle={styles.body}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={16} color={c.ink} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <View style={styles.hero}>
          <BrandLogo size={72} />
          <Text style={styles.brand}>{PITCH.name}</Text>
          <Text style={styles.tagline}>{PITCH.oneLiner}</Text>
        </View>

        <Card title="Problem" body={PITCH.problem} c={c} styles={styles} />
        <Card title="Solution" body={PITCH.solution} c={c} styles={styles} />
        <Card title="How it works" body={PITCH.how} c={c} styles={styles} />

        <Text style={styles.section}>WHY IT SCORES</Text>
        {PITCH.criteria.map((item) => (
          <View key={item.title} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody}>{item.body}</Text>
          </View>
        ))}

        <Text style={styles.section}>90-SECOND DEMO</Text>
        {PITCH.demoSteps.map((step, i) => (
          <View key={step} style={styles.step}>
            <Text style={styles.stepNum}>{i + 1}</Text>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function Card({ title, body, styles }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardBody}>{body}</Text>
    </View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    body: { padding: 16, gap: 10, paddingBottom: 40 },
    back: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    backText: { color: c.ink, fontWeight: '700' },
    hero: { alignItems: 'center', gap: 8, paddingVertical: 8 },
    brand: { color: c.sky, fontWeight: '800', letterSpacing: 2, fontSize: 16 },
    tagline: { color: c.ink, fontWeight: '800', fontSize: 18, textAlign: 'center', lineHeight: 24 },
    section: { color: c.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 8 },
    card: {
      backgroundColor: c.panel,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      padding: 14,
      gap: 6,
    },
    cardTitle: { color: c.sky, fontWeight: '800' },
    cardBody: { color: c.ink, lineHeight: 20, fontSize: 13 },
    step: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'flex-start',
      backgroundColor: c.panel,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      padding: 12,
    },
    stepNum: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: c.header,
      color: c.headerText,
      textAlign: 'center',
      fontWeight: '800',
      overflow: 'hidden',
      lineHeight: 24,
    },
    stepText: { flex: 1, color: c.ink, lineHeight: 20, fontSize: 13 },
  });
}
