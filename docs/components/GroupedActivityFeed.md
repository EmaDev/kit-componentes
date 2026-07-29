# GroupedActivityFeed

> Feed de actividad de cuenta (estilo "notificaciones" o "movimientos recientes") agrupado por día, con separadores automáticos "Hoy" / "Ayer" / fecha.

**Import**
```tsx
import { GroupedActivityFeed, type FeedEvent } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para un historial de eventos de una cuenta con muchos eventos posiblemente distribuidos en varios días (inicios de sesión, cambios de configuración, movimientos), donde agrupar por día facilita el escaneo visual. Cada grupo muestra un encabezado sticky con el label del día y una lista de eventos con ícono, título, descripción opcional y hora.

## Cuándo NO usarlo / alternativas

- Si el historial es de un solo objeto en una secuencia lineal de estados (pedido, ticket) donde el orden importa más que la fecha de cada evento, usá [ActivityTimeline](ActivityTimeline.md) en vez de agrupar por día.
- Si necesitás notas/comentarios por evento, usá [TimelineComments](TimelineComments.md).
- Si necesitás un registro de auditoría con diff de campos por actor, usá [AuditLog](AuditLog.md) — `GroupedActivityFeed` no tiene noción de "actor" ni de cambios de campo, solo título/descripción/ícono.
- Para notificaciones con estado leído/no-leído, filtros, marcar todo como leído y descartar, usá `NotificationPanel` en vez de `GroupedActivityFeed`, que es puramente de visualización (sin esas interacciones).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `events` | `FeedEvent[]` | — (requerido) | Eventos a mostrar. Se agrupan por día en el orden en que aparecen en el array (no se reordenan ni se ordenan por fecha). |
| `locale` | `string` | `"es-AR"` | Locale usado por `Intl.DateTimeFormat` para formatear la fecha del grupo (ej. `"27 de julio"`) y la hora de cada evento. |
| `className` | `string` | `""` | Clases adicionales para el contenedor raíz. |

## Tipos exportados

```ts
export interface FeedEvent {
  id: string;
  date: Date;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}
```

## Ejemplos

### Uso básico
```tsx
const events: FeedEvent[] = [
  { id: "1", date: new Date(), title: "Inicio de sesión desde Chrome / Windows" },
  { id: "2", date: new Date(), title: "Contraseña actualizada", description: "Cambiada desde Ajustes > Seguridad" },
  { id: "3", date: new Date(Date.now() - 24 * 60 * 60 * 1000), title: "Nuevo dispositivo vinculado" },
];

<GroupedActivityFeed events={events} />
```

### Con íconos custom por evento
```tsx
<GroupedActivityFeed
  locale="es-MX"
  events={[
    { id: "1", date: new Date(), title: "Pago recibido", icon: <DollarIcon /> },
    { id: "2", date: new Date(), title: "Factura descargada", icon: <FileIcon /> },
  ]}
/>
```

## Requisitos / dependencias

- No depende de `next` ni de `framer-motion`.
- Marcado como `"use client"`, aunque no tiene estado propio (usa `Intl.DateTimeFormat`, que es una API estándar del navegador/runtime, no requiere polyfill en entornos modernos).

## Notas y comportamiento

- El agrupado por día se hace comparando cada `event.date` contra la fecha real "de hoy" (`new Date()` evaluado en cada render), **no** contra la fecha máxima presente en `events`. Si cargás datos históricos (ningún evento es realmente de hoy), ningún grupo va a decir "Hoy" ni "Ayer" aunque los eventos sean recientes dentro de sus propios términos.
- Los eventos se agrupan preservando el **orden de aparición** en el array: el primer evento de cada día nuevo crea el grupo, y los siguientes eventos de ese mismo día (estén donde estén en el array) se agregan a ese grupo. Si tu array no está ordenado cronológicamente, los grupos pueden aparecer en un orden inesperado (no se ordena por fecha antes de agrupar).
- Sin `icon`, cada evento muestra un ícono de reloj genérico (`circle` + manecillas) en un chip `bg-primary/10`.
- El header de cada grupo (`"Hoy"`, `"Ayer"` o la fecha formateada) es `sticky top-0` con `backdrop-blur`, así que queda fijo mientras se hace scroll dentro de un contenedor con overflow — asegurate de que el padre tenga `overflow-y-auto` y una altura acotada si querés aprovechar ese efecto.
