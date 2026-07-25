# PullToRefresh

> Gesto nativo de "arrastrar para refrescar": sólo arranca con el scroll arriba del todo, aplica resistencia progresiva al arrastre, dispara al soltar pasado el umbral y confirma con un flash. Bloquea el overscroll del navegador mientras se arrastra.

**Import**
```tsx
import { PullToRefresh } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para envolver una lista o feed scrolleable (mobile-first) donde el usuario espera poder "tirar hacia abajo" para recargar datos, como en apps nativas (mail, redes sociales, feeds). El propio componente gestiona el contenedor con scroll — pasale el contenido como `children`.

## Cuándo NO usarlo / alternativas

- Si el refresco se dispara con un botón explícito (no un gesto), un botón "Actualizar" simple es más descubrible en desktop — `PullToRefresh` es un patrón táctil.
- Para cargar más contenido al llegar al final de la lista (no al principio), usá `InfiniteScroll`, no `PullToRefresh`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `children` | `ReactNode` | — (requerido) | Contenido scrolleable dentro del contenedor con el gesto. |
| `onRefresh` | `() => Promise<void> \| void` | — (requerido) | Se llama al soltar pasado el umbral. El indicador gira mientras la promesa esté pendiente. |
| `threshold` | `number` | `72` | Píxeles de arrastre necesarios para que el refresco dispare al soltar. |
| `maxStretch` | `number` | `1.6` | Múltiplo de `threshold` hasta el cual se puede seguir estirando (con resistencia). |
| `disabled` | `boolean` | `false` | Desactiva el gesto (ej. mientras hay un modal abierto encima). |
| `doneLabel` | `string` | `"Actualizado"` | Texto del flash de confirmación al terminar. |
| `height` | `number \| string` | `undefined` | Alto del contenedor; si se omite, ocupa el espacio disponible del padre. |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

## Ejemplos

### Uso básico
```tsx
<PullToRefresh onRefresh={() => mutate()} threshold={72} height="100%">
  <Feed items={items} />
</PullToRefresh>
```

### Deshabilitado condicionalmente
```tsx
<PullToRefresh onRefresh={reload} disabled={isModalOpen} height={480}>
  <ListaDePedidos pedidos={pedidos} />
</PullToRefresh>
```

## Requisitos / dependencias

- No usa `framer-motion`; las transiciones son CSS (`transform` + `transition`) y el `spin` del ícono es una animación Tailwind (`animate-spin`).
- Marcado como `"use client"`.
- Usa el keyframe `ptrFlash` (ya incluido en `app/globals.css` del paquete) para el flash de confirmación — si copiás los estilos a mano en vez de importar el CSS del paquete, agregalo vos.
- El contenedor scrolleable interno usa `overscroll-behavior-y: contain` para no pelearse con el gesto nativo del navegador; no hace falta configuración adicional.

## Notas y comportamiento

- El gesto sólo arranca si `scroller.scrollTop === 0` en el momento del `pointerdown` — si la lista ya está scrolleada, arrastrar hacia abajo no dispara el refresco (se comporta como scroll normal).
- La resistencia es progresiva y no lineal: por debajo del `threshold` el arrastre se atenúa a 68% del movimiento del dedo/mouse, y por encima a 42%, hasta el tope de `threshold * maxStretch`.
- Mientras se arrastra (`pulling`), `touchAction` pasa a `"none"` para que el navegador no interprete el gesto como scroll nativo; al soltar vuelve a `"pan-y"`.
- El flash de confirmación se muestra 1.1s después de que `onRefresh` resuelve (haya tenido éxito o no — está en un `finally`), y luego el componente vuelve a `idle` automáticamente.
- Usa Pointer Events (`onPointerDown/Move/Up/Cancel`), por lo que funciona con mouse y touch sin lógica separada.
