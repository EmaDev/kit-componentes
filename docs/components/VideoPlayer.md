# VideoPlayer

> Reproductor de video completo: play/pausa, scrub arrastrable con buffer y marcadores, volumen, velocidad, fullscreen, atajos de teclado, doble-tap para saltar 10s, y modo `portrait` para feed vertical tipo reels/TikTok.

**Import**
```tsx
import { VideoPlayer, formatTime, type VideoPlayerProps, type PlayerOrientation } from "lib-kit-components";
```

## Cuándo usarlo

Como reproductor principal para contenido de video: streaming clásico (`orientation="landscape"`, controles abajo tipo YouTube) o feed vertical de clips cortos (`orientation="portrait"`, controles compactos + `overlay` libre para acciones tipo like/compartir). Soporta `resumeKey` para retomar la posición entre sesiones y `markers` para marcar capítulos o hitos en la barra.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás mostrar un video sin controles custom (usando los controles nativos del navegador), un `<video controls>` plano es más simple.
- Para una galería de video mezclada con fotos donde el video es sólo un slide más, `Carousel` no reproduce video — tendrías que renderizar `VideoPlayer` dentro de un slide custom.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `src` | `string` | — (requerido) | URL del video. |
| `poster` | `string` | `undefined` | Imagen mostrada antes de reproducir. |
| `title` | `string` | `undefined` | Título superpuesto (arriba en landscape, junto a los controles en portrait). |
| `subtitle` | `string` | `undefined` | Texto secundario debajo del título. |
| `orientation` | `PlayerOrientation` (`"landscape" \| "portrait"`) | `"landscape"` | Layout: 16:9 con controles abajo, o 9:16 tipo reel. |
| `skipSeconds` | `number` | `10` | Segundos que saltan los botones ⏪/⏩ y el doble tap. |
| `autoPlay` | `boolean` | `false` | Reproducir automáticamente al montar. |
| `loop` | `boolean` | `false` | Repetir al terminar. |
| `muted` | `boolean` | `false` | Silenciado inicial. |
| `resumeKey` | `string` | `undefined` | Clave de `localStorage` para guardar/restaurar la posición de reproducción. |
| `markers` | `{ at: number; label?: string }[]` | `[]` | Marcas en la barra de progreso (segundos), con tooltip opcional. |
| `onEnded` | `() => void` | `undefined` | Se llama al terminar el video. |
| `onNext` | `() => void` | `undefined` | Si se pasa, muestra el botón "Siguiente". |
| `onPrev` | `() => void` | `undefined` | Si se pasa, muestra el botón "Anterior". |
| `overlay` | `ReactNode` | `undefined` | Contenido libre superpuesto (acciones del feed vertical, badges, etc.), debajo de los controles en el z-order. |
| `className` | `string` | `""` | Clases adicionales para el contenedor. |

## Funciones exportadas

```ts
function formatTime(seconds: number): string; // 125 -> "2:05", 3725 -> "1:02:05"
```

## Ejemplos

### Reproductor de streaming clásico
```tsx
<VideoPlayer
  src="/videos/keynote.mp4"
  poster="/videos/keynote-poster.jpg"
  title="Keynote 2025"
  subtitle="45:12 · Auditorio principal"
  resumeKey="video-keynote-2025"
  markers={[{ at: 120, label: "Intro" }, { at: 900, label: "Demo en vivo" }]}
/>
```

### Feed vertical tipo reels, con overlay de acciones
```tsx
<VideoPlayer
  src={clip.url}
  orientation="portrait"
  loop
  autoPlay
  muted
  onNext={goToNextClip}
  onPrev={goToPrevClip}
  overlay={
    <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4">
      <LikeButton clipId={clip.id} />
      <CommentButton clipId={clip.id} />
      <ShareButton title={clip.title} url={clip.url} />
    </div>
  }
/>
```

## Requisitos / dependencias

- Sólo depende de las APIs nativas del `<video>` (Fullscreen API, `buffered`, `playbackRate`) — no usa `framer-motion` ni ningún otro hook de la librería.
- Marcado como `"use client"`. No requiere ningún Provider.

## Notas y comportamiento

- **Atajos de teclado** (activos cuando el reproductor o algo dentro de él tiene foco, o cuando el foco está en `document.body`): `Espacio`/`K` play-pausa · `←`/`J` retrocede `skipSeconds` · `→`/`L` avanza `skipSeconds` · `M` mute · `F` fullscreen · `0`–`9` salta al 0%–90% del video.
- **Doble tap** en el tercio izquierdo/derecho de la superficie retrocede/avanza `skipSeconds` (con flash visual del número de segundos); en el tercio central alterna play/pausa. Un solo tap alterna play/pausa tras un delay de 300ms para distinguirlo del doble tap.
- Los controles se **auto-ocultan** a los 2.6s de inactividad mientras el video está en reproducción (`poke()` reinicia el timer en cada movimiento de puntero); se muestran siempre que el video está pausado, mientras se hace scrub, o al mostrar el título en landscape.
- `resumeKey` persiste `currentTime` en `localStorage` cada 2s mientras reproduce, bajo la clave `vp:${resumeKey}`, y lo restaura al montar — cambiar `src` sin cambiar `resumeKey` reutiliza la misma posición guardada (pensado para "seguir viendo" del mismo video, no para listas con `src` distinto por key).
- El botón de velocidad cicla por `[0.5, 0.75, 1, 1.25, 1.5, 2]` en cada click, sin menú desplegable.
- `fullscreen` usa la Fullscreen API nativa (`requestFullscreen`/`exitFullscreen`); si el navegador no la soporta, el intento falla en silencio (`catch` vacío) y el botón simplemente no hace nada visible.
