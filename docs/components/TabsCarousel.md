# TabsCarousel

> Tabs minimalistas con una línea corta centrada que crece con spring bajo el tab activo, y paneles que se deslizan horizontalmente en la dirección hacia la que se navega, como un carrusel.

**Import**
```tsx
import { TabsCarousel, type TabsCarouselSize } from "lib-kit-components";
```

## Cuándo usarlo

Para secciones de contenido con un orden implícito donde tiene sentido que el panel se deslice hacia la izquierda o la derecha según hacia dónde navega el usuario (ej. pasos de un detalle de producto, secciones de un perfil en orden "Info / Actividad / Historial", o cualquier flujo con progresión). El estilo es minimalista (línea corta bajo el tab activo, sin fondo ni pastilla), pensado para toolbars o headers donde no querés un elemento visual pesado.

## Cuándo NO usarlo / alternativas

- Si el orden de las pestañas no importa (son categorías sin relación direccional entre sí), el efecto de deslizamiento puede confundir más que ayudar — usá [Tabs](Tabs.md) con crossfade simple en su lugar.
- Si necesitás alguna de las variantes visuales de `Tabs` (`pill`, `segmented`, `enclosed`, `vertical`) o las opciones `fitted`/`scrollable`, usá [Tabs](Tabs.md) directamente.
- Si buscás una pastilla flotante con glow en vez de una línea minimalista, usá [TabsGlow](TabsGlow.md).
- Si cada tab es principalmente un ícono con etiqueta corta debajo (estilo dock), usá [TabsDock](TabsDock.md).
- Para navegar una secuencia de **imágenes** (galería), seguí usando `Carousel`, no `TabsCarousel` — a pesar del nombre, este componente es una variante de `Tabs`, no del carrusel de imágenes.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `items` | `TabItem[]` | — (requerido) | Pestañas a mostrar (mismo tipo `TabItem` que usa [Tabs](Tabs.md): `id`, `label`, `icon?`, `badge?`, `disabled?`). |
| `value` | `string` | — (requerido) | `id` del tab activo. Componente **controlado**: no hay modo no controlado. |
| `onChange` | `(id: string) => void` | — (requerido) | Se llama al seleccionar un tab (click o flechas de teclado). |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Alto/tipografía de la fila de tabs. |
| `panels` | `Record<string, ReactNode>` | `undefined` | Si se pasa, renderiza el panel de `value` debajo de la lista, deslizándose horizontalmente en la dirección del cambio (hacia la derecha si el nuevo índice es mayor, hacia la izquierda si es menor). |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Tipos exportados

```ts
type TabsCarouselSize = "sm" | "md" | "lg";
```

`TabsCarousel` reutiliza el tipo `TabItem` exportado por `Tabs.tsx` (ver [Tabs.md](Tabs.md)) para su prop `items`; no declara un tipo de item propio.

## Ejemplos

### Uso básico
```tsx
const [tab, setTab] = useState("info");

<TabsCarousel
  items={[
    { id: "info", label: "Info" },
    { id: "actividad", label: "Actividad" },
    { id: "historial", label: "Historial" },
  ]}
  value={tab}
  onChange={setTab}
/>
```

### Con paneles que se deslizan
```tsx
<TabsCarousel
  items={items}
  value={tab}
  onChange={setTab}
  panels={{
    info: <Info />,
    actividad: <Actividad />,
    historial: <Historial />,
  }}
/>
```

### Íconos, badge y un tab deshabilitado
```tsx
<TabsCarousel
  items={[
    { id: "bandeja", label: "Bandeja", icon: <InboxIcon />, badge: 5 },
    { id: "enviados", label: "Enviados", icon: <SendIcon /> },
    { id: "papelera", label: "Papelera", disabled: true },
  ]}
  value={tab}
  onChange={setTab}
  size="lg"
/>
```

## Requisitos / dependencias

- Usa `framer-motion` (`motion.span` con `layoutId="tabs-carousel-line"` para la línea animada bajo el tab activo, `AnimatePresence` con `mode="wait"` para el deslizamiento de paneles).
- Usa `useRef` de React para recordar el índice previo del tab activo y calcular la dirección del deslizamiento.
- Marcado como `"use client"`.
- Importa el tipo `TabItem` desde `./Tabs` (`import type { TabItem } from "./Tabs"`): es un import sólo de tipos, pero requiere que `Tabs.tsx` exista en el paquete.
- No depende de Next.js.

## Notas y comportamiento

- Es **completamente controlado**: siempre hay que pasar `value` + `onChange`.
- La dirección del deslizamiento se calcula comparando el **índice** del tab activo actual dentro de `items` contra el índice previo (guardado en un `useRef`), no contra el historial de interacción del usuario — es decir, saltar directamente del primer al último tab anima hacia la derecha (índice mayor), sin importar cómo se llegó ahí.
- Si `items` cambia de orden dinámicamente entre renders, el cálculo de dirección puede no coincidir con la posición visual esperada, ya que se basa puramente en el índice dentro del arreglo actual.
- El contenedor de paneles tiene `overflow-hidden`, necesario para que el desplazamiento horizontal (`x: dir * 28` al entrar/salir) no genere scroll lateral en la página.
- La línea indicadora (`tabs-carousel-line`) tiene ancho fijo (`w-8`) centrado bajo el botón, independientemente del largo de la etiqueta.
- El indicador usa `layoutId="tabs-carousel-line"` fijo — igual que en `Tabs` y `TabsGlow`, montar dos `TabsCarousel` a la vez en la misma pantalla puede hacer que Framer Motion anime la línea como si fuera compartida entre ambos.
- Navegación por teclado: con foco en la lista (`role="tablist"`), `←`/`→` mueven la selección entre tabs **no deshabilitados** (sin soporte de `↑`/`↓`). Roving tabindex implementado (`tabIndex={active ? 0 : -1}`).
- `panels` es opcional: sin él, sólo se renderiza la fila de tabs.
