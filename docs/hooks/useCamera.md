# useCamera

> Cámara del dispositivo: stream en vivo, cambio frontal/trasera, captura de foto a `Blob` y apagado prolijo del stream (sin esto, el LED de la cámara queda encendido).

**Import**
```ts
import { useCamera, type CameraFacing } from "lib-kit-components";
```

## Cuándo usarlo

Es el hook de bajo nivel detrás de `CameraCapture` — usalo directo cuando necesités un layout de cámara completamente propio (no el de `CameraCapture`), o para alimentar `useBarcodeScanner` con un stream en vivo. Si sólo necesitás tomar una foto con el flujo estándar (preview, revisión, confirmar), usá el componente `CameraCapture` en vez de este hook.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás que el usuario elija/tome una foto sin control del stream en vivo (por ejemplo, dejar que el sistema operativo maneje la cámara), usá `useFilePicker` con `capture="environment"` — es más simple y no requiere gestionar el ciclo de vida del stream vos mismo.

## Firma

```ts
function useCamera(options?: {
  facing?: CameraFacing;
  width?: number;
  height?: number;
  auto?: boolean;
}): {
  videoRef: RefObject<HTMLVideoElement | null>;
  start: (which?: CameraFacing) => Promise<boolean>;
  stop: () => void;
  flip: () => Promise<boolean>;
  capture: (quality?: number) => Promise<Blob | null>;
  active: boolean;
  facing: CameraFacing;
  hasMultiple: boolean;
  error: string | null;
  supported: boolean;
}

type CameraFacing = "user" | "environment";
```

## Parámetros

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `facing` | `CameraFacing` | `"environment"` | Cámara inicial (trasera por defecto). |
| `width` | `number` | `1280` | Ancho ideal del stream (`constraints.video.width.ideal`). |
| `height` | `number` | `720` | Alto ideal del stream. |
| `auto` | `boolean` | `false` | Arranca el stream automáticamente al montar (y lo apaga al desmontar). |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `videoRef` | `RefObject<HTMLVideoElement \| null>` | Asignalo a un `<video playsInline muted />`. |
| `start` | `(which?: CameraFacing) => Promise<boolean>` | Arranca (o reinicia) el stream con la cámara indicada. |
| `stop` | `() => void` | Apaga los tracks del stream y limpia `srcObject`. |
| `flip` | `() => Promise<boolean>` | Alterna entre `"environment"` y `"user"`. |
| `capture` | `(quality?: number) => Promise<Blob \| null>` | Captura el frame actual como JPEG (`quality` 0–1, default `0.92`). `null` si el video todavía no tiene dimensiones. |
| `active` | `boolean` | El stream está corriendo. |
| `facing` | `CameraFacing` | Cámara actualmente activa. |
| `hasMultiple` | `boolean` | El dispositivo tiene más de una cámara de video (detectado con `enumerateDevices`). |
| `error` | `string \| null` | Mensaje legible del último error (permiso denegado, sin cámara, etc.). |
| `supported` | `boolean` | El navegador expone `getUserMedia`. |

## Ejemplos

### Preview con arranque automático
```tsx
function LivePreview() {
  const { videoRef, active, error } = useCamera({ auto: true, facing: "user" });
  return (
    <div className="relative aspect-video">
      <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}
```

### Captura manual, con cambio de cámara
```tsx
const { videoRef, start, stop, flip, capture, hasMultiple } = useCamera();

useEffect(() => {
  start();
  return stop;
}, []);

async function onShutter() {
  const blob = await capture();
  if (blob) uploadPhoto(blob);
}
```

## Notas y comportamiento

- **Siempre llamá `stop()` al desmontar o cerrar la pantalla de cámara.** Si no se detienen los tracks del `MediaStream`, el navegador mantiene el LED de la cámara encendido y el hardware ocupado, incluso si el `<video>` ya no está visible.
- Con cámara frontal (`facing: "user"`), `capture()` espeja la imagen horizontalmente antes de dibujarla en el canvas (`ctx.scale(-1, 1)`), para que la foto capturada coincida con lo que el usuario ve en el preview (efecto selfie) en vez de salir invertida.
- `flip()` vuelve a llamar a `start()` con la cámara opuesta — esto **reinicia el stream completo** (nueva llamada a `getUserMedia`), no hay forma de cambiar de cámara sin recrear el stream en la Media Capture API estándar.
- Los mensajes de `error` están traducidos según el `DOMException.name`: `"NotAllowedError"` → permiso denegado, `"NotFoundError"` → sin cámara, cualquier otro → el mensaje crudo del navegador o un genérico.
- `hasMultiple` se recalcula cada vez que `start()` tiene éxito (vía `enumerateDevices()`), no al montar el hook — en algunos navegadores, los labels/conteo completo de dispositivos sólo están disponibles después de haber concedido el permiso al menos una vez.
