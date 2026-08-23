---
name: towerbell-dev
description: Reglas de implementación, verificación y entrega para el proyecto Towerbell (CLI P2P sobre Pear/Bare para descubrimiento hiperlocal de comercios sin internet). ACTIVAR SIEMPRE que se trabaje en este repositorio, se escriba o revise código de Pear, Bare, Hyperswarm, Hyperbee, Hypercore o Corestore, se prepare un commit o un PR, se despliegue con la CLI de pear, se pida un informe de trabajo o documentación de una fase, o se decida qué modelo usar para una tarea. También activar ante frases como "implementá X", "arreglá el updater", "hacé el commit", "generá el informe", "está listo para PR", "qué modelo uso", "verificá esto contra la doc", o cuando aparezca cualquier API de Bare o Pear en el código. Cubre routing de modelos, verificación anti-alucinación contra la documentación oficial, política de commits sin atribución de IA, y generación de informes de trabajo por fase.
---


> **Archivo único.** Esta es la skill `towerbell-dev` con sus tres referencias
> consolidadas en un solo documento. Las referencias que en la versión modular
> viven en `references/` están acá como **Anexos A, B y C**.
> Donde el texto diga "ver `references/x.md`", buscá el anexo correspondiente.

---

## Índice

1. [Reglas de trabajo](#towerbell--reglas-de-trabajo) — el cuerpo de la skill
2. [Anexo A — APIs verificadas](#anexo-a--apis-verificadas--pear-32--bare) *(consultar antes de escribir código)*
3. [Anexo B — Agentes y modelos](#anexo-b--sistema-de-agentes-y-routing-de-modelos)
4. [Anexo C — Plantillas](#anexo-c--plantillas)

---

# Towerbell — reglas de trabajo

Towerbell es una CLI peer-to-peer construida sobre Pear/Bare. Los comercios transmiten su información y los transeúntes la reciben cerca, sin internet.

Esta skill existe por tres razones concretas:

1. **Pear y Bare no son Node.** Los modelos asumen que sí y alucinan APIs, flags y comandos que no existen. Eso rompe el build en el peor momento.
2. **El repositorio no debe mostrar rastro de asistencia de IA.** Es política del proyecto, sin excepciones.
3. **Cada fase terminada debe dejar documentación e informe**, para que el trabajo sea auditable y para que quien tome el frontend sepa contra qué está integrando.

---

## Regla cero: verificar antes de escribir

Antes de usar **cualquier** API de Pear, Bare o del ecosistema Hyper, consultá **Anexo A**. Está tomado de la documentación oficial, no de memoria.

Si una API no figura ahí y no la podés confirmar en `docs.pears.com`, **no la escribas**. Decilo: "esto no lo puedo confirmar contra la doc, hay que verificarlo". Un `no sé` cuesta dos minutos; una API inventada cuesta cuatro horas de debugging a las tres de la mañana.

Cuatro errores que ya se detectaron en este proyecto y que muestran por qué esto importa:

| Lo que asume el modelo | La realidad |
|---|---|
| `pear release` marca la versión | **Removido en Pear v3.** No existe. |
| El link va en `package.json` → `pear.upgrade` | Va en **`upgrade`, campo de primer nivel**. |
| `pear stage <canal>` toma un nombre de canal | Toma un **link**: `pear stage pear://<key>` |
| El update OTA llega enseguida | `delay` **default es una hora**. Sin bajarlo, la demo no muestra nada. |

Los cuatro vienen de asumir Node o versiones viejas. Los cuatro rompen la entrega.

---

## Alcance: backend primero

**Trabajás sobre el backend, la infraestructura y el protocolo.** El frontend lo hace otra persona.

Eso significa:

- **No** escribir código de TUI, render, colores ni formato de pantalla salvo pedido explícito.
- **Sí** mantener estable el contrato que el frontend consume, y avisar apenas algo lo afecte.
- El backend **no imprime en pantalla**. Emite eventos y devuelve datos. Si necesitás debug, usá un flag `--verbose` que escriba a stderr, nunca a stdout.
- Si una tarea toca `frontend/`, pará y preguntá antes de tocar nada.

El contrato entre las dos partes es la superficie más delicada del proyecto. Cambiarlo sin avisar rompe el trabajo de otra persona en paralelo.

---

## Routing de modelos

Elegí el modelo por la tarea, no por costumbre. Si el usuario ya eligió, respetá su elección y seguí.

| Tarea | Modelo | Por qué |
|---|---|---|
| Diseño de arquitectura, decisiones de protocolo, definir el contrato | **Opus** | Decisiones caras de revertir. Vale el costo. |
| Debugging de P2P, replicación, swarm, "esto debería andar y no anda" | **Opus** | Razonamiento sobre estado distribuido y timing. |
| Auditoría anti-alucinación de código contra la doc | **Opus** | Es exactamente donde un modelo más chico repite el error. |
| Implementar contra una spec ya cerrada | **Sonnet** | El grueso del trabajo. Rápido y suficiente. |
| Refactors, tests, glue code, manejo de errores | **Sonnet** | Mecánico, con criterio acotado. |
| Redactar informes y documentación desde notas ya existentes | **Sonnet** | |
| Renombrar, formatear, mover archivos, buscar en el repo | **Haiku** | Sin criterio de diseño en juego. |
| Leer logs largos y extraer las líneas relevantes | **Haiku** | |

**Regla de escalado:** si estás con Sonnet y encontrás una decisión de arquitectura que no estaba en la spec, no la tomes solo. Pará y decí: "esto necesita una decisión de diseño, conviene pasarlo a Opus o que la tome el equipo."

**Regla de descenso:** no uses Opus para tareas mecánicas. En un proyecto con reloj, el presupuesto de contexto y tiempo se gasta donde cambia el resultado.

Más detalle en **Anexo B**.

---

## Ciclo de trabajo por unidad

Una **unidad** es un pedazo de trabajo con sentido propio: el updater OTA, la capa de descubrimiento, el esquema de datos. No es un commit ni un archivo.

### 1. Antes de escribir

- Releé el contrato de este documento y confirmá que la unidad no lo cambia. Si lo cambia, avisá primero.
- Verificá contra **Anexo A** todas las APIs que vas a usar.
- Decí en una línea qué vas a construir y qué **no** vas a tocar.

### 2. Mientras escribís

- Código chico y verificable antes que código completo. Que corra, después que sea lindo.
- **Nunca `fs`, `path`, `os` de Node.** Son `bare-fs`, `bare-os`, etc. Ver la tabla en el reference.
- Errores explícitos. En P2P, un error silencioso se vuelve un cuelgue de treinta minutos.

### 3. Antes de decir "listo"

Corré la batería de verificación completa (siguiente sección). **No declares terminada una unidad sin haberla corrido.** "Debería andar" no es un estado.

### 4. Al terminar

Generá los dos artefactos: la documentación de la unidad y el informe de trabajo. Formatos en **Anexo C**.

---

## Batería de verificación

Esto es lo que separa "el modelo cree que anda" de "anda". Corré todo, en orden. Si algo falla, la unidad no está terminada.

### V1 — Verificación de API contra la doc

Por cada API de Pear/Bare/Hyper que usaste, confirmá que existe en **Anexo A** o en la doc oficial. Listá explícitamente cuáles verificaste. **Si algo no lo pudiste confirmar, decilo en vez de asumir.**

### V2 — Ejecución real

```bash
pnpm start        # el código corre, no solo compila
```

Que no tire excepciones no alcanza. Verificá que hace lo que dice hacer.

### V3 — Dos instancias

El P2P no se puede probar con un proceso. Corré dos con storage separado:

```bash
pnpm start -- -s /tmp/tb-a
pnpm start -- -s /tmp/tb-b
```

Si no se ven entre ellas, no funciona, por más limpio que esté el código.

### V4 — Binario compilado

```bash
pnpm run make
```

Es donde aparecen los problemas de resolución de módulos que `pnpm start` esconde — sobre todo con pnpm y sus symlinks. **Andar en dev no predice andar compilado.**

### V5 — Máquina limpia

El binario corre en una máquina o contenedor sin Node, sin Pear, sin `node_modules`. Es como lo va a correr el juez.

### V6 — Estado del repositorio

```bash
git status        # nada inesperado sin trackear
git diff          # los cambios son los que creés que son
```

Revisá que no se coló nada: claves, storage local, `out/`, logs, `.env`.

### V7 — No rompiste el contrato

Si tocaste la superficie que consume el frontend, decilo explícitamente y avisá que hay que sincronizar con la otra persona.

---

## Política de commits

### Regla dura: cero atribución de IA

**Ningún commit, mensaje, PR, comentario de código o archivo del repositorio menciona Claude, Cursor, Copilot, ni ninguna herramienta de IA.**

Prohibido específicamente:

- `Co-Authored-By: Claude <...>`
- `Generated with Claude Code`
- `🤖 Generated with ...`
- `Assisted by Cursor` o cualquier variante
- Comentarios en el código tipo `// generado por IA` o `// TODO: revisar, lo escribió el modelo`
- Cualquier emoji de robot o firma de herramienta

Esto no es negociable y no depende de la configuración global de la herramienta. **Antes de cada commit, revisá el mensaje completo y sacá cualquier rastro.** Si la herramienta lo agrega sola, sacalo a mano.

El equipo sabe con qué trabaja. No hace falta que figure en el historial del repositorio, y no queremos que figure como contribución.

### Preguntar antes de commitear

**Nunca hagas `git commit` sin preguntar.** Mostrá qué vas a commitear y con qué mensaje, y esperá confirmación:

```
Listo para commitear:
  backend/descubrimiento/mdns.js  (nuevo)
  backend/index.js                (modificado)

Mensaje propuesto:
  feat(discovery): descubrimiento por mDNS en red local

¿Lo hago?
```

Lo mismo para `git push`, abrir PR, o cualquier cosa que salga de la máquina.

### Formato de los mensajes

Cortos. Una línea de asunto, imperativo, en español, bajo 60 caracteres. Cuerpo solo si agrega algo que la línea no dice.

```
feat(discovery): descubrimiento por mDNS en red local
fix(ota): bajar delay del updater para demo en vivo
refactor(datos): separar esquema de la replicación
docs(readme): documentar el flujo de despliegue
```

Prefijos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`.

**Un commit, una cosa.** Si el mensaje necesita un "y", son dos commits.

### PRs

Título corto, descriptivo, mismo formato. El cuerpo dice **qué cambia y qué verificaste** — no cómo lo hiciste ni con qué. Plantilla en **Anexo C**.

Antes de abrir un PR: la batería V1–V7 completa, sin excepciones.

---

## Documentación e informe de cada unidad

Al cerrar una unidad, generá **dos** archivos. Formatos exactos en **Anexo C**.

**1. Documentación técnica** → `docs/<unidad>.md`

Para que otra persona entienda y use lo que hiciste: qué hace, cómo se usa, qué APIs de Pear/Bare toca, qué decisiones se tomaron y por qué, qué limitaciones tiene.

**2. Informe de trabajo** → `informes/<fecha>-<unidad>.md`

Para trazabilidad: qué se hizo, qué se verificó y con qué resultado, qué quedó pendiente, qué riesgos aparecieron, qué decisiones se tomaron sobre la marcha.

El informe **incluye los resultados de la batería V1–V7**, no la promesa de haberla corrido.

Ninguno de los dos archivos menciona herramientas de IA. Son documentos del proyecto, no de cómo se escribió.

---

## Errores comunes en este proyecto

Cuando algo no anda, mirá acá antes de improvisar.

| Síntoma | Causa probable |
|---|---|
| `INVALID_URL` al arrancar | El link `upgrade` sigue siendo el placeholder. Correr `pear touch` y pegar el real. |
| El OTA "no llega" | `delay` está en su default de una hora. Bajarlo para demo. |
| En variante daemon no se ve ningún error | Los errores van a `<storage>/updates.log`, no a la terminal. |
| Anda con `pnpm start`, falla compilado | Resolución de módulos. Verificar `.npmrc` con `node-linker=hoisted` y reinstalar. |
| `Cannot find module 'fs'` | Es `bare-fs`. Ver la tabla de equivalencias en el reference. |
| Los dos peers no se ven | ¿Mismo storage? Hay que separarlos con `-s`. |
| `pear release` no existe | Correcto, removido en v3. |

---


---

# Anexo A — APIs verificadas — Pear 3.2 / Bare

Todo lo de acá está confirmado contra `docs.pears.com`. Lo que no figura acá, verificalo antes de usarlo.

**Contenido**
1. Comandos removidos
2. CLI de Pear
3. Flujo de despliegue real
4. `pear-runtime` (OTA)
5. Bare no es Node
6. Workers e IPC
7. Bloques de construcción P2P
8. Trampas conocidas

---

## 1. Comandos removidos — no existen

Un modelo los va a proponer igual porque están en todo el material viejo.

| Comando | Estado |
|---|---|
| `pear release` | **Removido en v3.** Producción va por `pear provision` + `pear multisig`. |
| `pear run` | **Removido en v3.** Reemplazado por embeber `pear-runtime`. |
| `pear init` | **Removido.** Clonar el template en su lugar. |
| `pear drop` | Removido. |
| `pear presets` | Removido. |
| `pear shift` | Removido. |
| `pear gc sidecars` | Removido en 3.2.0. |
| API global `Pear.*` | Removida en v3. Usar el módulo `pear-runtime`. |

**Para un hackathon no hace falta `release`.** `stage` + `seed` alcanza para que `pear install` funcione.

---

## 2. CLI de Pear — comandos que sí existen

### `pear touch [flags]`
Crea un link. La salida por defecto es solo `pear://<key>`, así que se captura directo:

```bash
LINK=$(pear touch)
```

Flags: `--json`, `--vanity <prefijo>` (solo caracteres z32; se pone lento pasando los 4 caracteres).

### `pear stage <link> [dir]`
Sincroniza los cambios locales al hypercore. **Toma un link, no un nombre de canal.**

```bash
pear stage pear://<key>
```

Flags: `--dry-run|-d`, `--ignore <paths>`, `--purge`, `--only <paths>`, `--json`.

Cada stage incrementa el `length`. Un peer con el link ve el cambio con `pear info`.

### `pear seed <link>`
Anuncia el link en la red y replica.

```bash
pear seed pear://<key>
```

Flags: `--until-sync <key>` (sale solo cuando ese peer sincronizó, 3.2.0+), `--stats-interval <ms>`, `--no-tty`, `--json`.

### `pear install <link>`
Lo que va a correr el juez. Instala en la carpeta de aplicaciones del sistema.

```bash
pear install pear://<key>
```

Flags: `--timeout <segundos>` (default 30), `--to <dir>`, `--only <paths>`, `--json`.

### `pear info [link] [dir]`
Verifica qué ve el resto del mundo. Sin argumentos muestra info de la plataforma.

Flags: `--key`, `--metadata`, `--manifest`, `--json`.

Con `--json` da tres objetos etiquetados: `retrieving`, `keys`, `info`. Filtrar por `tag`, no por orden.

### `pear build [flags]`
Arma la carpeta de despliegue multi-arquitectura. Requiere `--package`. Correr **desde fuera** del árbol fuente.

### Otros útiles
- `pear dump <link> [dir]` — bajar archivos. `-` como dir manda a stdout.
- `pear versions` — qué versión hay instalada.
- `pear changelog [link]`
- `pear --menu` — menú interactivo (3.2.0+, requiere TTY).
- `pear sidecar` — el servidor IPC local.

### Scripting con `--json`
Salida NDJSON: un objeto por línea, `{"cmd", "tag", "data"}`. **La posición del flag importa y no es igual en todos:**

| Comando | Posición |
|---|---|
| `pear data`, `pear gc` | **antes** del subcomando: `pear data --json dht` |
| `pear multisig` | **después**: `pear multisig keys list --json` |

La posición equivocada falla con `✖ Unrecognized Flag: --json`.

---

## 3. Flujo de despliegue real

```bash
LINK=$(pear touch)              # 1. generar link
# pegar $LINK en package.json → campo "upgrade" (primer nivel)
pear stage $LINK                # 2. subir el código
pear seed $LINK                 # 3. anunciar y mantener vivo
pear info $LINK                 # 4. verificar qué ve el mundo
pear install $LINK              # 5. lo que hace el juez
```

Para publicar una actualización: cambiar el código y volver a correr `pear stage $LINK`. Los peers con la app instalada reciben el cambio.

**El proceso de `pear seed` tiene que seguir corriendo** mientras alguien pueda querer instalar.

---

## 4. `pear-runtime` — la librería OTA

```bash
npm install pear-runtime      # o pnpm add pear-runtime
```

### El campo `upgrade` va en la raíz del package.json

```json
{
  "version": "1.0.0",
  "upgrade": "pear://qxenz5wmspmryjc13m9yzsqj1conqotn8fb4ocbufwtz9mtbqq5o"
}
```

**No es `pear.upgrade`. Es `upgrade`, de primer nivel.** Un modelo lo va a meter bajo `pear` por analogía con otros campos.

### Instanciar

```js
const path = require('path')
const { version, upgrade, name } = require('./package.json')
const PearRuntime = require('pear-runtime')

const dir = path.join('path', 'to', 'app', 'storage')
const app = path.join('application', 'path')   // process.execPath, o null

const pear = new PearRuntime({ dir, version, upgrade, name, app })
pear.on('error', console.error)
```

### Opciones

| Opción | Tipo | Nota |
|---|---|---|
| `dir` | String | **Requerida.** Dónde guarda datos el runtime. |
| `upgrade` | String | **Requerida.** El link. |
| `name` | String | **Requerida.** Nombre del producto. |
| `version` | String | Default `0.0.0-0`. Decide si guarda un update. |
| `app` | String | Ruta al bundle. La usa `applyUpdate()`. |
| `updates` | Boolean | `false` para desactivar. Default `true`. |
| `storage` | String | Default `<dir>/app-storage`. |
| `store` + `swarm` | Corestore / Hyperswarm | Van juntos o ninguno. |
| `bundled` | Boolean | Default `!!app`. |
| `delay` | Integer | **Default una hora.** Ver abajo. |

### `delay` — crítico para la demo

El máximo aleatorio en milisegundos antes de buscar un update detectado. **El default es una hora.** Sin bajarlo, la demo en vivo no muestra nada y parece que el OTA está roto.

### Eventos de update

```js
pear.updater.on('updating', () => {
  // hay un update en camino
})

pear.updater.on('updated', () => {
  pear.updater.applyUpdate()
})
```

Un update ocurre cuando se escribe al drive seedeado — es decir, cuando corrés `pear stage` de nuevo.

### Ciclo de vida

La instanciación es **eager**: empieza a abrir store y swarm apenas vuelve el constructor.

```js
await pear.ready()    // terminó de inicializar
await pear.close()    // teardown
```

### Storage separado para probar en local

```js
const pear = new PearRuntime({ dir: STORAGE_FLAG, version, upgrade, name, app })
```

```bash
pnpm start -- -s /tmp/tb-a
pnpm start -- -s /tmp/tb-b
```

**Sin storage separado los dos procesos chocan y no se ven.** Es la causa número uno de "el P2P no anda" en desarrollo.

---

## 5. Bare no es Node

Bare es el runtime sobre el que corre Pear. Los módulos built-in de Node **no existen**.

| Node | Bare |
|---|---|
| `fs` | `bare-fs` |
| `os` | `bare-os` |
| `stream` | `bare-stream` |
| `net` / `tcp` | `bare-tcp` |
| `crypto` | `bare-crypto` |
| `child_process` | `bare-subprocess` |
| `url` | `bare-url` |
| `timers` | `bare-timers` |
| `console` | `bare-console` |
| `tls` | `bare-tls` |
| `process` (parcial) | global `Bare` |

Otros disponibles: `bare-rpc`, `bare-sqlite`, `bare-pipe`, `bare-ipc`, `bare-channel`, `bare-atomics`, `bare-fetch`, `bare-mime`, `bare-semver`, `bare-inspector`, `bare-mdns-discovery`, `bare-bluetooth-android`, `bare-bluetooth-apple`, `bare-sdl`, `bare-prom-client`, `bare-posix`.

**`Cannot find module 'fs'` significa que alguien escribió Node.** Es el síntoma más común.

---

## 6. Workers e IPC

`PearRuntime.run` es un método **estático**; la instancia expone `pear.run` como alias.

```js
const IPC = pear.run('./workers/main.js', [pear.storage])

IPC.on('data', (data) => {
  console.log('data del worker', data)
})
IPC.write('hola')
```

Del otro lado, dentro del worker:

```js
const Corestore = require('corestore')
const storage = Bare.argv[2]        // primer argumento pasado

Bare.IPC.on('data', (data) => console.log(data.toString()))
Bare.IPC.write('hola desde el worker')

const corestore = new Corestore(storage)
```

**`Bare.argv[2]` es el primer argumento**, no `argv[0]`. `IPC` es un stream dúplex.

La idea de diseño: todo el código P2P vive en un worker que actúa como backend local de la capa de vista. Para Towerbell esto encaja directo con la separación backend/frontend.

---

## 7. Bloques de construcción P2P

| Módulo | Para qué |
|---|---|
| **Hypercore** | Log append-only. La base de todo. |
| **Hyperbee** | B-tree sobre Hypercore. Lo más parecido a una base de datos. |
| **Hyperdrive** | Sistema de archivos P2P. |
| **Autobase** | Múltiples escritores. |
| **HyperDHT** | La DHT. |
| **Hyperswarm** | Descubrimiento y conexión sobre HyperDHT. |
| **Corestore** | Gestión de muchos Hypercores. |
| **Secretstream** | Streams cifrados. |
| **Protomux** | Multiplexar protocolos en una conexión. |
| **Compact-encoding** | Serialización binaria. |

Referencias en `docs.pears.com/reference/building-blocks/` y `/helpers/`.

### Descubrimiento en capas para Towerbell

1. **Hyperswarm** — requiere internet. El piso seguro.
2. **`bare-mdns-discovery`** — red local, sin internet. El fallback confiable.
3. **`ble-swarm`** — sin red. Experimental. El diferencial.

`ble-swarm` (github.com/mafintosh/ble-swarm) tiene una API mínima:

```js
var swarm = require('ble-swarm')
var sw = swarm({
  uuid: '13333333333333333333333333333337'   // hex de 16 bytes
})

sw.on('peer', function (peer) {
  // peer es un stream
})
```

Marcado experimental. Los módulos `bare-bluetooth-*` también.

---

## 8. Trampas conocidas

| Problema | Qué pasa realmente |
|---|---|
| `INVALID_URL` al arrancar | El template trae un placeholder en `upgrade`. Correr `pear touch`. |
| El OTA parece muerto | `delay` en su default de una hora. |
| Variante daemon sin errores visibles | Van a `<storage>/updates.log`, no a la terminal. |
| Dos instancias no se ven | Mismo storage. Separar con `-s`. |
| Anda en dev, falla compilado | Resolución de módulos con symlinks de pnpm. `.npmrc` con `node-linker=hoisted` **antes** del primer install. |
| `pear stage` crece muchísimo | Estás staged sobre el propio output. Correr `build` desde fuera del árbol. |
| `--json` rechazado | Posición del flag. Ver la tabla de la sección 2. |
| `pear install` timeout | Default 30s. Subirlo con `--timeout`, o el link no está seedeado. |

---

## Fuentes

- `docs.pears.com/reference/pear/cli/`
- `docs.pears.com/reference/pear/runtime/`
- `docs.pears.com/reference/bare/runtime/`
- `docs.pears.com/reference/modules/bare-modules/`
- `docs.pears.com/reference/building-blocks/`
- `github.com/mafintosh/ble-swarm`

Ante duda, la doc gana sobre este archivo, y este archivo gana sobre la memoria del modelo.


---

# Anexo B — Sistema de agentes y routing de modelos

Cómo repartir el trabajo entre modelos según lo que cuesta equivocarse.

---

## El criterio

No es "tarea difícil → modelo grande". Es **qué tan caro es revertir el error**.

Una decisión de protocolo mal tomada se propaga a todo lo que se escribe después y cuesta medio día deshacerla. Un `for` mal escrito falla enseguida y se arregla en dos minutos. El primero justifica Opus aunque parezca simple; el segundo no lo justifica aunque parezca complejo.

Tres preguntas antes de elegir:

1. **¿Es reversible?** Si sí, modelo más chico.
2. **¿Falla ruidosamente?** Un error que rompe el build al instante es barato. Uno que produce datos corruptos que se replican por la red es carísimo.
3. **¿Hay una spec cerrada?** Con spec, Sonnet ejecuta bien. Sin spec, alguien tiene que decidir, y ahí va Opus.

---

## Asignación por rol

### Arquitecto — Opus

Decide y no implementa. Su salida es una spec, no código.

- Diseño del protocolo y del esquema de datos
- El contrato entre backend y frontend
- Elegir entre Hyperbee, Hyperdrive o Hypercore pelado
- Estrategia de descubrimiento en capas
- Cuando aparece un caso que la spec no previó

**Entrega:** documento con la decisión, las alternativas descartadas y por qué. Que otro modelo pueda implementar sin volver a decidir.

### Implementador — Sonnet

El grueso del trabajo. Recibe spec, devuelve código.

- Escribir módulos contra una interfaz ya definida
- Integrar librerías del ecosistema Hyper
- Manejo de errores, reintentos, timeouts
- Tests
- Refactors acotados

**Entrega:** código que pasa V1–V4 de la batería.

**Cuándo frena:** si la spec no cubre lo que está pasando, no improvisa. Dice "esto necesita una decisión que no está en la spec" y para.

### Auditor — Opus

Revisa código escrito por otro modelo, buscando específicamente alucinaciones.

- Cada API contra `pear-api-verificada.md`
- APIs de Node que se colaron donde va Bare
- Comandos removidos en v3
- Flags inventados
- Asunciones sobre timing que no están en la doc

**Por qué Opus:** un modelo más chico auditando tiende a validar el mismo error que hubiera cometido. La auditoría rinde cuando el auditor es al menos tan capaz como el autor.

**Entrega:** lista de hallazgos con severidad. Sin hallazgos también es un resultado válido, pero tiene que decir qué verificó.

### Operario — Haiku

Trabajo mecánico sin criterio de diseño.

- Renombrar, mover, formatear
- Buscar patrones en el repo
- Leer logs largos y extraer lo relevante
- Chequeos de checklist

**Cuándo NO:** cualquier cosa que implique decidir cómo debería funcionar algo.

---

## Tabla rápida

| Situación | Modelo |
|---|---|
| "¿Cómo estructuramos la replicación?" | Opus |
| "Implementá `descubrir()` según el contrato" | Sonnet |
| "¿Por qué los peers no se conectan?" | Opus |
| "Agregá manejo de errores a este módulo" | Sonnet |
| "Revisá si este código inventa APIs" | Opus |
| "Renombrá `beacon` a `transmisor` en todo el repo" | Haiku |
| "Escribí el informe de esta fase" | Sonnet |
| "Extraé los errores de este log de 2000 líneas" | Haiku |
| "El OTA no llega y no sé por qué" | Opus |
| "Escribí tests para el esquema de datos" | Sonnet |

---

## Escalado y descenso

**Escalar (a un modelo más grande)** cuando:
- Aparece una decisión de diseño que no estaba en la spec
- Un bug lleva más de 30 minutos sin hipótesis clara
- Hay que elegir entre dos enfoques con consecuencias distintas
- El código toca el contrato con el frontend

**Bajar (a un modelo más chico)** cuando:
- La tarea es aplicar un patrón que ya existe en el repo
- Es transformación de texto o archivos
- Es leer y filtrar

**No escalar por frustración.** Si algo no anda, primero verificá contra la doc. La mayoría de los cuelgues en este proyecto son APIs inventadas, no problemas difíciles — y para eso el modelo grande no ayuda si no verifica.

---

## Trabajo en paralelo

Si hay agentes en paralelo:

- **Cada uno con su carpeta.** Dos agentes editando el mismo archivo terminan en conflicto.
- **El contrato es de solo lectura** para los implementadores. Solo el arquitecto lo cambia, y avisando.
- **Un solo agente toca el pipeline de deploy.** `pear touch`, `stage`, `seed` desde un solo lado. Dos stages simultáneos sobre el mismo link son un problema difícil de diagnosticar.
- **La auditoría va después, no en paralelo.** Auditar código que todavía se está escribiendo es tiempo perdido.

---

## Presupuesto de contexto

En un proyecto con reloj, el contexto es un recurso.

- No cargues toda la doc de Pear en cada sesión. Cargá la sección que corresponde.
- Los informes de trabajo existen justamente para no tener que releer todo el historial. Un agente nuevo lee el último informe y sabe dónde está parado.
- Si una sesión se está poniendo larga, cerrá la unidad, generá el informe, y arrancá limpio.


---

# Anexo C — Plantillas

Formatos exactos para los artefactos que se generan al cerrar cada unidad de trabajo.

**Ninguno de estos documentos menciona herramientas de IA.** Son documentos del proyecto, no de cómo se escribió el proyecto.

---

## 1. Documentación técnica

Archivo: `docs/<unidad>.md`

Para que otra persona pueda usar y modificar lo que hiciste sin preguntarte.

```markdown
# <Nombre de la unidad>

## Qué hace
Dos o tres frases. Qué problema resuelve y dónde encaja.

## Uso

​```js
// el ejemplo mínimo que funciona
​```

## Interfaz pública
| Función / evento | Firma | Qué hace |
|---|---|---|

Solo lo que se consume desde fuera. Lo interno no va acá.

## Dependencias de Pear / Bare
| Módulo | Para qué | Referencia |
|---|---|---|

Listá cada API del ecosistema que se usa y dónde está documentada.
Esto es lo que permite auditar después sin releer el código.

## Decisiones
| Decisión | Alternativa descartada | Por qué |
|---|---|---|

## Limitaciones conocidas
Qué no hace, qué no maneja, dónde se rompe.
Ser honesto acá ahorra debugging ajeno.

## Cómo verificar que funciona
Los comandos exactos, incluyendo el caso de dos instancias si aplica.
```

---

## 2. Informe de trabajo

Archivo: `informes/<AAAA-MM-DD>-<unidad>.md`

Para trazabilidad y para que un agente o persona nueva sepa dónde está el proyecto sin releer todo.

```markdown
# Informe — <unidad>
**Fecha:** AAAA-MM-DD · **Fase:** <backend / protocolo / infraestructura>

## Objetivo
Una frase. Qué se buscaba lograr.

## Qué se hizo
- Puntos concretos, no narrativa
- Archivos tocados y qué cambió en cada uno

## Verificación

| Test | Resultado | Nota |
|---|---|---|
| V1 — APIs contra la doc | ✅ / ❌ | Cuáles se verificaron |
| V2 — Ejecución real | ✅ / ❌ | |
| V3 — Dos instancias | ✅ / ❌ / N/A | |
| V4 — Binario compilado | ✅ / ❌ | |
| V5 — Máquina limpia | ✅ / ❌ / pendiente | |
| V6 — Estado del repo | ✅ / ❌ | |
| V7 — Contrato intacto | ✅ / ❌ | Si cambió, qué cambió |

**Los resultados van con lo que pasó de verdad.** Un ❌ documentado es útil;
un ✅ que no se corrió es peor que no tener la tabla.

### APIs verificadas
Lista explícita de cada API de Pear/Bare/Hyper usada y contra qué se verificó.
Si alguna no se pudo confirmar, decirlo acá.

## Pendiente
- Lo que quedó sin hacer y por qué
- Lo que se decidió posponer conscientemente

## Riesgos detectados
| Riesgo | Impacto | Mitigación |
|---|---|---|

## Decisiones tomadas sobre la marcha
Cosas que no estaban en la spec y hubo que resolver.
Si alguna debería revisarse con el equipo, marcarlo.

## Impacto en el frontend
Si el contrato cambió, qué cambió exactamente y qué tiene que ajustar la otra persona.
Si no cambió, decir "sin cambios en el contrato".

## Próximo paso sugerido
Una línea. Qué conviene atacar después.
```

---

## 3. Pull request

```markdown
## Qué cambia
Dos o tres líneas. Qué hace distinto el código después de este PR.

## Por qué
El problema que resuelve, o la decisión que implementa.

## Verificado
- [ ] APIs confirmadas contra la documentación oficial
- [ ] Corre con `pnpm start`
- [ ] Probado con dos instancias y storage separado
- [ ] Compila con `pnpm run make`
- [ ] El binario corre en máquina limpia
- [ ] Sin archivos inesperados en el diff

## Impacto en el contrato
Sin cambios / Cambia X — ver detalle.

## Limitaciones
Lo que este PR deliberadamente no resuelve.
```

**Lo que no va en un PR:**
- Cómo se escribió el código o con qué herramientas
- Firmas, coautorías o menciones de asistentes
- Emojis de robot
- Explicaciones de proceso

El PR describe **el cambio**, no el trabajo de producirlo.

---

## 4. Mensajes de commit

Una línea, imperativo, español, bajo 60 caracteres.

```
feat(discovery): descubrimiento por mDNS en red local
fix(ota): bajar delay del updater para demo en vivo
fix(deps): resolver módulos con node-linker hoisted
refactor(datos): separar esquema de replicación
docs(api): documentar interfaz del backend
test(discovery): cubrir reconexión de peers
chore(deploy): script de stage y seed
```

Prefijos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`.

**Cuerpo solo si agrega algo.** La mayoría de los commits no lo necesitan.

Cuando sí:

```
fix(ota): bajar delay del updater para demo en vivo

El default de pear-runtime es una hora, lo que hace que la
actualización no se vea durante una demo. Configurable por
variable de entorno para no afectar producción.
```

**Un commit, una cosa.** Si el mensaje necesita un "y", son dos commits.

### Prohibido en cualquier commit

Nada de esto entra al repositorio, aunque la herramienta lo agregue sola:

```
Co-Authored-By: Claude <...>
🤖 Generated with ...
Assisted by ...
Generated with Cursor
```

Revisar el mensaje completo antes de commitear. Si aparece, sacarlo a mano.