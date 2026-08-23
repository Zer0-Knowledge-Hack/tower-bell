# Towerbell speaking script (English)

About **3 minutes**. Open `docs/pitch/index.html`. Arrows or click to advance. Press **n** for speaker notes. Press **f** for fullscreen.

Speak slowly. Do not read every word on the slide. The slides are the poster; this is what you say.

---

## Full run (read this)

Hi. We are **Zero-Knolage**, and this is **Towerbell**.

**The problem.** To know what is on this block — a café, a promo, whether it is even open — you need three things that should not be required for a sidewalk: the **internet**, an **account**, and **luck**. Google Maps, Instagram, the shop’s Wi‑Fi. If the signal dies, the street goes blank. If you are not logged in, you see nothing. If the listing is stale, you walk past a place that is actually open.

That is a real-world problem. It is worse in places with bad coverage, expensive data, or shops that never got onto a platform.

**What we built.** Towerbell lets a shop **broadcast** a tiny record — name, category, hours, promo — from the device in the store. A traveler walking by **scans** and sees that record. Phone to phone. No account. No central database. No App Store in the middle of the discovery itself. If you turn the internet off, the idea still holds: the two devices are the network.

**How it works.** Three steps. Devices find each other on a shared topic. The shop tells a small, anonymous record. The traveler sees it immediately. There is no server matching them.

**What we use.** We did not invent a new runtime. We built on **Pear**, **Bare**, **Hyperswarm**, and **Hyperbee** — Holepunch’s stack. Pear is how the **tool arrives** on your machine: `pear install` and over-the-air updates, copied from peers, not from our servers, because we do not have servers. Hyperswarm is how **shops and travelers find each other**. Hyperbee is the small local record. Bare is the engine inside the binary so the user does not need Node.

**Why Pear is the right fit.** Two jobs, one stack. First: **distribution**. A weekend tool should not depend on us renting a VPS or shipping through an app store. Pear is the install path the track asks for, and it is honest: if nobody is seeding, the app is not there — same as a street with no shops broadcasting. Second: **the product is already P2P**. A maps company solves discovery by uploading the world to a datacenter. We solve it by letting two people on the same block talk. Pear and Holepunch are built for that. Putting a REST API in the middle would break the story and the rules.

**Who we are.** Zero-Knolage is five roles on one team: frontend — the 8-bit phone UI; speaker — the story and the live demo; business — why a shop would turn this on; security — no accounts, no harvesting a central user graph; backend — the swarm, the record, the CLI the judge actually installs.

**The ask.** Install it like a user:

`pear install pear://xtj3nobayrtccxp68dnngayheeor3bc8kt8j4q19b3d5znrj1yqy`

Then `towerbell scan` in one terminal and `towerbell beacon` in another. Keep the link **seeded**. Updates move the same way the shops do: peer to peer.

Discover shops without the internet. **Towerbell.**

---

## Per slide (if you want cues)

| Slide      | You say                                                                     |
| ---------- | --------------------------------------------------------------------------- |
| 1 Title    | We are Zero-Knolage. This is Towerbell.                                     |
| 2 Internet | Today, no signal means no street.                                           |
| 3 Account  | And the street is locked behind someone else’s login.                       |
| 4 Luck     | Open or closed, promo or not — you guess.                                   |
| 5 Idea     | We connect the shop’s phone to the traveler’s phone. No cloud.              |
| 6 How      | Find. Tell. See. That is the whole protocol.                                |
| 7 Contrast | Blind / gated apps / Towerbell. We are the third column.                    |
| 8 Demo     | What you install is a CLI: scan and beacon. The phone UI is the same story. |
| 9 Stack    | Pear, Bare, Hyperswarm, Hyperbee. Their tools, our product.                 |
| 10 Team    | Five people, one team: UI, voice, business, security, swarm.                |
| 11 Install | Read the command. This is the gate. Seed it.                                |
| 12 Close   | Discover shops without the internet. Stop.                                  |

---

## If a judge asks

- **Is the Expo app the Pear binary?** No. Expo is the face for the video. `pear install` is the track product (CLI + TUI, real Hyperswarm).
- **BLE?** Bonus direction. This weekend the live path is Hyperswarm on the CLI.
- **Why no server?** The product dies if it needs our laptop. Pear is how we refuse that.
