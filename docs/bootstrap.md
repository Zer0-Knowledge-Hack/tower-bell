# Bootstrap del repo

## Qué hace

Deja el repositorio instalable y compilable a partir de `hello-pear-bare` (rama `main`), con el contrato §3.3 congelado y un mock para que el frontend trabaje en paralelo. No hay descubrimiento P2P ni TUI todavía.

## Uso

```sh
pnpm install
pnpm start              # ayuda
pnpm start -- scan      # viajero, contra backend/mock.js
pnpm start -- beacon    # comercio, contra backend/mock.js
pnpm run make           # binario en out/<platform>-<arch>
```

`pnpm start` desactiva OTA (`--no-updates`). El campo `upgrade` sigue en placeholder hasta `pear touch`.

## Interfaz pública

| Función / evento | Firma | Qué hace |
|---|---|---|
| `escanear()` | `() → red` | Modo viajero |
| `red.on('local-encontrado')` | `(registro) => {}` | Apareció un local |
| `red.on('local-perdido')` | `(id) => {}` | Desapareció un local |
| `red.on('estado')` | `({ modo, conectado }) => {}` | `modo`: `'dht' \| 'mdns' \| 'ble'` |
| `red.listar()` | `() → [registro]` | Snapshot actual |
| `transmitir(registro)` | `(registro) → beacon` | Modo comercio |
| `beacon.actualizar(registro)` | `(registro) => {}` | Cambia el anuncio |
| `beacon.on('visitante')` | `({ total }) => {}` | Peers que leyeron |
| `beacon.detener()` | `() => {}` | Corta la transmisión |

`backend/index.js` es la interfaz (sin P2P). `backend/mock.js` implementa lo mismo con datos falsos y un timer.

## Dependencias de Pear / Bare

| Módulo | Para qué | Referencia |
|---|---|---|
| `Bare.argv` / `Bare.exit` | Args y salida del proceso | Anexo A §5 · docs.pears.com/reference/bare/runtime/ |
| `bare-path` | Detectar si corre bajo `bare` | Anexo A §5 · template hello-pear-bare |
| `bare-process` | Señales SIGINT/TERM | Anexo A §5 · template |
| `bare-timers` | Timer del mock | Anexo A §5 · docs.pears.com/reference/bare/modules/bare-timers/ |
| `paparam` | Router `scan` / `beacon` / `--help` | Template · github.com/holepunchto/paparam |
| `which-runtime` | Sufijo `.exe` en Windows | Template |
| `pear-runtime` / `PearRuntime.run` | En `app.js` + `workers/`, **sin instanciar** | Anexo A §4 · no se llama en esta unidad |

No se usa `fs` / `path` / `os` de Node en código Bare. `scripts/make.js` sí usa APIs de Node: corre bajo Node, no bajo Bare.

## Decisiones

| Decisión | Alternativa descartada | Por qué |
|---|---|---|
| Partir de `hello-pear-bare` `main` | `variant/single-thread` o `daemon` | Scan/beacon son de larga duración; el updater va en worker |
| No instanciar `PearRuntime` todavía | Arrancar el worker del template | El placeholder `upgrade` tira `INVALID_URL` |
| Frontend importa `backend/mock.js` | Importar `backend/index.js` | El contrato real no tiene P2P; el mock es el entregable para el otro equipo |
| `pnpm-workspace.yaml` con `nodeLinker: hoisted` además de `.npmrc` | Solo `.npmrc` | pnpm 11 no lee `node-linker` en `.npmrc`; sin hoist, `pnpm run make` no resuelve módulos |

## Limitaciones conocidas

- Sin Hyperswarm, Hyperbee, mDNS ni BLE.
- `app.js` y `workers/main.js` están, pero el router no los abre.
- El TUI no existe: `frontend/` son stubs que consumen el mock y no pintan pantalla.
- `pear touch` / `stage` / `seed` / `install` no se corrieron.

## Cómo verificar que funciona

```sh
pnpm start
pnpm start -- scan      # tiene que quedar vivo hasta Ctrl+C
pnpm start -- beacon
pnpm run make
./out/linux-x64/towerbell -h
```
