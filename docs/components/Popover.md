# Popover

> Panel anclado a un trigger, con contenido arbitrario (no sólo una lista de acciones), que se abre con click.

**Import**
```tsx
import { Popover } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para mostrar **contenido interactivo o complejo** anclado a un elemento: un mini-formulario, un selector de fecha, un bloque de texto con links, controles de filtro. A diferencia de un tooltip, se abre con click (no hover) y su contenido puede tener sus propios botones, inputs o links.

## Cuándo NO usarlo / alternativas

- Si el contenido es sólo texto informativo breve que aparece con hover (sin interacción propia), usá `Tooltip` — es más liviano y accesible por teclado sin necesitar click.
- Si el contenido es específicamente una lista de **acciones** (editar/eliminar/duplicar) con soporte de íconos, atajos y estilo destructivo, usá `Dropdown`, que ya tiene esa semántica resuelta.
- Si el contenido necesita bloquear el resto de la pantalla o es demasiado grande/complejo para un panel anclado (formularios largos, confirmaciones críticas), usá `Modal` o `BottomSheet`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `trigger` | `ReactNode` | — (requerido) | Elemento que abre/cierra el panel al hacer click. |
| `children` | `ReactNode` | — (requerido) | Contenido del panel. |
| `open` | `boolean` | `undefined` | Estado controlado. Si se omite, el componente maneja su propio estado interno (no controlado). |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Se llama cada vez que el panel debería abrirse/cerrarse (click en trigger, click afuera, Escape). En modo controlado es la única forma de que el cambio tenga efecto. |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"bottom"` | Lado del panel respecto al trigger. |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alineación sobre el eje perpendicular al lado. |
| `closeOnOutsideClick` | `boolean` | `true` | Cierra el panel al hacer click fuera de él. |
| `closeOnEscape` | `boolean` | `true` | Cierra el panel al presionar `Escape`. |
| `showArrow` | `boolean` | `true` | Muestra una flechita apuntando al trigger. |
| `className` | `string` | `""` | Clases para el contenedor raíz (`relative inline-block`). |
| `contentClassName` | `string` | `""` | Clases adicionales para el panel. |

## Tipos exportados

```ts
export type PopoverSide = "top" | "bottom" | "left" | "right";
export type PopoverAlign = "start" | "center" | "end";
```

## Ejemplos

### Uso básico, no controlado
```tsx
<Popover trigger={<Button variant="secondary">Filtros</Button>}>
  <div className="flex flex-col gap-3 w-56">
    <Checkbox label="Sólo en stock" />
    <Checkbox label="Con descuento" />
    <Button size="sm" onClick={applyFilters}>Aplicar</Button>
  </div>
</Popover>
```

### Controlado, abierto desde código
```tsx
const [open, setOpen] = useState(false);

<Popover
  open={open}
  onOpenChange={setOpen}
  trigger={<Button size="icon" variant="ghost"><InfoIcon /></Button>}
  side="right"
>
  <p className="text-sm text-muted w-64">
    Este saldo incluye retenciones pendientes de liquidar.
  </p>
</Popover>
```

### Sin flecha, alineado al final
```tsx
<Popover
  trigger={<Avatar src={user.avatar} />}
  align="end"
  showArrow={false}
>
  <UserMiniCard user={user} />
</Popover>
```

## Requisitos / dependencias

- Usa `framer-motion` internamente para la animación de apertura/cierre.
- Marcado como `"use client"`.
- No requiere ningún provider.
- Soporta modo **controlado** (pasando `open` + `onOpenChange`) y **no controlado** (omitiendo `open`), igual que `Input`/`Select`/`Checkbox`.

## Notas y comportamiento

- En modo controlado (`open` definido), el componente **no** actualiza ningún estado interno: es responsabilidad del consumidor cambiar `open` en respuesta a `onOpenChange`. Si pasás `open` sin `onOpenChange`, el panel queda fijo (los clicks en el trigger/afuera no lo cerrarán).
- El panel se posiciona con `position: absolute` respecto al contenedor raíz (`relative inline-block`) — no usa portal, así que un `overflow: hidden` en un ancestro puede recortarlo. No hay flip automático como en `Tooltip`: si el `side` elegido no entra en el viewport, el panel simplemente queda parcialmente fuera de pantalla.
- El listener de click afuera usa `mousedown` sobre `document`, igual que `Dropdown`.
- `z-[95]`: mismo nivel que `Tooltip`, por encima de `Modal` (`z-[90]`).
- La flecha (`showArrow`) usa los mismos tokens de borde/superficie que el panel (`bg-surface`, `border-border`), por lo que se mantiene coherente en ambos temas.
