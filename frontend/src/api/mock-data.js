export const seedDb = {
  network: {
    internet: false,
    localNetwork: true,
    bluetooth: true,
  },
  user: {
    role: 'visitor',
    name: 'Traveler',
    peerId: 'z32towerbelluser001',
  },
  beacon: {
    id: 'z32milocalpropio',
    name: 'My kiosk',
    category: 'kiosk',
    status: 'open',
    message: 'Cold drinks and fresh snacks',
    hours: '08:00-21:00',
    broadcasting: false,
    peersSeen: 0,
    uniqueConnections: 0,
  },
  wallet: {
    balance: 0,
    transactions: [],
    loyaltyCards: [],
  },
  registeredMerchants: [],
  logs: [],
  permissions: {},
  permissionsReady: false,
  notifications: [],
  darkMode: false,
  discoverView: 'map',
  chat: {
    topics: [],
    messages: {},
    activeTopicId: null,
  },
  pickedRole: false,
};

export const mockMerchants = [
  {
    id: 'z32cafeterivadavia001',
    name: 'Cafe Rivadavia',
    category: 'cafeteria',
    status: 'open',
    message: '2 for 1 until 6PM',
    hours: '08:00-20:00',
    distance: 40,
    signal: 5,
  },
];
