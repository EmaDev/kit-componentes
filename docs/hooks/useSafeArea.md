# useSafeArea

> Lee las safe areas del dispositivo (notch, dynamic island, home indicator) de forma reactiva y las publica como CSS vars en `<html>`.

**Import**
```ts
import { useSafeArea, type SafeAreaInsets } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando necesités los valores de safe area en JavaScript (para cálculos, animaciones, o pasar `padding` inline) en vez de sólo tener el layout ya resuelto por el componente `SafeArea`/`SafeAreaSpacer`, que usan este hook internamente. También es útil si sólo querés publicar las CSS vars (`--sa-top`, etc.) una vez arriba del árbol y consumirlas después con `calc()` en CSS/Tailwind arbitrario, sin tener que leer el valor en JS en cada componente.

## Firma

```ts
function useSafeArea(options?: {
  publishCssVars?: boolean;
  fallback?: number;
}): SafeAreaInsets & {
  hasInsets: boolean;
  padding: { paddingTop: number; paddingRight: number; paddingBottom: number; paddingLeft: number };
  orientation: "portrait" | "landscape";
}
```

`SafeAreaInsets = { top: number; right: number; bottom: number; left: number }` (tipo exportado).

## Opciones (parámetros)

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `publishCssVars` | `boolean` | `true` | Publica las insets como CSS vars en `<html>` (`--sa-top`, `--sa-right`, `--sa-bottom`, `--sa-left`) para poder usarlas en CSS plano sin repetir `env()` en cada regla. |
| `fallback` | `number` | `0` | Mínimo en px a aplicar por lado cuando el dispositivo no reporta insets (por ejemplo, para reservar igual algo de espacio arriba en Android aunque no tenga notch). Se aplica como `Math.max(inset_real, fallback)` por cada lado. |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `top`, `right`, `bottom`, `left` | `number` | Insets en px, ya con `fallback` aplicado. |
| `hasInsets` | `boolean` | `true` si algún lado es mayor a 0 (**calculado sobre los valores ya ajustados por `fallback`**: si pasaste un `fallback` > 0, `hasInsets` va a dar `true` siempre, aunque el dispositivo no tenga safe area real). |
| `padding` | `{ paddingTop, paddingRight, paddingBottom, paddingLeft }` | Los mismos valores, ya con las claves listas para pasar directo a `style={{ ...padding }}`. |
| `orientation` | `"portrait" \| "landscape"` | Orientación actual, calculada comparando `innerHeight >= innerWidth`. |

## Ejemplos

### Padding de header/footer
```tsx
import { useSafeArea } from "lib-kit-components";

function Header() {
  const sa = useSafeArea();
  return <header style={{ paddingTop: sa.top + 12 }}>...</header>;
}
```

### CSS vars en Tailwind, sin leer el valor en JS
```tsx
function RootLayout({ children }: { children: React.ReactNode }) {
  useSafeArea(); // sólo para publicar --sa-* en <html>; no usamos el valor de retorno acá
  return <body>{children}</body>;
}

// en cualquier componente hijo, sin necesidad del hook:
// <div className="pt-[calc(var(--sa-top)+12px)]" />
```

### Mínimo garantizado con `fallback`
```tsx
function BottomBar() {
  const { bottom, padding } = useSafeArea({ fallback: 12 }); // siempre al menos 12px, incluso en Android sin gesture bar
  return <nav style={{ paddingBottom: padding.paddingBottom }}>...</nav>;
}
```

## Notas y comportamiento

- **SSR-safe sin gotchas**: a diferencia de `usePlatform`/`useSplash`, el estado inicial es literalmente `{ top: 0, right: 0, bottom: 0, left: 0 }` fijo (no hay inicializador perezoso que llame a `measure()` durante el render). Los valores reales sólo se calculan dentro de un `useEffect`, así que el primer render del servidor y el primer render del cliente coinciden siempre — no hay riesgo de mismatch de hidratación en absoluto.
- La lectura real usa un `<div>` temporal invisible con `top:env(safe-area-inset-top,0px)` (y análogos) insertado en `document.documentElement`, del cual se lee el `getComputedStyle` resultante — es la única forma de acceder a `env()` desde JavaScript, ya que no hay una API directa para eso.
- Se recalcula automáticamente en `resize`, `orientationchange`, y en el evento `resize` de `visualViewport` (cubre cambios por aparición/desaparición de la barra de direcciones del navegador en mobile).
- Requiere `viewport-fit=cover` en el `<meta name="viewport">` de la página para que el navegador realmente reporte insets distintos de cero — sin eso, `env(safe-area-inset-*)` siempre devuelve `0px` aunque el dispositivo tenga notch.
- El campo `orientation` es una heurística simple (comparar alto vs. ancho de ventana), no usa la Screen Orientation API.
