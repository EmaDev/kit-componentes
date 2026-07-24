# BottomNav

> Barra de navegación inferior fija, tipo app nativa, visible sólo en mobile.

**Import**
```tsx
import { BottomNav } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para exponer los 3-5 accesos principales de una app en mobile, fija al fondo de la pantalla, imitando el patrón de navegación de apps nativas (iOS/Android). Está pensada para convivir con `Navbar` o `SideBar` en desktop: el propio componente se auto-oculta en pantallas `md` y superiores (`md:hidden`), así que se puede montar siempre en el layout sin lógica condicional adicional. Incluye indicador animado del tab activo y badges numéricos por ítem (ej. notificaciones, carrito).

## Cuándo NO usarlo / alternativas

- Si la app es principalmente desktop o tiene muchas secciones que no caben en 3-5 ítems, usá `SideBar` (navegación lateral, colapsable).
- Si necesitás una barra superior con marca y acciones globales, usá `Navbar`.
- Patrón típico: `SideBar` (o `Navbar`) para desktop + `BottomNav` para mobile, ambos montados en el mismo layout — `BottomNav` se oculta solo en desktop vía CSS (`md:hidden`), pero conviene ocultar el otro en mobile manualmente (ej. con clases `hidden md:block` en `SideBar`/`Navbar`) para no duplicar visualmente la navegación.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `items` | `BottomNavItem[]` | — (requerido) | Ítems de navegación. La cantidad determina el número de columnas de la grilla (`grid-template-columns: repeat(items.length, 1fr)`). |
| `className` | `string` | `""` | Clases CSS adicionales para el `<nav>` raíz. |

## Tipos exportados

```ts
export interface BottomNavItem {
  label: string;
  href: string;
  icon: ReactNode; // requerido
  badge?: number;
}
```

## Ejemplos

### Uso básico
```tsx
import { BottomNav, type BottomNavItem } from "lib-kit-components";

const items: BottomNavItem[] = [
  { label: "Inicio", href: "/", icon: <HomeIcon /> },
  { label: "Buscar", href: "/buscar", icon: <SearchIcon /> },
  { label: "Carrito", href: "/carrito", icon: <CartIcon />, badge: 2 },
  { label: "Perfil", href: "/perfil", icon: <UserIcon /> },
];

<BottomNav items={items} />
```

### Combinado con SideBar (desktop + mobile)
```tsx
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <SideBar sections={sidebarSections} />
      </div>
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <BottomNav items={bottomNavItems} />
    </div>
  );
}
```

### Con badge mayor a 99 (se trunca a "99+")
```tsx
const items: BottomNavItem[] = [
  { label: "Inbox", href: "/inbox", icon: <MailIcon />, badge: 150 },
];

<BottomNav items={items} />
// El badge muestra "99+"
```

## Requisitos / dependencias

- **Requiere `next` como peer dependency.** El componente importa `Link` de `next/link` y `usePathname` de `next/navigation` directamente en el código fuente, por lo tanto **sólo funciona dentro de una app Next.js con App Router**. `next` está declarado como peer dependency opcional del paquete: sólo hace falta instalarlo si usás `Navbar`, `SideBar` o `BottomNav`.
- No resuelve en playgrounds que no sean Next.js.
- Usa `framer-motion` para la animación de entrada (`y: 80 → 0`), el indicador de tab activo (`layoutId="bottomnav-indicator"`) y las transiciones de color/escala de ícono y label.
- Deja espacio para el "home indicator" de iOS con `pb-[env(safe-area-inset-bottom)]`.

## Notas y comportamiento

- Se oculta automáticamente en viewports `md` y mayores mediante la clase `md:hidden`; no es necesario condicionarlo manualmente para desktop.
- Es `fixed bottom-0 left-0 right-0 z-40`, por lo que el contenido de la página necesita padding-bottom propio para no quedar tapado (ej. `pb-16` en el contenedor principal cuando `BottomNav` está visible).
- El resaltado del ítem activo usa comparación exacta `pathname === item.href` (no por prefijo).
- El indicador activo (barrita superior de 3px) usa `layoutId="bottomnav-indicator"`, por lo que se desliza animado entre ítems al cambiar de tab en vez de aparecer/desaparecer abruptamente.
- El ícono activo escala levemente (`scale: 1.1`) y sube 2px; tanto el ícono como el label cambian de color entre `var(--color-primary)` y `var(--color-muted)` vía animación de `framer-motion`.
- `badge` sólo se muestra si es `!= null` y `> 0`; valores mayores a 99 se muestran como `"99+"`.
- `icon` es obligatorio en `BottomNavItem` (a diferencia de `NavLink` de `Navbar`, donde es opcional).
