# useBarcodeScanner

> Lector de QR y códigos de barras sobre un `<video>` en vivo, usando la BarcodeDetector API nativa del navegador. Diseñado para engancharse al `videoRef` de `useCamera`.

**Import**
```ts
import { useBarcodeScanner, type ScanResult } from "lib-kit-components";
```

## Cuándo usarlo

Para armar tu propia pantalla de escaneo de QR/código de barras sobre un stream de cámara ya en marcha: combiná `useCamera` (para el stream) con `useBarcodeScanner` (para leer los frames) en tu propia UI. Es el hook de bajo nivel — no hay ningún componente `QrScanner` de alto nivel en esta versión de la librería; si necesitás una pantalla lista para usar, armala combinando estos dos hooks siguiendo el patrón de `CameraCapture` (mismo layout de cámara a pantalla completa).

## Cuándo NO usarlo / alternativas

- Si el navegador no soporta `BarcodeDetector` (`supported: false` — hoy sólo Chrome/Edge en Android y desktop; sin soporte en Safari ni Firefox), no hay fallback automático: mostrale al usuario un input de foto (`useFilePicker` con `capture`) o subí una librería JS de decodificación (ej. `zxing`) para esos navegadores.

## Firma

```ts
function useBarcodeScanner(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  options?: {
    formats?: string[];
    interval?: number;
    dedupeMs?: number;
    onScan?: (result: ScanResult) => void;
  }
): {
  start: () => Promise<boolean>;
  stop: () => void;
  scanning: boolean;
  last: ScanResult | null;
  supported: boolean;
  reset: () => void;
}
```

## Parámetros

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `videoRef` | `RefObject<HTMLVideoElement \| null>` | — (requerido) | El mismo `videoRef` que devuelve `useCamera`, con el stream ya activo. |
| `formats` | `string[]` | `["qr_code", "ean_13", "ean_8", "code_128", "code_39", "upc_a", "upc_e", "pdf417"]` | Formatos a buscar. |
| `interval` | `number` | `250` | Milisegundos entre lecturas de frame. |
| `dedupeMs` | `number` | `2500` | Ignora el mismo valor si se repite antes de este tiempo (evita disparar `onScan` en cada frame mientras el código sigue en cuadro). |
| `onScan` | `(result: ScanResult) => void` | `undefined` | Se llama con cada lectura nueva (ya deduplicada). |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `start` | `() => Promise<boolean>` | Arranca el loop de detección. Devuelve `false` si `BarcodeDetector` no existe. |
| `stop` | `() => void` | Detiene el loop (se llama automáticamente al desmontar). |
| `scanning` | `boolean` | El loop está corriendo. |
| `last` | `ScanResult \| null` | Última lectura. |
| `supported` | `boolean` | El navegador expone `window.BarcodeDetector`. |
| `reset` | `() => void` | Limpia `last` (no detiene el escaneo). |

## Tipos exportados

```ts
interface ScanResult {
  value: string;
  format: string;
  box?: { x: number; y: number; width: number; height: number }; // si el navegador la da
}
```

## Ejemplos

### Pantalla de escaneo propia, combinando useCamera + useBarcodeScanner
```tsx
function QrScreen({ onResult }: { onResult: (v: string) => void }) {
  const { videoRef, start: startCamera, stop: stopCamera, active } = useCamera({ facing: "environment" });
  const { start: startScan, stop: stopScan, supported } = useBarcodeScanner(videoRef, {
    onScan: (r) => onResult(r.value),
  });

  useEffect(() => {
    startCamera();
    return () => { stopCamera(); stopScan(); };
  }, []);

  useEffect(() => {
    if (active && supported) startScan();
  }, [active, supported]);

  return (
    <div className="relative aspect-video">
      <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
      {!supported && <p>Tu navegador no soporta lectura de códigos — subí una foto.</p>}
    </div>
  );
}
```

## Notas y comportamiento

- El loop de detección usa `setInterval` (no `requestVideoFrameCallback`), leyendo el frame actual del `<video>` cada `interval` ms — valores muy bajos (< 100ms) pueden saturar dispositivos de gama baja sin ganancia real de UX.
- Sólo procesa el **primer** resultado detectado por frame (`found[0]`) aunque haya varios códigos en cuadro simultáneamente.
- El deduplicado (`dedupeMs`) es por valor exacto: si el mismo código sale de cuadro y vuelve a entrar antes de que pase `dedupeMs`, no vuelve a disparar `onScan`. Bajalo si tu flujo necesita relecturas más frecuentes del mismo código.
- Frames no legibles (video todavía sin datos, `readyState < 2`) se saltean en silencio, y cualquier excepción de `detect()` se ignora dentro de un `try/catch` — el loop nunca se detiene por un frame fallido.
- `stop()` se llama automáticamente al desmontar el componente (vía el `useEffect` de limpieza interno) — igual conviene llamarlo vos también al ocultar la pantalla de escaneo si no desmontás el componente.
