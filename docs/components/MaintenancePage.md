# MaintenancePage

> Página estática de "en mantenimiento" o "próximamente" para features en construcción, con ETA opcional y formulario para dejar el correo y que avisen cuando esté lista.

**Import**
```tsx
import { MaintenancePage } from "lib-kit-components";
import type { MaintenanceKind } from "lib-kit-components";
```

## Cuándo usarlo

Como pantalla completa cuando una sección o la app entera está temporalmente fuera de servicio por mantenimiento programado (`kind="maintenance"`), o cuando una función todavía no se lanzó y querés mostrar un "próximamente" con opción de anotarse para que avisen (`kind="coming-soon"`, vía `onNotify`). Soporta un `eta` corto ("Volvemos a las 14:00") además del título/descripción.

## Cuándo NO usarlo / alternativas

- Si el estado es un 404, 403, 500 o una vista sin datos (no mantenimiento ni "próximamente"), usá [PageStatusScreen](PageStatusScreen.md) — comparten el mismo layout centrado de pantalla completa, pero `MaintenancePage` sólo cubre los dos casos de `MaintenanceKind` (`"maintenance" | "coming-soon"`) y no tiene un `status="500"` ni similar.
- Si el problema es falta de conexión a internet del dispositivo (no que el servicio esté caído a propósito), usá [OfflineFallback](OfflineFallback.md), que además reacciona en vivo a los eventos `online`/`offline` — algo que `MaintenancePage` no hace, es puramente estático.
- Para un aviso persistente y no bloqueante de que el dispositivo está sin conexión (sin ocupar toda la pantalla), usá [OfflineBanner](OfflineBanner.md).
- Si sólo necesitás capturar un correo para una lista de espera sin el resto del layout de "mantenimiento" (ícono, título centrado, etc.), armá tu propio formulario — `MaintenancePage` no es un componente de formulario genérico, el input de `onNotify` viene con copy y estilos fijos.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `kind` | `MaintenanceKind` | `"maintenance"` | `"maintenance"` (ícono de llave, copy de mantenimiento) o `"coming-soon"` (ícono de reloj, copy de "muy pronto"). |
| `title` | `string` | título por defecto de `kind` | Sobrescribe el título. |
| `description` | `string` | descripción por defecto de `kind` | Sobrescribe la descripción. |
| `eta` | `string` | `undefined` | Texto corto destacado en el color primario (ej. "Volvemos a las 14:00"). Si no se pasa, no se muestra. |
| `onNotify` | `(email: string) => void \| Promise<void>` | `undefined` | Si se pasa, renderiza un formulario de correo + botón "Avisarme" que lo invoca al enviar. Si no se pasa, no se muestra ningún formulario. |
| `className` | `string` | `""` | Clases adicionales para el contenedor. |

## Tipos exportados

```ts
type MaintenanceKind = "maintenance" | "coming-soon";
```

## Ejemplos

### Mantenimiento programado con ETA
```tsx
<MaintenancePage kind="maintenance" eta="Volvemos a las 14:00 (hora Argentina)" />
```

### Próximamente, con lista de espera por correo
```tsx
<MaintenancePage
  kind="coming-soon"
  title="Pagos con QR — muy pronto"
  description="Estamos terminando de integrar esta función."
  onNotify={async (email) => {
    await fetch("/api/waitlist", { method: "POST", body: JSON.stringify({ email }) });
  }}
/>
```

### Como pantalla completa de la app durante un mantenimiento global
```tsx
export default function MaintenanceRoute() {
  return <MaintenancePage kind="maintenance" title="Estamos actualizando la plataforma" eta="Vuelve en ~30 minutos" />;
}
```

## Requisitos / dependencias

- Marcado como `"use client"`. No requiere ningún Provider.
- No depende de Next.js ni de `framer-motion`.

## Notas y comportamiento

- Es puramente presentacional salvo por el formulario de `onNotify`: el `<input type="email" required>` usa validación nativa del navegador antes de invocar el callback, y el value se lee vía `e.currentTarget.elements.namedItem("email")` (no es un input controlado con `useState`).
- El formulario de `onNotify` no muestra feedback de éxito/error ni limpia el campo tras enviar — si `onNotify` es async y falla, no hay estado de error visible; manejalo vos mismo (ej. con un `Toast`) dentro del callback.
- El contenedor usa `min-h-[420px]` y centra todo vertical y horizontalmente, igual que `PageStatusScreen` — pensado para el área principal de contenido, no para `100vh` completo.
- `eta` es un simple `string` mostrado tal cual; no calcula ni formatea una cuenta regresiva (para eso existe [CountdownBanner](CountdownBanner.md) o [RedirectTimer](RedirectTimer.md)).
