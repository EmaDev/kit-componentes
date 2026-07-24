# useKeyboardInset

> Detecta cuánto espacio ocupa el teclado virtual sobre el viewport, usando la Visual Viewport API, para que una barra fija no quede tapada.

**Import**
```ts
import { useKeyboardInset } from "lib-kit-components";
```

## Cuándo usarlo

Usalo en cualquier pantalla con un input fijo abajo (chat, buscador, formulario con CTA sticky) donde el teclado virtual en mobile puede tapar el contenido. No hay un componente de alto nivel que envuelva este hook — es de uso directo, normalmente combinado con `useSafeArea` para sumar el inset del teclado al de la safe area inferior.

## Firma

```ts
function useKeyboardInset(options?: {
  publishCssVar?: boolean;
  threshold?: number;
}): {
  inset: number;
  open: boolean;
}
```

## Opciones (parámetros)

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `publishCssVar` | `boolean` | `true` | Publica la altura del teclado en la CSS var `--kb-inset` (px) sobre `<html>`, para poder mover barras fijas desde CSS sin leer el valor en JS. |
| `threshold` | `number` | `120` | px mínimos que tiene que ocupar el "hidden" del viewport para considerar que el teclado está efectivamente abierto (evita falsos positivos por jitter menor de la UI del navegador). |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `inset` | `number` | Altura en px que el teclado (u otro elemento de chrome del navegador) ocupa sobre el viewport visual. |
| `open` | `boolean` | `inset > threshold`. |

## Ejemplos

### Barra de input de chat que sube con el teclado
```tsx
import { useKeyboardInset } from "lib-kit-components";

function ChatInputBar() {
  const { inset } = useKeyboardInset();
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, paddingBottom: inset }}>
      <input placeholder="Escribí un mensaje…" />
    </div>
  );
}
```

### Ocultar una CTA sticky mientras el teclado está abierto
```tsx
function CtaBar() {
  const { open } = useKeyboardInset();
  if (open) return null; // dejamos lugar libre para el teclado
  return <button className="fixed bottom-4 inset-x-4">Continuar</button>;
}
```

### Combinado con safe area, vía CSS vars (sin leer el valor en JS)
```tsx
function RootLayout({ children }: { children: React.ReactNode }) {
  useKeyboardInset(); // sólo para publicar --kb-inset
  useSafeArea();      // sólo para publicar --sa-*
  return <body>{children}</body>;
}
// en cualquier hijo:
// <div className="fixed bottom-0 pb-[calc(var(--kb-inset)+var(--sa-bottom))]" />
```

## Notas y comportamiento

- Depende enteramente de `window.visualViewport`. Si el navegador no la soporta, el hook **no hace nada** (el `useEffect` retorna apenas detecta `!vv`): `inset` queda fijo en `0` y `open` en `false` para siempre, sin errores.
- El cálculo es `max(0, innerHeight - visualViewport.height - visualViewport.offsetTop)`: mide cualquier reducción del viewport visual respecto de la ventana completa, no un evento dedicado de "teclado abierto/cerrado" — en la práctica, la causa dominante de esa diferencia en mobile es el teclado virtual, pero técnicamente también podría reflejar otros cambios de chrome del navegador.
- Escucha tanto `resize` como `scroll` de `visualViewport`: el evento `scroll` es necesario porque en algunos navegadores mobile el viewport visual se **desplaza** (no sólo se achica) cuando aparece el teclado y el contenido hace scroll para mantener el foco visible.
- `publishCssVar` resetea explícitamente `--kb-inset` a `"0px"` en la función de limpieza al desmontar (si estaba activado), para no dejar una CSS var "pegada" con un valor viejo.
- SSR-safe: el estado inicial es `0` fijo vía `useState`, sin lectura de APIs de navegador durante el render; toda la detección ocurre en el `useEffect`, así que no hay riesgo de mismatch de hidratación.
- Soportado en iOS Safari 13+ y en Chrome para Android; no disponible en algunos navegadores desktop más viejos (donde, como se explicó arriba, simplemente no hace nada).
