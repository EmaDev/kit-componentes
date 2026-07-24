# useSplash

> Controla el ciclo de vida de una pantalla de splash: espera fuentes/promesas custom, garantiza una duración mínima, y expone el progreso para animar la UI.

**Import**
```ts
import { useSplash } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando necesitás tu propia UI de splash (animación custom, branding específico) en vez del componente `SplashScreen` prearmado, que usa este hook internamente. Es el hook indicado para coordinar cuándo desaparece el splash con condiciones reales de carga: fuentes listas, una sesión resuelta, el primer fetch de datos críticos — en vez de un simple `setTimeout` fijo, evitando tanto un flash demasiado corto como quedarte mostrando el splash de más si todo cargó rápido.

## Firma

```ts
function useSplash(options?: {
  minDuration?: number;
  until?: () => Promise<unknown>;
  waitForFonts?: boolean;
  oncePerSession?: boolean;
  storageKey?: string;
}): {
  visible: boolean;
  progress: number;
  hide: () => void;
}
```

## Opciones (parámetros)

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `minDuration` | `number` | `1400` | ms mínimos que se muestra el splash, aunque todo lo demás resuelva antes (evita un flash molesto). |
| `until` | `() => Promise<unknown>` | `undefined` | Promesa adicional a esperar antes de ocultar (por ejemplo, resolver la sesión o el primer fetch). Si se omite, sólo se respeta `minDuration` (+ fuentes, si `waitForFonts`). |
| `waitForFonts` | `boolean` | `true` | Además de `minDuration`, espera a `document.fonts.ready` antes de ocultar. |
| `oncePerSession` | `boolean` | `false` | Si es `true`, sólo se muestra una vez por sesión de pestaña (usa `sessionStorage`); en visitas subsiguientes dentro de la misma sesión, `visible` arranca en `false`. |
| `storageKey` | `string` | `"splash-shown"` | Clave de `sessionStorage` usada por `oncePerSession`. |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `visible` | `boolean` | El splash debe estar visible. |
| `progress` | `number` | De `0` a `1`, progreso estimado **basado únicamente en el tiempo transcurrido sobre `minDuration`** (no refleja el progreso real de `until` ni de la carga de fuentes). |
| `hide` | `() => void` | Oculta el splash manualmente de inmediato, sin esperar a que resuelvan las promesas pendientes (por ejemplo, para un botón "Saltar"). |

## Ejemplos

### Uso básico (sólo duración mínima + fuentes)
```tsx
import { useSplash } from "lib-kit-components";

function App({ children }: { children: React.ReactNode }) {
  const { visible, progress } = useSplash({ minDuration: 1200 });

  if (visible) return <SplashUI progress={progress} />;
  return <>{children}</>;
}
```

### Esperar una condición real (sesión resuelta)
```tsx
function App({ children }: { children: React.ReactNode }) {
  const { visible } = useSplash({
    minDuration: 1000,
    until: () => fetchSession(), // se espera aunque tarde más que minDuration
  });

  if (visible) return <SplashScreenBrand />;
  return <>{children}</>;
}
```

### Una sola vez por sesión, con botón de saltar
```tsx
function App({ children }: { children: React.ReactNode }) {
  const { visible, hide } = useSplash({ oncePerSession: true, minDuration: 1600 });

  if (!visible) return <>{children}</>;
  return (
    <div>
      <SplashUI />
      <button onClick={hide}>Saltar</button>
    </div>
  );
}
```

## Notas y comportamiento

- El splash se oculta cuando **todas** estas condiciones resuelven: el `setTimeout(minDuration)`, `document.fonts.ready` (si `waitForFonts` y el navegador lo soporta), y `until()` (si se pasó). Tanto `until()` como `document.fonts.ready` están envueltos en `.catch(() => {})`: si cualquiera de esas promesas **rechaza**, el hook lo ignora y deja que el splash se oculte igual, como si hubiera resuelto con éxito — un `until` que falla nunca deja el splash trabado para siempre.
- `progress` es puramente temporal: llega a `1` apenas pasa `minDuration`, **incluso si `until()` todavía no resolvió**. No lo uses como indicador real de "carga completa"; es sólo para animar una barra de progreso o un spinner durante la ventana mínima.
- No hay una función `show()` expuesta: una vez que `visible` pasa a `false` (por resolución natural o por `hide()`), no vuelve a ponerse en `true` desde este mismo hook — haría falta desmontar/remontar el componente que lo usa.
- **Gotcha con `oncePerSession` e hidratación**: el estado inicial de `visible` se calcula en el inicializador de `useState`. Si `oncePerSession` es `false` (el default), siempre parte en `true` en cualquier entorno, sin problema. Pero si `oncePerSession: true`, el inicializador intenta leer `sessionStorage` **directamente durante el render** (`typeof sessionStorage === "undefined" ? true : sessionStorage.getItem(storageKey) !== "1"`). En el servidor, `sessionStorage` no existe, así que siempre da `true`. En el cliente, si ya pasaste por el splash antes en esa misma sesión de pestaña (por ejemplo, navegaste a otra página con un layout que remonta este hook, o recargaste dentro de la misma sesión), `sessionStorage` **sí** existe y ya devuelve `false` desde el primer render del cliente — lo que puede producir un mismatch de hidratación entre el `true` que renderizó el servidor y el `false` que calcula el cliente en su primera pasada. Si vas a usar `oncePerSession: true` en un componente que se renderiza en servidor (Next.js App Router con SSR), considerá envolver su uso en un componente que sólo se monte tras la hidratación, o aceptar el warning puntual de mismatch (se autocorrige en el siguiente render sin romper la app).
- Requiere que `document.fonts` exista para `waitForFonts` (CSS Font Loading API); si no existe, esa parte del `Promise.all` simplemente no se agrega — no rompe en navegadores sin soporte.
