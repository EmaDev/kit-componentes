# ImageZoom / ZoomableImage

> Visor de imagen a pantalla completa con pan y zoom que bloquea el resto de la página mientras está abierto, más `ZoomableImage`, una miniatura lista para usar que lo abre.

**Import**
```tsx
import { ImageZoom, ZoomableImage } from "lib-kit-components";
```

## Cuándo usarlo

`ZoomableImage` es la forma más simple de dar zoom a **una** imagen suelta (plano, diagrama, foto de producto): renderiza la miniatura y maneja el estado de apertura por vos. `ImageZoom` es la pieza controlada de bajo nivel — úsala directamente cuando necesitás manejar el estado `open` desde afuera, cuando la imagen a mostrar cambia dinámicamente (ej. desde un grid o un `Carousel`), o cuando necesitás navegación prev/next dentro del visor (galería). Mientras está abierto bloquea scroll del documento, gestos del navegador (pinch-zoom, ctrl+scroll, pull-to-refresh, long-press) y clicks fuera del visor.

## Cuándo NO usarlo / alternativas

- Si necesitás navegar una **secuencia** de imágenes con dots/flechas/miniaturas fuera del visor (no sólo abrir una y hacer zoom), usá [Carousel](Carousel.md) con `zoomable` — internamente usa `ImageZoom` y te ahorra manejar `onPrev`/`onNext` a mano.
- Si sólo necesitás mostrar una imagen sin interacción de zoom, usá una `<img>` normal o `CardMedia` de [Card](Card.md).
- Para un diálogo genérico con contenido arbitrario (no sólo una imagen), usá [Modal](Modal.md).

## Props

### ImageZoom

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `src` | `string` | — (requerido) | URL de la imagen. |
| `alt` | `string` | `""` | Texto alternativo; también se usa como `aria-label` del diálogo si no hay `caption`. |
| `open` | `boolean` | — (requerido) | Controla si el visor está visible. |
| `onClose` | `() => void` | — (requerido) | Se llama al cerrar (botón ×, tecla `Escape`). |
| `maxScale` | `number` | `6` | Zoom máximo permitido. |
| `doubleTapScale` | `number` | `2.5` | Escala a la que salta el doble click/doble tap (si ya está en esa escala o más, vuelve a 1×). |
| `caption` | `string` | `undefined` | Pie de foto mostrado abajo del visor. |
| `onPrev` | `() => void` | `undefined` | Si se pasa, muestra flecha "anterior" y habilita `←`. |
| `onNext` | `() => void` | `undefined` | Si se pasa, muestra flecha "siguiente" y habilita `→`. |

### ZoomableImage

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `src` | `string` | — (requerido) | URL de la imagen. |
| `alt` | `string` | `""` | Texto alternativo. |
| `caption` | `string` | `undefined` | Pie de foto dentro del visor al abrir. |
| `aspect` | `number` | `16/9` | Relación de aspecto de la miniatura. |
| `className` | `string` | `""` | Clases adicionales en la miniatura. |

## Ejemplos

### Miniatura simple (caso más común)
```tsx
<ZoomableImage src="/plano.png" caption="A-01 · 1:50" />
```

### Visor controlado desde afuera (ej. grid de fotos)
```tsx
const [open, setOpen] = useState(false);

<img src={foto.src} onClick={() => setOpen(true)} className="cursor-zoom-in rounded-xl" />
<ImageZoom open={open} onClose={() => setOpen(false)} src={foto.src} alt={foto.alt} maxScale={8} />
```

### Con navegación de galería
```tsx
const [index, setIndex] = useState<number | null>(null);

<ImageZoom
  open={index != null}
  src={index != null ? fotos[index].src : ""}
  onClose={() => setIndex(null)}
  onPrev={() => setIndex((i) => (i == null ? i : (i - 1 + fotos.length) % fotos.length))}
  onNext={() => setIndex((i) => (i == null ? i : (i + 1) % fotos.length))}
/>
```

## Requisitos / dependencias

- Usa `framer-motion` sólo para el fade de entrada/salida del visor (`AnimatePresence`, opacidad). El pan y el zoom de la imagen son 100% manuales (`style.transform` + CSS transition) — a propósito no se anima `scale`/`x`/`y` vía Framer Motion en la imagen, porque eso le haría "robar" la propiedad `transform` y pisaría el transform manual en cada render.
- Marcado como `"use client"`.
- No depende de Next.js.

## Notas y comportamiento

- **Bloqueo global mientras está abierto**: fija `document.body.style.overflow/touchAction/overscrollBehavior` y agrega listeners a nivel `window` para `gesturestart`, `gesturechange` y `contextmenu` que hacen `preventDefault()` — esto impide el zoom nativo del navegador y el pull-to-refresh mientras el visor está montado con `open=true`. Se restaura todo al cerrar/desmontar. Ese efecto depende **sólo** de `open`: si dependiera del estado de zoom se re-ejecutaría en cada gesto y devolvería el scroll del body a mitad de camino.
- La rueda se escucha con un listener **nativo no pasivo** sobre el contenedor del visor, no con el `onWheel` de React: React registra `wheel` como pasivo, así que ahí `preventDefault()` se ignora y el navegador seguía haciendo su propio zoom de página. `ctrl+wheel` (pinch de trackpad) usa un factor exponencial proporcional al delta para que sea suave.
- Gestos: arrastrar hace pan (sólo si `scale > 1`), rueda o pinch hacen zoom hacia el puntero/centro del gesto, doble click/doble tap alternan entre `doubleTapScale` y 1×, `+`/`-`/`0` son atajos de teclado, `Esc` cierra. El doble **tap** sólo se detecta con `pointerType === "touch"`; con mouse lo resuelve `onDoubleClick`, para que un doble click no dispare el toggle dos veces.
- El pan está clamped (`clampPan()`) para que la imagen nunca se despegue de los bordes de la pantalla — no se puede arrastrar la imagen "fuera de vista". El límite se calcula sobre el **rectángulo realmente dibujado** (`naturalWidth/Height` proyectados con `object-contain`), no sobre la caja del `<img>`, así que en imágenes con letterbox no se puede arrastrar hacia la franja vacía.
- El transform vive en un `useRef` espejo (`viewRef`) además del estado: los gestos leen el valor actual de forma síncrona en vez del que quedó capturado en el render, que es lo que hacía que un pinch o una rueda rápida saltara o se quedara atrás.
- Los atajos de flecha se registran en **fase de captura** y hacen `stopPropagation()`, para que una galería que ya escucha `←`/`→` a nivel `window` (ej. [ImageCounter](ImageCounter.md)) no avance dos imágenes por pulsación mientras el visor está abierto.
- `ZoomableImage` reinicia el zoom cada vez que cambia `src` y cada vez que se abre (`useEffect` en `ImageZoom` que llama `reset()`), así que reabrir con una imagen distinta nunca arranca zoomeado.
- El pinch de dos dedos usa la API de Pointer Events (`pointers` con un `Map`), no gestos táctiles nativos del navegador — funciona igual en mouse+rueda que en touch. Al levantar un dedo de un pinch de dos, el pan se re-ancla al dedo que queda para que la imagen no salte.
- Los controles de zoom (−, %, +, reset, cerrar) están en `position: fixed` arriba a la derecha; no se ocultan automáticamente, permanecen visibles todo el tiempo que el visor está abierto.
