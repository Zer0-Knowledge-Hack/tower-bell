# Towerbell

App React Native (Expo) de descubrimiento hiperlocal. Un local transmite nombre, rubro y promo. Un transeunte la ve cuando pasa cerca. El front guarda todo en JSON y habla con una fachada P2P. Esa fachada hoy es mock; en el build nativo se reemplaza por un worker **Bare** (Pear: Hyperswarm, Hyperbee, mDNS, BLE).

## Como correr

```bash
cd C:\towerbell
npm install
npx expo start
```

- `w` abre web (http://localhost:8081)
- Expo Go: escanea el QR
- Android emulador: `a`
- Web directo: `npx expo start --web`

## Colores (obligatorios)

| Uso | Hex |
|-----|-----|
| Acento cielo | `#54ADF6` |
| Primario navy (header, botones) | `#0D47A1` |
| Fondo | `#EDF0F5` |
| Texto | `#0A110F` |

Header navy, cards blancas, iconos SVG (sin emojis).

## Roles (aislados)

Al abrir se elige identidad. Cada rol monta **otro tab bar**. Un rol no ve pantallas, datos ni acciones del otro. El guard esta en `src/utils/acl.js`.

| Rol | Ve | No ve |
|-----|----|-------|
| Visitante | Discover (radar + lista), Chat por topics, Wallet | Beacon, Admin, red global |
| Comercio | Beacon (transmitir + promo), Visitantes de *su* local | Radar de otros, Admin, wallet del viajero |
| Admin | Registro de comercios, logs, Network Debug | Editor de promo del local, wallet, chat de viajero |

En Ajustes se puede cambiar identidad (solo para demo). Restaurar JSON vuelve a la pantalla de eleccion de rol.

## Funcionalidad

### Visitante — Discover
- Escaneo mock de peers (pull to refresh o al entrar).
- Radar con locales por distancia/senal.
- Filtros: All, Cafes, Restaurants, Shops.
- Card + modal: horario, peer id, senal.
- **Connect**: abre canal P2P mock y suma conexion.
- **Save to Wallet**: guarda tarjeta de lealtad y 10 puntos.

### Visitante — Chat P2P
- Crear o unirse a un **topic** (ejercicio Connecting Peers).
- Mensajes locales al topic, sin internet.
- Esto es el patron Pear: topic = swarm/canal.

### Visitante — Wallet
- Saldo mock, Top Up / Send / Receive.
- Historial y tarjetas de lealtad persistidas en JSON.

### Comercio — Beacon
- Formulario validado con `src/data/validaciones.json` (nombre, categoria, titulo, promo, vencimiento `HH:MM`, tope 1 KB).
- **Start / Stop Broadcasting**: si transmite, el viajero lo ve en Discover (mismo dispositivo / mismo JSON).
- Analytics: peers vistos y conexiones.

### Comercio — Visitantes
- Solo metricas de *su* beacon. No lista otros locales.

### Admin
- Registrar comercio (queda en JSON y aparece al visitante).
- Manage: editar lista / borrar.
- Logs de discovery.
- Red: simular internet / mDNS / BLE y ver el JSON crudo.

### Permisos (pantalla Ajustes)
Catalogo para el APK nativo (estilo Keet). Hoy se guardan ON/OFF en JSON. En el build real hay que pedirlos al SO:

| Permiso | Para que |
|---------|----------|
| Notificaciones | Mensajes, llamadas, peer cerca |
| Microfono | Llamadas de voz |
| Camara | Videollamadas |
| Dispositivos cercanos | BLE, auriculares, discovery |
| Media | Subir / bajar archivos P2P |
| Grabacion de pantalla | Screen share |

Declarados tambien en `app.json` → `android.permissions`.

## Contrato frontend (oficial)

El UI **solo** importa `scan` y `beacon` desde `backend/`.

```js
import { scan, beacon } from './backend';

const network = scan();
network.on('status', ({ connected, mode }) => {});
network.on('peer-found', (registro) => {});
network.list();

const myBeacon = beacon({ name, category, status, message, hours });
myBeacon.on('visitor', ({ total }) => {});
await myBeacon.update({ message: 'nueva promo' });
await myBeacon.stop();
```

- `backend/mock.js` — web, Expo Go, demo sin red
- `backend/index.js` — unico switch. Ahi se enchufa hyperswarm/hyperbee en Pear Mobile

Registro de red:

```json
{ "id": "clave-publica", "name": "Cafe Rivadavia", "category": "cafeteria", "status": "open", "message": "2x1 hasta las 18h", "hours": "08:00-20:00", "updated": "2026-08-23T..." }
```

Categorias: cafeteria, restaurant, kiosk, pharmacy, bookstore, clothing, tech, other.

## Arquitectura Pear / Bare (importante)

El renderer (React Native / web) **esta sandboxed**: no usa APIs de Node.

**Bare** es el runtime JS embebido (el mismo en mobile y desktop). Toda la logica P2P vive ahi.

```
Visitante / Comercio (UI RN)
        │
        │  facade: descubrir / publicar / chat
        ▼
src/api/p2p.service.js     ← hoy: mock + timers
        │
        ▼  (cuando se enchufa Pear)
Bare worker
  Hyperswarm / DHT
  mDNS (misma WiFi, sin internet)
  BLE (sin red)
  Hyperbee (KV local + replica)
```

Desktop (tipo Keet): `renderer → electron main → Bare worker`.  
Mobile: el mismo worker Bare, misma API. Por eso el front no se entera si abajo hay BLE, mDNS o JSON falso.

Contrato que el front ya usa:

- `startScanning` / `stopScanning`
- `startBroadcasting(registro)` / `stopBroadcasting`
- `on('peerDiscovered' | 'peerLost' | 'status' | 'message' | 'topic')`
- `createTopic` / `joinTopic` / `sendChat`

Datos del local (v1, max 1 KB):

```json
{
  "id": "<clave publica z32>",
  "nombre": "Cafe Rivadavia",
  "categoria": "cafeteria",
  "estado": "abierto",
  "mensaje": "2x1 en medialunas hasta las 18",
  "horario": "08:00-20:00",
  "actualizado": "2026-08-22T14:30:00Z"
}
```

Persistencia actual: AsyncStorage, clave `towerbell.db.v2`, semilla en `src/api/mock-data.js`.

## Estructura

```
src/
  api/           p2p.service.js (facade Bare), storage, validate, mock
  store/         Zustand (estado + persistencia)
  utils/         colors, acl (roles), permissions (notas nativas)
  navigation/    tabs distintos por rol
  screens/       Discover, Chat, Wallet, Beacon, Visitantes, Admin, Red, Permisos
  components/    Iconos SVG, radar, cards, RoleGuard
  data/          validaciones.json
```

## Generar APK

Package Android: `app.towerbell.local`  
Perfil EAS `preview` genera APK (no AAB).

```bash
npm install -g eas-cli
npx eas login
npx eas build --platform android --profile preview
```

Al terminar, EAS deja un link para descargar el `.apk`.

Build local (hace falta Android SDK + Java):

```bash
npx expo prebuild -p android
cd android
.\gradlew.bat assembleRelease
```

El APK queda en `android/app/build/outputs/apk/release/`.

## Notas de producto

- Offline-first: la demo funciona con internet OFF.
- El verde “cyber” no se usa. Paleta Facebook / azul de la referencia.
- Sin emojis: iconos Feather en SVG (`src/components/common/Icon.js`).
