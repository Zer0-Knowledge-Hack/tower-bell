# Releases

Towerbell has two distribution stories. Do not mix them up.

| Channel                                 | What it is                                | Who uses it                           |
| --------------------------------------- | ----------------------------------------- | ------------------------------------- |
| **Pear** (`pear install` + `pear seed`) | Real track binary + OTA                   | Judges / Pears Track hard gate        |
| **GitHub Release**                      | Version tag + notes (and optional assets) | Teammates, README, hackathon visitors |

## Cut a GitHub Release

1. Bump `version` in `package.json` (SemVer).
2. Update `CHANGELOG.md` with a new `## [x.y.z]` section.
3. Commit on a branch, open/merge the PR.
4. Tag and push:

```powershell
git tag v1.0.1
git push origin v1.0.1
```

5. The `Release` workflow creates the GitHub Release from the tag. Or create one by hand:

```powershell
gh release create v1.0.1 --title "Towerbell v1.0.1" --notes-file CHANGELOG.md
```

## Pear stage (OTA) — separate from GitHub

**Stage the built `by-arch` deployment folder, never the repo root.**
`package.json` declares `"bin": "bin.mjs"` and `App.js`/`workers/main.js`
run PearRuntime with `app` set to the current executable, which makes
Towerbell a bundled/standalone app: OTA applies an update by swapping the
installed binary (`fsx.swap`), and `pear install` looks for exactly
`/by-arch/<host>/app/<name>` on the staged drive. Staging the raw source
tree (what a bare `pear stage <link>` from repo root does) verifiably does
**not** work here — `pear install` fails with `Not found: .../by-arch/<host>/app/<name>`
because that path never exists on that drive. This was tested end-to-end
(stage → seed → install → run) on 2026-08-24; staging raw source failed at
install, staging the by-arch folder below installed and ran correctly.

```powershell
# 1. build the binary(es) for whichever host(s) you're shipping this round
pnpm run make:win32-x64          # this weekend: Windows x64 only

# 2. package it into the by-arch layout pear install expects
pnpm dlx pear-build@1.1.1 --win32-x64-app out/win32-x64/towerbell.exe --target deployment --package package.json
# add more --<host>-app flags here once other platforms are built; see
# .github/workflows/build.yaml's "package" job for the full multi-host form

# 3. bump package.json's version first if this is an update, then stage
#    the deployment folder -- not the repo -- under the real upgrade link
pear stage <upgrade-link> deployment
pear seed <upgrade-link>
```

A GitHub Release does **not** replace `pear seed`. Without a seeder, `pear install` cannot fetch the app.

## What actually gets staged if you stage the repo root instead

Do this only for source inspection/`pear dump`, never as the real deploy —
see above. `pear stage` has no default ignore list — it ships everything in
the working directory it's told to, `.git` and `node_modules` included.
`package.json`'s `pear.stage.ignore` keeps that from being a ~1.8GB leak of
git history and cross-platform build toolchains: it trims the raw source
stage down to the Pear CLI surface (`app.js`, `backend/`, `bin.mjs`,
`frontend/traveler.mjs`, `frontend/trade.mjs`, `frontend/style.mjs`,
`frontend/cli/`, `workers/`, `package.json`, and production `node_modules`,
~620MB), dropping `.git`, `out/`, `landing/`, `docs/`, the whole Expo app
(`frontend/src`, `frontend/App.js`, etc.), and devDependencies.

The `node_modules` entries in that ignore list are a snapshot, not a
pattern -- confirmed once against the actual devDependency tree, not
guaranteed to stay correct. Regenerate them whenever `devDependencies`
change:

```powershell
# from the repo root, with dependencies already installed
Copy-Item package.json,pnpm-lock.yaml,pnpm-workspace.yaml,.npmrc <scratch-dir>
cd <scratch-dir>
pnpm install --prod
# then diff the top-level `node_modules` folder names against the repo's
# full install -- what's only in the full one is dev-only and belongs in
# pear.stage.ignore
```

Verify a change to the ignore list with `pear stage <link> --dry-run`
against a link that has never been staged before (an already-staged link
only diffs against what changed, so a stale ignore won't show up there).
