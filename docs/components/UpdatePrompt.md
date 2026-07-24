# UpdatePrompt

> Avisa cuando hay una versión nueva de la app cacheada por el service worker y lista para activarse; al aceptar, la activa y recarga.

**Import**
```tsx
import { UpdatePrompt } from "lib-kit-components";
```

## Cuándo usarlo

Usalo en cualquier PWA que registre un service worker con estrategia de cache y quiera avisar al usuario cuando hay una build nueva disponible, en vez de dejar que siga usando una versión vieja indefinidamente hasta que cierre y reabra la pestaña. Es el patrón estándar "nueva versión lista, actualizá cuando quieras".

## Cuándo NO usarlo / alternativas

- Si tu app no registra service worker (no es realmente una PWA offline-first), este componente no tiene nada que detectar y no va a mostrarse nunca — no hace falta incluirlo.
- Si sólo querés ver el estado del service worker sin el flujo de "actualizar y recargar", usá `PwaStatus`, que también observa esa información como parte de un panel de diagnóstico.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `swUrl` | `string` | `"/sw.js"` | Ruta del service worker a registrar/observar. |
| `title` | `string` | `"Nueva versión disponible"` | Título del prompt. |
| `description` | `string` | `"Recargá para usar la última versión de la app."` | Descripción. |
| `actionLabel` | `string` | `"Actualizar"` | Texto del botón de acción. |
| `dismissLabel` | `string` | `"Después"` | Texto del botón para posponer. |
| `checkIntervalMs` | `number` | `1h` (heredado del hook `useServiceWorker`) | Cada cuánto revisar si hay una versión nueva, en ms. |
| `forceVisible` | `boolean` | `false` | Fuerza el prompt visible, ignorando el estado real del service worker — para testear el UI. |

## Ejemplos

### Uso básico
```tsx
<UpdatePrompt />
```

### Con service worker en ruta custom y chequeo cada 15 minutos
```tsx
<UpdatePrompt swUrl="/custom-sw.js" checkIntervalMs={15 * 60 * 1000} />
```

### Testear el UI en desarrollo, sin depender del service worker real
```tsx
<UpdatePrompt forceVisible />
```

### Textos personalizados
```tsx
<UpdatePrompt
  title="Hay una actualización"
  description="Incluye mejoras de rendimiento y corrección de errores."
  actionLabel="Actualizar ahora"
  dismissLabel="Más tarde"
/>
```

## Requisitos / dependencias

- Usa `framer-motion` para la animación de entrada/salida y el ícono de refresh que gira mientras se aplica la actualización.
- **Requiere un `public/sw.js` (o la ruta que indiques en `swUrl`) con un listener de mensajes que responda a `SKIP_WAITING`**, si no, `applyUpdate()` no tiene forma de activar la versión nueva y termina recargando la página sin más (fallback). El listener mínimo necesario:

```js
self.addEventListener("message", (e) => {
  if (e.data?.type === "SKIP_WAITING") self.skipWaiting();
});
```

- Depende del hook `useServiceWorker`, que registra el service worker automáticamente al montar (`autoRegister: true` por defecto) y detecta actualizaciones vía el patrón `updatefound` + `statechange` + `controllerchange`.
- En un entorno de desarrollo normal sin un `sw.js` real desplegado con una versión distinta a la cacheada, este componente no muestra nada — usá `forceVisible` para verificar el diseño sin tener que simular un despliegue real.
- Si otro componente (por ejemplo `PwaStatus` con `observeOnly={false}`) también registra el mismo service worker, no hay conflicto porque `navigator.serviceWorker.register()` es idempotente para la misma URL, pero evitá registrar service workers distintos desde múltiples componentes a la vez.

## Notas y comportamiento

- `visible` es `forceVisible || (sw.updateAvailable && !hidden)`: una vez que el usuario lo descarta (`dismissLabel`), no vuelve a aparecer hasta que haya una actualización *nueva* detectada (el estado `hidden` no se resetea solo).
- Al presionar `actionLabel`, se llama a `sw.applyUpdate()`: envía `SKIP_WAITING` al service worker en espera y, cuando el navegador dispara `controllerchange`, recarga la página automáticamente una sola vez. Si `controllerchange` no llega en 2.5 segundos, hay un fallback que fuerza el reload igual.
- Mientras se aplica la actualización (`sw.updating`), el botón de acción se deshabilita y muestra `"…"`, y el ícono de refresh gira en loop.
- El prompt aparece como un toast fijo abajo a la izquierda-centro de la pantalla, respetando `env(safe-area-inset-bottom)`.
- Usa `role="alert"` para anunciarse inmediatamente a lectores de pantalla.
- `checkIntervalMs` en `0` desactivaría el chequeo periódico automático (según el hook subyacente), pero el valor por defecto del componente no fuerza `0`; si no se pasa la prop, se usa el default interno del hook (1 hora).
