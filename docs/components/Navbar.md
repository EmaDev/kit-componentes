# Navbar

> Barra de navegación horizontal superior, con menú responsive tipo hamburguesa y resaltado animado del link activo.

**Import**
```tsx
import { Navbar } from "lib-kit-components";
```

## Cuándo usarlo

Usalo como cabecera principal de una app o sitio con layout de navegación horizontal (marketing sites, dashboards simples, apps con pocas secciones de primer nivel). Resuelve el patrón clásico: marca a la izquierda, links centrados/a la derecha en desktop, y un menú hamburguesa colapsable en mobile con transición de altura animada. También sirve como contenedor para acciones globales (botón de login, toggle de tema, etc.) que sólo se muestran junto a los links en desktop y se listan debajo del menú en mobile.

## Cuándo NO usarlo / alternativas

- Si la app tiene muchas secciones o sub-secciones (dashboards con navegación jerárquica), usá `SideBar`: es navegación vertical lateral pensada para ese caso, con colapso a modo icono y secciones agrupadas.
- Si el público objetivo es mayormente mobile y querés navegación fija tipo app nativa con 3-5 accesos principales, usá `BottomNav` en su lugar (o además, mostrando `SideBar`/`Navbar` en desktop y `BottomNav` en mobile vía CSS responsive).
- No la uses dentro de una app que no sea Next.js con App Router — ver requisitos abajo.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `brand` | `ReactNode` | `undefined` | Contenido a la izquierda (logo, nombre de marca, etc.). |
| `links` | `NavLink[]` | `[]` | Links de navegación principal. Se renderizan en fila en desktop (`md:flex`) y en lista vertical dentro del menú mobile. |
| `actions` | `ReactNode` | `undefined` | Contenido adicional (botones, acciones) mostrado junto a los links en desktop y debajo de la lista de links en el menú mobile. |
| `sticky` | `boolean` | `true` | Si es `true`, aplica `sticky top-0 z-40` para que la barra quede fija arriba al hacer scroll. |
| `className` | `string` | `""` | Clases CSS adicionales para el `<nav>` raíz. |

## Tipos exportados

```ts
export interface NavLink {
  label: string;
  href: string;
  icon?: ReactNode;
}
```

## Ejemplos

### Uso básico
```tsx
import { Navbar, type NavLink } from "lib-kit-components";

const links: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/productos" },
  { label: "Contacto", href: "/contacto" },
];

<Navbar brand={<span className="font-bold">Mi App</span>} links={links} />
```

### Con acciones (login/CTA)
```tsx
<Navbar
  brand={<img src="/logo.svg" alt="Mi App" className="h-6" />}
  links={links}
  actions={
    <>
      <Button variant="ghost" size="sm">Ingresar</Button>
      <Button variant="primary" size="sm">Registrarme</Button>
    </>
  }
/>
```

### Con íconos en los links
```tsx
const links: NavLink[] = [
  { label: "Inicio", href: "/", icon: <HomeIcon /> },
  { label: "Pedidos", href: "/pedidos", icon: <BoxIcon /> },
];

<Navbar brand={<Logo />} links={links} />
```

### No sticky (barra que se desplaza con la página)
```tsx
<Navbar brand={<Logo />} links={links} sticky={false} className="border-b" />
```

## Requisitos / dependencias

- **Requiere `next` como peer dependency.** El componente importa `Link` de `next/link` y `usePathname` de `next/navigation` directamente en el código fuente, por lo tanto **sólo funciona dentro de una app Next.js con App Router**. `next` está declarado como peer dependency opcional del paquete: sólo hace falta instalarlo si usás `Navbar`, `SideBar` o `BottomNav`.
- No resuelve en playgrounds que no sean Next.js (por ejemplo, un proyecto Vite plano), ya que `next/navigation` no existe fuera de ese contexto.
- Usa `framer-motion` internamente para las animaciones de entrada, el pill del link activo (`layoutId="nav-pill"`) y la apertura del menú mobile.
- El resaltado de "link activo" es automático: compara `pathname === l.href` (comparación exacta, no por prefijo).

## Notas y comportamiento

- El componente detecta el scroll de la ventana (`window.scrollY > 8`) para aplicar fondo con blur y sombra (`scrolled`); por debajo de ese umbral el fondo es transparente.
- El menú mobile se cierra automáticamente cada vez que cambia el `pathname` (navegación entre páginas), vía un `useEffect` que escucha `pathname`.
- El botón hamburguesa anima sus tres líneas a una "X" con `framer-motion` (`rotate`/`y`) y tiene `aria-label="Menu"`.
- El resaltado del link activo en desktop usa `layoutId="nav-pill"`, lo que produce una transición animada tipo "morph" del fondo cuando cambia el link activo.
- En mobile, cada link del menú desplegado anima su entrada con un stagger (`delay: i * 0.04`).
- `links` y `actions` sólo se muestran en desktop dentro del `<div className="hidden md:flex">`; en mobile viven exclusivamente dentro del panel desplegable (`AnimatePresence`).
- La comparación de ruta activa es exacta (`pathname === l.href`); no resalta automáticamente en subrutas (ej. `/productos/123` no marca activo a `/productos`).
