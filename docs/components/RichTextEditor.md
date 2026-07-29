# RichTextEditor

> Editor de texto enriquecido simple (negrita, cursiva, lista y enlace) sobre un `div` `contentEditable`, con salida en HTML.

**Import**
```tsx
import { RichTextEditor } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando el usuario tiene que escribir contenido con formato básico que se va a renderizar como HTML: descripciones de producto, notas, cuerpo de un post corto. Ofrece una barra con 4 acciones (negrita, cursiva, lista con viñetas, enlace) y devuelve el contenido como string HTML vía `onChange`.

## Cuándo NO usarlo / alternativas

- Si el campo es texto plano sin formato (nombre, comentario corto, dirección), usá [Textarea](Textarea.md) — mucho más liviano y sin las implicancias de seguridad de manejar HTML.
- Si necesitás un editor de texto enriquecido robusto (deshacer/rehacer confiable, pegado limpio desde Word/Google Docs, más formatos, extensible con plugins), este componente **no** lo reemplaza: usa `document.execCommand`, una API deprecada y con comportamiento inconsistente entre navegadores — es intencionalmente mínimo para casos simples, no un reemplazo de un editor tipo Tiptap/Slate.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `value` | `string` | — (requerido) | Contenido HTML controlado (se inyecta con `dangerouslySetInnerHTML`). |
| `onChange` | `(html: string) => void` | — (requerido) | Se llama en cada `input` del editor y tras ejecutar un comando de la barra, con el `innerHTML` resultante. |
| `placeholder` | `string` | `"Escribí acá…"` | Texto placeholder mostrado (absoluto, superpuesto) cuando el editor está vacío. |
| `minHeight` | `number` | `120` | Alto mínimo en píxeles del área editable. |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

## Ejemplos

### Uso básico
```tsx
const [html, setHtml] = useState("<p>Contenido inicial</p>");

<RichTextEditor value={html} onChange={setHtml} />
```

### Con placeholder y alto custom
```tsx
<RichTextEditor
  value={html}
  onChange={setHtml}
  placeholder="Contanos sobre el producto…"
  minHeight={200}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Usa `document.execCommand` (API deprecada del DOM, pero todavía soportada en todos los navegadores mayores) para aplicar negrita/cursiva/lista/enlace — no depende de ninguna librería de terceros.
- El botón "Enlace" usa `window.prompt` nativo para pedir la URL.

## Notas y comportamiento

- El contenido HTML se inyecta con `dangerouslySetInnerHTML={{ __html: value }}` **una sola vez al montar** (React no vuelve a sincronizar el DOM del `contentEditable` en cada render, es el patrón estándar para editores `contentEditable`) — si necesitás resetear el contenido programáticamente (ej. al cambiar de registro), hay que forzar un remount del componente (ej. con `key`).
- El `value` que recibe **no se sanitiza**: si viene de una fuente no confiable (ej. pegado desde otra página) o se vuelve a mostrar en otro lado, hay que sanitizarlo antes de renderizarlo fuera del editor, ya que se guarda tal cual como HTML.
- El placeholder se calcula con estado interno (`empty`) basado en `textContent?.trim()`, no en `value` directamente — por eso persiste correctamente aunque `value` tenga sólo tags vacíos (ej. `"<p></p>"`).
- No expone ningún tipo exportado adicional — sólo el componente.
