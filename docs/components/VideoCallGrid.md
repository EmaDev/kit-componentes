# VideoCallGrid

> Grid de participantes de una videollamada (tipo Zoom/Meet), con indicador de quién está hablando, estado de mute, y una barra de controles inferior para mic/cámara/salir. Es una capa de UI — no incluye lógica de WebRTC ni streams de video reales.

**Import**
```tsx
import { VideoCallGrid, type CallParticipant } from "lib-kit-components";
```

## Cuándo usarlo

Para armar la pantalla de una videollamada: mosaico de participantes que auto-ajusta columnas según la cantidad, resaltando con un anillo al que está hablando (`speaking`), mostrando un chip con nombre + ícono de mute cuando corresponde, y un avatar con iniciales cuando la cámara del participante está apagada. Incluye la barra de controles típica al pie (silenciar, cámara, colgar) ya conectada a callbacks. Es puramente presentacional: no conecta con ninguna librería de video real (WebRTC, LiveKit, Twilio, etc.) — el consumidor debe renderizar el stream de video real en el lugar donde el componente hoy dibuja un placeholder con gradiente.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás reproducir un único video (no una grilla de llamada con participantes), usá [VideoPlayer](VideoPlayer.md) — tiene controles de reproducción, scrub, fullscreen, etc., que `VideoCallGrid` no tiene.
- Si necesitás integrar streams reales de cámara/micrófono (`MediaStream`, WebRTC), `VideoCallGrid` no lo resuelve por sí solo: hay que renderizar tus propios elementos `<video>` en el lugar del placeholder (hoy el componente sólo dibuja un degradé decorativo cuando `videoOn` es `true`, no un `<video>`).
- Si necesitás mostrar el estado de conexión/sincronización general de la app (no de una llamada puntual), usá [SyncStatus](SyncStatus.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `participants` | `CallParticipant[]` | — (requerido) | Lista de participantes a mostrar en el grid. |
| `onToggleMute` | `() => void` | `undefined` | Se llama al presionar el botón de mic en la barra de controles. |
| `onToggleVideo` | `() => void` | `undefined` | Se llama al presionar el botón de cámara en la barra de controles. |
| `onLeave` | `() => void` | `undefined` | Se llama al presionar el botón rojo de colgar. |
| `muted` | `boolean` | `undefined` | Estado visual del botón de mic (aparece blanco/activo cuando `true`) — sólo pinta el ícono/estilo del botón, no silencia nada por sí mismo. |
| `videoOn` | `boolean` | `undefined` | Estado visual del botón de cámara, mismo criterio que `muted` (el botón se ve "activo" cuando `videoOn` es `false`). |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

## Tipos exportados

```ts
interface CallParticipant {
  id: string;
  name: string;
  avatar?: string;
  speaking?: boolean;
  muted?: boolean;
  videoOn?: boolean;
  you?: boolean;
}
```

## Ejemplos

### Llamada de 4 personas
```tsx
const participants: CallParticipant[] = [
  { id: "1", name: "Ana Torres", speaking: true, videoOn: true },
  { id: "2", name: "Bruno Díaz", muted: true, videoOn: false },
  { id: "3", name: "Carla Ruiz", videoOn: true },
  { id: "4", name: "Vos", you: true, videoOn: false },
];

<VideoCallGrid
  participants={participants}
  muted={false}
  videoOn={false}
  onToggleMute={() => setMuted((m) => !m)}
  onToggleVideo={() => setVideoOn((v) => !v)}
  onLeave={() => colgar()}
  className="h-[480px]"
/>
```

### Llamada 1:1
```tsx
<VideoCallGrid
  participants={[
    { id: "a", name: "Vos", you: true, videoOn: true },
    { id: "b", name: "Diego", videoOn: true, speaking: true },
  ]}
  className="h-screen"
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- No usa `framer-motion` (a diferencia de la mayoría de los componentes visuales de la librería) — no hay animaciones que respeten o ignoren `prefers-reduced-motion`; los únicos cambios visuales son transiciones CSS de color (`transition-colors`) en los botones.
- No depende de Next.js.
- Necesita una altura explícita en el contenedor vía `className` (ej. `h-screen` o `h-[480px]`) — el componente usa `h-full` internamente y no impone una altura propia.

## Notas y comportamiento

- **No renderiza video real**: cuando `participant.videoOn` es `true`, dibuja un `<div>` con gradiente decorativo (`from-[#2a2e38] to-[#14161b]`), no un elemento `<video>` ni ningún stream. Si necesitás mostrar cámara real, hay que reemplazar/extender ese bloque.
- **`avatar` no se usa**: aunque `CallParticipant` acepta un campo `avatar` (URL de foto), el componente nunca lo renderiza — siempre muestra un círculo con las iniciales del `name` sobre gradiente `accent→primary`, tenga o no `avatar`. Es un campo del tipo sin efecto visual actual.
- Las iniciales se calculan tomando la primera letra de hasta las dos primeras palabras de `name` (`name.trim().split(/\s+/).map(w => w[0]).slice(0, 2)`), el mismo criterio que usa `ProfileCard`.
- Las columnas del grid se derivan de la cantidad de participantes: 1 → `grid-cols-1`; 2, 3 y 4 → `grid-cols-2`; 5 o más → `grid-cols-3` fijo (no hay más breakpoints para llamadas grandes).
- `muted`/`videoOn` (las props del componente) sólo pintan el estado del **botón de control inferior** — no están atadas automáticamente a ningún participante de `participants`, ni siquiera al que tenga `you: true`. Sincronizar el participante local con estas props es responsabilidad del consumidor.
- El fondo está hardcodeado a tonos oscuros fijos (`#111318`, `#1c1f26`) en vez de usar los tokens de tema (`bg-surface`, etc.) — no se adapta a light/dark mode de la librería, siempre se ve oscuro. `speaking` sí usa un token de tema (`ring-primary`) para el anillo del participante activo.
- Los íconos de mic/cámara "tachados" (línea diagonal) se dibujan condicionalmente dentro del mismo `<svg>` cuando corresponde `p.muted`/`!videoOn` — no son íconos distintos superpuestos.
