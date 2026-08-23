# Towerbell — Expo phone UI

8-bit React Native shell for the demo video. It talks to `scan()` / `beacon()` through `frontend/backend/`, which **always mocks** Hyperswarm (Expo web / Expo Go cannot load it).

The Pear CLI in the repo root is the real P2P binary. See the root [README](../README.md).

## Run (web — best for recording)

```powershell
cd frontend
pnpm install
pnpm start -- --web --port 8081
```

Open http://localhost:8081

1. SCAN — mock shops appear (Cafe Rivadavia, …).
2. Settings → SWITCH IDENTITY → Shop → BEACON → start broadcasting → HITS.
3. Settings → Reset to show CHOOSE MODE again.

## Expo Go

`pnpm start` in this folder, then scan the QR. Phone and PC must be on the same network.
