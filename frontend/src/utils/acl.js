export const ROLE_FEATURES = {
  visitor: ['discover', 'chat', 'wallet', 'settings', 'permissions'],
  merchant: ['beacon', 'visitors', 'settings', 'permissions'],
  admin: ['admin', 'network', 'permissions', 'settings'],
};

export const ROLE_LABELS = {
  visitor: 'Traveler',
  merchant: 'Shop',
  admin: 'Admin',
};

export function can(role, feature) {
  return (ROLE_FEATURES[role] || []).includes(feature);
}

export function roleTabs(role) {
  if (role === 'merchant') {
    return [
      { name: 'Beacon', icon: 'signal', feature: 'beacon' },
      { name: 'Visitors', icon: 'users', feature: 'visitors' },
    ];
  }
  if (role === 'admin') {
    return [
      { name: 'Admin', icon: 'shield', feature: 'admin' },
      { name: 'Network', icon: 'wifi', feature: 'network' },
    ];
  }
  return [
    { name: 'Discover', icon: 'compass', feature: 'discover' },
    { name: 'Chat', icon: 'users', feature: 'chat' },
    { name: 'Wallet', icon: 'credit-card', feature: 'wallet' },
  ];
}
