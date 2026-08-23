export const CATEGORIES = [
  'cafeteria',
  'restaurant',
  'kiosk',
  'pharmacy',
  'bookstore',
  'clothing',
  'tech',
  'other'
]

export const CATEGORY_META = {
  cafeteria: { label: 'Cafeteria', icon: 'coffee' },
  restaurant: { label: 'Restaurant', icon: 'restaurant' },
  kiosk: { label: 'Kiosk', icon: 'store' },
  pharmacy: { label: 'Pharmacy', icon: 'plus' },
  bookstore: { label: 'Bookstore', icon: 'book' },
  clothing: { label: 'Clothing', icon: 'store' },
  tech: { label: 'Tech', icon: 'wifi' },
  other: { label: 'Other', icon: 'store' }
}

export function toUiRecord(record, extra = {}) {
  const category = record.category || 'other'
  const meta = CATEGORY_META[category] || CATEGORY_META.other
  const id = record.id || 'unknown-peer'
  return {
    id,
    name: record.name || 'Unnamed place',
    category,
    status: record.status || 'open',
    message: record.message || '',
    hours: record.hours || '',
    updated: record.updated || new Date().toISOString(),
    icon: meta.icon,
    categoryLabel: meta.label,
    distance: record.distance ?? extra.distance ?? 80,
    signal: record.signal ?? extra.signal ?? 4,
    peerId: record.peerId || id,
    promotion: record.message || record.promotion || '',
    ...extra
  }
}
