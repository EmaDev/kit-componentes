# Textarea

> Campo de texto multilínea con label flotante, auto-resize, contador de caracteres y estado de error.

**Import**
```tsx
import { Textarea } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para texto libre de varias líneas: comentarios, descripciones, mensajes de contacto, notas. Crece automáticamente con el contenido (hasta un máximo de 280px de alto) y puede mostrar un contador `X/maxLength` cuando se define un límite de caracteres.

## Cuándo NO usarlo / alternativas

- Para campos de una sola línea (nombre, email, búsqueda) usá `Input`, que tiene el mismo lenguaje visual (label flotante, error, hint) pero sin auto-resize.

## Props

`TextareaProps` extiende `TextareaHTMLAttributes<HTMLTextAreaElement>` (sin `onAnimationStart`, `onAnimationEnd`, `onDrag`, `onDragStart`, `onDragEnd`). El componente hace `forwardRef<HTMLTextAreaElement>`.

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `undefined` | Etiqueta flotante. |
| `hint` | `string` | `undefined` | Texto de ayuda debajo del textarea. Se oculta si hay `error`. |
| `error` | `string` | `undefined` | Mensaje de error. Pinta el borde/label de rojo y dispara la sacudida horizontal. |
| `autoResize` | `boolean` | `true` | Si es `true`, el alto se ajusta automáticamente al contenido (`scrollHeight`, tope de 280px). |
| `maxLength` | `number` | `undefined` | Límite nativo de caracteres (atributo `maxLength` del `<textarea>`); también habilita el contador si `showCount` es `true`. |
| `showCount` | `boolean` | `false` | Muestra el contador `count/maxLength`. Sólo se renderiza si además `maxLength` está definido. |
| `value` | `string` | `undefined` | Valor controlado. |
| `defaultValue` | `string` | `undefined` | Valor inicial no controlado. |
| `className` | `string` | `""` | Clases para el `<div>` contenedor. |
| ...resto | atributos nativos de `<textarea>` | — | `name`, `disabled`, `onChange`, `onFocus`, `onBlur`, `rows`, etc. |

## Ejemplos

### Uso básico
```tsx
<Textarea label="Comentario" placeholder="Escribí tu comentario..." />
```

### Con contador de caracteres
```tsx
<Textarea
  label="Descripción del producto"
  maxLength={200}
  showCount
  hint="Se muestra en la ficha del producto"
/>
```

### Controlado con error
```tsx
const [bio, setBio] = useState("");

<Textarea
  label="Biografía"
  value={bio}
  onChange={(e) => setBio(e.target.value)}
  error={bio.length < 10 ? "Escribí al menos 10 caracteres" : undefined}
/>
```

### Sin auto-resize (alto fijo)
```tsx
<Textarea label="Notas internas" autoResize={false} rows={6} />
```

## Requisitos / dependencias

- Usa `framer-motion` internamente para el label flotante y la sacudida por error.
- Marcado como `"use client"`.
- Depende de las variables CSS del tema (`--color-primary`, `--color-danger`, `--color-muted`, `--color-accent`).

## Notas y comportamiento

- El contador de caracteres cambia de color según el uso: `muted` por defecto, `accent` cuando se supera el 85% del `maxLength`, `danger` al llegar al límite.
- `rows` está fijado internamente en `3` como valor por defecto del elemento, pero como el spread de `...rest` se aplica después, podés sobrescribirlo pasando tu propio `rows`.
- El `ref` que reciba el componente se combina internamente con una ref interna usada para medir `scrollHeight` (autoResize); ambas apuntan al mismo nodo DOM.
- En modo controlado, el estado interno de "valor" (`val`, usado para el label flotante y el contador) se resincroniza en un `useEffect` cada vez que cambia `value`.
- El label flota (se achica y sube) cuando el textarea está enfocado o tiene contenido (`val.length > 0`) — a diferencia de `Input`, acá el `placeholder` no fuerza el label flotado.
