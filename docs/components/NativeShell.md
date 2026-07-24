# NativeShell

> Raíz "todo en uno" para que una web app se sienta nativa: combina bloqueos de zoom/overscroll/long-press, barra del navegador escondida, altura real del viewport y safe areas publicadas como CSS vars.

**Import**
```tsx
import { NativeShell } from "lib-kit-components";
```

## Cuándo usarlo

Usalo como wrapper de toda la app (típicamente en `app/layout.tsx`) cuando querés que se sienta como una app nativa instalada: sin zoom accidental, sin pull-to-refresh, sin menú de long-press, con la barra de direcciones del navegador escondida en mobile, altura de viewport estable (sin saltos al aparecer/ocultar la barra del navegador) y las safe areas del dispositivo disponibles como CSS vars (`--sa-top`, `--sa-bottom`, `--app-height`, `--kb-inset`) para que cada pantalla decida qué bordes respetar con `SafeArea`. Internamente combina cuatro hooks: `useNativeFeel`, `useImmersive`, `usePlatform` y `useSafeArea`.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás el bloqueo de zoom/gestos, sin el resto de las funcionalidades (barra de navegador, altura de viewport, safe areas), usá `ViewportLock` en su lugar — es más chico, no tiene contenedor propio y no publica CSS vars adicionales.
- `NativeShell` no aplica padding por sí mismo — sigue siendo necesario usar `SafeArea` (o las CSS vars directamente) en cada pantalla para respetar los bordes.

## Props

`NativeShell` extiende `NativeFeelOptions` (ver `useNativeFeel`), es decir que además de las props propias acepta también `blockZoom`, `blockOverscroll`, `blockContextMenu`, `blockTextSelection`, `patchViewportMeta` y `disabled`.

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `children` | `ReactNode` | — | Contenido de la app. |
| `onlyWhenInstalled` | `boolean` | `false` | Aplica los bloqueos (`useNativeFeel`) sólo cuando la PWA corre instalada (standalone/TWA). Recomendado en `true` para no romper el zoom en el navegador normal (ver nota de accesibilidad abajo). |
| `hideAddressBar` | `boolean` | `true` | Esconde la barra de direcciones del navegador en mobile (vía scroll a 1px). |
| `trackViewportHeight` | `boolean` | `true` | Publica `--app-height` con la altura real del viewport. |
| `keepAwake` | `boolean` | `false` | Mantiene la pantalla encendida (Screen Wake Lock API). |
| `fillViewport` | `boolean` | `true` | El contenedor raíz ocupa `minHeight: var(--app-height, 100dvh)`. |
| `className` | `string` | `""` | Clases CSS para el contenedor raíz. |
| `blockZoom` | `boolean` | `true` (heredado) | Ver `useNativeFeel`. |
| `blockOverscroll` | `boolean` | `true` (heredado) | Ver `useNativeFeel`. |
| `blockContextMenu` | `boolean` | `true` (heredado) | Ver `useNativeFeel`. |
| `blockTextSelection` | `boolean` | `true` (heredado) | Ver `useNativeFeel`. |
| `patchViewportMeta` | `boolean` | `true` (heredado) | Ver `useNativeFeel`. |
| `disabled` | `boolean` | `false` (heredado) | Desactiva todos los bloqueos de `useNativeFeel` (independiente de `onlyWhenInstalled`; ambas condiciones se combinan con OR). |

## Ejemplos

### Uso básico en el layout raíz, sólo bloqueando cuando está instalada
```tsx
// app/layout.tsx
<NativeShell onlyWhenInstalled>{children}</NativeShell>
```

### Aplicando los bloqueos siempre (incluso en el navegador)
```tsx
<NativeShell>{children}</NativeShell>
```

### Manteniendo la pantalla encendida (ej. app de cocina, presentaciones)
```tsx
<NativeShell onlyWhenInstalled keepAwake>{children}</NativeShell>
```

### Personalizando qué bloqueos aplicar
```tsx
<NativeShell
  onlyWhenInstalled
  blockContextMenu={false}   // dejar el menú de long-press disponible
  blockTextSelection={false} // permitir seleccionar texto
>
  {children}
</NativeShell>
```

## Requisitos / dependencias

- Combina internamente `useNativeFeel` (bloqueos), `useImmersive` (barra de navegador, altura de viewport, wake lock), `usePlatform` (detección de standalone/hidratación) y `useSafeArea` (publica `--sa-*`).
- Usa `framer-motion` sólo indirectamente (no lo importa este archivo, pero es una dependencia general del paquete).
- Requiere `"use client"` (ya lo declara el componente) — no puede usarse en un Server Component.
- Mientras `usePlatform` está hidratando (`hydrating: true`, primer render en cliente antes de resolver `isStandalone`), los bloqueos quedan desactivados (`blocked = hydrating || ...`) para evitar aplicar/quitar comportamiento de forma inconsistente durante la hidratación.

## Notas y comportamiento

- **Accesibilidad**: bloquear el zoom incumple WCAG 1.4.4. Por eso `onlyWhenInstalled` (default `false`, pero recomendado `true`) es la forma sugerida de aplicar los bloqueos sólo cuando el usuario ya instaló la app como algo "tipo app nativa", dejando el navegador normal con zoom intacto. Si activás los bloqueos siempre, ofrecé un control propio de tamaño de texto.
- No aplica ningún padding — publica las CSS vars (`--sa-top`, `--sa-right`, `--sa-bottom`, `--sa-left`, `--app-height`, `--kb-inset` este último vía `useKeyboardInset` si se usa aparte) y deja que cada pantalla decida qué bordes respetar con `<SafeArea/>`.
- En iOS, el pinch-zoom sólo se puede frenar reescribiendo el `<meta name="viewport">` (no hay forma de cancelarlo sólo con `preventDefault` en JS); `useNativeFeel` lo hace y lo restaura al desmontar.
- `hideAddressBar` usa el truco de hacer `scrollTo(0, 1)` y volver a `scrollTo(0, 0)` al cargar y al rotar — es la única vía funcional en iOS Safari, que no permite Fullscreen API en iPhone.
- Todo es reversible: si `NativeShell` se desmonta, todos los bloqueos y listeners se limpian y se restauran los estilos previos.
