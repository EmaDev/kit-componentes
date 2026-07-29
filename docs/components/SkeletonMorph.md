# SkeletonMorph

> Transición cross-fade + escala suave entre un skeleton de carga y el contenido real, en vez de un corte seco.

**Import**
```tsx
import { SkeletonMorph } from "lib-kit-components";
```

## Cuándo usarlo

Como wrapper alrededor de cualquier bloque que alterna entre un placeholder de carga (`skeleton`) y el contenido final (`children`) según un flag `loading`, cuando querés que el reemplazo se sienta como una transición (fade + leve escala) en vez de un cambio instantáneo de DOM. Es agnóstico del tipo de skeleton: podés pasarle un `SkeletonCard`, un `SkeletonText`, o cualquier JSX custom.

## Cuándo NO usarlo / alternativas

- Si no necesitás la transición animada (el corte seco entre skeleton y contenido no te importa), usá directamente [Skeleton / SkeletonCard / SkeletonList / SkeletonTable](Skeleton.md) con un `{loading ? <Skeleton.../> : children}` simple — `SkeletonMorph` sólo agrega la animación de cruce, no reemplaza la elección de qué skeleton usar.
- `SkeletonMorph` no dibuja ningún placeholder por sí mismo: seguís necesitando los componentes de [Skeleton](Skeleton.md) (u otro placeholder propio) para el prop `skeleton`.
- Si la carga es de una acción puntual (submit de un botón), usá el `loading` de `Button` en vez de `SkeletonMorph`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `loading` | `boolean` | — (requerido) | Controla qué rama se muestra: `true` → `skeleton`, `false` → `children`. |
| `skeleton` | `React.ReactNode` | — (requerido) | Contenido a mostrar mientras `loading` es `true` (típicamente un `Skeleton`/`SkeletonCard`/etc.). |
| `children` | `React.ReactNode` | — (requerido) | Contenido real, mostrado cuando `loading` es `false`. |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz (`relative`). |

## Ejemplos

### Básico con SkeletonCard
```tsx
<SkeletonMorph loading={isLoading} skeleton={<SkeletonCard media lines={2} />}>
  <MediaCard src={post.image} title={post.title} description={post.excerpt} />
</SkeletonMorph>
```

### Con placeholder custom
```tsx
<SkeletonMorph
  loading={!user}
  skeleton={<div className="h-24 rounded-xl bg-border animate-pulse" />}
>
  <ProfileCard name={user?.name ?? ""} role={user?.role} avatar={user?.avatar} />
</SkeletonMorph>
```

## Requisitos / dependencias

- No depende de `next`. Funciona en cualquier app React/Next.js.
- Usa `framer-motion` (`AnimatePresence mode="wait"` + `motion.div` con `initial`/`animate`/`exit` de opacidad y escala).
- No respeta `prefers-reduced-motion` automáticamente: el cross-fade (250-320ms) siempre corre al cambiar `loading`.

## Notas y comportamiento

- Usa `AnimatePresence mode="wait"`: la rama saliente termina de desmontarse (250ms de fade-out) **antes** de que empiece a montarse la entrante — no hay superposición de skeleton y contenido real al mismo tiempo.
- La transición de salida (skeleton → afuera) es más corta (`duration: 0.25`) que la de entrada del contenido (`duration: 0.32`, easing `[0.16, 1, 0.3, 1]`), lo que da una sensación de "asentamiento" al llegar el contenido real.
- No mantiene ningún estado propio: es puramente derivado de la prop `loading` en cada render, así que alternar `loading` rápidamente (ej. varias veces por segundo) puede generar transiciones interrumpidas entre sí sin ningún debounce interno.
- El contenedor raíz es `relative` pero no fija ninguna altura — si `skeleton` y `children` tienen alturas muy distintas, el layout puede saltar durante la transición porque no hay medición cruzada entre ambos.
