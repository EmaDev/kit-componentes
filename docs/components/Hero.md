# HeroSearch / HeroImage / HeroTabs / HeroWelcome

> Cuatro cabeceras de pantalla completa, listas para el tope de una vista principal: buscador con sugerencias en vivo (`HeroSearch`), imagen a sangre con overlay y datos destacados (`HeroImage`), cabecera con pestañas horizontales scrolables (`HeroTabs`), y saludo de bienvenida con dato destacado y accesos rápidos (`HeroWelcome`).

**Import**
```tsx
import { HeroSearch, HeroImage, HeroTabs, HeroWelcome, greetingFor } from "lib-kit-components";
```

## Cuándo usarlo

Son cabeceras de nivel de página, no piezas embebidas: cada una ocupa el ancho completo del contenedor y define el tono de la pantalla. `HeroSearch` para una landing/home donde la acción principal es buscar (con sugerencias frecuentes y resultados en vivo mientras se escribe). `HeroImage` para portadas editoriales o de producto/propiedad, con imagen a sangre, overlay legible, metadatos y acciones. `HeroTabs` para una bandeja/listado con muchas categorías que no entran en el ancho disponible (scroll horizontal con snap y auto-scroll del tab activo). `HeroWelcome` para el home de una app instalada: saludo según la hora, avatar, un dato destacado (saldo, puntos) y accesos rápidos.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás pestañas para dividir contenido dentro de una pantalla que ya tiene su propia cabecera (no como cabecera en sí), usá [Tabs](Tabs.md) en vez de `HeroTabs` — `HeroTabs` incluye título/descripción/acciones de nivel de página.
- Para un buscador embebido dentro de un formulario o toolbar (no como cabecera de pantalla completa), usá [Input](Input.md) con tu propio dropdown de resultados.
- Para una galería de imágenes navegable (no una única imagen de portada), usá [Carousel](Carousel.md).
- `HeroImage` no reemplaza [MediaCard](Card.md): `MediaCard` es una card de listado (grilla de resultados), `HeroImage` es una cabecera única de pantalla completa.

## Props

### HeroSearch

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `ReactNode` | — (requerido) | Título principal. |
| `eyebrow` | `string` | `undefined` | Texto pequeño sobre el título, en chip. |
| `description` | `string` | `undefined` | Texto bajo el título. |
| `placeholder` | `string` | `"Buscar…"` | Placeholder del input (también su `aria-label`). |
| `value` | `string` | `undefined` | Valor del input, controlado. Si se omite, el componente maneja su propio estado interno. |
| `onChange` | `(v: string) => void` | `undefined` | Se llama en cada tecla. |
| `onSubmit` | `(v: string) => void` | `undefined` | Se llama al enviar el form (botón o Enter). |
| `suggestions` | `string[]` | `undefined` | Chips de búsquedas frecuentes debajo del input. |
| `onSuggestion` | `(s: string) => void` | `undefined` | Se llama al tocar un chip de sugerencia (además de cargarlo en el input). |
| `results` | `{ id: string; label: string; sub?: string }[]` | `undefined` | Resultados en vivo mostrados en un panel flotante mientras hay texto y el input está enfocado. |
| `onResult` | `(id: string) => void` | `undefined` | Se llama al tocar un resultado del panel. |
| `align` | `"left" \| "center"` | `"center"` | Alineación del bloque de texto/input. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Padding vertical de la sección. |
| `icon` | `ReactNode` | ícono de lupa | Ícono a la izquierda del input. |
| `cta` | `string` | ícono de lupa | Texto del botón de submit (si se omite, muestra sólo el ícono). |
| `className` | `string` | `""` | Clases CSS adicionales. |

### HeroImage

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `src` | `string` | — (requerido) | URL de la imagen de fondo. |
| `alt` | `string` | `""` | Texto alternativo. |
| `title` | `ReactNode` | — (requerido) | Título principal, sobre la imagen. |
| `eyebrow` | `string` | `undefined` | Chip pequeño sobre el título. |
| `description` | `string` | `undefined` | Texto bajo el título. |
| `height` | `number` | `undefined` | Alto fijo en px. Si se omite, usa `ratio`. |
| `ratio` | `number` | `16/9` | Relación de aspecto (`width / height`) cuando no hay `height`. |
| `align` | `"left" \| "center"` | `"left"` | Alineación del bloque de texto. |
| `vAlign` | `"top" \| "center" \| "bottom"` | `"bottom"` | Posición vertical del bloque de texto dentro de la imagen. |
| `overlay` | `"gradient" \| "scrim" \| "none"` | `"gradient"` | `gradient` = degradado oscuro desde abajo (mejor legibilidad con `vAlign="bottom"`). `scrim` = capa oscura pareja. `none` = sin overlay. |
| `rounded` | `boolean` | `false` | Bordes redondeados grandes (`rounded-3xl`) en vez de esquinas rectas. |
| `parallax` | `boolean` | `false` | Desplaza la imagen levemente al scrollear (efecto parallax sutil). |
| `actions` | `ReactNode` | `undefined` | Botones al pie del bloque de texto. |
| `meta` | `{ label: string; value: string }[]` | `undefined` | Fila de datos destacados (ej. superficie, duración, año). |
| `className` | `string` | `""` | Clases CSS adicionales. |

### HeroTabs

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `tabs` | `HeroTab[]` | — (requerido) | Pestañas a mostrar. |
| `title` | `ReactNode` | `undefined` | Título sobre la fila de tabs. |
| `description` | `string` | `undefined` | Texto bajo el título. |
| `value` | `string` | `undefined` | Id de la tab activa, controlado. Sin esta prop, el componente maneja su propio estado (arranca en `tabs[0]?.id`). |
| `onChange` | `(id: string) => void` | `undefined` | Se llama al cambiar de tab. |
| `variant` | `"underline" \| "pill"` | `"underline"` | Estilo visual de las tabs. |
| `panels` | `Record<string, ReactNode>` | `undefined` | Si se define, renderiza `panels[active]` debajo de la fila de tabs (con una animación de entrada por cambio de tab). |
| `left` | `ReactNode` | `undefined` | Contenido extra sobre el título (ej. breadcrumb corto). |
| `actions` | `ReactNode` | `undefined` | Botones a la derecha del título. |
| `sticky` | `boolean` | `false` | La fila de tabs queda pegada (`sticky top-0`) al scrollear. |
| `className` | `string` | `""` | Clases CSS adicionales. |

### HeroWelcome

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `name` | `string` | — (requerido) | Nombre del usuario; también genera las iniciales del avatar por defecto. |
| `avatar` | `string` | `undefined` | URL de la foto. Sin ella, muestra iniciales. |
| `greeting` | `string` | calculado por hora | Texto de saludo. Si se omite, usa `greetingFor()` con la hora actual del dispositivo. |
| `subtitle` | `string` | `undefined` | Texto bajo el nombre. |
| `highlight` | `{ label: string; value: string; delta?: string }` | `undefined` | Bloque de dato destacado (ej. saldo), con variación opcional. |
| `quickActions` | `{ id: string; label: string; icon?: ReactNode }[]` | `[]` | Accesos rápidos, en fila scrolable horizontal. |
| `onQuickAction` | `(id: string) => void` | `undefined` | Se llama al tocar un acceso rápido. |
| `actions` | `ReactNode` | `undefined` | Contenido a la derecha del saludo (ej. botón de notificaciones). |
| `tone` | `"surface" \| "brand"` | `"surface"` | `brand` tiñe todo el fondo con el color primario y ajusta los contrastes a blanco. |
| `className` | `string` | `""` | Clases CSS adicionales. |

## Tipos exportados

```ts
export interface HeroTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

// función standalone, sin montar HeroWelcome:
function greetingFor(d?: Date): string; // "Buenas noches" | "Buen día" | "Buenas tardes"
```

## Ejemplos

### HeroSearch con sugerencias y resultados en vivo
```tsx
<HeroSearch
  eyebrow="1.284 propiedades activas"
  title="Encontrá tu próximo lugar"
  description="Filtrá por barrio, precio o metros."
  placeholder="Barrio, calle o código…"
  cta="Buscar"
  suggestions={["Palermo", "Belgrano", "2 ambientes"]}
  results={liveResults}
  onSubmit={(q) => router.push(`/buscar?q=${q}`)}
/>
```

### HeroImage de portada
```tsx
<HeroImage
  src="/casa.jpg"
  alt="Casa Aldama"
  eyebrow="Obra terminada"
  title="Casa Aldama"
  description="Reforma integral de 140 m² en dos plantas."
  meta={[{ label: "Superficie", value: "140 m²" }, { label: "Año", value: "2025" }]}
  actions={<Button>Ver proyecto</Button>}
  height={420}
  overlay="gradient"
  vAlign="bottom"
/>
```

### HeroTabs como cabecera de una bandeja
```tsx
const [tab, setTab] = useState("todo");

<HeroTabs
  title="Bandeja de entrada"
  tabs={[{ id: "todo", label: "Todo", count: 128 }, { id: "hoy", label: "Hoy", icon: <ZapIcon />, count: 12 }]}
  value={tab}
  onChange={setTab}
  variant="underline"
  panels={{ todo: <Todo />, hoy: <Hoy /> }}
  actions={<Button size="sm">Nuevo</Button>}
  sticky
/>
```

### HeroWelcome en el home de la app
```tsx
<HeroWelcome
  name="Lucía Marín"
  avatar={user.photo}
  subtitle="Cuenta personal · **** 4417"
  highlight={{ label: "Saldo disponible", value: "$248.320", delta: "+4,2%" }}
  quickActions={[{ id: "enviar", label: "Enviar", icon: <SendIcon /> }]}
  onQuickAction={(id) => go(id)}
  actions={<BellButton />}
  tone="brand"
/>
```

## Requisitos / dependencias

- Ninguno de los cuatro depende de `next` ni de `framer-motion`.
- Marcados como `"use client"`.
- Todos son mayormente no controlados con opción de control: `HeroSearch.value`/`onChange`, `HeroTabs.value`/`onChange` — si se omiten, cada uno maneja su propio estado interno.

## Notas y comportamiento

- `HeroSearch`: el panel de resultados sólo se muestra si el input está enfocado (`open`), hay texto (`q`) y `results` tiene elementos; un listener de `mousedown` en el documento lo cierra al clickear fuera. Tocar "Limpiar" vacía el input y cierra el panel, pero no dispara `onSubmit`.
- `HeroImage`: con `parallax`, un listener de `scroll` (con `requestAnimationFrame`) desplaza la imagen ±24px según la posición de la sección relativa al centro del viewport — se limpia al desmontar.
- `HeroImage`: `overlay="gradient"` está pensado para `vAlign="bottom"` (más oscuro abajo, donde va el texto); con `vAlign="top"` puede convenir `overlay="scrim"` para legibilidad pareja.
- `HeroTabs`: un `ResizeObserver` sobre la fila de tabs recalcula los degradados de borde (`edges.left`/`right`) cuando cambia el contenido o el ancho disponible; además, al cambiar `active` (por prop o por click), la tab activa se hace scroll automáticamente a la vista si queda fuera (con 12-16px de margen).
- `HeroTabs`: sin `panels`, el componente sólo renderiza la cabecera con las tabs — el contenido de cada tab queda a cargo del consumidor, afuera del componente.
- `HeroWelcome`: las iniciales del avatar por defecto toman la primera letra de las dos primeras palabras de `name` (igual criterio que `ProfileCard`, ver [Card](Card.md)).
- `HeroWelcome`: `greetingFor` es una función standalone exportada aparte — se puede usar sin montar el componente (ej. para un saludo en otro lugar de la UI) y expone los cortes horarios: antes de las 6 y desde las 20, "Buenas noches"; antes de las 13, "Buen día"; antes de las 20, "Buenas tardes".
