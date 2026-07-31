# QuickNotePad

> Botón flotante que despliega un bloc de notas en un BottomSheet: viñetas y numeración con continuación automática, y selector de emojis.

**Import**
```tsx
import { QuickNotePad } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para capturar una idea al vuelo sin salir de la pantalla actual: una nota sobre un cliente, un pendiente que surge en una reunión, un recordatorio. Trae todo armado — el FAB, el sheet, la barra de formato y el guardado — así que se monta con una línea.

## Cuándo NO usarlo / alternativas

- Si el usuario va a escribir un documento largo con títulos y estructura, usá [DocumentEditor](DocumentEditor.md) — este bloc es para texto corto.
- Si necesitás texto enriquecido real (HTML) en un formulario, usá [RichTextEditor](RichTextEditor.md).
- Si el FAB tiene que ofrecer **varias** acciones con su propio sheet cada una, usá [FabActionSheets](FabActionSheets.md).
- Si es un campo de texto más dentro de un formulario, usá [Textarea](Textarea.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `position` | `"bottom-right" \| "bottom-left" \| "bottom-center"` | `"bottom-right"` | Posición del botón flotante. |
| `tone` | `"primary" \| "accent" \| "success" \| "danger"` | `"primary"` | Color del botón flotante. |
| `title` | `string` | `"Nota rápida"` | Título del BottomSheet. |
| `placeholder` | `string` | `"Escribí algo…"` | Placeholder del textarea. |
| `storageKey` | `string` | `undefined` | Si se pasa, el borrador se persiste en `localStorage` con esa clave y se recupera al montar. |
| `onSave` | `(text: string) => void` | `undefined` | Se llama al tocar "Guardar", con el texto ya recortado (`trim()`). |
| `absolute` | `boolean` | `false` | `absolute` en vez de `fixed`, para montarlo dentro de un contenedor (mocks, previews). |
| `className` | `string` | `""` | Clases adicionales en el contenedor del botón flotante. |

## Ejemplos

### Uso básico
```tsx
<QuickNotePad onSave={(texto) => api.crearNota(texto)} />
```

### Con borrador que sobrevive al cierre de la app
```tsx
<QuickNotePad
  storageKey="notas.borrador"
  title="Nueva nota"
  placeholder="¿Qué se te ocurrió?"
  onSave={guardarNota}
/>
```

### Dentro de un contenedor acotado
```tsx
<div className="relative h-[560px] overflow-hidden rounded-2xl border border-border">
  <Pantalla />
  <QuickNotePad absolute tone="accent" />
</div>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Requiere `framer-motion` (tap del FAB y entrada/salida del panel de emojis) y depende de [BottomSheet](BottomSheet.md) del propio kit.
- No depende de Next.js.
- Con `storageKey` usa `localStorage` directo, envuelto en `try/catch`: si el navegador lo bloquea (modo privado en algunos casos, cookies deshabilitadas) el componente sigue funcionando sin persistir, en silencio.
- Usa los tokens `--color-primary`, `--color-accent`, `--color-success`, `--color-danger`, `--color-surface`, `--color-surface-alt`, `--color-border` y `--color-muted`.

## Notas y comportamiento

- **El texto que guarda es Markdown-ish, no HTML.** Los botones `B` y `U` envuelven la selección en `**` y `__`; las viñetas insertan `• ` y la numeración `1. `. Lo que llega a `onSave` es texto plano con esas marcas: renderizarlo con formato es tarea de quien lo consume.
- **`Enter` continúa la lista**: en un renglón que empieza con `•`, `-` o `N.`, `Enter` crea el siguiente ítem (y en las numeradas incrementa el número). En un renglón que sólo tiene la viñeta, `Enter` sale de la lista y borra el prefijo — igual que en un editor de verdad.
- Los botones de viñeta y numeración funcionan como **toggle sobre las líneas seleccionadas**: si todas ya tienen prefijo, lo quitan.
- La numeración se recalcula por posición dentro de la selección (`1.`, `2.`, `3.`…), no continúa desde un número previo fuera de ella.
- **"Guardar" limpia el textarea y cierra el sheet**, y con `storageKey` también borra el borrador persistido. Si `onSave` es asíncrono y falla, el texto ya se perdió: hacé el guardado optimista con cuidado, o manejá el error devolviendo el texto a la UI por tu cuenta.
- El borrador se persiste **en cada tecla** (un `setItem` por cambio de `text`), y se borra cuando el texto queda vacío.
- "Borrar" vacía el textarea sin confirmación.
- El FAB alterna el sheet (toca de nuevo y se cierra) y expone `aria-label="Nota rápida"` y `aria-expanded`.
- Al abrirse enfoca el textarea automáticamente; al cerrarse, colapsa el selector de emojis.
- La lista de emojis es fija (24, definidos en el módulo) y no es configurable por props.
- El sheet es `size="md"` fijo: no hay prop para cambiar la altura.
- El FAB se posiciona respetando `env(safe-area-inset-bottom)` cuando es `fixed`, así que no queda tapado por el home indicator en iOS.
