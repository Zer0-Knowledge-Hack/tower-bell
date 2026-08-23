# Judging criteria → Towerbell Frontend

Use this sheet when presenting. Everything below is **implemented in the Expo frontend** (English UI).

## Technicality

| Challenge | What we built |
|-----------|----------------|
| Offline-first discovery UX | Traveler **Nearby** with live peer list + pull-to-refresh scan |
| Clean engine boundary | UI only calls `scan()` / `beacon()` from `frontend/backend` |
| Mobile sandbox vs Bare | Mock contract today; same API for Pear Bare worklet later |
| Permissions for real devices | Gate screen + Android/iOS declarations in `app.json` |
| Local map without Google keys | Leaflet + OpenStreetMap / CARTO tiles |
| State & persistence | Zustand + AsyncStorage, role ACL (`src/utils/acl.js`) |

**Completeness:** Demo is fully runnable on web/Expo. Path to production P2P: embed Bare Kit (documented in About + README).

## Originality

- Not a Maps clone: **beacon ↔ traveler** hyperlocal presence.
- Free local map + P2P mental model (no accounts, no central server in the product story).
- Dual identity UX with hard isolation (traveler cannot edit shop; shop cannot browse other shops).

## UI / UX / DX

| Area | Evidence |
|------|----------|
| Easy to use | Role select → permissions → one job per tab |
| Map / radar / list | Three views for the same nearby data |
| Feedback | Loading blocks, toasts, notification bell |
| Accessibility of demo | Dark mode, English copy, owl brand |
| DX | Screens by role, barrel `screens/index.js`, docs folder |

## Practicality

- Street markets, blackouts, tourist areas with weak mobile data.
- No Google Maps API cost.
- APK path via EAS (`docs/BUILD_APK.md`).
- Works as a visual demo even when radios are mocked.

## Presentation

1. Open **Settings → About / pitch for judges** (in-app pitch).
2. Follow **docs/DEMO.md** (90 seconds).
3. Point judges to this file for criteria mapping.
4. Show dark mode + map pins + shop broadcast switch.

### One-sentence pitch

> Towerbell lets a shop broadcast who they are and what they offer so travelers nearby can discover them without internet, servers, or accounts.
