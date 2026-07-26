# LocationPicker

> Campo para elegir una ubicación: botón "usar mi ubicación actual" (con precisión y estado de carga) + input de dirección con sugerencias mientras se escribe. No dibuja mapa — el mapa lo poné vos donde te convenga.

**Import**
```tsx
import { LocationPicker, type Coords } from "lib-kit-components";
```

## Cuándo usarlo

Para capturar una dirección de entrega, un punto de encuentro, o cualquier ubicación que combine "usar el GPS del dispositivo" con "escribir/autocompletar una dirección". Es un campo de formulario, no un mapa interactivo: si necesitás que el usuario arrastre un pin sobre un mapa, montá el tuyo (Google Maps, Mapbox, Leaflet) y usá `LocationPicker` sólo para la parte de texto + geolocalización, sincronizando `value`/`onChange` con tu mapa.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás las coordenadas crudas del dispositivo sin ningún campo de texto (por ejemplo, para centrar un mapa), usá el hook `useGeolocation` directamente.
- Si tu flujo no requiere dirección escrita (sólo confirmar "estoy acá"), un botón simple con `useGeolocation` es más liviano que este componente.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `value` | `{ address?: string; coords?: Coords \| null }` | `undefined` | Valor controlado. Si se omite, el componente maneja su propio estado de dirección. |
| `onChange` | `(value: { address?: string; coords?: Coords \| null }) => void` | `undefined` | Se llama al escribir, elegir una sugerencia o resolver la ubicación actual. |
| `label` | `string` | `"Ubicación"` | Label sobre el campo. |
| `placeholder` | `string` | `"Calle y número, barrio…"` | Placeholder del input de dirección. |
| `reverseGeocode` | `(coords: Coords) => Promise<string>` | `undefined` | Traduce coordenadas a texto de dirección. Sin esto, se muestra `lat, lng` crudo. |
| `onSearch` | `(q: string) => Promise<{ id: string; label: string; coords?: Coords }[]>` | `undefined` | Sugerencias mientras se escribe (mínimo 3 caracteres). Sin esto, no hay autocompletado. |
| `className` | `string` | `""` | Clases adicionales para el contenedor. |

## Tipos exportados

`Coords` se re-exporta desde `useGeolocation`:

```ts
interface Coords {
  lat: number;
  lng: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
  at: number;
}
```

## Ejemplos

### Uso básico, no controlado
```tsx
<LocationPicker
  label="Dirección de entrega"
  onChange={({ address, coords }) => setForm((f) => ({ ...f, address, coords }))}
/>
```

### Con geocoding inverso y sugerencias de tu backend
```tsx
<LocationPicker
  reverseGeocode={(coords) => api.reverseGeocode(coords.lat, coords.lng)}
  onSearch={(q) => api.searchAddresses(q)}
  onChange={setLocation}
/>
```

### Controlado, sincronizado con un mapa propio
```tsx
const [location, setLocation] = useState<{ address?: string; coords?: Coords | null }>({});

<LocationPicker value={location} onChange={setLocation} />
<MyMap center={location.coords} onPinDrag={(coords) => setLocation((l) => ({ ...l, coords }))} />
```

## Requisitos / dependencias

- Usa el hook `useGeolocation` para el botón "usar mi ubicación actual".
- Usa `framer-motion` para la entrada del panel de sugerencias.
- Marcado como `"use client"`. Requiere contexto seguro (HTTPS o `localhost`) — iOS además exige que el pedido de ubicación ocurra dentro de un gesto del usuario (el click del botón cumple esto).

## Notas y comportamiento

- Sin `onSearch`, escribir en el input **no** dispara ninguna búsqueda — sólo actualiza `address` vía `onChange`. El listado de sugerencias sólo aparece a partir de 3 caracteres y con `onSearch` provisto.
- `useCurrent` llama a `request()` del hook de geolocalización, pero como `coords` recién se actualiza en el próximo render, el primer click puede no alcanzar a resolver la dirección todavía si `coords` era `null` — es una limitación conocida del cierre síncrono: en la práctica el estado de `loading` cubre visualmente esa espera y un segundo click (o que el usuario vuelva a intentar) resuelve con las coordenadas ya disponibles.
- Sin `reverseGeocode`, la dirección resuelta automáticamente es literalmente las coordenadas formateadas (`"‑34.60000, ‑58.38000"`) — para mostrar una calle real, siempre pasá `reverseGeocode`.
- El componente es tanto controlado como no controlado: si pasás `value`, las coordenadas mostradas (`current`) priorizan `value.coords` sobre las del hook interno; si no pasás `value`, usa su propio estado.
