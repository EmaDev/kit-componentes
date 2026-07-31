# DocumentEditor

> Escritor de documentos a pantalla completa con dos modos sobre la misma fuente: formato tradicional (WYSIWYG) o Markdown con vista previa.

**Import**
```tsx
import { DocumentEditor } from "lib-kit-components";
import type { EditorFormat, MarkdownViewMode } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando escribir **es** la tarea: un editor de artículos, notas largas, documentación interna. Ocupa toda la pantalla, tiene barra de formato, contador de palabras y estado de guardado, y deja que el usuario elija entre escribir con botones o en Markdown crudo — las dos vistas trabajan sobre el mismo texto.

## Cuándo NO usarlo / alternativas

- Si es un campo de texto enriquecido **dentro de un formulario**, usá [RichTextEditor](RichTextEditor.md): este componente se apropia de la pantalla completa.
- Si es una nota corta al vuelo, usá [QuickNotePad](QuickNotePad.md).
- Si es texto plano sin formato, usá [Textarea](Textarea.md).
- Si sólo hay que **mostrar** contenido paginado para leer, usá [BookReader](BookReader.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `defaultTitle` | `string` | `"Documento sin título"` | Título inicial. Valor **inicial**: los cambios posteriores a la prop no se reflejan. |
| `defaultValue` | `string` | `""` | Contenido inicial, **en Markdown**. También es valor inicial. |
| `defaultFormat` | `EditorFormat` | `"traditional"` | Modo inicial: `"traditional"` (WYSIWYG) o `"markdown"`. |
| `placeholder` | `string` | `"Empezá a escribir…"` | Placeholder, en los dos modos. En el tradicional se pinta desde `globals.css` (ver notas). |
| `onTitleChange` | `(title: string) => void` | `undefined` | Se llama en cada tecla del título. |
| `onChange` | `(markdown: string) => void` | `undefined` | Se llama en cada cambio del contenido, **siempre en Markdown** (también editando en modo tradicional). |
| `onFormatChange` | `(format: EditorFormat) => void` | `undefined` | Se llama al cambiar de modo. |
| `onSave` | `(payload: { title, markdown, format }) => void \| Promise<void>` | `undefined` | Si se pasa, aparece el botón "Guardar" en el header. Se espera la promesa antes de marcar "Guardado". |
| `onClose` | `() => void` | `undefined` | Si se pasa, aparece la flecha de volver a la izquierda del título. |
| `variant` | `"fullscreen" \| "embed"` | `"fullscreen"` | `fullscreen` = `fixed inset-0 z-[200]`. `embed` = `absolute inset-0`, llena su contenedor posicionado. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Tipos exportados

```ts
type EditorFormat = "traditional" | "markdown";
type MarkdownViewMode = "edit" | "split" | "preview";
```

`MarkdownViewMode` es el estado interno del selector Editar / Dividido / Vista; se exporta por si necesitás tiparlo, pero **no hay prop para controlarlo** (arranca siempre en `"split"`).

## Ejemplos

### Uso básico, a pantalla completa
```tsx
const [abierto, setAbierto] = useState(false);

{abierto && (
  <DocumentEditor
    defaultTitle={doc.titulo}
    defaultValue={doc.markdown}
    onSave={async ({ title, markdown }) => await api.guardarDoc({ title, markdown })}
    onClose={() => setAbierto(false)}
  />
)}
```

### Arrancando en Markdown, con autoguardado propio
```tsx
const guardar = useDebouncedCallback((md: string) => api.autosave(md), 1200);

<DocumentEditor
  defaultFormat="markdown"
  defaultValue={borrador}
  onChange={guardar}
  onClose={cerrar}
/>
```

### Embebido en un contenedor (mock o panel)
```tsx
<div className="relative h-[640px] rounded-2xl border border-border overflow-hidden">
  <DocumentEditor variant="embed" defaultValue={"# Hola\n\nTexto de ejemplo."} />
</div>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- No requiere `framer-motion`.
- No depende de Next.js.
- Usa APIs del navegador: `document.execCommand` (modo tradicional) y `DOMParser` (conversión HTML → Markdown). Ambas sólo existen en el cliente.
- Usa los tokens `--color-surface`, `--color-surface-alt`, `--color-border`, `--color-foreground`, `--color-muted` y `--color-primary`.
- La tipografía del documento se resuelve con variantes arbitrarias de Tailwind (`[&_h1]:…`) sobre una clase `prose-doc`. Esa clase también es el gancho del placeholder del modo tradicional: **necesita la regla `.prose-doc[data-empty="true"]::before` de `globals.css`** (incluida en el kit). Si no importás el `globals.css` del kit, el editor funciona igual pero el placeholder no se ve.

## Notas y comportamiento

- **La fuente de verdad es Markdown**, en los dos modos. En el tradicional, cada `input` del área editable convierte el HTML a Markdown (`htmlToMarkdown`) y guarda eso; al volver a modo tradicional se regenera el HTML desde el Markdown.
- **Esa ida y vuelta es con pérdida.** El subset soportado es: `#`/`##`/`###`, `**negrita**`, `*cursiva*`, `` `código` ``, `[texto](url)`, `>` cita, listas `-`/`1.` y bloques ``` ```. Cualquier otra cosa que produzca el navegador (tablas, imágenes, subrayado, colores, HTML pegado) **se pierde al convertir**. El subrayado es el caso más visible: el botón `U` aplica `<u>` pero Markdown no lo representa, así que desaparece.
- **`document.execCommand` está deprecado.** Funciona hoy en todos los navegadores pero no tiene reemplazo estándar y su comportamiento varía entre motores. Si el editor es una pieza central de tu producto, considerá una librería dedicada.
- La vista previa usa `dangerouslySetInnerHTML` sobre HTML generado por el propio `markdownToHtml`, que escapa `&`, `<` y `>` del texto. Pero **los enlaces no se validan**: un `[click](javascript:...)` en el Markdown produce un `href` ejecutable. Si el contenido puede venir de terceros, sanitizá antes de renderizar.
- **No controlado**: `defaultTitle`, `defaultValue` y `defaultFormat` se leen al montar. Para cargar otro documento, remontá con una `key` distinta.
- El indicador "Editando… / Guardado" es **cosmético**: pasa a "Guardado" 700 ms después de la última tecla, sin que se haya guardado nada realmente. El guardado real lo hacés vos en `onChange` o `onSave`.
- `onChange` se dispara también en el primer render (hay un `useEffect` sobre `markdown`), así que vas a recibir el valor inicial. Si eso te dispara un autosave innecesario, filtrá el primer llamado.
- El placeholder del modo tradicional se pinta con un `::before` sobre `attr(data-placeholder)`, condicionado a `data-empty="true"`. Se usa ese marcador en vez de `:empty` porque el área editable nunca queda realmente vacía: el navegador deja un `<br>` (y `markdownToHtml` devuelve `<p><br></p>`) en cuanto el usuario escribe y borra. El marcador se calcula desde el Markdown (`markdown.trim()`), que es la fuente de verdad, así que también funciona al volver del modo Markdown con el documento vacío.
- El selector Editar / Dividido / Vista arranca en `"split"` y sólo aparece en modo Markdown. En pantallas angostas, el modo dividido queda muy apretado: no hay breakpoint que lo colapse solo.
- El botón "Guardar" aparece **sólo si pasás `onSave`**; la flecha de volver, sólo si pasás `onClose`. Sin `onClose`, en `variant="fullscreen"` no hay forma de salir desde el propio componente.
- El contador de palabras cuenta sobre el Markdown crudo, así que las marcas de formato pueden inflar el número.
- El área editable no tiene `aria-label` ni `role="textbox"` explícito: es un `contentEditable` pelado.
