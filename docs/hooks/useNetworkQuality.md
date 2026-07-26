# useNetworkQuality

> Calidad de conexión estimada (`"fast" | "medium" | "slow" | "offline"`) para carga adaptativa: bajar la resolución de imágenes, evitar autoplay de video y desactivar el prefetch en redes malas o con "ahorro de datos" activado.

**Import**
```ts
import { useNetworkQuality, type Quality } from "lib-kit-components";
```

## Cuándo usarlo

Para decidir en tiempo real cuánto "peso" cargar: qué tamaño de imagen pedir (`imageWidth`), si autoreproducir un `VideoPlayer`, si hacer prefetch de rutas, o si mostrar un aviso de "estás con poca señal". Combina la Network Information API (`navigator.connection`, sólo Chromium) con el estado real online/offline, así que `quality` sigue siendo útil (cae a `"offline"`) incluso en navegadores sin esa API.

## Cuándo NO usarlo / alternativas

- Para saber sólo si hay conexión o no (sin matices de velocidad), usá `useOnlineStatus`, que es más liviano y funciona en todos los navegadores.

## Firma

```ts
function useNetworkQuality(): {
  quality: Quality;
  effectiveType: string | null;
  downlink: number | null;
  rtt: number | null;
  saveData: boolean;
  allowHeavy: boolean;
  imageWidth: 480 | 800 | 1600;
}

type Quality = "fast" | "medium" | "slow" | "offline";
```

No recibe parámetros.

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `quality` | `Quality` | Clasificación resumen — ver la tabla de abajo. |
| `effectiveType` | `string \| null` | `"4g"`/`"3g"`/`"2g"`/`"slow-2g"` reportado por el navegador, o `null` sin soporte. |
| `downlink` | `number \| null` | Estimación de ancho de banda en Mbps. |
| `rtt` | `number \| null` | Round-trip time estimado, en ms. |
| `saveData` | `boolean` | El usuario activó "ahorro de datos" en el sistema operativo/navegador. |
| `allowHeavy` | `boolean` | Atajo: `true` sólo si `quality === "fast"` — usalo para gatear autoplay, prefetch, imágenes pesadas. |
| `imageWidth` | `480 \| 800 \| 1600` | Ancho sugerido para pedir imágenes, según la calidad actual. |

### Cómo se calcula `quality`

| Condición | `quality` |
|---|---|
| Sin conexión (`navigator.onLine === false`) | `"offline"` |
| `saveData` activo, o `effectiveType` es `"2g"`/`"slow-2g"` | `"slow"` |
| `effectiveType === "3g"` | `"medium"` |
| Cualquier otro caso (incluido sin soporte de la API) | `"fast"` |

## Ejemplos

### Imagen adaptativa
```tsx
function AdaptiveImage({ src, alt }: { src: (w: number) => string; alt: string }) {
  const { imageWidth } = useNetworkQuality();
  return <img src={src(imageWidth)} alt={alt} />;
}
```

### Gatear autoplay y prefetch
```tsx
const { allowHeavy, quality } = useNetworkQuality();

<VideoPlayer src={clip.url} autoPlay={allowHeavy} />
{quality === "slow" && <p className="text-xs text-muted">Conexión lenta — mostrando calidad reducida.</p>}
```

## Notas y comportamiento

- **Sin soporte de `navigator.connection`** (Safari, Firefox — sólo Chromium la expone), `effectiveType`/`downlink`/`rtt`/`saveData` quedan en sus valores neutros (`null`/`false`) y `quality` cae directo a `"fast"` (salvo que esté offline) — el hook nunca reporta `"slow"`/`"medium"` en esos navegadores, sólo `"fast"` u `"offline"`.
- El estado de `online` se sincroniza con los eventos `online`/`offline` del navegador además del valor inicial de `navigator.onLine` — igual que `useOnlineStatus`, pero acá sólo se usa para decidir `"offline"`, no se expone directamente.
- `imageWidth` es una sugerencia de ancho, no una URL — armá vos la URL final (con tu CDN de imágenes, `next/image`, etc.) usando ese valor como parámetro de ancho.
