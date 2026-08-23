import { useNavigation } from '@react-navigation/native'
import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { HeaderBar } from '../../components/common/HeaderBar'
import { RoleGuard } from '../../components/common/RoleGuard'
import { Icon } from '../../components/common/Icon'
import { useAppStore } from '../../store/app.store'
import { useThemeColors } from '../../utils/useThemeColors'

export function ChatScreen() {
  const navigation = useNavigation()
  const c = useThemeColors()
  const styles = useMemo(() => makeStyles(c), [c])
  const db = useAppStore((s) => s.db)
  const createTopic = useAppStore((s) => s.createTopic)
  const joinTopic = useAppStore((s) => s.joinTopic)
  const sendChat = useAppStore((s) => s.sendChat)
  const setActiveTopic = useAppStore((s) => s.setActiveTopic)
  const [name, setName] = useState('')
  const [draft, setDraft] = useState('')
  const chat = db?.chat || { topics: [], messages: {}, activeTopicId: null }
  const active = (chat.topics || []).find((t) => t.id === chat.activeTopicId)
  const messages = (active && chat.messages[active.id]) || []

  return (
    <RoleGuard feature='chat'>
      <View style={styles.screen}>
        <HeaderBar
          title='Nearby chat'
          subtitle='Create a topic and talk offline'
          onSettings={() => navigation.navigate('Settings')}
        />
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps='handled'>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder='Topic name'
              placeholderTextColor={c.muted}
              value={name}
              onChangeText={setName}
            />
            <Pressable
              style={styles.btn}
              onPress={() => {
                if (name.trim()) createTopic(name)
                setName('')
              }}
            >
              <Icon name='plus' size={16} color={c.headerText} />
              <Text style={styles.btnText}>Create</Text>
            </Pressable>
          </View>
          {(chat.topics || []).map((topic) => {
            const on = chat.activeTopicId === topic.id
            return (
              <Pressable
                key={topic.id}
                style={[styles.topic, on && styles.topicOn]}
                onPress={() => {
                  setActiveTopic(topic.id)
                  joinTopic(topic.id)
                }}
              >
                <View style={[styles.topicIcon, on && styles.topicIconOn]}>
                  <Icon name='users' size={18} color={on ? c.headerText : c.sky} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.topicName, on && styles.topicNameOn]}>{topic.name}</Text>
                  <Text style={styles.meta}>{topic.members.length} peers</Text>
                </View>
              </Pressable>
            )
          })}
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
                  placeholder='Message the topic'
                  placeholderTextColor={c.muted}
                  value={draft}
                  onChangeText={setDraft}
                />
                <Pressable
                  style={styles.sendBtn}
                  onPress={() => {
                    sendChat(draft)
                    setDraft('')
                  }}
                >
                  <Icon name='send' size={16} color={c.headerText} />
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Icon name='users' size={28} color={c.muted} />
              <Text style={styles.empty}>
                Create or join a topic to talk with peers. No internet needed.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </RoleGuard>
  )
}

function makeStyles(c) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    body: { padding: 16, gap: 10, paddingBottom: 32 },
    row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    input: {
      flex: 1,
      backgroundColor: c.panel,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 10,
      minHeight: 46,
      paddingHorizontal: 12,
      color: c.ink
    },
    btn: {
      backgroundColor: c.header,
      borderRadius: 10,
      minHeight: 46,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingHorizontal: 14
    },
    btnText: { color: c.headerText, fontWeight: '800' },
    sendBtn: {
      backgroundColor: c.header,
      borderRadius: 10,
      minWidth: 46,
      minHeight: 46,
      alignItems: 'center',
      justifyContent: 'center'
    },
    topic: {
      backgroundColor: c.panel,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    },
    topicOn: { borderColor: c.sky, backgroundColor: c.greenDark },
    topicIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: c.greenDark,
      alignItems: 'center',
      justifyContent: 'center'
    },
    topicIconOn: { backgroundColor: c.header },
    topicName: { color: c.ink, fontWeight: '800', fontSize: 15 },
    topicNameOn: { color: c.navy },
    meta: { color: c.muted, fontSize: 12, marginTop: 2 },
    thread: {
      backgroundColor: c.panel,
      borderRadius: 14,
      padding: 12,
      gap: 8,
      borderWidth: 1,
      borderColor: c.border
    },
    msg: { color: c.ink, fontSize: 14, lineHeight: 20 },
    from: { color: c.navy, fontWeight: '800' },
    emptyBox: {
      backgroundColor: c.panel,
      borderRadius: 14,
      padding: 20,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      gap: 10
    },
    empty: { color: c.muted, textAlign: 'center', lineHeight: 20 }
  })
}
