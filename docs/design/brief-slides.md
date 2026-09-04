# Prompt base — slides de Towerbell

Pegá esto al empezar cualquier tanda de diapositivas. Es el estado cerrado del diseño después del búho y el slide de muestra.

---

Diseñá diapositivas para **Towerbell**: descubrimiento hiperlocal sin internet, P2P por Bluetooth/Hyperswarm. Cada comercio es un campanario que "toca"; el mapa se dibuja solo a medida que caminás. La mascota es **Chu**, un búho vigía que también es la rosa de los vientos del mapa.

**Formato:** 1920×1080 (16:9), modo oscuro. Modo claro solo en portada y cierre si necesitan respirar.

**Paleta — cerrada, no agregar un quinto color:**

- `--tinta #0F1E19` fondo principal / texto sobre claro
- `--hueso #EAEDEF` texto sobre oscuro
- `--trazo #0E47A1` estructura: grilla, líneas del mapa, marcadores inactivos. **Nunca texto.**
- `--senal #42A5F9` acento. **Solo lo que transmite ahora**, más los ojos de Chu y los datos monoespaciados.
  Máximo tres de los cuatro por composición. Sin degradados entre los dos azules.

**Estados por densidad y forma, no por color** (no hay rojo ni ámbar):
transmitiendo = señal sólida + tres anillos · detectado = trazo sólido + un anillo · fuera de alcance = trazo punteado sin anillos · sin conexión = todo al 40 %.

**Tipografía:**

- Titulares: Playfair Display 500, 96–120 px, `text-wrap: balance`
- Cuerpo: Barlow 400, 30–36 px
- Datos, coordenadas, kickers, terminal: JetBrains Mono, `letter-spacing` 0.16–0.22 em, en señal
  Una serif y una sans. Nada gótico ni "mágico".

**Gramática de página** (tomada del sistema Industry, con la paleta del brief):

- Grilla visible de 60 px en trazo al 32 %, con dos rules horizontales (y=240, y=840) y dos verticales (x=120, x=1800) marcando el margen
- Marcas de registro en las cuatro esquinas (ángulos hairline de 20 px en trazo)
- Cajas cuadradas, borde de 1 px, sin relleno ni radio. Etiquetas de sección en mono, montadas sobre el borde superior
- El mapa es cianotipia / carta náutica del XIX: rectángulos de manzanas en outline, contornos punteados, ticks cardinales. **No** pergamino, no dragones, no montañas dibujadas
- Los anillos concéntricos reemplazan cualquier rastro de pisadas. Nunca huellas.

**Copy:** una idea por slide, máximo doce palabras. El juez escucha, no lee.

**Nunca:** fan art de ninguna franquicia, degradados violeta/neón de Web3, dashboard SaaS azul, estética de guía de turismo, emojis, un quinto color para resolver un estado.

**Los ocho slides:** 1 portada (Chu en rosa cardinal) · 2 el problema · 3 la idea · 4 cómo funciona (dos peers) · 5 sin internet (split idéntico) · 6 demo (captura cruda del TUI) · 7 la stack · 8 instalá (`pear install pear://<key>` en grande + QR + Chu abajo a la derecha).

**Referencias vivas en el proyecto:** `Buho Towerbell.dc.html` → 1a–1d siluetas, 2a slide 3 armado, 2b el TUI con el banner ASCII de Chu.
