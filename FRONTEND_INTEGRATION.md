# Frontend Integration

Strict API boundary between `backend/` (P2P, Bare-only) and any UI surface. Read this before touching `frontend/`.

## The contract

The UI never talks to Hyperswarm, Corestore or Hyperbee directly. It only ever imports the two functions the backend exposes:

```js
const { scan, beacon } = require('./backend') // or `./backend/index.js`

const network = scan()
network.on('status', ({ mode, connected, error }) => {}) // mode: 'dht' (only mode implemented today)
network.on('peer-found', (record) => {})
network.on('peer-lost', (id) => {})
network.list() // -> array of currently known records
network.stop() // async -- closes the swarm; added so callers can shut a scan down cleanly

const myBeacon = beacon(record)
myBeacon.on('visitor', ({ total }) => {})
myBeacon.update(record) // async
myBeacon.stop() // async
```

Names are English and frozen: `scan`, `beacon`, `peer-found`, `peer-lost`, `status`, `visitor`, `list`, `update`, `stop`. See `AGENTS.md` for why — planning docs in Spanish describe the same contract for humans only, never for code.

### Record schema

```js
const record = { id, name, category, status, message, hours, updated }
```

`status` is `'open'` or `'closed'`. `updated` is an ISO timestamp. Anything else on a record (`distance`, `signal`, `icon`, `categoryLabel`, `peerId`, `promotion`, …) is UI-only sugar added by a consumer (see `frontend/backend/schema.js#toUiRecord`), not part of the contract — do not depend on it being present from `backend/index.js` or `backend/mock.js` directly.

## Two consumers, same contract, different backend

| Consumer                          | Entry point                                                                       | Backend it gets                                                                        |
| --------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Pear CLI + TUI (the track binary) | `bin.mjs` → `frontend/traveler.mjs` / `frontend/trade.mjs` → `frontend/cli/*.mjs` | Real `backend/index.js` (or `backend/mock.js` with `--fake`), running under Bare       |
| Expo / React Native app           | `frontend/App.js` → `frontend/src/*`                                              | Always `frontend/backend/index.js`, which always re-exports `frontend/backend/mock.js` |

Expo/web cannot load `hyperswarm` or any native Bare module, so `frontend/backend/` is a standalone folder that mirrors the `scan()`/`beacon()` shape with a mock swarm. It is **not** a copy of `backend/` that happens to also work — it is deliberately mock-only. If a Pear Mobile / Bare-in-Expo path is ever wired, `frontend/backend/index.js` is the one file to swap to re-export the native backend; nothing else in `frontend/src/` should need to change if the contract above is respected.

## Boundary rules

1. The UI/Frontend must never contain P2P logic (no `hyperswarm`, `corestore`, `hyperbee`, DHT topics, etc. in `frontend/`).
2. Screens under `frontend/src/` import from `frontend/backend` (the barrel), never reach into `frontend/backend/mock.js` or `frontend/backend/schema.js` directly, and never import anything from the root `backend/` folder.
3. The Pear CLI TUI (`frontend/cli/*.mjs`) imports the backend function it's handed (`scan`/`beacon`, real or `--fake`) as a parameter — it never imports `backend/` itself; that choice is made once in `bin.mjs`.
4. If a change to `backend/index.js` adds, renames, or removes an event or method, it changes this file and `AGENTS.md` in the same unit of work, and whoever owns `frontend/` gets told before it merges.

## Known gap (as of this doc)

`frontend/src/store/app.store.js` wires `peer-found` and `status` from `scan()`, but does not yet listen for `peer-lost` — so on the Expo app a beacon that goes out of range stays in the visible list even though the mock now emits the event. The Pear CLI TUI (`frontend/cli/traveler.mjs`) already handles it correctly. Whoever owns `frontend/src/` should add a `peer-lost` handler to `app.store.js` that removes the peer from `peers`.

`frontend/src/api/p2p.service.js` (topics/chat) is a separate, fully local mock feature — it is not part of the `scan()`/`beacon()` contract and has no real P2P behind it.
