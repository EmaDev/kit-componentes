# SocialPost

> Post de red social completo: autor, texto con "ver más" al superar un límite, grilla de media adaptativa (1 · 2 · 3 con destacada · 4+ con contador), reacciones animadas y contadores. Acepta contenido extra (encuesta, comentarios) como `children`.

**Import**
```tsx
import { SocialPost } from "lib-kit-components";
import type { PostAuthor, PostMedia, PostCounts } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para renderizar publicaciones de un feed social propio (comunidad, red interna, blog con posts tipo social): header de autor con verificado/handle, texto recortado, galería de imágenes, y la fila de acciones estándar (me gusta, comentar, compartir, guardar). Podés anidar [Poll](Poll.md) o [CommentBox](CommentBox.md) como `children` para armar el post completo.

## Cuándo NO usarlo / alternativas

- Si necesitás sólo la lista de comentarios (sin el post en sí), usá [CommentBox](CommentBox.md) directamente.
- Para contenido de lectura larga paginado (no un post corto), usá [BookReader](BookReader.md).
- Si el "post" es en realidad una card de producto/contenido genérica, usá [Card](Card.md) (`MediaCard`) en su lugar.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `author` | `PostAuthor` | — (requerido) | Datos del autor. |
| `time` | `string` | — (requerido) | Fecha ya formateada (ej. `"hace 2 h"`). |
| `text` | `string` | — (requerido) | Cuerpo del post. |
| `media` | `PostMedia[]` | `[]` | Imágenes adjuntas (hasta 4 visibles; la 4ª muestra "+N" si hay más). |
| `counts` | `PostCounts` | — (requerido) | Contadores de likes/comentarios/compartidos. |
| `liked` | `boolean` | `undefined` | Estado "me gusta" controlado. Sin esta prop, el componente maneja su propio estado interno. |
| `saved` | `boolean` | `undefined` | Estado "guardado" controlado. |
| `onLike` | `(liked: boolean) => void` | `undefined` | Se llama al togglear like. |
| `onSave` | `(saved: boolean) => void` | `undefined` | Se llama al togglear guardado. |
| `onComment` | `() => void` | `undefined` | Click en "Comentar". |
| `onShare` | `() => void` | `undefined` | Click en "Compartir". |
| `onFollow` | `() => void` | `undefined` | Si se pasa, muestra el botón "Seguir" en el header. |
| `onMedia` | `(index: number) => void` | `undefined` | Click en una imagen de la grilla (ej. para abrir un visor). |
| `clampAt` | `number` | `240` | Cantidad de caracteres antes de recortar el texto con "ver más". |
| `likedBy` | `string[]` | `[]` | Nombres para la línea social ("Lucía y 12 más"). Sólo se usa el primero. |
| `children` | `ReactNode` | `undefined` | Contenido extra debajo de las acciones (encuesta, comentarios, link preview). |
| `variant` | `"card" \| "flat"` | `"card"` | `card` = superficie con borde redondeado; `flat` = borde inferior, sin bordes laterales (feed continuo). |
| `className` | `string` | `""` | Clases adicionales. |

## Tipos exportados

```ts
export interface PostAuthor {
  name: string;
  handle?: string;
  avatar?: string;
  verified?: boolean;
  meta?: string;
}
export interface PostMedia {
  src: string;
  alt?: string;
}
export interface PostCounts {
  likes: number;
  comments: number;
  shares?: number;
}
```

## Ejemplos

### Post con media y encuesta anidada
```tsx
<SocialPost
  author={{ name: "Estudio Aldama", handle: "@aldama", verified: true }}
  time="hace 2 h" text={post.body} media={[{ src, alt }]}
  counts={{ likes: 1284, comments: 96, shares: 34 }}
  likedBy={["Lucía Marín"]}
  onLike={(liked) => react(post.id, liked)} onSave={bookmark}
  onComment={openThread} onShare={share} onMedia={(i) => openGallery(i)}
>
  <Poll question="..." options={options} />
</SocialPost>
```

### Variante flat (feed continuo)
```tsx
<SocialPost author={author} time="hace 5 min" text={text} counts={counts} variant="flat" />
```

## Requisitos / dependencias

- Usa `framer-motion` (burst del ícono de like, transiciones de la fila de acciones).
- Marcado como `"use client"`.
- No depende de `next`.

## Notas y comportamiento

- Sin `author.avatar`, se muestran las iniciales de `author.name` (primeras dos palabras) sobre un gradiente `primary → accent`.
- La grilla de media se adapta según la cantidad: 1 imagen ocupa una columna ancha (`aspect-[16/10]`); 2, 3 (la primera ocupa dos filas) y 4+ usan grilla cuadrada de 2 columnas, con "+N" superpuesto en la 4ª si hay más de 4.
- El contador de likes en modo no controlado (`liked` no pasado) suma 1 visualmente en cuanto el usuario da like, sin esperar la respuesta de `onLike` — si tu backend puede fallar, considerá pasar `liked`/`counts` controlados y revertir en el `catch`.
- `likedBy` sólo muestra el primer nombre de la lista ("Lucía y 12 más"); si querés mostrar varios nombres, formateá vos el string antes de pasarlo o ignorá esta prop y compón tu propia línea con `children`.
- `clampAt` recorta por cantidad de caracteres, no por líneas — con fuentes/anchos distintos el resultado visual puede variar más de lo esperado; ajustalo según tu layout.
