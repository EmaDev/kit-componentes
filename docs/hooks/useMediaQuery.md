# useMediaQuery

> Media query reactiva y SSR-safe, más siete helpers ya armados para los breakpoints y preferencias más comunes (`useIsMobile`, `usePrefersDark`, etc.).

**Import**
```ts
import {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  usePrefersDark,
  usePrefersReducedMotion,
  useIsLandscape,
  useIsStandalone,
} from "lib-kit-components";
```

## Cuándo usarlo

Para lógica condicional por tamaño de pantalla u orientación dentro de un componente (no CSS puro): decidir qué componente renderizar (`SideBar` vs `BottomNav`), pausar una animación cuando `usePrefersReducedMotion()` es `true`, o cambiar el layout en `useIsLandscape()`. Para la mayoría de los casos, preferí los helpers (`useIsMobile`, etc.) antes que escribir tu propia query con `useMediaQuery` directo — son los mismos breakpoints que usa el resto de la librería.

## Cuándo NO usarlo / alternativas

- Si el cambio es puramente visual (ocultar/mostrar, cambiar tamaños), usá clases responsive de Tailwind (`sm:`, `lg:`) en vez de este hook — es más barato y no depende de JS/hidratación.
- Para form factor combinado con OS/browser/WebView, usá `usePlatform`, que ya incluye su propio `formFactor` con lógica más específica (considera touch, no sólo ancho de viewport).

## Firma

```ts
function useMediaQuery(query: string): boolean;

const useIsMobile: () => boolean;              // (max-width: 639px)
const useIsTablet: () => boolean;              // (min-width: 640px) and (max-width: 1023px)
const useIsDesktop: () => boolean;             // (min-width: 1024px)
const usePrefersDark: () => boolean;           // (prefers-color-scheme: dark)
const usePrefersReducedMotion: () => boolean;  // (prefers-reduced-motion: reduce)
const useIsLandscape: () => boolean;           // (orientation: landscape)
const useIsStandalone: () => boolean;          // (display-mode: standalone)
```

## Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `query` | `string` | Cualquier media query válida de CSS, tal cual la pasarías a `window.matchMedia`. |

## Ejemplos

### Layout condicional
```tsx
function Shell({ children }: { children: React.ReactNode }) {
  const isDesktop = useIsDesktop();
  return isDesktop ? <SideBar>{children}</SideBar> : <BottomNav>{children}</BottomNav>;
}
```

### Respetar la preferencia de menos movimiento
```tsx
function AnimatedBanner() {
  const reduceMotion = usePrefersReducedMotion();
  return <motion.div animate={reduceMotion ? {} : { x: [0, 10, 0] }} />;
}
```

### Query custom
```tsx
const isWide = useMediaQuery("(min-width: 1440px)");
```

## Notas y comportamiento

- **SSR-safe por diseño**: el estado inicial es siempre `false` (tanto en el servidor como en el primer render del cliente), y se corrige en un `useEffect` tras montar — evita mismatches de hidratación, pero significa que el primer render nunca refleja el valor real. Si necesitás evitar un "flash" del layout equivocado, gatealo con un estado de carga o aceptá el salto de un frame.
- Cada hook crea su propio `matchMedia` y escucha el evento `change` — es reactivo a cambios en vivo (redimensionar la ventana, rotar el dispositivo, cambiar el tema del sistema), no sólo una lectura puntual.
- Los helpers de breakpoint (`useIsMobile`/`useIsTablet`/`useIsDesktop`) son mutuamente excluyentes por diseño de sus rangos, pero **no reactivos entre sí** — cada uno es una instancia independiente de `useMediaQuery`, así que usar los tres juntos crea tres listeners en vez de uno compartido.
