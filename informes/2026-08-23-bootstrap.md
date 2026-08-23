# Informe — bootstrap del repo
**Fecha:** 2026-08-23 · **Fase:** infraestructura

## Objetivo

Dejar un esqueleto instalable y compilable sobre hello-pear-bare `main`, con el contrato §3.3 y `backend/mock.js`, sin deploy Pear todavía.

## Qué se hizo

- Se integró el template `hello-pear-bare` rama `main` sin pisar `LICENSE`, `towerbell-sistema-de-trabajo.md` ni `.cursor/skills/towerbell-dev/`.
- `.npmrc` con `node-linker=hoisted` **antes** del primer `pnpm install`.
- `pnpm-workspace.yaml` con `nodeLinker: hoisted` porque pnpm 11 ignora ese setting en `.npmrc`.
- Estructura §4: `backend/`, `frontend/`, `index.js` router (`scan` | `beacon` | `--help`).
- Contrato §3.3 en `backend/index.js` (solo interfaz).
- `backend/mock.js` con el mismo contrato, datos falsos y timer (`bare-timers`).
- `package.json` con `upgrade` de primer nivel (`pear://<YOUR_KEY_HERE>`).
- `scripts/make.js` adaptado a `pnpm` y binario `towerbell`.
- README corto: de qué branch partimos y por qué.

## Verificación

| Test | Resultado | Nota |
|---|---|---|
| V1 — APIs contra la doc | ✅ | Ver lista abajo |
| V2 — Ejecución real | ✅ | `pnpm start` exit 0; `scan`/`beacon` viven hasta timeout (124) |
| V3 — Dos instancias | N/A | Sin P2P en esta unidad |
| V4 — Binario compilado | ✅ | `pnpm run make` → `out/linux-x64/towerbell` (84 MB). El primer intento falló por hoist; pasó después de `pnpm-workspace.yaml` |
| V5 — Máquina limpia | pendiente | El binario corrió `-h` y `scan` en esta máquina; no se probó un host sin Node/Pear |
| V6 — Estado del repo | ✅ | `out/`, `node_modules/`, `.env` y `storage/` no aparecen para commitear |
| V7 — Contrato intacto | ✅ | §3.3 sin cambios |

### APIs verificadas

| API | Usada en runtime de esta unidad | Fuente |
|---|---|---|
| `Bare.argv`, `Bare.exit` | Sí | Anexo A §5 · docs.pears.com/reference/bare/runtime/ |
| `bare-path` | Sí | Anexo A §5 · template |
| `bare-process` | Sí (señales) | Anexo A §5 · template |
| `bare-timers` `setInterval`/`clearInterval` | Sí (mock) | Anexo A §5 · docs.pears.com/reference/bare/modules/bare-timers/ |
| `paparam` `command`/`flag`/`header`/`summary` | Sí | Template · README de paparam |
| `which-runtime` `isWindows` | Sí | Template |
| `PearRuntime` / `PearRuntime.run` | No (archivos del template, sin instanciar) | Anexo A §4 |
| `pear release` | No usada | Removida en Pear v3 |
| `pear stage` / `seed` / `install` | No usadas | Unidad siguiente |
| `fs` / `path` / `os` de Node en Bare | No | `scripts/make.js` es Node a propósito |

## Pendiente

- `pear touch` y pegar el link real en `upgrade`.
- Cablear `app.js` / worker cuando el link exista.
- Deploy: `pear stage` + `seed` (HITO 1).
- Implementar dht/mdns/ble y Hyperbee.
- TUI en `frontend/` (otro owner).

## Riesgos detectados

| Riesgo | Impacto | Mitigación |
|---|---|---|
| pnpm 11 ignora `node-linker` en `.npmrc` | `make` / `pear stage` no resuelven módulos | `pnpm-workspace.yaml` con `nodeLinker: hoisted`; se mantiene `.npmrc` para pnpm ≤10 |
| Placeholder `upgrade` | `INVALID_URL` si se instancia pear-runtime | No se instancia; `pnpm start` usa `--no-updates` |
| pnpm inserta `--` entre el script y los args | `pnpm start -- scan` fallaba | El router filtra `--` |

## Decisiones tomadas sobre la marcha

- Agregar `pnpm-workspace.yaml` además del `.npmrc` pedido. Sin eso, en pnpm 11 el hoist no ocurre y `make` rompe con `Cannot find module 'bare-abort'`.
- No abrir el worker OTA en esta unidad. El template queda en el repo para el deploy.

## Impacto en el frontend

Sin cambios en el contrato. Ya puede desarrollar contra `backend/mock.js`. Import a cambiar al final: `../backend/mock` → `../backend/index.js`.

## Próximo paso sugerido

Unidad deploy HITO 1: `pear touch`, pegar `upgrade`, `pear stage` + `seed`.
