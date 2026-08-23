# Towerbell Frontend (Expo)

**Hyperlocal P2P discovery** — shops broadcast, travelers discover nearby places without internet, servers, or accounts.

English UI · free OpenStreetMap · dark mode · notifications · role-based ACL.

## Quick start

```bash
cd frontend
npm install
npx expo start
```

- `w` — web demo (best for judges on a laptop)
- `a` — Android emulator / device
- Expo Go — scan QR

## Project layout

```
frontend/
├── App.js                 # App shell + boot loading
├── app.json               # Expo config + permissions
├── eas.json               # APK profile (preview)
├── backend/               # scan() / beacon() contract (mock for Expo)
├── cli/                   # Terminal TUI panels (Pear Bare)
├── docs/                  # Judging, demo script, APK guide
├── src/
│   ├── api/               # storage, notifications, validation, chat facade
│   ├── components/        # UI building blocks
│   ├── constants/         # Pitch copy for presentation
│   ├── navigation/        # Role-based tabs + stacks
│   ├── screens/
│   │   ├── traveler/      # Nearby map, chat, wallet
│   │   ├── merchant/      # Beacon, visitors
│   │   ├── admin/         # Register shops, network debug
│   │   └── system/        # Role select, settings, permissions, about
│   ├── store/             # Zustand app state
│   └── utils/             # theme, ACL, geo, permissions
└── assets/                # Owl brand icons
```

## Roles (isolated)

| Role | Sees | Does not see |
|------|------|--------------|
| Traveler | Map / radar / list, chat, wallet | Beacon editor, admin |
| Shop | Beacon broadcast, own visitors | Other shops’ radar, wallet |
| Admin | Register shops, logs, network | Traveler wallet / shop promo editor |

## Docs for judges

| File | Purpose |
|------|---------|
| [docs/JUDGING.md](docs/JUDGING.md) | Maps features → evaluation criteria |
| [docs/DEMO.md](docs/DEMO.md) | 90-second live demo script |
| [docs/BUILD_APK.md](docs/BUILD_APK.md) | Generate Android APK with EAS |
| In-app **Settings → About** | Pitch + criteria + demo steps |

## Architecture (UI never owns P2P)

```
Expo UI  →  backend/scan() + beacon()  →  mock today
                                     →  Bare worklet later (Pear)
```

Contract events: `peer-found`, `status`, `visitor`. Schema: `id`, `name`, `category`, `status`, `message`, `hours`, `updated`.

## Brand colors

| Token | Hex |
|-------|-----|
| Sky | `#54ADF6` |
| Navy | `#0D47A1` |
| Ink | `#0A110F` |

## Scripts

```bash
npm start          # Expo
npm run web        # Web
npm run android    # Android
```
