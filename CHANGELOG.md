# Changelog

All notable releases of Towerbell are listed here. GitHub Releases mirror these entries.

The track install path is still `pear install` (P2P distribute + OTA). A GitHub Release is the public changelog and optional binary notes for judges and teammates.

## [1.0.1] — 2026-08-23

### Added

- Zero-Knolage 8-bit branding across Expo UI, CLI TUI, pitch deck, and landing.
- English pitch (`docs/pitch/`) and submit paste text (`docs/submit/`).
- Landing pixel restyle (Press Start 2P / VT323, owl assets, night street scene).

### Changed

- Owned Pear upgrade link for staging / seeding on this machine.
- Visitor Expo flow stays SCAN-only; merchant keeps BEACON + HITS.

### Notes

- Pear CLI = real Hyperswarm. Expo demo = same `scan()` / `beacon()` contract with mock swarm.
- Keep `pear seed` running through judging so `pear install` can fetch the app.

## [1.0.0] — 2026-08-22

### Added

- Initial Pear CLI scan / beacon on Hyperswarm topic `towerbell-discovery-v1`.
- Hyperbee-backed shop records; framed announce for discovery.
- Windows x64 bare build path for Pears Track option 1.
