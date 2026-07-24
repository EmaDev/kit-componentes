# Stepper / AddButton

> Control de cantidad con botones "+"/"−" y loading independiente por botón (`Stepper`), y botón "agregar" con estados idle → loading → hecho (`AddButton`).

**Import**
```tsx
import { Stepper, AddButton } from "lib-kit-components";
```

## Cuándo usarlo

`Stepper` sirve para ajustar una cantidad puntual dentro de una fila, card o lista (cantidad de un ítem de carrito, cantidad de un producto, etc.), con soporte para operaciones asíncronas (ej. actualizar cantidad contra el backend) mostrando loading sólo en el botón presionado. `AddButton` es el botón "Agregar" clásico que confirma visualmente la acción (ícono de check + label "Agregado") antes de volver a su estado inicial — útil como CTA de "agregar al carrito" cuando todavía no hay cantidad seleccionada (antes de mostrar el `Stepper`).

## Cuándo NO usarlo / alternativas

- No los uses para la acción global/principal de una pantalla (crear, componer, FAB) — para eso está `FloatingButton`, pensado como acción flotante de nivel de página, no como control local dentro de una fila.
- Patrón típico de e-commerce: mostrar `AddButton` (o `Stepper` con `collapsible`) cuando la cantidad es 0, y transicionar a `Stepper` expandido una vez que el usuario agregó al menos una unidad.

## Props

### Stepper

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `value` | `number` | — (requerido) | Valor actual (controlado). |
| `onChange` | `(value: number) => void \| Promise<unknown>` | — (requerido) | Callback al incrementar/decrementar, recibe el nuevo valor ya calculado (clamp aplicado). Si devuelve una promesa, el botón presionado muestra un spinner y **ambos** botones quedan deshabilitados hasta que resuelva. |
| `min` | `number` | `0` | Valor mínimo permitido. |
| `max` | `number` | `99` | Valor máximo permitido. |
| `step` | `number` | `1` | Incremento/decremento por click. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño de los botones y tipografía del número. |
| `variant` | `"solid" \| "outline" \| "pill"` | `"solid"` | Estilo visual del contenedor: `solid` (fondo alterno), `outline` (borde, fondo normal), `pill` (fondo alterno + bordes totalmente redondeados). |
| `collapsible` | `boolean` | `false` | Si es `true`, el control arranca colapsado como un único botón "+" (estilo carrito vacío) y se expande al primer toque, ejecutando además el incremento inicial. |
| `unit` | `string` | `undefined` | Unidad mostrada junto al número (ej. `"kg"`, `"u."`). |
| `disabled` | `boolean` | `false` | Deshabilita ambos botones. |
| `className` | `string` | `""` | Clases CSS adicionales para el contenedor. |

### AddButton

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `onAdd` | `() => void \| Promise<unknown>` | — (requerido) | Handler de la acción de agregar. Si devuelve una promesa, el botón pasa a estado `busy` (spinner) hasta que resuelva. |
| `label` | `string` | `"Agregar"` | Texto en estado inicial. |
| `addedLabel` | `string` | `"Agregado"` | Texto mostrado en estado `done`. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño del botón. |
| `className` | `string` | `""` | Clases CSS adicionales. |

## Ejemplos

### Stepper básico (controlado, síncrono)
```tsx
const [qty, setQty] = useState(1);

<Stepper value={qty} onChange={setQty} min={1} max={10} />
```

### Stepper con actualización asíncrona (ej. contra API de carrito)
```tsx
<Stepper
  value={item.quantity}
  onChange={async (next) => {
    await updateCartItem(item.id, next); // el botón presionado muestra spinner mientras resuelve
  }}
  min={0}
  max={item.stock}
/>
```

### Stepper colapsable, estilo carrito
```tsx
const [qty, setQty] = useState(0);

<Stepper
  value={qty}
  onChange={setQty}
  collapsible
  min={0}
  max={20}
  unit="u."
  variant="pill"
/>
// Arranca como un único botón "+"; al tocarlo se expande y suma 1.
// Si vuelve a 0, se vuelve a colapsar automáticamente.
```

### AddButton (antes de tener cantidad seleccionada)
```tsx
<AddButton
  onAdd={async () => { await addToCart(product.id, 1); }}
  label="Agregar al carrito"
  addedLabel="¡Agregado!"
  size="lg"
/>
```

## Requisitos / dependencias

- No dependen de `next`. Funcionan en cualquier app React/Next.js.
- Usan `framer-motion` para: transición numérica con slide vertical según dirección (`Stepper`, `AnimatePresence mode="popLayout"`), animación de layout al colapsar/expandir (`layout`), spinner rotatorio infinito (`Spin`), y transición entre estados idle/busy/done (`AddButton`, `AnimatePresence mode="wait"`).
- Ambos son controlados por naturaleza en cuanto a estado externo: `Stepper.value` es siempre controlado por el padre (no hay modo no-controlado); el estado de "busy"/"done"/`expanded` es interno.

## Notas y comportamiento

- En `Stepper`, mientras una operación está en curso (`busy !== null`), **ambos** botones quedan deshabilitados, no sólo el que se presionó — evita incrementos/decrementos concurrentes.
- El cálculo del siguiente valor hace clamp contra `min`/`max` (`Math.min(max, value + step)` / `Math.max(min, value - step)`); si el resultado es igual al valor actual (ya en el límite), `onChange` ni se llama.
- Los botones se deshabilitan automáticamente en los límites (`atMin`/`atMax`) además de por `disabled` o `busy`.
- Con `collapsible={true}`: el estado inicial `expanded` se calcula como `!collapsible || value > min` — es decir, si arranca con un valor mayor al mínimo, se muestra expandido desde el inicio aunque sea colapsable. Al volver a `value <= min` tras un decremento, se vuelve a colapsar automáticamente.
- El número usa `AnimatePresence` con `key={value}` y desliza en la dirección del cambio (`dir` calculado comparando con el valor anterior via `useRef`), dando efecto de "odómetro".
- `unit` se muestra en un tamaño de fuente relativo menor (`text-[0.85em]`) junto al número, y amplía el ancho reservado del contador (+18px) para no recortar el texto.
- `role="group"` con `aria-label="Cantidad"` en el contenedor, y `aria-label="Restar"`/`"Sumar"`/`"Agregar"` en los botones individuales para accesibilidad.
- En `AddButton`, si `onAdd()` rechaza (throw / promise rejected), el estado vuelve directamente a `idle` (no pasa por `done`) sin mostrar ningún error — el manejo de errores queda a cargo del código que llama a `onAdd`.
- En `AddButton`, el estado `done` se revierte automáticamente a `idle` después de 1600ms (`setTimeout`), sin intervención del usuario.
- Mientras el estado de `AddButton` no es `"idle"`, el botón queda deshabilitado (no se puede re-disparar mientras está en `busy` o `done`).
