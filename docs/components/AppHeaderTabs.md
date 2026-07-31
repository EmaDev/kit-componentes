# AppHeaderTabs

> Variante de `AppHeader` con una fila de tabs scrolables horizontalmente como parte del header: subrayado deslizante o pastillas, degradados en los bordes cuando queda contenido fuera de vista, y el tab activo siempre traído a la vista.

**Import**
```tsx
import { AppHeaderTabs } from "lib-kit-components";
```

## Cuándo usarlo

Cuando una pantalla se divide en varias vistas hermanas que el usuario alterna seguido y los tabs tienen que quedar pegados arriba junto al título — bandeja de mensajes (Todos / No leídos / Archivados), pedidos por estado, categorías de un catálogo. Es la opción correcta cuando hay **más tabs de los que entran en pantalla**: el track scrollea, muestra degradados en los bordes sólo si hay overflow real, y al cambiar de tab por código o por gesto lo trae a la vista solo.

## Cuándo NO usarlo / alternativas

- Si los tabs no son parte del header sino contenido de la página, usá [Tabs](Tabs.md) — tiene más variantes visuales, tamaños y no arrastra la lógica de scroll/sticky del header.
- Si sólo necesitás pasar contenido arbitrario debajo del header (un chip de estado, un buscador, un `SegmentedControl`), usá [AppHeader](AppHeader.md) con `children`: ahí el contenido es libre y no hay estado de tab.
- Si los tabs son el centro de una pantalla de aterrizaje y no de navegación, mirá `HeroTabs` en [Hero](Hero.md), de donde este componente toma el track scrolable.
- Si necesitás título grande colapsable o buscador expandible, usá [AppHeader](AppHeader.md) — `AppHeaderTabs` no tiene `largeTitle` ni `searchable`.
- Para las demás variantes visuales de header (cápsula, tarjeta, wave, notch, píldora, card slot), ver [AppHeaderIsland](AppHeaderIsland.md), [AppHeaderCard](AppHeaderCard.md), [AppHeaderWave](AppHeaderWave.md), [AppHeaderNotch](AppHeaderNotch.md), [AppHeaderPill](AppHeaderPill.md), [AppHeaderCardSlot](AppHeaderCardSlot.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `string` | — (requerido) | Título de la primera fila. |
| `subtitle` | `string` | `undefined` | Línea chica debajo del título. |
| `onBack` | `() => void` | `undefined` | Si se pasa, muestra el botón de volver a la izquierda. Tiene prioridad sobre `leading`. |
| `backLabel` | `string` | `undefined` | Texto al lado del chevron de volver. Si falta, sólo se muestra el icono y se usa `"Volver"` como `aria-label`. |
| `leading` | `ReactNode` | `undefined` | Contenido a la izquierda (avatar, logo, menú). Se ignora si hay `onBack`. |
| `actions` | `HeaderAction[]` | `[]` | Botones de icono a la derecha, con badge opcional. |
| `tabs` | `AppHeaderTab[]` | — (requerido) | Los tabs a renderizar en el track scrolable. |
| `value` | `string` | `undefined` | Id del tab activo (modo controlado). Si falta, el componente maneja el estado internamente. |
| `onChange` | `(id: string) => void` | `undefined` | Se llama con el id del tab elegido. |
| `tabVariant` | `"underline" \| "pill"` | `"underline"` | Subrayado deslizante bajo el tab activo, o pastillas rellenas. |
| `panels` | `Record<string, ReactNode>` | `undefined` | Contenido por id de tab, renderizado debajo de los tabs con transición de opacidad. |
| `variant` | `"solid" \| "blur" \| "transparent"` | `"blur"` | Fondo del header: opaco siempre, opaco que pasa a blur al scrollear, o transparente hasta scrollear. |
| `scrollRef` | `RefObject<HTMLElement \| null>` | `undefined` | Elemento scrolleable a observar en vez de la ventana. |
| `safeArea` | `boolean` | `true` | Agrega `padding-top` respetando `env(safe-area-inset-top)`. |
| `sticky` | `boolean` | `true` | `position: sticky; top: 0`. Con `false` queda `relative`. |
| `className` | `string` | `""` | Clases adicionales para el `<header>`. |

## Tipos exportados

```ts
interface AppHeaderTab {
  id: string;
  label: string;
  icon?: ReactNode;
  /** Contador al lado del label (0 se muestra; usá undefined para ocultarlo) */
  count?: number;
}
```

Usa además `HeaderAction`, exportado desde [AppHeader](AppHeader.md).

## Ejemplos

### Uso básico (no controlado)
```tsx
<AppHeaderTabs
  title="Bandeja"
  tabs={[
    { id: "all", label: "Todos" },
    { id: "unread", label: "No leídos", count: 4 },
    { id: "archived", label: "Archivados" },
  ]}
  onChange={setTab}
/>
```

### Controlado, con panels y pastillas
```tsx
const [tab, setTab] = useState("pendientes");

<AppHeaderTabs
  title="Pedidos"
  subtitle="Sucursal Centro"
  onBack={() => router.back()}
  tabVariant="pill"
  value={tab}
  onChange={setTab}
  tabs={[
    { id: "pendientes", label: "Pendientes", count: 12 },
    { id: "camino", label: "En camino", count: 3 },
    { id: "entregados", label: "Entregados" },
    { id: "cancelados", label: "Cancelados" },
  ]}
  panels={{
    pendientes: <OrderList status="pending" />,
    camino: <OrderList status="shipping" />,
    entregados: <OrderList status="done" />,
    cancelados: <OrderList status="cancelled" />,
  }}
/>
```

### Dentro de un contenedor scrolleable propio
```tsx
const scrollRef = useRef<HTMLDivElement>(null);

<div ref={scrollRef} className="h-dvh overflow-y-auto">
  <AppHeaderTabs
    title="Mensajes"
    scrollRef={scrollRef}
    tabs={tabs}
    actions={[{ id: "new", label: "Nuevo", icon: <PlusIcon />, tone: "primary", onClick: compose }]}
  />
  {/* contenido */}
</div>
```

## Requisitos / dependencias

- Usa `framer-motion` (`AnimatePresence`) para la transición entre `panels`.
- Usa internamente `HeaderIcons` (`ChevronLeftIcon`) — helper interno, no exportado por el paquete.
- Usa `ResizeObserver` para recalcular los degradados de borde cuando cambia el ancho del track (soportado en todos los navegadores modernos).
- Marcado como `"use client"`.
- No requiere ningún Provider.

## Notas y comportamiento

- **Controlado vs no controlado**: si pasás `value`, mandás vos; si no, el primer tab de `tabs` arranca activo y el estado vive adentro. `onChange` se dispara en los dos modos. El estado interno se inicializa una sola vez — si `tabs` cambia de contenido después del montaje en modo no controlado, el tab activo no se recalcula.
- **Auto-scroll del tab activo**: al cambiar `value` (o al tocar un tab), el track hace `scrollTo` suave para dejar el tab visible con 16px de aire. Funciona también cuando el cambio viene de afuera en modo controlado.
- **Degradados de borde**: sólo se muestran cuando hay contenido fuera de vista (`scrollLeft > 4` a la izquierda, o falta más de 4px a la derecha). Están pintados con `var(--color-surface)`, así que sobre `variant="transparent"` con un fondo distinto van a desentonar.
- **`variant="blur"` vs `"transparent"`**: ambos aplican blur al scrollear; la diferencia está sólo en el estado inicial (`bg-surface` opaco vs `bg-transparent`).
- El scroll se escucha sobre `window` salvo que pases `scrollRef`. El umbral para considerar "scrolleado" es 4px.
- La barra de scroll del track está oculta (`scrollbarWidth: "none"`), y el track usa `scroll-snap` en modo `proximity` — el snap es suave, no fuerza alineación exacta.
- **Accesibilidad**: el track es `role="tablist"` y cada botón `role="tab"` con `aria-selected`. Los `panels` **no** llevan `role="tabpanel"` ni `aria-labelledby`, y no hay navegación por flechas — si necesitás un patrón ARIA de tabs completo, usá [Tabs](Tabs.md).
- `count` se renderiza siempre que no sea `undefined`/`null`, así que un `count: 0` muestra un "0". Omití la prop para ocultarlo.
