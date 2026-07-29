# TabsDock

> Tabs estilo dock: íconos que se agrandan con un rebote elástico al activarse (y un poco más al pasar el mouse), con un punto animado debajo del tab activo. Pensado para navegación con ícono + etiqueta corta, ej. un bottom nav de escritorio.

**Import**
```tsx
import { TabsDock } from "lib-kit-components";
```

## Cuándo usarlo

Para una navegación compacta donde cada opción se identifica principalmente por su ícono, con una etiqueta corta debajo (una o dos palabras), y querés el feedback físico de un dock (rebote elástico al activar/hover). Encaja bien como barra de accesos rápidos en escritorio (tipo dock de macOS) o como alternativa visual a un bottom nav dentro de una sección de la app, cuando cada tab tiene un ícono claro y distintivo.

## Cuándo NO usarlo / alternativas

- Si tus tabs son principalmente texto sin ícono, no uses `TabsDock` — su layout (ícono grande + etiqueta chica debajo) está pensado para íconos; usá [Tabs](Tabs.md), [TabsGlow](TabsGlow.md) o [TabsCarousel](TabsCarousel.md) en su lugar.
- Si las "pestañas" representan la navegación estructural real de la app entre rutas (con URL propia) en la parte inferior de una pantalla mobile, usá `BottomNav` (basado en `next/link`), no `TabsDock`, que no cambia la URL por sí solo.
- Si necesitás controlar el color/tono del badge o no querés que sea siempre rojo (`bg-danger`), evaluá `Tabs` o `TabsGlow`, cuyo badge no está fijado a un color de "alerta".
- Si buscás una pastilla flotante con glow y texto, usá [TabsGlow](TabsGlow.md); si buscás una línea minimalista con paneles que se deslizan, usá [TabsCarousel](TabsCarousel.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `items` | `TabItem[]` | — (requerido) | Pestañas a mostrar (mismo tipo `TabItem` que usa [Tabs](Tabs.md): `id`, `label`, `icon?`, `badge?`, `disabled?`). |
| `value` | `string` | — (requerido) | `id` del tab activo. Componente **controlado**: no hay modo no controlado. |
| `onChange` | `(id: string) => void` | — (requerido) | Se llama al seleccionar un tab (click o flechas de teclado). |
| `panels` | `Record<string, ReactNode>` | `undefined` | Si se pasa, renderiza el panel de `value` debajo del dock, entrando con un pequeño salto animado (spring). |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

No tiene prop `size`: el tamaño del ícono (`w-6 h-6` en reposo) y del dock es fijo.

## Tipos exportados

`TabsDock` no exporta ningún tipo propio (no tiene una prop de tamaño ni variantes). Reutiliza el tipo `TabItem` exportado por `Tabs.tsx` (ver [Tabs.md](Tabs.md)) para su prop `items`.

## Ejemplos

### Uso básico
```tsx
const [tab, setTab] = useState("inicio");

<TabsDock
  items={[
    { id: "inicio", label: "Inicio", icon: <HomeIcon /> },
    { id: "buscar", label: "Buscar", icon: <SearchIcon /> },
    { id: "perfil", label: "Perfil", icon: <UserIcon /> },
  ]}
  value={tab}
  onChange={setTab}
/>
```

### Con badge de notificaciones
```tsx
<TabsDock
  items={[
    { id: "inicio", label: "Inicio", icon: <HomeIcon /> },
    { id: "mensajes", label: "Mensajes", icon: <ChatIcon />, badge: 3 },
    { id: "ajustes", label: "Ajustes", icon: <GearIcon />, disabled: true },
  ]}
  value={tab}
  onChange={setTab}
/>
```

### Con paneles
```tsx
<TabsDock
  items={items}
  value={tab}
  onChange={setTab}
  panels={{
    inicio: <Inicio />,
    buscar: <Buscar />,
    perfil: <Perfil />,
  }}
/>
```

## Requisitos / dependencias

- Usa `framer-motion` (`motion.span` con `animate`/`whileHover`/`whileTap` para el rebote del ícono, `layoutId="tabs-dock-dot"` para el punto indicador animado, `AnimatePresence` para su entrada/salida y para la transición de paneles).
- Marcado como `"use client"`.
- Importa el tipo `TabItem` desde `./Tabs` (`import type { TabItem } from "./Tabs"`): es un import sólo de tipos, pero requiere que `Tabs.tsx` exista en el paquete.
- No depende de Next.js.

## Notas y comportamiento

- Es **completamente controlado**: siempre hay que pasar `value` + `onChange`.
- Cada botón tiene `title={item.label}` (tooltip nativo del navegador), útil si en algún layout sólo se ve el ícono, aunque en el diseño actual la etiqueta siempre se muestra debajo del ícono.
- El badge está fijado a `bg-danger` (rojo) y se posiciona `absolute -top-0.5 right-1.5` — a diferencia de `Tabs`/`TabsGlow`, no cambia de color según el estado activo ni acepta un `tone`.
- El ícono requiere estar presente en la práctica: `TabItem.icon` es opcional en el tipo, pero sin él el botón queda con un espacio vacío de `w-6 h-6` donde iría el ícono (no hay fallback textual ahí).
- El punto indicador (`tabs-dock-dot`) usa `layoutId` fijo compartido — igual que en `Tabs`, `TabsGlow` y `TabsCarousel`, montar dos `TabsDock` a la vez en la misma pantalla puede generar una animación cruzada indeseada entre ambos.
- La animación del ícono combina `scale`/`y` tanto en `animate` (según `active`) como en `whileHover`/`whileTap` (deshabilitados si `item.disabled`), con un spring de `stiffness: 500, damping: 16` — es más "elástica"/rebotona que el resto de las variantes de Tabs.
- El panel, si se pasa, entra con `y: 8, scale: 0.985 → 1` y sale con `y: -6` (sin animar `scale` de vuelta en la salida), usando `transition` tipo `spring` en vez de `duration` fija como en `TabsGlow`/`TabsCarousel`.
- Navegación por teclado: con foco en la lista (`role="tablist"`), `←`/`→` mueven la selección entre tabs **no deshabilitados** (sin soporte de `↑`/`↓`). Roving tabindex implementado (`tabIndex={active ? 0 : -1}`).
