# Towerbell

Descubrimiento hiperlocal de comercios sin internet: un local transmite su información y quien pasa cerca la recibe en la terminal, peer-to-peer.

## De qué partimos

El proceso es de larga duración (scan/beacon quedan corriendo). Por eso el esqueleto sale de [`hello-pear-bare`](https://github.com/holepunchto/hello-pear-bare) rama **`main`**: el updater OTA vive en un worker de Bare y no bloquea el hilo del panel.

El campo `upgrade` de `package.json` es de **primer nivel** (no `pear.upgrade`). Hasta correr `pear touch`, queda el placeholder. Arrancar con el placeholder y updates activos falla con `INVALID_URL`; `pnpm start` usa `--no-updates`.

## Desarrollo

```sh
# hoist: .npmrc (pnpm ≤10) + pnpm-workspace.yaml nodeLinker (pnpm 11+)
pnpm install
pnpm start              # ayuda
pnpm start -- scan      # modo viajero (contra backend/mock.js)
pnpm start -- beacon    # modo comercio (contra backend/mock.js)
pnpm run make           # binario en out/<platform>-<arch>
```

El frontend desarrolla contra `backend/mock.js`. El contrato está en `backend/index.js` y no se cambia sin acuerdo.

## Estructura

- `index.js` — router: `scan` | `beacon` | `--help`
- `backend/` — contrato, mock, stubs de descubrimiento/datos/OTA
- `frontend/` — stubs del panel (TUI en otra unidad)
- `app.js` + `workers/` — cableado del template para OTA (aún no se instancia)

`pear stage` / `pear seed` / `pear install` van en la unidad de deploy. `pear release` no existe en Pear v3.
