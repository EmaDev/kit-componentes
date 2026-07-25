# Tooltip

> Globo de texto breve que aparece al hacer hover/focus sobre un trigger, con posición que se auto-invierte si no entra en el viewport.

**Import**
```tsx
import { Tooltip } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para aclarar el significado de un elemento sin label visible (un ícono, un botón de "⋮", un campo abreviado) con **texto corto** que aparece pasivamente al pasar el mouse o al enfocar con teclado. No requiere click ni interacción del usuario — es puramente informativo.

## Cuándo NO usarlo / alternativas

- Si el contenido flotante necesita **interacción** (botones, formularios, links clickeables) o se abre con **click** en vez de hover, usá `Popover`. Un `Tooltip` no debe contener elementos interactivos: se cierra apenas el mouse sale del trigger.
- Si el contenido es una lista de **acciones** (editar/eliminar/duplicar), usá `Dropdown`.
- Si necesitás guiar al usuario paso a paso por varias funcionalidades de la UI (onboarding), usá `CoachMark` en vez de tooltips sueltos.
- Para feedback transitorio no anclado a un elemento ("Guardado", "Error al subir"), usá `Toast`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `content` | `ReactNode` | — (requerido) | Contenido del globo. Si es falsy (`null`, `undefined`, `""`), el tooltip no se activa. |
| `children` | `ReactNode` | — (requerido) | Elemento trigger; se envuelve en un `<span>` que escucha hover y focus. |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | Lado preferido respecto al trigger. Se invierte automáticamente al lado opuesto si no entra en el viewport. |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alineación sobre el eje perpendicular al lado (horizontal si `side` es `top`/`bottom`, vertical si es `left`/`right`). |
| `delay` | `number` | `300` | Milisegundos de espera antes de mostrarse tras el hover/focus. |
| `disabled` | `boolean` | `false` | Si es `true`, el tooltip nunca se muestra. |
| `className` | `string` | `""` | Clases para el `<span>` envolvente (`relative inline-flex`). |
| `contentClassName` | `string` | `""` | Clases adicionales para el globo. |

## Tipos exportados

```ts
export type TooltipSide = "top" | "bottom" | "left" | "right";
export type TooltipAlign = "start" | "center" | "end";
```

## Ejemplos

### Uso básico (ícono sin label)
```tsx
<Tooltip content="Eliminar producto">
  <Button variant="ghost" size="icon"><TrashIcon /></Button>
</Tooltip>
```

### Lado y alineación explícitos
```tsx
<Tooltip content="Sincronizado hace 2 minutos" side="right" align="start">
  <SyncIcon className="w-4 h-4 text-muted" />
</Tooltip>
```

### Deshabilitado condicionalmente
```tsx
<Tooltip content="Necesitás plan Pro para exportar" disabled={hasProPlan}>
  <Button disabled={!hasProPlan} onClick={exportCsv}>Exportar CSV</Button>
</Tooltip>
```

## Requisitos / dependencias

- Usa `framer-motion` internamente para la animación de entrada/salida del globo.
- Marcado como `"use client"`.
- No requiere ningún provider — cada `Tooltip` es autocontenido.

## Notas y comportamiento

- El trigger se activa por `onMouseEnter`/`onMouseLeave` **y** `onFocus`/`onBlur` (delegados sobre el `<span>` envolvente, por lo que un elemento focuseable dentro de `children` dispara el tooltip al recibir foco por teclado).
- **Gotcha de accesibilidad**: en dispositivos táctiles no hay evento de hover real, así que el tooltip sólo se muestra si el trigger recibe foco (por ejemplo al tocar un `<button>`); no hay manejo especial de `touchstart`.
- La posición se recalcula en cada apertura comparando el `getBoundingClientRect()` del globo contra el viewport: si el lado preferido (`side`) haría que el globo se salga de la pantalla, se usa el lado opuesto (`top`↔`bottom`, `left`↔`right`). No hay clamping en el eje perpendicular (`align`) — un trigger muy cerca del borde lateral puede hacer que el globo se recorte horizontalmente.
- El globo usa colores invertidos respecto al tema (`bg-foreground text-surface`), por lo que se mantiene legible tanto en modo claro como oscuro sin configuración adicional.
- `z-[95]`: por encima de `Modal` (`z-[90]`) para poder mostrarse dentro de un diálogo abierto, pero por debajo de `Toast` (`z-[100]`).
- El delay (`delay`) sólo aplica a la aparición; el cierre (`onMouseLeave`/`onBlur`) es inmediato y cancela cualquier timer de apertura pendiente.
