# useGeolocation

> Ubicación del dispositivo (Geolocation API) con mensajes de error legibles, en una sola vez o siguiendo la posición en vivo.

**Import**
```ts
import { useGeolocation, type Coords } from "lib-kit-components";
```

## Cuándo usarlo

Es el hook de bajo nivel detrás de `LocationPicker` — usalo directo cuando necesités las coordenadas crudas sin el campo de dirección (por ejemplo, para centrar un mapa o calcular una distancia), o cuando necesités seguimiento en vivo (`watch: true`) para algo como un tracking de entrega, que `LocationPicker` no cubre.

## Cuándo NO usarlo / alternativas

- Si tu flujo necesita también un campo de dirección con sugerencias y geocoding inverso, usá el componente `LocationPicker`, que ya envuelve este hook.

## Firma

```ts
function useGeolocation(options?: PositionOptions & {
  watch?: boolean;
  auto?: boolean;
}): {
  coords: Coords | null;
  error: string | null;
  loading: boolean;
  supported: boolean;
  request: () => void;
  stop: () => void;
}

interface Coords {
  lat: number;
  lng: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
  at: number;
}
```

## Parámetros

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `watch` | `boolean` | `false` | Seguir la posición en vivo (`watchPosition`) en vez de pedirla una sola vez. |
| `auto` | `boolean` | `false` | Pedir la posición apenas se monta el hook. iOS exige que el primer pedido ocurra dentro de un gesto del usuario — preferí dejarlo en `false` y llamar a `request()` desde un click. |
| `enableHighAccuracy` | `boolean` | `true` | Opción estándar de `PositionOptions`. |
| `timeout` | `number` | `10000` | Opción estándar de `PositionOptions`. |
| `maximumAge` | `number` | `30000` | Opción estándar de `PositionOptions`. |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `coords` | `Coords \| null` | Última posición conocida. |
| `error` | `string \| null` | Mensaje legible (permiso denegado, posición no disponible, timeout). |
| `loading` | `boolean` | Hay un pedido en curso (o el `watch` está activo). |
| `supported` | `boolean` | El navegador expone `navigator.geolocation`. |
| `request` | `() => void` | Dispara el pedido (una vez, o arranca el `watch` según la opción). |
| `stop` | `() => void` | Detiene el `watchPosition` activo (no hace nada si no había `watch`). |

## Ejemplos

### Pedido único disparado por un botón
```tsx
function CurrentLocationButton() {
  const { coords, loading, error, request } = useGeolocation();
  return (
    <>
      <button onClick={request} disabled={loading}>
        {loading ? "Buscando…" : "Usar mi ubicación"}
      </button>
      {coords && <p>{coords.lat}, {coords.lng} (±{Math.round(coords.accuracy)}m)</p>}
      {error && <p className="text-danger">{error}</p>}
    </>
  );
}
```

### Seguimiento en vivo (tracking)
```tsx
function LiveTracker() {
  const { coords, request, stop } = useGeolocation({ watch: true });

  useEffect(() => {
    request();
    return stop;
  }, []);

  return coords && <Marker lat={coords.lat} lng={coords.lng} heading={coords.heading} />;
}
```

## Notas y comportamiento

- **iOS exige HTTPS y que el primer pedido de ubicación ocurra dentro de un gesto directo del usuario** (click/tap) — por eso `auto` es `false` por defecto; usarlo en `true` puede simplemente no funcionar en Safari/iOS.
- Con `watch: true`, `request()` arranca `navigator.geolocation.watchPosition` y guarda el `watchId` para poder limpiarlo — **siempre llamá `stop()`** al desmontar (o hacelo en el `return` de tu `useEffect`, como en el ejemplo) para no dejar el GPS activo de fondo.
- Los mensajes de `error` están traducidos según `GeolocationPositionError.code`: `PERMISSION_DENIED`, `POSITION_UNAVAILABLE`, y timeout (cualquier otro código).
- `coords.heading` y `coords.speed` pueden ser `null` aunque haya una posición válida — dependen de que el dispositivo esté en movimiento y de que el hardware los reporte (típicamente sólo disponibles con GPS real, no con geolocalización por IP/Wi-Fi).
