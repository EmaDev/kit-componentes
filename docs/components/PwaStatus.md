# PwaStatus

> Panel de diagnóstico PWA: estado de instalación, conexión, service worker y notificaciones en una sola tarjeta.

**Import**
```tsx
import { PwaStatus } from "lib-kit-components";
```

## Cuándo usarlo

Usalo en una pantalla de Ajustes/Diagnóstico, o para depurar en campo, cuando necesitás ver de un vistazo el estado completo de las capacidades PWA de la app actual: si está instalada, si hay conexión (y qué tan buena), si el service worker está activo o tiene una actualización esperando, si las notificaciones están habilitadas, y en qué plataforma corre. Es un componente de solo lectura (más un botón opcional de "buscar actualización").

## Cuándo NO usarlo / alternativas

- No reemplaza a `OfflineBanner`, `UpdatePrompt`, `NotificationOptIn` ni `PwaInstallPrompt` como mecanismos de interacción proactiva con el usuario final — esos avisan/piden en el momento; `PwaStatus` sólo informa, típicamente para un usuario avanzado o para debug.
- Si sólo te interesa el estado de conectividad (no todo el panel), `OfflineBanner` es más liviano y apropiado para mostrarlo a cualquier usuario.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `swUrl` | `string` | `"/sw.js"` | Ruta del service worker a inspeccionar. |
| `observeOnly` | `boolean` | `true` | Si es `true`, **no** registra el service worker desde este componente (asume que ya lo registra otro, típicamente `UpdatePrompt`); si es `false`, lo registra él mismo. |
| `title` | `string` | `"Estado de la app"` | Título del panel. |
| `showActions` | `boolean` | `true` | Muestra el botón "Buscar actualización" (sólo si el navegador soporta service workers). |
| `className` | `string` | `""` | Clases CSS adicionales para el contenedor. |

## Ejemplos

### Uso básico (asumiendo que `UpdatePrompt` ya registra el service worker)
```tsx
<PwaStatus />
```

### Registrando el service worker desde acá mismo (si no hay `UpdatePrompt` en la app)
```tsx
<PwaStatus observeOnly={false} />
```

### Sin acciones, sólo lectura
```tsx
<PwaStatus showActions={false} title="Diagnóstico" />
```

### Dentro de una pantalla de ajustes
```tsx
<div className="space-y-4">
  <h2 className="text-lg font-semibold">Ajustes</h2>
  <PwaStatus className="max-w-md" />
</div>
```

## Requisitos / dependencias

- Usa `framer-motion` para animar la entrada de cada fila del panel y el `whileTap` del botón de acción.
- Combina cuatro hooks: `usePwaInstall`, `useOnlineStatus`, `useServiceWorker` y `useNotificationPermission`. Cada fila del panel refleja el estado real que exponen esos hooks — no tiene props de tipo `forceVisible`/testing para simular estados, porque no es un componente que aparece/desaparece: siempre se renderiza si lo montás.
- En un entorno de desarrollo normal (sin PWA instalada, sin service worker desplegado, con conexión estable), la mayoría de las filas van a mostrar el estado "negativo" (No disponible / Inactivo / Sin definir) — eso es el comportamiento correcto, no un bug del componente.
- Si `observeOnly` es `false` y ya existe otro componente (`UpdatePrompt`) registrando el mismo `swUrl`, no hay conflicto real (el registro es idempotente por URL), pero es más prolijo dejar un solo componente a cargo del registro y el resto en modo observación.

## Notas y comportamiento

- Filas mostradas y su lógica de "tono" (punto verde/ámbar/gris):
  - **Instalación**: "Instalada" (verde) si `pwa.isStandalone`; "Disponible" (ámbar) si `pwa.canInstall`; si no, "No disponible" (gris).
  - **Conexión**: "Offline" (gris) si no hay red; "Lenta · {tipo}" (ámbar) si `net.slowConnection`; si no, "Online · {tipo}" (verde). El `{tipo}` (`effectiveType`) sólo aparece si el navegador expone la Network Information API.
  - **Service worker**: "No soportado" (gris) si el navegador no tiene la API; "Actualización lista" (ámbar) si hay una nueva versión esperando; "Activo" (verde) si está registrado; si no, "Observando" (gris, cuando `observeOnly` es `true`) o "Inactivo" (gris).
  - **Notificaciones**: "Activadas" (verde) / "Bloqueadas" (gris) / "Sin definir" (ámbar) / "No soportadas" (gris), según `Notification.permission`.
  - **Plataforma**: etiqueta legible (`iOS · Safari`, `Android`, `Escritorio`, `Desconocida`) siempre en tono gris (informativa, no de estado).
- El botón "Buscar actualización" llama a `sw.checkForUpdate()`, que fuerza un `registration.update()`; sólo aparece si `showActions` es `true` y el navegador soporta service workers.
- Cada fila anima su entrada con un pequeño desplazamiento horizontal escalonado (`delay: i * 0.05`).
