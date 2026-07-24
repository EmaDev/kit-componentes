# SideBar

> Barra de navegación lateral vertical, colapsable a modo icono, con secciones agrupadas y badges por link.

**Import**
```tsx
import { SideBar } from "lib-kit-components";
```

## Cuándo usarlo

Usalo como navegación principal de dashboards, paneles de administración o cualquier app con varias secciones de primer nivel que conviene agrupar (ej. "General", "Configuración", "Cuenta"). Ocupa toda la altura del viewport (`h-screen sticky top-0`) y se puede colapsar a una franja angosta de sólo íconos para ganar espacio horizontal de contenido, manteniendo tooltips (`title`) con el label completo mientras está colapsada.

## Cuándo NO usarlo / alternativas

- Si la navegación es simple (pocas secciones, sin agrupamiento) y el layout es más de tipo sitio/landing, usá `Navbar` (horizontal, arriba).
- Si el target principal es mobile y querés accesos rápidos tipo app nativa, usá `BottomNav`. Es común combinar `SideBar` (desktop) + `BottomNav` (mobile) con CSS responsive en el mismo layout.
- No la uses fuera de una app Next.js con App Router — ver requisitos abajo.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `brand` | `ReactNode` | `undefined` | Contenido mostrado arriba a la izquierda (logo/nombre). Se oculta con una transición de fade+slide cuando la barra está colapsada. |
| `sections` | `SidebarSection[]` | — (requerido) | Grupos de links a renderizar, en orden. |
| `footer` | `ReactNode` | `undefined` | Contenido fijo al pie de la barra (ej. usuario, logout), separado por un borde superior. |
| `defaultCollapsed` | `boolean` | `false` | Estado inicial de colapso. El estado de colapso es interno (no controlado desde afuera). |
| `className` | `string` | `""` | Clases CSS adicionales para el `<aside>` raíz. |

## Tipos exportados

```ts
export interface SidebarLink {
  label: string;
  href: string;
  icon: ReactNode; // requerido (a diferencia de NavLink, acá el ícono es obligatorio)
  badge?: string | number;
}

export interface SidebarSection {
  title?: string;
  links: SidebarLink[];
}
```

## Ejemplos

### Uso básico
```tsx
import { SideBar, type SidebarSection } from "lib-kit-components";

const sections: SidebarSection[] = [
  {
    title: "General",
    links: [
      { label: "Inicio", href: "/", icon: <HomeIcon /> },
      { label: "Pedidos", href: "/pedidos", icon: <BoxIcon />, badge: 3 },
    ],
  },
  {
    title: "Cuenta",
    links: [
      { label: "Perfil", href: "/perfil", icon: <UserIcon /> },
      { label: "Ajustes", href: "/ajustes", icon: <GearIcon /> },
    ],
  },
];

<SideBar brand={<Logo />} sections={sections} />
```

### Colapsada por defecto (modo icon rail)
```tsx
<SideBar brand={<LogoMark />} sections={sections} defaultCollapsed />
```

### Con footer de usuario
```tsx
<SideBar
  brand={<Logo />}
  sections={sections}
  footer={
    <div className="flex items-center gap-2">
      <Avatar src={user.avatar} />
      <span className="text-sm truncate">{user.name}</span>
    </div>
  }
/>
```

### Sección sin título (links sueltos arriba de todo)
```tsx
const sections: SidebarSection[] = [
  { links: [{ label: "Buscar", href: "/buscar", icon: <SearchIcon /> }] },
  { title: "Reportes", links: [/* ... */] },
];

<SideBar sections={sections} />
```

## Requisitos / dependencias

- **Requiere `next` como peer dependency.** El componente importa `Link` de `next/link` y `usePathname` de `next/navigation` directamente en el código fuente, por lo tanto **sólo funciona dentro de una app Next.js con App Router**. `next` está declarado como peer dependency opcional del paquete: sólo hace falta instalarlo si usás `Navbar`, `SideBar` o `BottomNav`.
- No resuelve en playgrounds que no sean Next.js.
- Usa `framer-motion` para animar el ancho al colapsar/expandir, el fade de textos y el indicador del link activo (`layoutId="sidebar-active"`).
- El estado de colapso es **no controlado**: sólo se puede fijar el valor inicial vía `defaultCollapsed`; el toggle interno (botón con flecha) maneja el resto. No hay prop `collapsed`/`onCollapsedChange` para controlarlo desde afuera.

## Notas y comportamiento

- El ancho anima entre `76px` (colapsada) y `256px` (expandida) con un spring de `framer-motion`.
- El botón de colapso/expansión rota su flecha 180° y tiene `aria-label` dinámico (`"Expandir"` / `"Colapsar"`).
- Con la barra colapsada, cada link muestra `title={link.label}` como tooltip nativo del navegador (ya que el texto del label se oculta).
- El `badge` cambia de posición según el estado: en modo expandido es un chip inline al final del link (`min-w-[20px] h-5`); en modo colapsado se convierte en un punto pequeño superpuesto arriba a la derecha del ícono (`absolute -top-1 -right-1 w-4 h-4`). Acepta `string | number`; cualquier valor "truthy" distinto de `null`/`undefined` se muestra (`link.badge != null`), incluyendo `0` como string si se pasa `"0"`.
- El resaltado del link activo usa comparación exacta `pathname === link.href` (no por prefijo) y anima el fondo con `layoutId="sidebar-active"` al cambiar de sección/link.
- `icon` en `SidebarLink` es **obligatorio** (a diferencia de `NavLink` de `Navbar`, donde es opcional).
- El título de cada `SidebarSection` también se anima con fade+height al colapsar/expandir, y se omite completamente si la sección no tiene `title` o si la barra está colapsada.
