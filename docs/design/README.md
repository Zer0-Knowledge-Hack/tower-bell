# Diseño de Towerbell

Esta carpeta existe por una razón concreta: **el brief de diseño no estaba en el repo.**

Se escribió el 22/08, vivía en la carpeta de descargas de una máquina, y por lo tanto nadie
podía citarlo en una revisión ni notar cuándo se dejó de cumplir. Un documento normativo que
no está en el repositorio no es normativo — es una preferencia personal.

## Qué hay acá

| Archivo                                | Qué es                                                                  |
| -------------------------------------- | ----------------------------------------------------------------------- |
| [`brief-slides.md`](./brief-slides.md) | El brief original, sin editar. Paleta, tipografía, gramática de página. |

Está escrito para diapositivas, pero su paleta y su tipografía son de hecho el sistema visual
del proyecto: la primera implementación de la app (`efafde2`) las tomó de acá.

## Estado: hay una deriva sin resolver

**Esto no está decidido. No lo cierre nadie por su cuenta.**

El brief cierra cuatro colores y dice explícitamente _"Máximo tres de los cuatro por
composición"_ y _"no agregar un quinto color"_. La primera implementación lo respetó:

| Brief             | Implementado en `efafde2` | Distancia     |
| ----------------- | ------------------------- | ------------- |
| `--trazo #0E47A1` | `navy: '#0D47A1'`         | un dígito hex |
| `--senal #42A5F9` | `sky: '#54ADF6'`          | misma familia |
| `--hueso #EAEDEF` | `bg: '#E8EEF7'`           | misma familia |
| `--tinta #0F1E19` | `ink: '#0A110F'`          | misma familia |

El commit `af42c9d` reemplazó eso por un sistema 8-bit: `#5CE1FF` sobre `#020617`, con
Press Start 2P y VT323 en landing y pitch. El brief pide Playfair Display + Barlow +
JetBrains Mono y dice _"nada gótico ni mágico"_.

Además, del brief nunca se implementó: **Chu** (el búho vigía que también es rosa de los
vientos — `grep -rn "Chu"` no devuelve nada en el repo), los estados por densidad y forma en
vez de por color, y la cianotipia náutica.

No fue desobediencia de nadie: el brief no estaba donde se pudiera consultar. Archivarlo es
el primer paso; **decidir qué dirección se toma es una conversación aparte y sigue abierta.**

## La trampa de idioma

El brief nombra sus tokens en español (`tinta`, `hueso`, `trazo`, `senal`). **Esos nombres son
para humanos, no para el código.**

`AGENTS.md` es explícito: todo identificador, variable y salida por consola va en inglés. Un
documento de planificación en español describe las mismas cosas para que se lean cómodo, y
eso no lo convierte en una versión alternativa del código. Ya pasó una vez con el contrato del
backend (`escanear`/`transmitir` en el plan contra `scan`/`beacon` en el código) y hubo que
escribir un párrafo entero en `AGENTS.md` para arbitrar.

Si el brief se implementa, los tokens van en inglés. Correspondencia sugerida, para que nadie
la improvise dos veces distinto:

| Brief   | Rol                                    | Token en código |
| ------- | -------------------------------------- | --------------- |
| `tinta` | fondo principal / texto sobre claro    | `ink`           |
| `hueso` | texto sobre oscuro                     | `bone`          |
| `trazo` | estructura: grilla, líneas, marcadores | `stroke`        |
| `senal` | acento: lo que transmite ahora         | `signal`        |

Cuidado con `senal`: en código sería `signal`, y `frontend/src/api/mock-data.js` ya usa
`signal` para la fuerza de señal de un peer. Son dos cosas distintas con el mismo nombre —
resolverlo antes de escribir, no después.

## Cómo se usa esto

1. Cualquier PR que cambie colores, tipografía o la forma de un componente **cita este brief**
   o explica por qué se aparta. Apartarse está permitido; hacerlo en silencio no.
2. El brief se cambia con un PR a este archivo, no en un chat.
3. Hay un owner de diseño o no hay diseño. El plan original repartía backend, frontend y docs,
   y no asignaba a nadie este documento — por eso se perdió.

## Deuda conocida

- `frontend/src/store/app.store.js` y `frontend/src/api/mock-data.js` tienen identificadores en
  español (`'local-propio'`, `propio: true`, `'z32milocalpropio'`) que vienen de `efafde2` y
  contradicen `AGENTS.md`. Es del owner de `frontend/src`, está anotado, no corregido.
