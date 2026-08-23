/**
 * Frontend contract for the Holepunch/Pear engine.
 * Expo / web cannot load hyperswarm, so this folder always serves the mock
 * with the same API as the real backend: scan() and beacon().
 * On Pear Mobile, swap this file to re-export the native backend.
 */
export { beacon, scan } from './mock.js';
export { CATEGORIES, CATEGORY_META, toUiRecord } from './schema.js';
