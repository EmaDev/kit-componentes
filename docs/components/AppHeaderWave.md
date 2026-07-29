# AppHeaderWave

> Variante de `AppHeader` como header hero: fondo con degradado `primary → accent`, esquina inferior muy redondeada ("wave") y título grande que se contrae a una barra chica fija al scrollear.

**Import**
```tsx
import { AppHeaderWave } from "lib-kit-components";
```

## Cuándo usarlo

Como cabecera de pantallas "home" o de bienvenida donde el header es protagonista visual: dashboards, pantallas de inicio de app, secciones con identidad de marca fuerte. El título arranca grande dentro del área de degradado y se colapsa a una barra chica y sólida (mismo degradado) al bajar, sin perder contexto.

## Cuándo NO usarlo / alternativas

- Si necesitás una cabecera neutra (sin degradado) con título grande colapsable, usá [AppHeader](AppHeader.md) con `largeTitle`.
- Si buscás una cápsula flotante desprendida de los bordes, usá [AppHeaderIsland](AppHeaderIsland.md).
- Si el look que necesitás es una tarjeta con bordes rectos separada del contenido, usá [AppHeaderCard](AppHeaderCard.md).
- Si el hero necesita alojar una card flotante vacía para contenido custom (ej. balance de wallet), usá [AppHeaderCardSlot](AppHeaderCardSlot.md) en vez de pasar ese contenido como `children`.
- No tiene buscador expandible ni `leading` — si los necesitás, usá `AppHeader` o `AppHeaderIsland`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `string` | — (requerido) | Título grande del hero; se convierte en el título chico de la barra colapsada. |
| `subtitle` | `string` | `undefined` | Texto secundario debajo del título grande (desaparece al colapsar). |
| `onBack` | `() => void` | `undefined` | Si se pasa, muestra la flecha de volver. |
| `actions` | `HeaderAction[]` | `[]` | Botones de icono a la derecha, con badge opcional. |
| `children` | `ReactNode` | `undefined` | Fila extra debajo del título/subtítulo (tabs, chips, filtros). |
| `scrollRef` | `RefObject<HTMLElement \| null>` | `undefined` | Elemento scrolleable a observar en vez de la ventana. |
| `safeArea` | `boolean` | `true` | Agrega `padding-top` respetando `env(safe-area-inset-top)`. |
| `className` | `string` | `""` | Clases adicionales para el `<header>`. |

## Tipos exportados

No exporta tipos propios. Usa `HeaderAction`, exportado desde [AppHeader](AppHeader.md).

## Ejemplos

### Hero simple
```tsx
<AppHeaderWave title="Hola, Lucía" subtitle="Tu resumen de hoy" />
```

### Con volver y acciones
```tsx
<AppHeaderWave
  title="Mi cuenta"
  onBack={() => router.back()}
  actions={[{ id: "settings", label: "Ajustes", icon: <GearIcon />, onClick: openSettings }]}
/>
```

### Con fila de tabs debajo del título
```tsx
<AppHeaderWave title="Reportes">
  <ChipCarousel chips={periodos} value={periodo} onChange={setPeriodo} size="sm" />
</AppHeaderWave>
```

## Requisitos / dependencias

- Usa `framer-motion` para la transición del título chico y el colapso del bloque de título grande.
- Usa internamente `HeaderIcons` (`ChevronLeftIcon`) — helper interno, no exportado por el paquete.
- Marcado como `"use client"`.
- No requiere ningún Provider.

## Notas y comportamiento

- El colapso ocurre a partir de `scrollY > 60` (más tarde que `AppHeader`, que usa `44`), porque acá el bloque a retraer es más alto (título de `26px` + subtítulo).
- Cuando el título grande está visible (`!collapsed`), el título chico de la barra superior no se renderiza — sólo aparece con `AnimatePresence` una vez colapsado.
- El degradado y el color de texto (`text-white`) son fijos vía clases Tailwind (`from-primary to-accent`), no configurables por prop; para otro esquema de color hay que sobreescribir con `className`.
- Las acciones (badges incluidos) usan variantes de color adaptadas a fondo oscuro (`bg-white text-primary` para el badge numérico) en vez de los tonos `text-primary`/`text-danger` de `AppHeader`.
