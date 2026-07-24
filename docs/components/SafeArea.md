# SafeArea

> Contenedor (y espaciador) que respeta las safe areas del dispositivo (notch, dynamic island, home indicator) y, opcionalmente, el teclado virtual.

**Import**
```tsx
import { SafeArea, SafeAreaSpacer } from "lib-kit-components";
```

## Cuándo usarlo

Usalo en cualquier elemento que deba quedar dentro del área segura de la pantalla en dispositivos con notch/dynamic island/home indicator (headers fijos, footers fijos, barras de navegación) — o que deba correrse cuando aparece el teclado virtual (barras de acción, inputs de chat fijos abajo). `SafeAreaSpacer` es la versión mínima: un div invisible del tamaño exacto de una inset, útil al final de una lista scrolleable para que el último ítem no quede tapado por el home indicator.

## Cuándo NO usarlo / alternativas

- Si necesitás además los bloqueos de zoom/overscroll/long-press y la altura real del viewport (no sólo el padding de safe area), usá `NativeShell` como raíz, que ya incluye `useSafeArea` internamente junto con el resto.
- Para casos muy simples de CSS puro, las CSS vars `--sa-top`/`--sa-right`/`--sa-bottom`/`--sa-left` (publicadas por `useSafeArea`, que este componente usa internamente) también se pueden consumir directo en CSS sin pasar por este componente.

## Props

### `SafeArea`

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `children` | `ReactNode` | — | Contenido del contenedor. |
| `edges` | `Edge[] \| "all" \| "none"` | `"all"` | Qué bordes respetar (`"top" \| "right" \| "bottom" \| "left"`), como array, o `"all"`/`"none"`. |
| `gutter` | `number` | `0` | Px extra sumados a la inset de cada borde aplicado (ej. `gutter={12}` agrega 12px por encima de la inset real). |
| `asMargin` | `boolean` | `false` | Aplica las insets como `margin` en vez de `padding`. |
| `avoidKeyboard` | `boolean` | `false` | Suma la altura del teclado virtual al borde inferior (útil para barras fijas que deben subir con el teclado). |
| `fillViewport` | `boolean` | `false` | Aplica `minHeight: "var(--app-height, 100dvh)"` — ocupa la altura real del viewport (usa `--app-height` si `useImmersive`/`NativeShell` la publica). |
| `as` | `"div" \| "header" \| "footer" \| "main" \| "section" \| "nav"` | `"div"` | Tag HTML del contenedor. |
| `className` | `string` | — | Clases CSS adicionales. |
| `style` | `CSSProperties` | — | Estilos inline adicionales (se mergean después de los calculados). |

### `SafeAreaSpacer`

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `edge` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Borde cuya inset se usa como tamaño del espaciador. |
| `min` | `number` | `0` | Tamaño mínimo en px, aunque el dispositivo no reporte inset (`Math.max(sa[edge], min)`). |
| `className` | `string` | — | Clases CSS adicionales. |

## Ejemplos

### Header que respeta el notch, con gutter extra
```tsx
<SafeArea edges={["top"]} gutter={12} as="header">
  <AppHeader />
</SafeArea>
```

### Footer fijo que sube con el teclado
```tsx
<SafeArea edges={["bottom"]} avoidKeyboard as="footer">
  <ChatInputBar />
</SafeArea>
```

### Contenedor de pantalla completa con todos los bordes
```tsx
<SafeArea edges="all" fillViewport>
  <ScreenContent />
</SafeArea>
```

### Espaciador al final de una lista scrolleable
```tsx
<div className="overflow-y-auto">
  {items.map((it) => <Item key={it.id} {...it} />)}
  <SafeAreaSpacer edge="bottom" min={16} />
</div>
```

## Requisitos / dependencias

- Usa los hooks `useSafeArea` (lee `env(safe-area-inset-*)` vía un elemento sonda y las publica como CSS vars `--sa-top`/`--sa-right`/`--sa-bottom`/`--sa-left`) y `useKeyboardInset` (Visual Viewport API) para `avoidKeyboard`.
- `fillViewport` depende de la CSS var `--app-height`, que sólo se publica si `useImmersive` (directamente o vía `NativeShell`) está montado en algún punto de la app; si no está publicada, cae al fallback `100dvh`.
- En navegadores sin soporte de `env(safe-area-inset-*)` (la mayoría de desktop) las insets son `0`, por lo que `SafeArea` no agrega padding/margin extra más allá de `gutter` — el comportamiento en desktop es esencialmente transparente.

## Notas y comportamiento

- Las insets se recalculan reactivamente al rotar el dispositivo, al cambiar el tamaño de ventana y cuando el navegador esconde/muestra su propia barra de direcciones (vía el hook `useSafeArea`).
- Cuando `avoidKeyboard` es `true`, el padding/margin inferior es `sa.bottom + gutter + kb.inset`, y se anima con una transición CSS (`transition: "padding-bottom 0.22s cubic-bezier(0.16,1,0.3,1)"`) para que la barra suba suavemente en vez de saltar.
- `SafeAreaSpacer` es puramente `aria-hidden` — no tiene contenido ni rol semántico, es sólo espaciado.
- Si `edge` en `SafeAreaSpacer` es `"left"` o `"right"`, el espaciador usa `width` en vez de `height` (pensado también para listas horizontales).
- No aplica animaciones de framer-motion — es un componente puramente de layout con CSS.
