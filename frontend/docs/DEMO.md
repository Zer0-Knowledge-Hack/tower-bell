# 90-second demo script (English)

Goal: judges understand problem → solution → live UX in under 90 seconds.

## Setup (before you talk)

```bash
cd frontend
npx expo start --web
```

Reset data if needed: **Settings → Reset data and pick a role again**.

## Script

| Time      | Say                                                                                          | Do                                            |
| --------- | -------------------------------------------------------------------------------------------- | --------------------------------------------- |
| 0:00–0:15 | “Walking a new street, maps need internet and accounts. Local shops stay invisible offline.” | Show role select (owl logo).                  |
| 0:15–0:35 | “I’m a traveler. Towerbell asks for the permissions a real phone needs.”                     | Pick **Traveler** → **Allow all**.            |
| 0:35–0:55 | “Nearby places appear on a free OpenStreetMap — no Google key.”                              | Show **Map**, tap a pin, open detail.         |
| 0:55–1:10 | “I can save the promo and get a local notification.”                                         | **Save to Wallet** → open **bell**.           |
| 1:10–1:25 | “Same app, shop mode: I broadcast my place.”                                                 | Settings → **Shop** → **Start broadcasting**. |
| 1:25–1:30 | “Dark mode for night demos. Full pitch is in About.”                                         | Toggle dark mode → **About**.                 |

## Backup if map tiles fail

Switch to **Radar** or **List** — peers still show. Say: “Map tiles need network; discovery UI works either way.”

## Backup if Expo is slow

Open **Settings → About** and walk the five demo steps on screen.
