# BottomSheet

> Panel deslizable desde abajo, mobile-first, con drag-to-close, puntos de anclaje (snap points) y modo flotante en desktop.

**Import**
```tsx
import { BottomSheet } from "lib-kit-components";
import type { BottomSheetSize } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando la interacción debe sentirse "app nativa": selectores de opciones, acciones rápidas, formularios cortos que aparecen deslizándose desde el borde inferior en mobile. Soporta arrastrar para cerrar, múltiples alturas predefinidas o puntos de anclaje (`snapPoints`) entre los que el usuario puede arrastrar libremente. En pantallas de escritorio, por defecto flota como una card centrada (`desktopFloating`) en vez de quedar pegada abajo.

## Cuándo NO usarlo / alternativas

- Para diálogos más formales, orientados a desktop, o que no necesitan sensación de "hoja nativa" (confirmaciones estándar, formularios largos), usá `Modal`.
- Si necesitás controlar el ancho máximo de forma independiente del alto/anclaje, `Modal` da más control sobre esas dimensiones vía su prop `size`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `open` | `boolean` | — (requerido) | Controla si el sheet está visible. |
| `onClose` | `() => void` | — (requerido) | Se llama al cerrar (backdrop, `Escape`, drag hacia abajo). |
| `size` | `BottomSheetSize` | `"auto"` | Altura del sheet. Se ignora por completo si `snapPoints` está definido. |
| `title` | `string` | `undefined` | Título del header. |
| `description` | `string` | `undefined` | Texto secundario debajo del título. |
| `children` | `ReactNode` | `undefined` | Contenido del cuerpo, con scroll propio. |
| `footer` | `ReactNode` | `undefined` | Acciones fijas al pie que no scrollean, con padding de safe-area inferior. |
| `showHandle` | `boolean` | `true` | Muestra la barra superior ("handle") que sugiere que se puede arrastrar. |
| `showClose` | `boolean` | `false` | Muestra el botón × en el header. |
| `closeOnBackdrop` | `boolean` | `true` | Si es `false`, click en el fondo no cierra el sheet. |
| `dragToClose` | `boolean` | `true` | Permite arrastrar hacia abajo para cerrar (ignorado si `snapPoints` está definido; en ese caso el drag se maneja entre anclajes). |
| `snapPoints` | `number[]` | `undefined` | Fracciones del alto de pantalla (0 a 1), ascendentes, ej. `[0.4, 0.9]`. Si se define, ignora `size` y habilita arrastre entre alturas. |
| `defaultSnap` | `number` | `0` | Índice inicial dentro de `snapPoints`. |
| `desktopFloating` | `boolean` | `true` | En pantallas ≥`sm`, el sheet flota como card centrada (bottom-6, ancho fijo, bordes redondeados en las 4 esquinas) en vez de quedar pegado al borde inferior. |

## Tipos exportados

```ts
export type BottomSheetSize = "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full";
```
Alturas aproximadas: `auto` crece con el contenido hasta 85dvh · `xs` 28dvh · `sm` 40dvh · `md` 58dvh · `lg` 76dvh · `xl` 90dvh · `full` 100dvh (sin esquinas redondeadas arriba, ocupa todo el viewport).

## Ejemplos

### Selector de opciones (mobile-first)
```tsx
const [open, setOpen] = useState(false);

<BottomSheet open={open} onClose={() => setOpen(false)} title="Ordenar por" size="sm">
  <div className="flex flex-col gap-1">
    {sortOptions.map((opt) => (
      <button key={opt.value} onClick={() => { setSort(opt.value); setOpen(false); }}>
        {opt.label}
      </button>
    ))}
  </div>
</BottomSheet>
```

### Con footer de acciones fijas
```tsx
<BottomSheet
  open={open}
  onClose={() => setOpen(false)}
  title="Filtrar productos"
  size="lg"
  footer={
    <div className="flex gap-2">
      <Button variant="secondary" fullWidth onClick={clearFilters}>Limpiar</Button>
      <Button fullWidth onClick={applyFilters}>Aplicar</Button>
    </div>
  }
>
  <FiltersForm />
</BottomSheet>
```

### Con snap points (arrastre entre alturas)
```tsx
<BottomSheet
  open={open}
  onClose={() => setOpen(false)}
  snapPoints={[0.35, 0.9]}
  defaultSnap={0}
  title="Detalles del pedido"
>
  <OrderDetails />
</BottomSheet>
```

### Fijo al borde inferior también en desktop
```tsx
<BottomSheet
  open={open}
  onClose={() => setOpen(false)}
  desktopFloating={false}
  size="md"
  title="Notificaciones"
>
  <NotificationsList />
</BottomSheet>
```

## Requisitos / dependencias

- Usa `framer-motion` intensivamente: `drag="y"`, `dragConstraints`, `dragElastic`, `onDragEnd` con `PanInfo` para calcular velocidad/offset del gesto.
- Marcado como `"use client"`.
- Es completamente **controlado** (igual que `Modal`): el consumidor maneja `open`.

## Notas y comportamiento

- Mientras `open` es `true`, se bloquea el scroll del body y se restaura al cerrar. Se cierra con `Escape`.
- **Lógica de arrastre sin `snapPoints`**: arrastrar hacia abajo más de 110px, o soltar con velocidad hacia abajo mayor a 500px/s ("flick"), cierra el sheet (si `dragToClose` es `true`). Si `dragToClose` es `false` y no hay `snapPoints`, el sheet no es arrastrable (`drag={false}`) aunque `showHandle` siga mostrando la barra visual.
- **Lógica de arrastre con `snapPoints`**: arrastrar hacia abajo (>70px de offset o flick) desde el snap más bajo (índice 0) cierra el sheet; desde un snap superior, baja al anclaje anterior. Arrastrar hacia arriba (offset < -70px o flick hacia arriba) avanza al siguiente anclaje, hasta el último. `dragToClose` se ignora en este modo — el cierre por arrastre sólo ocurre al intentar bajar del primer snap.
- El z-index del backdrop es `z-[140]` y el del panel `z-[150]`, ambos mayores al `z-[90]` de `Modal` — si ambos están abiertos, el `BottomSheet` queda por encima.
- `desktopFloating` sólo cambia el layout a partir del breakpoint `sm` de Tailwind; en mobile el comportamiento es siempre "pegado abajo" independientemente de esta prop.
- El `aria-label` del diálogo se completa con `title` (`aria-label={title}`), pero no hay `aria-labelledby`/`aria-describedby` apuntando a los elementos reales del header, ni focus trap.
- Si no se pasa `footer`, igualmente se reserva un pequeño espacio inferior con padding de safe-area (`env(safe-area-inset-bottom)`) para evitar que el contenido quede pegado al borde en dispositivos con home indicator.
