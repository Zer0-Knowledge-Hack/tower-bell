# Towerbell

Hyperlocal P2P shop discovery. A shop broadcasts name, category, hours and promo. A traveler nearby sees that record. No accounts, no servers, no App Store.

Team: **Zero-Knolage**. Built from [`hello-pear-bare`](https://github.com/holepunchto/hello-pear-bare) (`main`).

Two surfaces, one contract (`scan()` / `beacon()`, topic `towerbell-discovery-v1`):

| Surface | What it is | What judges should use |
| --- | --- | --- |
| Pear CLI + 8-bit TUI | Real Hyperswarm. This is the track binary. | `pear install` below |
| Expo / React Native | Phone UI for the video. Same contract, mock swarm (Expo cannot load Hyperswarm). | `http://localhost:8081` |

## Install (Pears Track — this is the entry)

Keep this link **seeded** through judging:

```text
pear install pear://xtj3nobayrtccxp68dnngayheeor3bc8kt8j4q19b3d5znrj1yqy
```

Then:

```text
towerbell scan
towerbell beacon --name "Cafe del Puerto" --message "2x1 until 18h"
```

Two processes on one PC need different `--storage` dirs. This weekend the binary is **Windows x64**.

Someone on the team must keep this running:

```text
pear seed pear://xtj3nobayrtccxp68dnngayheeor3bc8kt8j4q19b3d5znrj1yqy
```

Without a seeder, `pear install` cannot fetch the app. OTA: bump `version` in `package.json`, rebuild, `pear stage` the same link. An installed copy logs `[updater] updating` → `updated`.

## Phone UI demo (Expo)

Record this in a browser (phone frame) or Expo Go. Mock peers appear in a few seconds.

```powershell
cd frontend
pnpm install
pnpm start -- --web --port 8081
```

Open **http://localhost:8081**

Shot list (~90 seconds):

1. **CHOOSE MODE** → **SCAN** (traveler). Wait until Cafe Rivadavia / Farmacia Norte show on map, radar or list. Tap a shop.
2. Header gear → **Settings** → **SWITCH IDENTITY** → **Shop**.
3. **BEACON**: fill name / promo if needed → **Start broadcasting** until it says **ON AIR**. Open **HITS**.
4. Optional: Settings → **Reset** to return to CHOOSE MODE.

Expo Go: same `pnpm start` in `frontend/`, scan the QR on a phone on the same Wi‑Fi.

This UI is a preview. The Pear-installed CLI is the P2P product.

## Local CLI (optional)

```powershell
pnpm install
pnpm run scan
pnpm run beacon -- --name "Cafe Nucleo" --message "Nucleus live test"
```

`--fake` is mock data in one terminal. `pnpm start` uses `--no-updates` so a live release does not swap the binary while you iterate.

## Pitch

English deck (open in a browser) and speaking script:

- [docs/pitch/index.html](docs/pitch/index.html) — 12 slides. Arrows / click. `n` = notes. `f` = fullscreen.
- [docs/pitch/SCRIPT.md](docs/pitch/SCRIPT.md) — ~3 minute talk track.

## Submission text

Paste this into the form field “Explain what you built and how it works” (headings + lists):

- [docs/submit/what-we-built.txt](docs/submit/what-we-built.txt) — plain text for the **Details** field.

## Releases

Version history and how to cut a GitHub Release (separate from Pear OTA):

- [CHANGELOG.md](CHANGELOG.md)
- [docs/RELEASES.md](docs/RELEASES.md)

Install for judges stays on Pear: `pear install` + keep `pear seed` running.

## Repo

https://github.com/Zer0-Knowledge-Hack/tower-bell
