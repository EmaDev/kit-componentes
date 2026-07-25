# CommentBox

> Caja de comentarios con hilos de **una sola** respuesta (no anida más de un nivel a propósito), orden (recientes/populares/antiguos), likes, contador de caracteres y paginado con "ver más".

**Import**
```tsx
import { CommentBox } from "lib-kit-components";
import type { Comment, CommentSort } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para la sección de comentarios de un post, artículo o producto: composer arriba, lista ordenable debajo, respuestas de un nivel, y likes por comentario. Los comentarios se pasan **planos** (`comments: Comment[]`), no anidados — el propio componente arma el árbol de un nivel a partir de `parentId`.

## Cuándo NO usarlo / alternativas

- Si necesitás hilos de más de un nivel de profundidad (respuestas a respuestas), esta pieza no lo soporta a propósito — tendrías que extenderla o usar otra solución.
- Para un chat en tiempo real (no comentarios de un post), usá [Chatbot](Chatbot.md) como base de UI.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `comments` | `Comment[]` | — (requerido) | Lista plana de comentarios (con `parentId` en las respuestas). |
| `onSubmit` | `(text: string, parentId?: string \| null) => void \| Promise<void>` | — (requerido) | Se llama al publicar (comentario raíz o respuesta). |
| `onLike` | `(id: string, liked: boolean) => void` | `undefined` | Se llama al togglear like de un comentario. |
| `onDelete` | `(id: string) => void` | `undefined` | Si se pasa, muestra el botón "Eliminar" en cada comentario. |
| `currentUser` | `{ name: string; avatar?: string }` | `undefined` | Usuario actual, mostrado en el composer. |
| `maxLength` | `number` | `500` | Máximo de caracteres por comentario. |
| `placeholder` | `string` | `"Escribí un comentario…"` | Placeholder del composer principal. |
| `sort` | `CommentSort` | `undefined` (interno: `"recent"`) | Orden controlado. |
| `onSortChange` | `(s: CommentSort) => void` | `undefined` | Notifica el cambio de orden. |
| `pageSize` | `number` | `4` | Comentarios raíz mostrados antes de "ver más". |
| `allowReplies` | `boolean` | `true` | Habilita el botón "Responder" y el hilo de un nivel. |
| `title` | `string` | `"Comentarios"` | Título del encabezado (con contador entre paréntesis). |
| `className` | `string` | `""` | Clases adicionales. |

## Tipos exportados

```ts
export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  at: number;              // timestamp; se muestra relativo ("hace 2 h")
  likes?: number;
  liked?: boolean;
  parentId?: string | null;
  pinned?: boolean;
  authorBadge?: string;     // ej. "Autor", "Moderador"
}
type CommentSort = "recent" | "top" | "old";
```

## Ejemplos

### Uso básico
```tsx
<CommentBox
  comments={comments}
  currentUser={{ name: "Lucía", avatar: user.photo }}
  onSubmit={async (text, parentId) => await api.comment({ text, parentId })}
  onLike={(id, liked) => api.likeComment(id, liked)}
  maxLength={280} pageSize={4} sort="top"
/>
```

### Sin respuestas, con borrado
```tsx
<CommentBox
  comments={comments} onSubmit={submit} onDelete={deleteComment}
  allowReplies={false} title="Opiniones"
/>
```

## Requisitos / dependencias

- Usa `framer-motion` (entrada de comentarios, `layout` al reordenar, animación del ícono de like).
- Marcado como `"use client"`.
- Es agnóstico de backend: vos proveés `comments` ya cargados y `onSubmit`/`onLike`/`onDelete` hacen la llamada real; el componente no optimista-actualiza la lista por sí mismo (esperá tu propio refetch/estado).

## Notas y comportamiento

- El orden `"top"` compara por `likes` (default 0 si no viene); `pinned` siempre gana el orden sin importar el `sort` elegido.
- Las respuestas (`parentId` seteado) siempre se ordenan cronológicamente ascendente, independientemente del `sort` de los comentarios raíz.
- `Composer` (interno, no exportado) muestra el contador de caracteres y el botón "Publicar" sólo cuando el textarea tiene foco o contenido — el input crece automáticamente hasta 160px.
- `⌘/Ctrl + Enter` publica el comentario sin soltar el mouse del textarea; también hay botón "Publicar" explícito.
- El botón "Ver N comentarios más" respeta `pageSize`: al hacer click, suma otro lote de `pageSize` (no revela todos de una vez).
