# Card / CardMedia / CardHeader / CardFooter / StatCard / MediaCard / ProfileCard / PricingCard

> Superficie base (`Card`) con 5 variantes visuales, más un set de piezas para armarla (`CardMedia`, `CardHeader`, `CardFooter`) y cuatro composiciones listas para los casos más comunes: KPI (`StatCard`), contenido con imagen (`MediaCard`), perfil (`ProfileCard`) y plan de precios (`PricingCard`).

**Import**
```tsx
import { Card, CardMedia, CardHeader, CardFooter, StatCard, MediaCard, ProfileCard, PricingCard } from "lib-kit-components";
```

## Cuándo usarlo

`Card` es el contenedor de superficie genérico de la librería: cualquier bloque de contenido agrupado que necesite separarse visualmente del fondo (borde, sombra, glass, gradiente). Los sub-componentes (`CardMedia`, `CardHeader`, `CardFooter`) son piezas para armar layouts custom encima de `Card` sin reinventar la zona de imagen, el header con título/subtítulo/acción, o el footer con borde superior. Las cuatro composiciones (`StatCard`, `MediaCard`, `ProfileCard`, `PricingCard`) ya resuelven patrones completos: un KPI con delta y sparkline, una tarjeta de contenido con imagen (grid de productos/posts/propiedades), una tarjeta de perfil de usuario, y un plan de pricing con features y CTA.

## Cuándo NO usarlo / alternativas

- Si necesitás una tarjeta que se voltea en 3D (ficha, tarjeta de crédito), usá [FlipCard](FlipCard.md) en vez de `Card`.
- Si el contenido todavía no cargó y querés mostrar un placeholder con la forma de una `Card`, usá [SkeletonCard](Skeleton.md) en vez de una `Card` vacía.
- Para una tabla de datos con orden/búsqueda/paginado, usá [DataTable](DataTable.md) — `Card` no reemplaza una grilla de datos.
- Si el bloque necesita comportarse como un diálogo que bloquea la pantalla, usá [Modal](Modal.md) o [BottomSheet](BottomSheet.md), no `Card` con `interactive`.

## Props

### Card

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `variant` | `"elevated" \| "outline" \| "flat" \| "gradient" \| "glass"` | `"outline"` | Estilo visual: `elevated` (sombra), `outline` (sólo borde), `flat` (fondo `surface-alt` sin borde), `gradient` (degradé primary→accent sutil), `glass` (fondo semitransparente + blur). |
| `padding` | `"none" \| "sm" \| "md" \| "lg"` | `"md"` | Padding interno. |
| `interactive` | `boolean` | `false` | Activa hover lift (`y: -3`) y tap scale, además de `cursor-pointer` — úsalo aunque no pases `onClick` si la card es clickeable por otro medio (ej. envuelta en `<Link>`). |
| `onClick` | `() => void` | `undefined` | Si se pasa, agrega `role="button"`, `tabIndex={0}` y activa automáticamente el comportamiento interactivo (aunque `interactive` sea `false`). |
| `className` | `string` | `""` | Clases adicionales. |
| `children` | `ReactNode` | `undefined` | Contenido. |

### CardMedia

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `src` | `string` | `undefined` | URL de la imagen. Sin `src`, dibuja un placeholder rayado con `label`. |
| `alt` | `string` | `""` | Texto alternativo. |
| `aspect` | `number` | `16/9` | Relación de aspecto (`width / height`). |
| `label` | `string` | `"imagen"` | Texto del placeholder cuando no hay `src`. |
| `overlay` | `ReactNode` | `undefined` | Contenido posicionado absoluto sobre la imagen (ej. un badge). |
| `className` | `string` | `""` | Clases adicionales. |

### CardHeader

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `ReactNode` | — (requerido) | Título (trunca con `truncate` si excede el ancho). |
| `subtitle` | `ReactNode` | `undefined` | Texto secundario debajo del título. |
| `aside` | `ReactNode` | `undefined` | Contenido a la derecha (ej. un menú `Dropdown` o un ícono). |
| `className` | `string` | `""` | Clases adicionales. |

### CardFooter

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `children` | `ReactNode` | — (requerido) | Contenido del footer (típicamente botones). |
| `className` | `string` | `""` | Clases adicionales. |

### StatCard

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | — (requerido) | Etiqueta del KPI (uppercase, tracking ancho). |
| `value` | `string \| number` | — (requerido) | Valor principal, grande. |
| `unit` | `string` | `undefined` | Unidad al lado del valor (ej. `"usuarios"`). |
| `delta` | `number` | `undefined` | Variación porcentual; positivo = verde con flecha arriba, negativo = rojo con flecha abajo. |
| `icon` | `ReactNode` | `undefined` | Ícono en un chip de color a la derecha del label. |
| `tone` | `"primary" \| "accent" \| "success" \| "danger" \| "neutral"` | `"primary"` | Color del ícono, sparkline y fondo del chip. |
| `spark` | `number[]` | `undefined` | Serie de puntos para dibujar una mini sparkline SVG. |
| `footnote` | `string` | `undefined` | Texto pequeño al pie. |
| `variant` | `CardVariant` | `"outline"` | Variante de la `Card` subyacente. |

### MediaCard

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `src` / `alt` / `label` / `aspect` | — | — | Pasan directo a `CardMedia`. |
| `badge` | `ReactNode` | `undefined` | Chip flotante sobre la imagen (esquina superior izquierda). |
| `title` | `string` | — (requerido) | Título. |
| `description` | `string` | `undefined` | Texto debajo del título. |
| `meta` | `ReactNode` | `undefined` | Fila de metadatos pequeños (ej. fecha, autor). |
| `actions` | `ReactNode` | `undefined` | Fila de acciones al pie. |
| `horizontal` | `boolean` | `false` | Layout horizontal (imagen a la izquierda, 40% del ancho, aspecto 1:1) en vez de imagen arriba. |
| `variant` | `CardVariant` | `"elevated"` | Variante de la `Card` subyacente. |
| `onClick` | `() => void` | `undefined` | Hace la card clickeable. |

### ProfileCard

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `name` | `string` | — (requerido) | Nombre; también genera las iniciales del avatar por defecto. |
| `role` | `string` | `undefined` | Texto debajo del nombre (cargo, rol). |
| `avatar` | `string` | `undefined` | URL de la foto. Sin ella, muestra iniciales sobre gradiente. |
| `cover` | `boolean` | `false` | Agrega una banda de portada con gradiente arriba, con el contenido superpuesto (`-mt-9`). |
| `stats` | `{ label: string; value: string \| number }[]` | `undefined` | Grilla de hasta 3 métricas debajo del nombre/rol. |
| `actions` | `ReactNode` | `undefined` | Fila de botones al pie. |
| `variant` | `CardVariant` | `"outline"` | Variante de la `Card` subyacente. |

### PricingCard

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `plan` | `string` | — (requerido) | Nombre del plan. |
| `price` | `string` | — (requerido) | Precio (ya formateado, ej. `"$29"`). |
| `period` | `string` | `"/mes"` | Sufijo del precio. |
| `description` | `string` | `undefined` | Texto corto debajo del precio. |
| `features` | `string[]` | — (requerido) | Lista de features, cada una con check icon. |
| `cta` | `ReactNode` | `undefined` | Botón de acción al pie. |
| `highlight` | `boolean` | `false` | Marca el plan destacado: usa `variant="gradient"` + anillo `ring-primary/30`. |
| `badge` | `string` | `undefined` | Chip superior (ej. `"Popular"`). |

## Tipos exportados

```ts
type CardVariant = "elevated" | "outline" | "flat" | "gradient" | "glass";
type CardPadding = "none" | "sm" | "md" | "lg";
type StatTone = "primary" | "accent" | "success" | "danger" | "neutral";
```

## Ejemplos

### Card base con header y footer custom
```tsx
<Card variant="elevated" padding="md">
  <CardHeader title="Ingresos del mes" subtitle="Julio 2026" aside={<Button size="sm" variant="ghost">Ver más</Button>} />
  <p className="mt-3 text-sm text-muted">Resumen de facturación consolidada.</p>
  <CardFooter>
    <Button size="sm" variant="secondary">Exportar</Button>
    <Button size="sm">Ver detalle</Button>
  </CardFooter>
</Card>
```

### StatCard con sparkline
```tsx
<StatCard label="MRR" value="$48.2k" delta={12.4} tone="primary" spark={[8, 10, 9, 13, 15, 14, 18]} footnote="vs. mes anterior" />
```

### MediaCard horizontal (lista de resultados)
```tsx
<MediaCard
  src="/casa.jpg" badge="Nuevo" title="Casa Aldama"
  description="Reforma integral de 140 m²." horizontal
  actions={<Button size="sm">Ver</Button>}
/>
```

### ProfileCard con cover y stats
```tsx
<ProfileCard
  name="Lucía Marín" role="Product designer" cover
  stats={[{ label: "Proyectos", value: 12 }, { label: "Equipo", value: 4 }]}
  actions={<Button size="sm" fullWidth>Ver perfil</Button>}
/>
```

### PricingCard destacado
```tsx
<PricingCard
  plan="Pro" price="$29" highlight badge="Popular"
  features={["Proyectos ilimitados", "Soporte prioritario", "Exportación avanzada"]}
  cta={<Button fullWidth>Elegir Pro</Button>}
/>
```

## Requisitos / dependencias

- Usa `framer-motion` internamente (`motion.div` en `Card`, para el hover lift y tap scale).
- Marcado como `"use client"`.
- Ninguna composición depende de Next.js.

## Notas y comportamiento

- `Card` sólo agrega `role="button"`/`tabIndex={0}` cuando hay `onClick` o `interactive={true}` — pasar `interactive` sin `onClick` da la apariencia clickeable sin comportamiento de botón real (útil si el click se maneja en un `<Link>` que envuelve la card).
- `CardMedia` sin `src` dibuja un patrón rayado repetido vía `background` inline (no depende de una imagen de placeholder externa), así que funciona offline y sin flash de carga.
- El `Sparkline` de `StatCard` es un `<svg>` interno no exportado; normaliza `data` a la altura disponible con `min`/`max` del propio arreglo — si pasás un solo valor o todos iguales, el `span` cae a `1` para evitar división por cero.
- `ProfileCard` calcula las iniciales tomando la primera letra de las dos primeras palabras de `name` — nombres de una sola palabra muestran una sola inicial.
- Todas las composiciones (`StatCard`, `MediaCard`, `ProfileCard`, `PricingCard`) están construidas sobre `Card` y aceptan su prop `variant`, pero no reexportan `padding`/`interactive`/`onClick` salvo que el doc de arriba lo liste explícitamente.
