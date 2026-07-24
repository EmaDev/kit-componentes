# useStatusBarColor

> Sincroniza el `<meta name="theme-color">` de la página, que es lo que tiñe la barra de estado en Android y la barra superior de la PWA instalada en iOS.

**Import**
```ts
import { useStatusBarColor } from "lib-kit-components";
```

## Cuándo usarlo

Llamalo por pantalla/ruta para que el "chrome" del sistema (barra de estado en Android, barra superior en la PWA instalada de iOS) siga el color del header de esa pantalla en particular — por ejemplo, un color distinto para una pantalla de detalle con imagen de fondo vs. el resto de la app. No hay un componente de alto nivel que lo envuelva — es de uso directo, y está pensado para llamarse muchas veces en distintos puntos de la app (una vez por pantalla), no una sola vez global.

## Firma

```ts
function useStatusBarColor(color: string | { light: string; dark: string }): void
```

Este hook no devuelve nada: es un hook de efecto puro (side-effect only).

## Opciones (parámetros)

No recibe un objeto de opciones, sino un único parámetro posicional obligatorio.

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `color` | `string \| { light: string; dark: string }` | — (requerido) | Un color fijo (`"#0f172a"`), o un par `{ light, dark }` para que el navegador elija automáticamente según `prefers-color-scheme` del sistema operativo. |

## Valor de retorno

Ninguno — no hay tabla de retorno.

## Ejemplos

### Color fijo
```tsx
import { useStatusBarColor } from "lib-kit-components";

function ProductPage() {
  useStatusBarColor("#0f172a");
  return <div>...</div>;
}
```

### Según el tema del sistema (claro/oscuro)
```tsx
function RootLayout({ children }: { children: React.ReactNode }) {
  useStatusBarColor({ light: "#ffffff", dark: "#0f172a" });
  return <>{children}</>;
}
```

### Color dinámico por pantalla, memoizado
```tsx
function ArticlePage({ heroColor }: { heroColor: string }) {
  // memoizar evita reaplicar el meta tag en cada render del componente
  const color = useMemo(() => heroColor, [heroColor]);
  useStatusBarColor(color);
  return <article>...</article>;
}
```

## Notas y comportamiento

- Si pasás un color fijo (`string`), el hook busca/crea un único `<meta name="theme-color">` **sin** atributo `media`. Si pasás `{ light, dark }`, crea/actualiza **dos** meta tags separados, cada uno con `media="(prefers-color-scheme: light|dark)"` — así el sistema operativo elige el que corresponde sin necesidad de que tu JS reaccione a cambios de tema.
- Al desmontar (o cuando cambia `color`), cada meta tag que el hook **creó** se elimina por completo; los que **ya existían** en el documento antes de montar el hook recuperan su `content` original. Esto permite anidar llamadas en distintas pantallas: al navegar fuera de una pantalla, el color vuelve al de la pantalla/anterior que lo haya seteado.
- El efecto se re-ejecuta cada vez que cambia la referencia de `color` (dependencia `[color]`). **Si pasás un objeto `{ light, dark }` literal inline** (`useStatusBarColor({ light: "#fff", dark: "#000" })`), se crea un objeto nuevo en cada render del componente que lo llama, lo que hace que el efecto se destruya y reconstruya (quite y vuelva a poner los meta tags) en **cada re-render**, no sólo cuando el color realmente cambia. Si el componente re-renderiza seguido, memoizá el objeto (`useMemo`, o definilo como constante fuera del componente) para evitar esas mutaciones de DOM innecesarias.
- Sólo reacciona al modo claro/oscuro **del sistema operativo** vía `prefers-color-scheme` (usando la variante `{ light, dark }`). Si tu app implementa un dark mode manual (por ejemplo, una clase `.dark` en `<html>` controlada por el usuario, independiente del SO), esa variante no lo va a detectar — en ese caso pasá un `color` como `string` simple, recalculado por vos mismo cuando cambie el estado de tema de tu app.
- El `theme-color` sólo tiene efecto visual real en Android (Chrome y navegadores basados en Chromium) y en la PWA de iOS ya instalada en la pantalla de inicio; en una pestaña normal de Safari en iOS no tiñe nada.
- SSR-safe: el efecto está guardado con `typeof document === "undefined"`, así que no hace nada en el servidor.
