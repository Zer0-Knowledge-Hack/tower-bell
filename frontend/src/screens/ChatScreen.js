import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { HeaderBar } from '../components/common/HeaderBar';
import { RoleGuard } from '../components/common/RoleGuard';
import { Icon } from '../components/common/Icon';
import { useAppStore } from '../store/app.store';
import { colors } from '../utils/colors';

export function ChatScreen() {
  const navigation = useNavigation();
  const db = useAppStore((s) => s.db);
  const createTopic = useAppStore((s) => s.createTopic);
  const joinTopic = useAppStore((s) => s.joinTopic);
  const sendChat = useAppStore((s) => s.sendChat);
  const setActiveTopic = useAppStore((s) => s.setActiveTopic);
  const [name, setName] = useState('');
  const [draft, setDraft] = useState('');
  const chat = db?.chat || { topics: [], messages: {}, activeTopicId: null };
  const active = (chat.topics || []).find((t) => t.id === chat.activeTopicId);
  const messages = (active && chat.messages[active.id]) || [];

  return (
    <RoleGuard feature="chat">
      <View style={styles.screen}>
        <HeaderBar
          title="Nearby chat"
          subtitle="Create a topic and talk offline"
          onSettings={() => navigation.navigate('Settings')}
        />
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Topic name"
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
            />
            <Pressable
              style={styles.btn}
              onPress={() => {
                if (name.trim()) createTopic(name);
                setName('');
              }}
            >
              <Text style={styles.btnText}>Create</Text>
            </Pressable>
          </View>
          {(chat.topics || []).map((topic) => (
            <Pressable
              key={topic.id}
              style={[styles.topic, chat.activeTopicId === topic.id && styles.topicOn]}
              onPress={() => {
                setActiveTopic(topic.id);
                joinTopic(topic.id);
              }}
            >
              <Icon name="users" size={16} color={colors.navy} />
              <View style={{ flex: 1 }}>
                <Text style={styles.topicName}>{topic.name}</Text>
                <Text style={styles.meta}>{topic.members.length} peers</Text>
              </View>
            </Pressable>
          ))}
          {active ? (
            <View style={styles.thread}>
              {messages.map((msg) => (
                <Text key={msg.id} style={styles.msg}>
                  <Text style={styles.from}>{msg.from}: </Text>
                  {msg.text}
                </Text>
              ))}
              <View style={styles.row}>
                <TextInput
                  style={styles.input}
                  placeholder="Message the topic"
                  placeholderTextColor={colors.muted}
                  value={draft}
                  onChangeText={setDraft}
                />
                <Pressable
                  style={styles.btn}
                  onPress={() => {
                    sendChat(draft);
                    setDraft('');
                  }}
                >
                  <Icon name="send" size={16} color={colors.white} />
                </Pressable>
              </View>
            </View>
          ) : (
            <Text style={styles.empty}>Create or join a topic to talk with peers. No internet needed.</Text>
          )}
        </ScrollView>
      </View>
    </RoleGuard>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 16, gap: 10, paddingBottom: 32 },
  row: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    minHeight: 46,
    paddingHorizontal: 12,
    color: colors.ink,
  },
  btn: {
    backgroundColor: colors.navy,
    borderRadius: 10,
    minWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  btnText: { color: colors.white, fontWeight: '800' },
  topic: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  topicOn: { borderColor: colors.navy, backgroundColor: colors.greenDark },
  topicName: { color: colors.ink, fontWeight: '800' },
  meta: { color: colors.muted, fontSize: 12 },
  thread: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  msg: { color: colors.ink, fontSize: 14, lineHeight: 20 },
  from: { color: colors.navy, fontWeight: '800' },
  empty: { color: colors.muted, textAlign: 'center', paddingVertical: 16 },
});
