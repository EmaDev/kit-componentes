# StockLimitedStepper

> Stepper de cantidad (`-`/`+`) que conoce el stock disponible: avisa cuando queda poco y bloquea al llegar al máximo, en vez de dejar pedir de más.

**Import**
```tsx
import { StockLimitedStepper } from "lib-kit-components";
```

## Cuándo usarlo

Para el selector de cantidad de un producto en carrito o ficha de producto, cuando el stock disponible es limitado y conocido de antemano. A diferencia de un stepper genérico, éste recibe `stock` y ajusta su propio feedback: mensaje de "quedan solo N" por debajo de `lowStockThreshold`, bloqueo (con flash rojo del botón `+`) al llegar al máximo, y mensaje de "Sin stock" cuando `stock === 0`.

## Cuándo NO usarlo / alternativas

- Si la cantidad no tiene un límite de stock a comunicar (ej. cantidad de comensales, cantidad de páginas a imprimir), armá tu propio stepper simple con `Button` — `StockLimitedStepper` está atado a la semántica de inventario (mensajes en español de "stock", "disponible").
- Para ingresar un **monto de dinero** (no una cantidad de unidades), usá `AmountPad`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `value` | `number` | — (requerido) | Cantidad actual (controlado). |
| `onChange` | `(n: number) => void` | — (requerido) | Se dispara al incrementar/decrementar. |
| `stock` | `number` | — (requerido) | Unidades disponibles; tope superior de `value`. |
| `min` | `number` | `1` | Cantidad mínima permitida. |
| `lowStockThreshold` | `number` | `5` | Si `stock` es menor o igual a este valor, muestra el aviso "¡Quedan solo N!". |
| `className` | `string` | `""` | Clases adicionales para el contenedor. |

## Ejemplos

### Uso básico
```tsx
const [qty, setQty] = useState(1);

<StockLimitedStepper value={qty} onChange={setQty} stock={product.stock} />
```

### Con umbral de stock bajo custom
```tsx
<StockLimitedStepper value={qty} onChange={setQty} stock={3} lowStockThreshold={10} min={1} />
```

### Sin stock
```tsx
<StockLimitedStepper value={0} onChange={() => {}} stock={0} />
// Muestra "Sin stock" y el botón "+" queda visualmente bloqueado (flash) en cada intento de sumar.
```

## Requisitos / dependencias

- Sin dependencias externas más allá de React (`useState` para el flash del botón `+`).
- Marcado como `"use client"`. No requiere ningún Provider.

## Notas y comportamiento

- Es **controlado**: `value` y `onChange` son obligatorios; el componente no mantiene su propia cantidad, sólo el flag transitorio `flash` para el feedback visual del botón `+`.
- Al intentar incrementar estando en el máximo (`value >= stock`), **no llama a `onChange`** — sólo dispara el flash rojo del botón `+` durante 400ms. `onChange` sólo se invoca con valores válidos (`min` a `stock`).
- El botón `-` sí puede quedar deshabilitado (`disabled`) cuando `value <= min`; el botón `+` nunca se deshabilita con el atributo `disabled` — al llegar al tope, sigue siendo clickeable pero no incrementa (usa el flash como única señal, para que el usuario no piense que el control dejó de funcionar).
- El texto de ayuda debajo del stepper es mutuamente excluyente y sigue esta prioridad: `stock === 0` → "Sin stock"; si no, `value >= stock` (`atMax`) → "Llegaste al máximo disponible"; si no, `stock <= lowStockThreshold` → "¡Quedan solo N!"; si ninguna aplica, no se muestra texto.
