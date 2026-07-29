# BranchSelector

> Selector de sucursal/local para negocios con varias ubicaciones físicas: buscador por nombre/dirección, lista con radio de selección, estado abierto/cerrado y distancia opcional.

**Import**
```tsx
import { BranchSelector } from "lib-kit-components";
import type { Branch } from "lib-kit-components";
```

## Cuándo usarlo

Cuando el usuario tiene que elegir entre varias sucursales, locales o puntos de retiro físicos de un mismo negocio (ej. "retirar en tienda", cambiar de sucursal preferida, elegir dónde reservar un turno). Incluye un buscador que filtra en vivo por nombre + dirección, un indicador de abierto/cerrado por sucursal y la distancia en km si la tenés calculada.

## Cuándo NO usarlo / alternativas

- Si las opciones no son locales físicos con dirección/estado abierto-cerrado sino un método de envío (a domicilio, punto de retiro de correo, etc.), usá `ShippingMethodPicker`, no `BranchSelector`.
- Para elegir una ubicación en un mapa (coordenadas libres, no una lista fija de sucursales), usá [LocationPicker](LocationPicker.md).
- Si sólo necesitás un `<select>` genérico de pocas opciones sin buscador ni metadata rica, usá [Select](Select.md) — es más liviano.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `branches` | `Branch[]` | — (requerido) | Lista de sucursales a mostrar. |
| `value` | `string` | `undefined` | `id` de la sucursal seleccionada (uso controlado). |
| `onChange` | `(id: string) => void` | — (requerido) | Se llama con el `id` de la sucursal clickeada. |
| `className` | `string` | `""` | Clases adicionales para el contenedor. |

## Tipos exportados

```ts
interface Branch {
  id: string;
  name: string;
  address: string;
  distanceKm?: number;
  open?: boolean;
}
```

## Ejemplos

### Uso básico controlado
```tsx
const [branchId, setBranchId] = useState<string>();

<BranchSelector
  branches={[
    { id: "palermo", name: "Palermo", address: "Av. Santa Fe 3253", open: true, distanceKm: 1.2 },
    { id: "belgrano", name: "Belgrano", address: "Cabildo 2040", open: false, distanceKm: 4.8 },
  ]}
  value={branchId}
  onChange={setBranchId}
/>
```

### Como paso de un checkout de "retirar en tienda"
```tsx
<CardHeader title="Elegí dónde retirar tu pedido" />
<BranchSelector branches={sucursales} value={selectedBranch} onChange={setSelectedBranch} className="mt-3" />
```

## Requisitos / dependencias

- Marcado como `"use client"`. No requiere ningún Provider.
- No depende de Next.js ni de `framer-motion`.

## Notas y comportamiento

- Es **controlado**: la sucursal marcada depende únicamente de comparar `value` contra el `id` de cada `Branch`; el componente no guarda su propia selección.
- El buscador (`q`) sí es estado interno no expuesto — no hay forma de leer o precargar el texto de búsqueda desde afuera.
- El filtro compara `${name} ${address}` en minúsculas contra el query; no filtra por otros campos (`open`, `distanceKm`).
- `open` y `distanceKm` son opcionales: si una `Branch` no los define, el chip de abierto/cerrado y la distancia simplemente no se renderizan para esa fila (no se muestra un placeholder).
- La lista tiene `max-h-80 overflow-y-auto`, así que con muchas sucursales queda scrolleable dentro del propio componente sin necesidad de paginar.
- Si `branches` filtradas da vacío (0 resultados de búsqueda), muestra el mensaje "No encontramos sucursales." — no es un estado de `branches` vacío desde el origen, sino de la búsqueda sin coincidencias.
