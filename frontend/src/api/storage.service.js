import AsyncStorage from '@react-native-async-storage/async-storage'
import { seedDb } from './mock-data'

const KEY = 'towerbell.db.v7'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export const storage = {
  async load() {
    const raw = await AsyncStorage.getItem(KEY)
    if (!raw) {
      const initial = clone(seedDb)
      await AsyncStorage.setItem(KEY, JSON.stringify(initial, null, 2))
      return initial
    }
    try {
      return { ...clone(seedDb), ...JSON.parse(raw) }
    } catch {
      return clone(seedDb)
    }
  },

  async save(db) {
    await AsyncStorage.setItem(KEY, JSON.stringify(db, null, 2))
  },

  async reset() {
    const initial = clone(seedDb)
    await AsyncStorage.setItem(KEY, JSON.stringify(initial, null, 2))
    return initial
  },

  exportJson(db) {
    return JSON.stringify(db, null, 2)
  }
}
