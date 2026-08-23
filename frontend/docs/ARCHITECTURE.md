# Frontend architecture (for DX & technical Q&A)

## Separation of concerns

```
src/screens/*     →  presentation only
src/store         →  app state + side effects
frontend/backend  →  P2P contract (mock in Expo)
cli/              →  Bare TUI panels (same product idea)
```

The renderer **never** imports Hyperswarm / Hyperbee directly.

## Contract

```js
import { scan, beacon } from '../backend';

const network = scan();
network.on('peer-found', (record) => {});
network.on('status', ({ connected, mode }) => {});
network.list();

const live = beacon({ name, category, status, message, hours });
live.on('visitor', ({ total }) => {});
await live.update({ ... });
await live.stop();
```

## Screen map by role

| Folder | Screens |
|--------|---------|
| `screens/traveler` | Discover (map/radar/list), Chat, Wallet |
| `screens/merchant` | Beacon, Visitors |
| `screens/admin` | Admin dashboard, Network debug |
| `screens/system` | Role select, Settings, Permissions, Notifications, About |

## Theme

`useThemeColors()` reads `db.darkMode` and returns light/dark palettes from `utils/colors.js`.

## Next engineering step (Pear Mobile)

Embed `react-native-bare-kit`, run a worklet that loads the real backend, keep this UI unchanged except swapping the facade behind `backend/index.js`.
