# useServiceWorker

> Registra el service worker de la app y detecta cuándo hay una versión nueva lista para activarse, con el patrón `skipWaiting` + `controllerchange`.

**Import**
```ts
import { useServiceWorker } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando necesitás controlar vos mismo el flujo de actualización de la PWA (por ejemplo, mostrar un banner custom, o esperar a un momento no disruptivo para aplicar la actualización) en vez del componente `UpdatePrompt` prearmado, que usa este hook internamente. También es el hook a usar si tu app necesita registrar el service worker con opciones distintas a las del componente (otra ruta de `sw.js`, otro intervalo de chequeo, o registro manual diferido).

## Firma

```ts
function useServiceWorker(options?: {
  url?: string;
  autoRegister?: boolean;
  checkIntervalMs?: number;
}): {
  supported: boolean;
  registered: boolean;
  updateAvailable: boolean;
  updating: boolean;
  applyUpdate: () => void;
  checkForUpdate: () => Promise<void>;
}
```

## Opciones (parámetros)

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `url` | `string` | `"/sw.js"` | Ruta del archivo de service worker a registrar. |
| `autoRegister` | `boolean` | `true` | Si es `true`, registra el service worker automáticamente al montar. Si es `false`, el hook sólo informa `supported` (si el navegador soporta Service Workers) y no hace nada más — ni registra, ni detecta actualizaciones, ni escucha `controllerchange` — porque tenés que registrar el SW por tu cuenta en otro lado. |
| `checkIntervalMs` | `number` | `3600000` (1 hora) | Cada cuántos ms se llama `registration.update()` para buscar una versión nueva en background. `0` desactiva el chequeo periódico (sólo se detectan actualizaciones al cargar/recargar la página). |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `supported` | `boolean` | El navegador soporta la Service Worker API (`"serviceWorker" in navigator`). |
| `registered` | `boolean` | El registro se completó con éxito. |
| `updateAvailable` | `boolean` | Hay una versión nueva del service worker instalada y esperando para activarse. |
| `updating` | `boolean` | `true` mientras se está aplicando la actualización (entre llamar `applyUpdate()` y que recargue la página). |
| `applyUpdate` | `() => void` | Activa la versión nueva (`postMessage({ type: "SKIP_WAITING" })` al worker en espera) y recarga la página cuando toma control. Si no hay worker esperando, recarga directamente. |
| `checkForUpdate` | `() => Promise<void>` | Fuerza una búsqueda de actualización llamando a `registration.update()`. Ignora errores (por ejemplo, sin conexión). |

## Ejemplos

### Registro automático con banner de actualización
```tsx
import { useServiceWorker } from "lib-kit-components";

function UpdateBanner() {
  const { updateAvailable, updating, applyUpdate } = useServiceWorker();
  if (!updateAvailable) return null;

  return (
    <div className="banner">
      Hay una versión nueva disponible.
      <button onClick={applyUpdate} disabled={updating}>
        {updating ? "Actualizando…" : "Actualizar ahora"}
      </button>
    </div>
  );
}
```

### Registro manual (`autoRegister: false`) con lógica propia
```tsx
function App() {
  const { supported } = useServiceWorker({ autoRegister: false });

  useEffect(() => {
    if (supported) {
      navigator.serviceWorker.register("/sw.js", { scope: "/app/" });
    }
  }, [supported]);

  return null;
}
```

### Chequeo manual periódico desde un botón
```tsx
function DebugPanel() {
  const { registered, checkForUpdate } = useServiceWorker({ checkIntervalMs: 0 });
  return (
    <button disabled={!registered} onClick={checkForUpdate}>
      Buscar actualización ahora
    </button>
  );
}
```

## Notas y comportamiento

- Tu `sw.js` **debe** implementar el lado del contrato de `applyUpdate`, escuchando el mensaje `SKIP_WAITING`:
  ```js
  self.addEventListener("message", (e) => {
    if (e.data?.type === "SKIP_WAITING") self.skipWaiting();
  });
  ```
  Sin esto, `applyUpdate()` manda el mensaje pero el worker nuevo nunca toma control por esa vía; el hook tiene un fallback de recarga a los 2.5s por si `controllerchange` no llega a dispararse, pero eso no reemplaza tener `skipWaiting()` implementado.
- Todas las APIs usadas (Service Worker API) son exclusivamente de navegador y requieren **HTTPS o `localhost`** — en HTTP simple `"serviceWorker" in navigator` puede no estar disponible.
- SSR-safe: el efecto entero está guardado detrás de `typeof navigator === "undefined" || !("serviceWorker" in navigator)`, así que en el servidor no hace nada y todos los valores devueltos parten en `false`.
- El registro que ya estaba "esperando" (`registration.waiting`) sólo se marca como `updateAvailable` si además ya hay un `navigator.serviceWorker.controller` — es decir, si la página ya estaba siendo controlada por un service worker previo. En el primer registro de la vida de la app (sin controller previo) no se marca como "actualización disponible", porque no lo es: es la primera instalación.
- Cuando el nuevo service worker toma control (`controllerchange`), el hook fuerza **una única** recarga de página (con un flag interno para evitar loops si el evento se dispara más de una vez).
- `checkForUpdate`/el intervalo periódico llaman a `registration.update()`, que además está sujeto a las reglas propias del navegador (por ejemplo, algunos navegadores no vuelven a bajar el `sw.js` si el archivo es byte-a-byte idéntico al ya cacheado, o limitan la frecuencia real de chequeo).
