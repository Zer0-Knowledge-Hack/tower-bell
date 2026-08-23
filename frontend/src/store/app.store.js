import { beacon, scan, toUiRecord } from '../../backend'
import { notifyLocal } from '../api/notifications.service'
import { p2p } from '../api/p2p.service'
import { storage } from '../api/storage.service'
import { validateAdmin, validateBeacon } from '../api/validate'
import { requestAllPermissions, requestDevicePermission } from '../utils/permissions'
import { create } from 'zustand'

let network = null
let liveBeacon = null
let announcePeers = false

export const useAppStore = create((set, get) => ({
  ready: false,
  db: null,
  peers: [],
  p2pStatus: 'idle',
  selectedMerchant: null,
  filter: 'All',
  toast: '',

  async hydrate() {
    if (get().ready) return
    const db = await storage.load()
    network = scan()
    network.on('peer-found', (record) => {
      set({ peers: network.list().map((item) => toUiRecord(item)), p2pStatus: 'connected' })
      if (announcePeers) {
        get().pushToast(`New place nearby: ${record.name}`)
        get().pushNotification({
          kind: 'peer',
          title: 'Place nearby',
          body: `${record.name}${record.message ? ` — ${record.message}` : ''}`
        })
      }
      get().addLog(`peer-found ${record.name}`)
    })
    network.on('status', ({ connected }) => {
      set({ p2pStatus: connected ? 'connected' : 'scanning' })
    })
    set({ db, ready: true, p2pStatus: 'scanning' })
    setTimeout(() => {
      announcePeers = true
    }, 4500)
  },

  async persist(next) {
    set({ db: next })
    await storage.save(next)
  },

  pushToast(toast) {
    set({ toast })
    setTimeout(() => {
      if (get().toast === toast) set({ toast: '' })
    }, 2400)
  },

  async pushNotification({ kind = 'info', title, body }) {
    const { db } = get()
    if (!db) return
    const item = {
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      kind,
      title,
      body,
      read: false,
      at: new Date().toISOString()
    }
    const notifications = [item, ...(db.notifications || [])].slice(0, 60)
    await get().persist({ ...db, notifications })
    if (db.permissions?.notifications) {
      await notifyLocal({ title, body, data: { kind, id: item.id } })
    }
  },

  async markNotificationsRead() {
    const { db } = get()
    if (!db) return
    const notifications = (db.notifications || []).map((item) => ({ ...item, read: true }))
    await get().persist({ ...db, notifications })
  },

  async clearNotifications() {
    const { db } = get()
    if (!db) return
    await get().persist({ ...db, notifications: [] })
  },

  async addLog(message) {
    const { db } = get()
    if (!db) return
    const logs = [{ at: new Date().toISOString(), message }, ...(db.logs || [])].slice(0, 40)
    await get().persist({ ...db, logs })
  },

  startScan() {
    get().pushToast('Looking for nearby beacons...')
    if (network?.start) network.start()
    set({ p2pStatus: 'scanning' })
  },

  setFilter(filter) {
    set({ filter })
  },

  setDiscoverView(discoverView) {
    const { db } = get()
    if (!db) return
    get().persist({ ...db, discoverView })
  },

  async setDarkMode(darkMode) {
    const { db } = get()
    await get().persist({ ...db, darkMode: !!darkMode })
  },

  selectMerchant(selectedMerchant) {
    set({ selectedMerchant })
  },

  async connectPeer(merchant) {
    const { db } = get()
    await get().persist({
      ...db,
      beacon: { ...db.beacon, uniqueConnections: (db.beacon.uniqueConnections || 0) + 1 }
    })
    get().pushToast(`Connected to ${merchant.name}`)
  },

  async saveToWallet(merchant) {
    const { db } = get()
    const promo = merchant.message || merchant.promotion
    const exists = db.wallet.loyaltyCards.some((card) => card.merchantId === merchant.id)
    const loyaltyCards = exists
      ? db.wallet.loyaltyCards.map((card) =>
          card.merchantId === merchant.id
            ? { ...card, points: card.points + 10, promotion: promo }
            : card
        )
      : [
          ...db.wallet.loyaltyCards,
          {
            id: `card-${merchant.id}`,
            merchantId: merchant.id,
            name: merchant.name,
            category: merchant.category,
            promotion: promo,
            points: 10
          }
        ]
    const transactions = [
      {
        id: `tx-${Date.now()}`,
        type: 'in',
        merchant: merchant.name,
        amount: 10,
        note: 'Loyalty points',
        at: new Date().toISOString()
      },
      ...db.wallet.transactions
    ]
    await get().persist({ ...db, wallet: { ...db.wallet, loyaltyCards, transactions } })
    get().pushToast(`Saved 10 points at ${merchant.name}`)
    get().pushNotification({
      kind: 'wallet',
      title: 'Promo saved',
      body: `${merchant.name}: ${promo || 'loyalty card'}`
    })
  },

  async saveBeacon(form) {
    const check = validateBeacon(form)
    if (!check.ok) return check
    const { db } = get()
    const next = { ...db.beacon, ...form }
    if (liveBeacon) await liveBeacon.update(form)
    await get().persist({ ...db, beacon: next })
    get().pushToast('Beacon updated. Nearby travelers will see it.')
    return check
  },

  async setBroadcasting(on) {
    const { db } = get()
    if (on) {
      const check = validateBeacon(db.beacon)
      if (!check.ok) return check
      if (liveBeacon) await liveBeacon.stop()
      liveBeacon = beacon(db.beacon)
      liveBeacon.on('visitor', ({ total }) => {
        const current = get().db
        if (!current) return
        get().persist({
          ...current,
          beacon: { ...current.beacon, peersSeen: total, uniqueConnections: total }
        })
        get().pushNotification({
          kind: 'visitor',
          title: 'New visitor',
          body: `Someone is near your beacon. Total: ${total}`
        })
      })
      await get().persist({ ...db, beacon: { ...db.beacon, broadcasting: true } })
      get().pushToast('Beacon is live. Keep background permission on.')
      get().pushNotification({
        kind: 'beacon',
        title: 'Beacon live',
        body: `${db.beacon.name} is broadcasting nearby.`
      })
      return check
    }
    if (liveBeacon) {
      await liveBeacon.stop()
      liveBeacon = null
    }
    await get().persist({ ...db, beacon: { ...db.beacon, broadcasting: false } })
    get().pushToast('Beacon stopped')
    return { ok: true, errors: {} }
  },

  async topUp(amount = 10) {
    const { db } = get()
    const transactions = [
      {
        id: `tx-${Date.now()}`,
        type: 'in',
        merchant: 'Top Up',
        amount,
        note: 'Mock top up',
        at: new Date().toISOString()
      },
      ...db.wallet.transactions
    ]
    await get().persist({
      ...db,
      wallet: {
        ...db.wallet,
        balance: Number((db.wallet.balance + amount).toFixed(2)),
        transactions
      }
    })
    get().pushToast('Balance updated')
  },

  async send(amount = 5) {
    const { db } = get()
    if (db.wallet.balance < amount) {
      get().pushToast('Insufficient balance')
      return
    }
    const transactions = [
      {
        id: `tx-${Date.now()}`,
        type: 'out',
        merchant: 'P2P send',
        amount,
        note: 'Mock send',
        at: new Date().toISOString()
      },
      ...db.wallet.transactions
    ]
    await get().persist({
      ...db,
      wallet: {
        ...db.wallet,
        balance: Number((db.wallet.balance - amount).toFixed(2)),
        transactions
      }
    })
    get().pushToast('Send simulated')
  },

  async setRole(role) {
    const { db } = get()
    if (!db) return
    const names = { visitor: 'Traveler', merchant: 'Shop', admin: 'Admin' }
    const next = {
      ...db,
      pickedRole: true,
      permissionsReady: true,
      user: { ...db.user, role, name: names[role] || db.user.name }
    }
    // Sync store first so web UI leaves RoleSelect immediately.
    set({
      db: next,
      selectedMerchant: null,
      peers: role === 'visitor' ? get().peers : []
    })
    await storage.save(next)
  },

  async pickRole(role) {
    await get().setRole(role)
  },

  async setPermission(id) {
    const result = await requestDevicePermission(id)
    const { db } = get()
    await get().persist({
      ...db,
      permissions: { ...(db.permissions || {}), [id]: result.granted }
    })
    get().pushToast(result.note)
    return result
  },

  async grantAllPermissions() {
    const { db } = get()
    const results = await requestAllPermissions()
    const permissions = { ...(db.permissions || {}) }
    Object.entries(results).forEach(([id, result]) => {
      permissions[id] = result.granted
    })
    await get().persist({ ...db, permissions, permissionsReady: true })
    get().pushToast('Permissions saved. Towerbell is ready.')
    if (permissions.notifications) {
      get().pushNotification({
        kind: 'system',
        title: 'Notifications ready',
        body: 'We will alert you when a place is nearby or someone visits your beacon.'
      })
    }
    return permissions
  },

  async completePermissions() {
    const { db } = get()
    await get().persist({ ...db, permissionsReady: true })
  },

  async createTopic(name) {
    const { db } = get()
    const topic = p2p.createTopic(name, db.user.name)
    const chat = {
      topics: [topic, ...(db.chat?.topics || [])],
      messages: { ...(db.chat?.messages || {}), [topic.id]: p2p.messages[topic.id] },
      activeTopicId: topic.id
    }
    await get().persist({ ...db, chat })
    get().pushToast('Topic created. Waiting for peers.')
    return topic
  },

  async joinTopic(topicId) {
    const { db } = get()
    const topic = p2p.joinTopic(topicId, db.user.name)
    if (!topic) return
    await get().persist({
      ...db,
      chat: {
        ...db.chat,
        topics: (db.chat?.topics || []).map((item) => (item.id === topic.id ? topic : item)),
        messages: { ...(db.chat?.messages || {}), [topic.id]: p2p.messages[topic.id] },
        activeTopicId: topic.id
      }
    })
  },

  async sendChat(text) {
    const { db } = get()
    const topicId = db.chat?.activeTopicId
    if (!topicId || !text.trim()) return
    const msg = p2p.sendChat(topicId, db.user.name, text.trim())
    await get().persist({
      ...db,
      chat: {
        ...db.chat,
        messages: {
          ...(db.chat.messages || {}),
          [topicId]: [...(db.chat.messages?.[topicId] || []), msg]
        }
      }
    })
  },

  setActiveTopic(activeTopicId) {
    const { db } = get()
    get().persist({ ...db, chat: { ...db.chat, activeTopicId } })
  },

  async setNetwork(patch) {
    const { db } = get()
    await get().persist({ ...db, network: { ...db.network, ...patch } })
  },

  async registerBusiness(form) {
    const check = validateAdmin({ ...form, message: form.message || form.promotion })
    if (!check.ok) return check
    const { db } = get()
    const merchant = toUiRecord({
      id: `admin-${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      status: 'open',
      message: (form.message || form.promotion || '').trim(),
      hours: form.hours || '09:00-18:00',
      updated: new Date().toISOString()
    })
    await get().persist({ ...db, registeredMerchants: [merchant, ...db.registeredMerchants] })
    get().pushToast('Shop registered. Travelers see it while scanning.')
    return { ok: true, errors: {}, merchant }
  },

  async deleteMerchant(id) {
    const { db } = get()
    await get().persist({
      ...db,
      registeredMerchants: db.registeredMerchants.filter((item) => item.id !== id)
    })
  },

  async reset() {
    if (liveBeacon) {
      await liveBeacon.stop()
      liveBeacon = null
    }
    const db = await storage.reset()
    p2p.topics = []
    p2p.messages = {}
    set({ db, peers: [], p2pStatus: 'idle', selectedMerchant: null })
    if (network?.start) network.start()
    get().pushToast('Data restored')
  }
}))

export function visibleMerchants() {
  const { peers, db, filter } = useAppStore.getState()
  const extra = db?.registeredMerchants || []
  const mine =
    db?.beacon?.broadcasting && db.beacon.name
      ? [
          toUiRecord(
            {
              ...db.beacon,
              id: db.beacon.id || 'local-propio',
              distance: 5,
              signal: 5
            },
            { propio: true }
          )
        ]
      : []
  const all = [...mine, ...peers, ...extra]
  if (filter === 'All') return all
  return all.filter((item) => item.category === filter)
}
