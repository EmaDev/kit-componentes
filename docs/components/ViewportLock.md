# ViewportLock

> Componente declarativo sin UI que monta los bloqueos de zoom/overscroll/long-press para lograr una experiencia 100% nativa, sin el resto de las funcionalidades de `NativeShell`.

**Import**
```tsx
import { ViewportLock } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando sólo necesitás bloquear el zoom (pinch, doble-tap, ctrl+scroll), el pull-to-refresh/rebote de scroll, el menú contextual de long-press y la selección de texto — sin necesitar el resto de lo que ofrece `NativeShell` (barra de navegador escondida, altura de viewport, safe areas). Es un wrapper delgado sobre `useNativeFeel`, pensado para montarse una vez, típicamente en el layout raíz, sin envolver contenido (no renderiza ningún elemento, devuelve `null`).

## Cuándo NO usarlo / alternativas

- Si además necesitás esconder la barra de direcciones del navegador, publicar `--app-height`/`--sa-*`, o mantener la pantalla encendida, usá `NativeShell` en su lugar — ya incluye `ViewportLock`-equivalente (`useNativeFeel`) más el resto de los hooks.
- Si necesitás control fino programático (activar/desactivar bloqueos individuales desde lógica propia, sin un componente declarativo), usá `useNativeFeel` directamente.

## Props

`ViewportLock` extiende `NativeFeelOptions` (ver `useNativeFeel`): además de las dos props propias, acepta `blockZoom`, `blockOverscroll`, `blockContextMenu`, `blockTextSelection`, `patchViewportMeta` y `disabled`.

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `onlyWhenInstalled` | `boolean` | `false` | Aplica los bloqueos sólo cuando la app corre instalada (standalone/TWA). En el navegador normal se mantiene el zoom, lo correcto para accesibilidad. |
| `onlyOnMobile` | `boolean` | `false` | Aplica los bloqueos sólo en iOS/Android, nunca en escritorio. |
| `blockZoom` | `boolean` | `true` (heredado) | Bloquea pinch-zoom, doble-tap zoom y ctrl+scroll zoom. |
| `blockOverscroll` | `boolean` | `true` (heredado) | Bloquea pull-to-refresh y el rebote de scroll del body. |
| `blockContextMenu` | `boolean` | `true` (heredado) | Bloquea el menú contextual (long-press / click derecho), salvo dentro de inputs/textareas. |
| `blockTextSelection` | `boolean` | `true` (heredado) | Bloquea la selección de texto fuera de inputs. |
| `patchViewportMeta` | `boolean` | `true` (heredado) | Reescribe el `<meta name="viewport">` con `user-scalable=no` (necesario en iOS). |
| `disabled` | `boolean` | `false` (heredado) | Desactiva todos los bloqueos, sin importar `onlyWhenInstalled`/`onlyOnMobile` (se combinan con OR: si cualquiera indica bloqueo, queda bloqueado). |

## Ejemplos

### Uso recomendado: sólo cuando la PWA está instalada
```tsx
// app/layout.tsx
<ViewportLock onlyWhenInstalled />
```

### Sólo en mobile, nunca en escritorio
```tsx
<ViewportLock onlyOnMobile />
```

### Combinando ambas condiciones (instalada Y mobile)
```tsx
<ViewportLock onlyWhenInstalled onlyOnMobile />
```

### Bloqueos parciales: sin tocar la selección de texto
```tsx
<ViewportLock onlyWhenInstalled blockTextSelection={false} />
```

## Requisitos / dependencias

- Es un wrapper directo de `useNativeFeel` + `usePlatform` (para resolver `isStandalone`/`isMobileOs`/`hydrating`). No usa `framer-motion` (no tiene UI).
- Requiere `"use client"` (ya lo declara) — no puede usarse en un Server Component.
- No renderiza ningún nodo DOM (`return null`); su único efecto es el `useEffect` de `useNativeFeel` que agrega/quita listeners globales y parchea el `<meta name="viewport">`.

## Notas y comportamiento

- **Accesibilidad**: igual que con `NativeShell`, bloquear el zoom incumple WCAG 1.4.4. `onlyWhenInstalled` es la forma recomendada de no afectar a usuarios que sólo visitan la app desde el navegador (sin instalar).
- Mientras `usePlatform` está hidratando (primer render en cliente), los bloqueos quedan desactivados (`blocked = hydrating || ...`) para evitar comportamiento inconsistente antes de que se resuelva la detección real de plataforma.
- `onlyWhenInstalled` y `onlyOnMobile` se combinan de forma restrictiva: si cualquiera de las dos condiciones indica "no bloquear acá", el bloqueo no se aplica (es decir, con ambas activas, sólo se bloquea en mobile **y** estando instalada).
- Todo es reversible al desmontar: `useNativeFeel` limpia todos los listeners y restaura los estilos/meta tags previos.
- No incluye el resto de `NativeShell` (barra de navegador, `--app-height`, `--sa-*`) — si tu app ya usa `NativeShell`, no hace falta agregar `ViewportLock` también (sería redundante).
