# TOWERBELL — Sistema de Trabajo
### Hackathon Pear Track (Tether) · Buenos Aires
**Ventana oficial:** Sábado 12:00 ARG → Domingo 12:00 ARG · **Judging:** Domingo 13:00 ARG
**Ventana real de Towerbell:** Sábado 12:00 → Sábado 23:30. *El domingo es colchón, no jornada.*

---

## 1. El producto

**Nombre de trabajo:** Towerbell
**Una línea:** Descubrimiento hiperlocal de comercios sin internet — los locales transmiten su información por Bluetooth/WiFi y los transeúntes la reciben en su terminal, peer-to-peer, sin servidores ni Google Maps.

**El pitch de 30 segundos para el juez:**
> "Un local prende Towerbell y empieza a anunciar: qué vende, qué promo tiene hoy, si está abierto. Cualquier persona caminando con Towerbell instalado ve ese local aparecer en su panel cuando pasa cerca. Sin internet, sin cuenta, sin base de datos central. Apagás el wifi y sigue funcionando."

**Por qué gana:** cumple el requisito duro (`pear install` + OTA), toma la dirección bonus (BLE-Swarm), y tiene una demo que se ve en vivo apagando el wifi.

---

## 2. Regla de oro del fin de semana

> **Lo que puntúa es que el juez pueda correr `pear install pear://<key>` y ver una actualización OTA llegar.**
> Todo lo demás es diferencial. Si a las 20:00 de hoy BLE no funciona, se entrega igual con descubrimiento por LAN/mDNS y se documenta BLE como próximo paso.

### Modo intensivo: se termina HOY

**Cerramos el sábado, no el domingo.** El domingo a la mañana no es tiempo de trabajo, es colchón. Un equipo que llega al domingo 11:00 codeando es un equipo que no entrega.

Esto no es opinión, es aritmética: si algo se rompe a las 10:00 del domingo, no hay margen. Si se rompe a las 22:00 del sábado, hay toda la noche. **Terminar temprano no es ambición, es gestión de riesgo.**

| Prioridad | Qué | Cuándo debe estar listo |
|---|---|---|
| **P0** | Deploy con `pear stage/seed/release` funcionando | **Hoy 17:00** |
| **P0** | OTA demostrable de punta a punta | **Hoy 19:00** |
| **P1** | Descubrimiento de peers + sync de datos | Hoy 20:30 |
| **P2** | TUI (panel del viajero + panel del local) | Hoy 22:00 |
| **P3** | BLE puro sin internet | Hoy 20:00 (si no anda, se descarta ahí mismo) |
| **P0** | Video demo + README + link seeded | **Hoy 23:30** |
| — | Domingo | **Solo colchón y seeding. Cero código nuevo.** |

---

## 2.5 Tooling: pnpm

Trabajamos con **pnpm**, no npm. Reglas:

- **`.npmrc` con `node-linker=hoisted` es obligatorio y se commitea.** Bare resuelve módulos distinto a Node y `pear stage` empaqueta recorriendo `node_modules`; el layout con symlinks de pnpm es la causa #1 de "anda en dev pero el binario no encuentra el módulo".
- Se commitea `pnpm-lock.yaml`. Nadie usa `npm install` en el repo (generaría un `package-lock.json` fantasma).
- Los scripts del template (`start`, `make`) se corren con `pnpm start` / `pnpm run make` — funcionan igual, son scripts de `package.json`.
- El primer `pear stage` (bloque de las 15:00) sirve también como test de que el bundle con pnpm sale bien. Si falla ahí, ver tabla de riesgos §9.

---

## 3. Estructura del equipo: Frontend / Backend

El proyecto se parte en **dos equipos que trabajan en paralelo desde las 13:30**, unidos por un contrato de datos congelado (§3.3). Ninguno espera al otro.

### 3.1 BACKEND — el motor P2P

**Owner: _____** · Refuerzo: _____

Todo lo que pasa por debajo de la pantalla.

| Área | Qué incluye |
|---|---|
| **Pear Ops** | `pear touch`, `stage`, `seed`, `release`, binarios con `pnpm run make`, mantener el link vivo. Es el único que toca el pipeline de deploy. |
| **OTA** | Integración de `pear-runtime` en el worker thread, verificar que el update llega a una copia instalada. |
| **Descubrimiento** | Hyperswarm / mDNS / BLE detrás de una misma interfaz. |
| **Datos** | Hyperbee, replicación entre peers, esquema del registro de local. |
| **Modo beacon** | El proceso del comercio que anuncia y sirve sus datos. |

**Entregable del backend:** un módulo que expone `descubrir()`, `publicar(registro)` y emite eventos cuando aparece o desaparece un peer. Nada de esto imprime en pantalla.

### 3.2 FRONTEND — el TUI

**Owner: _____** · Refuerzo: _____

Todo lo que el usuario ve en la terminal.

| Área | Qué incluye |
|---|---|
| **Panel del viajero** | Lista de locales cercanos, ordenados por señal. Estado de conexión. Qué modo de descubrimiento está activo. |
| **Panel del comerciante** | Formulario para cargar nombre, categoría, mensaje del día. Indicador de "estás transmitiendo". |
| **Estados vacíos** | "Buscando locales cerca…", "Ningún local cerca", "Sin conexión — modo BLE". **Estos son los que más se ven en el video.** |
| **Router de comandos** | `towerbell scan` / `towerbell beacon` / `towerbell --help`. |
| **Identidad visual** | Colores ANSI, banner, cómo se ve Towerbell. |

**Entregable del frontend:** un TUI que funciona **contra datos mock** desde el minuto uno y no se entera de si abajo hay BLE, mDNS o un JSON falso.

### 3.3 El contrato — se congela a las 13:30

Esto es lo que permite que ambos equipos trabajen en paralelo. **Se define antes de escribir una línea de UI o de swarm, y no se cambia sin acuerdo de los dos owners.**

```js
// backend/index.js — la única superficie que el frontend conoce

// Modo viajero
const red = towerbell.escanear()
red.on('local-encontrado', (registro) => {})   // ver esquema §4
red.on('local-perdido', (id) => {})
red.on('estado', ({ modo, conectado }) => {})  // modo: 'dht' | 'mdns' | 'ble'
red.listar()                                    // → [registro]

// Modo comercio
const beacon = towerbell.transmitir(registro)
beacon.actualizar(registro)
beacon.on('visitante', ({ total }) => {})       // cuántos peers me leyeron
beacon.detener()
```

**Mock obligatorio:** el backend entrega en el bloque de las 13:30 un `backend/mock.js` que implementa esta misma interfaz con datos falsos y un timer. El frontend desarrolla contra eso todo el día. Se cambia un import al final y listo.

Si el backend no entrega el mock a las 13:30, el frontend lo escribe él mismo en 15 minutos. **Nadie se queda esperando.**

### 3.4 Transversal

| Rol | Owner | Responsabilidad |
|---|---|---|
| **Demo & Docs** | _____ | README, guión del video, grabación, submission. **Empieza a las 15:00.** Puede ser el mismo que frontend. |

**Regla:** Pear Ops (backend) nunca se bloquea. El deploy tiene que poder hacerse aunque el TUI esté a medio terminar — por eso el HITO 1 se valida con la vertical slice fea, no con la versión linda.

---

## 4. Arquitectura

### Dos modos, un binario

```
towerbell beacon    # modo comercio: anuncia y sirve datos
towerbell scan      # modo viajero: descubre y muestra el panel
```

### Flujo de datos

```
┌─────────────────────┐                    ┌─────────────────────┐
│   LOCAL (beacon)    │                    │  VIAJERO (scan)     │
│                     │                    │                     │
│  Hyperbee local     │ ──── discovery ──► │  Descubre peer      │
│  ├ nombre           │   (BLE / mDNS /    │         │           │
│  ├ categoría        │    Hyperswarm)     │         ▼           │
│  ├ promo del día    │                    │  Replica el core    │
│  ├ horario          │ ◄─── replicación ─►│         │           │
│  └ estado           │      (Hypercore)   │         ▼           │
│                     │                    │  Renderiza panel    │
└─────────────────────┘                    └─────────────────────┘
```

### Esquema de datos (v1 — mantenerlo chico)

```json
{
  "id": "<clave pública z32>",
  "nombre": "Café Rivadavia",
  "categoria": "cafeteria",
  "estado": "abierto",
  "mensaje": "2x1 en medialunas hasta las 18",
  "horario": "08:00-20:00",
  "actualizado": "2026-08-22T14:30:00Z"
}
```

**Regla:** el payload no supera 1KB. BLE tiene MTU chico y el rango es escaso; si crece, se parte en un Hyperdrive aparte y se sincroniza solo bajo demanda.

### Estructura de carpetas

La separación front/back tiene que existir en el repo, no solo en la cabeza del equipo.

```
towerbell/
├── package.json          # upgrade link va acá (pear.upgrade)
├── .npmrc                # node-linker=hoisted — commiteado
├── index.js              # router: scan | beacon | --help
│
├── backend/              # 🔧 OWNER: BACKEND — el frontend no edita acá
│   ├── index.js          # la interfaz del contrato §3.3
│   ├── mock.js           # implementación falsa — se entrega 13:30
│   ├── descubrimiento/
│   │   ├── dht.js        # Hyperswarm
│   │   ├── mdns.js       # bare-mdns-discovery
│   │   └── ble.js        # ble-swarm (P3)
│   ├── datos.js          # Hyperbee, esquema, replicación
│   └── ota.js            # pear-runtime en worker thread
│
├── frontend/             # 🎨 OWNER: FRONTEND — el backend no edita acá
│   ├── viajero.js        # panel de locales cercanos
│   ├── comercio.js       # panel del beacon
│   ├── componentes/      # lista, spinner, banner, estados vacíos
│   └── estilo.js         # colores ANSI, formato
│
└── out/                  # binarios generados por pnpm run make
```

**Regla de propiedad:** si necesitás un cambio en la carpeta del otro equipo, lo pedís. No lo hacés vos. Dos personas editando el mismo archivo a las 21:00 de un hackathon es un conflicto de merge garantizado.

### Branch de arranque

Partimos de `hello-pear-bare` rama **`main`** (updater en worker thread de Bare).
**Razón:** Towerbell es un proceso de larga duración (TUI que escanea continuamente), así que la lógica P2P del updater debe vivir fuera del hilo principal para no trabar el render.

Se documenta esta decisión en el README — el brief dice explícitamente que evalúan si la forma del proceso es coherente con lo que hace la herramienta.

### Estrategia de descubrimiento en capas

Se implementa como una interfaz común con tres backends intercambiables. Se entrega lo que funcione.

1. **Hyperswarm/DHT** — la red base, requiere internet. Es el piso seguro.
2. **mDNS local** (`bare-mdns-discovery`) — misma red WiFi, sin internet. Fallback confiable para el venue.
3. **BLE** (`ble-swarm`, `bare-bluetooth-*`) — sin red de ningún tipo. El diferencial.

---

## 5. Cronograma intensivo — HOY

Dos carriles en paralelo. **Backend** y **Frontend** avanzan sin bloquearse gracias al contrato de §3.3. Los 🚩 hitos son puntos de sincronización obligatorios: ahí para todo el mundo.

| Hora | 🔧 BACKEND | 🎨 FRONTEND |
|---|---|---|
| **12:00–13:00** | *Setup conjunto* — Pear CLI, clone, `.npmrc` con `node-linker=hoisted` **antes** del primer `pnpm install`, `pear touch`, link en `package.json`, `pnpm start` andando en todas las máquinas | *Setup conjunto* — igual, más elegir librería de TUI y validar que corre en Bare (no todo lo de Node anda) |
| **13:00–13:30** | 🚩 **CONTRATO** — se congela la interfaz de §3.3 y el esquema de datos. Los dos owners lo firman. Media hora, ni un minuto más. | |
| **13:30–15:00** | Vertical slice: beacon que anuncia JSON hardcodeado + scanner que lo lista. Feo, sin Hyperbee. **Entregar `backend/mock.js` a las 13:45.** | Router de comandos (`scan`/`beacon`). Esqueleto del panel del viajero **contra el mock**. Banner e identidad. |
| **15:00–17:00** | 🚩 **HITO 1: DEPLOY.** `pear stage` + `seed` + `release`. Alguien de otro equipo instala y le funciona. Valida el bundle con pnpm. | Panel del viajero funcional: lista, orden por señal, estados vacíos. Sigue sobre el mock. |
| **17:00–19:00** | 🚩 **HITO 2: OTA.** Se publica un cambio y se verifica que llega solo a una copia instalada. **Se graba en el momento.** Ya somos entregables. | Panel del comerciante: formulario de carga, indicador de "transmitiendo". |
| **19:00–19:30** | 🚩 **CORTE + COMIDA.** Retro de 15 min. ¿Qué se recorta? ¿El frontend ya puede enchufarse al backend real? | |
| **19:30–20:30** | Hyperbee reemplaza el JSON. Replicación real entre dos máquinas. En paralelo: BLE — **20:00 es la hora de corte.** | 🚩 **INTEGRACIÓN.** Se cambia el import de `mock.js` a `backend/index.js`. Acá aparecen los bugs reales — es el bloque más peligroso del día. |
| **20:30–22:00** | Soporte a la integración. Fix de lo que rompió. **Cero features nuevas.** | Pulido visual con datos reales. Se prioriza lo que se ve en el video sobre lo que tiene features. |
| **22:00–22:30** | 🔒 **CONGELAMIENTO.** Binarios con `pnpm run make`. Prueba en máquina limpia. Último `pear stage/release`. | 🔒 Congelado. Pasa a apoyar el video. |
| **22:30–23:30** | Verificar que el link instala desde una máquina virgen. | Video grabado y subido. README. Repo público. **Formulario enviado.** |
| **23:30–00:00** | 🚩 **VERIFICACIÓN CRUZADA.** Dos personas distintas repiten la instalación desde cero. Se designa máquina de seeding y su respaldo. | |

### El bloque de las 19:30 es el que hay que cuidar

La integración es donde mueren los proyectos con arquitectura paralela. Mitigaciones:

- El contrato de §3.3 no cambió en todo el día. Si cambió, se avisó a los dos owners en el momento.
- El frontend nunca asumió nada que no esté en el contrato (ni el orden de los campos, ni que los datos lleguen sincrónicamente).
- **Se integra con el backend real pero con datos falsos primero:** el backend expone `--fake` que emite registros de prueba por la interfaz real. Así se separa "el contrato está mal" de "el swarm no conecta".
- Si a las 20:30 la integración no cierra, **se entrega con el mock y se documenta**. Ya tenemos el HITO 2 grabado.

### DOMINGO — sin código

| Hora | Qué |
|---|---|
| Mañana | Dormir. La máquina de seeding queda prendida. |
| 10:00 | Chequeo: ¿el link sigue instalable? ¿el video sigue accesible? |
| 12:00 | Cierre oficial del hackathon. Ya estábamos entregados. |
| 13:00–17:00 | **Judging.** Seeding activo, alguien disponible en Telegram, chequeo del link cada hora. |

**Si algo se rompe el domingo**, tenemos toda la mañana para arreglarlo con la cabeza descansada — que es exactamente el punto de haber terminado hoy.

### Reglas del modo intensivo

1. **Nada de refactors.** Si funciona feo, queda feo. El juez no lee el código, corre el binario.
2. **Nada de features nuevas después de las 20:30.** Ninguna. Aunque sea "cinco minutitos".
3. **Se trabaja en paralelo, no en serie.** Demo & Docs empieza el README a las 15:00, no a las 22:00.
4. **El hito 2 nos hace entregables a las 19:00.** Todo lo que viene después es mejora sobre algo que ya podríamos entregar. Esa es la red de seguridad.
5. **Si un bloque se atrasa, se recorta el siguiente.** El reloj no se negocia.

---

## 6. Definición de "Terminado"

### Backend
- [ ] Respeta la interfaz del contrato §3.3 sin cambios no acordados
- [ ] Funciona con el flag `--fake` y con datos reales
- [ ] No imprime nada en pantalla (eso es del frontend)
- [ ] Corre en el binario compilado, no solo con `pnpm start`

### Frontend
- [ ] Funciona contra `mock.js` **y** contra el backend real
- [ ] Los estados vacíos y de error se ven bien (son los que más aparecen en el video)
- [ ] No importa nada de `backend/` que no sea `backend/index.js`
- [ ] Corre en el binario compilado, no solo con `pnpm start`

### Cualquiera de los dos
- [ ] Otra persona del equipo la probó en su máquina
- [ ] Está mergeada a `main`
- [ ] Si cambió comportamiento visible: está anotada para el README

**El proyecto** no está terminado hasta que:

- [ ] `pear install pear://<key>` funciona desde una máquina que nunca vio el repo
- [ ] Una actualización OTA llegó a una copia instalada, verificado en vivo
- [ ] El video muestra ambas cosas
- [ ] El README dice qué construimos, de qué branch partimos y por qué
- [ ] Está declarado para qué plataformas hay binarios
- [ ] El link está seeded y hay alguien responsable de que siga seeded

---

## 7. Flujo de git

- `main` siempre instalable. Si `main` está roto, es la emergencia número uno.
- **Ramas prefijadas por equipo:** `back/ble-discovery`, `back/hyperbee`, `front/panel-viajero`, `front/estados-vacios`. Así se ve de un vistazo quién toca qué.
- Cada equipo mergea a `main` cuando su parte anda contra el contrato. No se espera al otro.
- Commits chicos y frecuentes. En hackathon, un commit gigante a las 4am es una bomba.
- **Nadie hace `pear stage` desde una rama que no sea `main`.**
- Antes de cada `pear release`: tag en git con la misma versión. Así sabemos qué release corresponde a qué código cuando el juez pregunte.

---

## 8. Comunicación

| Qué | Dónde | Cuándo |
|---|---|---|
| Estado del equipo | En voz alta, todos juntos | Al cierre de cada bloque: 13:00, 15:00, 17:00, 19:00, 20:30, 22:00 |
| Bloqueos | Se dice **inmediatamente**, no se guarda | Al minuto de estar trabado |
| Dudas de Pear/Bare | Telegram del hackathon → mentores | **Hoy** — el sábado es el día de mejor cobertura de mentores, y es nuestro único día |
| Dudas técnicas profundas | Sala Pear Development en Keet | Cuando el mentor lo derive |

**Standup de bloque — tres preguntas, un minuto por persona:**
1. ¿Qué cerré?
2. ¿Qué me traba?
3. ¿Llegamos al próximo hito o recortamos?

**Regla de los 45 minutos:** si estás trabado más de 45 minutos en lo mismo, no seguís solo. Pedís ayuda al equipo o al mentor. En un plan de un día, dos horas de alguien trabado es el 10% del proyecto.

---

## 9. Riesgos y planes B

| Riesgo | Probabilidad | Plan B |
|---|---|---|
| BLE no funciona (módulos experimentales, permisos de OS) | **Alta** | mDNS sobre WiFi local. La demo igual se hace "sin internet", solo que con router en vez de bluetooth. |
| `INVALID_URL` al arrancar | Alta | Es el placeholder del template. Correr `pear touch` y pegar el link real en `package.json`. |
| Los updates parecen muertos | Media | Si usamos la variante daemon, el error va a `<storage>/updates.log`, no a la terminal. Mirar ahí primero. |
| La IA alucina APIs de Node que no existen en Bare | **Alta** | Verificar todo contra `docs.pears.com/reference/`. Bare ≠ Node. `bare-fs`, no `fs`. |
| pnpm rompe el bundle de `pear stage` (symlinks/store global) | **Alta** | `.npmrc` con `node-linker=hoisted` desde el minuto cero. Si igual falla: borrar `node_modules` + lockfile y reinstalar; último recurso, `npm install` plano solo para el stage final. **Se valida en el HITO 1 (15:00–17:00), no después.** |
| El link deja de estar seeded durante judging | Media | Máquina designada + segunda máquina de respaldo seedeando. Se chequea cada hora durante el judging. |
| El binario no corre en máquina limpia | Media | Probar en una máquina que nunca tuvo Node/Pear en el bloque de congelamiento (22:00). |
| **La integración front↔back falla a las 19:30** | **Alta** | Contrato congelado a las 13:30 + flag `--fake` en el backend para aislar si el problema es el contrato o el swarm. Plan B: se entrega con mock y se documenta. |
| El frontend queda bloqueado esperando al backend | Media | `backend/mock.js` entregado a las 13:45. Si no llega, el frontend lo escribe él mismo en 15 min. |
| Conflictos de merge por editar los mismos archivos | Media | Regla de propiedad de carpetas (§4). Nadie edita la carpeta del otro equipo. |
| Nos pasamos de scope | **Muy alta** | Este documento. Los hitos con 🚩 no se mueven. |

---

## 10. Guión del video demo

Máximo 3 minutos. **El clip del OTA se graba a las 19:00, cuando pasa** — no se reconstruye después. El resto se graba a las 22:30 con el código ya congelado.

1. **(20s) Problema.** "Estás caminando por una zona que no conocés. ¿Qué hay acá? Abrís Maps, esperás que cargue, ves resultados pagos y locales que cerraron hace un año."
2. **(30s) Instalación.** Terminal limpia. `pear install pear://<key>`. Corre. Sin registro, sin cuenta.
3. **(45s) El local.** `towerbell beacon` — el comerciante carga su nombre y su promo. Está anunciando.
4. **(45s) El viajero.** `towerbell scan` — aparece el local en el panel. **Se apaga el wifi. Sigue funcionando.**
5. **(30s) OTA.** Se publica una nueva versión. Se ve llegar sola a la copia ya instalada, sin que el usuario haga nada.
6. **(10s) Cierre.** Repo, link, plataformas.

**Lo que el juez tiene que ver sí o sí:** la instalación y la actualización llegando. Todo lo demás es contexto.

---

## 11. Checklist de entrega

- [ ] Repo público
- [ ] README: qué es, de qué branch partimos, por qué esa forma de proceso, cómo se usa
- [ ] Link `pear://` en el README y en el formulario de submission
- [ ] Video demo subido y accesible (probar el link en incógnito)
- [ ] Plataformas y arquitecturas declaradas explícitamente
- [ ] Seeding activo y con responsable asignado desde esta noche hasta las 17:00 del domingo
- [ ] Alguien del equipo disponible en Telegram durante el judging

---

## 12. Enlaces operativos

**Instalación y arranque**
- Instalar Pear CLI: https://install.pears.com
- Template: https://github.com/holepunchto/hello-pear-bare
- Guía del template: https://docs.pears.com/getting-started/from-a-template/start-from-hello-pear-bare/

**Lo que más vamos a consultar**
- Referencia general: https://docs.pears.com/reference/
- CLI: https://docs.pears.com/reference/pear/cli/
- OTA / pear-runtime: https://docs.pears.com/reference/pear/runtime/
- Conectar peers: https://docs.pears.com/how-to/connect-to-peers/
- Almacenar y replicar: https://docs.pears.com/how-to/store-and-replicate/
- Deploy y release: https://docs.pears.com/how-to/operate-an-app/
- Troubleshooting: https://docs.pears.com/how-to/troubleshooting/

**Descubrimiento**
- ble-swarm: https://github.com/mafintosh/ble-swarm
- bare-mdns-discovery: https://docs.pears.com/reference/bare/modules/bare-mdns-discovery/
- bare-bluetooth-android: https://docs.pears.com/reference/bare/modules/bare-bluetooth-android/
- bare-bluetooth-apple: https://docs.pears.com/reference/bare/modules/bare-bluetooth-apple/

**Referencia de arquitectura**
- `swap`, el ejemplo del track: https://github.com/holepunchto/swap

---

## 13. Comandos de bolsillo

```bash
# Setup inicial
git clone https://github.com/holepunchto/hello-pear-bare towerbell
cd towerbell
echo "node-linker=hoisted" > .npmrc    # ⚠️ ANTES del install — pnpm sin symlinks
pnpm install
pear touch                      # → pegar el link en package.json > pear.upgrade

# Desarrollo
pnpm start                      # dev, updates desactivados
pear --menu                     # menú interactivo de comandos (v3.2.0+)

# Build
pnpm run make                   # binario en out/<platform>-<arch>

# Deploy
pear stage <canal>              # sube la app al core
pear seed <canal>               # anuncia la clave en la DHT
pear release <canal>            # marca la versión como release oficial
pear info pear://<key>          # verificar qué ve el mundo

# Instalación (lo que va a hacer el juez)
pear install pear://<key>
```

---

**Última revisión:** _____ · **Firmado por el equipo:** _____
