# Breadcrumbs

> Ruta de navegación (breadcrumb trail) con colapso automático en "…" cuando hay demasiados niveles.

**Import**
```tsx
import { Breadcrumbs } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para mostrar la ubicación jerárquica actual dentro de una app o sitio con estructura de carpetas/categorías anidadas (ej. `Inicio / Categoría / Subcategoría / Producto`), especialmente cuando la profundidad puede ser variable o grande y no querés que la ruta rompa el layout: el componente colapsa automáticamente los niveles intermedios en un "…" dejando siempre visibles el primero y los dos últimos. También sirve como navegación rápida hacia niveles superiores.

## Cuándo NO usarlo / alternativas

- No reemplaza a `Navbar`, `SideBar` ni `BottomNav`: es un componente de contexto/ubicación dentro de una página, no navegación estructural del sitio. Se usa junto a alguno de ellos, típicamente debajo de la barra superior.
- Si la jerarquía es fija y corta (2-3 niveles siempre), podés omitir el colapso ajustando `maxItems` a un número mayor a la cantidad de items esperada, o simplemente no preocuparte porque el colapso no se activará.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `items` | `Crumb[]` | — (requerido) | Lista completa de niveles de la ruta, en orden desde la raíz. |
| `maxItems` | `number` | `4` | Máximo de items visibles antes de colapsar el resto en "…". Si `items.length > maxItems`, se muestran el primero, un "…" y los dos últimos. |
| `separator` | `ReactNode` | ícono `>` (chevron SVG) | Separador visual entre items. |
| `onNavigate` | `(item: Crumb, index: number) => void` | `undefined` | Si se provee, intercepta el click (hace `preventDefault`) y delega la navegación en vez de seguir el `href` nativamente. |
| `lastIsCurrent` | `boolean` | `true` | Si es `true`, el último item se renderiza como texto no clickeable (`aria-current="page"`) en vez de link. |
| `className` | `string` | `""` | Clases CSS adicionales para el `<nav>` raíz. |

## Tipos exportados

```ts
export interface Crumb {
  label: string;
  href?: string;
  icon?: ReactNode;
}
```

## Ejemplos

### Uso básico
```tsx
import { Breadcrumbs, type Crumb } from "lib-kit-components";

const items: Crumb[] = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/productos" },
  { label: "Zapatillas Running X200" },
];

<Breadcrumbs items={items} />
```

### Ruta larga con colapso automático
```tsx
const items: Crumb[] = [
  { label: "Inicio", href: "/" },
  { label: "Tienda", href: "/tienda" },
  { label: "Hombre", href: "/tienda/hombre" },
  { label: "Calzado", href: "/tienda/hombre/calzado" },
  { label: "Running", href: "/tienda/hombre/calzado/running" },
  { label: "Zapatillas X200" },
];

// items.length (6) > maxItems (4) → muestra: Inicio / … / Running / Zapatillas X200
<Breadcrumbs items={items} maxItems={4} />
```

### Navegación controlada (SPA sin recarga / router propio)
```tsx
import { useRouter } from "next/navigation";

function ProductBreadcrumbs({ items }: { items: Crumb[] }) {
  const router = useRouter();
  return (
    <Breadcrumbs
      items={items}
      onNavigate={(item) => { if (item.href) router.push(item.href); }}
    />
  );
}
```

### Con íconos y separador personalizado
```tsx
<Breadcrumbs
  items={[
    { label: "Inicio", href: "/", icon: <HomeIcon /> },
    { label: "Ajustes", href: "/ajustes", icon: <GearIcon /> },
    { label: "Seguridad" },
  ]}
  separator={<span className="text-muted">/</span>}
/>
```

## Requisitos / dependencias

- No depende de `next`: usa `<a>` nativo con `href`, así que funciona en cualquier entorno React (con Next.js o sin él). Si tu app usa client-side routing, pasá `onNavigate` para interceptar el click y evitar una recarga completa.
- Usa `framer-motion` sólo para el `whileTap` de escala en cada link clickeable.

## Notas y comportamiento

- El colapso se activa únicamente cuando `items.length > maxItems`; en ese caso siempre se preservan el primer item y los últimos dos, sin importar cuántos queden ocultos en el medio.
- El item colapsado ("…") no es clickeable, pero muestra un `title` (tooltip nativo) con la lista de labels ocultos unidos por `" / "` — nota: el cálculo de qué labels se listan (`items.slice(1, -2)`) asume que se ocultan todos menos el primero y los dos últimos, coherente con la lógica de colapso.
- Cuando `lastIsCurrent` es `true` (default), el último item se renderiza como `<span aria-current="page">` sin importar si tiene `href` — no es clickeable aunque se lo definas.
- Si un item no tiene `href` y no es el último (o `lastIsCurrent` es `false` y sí querés que sea clickeable), el link cae en `href ?? "#"` — es decir, sin `href` explícito el link apunta a `"#"`, lo que puede causar un salto de scroll indebido si no se pasa `onNavigate` para interceptar el click.
- El `nav` raíz tiene `aria-label="Ruta de navegación"` para accesibilidad, y el item actual usa `aria-current="page"`.
- Los labels largos truncan con `truncate` (requieren que el contenedor padre limite el ancho para que el truncado sea visible).
