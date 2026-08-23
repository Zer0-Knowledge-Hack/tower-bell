# Release & OTA runbook

How to publish the app so `pear install` works, and how to make the swarm
update visible during a demo.

Everything below was verified end to end on linux-x64: a clean-directory
install took **14 seconds / 97 MB**, and a staged update reached an already
installed copy on its own.

---

## What this branch changes

Two files. No changes to `package.json`, `backend/`, `frontend/` or `landing/`.

| File | Change | Why it matters |
|---|---|---|
| `workers/main.js` | Inlines the `hello-pear-worker` boilerplate and adds `delay` | **Blocker for the OTA requirement.** `pear-runtime` defaults `delay` to **one hour**. The upstream worker builds its config from `argv` and never exposes `delay`, so it cannot be lowered from outside — the file has to be inlined. Without this, a staged update is not picked up during a demo and the OTA looks broken. Now defaults to 5s, override with `PEAR_UPDATE_DELAY`. |
| `bin.mjs` | `arg('<mode>')` → `arg('[mode]')`, plus `await app.close()` + `Bare.exit(0)` on the usage path | Running `towerbell` with no mode threw an uncaught `Bail: MISSING_ARG`. The usage block already written at the bottom of the file was unreachable, because `cmd.parse()` bails first. Now it prints usage and exits 0. |

Neither change touches the P2P layer or the contract.

---

## Publishing checklist

`pear install` does **not** run a source tree. It looks for a compiled binary at
`by-arch/<platform>/app/<name>`. That folder is produced by `pear build` from a
binary that `bare-build` compiled. **Compiling is a prerequisite for publishing,
not a later step.**

```bash
# 1. Bump the version — see "Version must change" below
#    edit package.json: "version": "1.0.1"

# 2. Compile the binary for this platform
pnpm run make                 # → out/<platform>/towerbell

# 3. Build the deployment folder (run from OUTSIDE the source tree)
cd /tmp
pear build \
  --package /path/to/repo/package.json \
  --target  /path/to/repo/build \
  --linux-x64-app /path/to/repo/out/linux-x64/towerbell

# 4. Publish
pear stage pear://<key> /path/to/repo/build

# 5. Announce — leave this process running
pear seed pear://<key>

# 6. Verify from a clean directory, on another machine if possible
pear install pear://<key> --to /tmp/check
/tmp/check/towerbell
```

`pear build` accepts every platform in one call — `--darwin-arm64-app`,
`--win32-x64-app`, and so on — but each binary has to be compiled on its own
platform first.

---

## Four traps, all of them measured

### 1. Only the person who ran `pear touch` can publish

`pear stage` against a link created on someone else's machine fails with:

```
✖ Destination must be writable
```

The private key stays on the machine that created the link. **Whoever publishes
must be the person who generated it.** If that person is unavailable, a new link
has to be generated *and the binary recompiled*, because the upgrade link is
embedded at build time.

### 2. The version must change or the OTA will not fire

Staging a new build under the same `version` does nothing: the drive grows, peers
connect, and the updater ignores it. `pear-runtime` decides by **version**, not by
drive length. Bump `version` in `package.json` on every publish.

### 3. The seeder goes silent after every stage

Running `pear stage` while `pear seed` is up leaves the seeder **alive but mute** —
the process is still there, it prints `... drive length <new>` and then serves
nobody. Installs fail with `Network Timeout` without transferring a byte.

**Restart the seeder after every stage** and wait for `^_^ announced`. A mute
seeder looks identical to a healthy one if you only check that the process exists.

### 4. Staging the repo root publishes far more than the app

A plain `pear stage` from the repo root ships `node_modules` (1.8 GB, mostly build
tooling) plus every internal document in the tree. Stage `build/` — the compiled
binary is 93 MB and needs no dependencies at all.

---

## Known gap: the link on the landing page is empty

`landing/src/data.js` publishes:

```js
export const PEAR_LINK = 'pear://9on7du4dmnmty8qsdjxoyrw6rz9dio5wzj6wqux9j6jjn545i49y'
```

`pear info` on that link returns `[ Empty ]` — nothing has ever been staged to it.
The landing page offers a copy button for `pear install <that link>`, and the
section next to it claims the binary self-updates on macOS, Linux and Windows.

Until someone runs the checklist above against that exact link, the first command
a judge copies from the site fails. This is the highest-priority item in the repo
and it can only be done by whoever created the link.
