# TripRouteMap

> Resumen de la ruta de un viaje multi-destino: tarjetas de destino encadenadas con fechas y noches en cada una, conectadas por una línea punteada — sin mapa geográfico real.

**Import**
```tsx
import { TripRouteMap } from "lib-kit-components";
import type { RouteStop } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para dar el panorama general de un viaje que recorre varios destinos: en qué ciudad/país se está, entre qué fechas, y cuántas noches en cada parada, encadenadas visualmente en el orden del recorrido. Es la vista de "alto nivel" del viaje — apropiado como cabecera de una pantalla de itinerario, antes de bajar al detalle día a día.

## Cuándo NO usarlo / alternativas

- No es un mapa geográfico interactivo — no dibuja rutas sobre un mapa real ni usa coordenadas. Si necesitás eso, hay que integrar una librería de mapas aparte; `TripRouteMap` sólo resume el recorrido como una cadena de tarjetas.
- Si necesitás el detalle hora a hora de actividades dentro de un destino (vuelos, comidas, tours), usá [ItineraryTimeline](ItineraryTimeline.md) — `TripRouteMap` no baja a ese nivel de granularidad.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `stops` | `RouteStop[]` | — (requerido) | Destinos del recorrido, en orden. |
| `value` | `string` | `undefined` | `id` del stop activo/resaltado. Componente controlado: sin `value` ningún stop queda resaltado (no hay estado interno propio). |
| `onSelect` | `(id: string) => void` | `undefined` | Se llama al hacer click en un stop, con su `id`. |
| `locale` | `string` | `"es-AR"` | Locale usado para formatear las fechas de inicio/fin de cada stop vía `Intl.DateTimeFormat`. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Tipos exportados

```ts
interface RouteStop {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  country?: string;
}
```

## Ejemplos

### Uso básico
```tsx
<TripRouteMap
  stops={[
    { id: "lis", name: "Lisboa", country: "Portugal", startDate: new Date("2026-08-10"), endDate: new Date("2026-08-14") },
    { id: "por", name: "Oporto", country: "Portugal", startDate: new Date("2026-08-14"), endDate: new Date("2026-08-17") },
    { id: "mad", name: "Madrid", country: "España", startDate: new Date("2026-08-17"), endDate: new Date("2026-08-20") },
  ]}
/>
```

### Controlado, sincronizado con el itinerario del día
```tsx
const [activeStop, setActiveStop] = useState("lis");

<TripRouteMap stops={stops} value={activeStop} onSelect={setActiveStop} />
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Usa `Intl.DateTimeFormat` del navegador — el `locale` debe ser un locale BCP 47 válido soportado por el runtime.
- No depende de Next.js ni de `framer-motion`.

## Notas y comportamiento

- A diferencia de `ItineraryTimeline`, `TripRouteMap` no tiene estado interno de selección: el resaltado del stop activo depende exclusivamente de la prop `value`. Si no la pasás, `onSelect` sigue disparándose en cada click pero ningún stop se ve activo.
- Las noches por stop se calculan como `round((endDate - startDate) / día en ms)` y se muestran en singular ("1 noche") o plural ("N noches") según corresponda; el cálculo usa `Math.max(0, …)` así que fechas invertidas no muestran noches negativas.
- La lista de stops se renderiza en una fila horizontal con scroll (`overflow-x-auto`) y ancho mínimo por tarjeta (`w-36`); en pantallas angostas el usuario desliza para ver el resto del recorrido.
- Entre cada par de stops consecutivos se dibuja una línea punteada corta (SVG) — no aparece después del último stop.
