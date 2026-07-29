# PageStatusScreen

> Pantalla completa para estados de página no exitosos: 404, 403 (sin permiso), 500 (error del servidor) o vacío general, con ícono, título/descripción por defecto (sobrescribibles) y hasta dos acciones.

**Import**
```tsx
import { PageStatusScreen } from "lib-kit-components";
import type { PageStatus } from "lib-kit-components";
```

## Cuándo usarlo

Como pantalla completa de reemplazo cuando una ruta o vista no puede mostrar su contenido normal por una razón "de la aplicación": la página no existe (`404`), el usuario no tiene permiso (`403`), el servidor falló (`500`), o simplemente no hay datos todavía (`empty`, ej. "Todavía no hay pedidos"). Cada `status` trae ícono, título y descripción por defecto en español, que podés sobrescribir con `title`/`description`, y hasta dos botones de acción (`primary`/`secondary`, ej. "Volver al inicio" / "Reintentar").

## Cuándo NO usarlo / alternativas

- Si el problema es específicamente falta de conexión a internet (no un 404/403/500/vacío de la app), usá [OfflineFallback](OfflineFallback.md) en su lugar — reacciona en vivo a los eventos `online`/`offline` y cambia de mensaje solo al reconectar, algo que `PageStatusScreen` no hace.
- Si la app entera está caída por mantenimiento programado o una función todavía no se lanzó ("próximamente"), usá [MaintenancePage](MaintenancePage.md), no `PageStatusScreen` con un `status` inventado — `PageStatusScreen` no tiene esos dos casos entre sus `status` válidos (`"404" | "403" | "500" | "empty"`).
- Para confirmar el éxito de una operación (pago, pedido, formulario), usá [SuccessPage](SuccessPage.md), que además suma confeti y redirección con cuenta atrás — `PageStatusScreen` es sólo para estados no exitosos o vacíos.
- Si el "vacío" es un bloque chico dentro de una sección (no toda la pantalla, ej. una tabla sin filas), preferí un estado vacío inline liviano en vez de montar `PageStatusScreen` (pensado para `min-h-[420px]`).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `status` | `PageStatus` | — (requerido) | Caso a mostrar; define ícono, título y descripción por defecto. |
| `title` | `string` | título por defecto de `status` | Sobrescribe el título. |
| `description` | `string` | descripción por defecto de `status` | Sobrescribe la descripción. |
| `primary` | `{ label: string; onClick: () => void }` | `undefined` | Botón de acción principal (relleno). Si no se pasa, no se renderiza. |
| `secondary` | `{ label: string; onClick: () => void }` | `undefined` | Botón de acción secundaria (texto). Si no se pasa, no se renderiza. |
| `className` | `string` | `""` | Clases adicionales para el contenedor. |

## Tipos exportados

```ts
type PageStatus = "404" | "403" | "500" | "empty";
```

## Ejemplos

### 404 con acción para volver al inicio
```tsx
<PageStatusScreen status="404" primary={{ label: "Volver al inicio", onClick: () => router.push("/") }} />
```

### 403 con textos custom
```tsx
<PageStatusScreen
  status="403"
  title="Este panel es solo para administradores"
  description="Si creés que esto es un error, contactá a soporte."
  secondary={{ label: "Volver", onClick: () => router.back() }}
/>
```

### Estado vacío con acción de crear
```tsx
<PageStatusScreen
  status="empty"
  title="Todavía no tenés pedidos"
  description="Cuando hagas tu primera compra, la vas a ver acá."
  primary={{ label: "Ir a la tienda", onClick: () => router.push("/tienda") }}
/>
```

### 500 con reintento
```tsx
<PageStatusScreen status="500" primary={{ label: "Reintentar", onClick: refetch }} secondary={{ label: "Volver al inicio", onClick: () => router.push("/") }} />
```

## Requisitos / dependencias

- Marcado como `"use client"`. No requiere ningún Provider.
- No depende de Next.js ni de `framer-motion` — los `onClick` de `primary`/`secondary` reciben la función de navegación que uses (`router.push`, `<Link>` externo, etc.).

## Notas y comportamiento

- Es puramente presentacional y sin estado interno: todo se deriva de las props en cada render.
- `title`/`description` sólo pisan el texto de ese `status` puntual; no hay forma de agregar un `status` nuevo sin extender el componente (el mapa `DEFAULTS` está definido internamente, no es una prop).
- El contenedor usa `min-h-[420px]` y centra todo vertical y horizontalmente — pensado para ocupar el área principal de contenido (debajo de un `Navbar`/`AppHeader`), no la pantalla `100vh` completa.
- Ninguno de los botones se muestra si no se pasa su prop correspondiente: sin `primary` ni `secondary`, la pantalla queda sólo como mensaje informativo.
