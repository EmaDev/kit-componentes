# TabsGlow

> Tabs con pastilla flotante que se estira/comprime con overshoot elástico ("efecto líquido") y un resplandor (glow) de color primario alrededor del tab activo.

**Import**
```tsx
import { TabsGlow, type TabsGlowSize } from "lib-kit-components";
```

## Cuándo usarlo

Para una navegación por pestañas compacta (2-5 opciones) que necesita destacar visualmente cuál está activa con un efecto llamativo, tipo selector de vista o toggle de período ("Día / Semana / Mes") en un header o toolbar. La pastilla que se desliza entre tabs con spring y el glow de sombra alrededor del tab activo la hacen ideal para lugares donde el tono general de la UI ya es minimalista y este control necesita ser el punto de atención.

## Cuándo NO usarlo / alternativas

- Si necesitás alguna de las variantes visuales clásicas (`underline`, `segmented`, `enclosed`, `vertical`) o las opciones `fitted`/`scrollable` para muchos tabs, usá [Tabs](Tabs.md) — `TabsGlow` sólo tiene un estilo (pastilla) y una prop de tamaño, sin variantes.
- Si el contenido detrás de cada tab tiene sentido navegarlo de forma direccional (deslizamiento horizontal según hacia dónde se mueve el usuario), usá [TabsCarousel](TabsCarousel.md) en vez de `TabsGlow`, cuyo crossfade de panel no tiene noción de dirección.
- Si cada tab es principalmente un ícono con una etiqueta corta debajo (estilo dock/bottom nav de escritorio), usá [TabsDock](TabsDock.md).
- Si las pestañas representan rutas distintas de la app, usá `Navbar`/`SideBar`/`BottomNav` en vez de cualquiera de las variantes de Tabs.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `items` | `TabItem[]` | — (requerido) | Pestañas a mostrar (mismo tipo `TabItem` que usa [Tabs](Tabs.md): `id`, `label`, `icon?`, `badge?`, `disabled?`). |
| `value` | `string` | — (requerido) | `id` del tab activo. Componente **controlado**: no hay modo no controlado. |
| `onChange` | `(id: string) => void` | — (requerido) | Se llama al seleccionar un tab (click o flechas de teclado). |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Alto/tipografía/padding de la pastilla y de cada tab. |
| `panels` | `Record<string, ReactNode>` | `undefined` | Si se pasa, renderiza el panel correspondiente a `value` debajo de la lista, con crossfade + escala sutil al cambiar. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Tipos exportados

```ts
type TabsGlowSize = "sm" | "md" | "lg";
```

`TabsGlow` reutiliza el tipo `TabItem` exportado por `Tabs.tsx` (ver [Tabs.md](Tabs.md)) para su prop `items`; no declara un tipo de item propio.

## Ejemplos

### Uso básico
```tsx
const [tab, setTab] = useState("dia");

<TabsGlow
  items={[
    { id: "dia", label: "Día" },
    { id: "semana", label: "Semana" },
    { id: "mes", label: "Mes" },
  ]}
  value={tab}
  onChange={setTab}
/>
```

### Con paneles y tamaño chico
```tsx
<TabsGlow
  items={items}
  value={tab}
  onChange={setTab}
  size="sm"
  panels={{
    dia: <VistaDiaria />,
    semana: <VistaSemanal />,
    mes: <VistaMensual />,
  }}
/>
```

### Con badge y un tab deshabilitado
```tsx
<TabsGlow
  items={[
    { id: "todo", label: "Todo", badge: 8 },
    { id: "activos", label: "Activos" },
    { id: "archivados", label: "Archivados", disabled: true },
  ]}
  value={tab}
  onChange={setTab}
/>
```

## Requisitos / dependencias

- Usa `framer-motion` (`motion.span` con `layoutId="tabs-glow-pill"` para la pastilla animada, `AnimatePresence` con `mode="wait"` para el crossfade de paneles).
- Marcado como `"use client"`.
- Importa el tipo `TabItem` desde `./Tabs` (`import type { TabItem } from "./Tabs"`): es un import sólo de tipos (se borra en compilación), pero requiere que `Tabs.tsx` exista en el paquete.
- No depende de Next.js.

## Notas y comportamiento

- Es **completamente controlado**: siempre hay que pasar `value` + `onChange`, igual que `Tabs`.
- El indicador (pastilla) usa `layoutId="tabs-glow-pill"` fijo — si montás dos `TabsGlow` en la misma pantalla, Framer Motion puede animar la pastilla como si fuera compartida entre ambos, generando un salto visual; en ese caso usá `key` distintas en cada instancia o evitá tener dos montados a la vez.
- Navegación por teclado: con foco en la lista (`role="tablist"`), `←`/`→` mueven la selección entre tabs **no deshabilitados** (no hay soporte de `↑`/`↓`, a diferencia de `Tabs` en `variant="vertical"`). El roving tabindex está implementado (`tabIndex={active ? 0 : -1}`).
- No tiene variantes visuales, ni `fitted` ni `scrollable`: es un único estilo de pastilla flotante con un solo control de tamaño (`size`).
- El badge cambia de estilo según el estado activo (`bg-white/25` sobre la pastilla activa vs. `bg-surface` con borde cuando el tab no está activo).
- El contenedor de paneles no asocia explícitamente `role="tabpanel"`/`aria-controls` con los tabs — sólo los botones tienen `role="tab"` y `aria-selected`.
- `panels` es opcional: sin él, `TabsGlow` sólo renderiza la lista de pestañas y el contenido según `value` queda a cargo del consumidor.
