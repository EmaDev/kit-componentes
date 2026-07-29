# TagInput

> Input de etiquetas de texto libre: escribir + Enter (o click) para crear una etiqueta, autocompletado contra `suggestions` y borrado con Backspace.

**Import**
```tsx
import { TagInput } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando el usuario necesita ingresar una lista abierta de valores de texto corto que no está limitada a un catálogo fijo: keywords, categorías libres, skills, destinatarios por nombre. Ofrece autocompletado opcional contra una lista de `suggestions`, pero el usuario puede crear cualquier etiqueta nueva escribiéndola y presionando Enter.

## Cuándo NO usarlo / alternativas

- Si las opciones son un catálogo cerrado y el usuario elige **una sola**, usá [Select](Select.md) — `TagInput` no reemplaza un select de opción única.
- Si las opciones son un catálogo cerrado pero navegable en fila horizontal (ej. filtros rápidos), usá [ChipCarousel](ChipCarousel.md) en vez de `TagInput` — no está pensado para crear valores nuevos.
- Si necesitás mostrar/filtrar por muchas etiquetas ya existentes de sólo lectura (no como input), un simple listado de chips alcanza; `TagInput` es específicamente el campo de formulario editable.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `value` | `string[]` | — (requerido) | Etiquetas actuales (controlado). |
| `onChange` | `(tags: string[]) => void` | — (requerido) | Se llama al agregar o quitar una etiqueta. |
| `suggestions` | `string[]` | `[]` | Lista de sugerencias para autocompletar; se filtran las ya elegidas y las que no matchean el texto escrito (hasta 6 resultados). |
| `placeholder` | `string` | `"Agregar etiqueta…"` | Placeholder del input (sólo se muestra si no hay etiquetas aún). |
| `maxTags` | `number` | `undefined` | Límite máximo de etiquetas; al alcanzarlo, `add()` deja de agregar nuevas. |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

## Ejemplos

### Uso básico
```tsx
const [tags, setTags] = useState<string[]>(["react", "typescript"]);

<TagInput value={tags} onChange={setTags} placeholder="Agregar skill…" />
```

### Con autocompletado y límite
```tsx
<TagInput
  value={tags}
  onChange={setTags}
  suggestions={["react", "vue", "svelte", "angular", "typescript", "javascript"]}
  maxTags={5}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Sin dependencias externas (no usa `framer-motion` ni Next.js).

## Notas y comportamiento

- Es un componente **controlado**: no guarda las etiquetas en estado interno, sólo el texto en edición (`q`) y si el dropdown de sugerencias está abierto.
- `Enter` agrega la etiqueta con el texto actual (trim, ignora vacíos y duplicados exactos). `Backspace` con el input vacío borra la última etiqueta agregada — comportamiento estándar de este tipo de widgets, no configurable.
- El dropdown de sugerencias usa `onMouseDown` con `preventDefault()` (no `onClick`) para poder seleccionar una sugerencia sin que el input pierda el foco antes del click.
- No expone ningún tipo exportado adicional — sólo el componente.
