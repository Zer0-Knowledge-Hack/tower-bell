/**
 * PEAR / BARE FACADE
 *
 * The renderer (React Native / Expo web) is sandboxed. It cannot use Node APIs.
 * Bare is the embedded JS runtime that also runs on mobile. All P2P logic
 * (Hyperswarm, Hyperbee, mDNS, BLE) must live in a Bare worker.
 *
 * Desktop: renderer -> electron main -> Bare worker
 * Mobile: same Bare worker, same API. Swap this mock for IPC later.
 *
 * Chat is topic-based: create or join a topic, then exchange messages with peers.
 */
import { mockMerchants } from './mock-data';

class P2PService {
  constructor() {
    this.status = 'idle';
    this.peers = [];
    this.topics = [];
    this.messages = {};
    this.listeners = {
      peerDiscovered: [],
      peerLost: [],
      message: [],
      status: [],
      topic: [],
    };
    this.timers = [];
  }

  async init() {
    this.setStatus('idle');
  }

  async destroy() {
    this.stopScanning();
    this.stopBroadcasting();
    this.peers = [];
  }

  on(event, callback) {
    this.listeners[event]?.push(callback);
    return () => {
      this.listeners[event] = (this.listeners[event] || []).filter((fn) => fn !== callback);
    };
  }

  emit(event, payload) {
    (this.listeners[event] || []).forEach((fn) => fn(payload));
  }

  setStatus(status) {
    this.status = status;
    this.emit('status', status);
  }

  startScanning() {
    this.stopScanning();
    this.peers = [];
    this.setStatus('scanning');
    mockMerchants.forEach((merchant, index) => {
      const timer = setTimeout(() => {
        if (this.status !== 'scanning' && this.status !== 'connected') return;
        this.peers = [...this.peers.filter((p) => p.id !== merchant.id), merchant];
        this.setStatus(this.peers.length ? 'connected' : 'scanning');
        this.emit('peerDiscovered', merchant);
      }, 400 + index * 550);
      this.timers.push(timer);
    });
  }

  stopScanning() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    if (this.status === 'scanning') this.setStatus(this.peers.length ? 'connected' : 'idle');
  }

  startBroadcasting(merchantData) {
    this.setStatus('broadcasting');
    this.emit('message', { type: 'broadcast', data: merchantData });
  }

  stopBroadcasting() {
    if (this.status === 'broadcasting') this.setStatus(this.peers.length ? 'connected' : 'idle');
  }

  createTopic(name, owner) {
    const topic = {
      id: `topic-${Date.now()}`,
      name: name.trim(),
      owner,
      members: [owner],
    };
    this.topics = [topic, ...this.topics];
    this.messages[topic.id] = [
      {
        id: `msg-${Date.now()}`,
        from: 'system',
        text: `Topic ${topic.name} creado. Esperando peers.`,
        at: new Date().toISOString(),
      },
    ];
    this.emit('topic', topic);
    return topic;
  }

  joinTopic(topicId, member) {
    this.topics = this.topics.map((topic) =>
      topic.id === topicId && !topic.members.includes(member)
        ? { ...topic, members: [...topic.members, member] }
        : topic
    );
    const topic = this.topics.find((item) => item.id === topicId);
    if (topic) {
      this.messages[topicId] = [
        ...(this.messages[topicId] || []),
        {
          id: `msg-${Date.now()}`,
          from: 'system',
          text: `${member} se unio al topic.`,
          at: new Date().toISOString(),
        },
      ];
      this.emit('topic', topic);
    }
    return topic;
  }

  sendChat(topicId, from, text) {
    const msg = { id: `msg-${Date.now()}`, from, text, at: new Date().toISOString() };
    this.messages[topicId] = [...(this.messages[topicId] || []), msg];
    this.emit('message', { topicId, ...msg });
    return msg;
  }

  sendMessage(peerId, data) {
    this.emit('message', { peerId, data, at: new Date().toISOString() });
  }

  getStatus() {
    return this.status;
  }

  getPeers() {
    return this.peers;
  }

  losePeer(peerId) {
    this.peers = this.peers.filter((p) => p.id !== peerId);
    this.emit('peerLost', peerId);
  }
}

export const p2p = new P2PService();
