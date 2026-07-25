# Tabs

> Navegación por pestañas con 5 estilos visuales, indicador animado con `layoutId`, soporte de íconos/badges/disabled, y paneles opcionales con crossfade.

**Import**
```tsx
import { Tabs } from "lib-kit-components";
```

## Cuándo usarlo

Para dividir contenido relacionado en secciones que el usuario alterna sin cambiar de ruta: detalle de un ítem con "Resumen / Actividad / Configuración", filtros de una vista, o cualquier navegación secundaria dentro de una misma pantalla. Tiene 5 variantes (`underline`, `pill`, `segmented`, `enclosed`, `vertical`) para distintos contextos visuales, soporta íconos y badges por tab, scroll horizontal cuando no entran todos, y puede renderizar los paneles directamente (`panels`) con una animación de crossfade al cambiar.

## Cuándo NO usarlo / alternativas

- Si las "pestañas" en realidad representan rutas distintas de la app (cada una con su propia URL), usá `Navbar`/`SideBar`/`BottomNav` en vez de `Tabs`, que no cambia la URL por sí solo.
- Si necesitás mostrar la ruta jerárquica actual ("Inicio / Proyectos / Detalle"), usá [Breadcrumbs](Breadcrumbs.md), no `Tabs`.
- Para navegar una secuencia de **imágenes** (galería), usá [Carousel](Carousel.md) — `Tabs` no está pensado para contenido visual deslizable.
- Si sólo necesitás un selector de una opción dentro de un formulario (no una navegación de secciones), considerá [Select](Select.md) o `CheckboxGroup`/radios en vez de `Tabs`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `items` | `TabItem[]` | — (requerido) | Pestañas a mostrar. |
| `value` | `string` | — (requerido) | `id` del tab activo. Componente **controlado**: no hay modo no controlado. |
| `onChange` | `(id: string) => void` | — (requerido) | Se llama al seleccionar un tab (click o flechas de teclado). |
| `variant` | `"underline" \| "pill" \| "segmented" \| "enclosed" \| "vertical"` | `"underline"` | Estilo visual. `vertical` cambia el layout completo a una columna de tabs + panel a la derecha. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Alto/tipografía de cada tab. |
| `fitted` | `boolean` | `false` | Los tabs se reparten todo el ancho disponible en partes iguales (ignorado en `vertical`). |
| `scrollable` | `boolean` | `false` | Habilita scroll horizontal cuando los tabs no entran (ignorado en `vertical`). |
| `panels` | `Record<string, ReactNode>` | `undefined` | Si se pasa, `Tabs` renderiza el panel correspondiente a `value` debajo/al lado de la lista, con crossfade animado al cambiar. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Tipos exportados

```ts
type TabsVariant = "underline" | "pill" | "segmented" | "enclosed" | "vertical";
type TabsSize = "sm" | "md" | "lg";

interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
}
```

## Ejemplos

### Uso básico, sólo la lista
```tsx
const [tab, setTab] = useState("resumen");

<Tabs
  items={[{ id: "resumen", label: "Resumen" }, { id: "actividad", label: "Actividad" }]}
  value={tab}
  onChange={setTab}
/>
```

### Con paneles y variante segmentada
```tsx
<Tabs
  items={items}
  value={tab}
  onChange={setTab}
  variant="segmented"
  size="md"
  fitted
  panels={{
    resumen: <Resumen />,
    actividad: <Actividad />,
  }}
/>
```

### Íconos, badges y un tab deshabilitado
```tsx
<Tabs
  items={[
    { id: "todo", label: "Todo", icon: <InboxIcon />, badge: 12 },
    { id: "hecho", label: "Hecho", icon: <CheckIcon /> },
    { id: "archivado", label: "Archivado", disabled: true },
  ]}
  value={tab}
  onChange={setTab}
  variant="pill"
/>
```

### Vertical, tipo sidebar de ajustes
```tsx
<Tabs
  items={[{ id: "perfil", label: "Perfil" }, { id: "seguridad", label: "Seguridad" }]}
  value={tab}
  onChange={setTab}
  variant="vertical"
  panels={{ perfil: <Perfil />, seguridad: <Seguridad /> }}
/>
```

## Requisitos / dependencias

- Usa `framer-motion` (`layoutId` para el indicador animado que se desliza entre tabs, `AnimatePresence` para el crossfade de paneles).
- Marcado como `"use client"`.
- No depende de Next.js.

## Notas y comportamiento

- Es **completamente controlado**: siempre hay que pasar `value` + `onChange`. No maneja estado interno propio del tab activo.
- El indicador activo usa `layoutId={`tabs-ind-${variant}`}` — si montás dos `Tabs` con la misma `variant` en la misma pantalla, Framer Motion puede intentar compartir la animación del indicador entre ambos; si eso genera un salto visual no deseado, forzá `key` distintas en cada `Tabs` o variá el `variant`.
- Navegación por teclado: con foco en la lista (`role="tablist"`), `←`/`→` (o `↑`/`↓` en `variant="vertical"`) mueven la selección entre tabs **no deshabilitados**, saltando los `disabled`.
- `panels` es opcional a propósito: si no lo pasás, `Tabs` sólo renderiza la lista de pestañas y vos controlás qué mostrar debajo según `value` (útil si el contenido no es un simple `Record` estático, ej. viene de un `switch`).
- En `variant="enclosed"`, el panel queda envuelto en un contenedor con borde (`rounded-b-xl border ... p-5`) que visualmente "cierra" el borde inferior de la lista de tabs; en el resto de las variantes el panel sólo tiene `padding-top`.
- `fitted` y `scrollable` son mutuamente en tensión: si activás ambos, `fitted` fuerza `flex-1` en cada tab, lo que en la práctica anula la necesidad de scroll salvo con muchísimos tabs — normalmente se usa uno u otro, no los dos.
