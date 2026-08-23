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

```text
# bump package.json version → rebuild → stage the same upgrade link → keep seed running
pear stage <upgrade-link>
pear seed <upgrade-link>
```

A GitHub Release does **not** replace `pear seed`. Without a seeder, `pear install` cannot fetch the app.
