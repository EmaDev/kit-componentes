# Footer

> Pie de página completo: marca + descripción + redes, columnas de links con reveal animado, newsletter opcional y barra inferior con volver-arriba.

**Import**
```tsx
import { Footer } from "lib-kit-components";
```

## Cuándo usarlo

Usalo como cierre de página para sitios de contenido, landings, dashboards con navegación pública o cualquier layout que necesite un pie con columnas de links (Producto, Compañía, Legal, etc.), redes sociales, y opcionalmente un formulario de newsletter. Todas sus secciones son opcionales — podés usar sólo `bottomText` para un footer mínimo, o combinar todo para uno completo.

## Cuándo NO usarlo / alternativas

- Si necesitás navegación **primaria** (no un pie de cierre), usá `Navbar`, `SideBar` o `BottomNav` según el layout.
- Si sólo necesitás mostrar la ruta actual dentro del contenido (no links de sitio), usá `Breadcrumbs`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `brand` | `ReactNode` | `undefined` | Logo/nombre en la columna izquierda. |
| `description` | `string` | `undefined` | Texto breve debajo de `brand`. |
| `groups` | `FooterLinkGroup[]` | `[]` | Columnas de links, cada una con título y lista de `{ label, href }`. |
| `socials` | `FooterSocialLink[]` | `[]` | Íconos de redes sociales debajo de la descripción. |
| `newsletter` | `FooterNewsletter` | `undefined` | Si se pasa, agrega una columna con formulario de suscripción. |
| `bottomText` | `string` | `` `© {año} — Todos los derechos reservados.` `` | Texto a la izquierda de la barra inferior. |
| `bottomLinks` | `FooterLink[]` | `[]` | Links legales (Privacidad, Términos) en la barra inferior. |
| `onNavigate` | `(href: string) => void` | `undefined` | Si se pasa, intercepta el click de **todos** los links (incluidos `socials` y `bottomLinks`) con `preventDefault()` en vez de navegar con `<a href>` nativo — útil para routers SPA. |
| `showBackToTop` | `boolean` | `true` | Muestra el botón circular "volver arriba" en la barra inferior. |
| `className` | `string` | `""` | Clases para el `<footer>` raíz. |

## Tipos exportados

```ts
export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterSocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface FooterNewsletter {
  title?: string;           // default: "Novedades"
  description?: string;
  placeholder?: string;     // default: "tu@email.com"
  buttonLabel?: string;     // default: "Enviar"
  onSubmit?: (email: string) => void | Promise<unknown>;
}
```

## Ejemplos

### Completo
```tsx
<Footer
  brand={<span>Mi Tienda</span>}
  description="Todo lo que necesitás, en un solo lugar."
  socials={[
    { label: "Instagram", href: "https://instagram.com/...", icon: <InstagramIcon /> },
    { label: "X", href: "https://x.com/...", icon: <XIcon /> },
  ]}
  groups={[
    { title: "Producto", links: [{ label: "Catálogo", href: "/catalogo" }, { label: "Precios", href: "/precios" }] },
    { title: "Compañía", links: [{ label: "Nosotros", href: "/nosotros" }, { label: "Contacto", href: "/contacto" }] },
  ]}
  newsletter={{
    description: "Ofertas y novedades una vez por semana, nada de spam.",
    onSubmit: async (email) => subscribeToNewsletter(email),
  }}
  bottomLinks={[{ label: "Privacidad", href: "/privacidad" }, { label: "Términos", href: "/terminos" }]}
/>
```

### Mínimo
```tsx
<Footer bottomText="© 2026 Mi Empresa." showBackToTop={false} />
```

### Con router SPA (Next.js App Router)
```tsx
import { useRouter } from "next/navigation";

const router = useRouter();

<Footer
  groups={groups}
  onNavigate={(href) => router.push(href)}
/>
```

## Requisitos / dependencias

- Usa `framer-motion` para el reveal por scroll (`whileInView`) de cada columna y las micro-interacciones de hover en íconos sociales y el botón "volver arriba".
- Marcado como `"use client"`.
- **No requiere Next.js**: a diferencia de `Navbar`/`SideBar`/`BottomNav`, todos los links se renderizan como `<a href>` nativo (no `next/link`) — funciona en cualquier proyecto React. Para routing SPA sin recarga completa, usá `onNavigate`.
- El botón "volver arriba" usa `window.scrollTo`, por lo que sólo tiene efecto si el scroll relevante es el de la ventana (no un contenedor interno con `overflow`).

## Notas y comportamiento

- Cada columna (`brand`, cada `group`, y `newsletter` si existe) se anima con `whileInView` + `viewport={{ once: true }}` y un `delay` incremental por posición — el reveal ocurre una sola vez la primera vez que el footer entra en el viewport, no se repite al volver a scrollear.
- El grid es `lg:grid-cols-[1.4fr_repeat(auto-fit,minmax(120px,1fr))]`: la columna de marca ocupa proporcionalmente más espacio, y las columnas de `groups`/`newsletter` se ajustan automáticamente según cuántas haya, sin necesidad de especificar la cantidad.
- **Gotcha de `onNavigate`**: al pasarlo, se aplica a **todos** los links del componente (`groups`, `socials`, `bottomLinks`) sin excepción — no hay forma de que un link individual "escape" y siga usando navegación nativa. Si necesitás mezclar comportamientos, no pasés `onNavigate` y manejá la intercepción a nivel de tu propio router (ej. Next.js intercepta automáticamente los `<a href>` internos si migrás a `next/link` por fuera de este componente).
- El formulario de newsletter tiene su propio ciclo `idle → busy → done` (igual que `AddToCartButton`): mientras `onSubmit` está pendiente el botón muestra "…", al resolver muestra "✓" por 2.4s y limpia el input; si `onSubmit` rechaza la promesa, vuelve a `idle` sin limpiar el input para que el usuario pueda reintentar.
- El fondo decorativo (dos blobs difuminados con `blur-3xl` en `primary`/`accent`) es puramente visual y tiene `pointer-events-none` — no interfiere con clicks.
