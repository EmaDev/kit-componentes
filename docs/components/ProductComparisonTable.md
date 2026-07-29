# ProductComparisonTable

> Tabla comparativa de especificaciones: N productos como columnas, cada fila una característica, con selección directa por producto.

**Import**
```tsx
import { ProductComparisonTable } from "lib-kit-components";
import type { ComparedProduct, CompareSpecRow } from "lib-kit-components";
```

## Cuándo usarlo

Para páginas de "comparar productos" en e-commerce (ej. comparar 2-4 modelos de un mismo tipo de producto): cada producto es una columna con imagen, nombre, precio y botón "Elegir"; cada fila es un atributo (`label`) con el valor de ese atributo para cada producto (`values[productId]`). Ideal cuando el número de productos a comparar es chico y fijo por vista (2 a 4), no un dataset paginable.

## Cuándo NO usarlo / alternativas

- **No es una tabla de datos genérica.** A diferencia de [`DataTable`](DataTable.md), `ProductComparisonTable` es una grilla ad-hoc pensada específicamente para esta comparación transpuesta (productos en columnas, specs en filas): no tiene orden, búsqueda, paginado ni selección múltiple. Si necesitás explorar/ordenar/filtrar una colección de productos (no compararlos uno al lado del otro), usá `DataTable` con filas = productos.
- Si comparás **planes de precios/suscripción** en vez de productos físicos/digitales, usá [`PricingTable`](PricingTable.md), que ya trae el switch mensual/anual y el layout de cards en vez de tabla de specs.
- Si sólo necesitás mostrar **un** producto con su detalle (sin comparar contra otros), usá `MediaCard` (ver [Card](Card.md)).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `products` | `ComparedProduct[]` | — (requerido) | Productos a comparar, uno por columna. |
| `specs` | `CompareSpecRow[]` | — (requerido) | Filas de especificaciones. |
| `onSelect` | `(id: string) => void` | `undefined` | Si se pasa, muestra el botón "Elegir" en el header de cada columna de producto. |
| `className` | `string` | `""` | Clases adicionales para el contenedor. |

## Tipos exportados

```ts
interface ComparedProduct {
  id: string;
  name: string;
  image?: string;
  price: string;
  highlight?: boolean;
}

interface CompareSpecRow {
  id: string;
  label: string;
  values: Record<string, React.ReactNode>; // clave = ComparedProduct.id
}
```

## Ejemplos

### Uso básico
```tsx
const products: ComparedProduct[] = [
  { id: "a", name: "Modelo A", image: "/a.jpg", price: "$120.000" },
  { id: "b", name: "Modelo B", image: "/b.jpg", price: "$145.000", highlight: true },
];

const specs: CompareSpecRow[] = [
  { id: "ram", label: "RAM", values: { a: "8 GB", b: "16 GB" } },
  { id: "storage", label: "Almacenamiento", values: { a: "256 GB", b: "512 GB" } },
  { id: "warranty", label: "Garantía", values: { a: "12 meses", b: "24 meses" } },
];

<ProductComparisonTable products={products} specs={specs} onSelect={(id) => addToCart(id)} />
```

### Con valores custom por celda (íconos, checks)
```tsx
const specs: CompareSpecRow[] = [
  {
    id: "5g",
    label: "5G",
    values: {
      a: <CheckIcon className="text-primary mx-auto" />,
      b: <span className="text-muted">—</span>,
    },
  },
];
```

## Requisitos / dependencias

- Sin dependencias externas más allá de React; no usa `framer-motion`, Next.js ni ningún Provider.
- Marcado como `"use client"` únicamente porque `onSelect` dispara un handler de click (no usa estado ni hooks).

## Notas y comportamiento

- Un valor `undefined`/`null` en `values[productId]` se muestra como `"—"` (fallback explícito con `??`), no como celda vacía.
- `highlight: true` en un `ComparedProduct` tiñe tanto la celda del header como todas las celdas de esa columna con un fondo `primary` tenue, para destacar visualmente la opción recomendada a lo largo de toda la tabla.
- La tabla usa `overflow-x-auto` con `min-w-[560px]`, así que en mobile se scrollea horizontalmente en vez de romper el layout — no colapsa a un layout de cards apiladas.
- No ordena ni filtra `specs` ni `products`: se renderizan en el orden exacto de los arrays recibidos.
