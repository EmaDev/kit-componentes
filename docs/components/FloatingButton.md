# FloatingButton

> Botón de acción flotante (FAB) que se auto-oculta al scrollear hacia abajo y puede desplegar un menú de acciones secundarias (speed dial).

**Import**
```tsx
import { FloatingButton, type FabAction } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para la acción principal y global de una pantalla: crear un nuevo elemento, abrir un composer, disparar la acción más frecuente de esa vista (patrón Material Design FAB). Si necesitás ofrecer varias acciones relacionadas desde un mismo punto (ej. "Nueva nota" / "Nueva tarea" / "Nuevo evento"), pasale `actions` y se convierte automáticamente en un speed dial: el botón principal cambia de "+" a "×" y despliega las acciones secundarias con stagger al tocarlo.

## Cuándo NO usarlo / alternativas

- No lo uses para controles de cantidad puntuales dentro de una fila o card (ej. "+1 / -1" en un ítem de carrito) — para eso están `AddButton` y `AddToCartButton`, pensados como controles locales embebidos en contenido, no como acción flotante global de la pantalla.
- Si ya tenés `BottomNav` visible, considerá el `position` para que el FAB no quede tapado por la barra inferior (el componente no lo evita automáticamente).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `icon` | `ReactNode` | ícono "+" por defecto | Ícono del botón principal. |
| `label` | `string` | `undefined` | Texto accesible (`aria-label`) del botón; también se muestra como texto visible si `extended` es `true`. |
| `onClick` | `() => void` | `undefined` | Handler al tocar el botón principal. Se ignora si `actions` tiene elementos (en ese caso el botón abre/cierra el speed dial en vez de ejecutar `onClick`). |
| `actions` | `FabAction[]` | `undefined` | Acciones secundarias. Si se define con al menos un elemento, el botón se comporta como speed dial. |
| `hideOnScroll` | `boolean` | `true` | Si es `true`, el FAB se oculta al detectar scroll hacia abajo (más de 90px desde el tope) y reaparece al scrollear hacia arriba. |
| `scrollTarget` | `React.RefObject<HTMLElement>` | `undefined` | Contenedor scrolleable a observar en vez de `window` (útil dentro de paneles con scroll propio). |
| `position` | `"bottom-right" \| "bottom-left" \| "bottom-center"` | `"bottom-right"` | Posición fija/absoluta en pantalla. |
| `extended` | `boolean` | `false` | Si es `true`, el botón se muestra ancho con el `label` visible junto al ícono, en vez de sólo un círculo. |
| `size` | `"md" \| "lg"` | `"lg"` | Tamaño del botón principal: `md` = 48px, `lg` = 56px de diámetro/alto. |
| `tone` | `"primary" \| "accent" \| "success" \| "danger"` | `"primary"` | Color del botón principal. |
| `absolute` | `boolean` | `false` | Si es `true`, usa `position: absolute` en vez de `fixed` (para maquetas/mocks dentro de un contenedor con posición relativa). |
| `className` | `string` | `""` | Clases CSS adicionales para el contenedor raíz. |

## Tipos exportados

```ts
export interface FabAction {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  tone?: "primary" | "accent" | "success" | "danger";
}
```

## Ejemplos

### FAB simple (acción única)
```tsx
<FloatingButton label="Nuevo pedido" onClick={() => router.push("/pedidos/nuevo")} />
```

### FAB extendido con label visible
```tsx
<FloatingButton
  label="Crear"
  extended
  icon={<PlusIcon />}
  onClick={openCreateModal}
  tone="accent"
/>
```

### Speed dial con varias acciones
```tsx
import { FloatingButton, type FabAction } from "lib-kit-components";

const actions: FabAction[] = [
  { icon: <NoteIcon />, label: "Nueva nota", onClick: () => openNote(), tone: "primary" },
  { icon: <TaskIcon />, label: "Nueva tarea", onClick: () => openTask(), tone: "success" },
  { icon: <EventIcon />, label: "Nuevo evento", onClick: () => openEvent(), tone: "accent" },
];

<FloatingButton label="Crear" actions={actions} />
```

### Dentro de un panel con scroll propio
```tsx
const panelRef = useRef<HTMLDivElement>(null);

<div ref={panelRef} className="h-[480px] overflow-y-auto relative">
  {/* contenido largo */}
  <FloatingButton
    label="Agregar"
    onClick={addItem}
    scrollTarget={panelRef}
    absolute
    position="bottom-center"
  />
</div>
```

## Requisitos / dependencias

- No depende de `next`. Funciona en cualquier app React/Next.js.
- Usa `framer-motion` para: animación de entrada/salida al esconderse en scroll, apertura del speed dial con stagger (`delay: i * 0.045` al abrir, delay inverso al cerrar), rotación del ícono principal (45°→135°) y `whileTap` de escala.
- No es controlado: el estado de apertura del speed dial (`open`) y de ocultamiento por scroll (`hidden`) son internos, sin props para controlarlos desde afuera.

## Notas y comportamiento

- El listener de scroll ignora deltas menores a 8px (evita "temblor" con scrolls muy pequeños) y sólo oculta el botón si el scroll bajó **y** la posición actual supera los 90px desde el tope; cerca del tope siempre queda visible.
- Al detectar scroll hacia abajo, si el speed dial estaba abierto se cierra automáticamente (`setOpen(false)`).
- El fondo semitransparente (`backdrop`) del speed dial sólo aparece cuando `open && hasActions`, y al tocarlo cierra el menú (`setOpen(false)`); no cierra el menú al hacer click fuera del backdrop si el elemento clickeado está fuera de su área (no hay listener global de click-outside, sólo el backdrop cubre `inset-0`).
- Cada acción secundaria muestra su `label` en un chip junto al botón circular; al ejecutarse, llama `a.onClick()` y cierra el speed dial (`setOpen(false)`).
- Si se pasan `actions`, la prop `onClick` del componente se ignora completamente: el botón principal sólo alterna el estado `open`.
- El posicionamiento respeta el safe-area inferior en modo `fixed` (`bottom-[max(1rem,calc(env(safe-area-inset-bottom)+1rem))]`); en modo `absolute` usa `bottom-4` fijo.
- El botón principal tiene `aria-label={label}` y `aria-expanded` (sólo definido cuando hay `actions`).
- El backdrop es un `div` con esquinas rectas (no hereda `border-radius`). En modo `absolute` dentro de un contenedor con esquinas redondeadas, agregá `overflow-hidden` a ese contenedor — si no, el backdrop se ve como un rectángulo gris con esquinas cuadradas asomando por fuera del borde redondeado.
