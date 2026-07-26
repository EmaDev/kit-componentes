# useFilePicker

> Elegir archivos usando la File System Access API cuando existe (Chrome de escritorio: devuelve handles y permite además *guardar* archivos), y un `<input type="file">` invisible en el resto de navegadores (iOS, Firefox, móviles en general).

**Import**
```ts
import { useFilePicker } from "lib-kit-components";
```

## Cuándo usarlo

Para cualquier flujo de "subir archivo" o "elegir imagen desde la galería/cámara del sistema" (a diferencia de `CameraCapture`, que abre tu propio preview de cámara in-app). También sirve para *guardar* un `Blob` generado en el cliente (un PDF armado, una exportación CSV) con el diálogo nativo "Guardar como" cuando está disponible.

## Cuándo NO usarlo / alternativas

- Si necesitás controlar vos el preview de la cámara (guía visual, revisión antes de confirmar, cambio de cámara), usá `CameraCapture` en vez de `capture` acá.
- Un `<input type="file">` simple alcanza si no necesitás validación de tamaño ni el atajo de guardado — este hook agrega valor sobre todo cuando querés ambas plataformas (handles de escritorio + input móvil) con la misma API.

## Firma

```ts
function useFilePicker(options?: {
  accept?: string;
  multiple?: boolean;
  capture?: "user" | "environment";
  maxSize?: number;
}): {
  pick: () => Promise<File[]>;
  save: (blob: Blob, suggestedName: string) => Promise<boolean>;
  files: File[];
  error: string | null;
  clear: () => void;
}
```

## Parámetros

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `accept` | `string` | `undefined` | Mime type o extensión: `"image/*"`, `".pdf"`. |
| `multiple` | `boolean` | `false` | Permite elegir varios archivos. |
| `capture` | `"user" \| "environment"` | `undefined` | Abre directamente la cámara del sistema en móvil (fuerza el fallback de `<input>`, ver notas). |
| `maxSize` | `number` | `undefined` | Tamaño máximo por archivo en bytes; los que lo excedan se filtran y disparan `error`. |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `pick` | `() => Promise<File[]>` | Abre el selector y devuelve los archivos elegidos (vacío si se canceló). |
| `save` | `(blob: Blob, suggestedName: string) => Promise<boolean>` | Guarda un `Blob`: diálogo nativo si está disponible, o descarga (`<a download>`) si no. |
| `files` | `File[]` | Último resultado de `pick()`. |
| `error` | `string \| null` | Mensaje si algún archivo superó `maxSize`. |
| `clear` | `() => void` | Vacía `files`. |

## Ejemplos

### Elegir una imagen, con límite de tamaño
```tsx
const { pick, files, error } = useFilePicker({ accept: "image/*", maxSize: 5 * 1024 * 1024 });

<button onClick={async () => {
  const picked = await pick();
  if (picked[0]) uploadAvatar(picked[0]);
}}>
  Elegir foto
</button>
{error && <p className="text-danger">{error}</p>}
```

### Exportar y guardar un archivo generado en el cliente
```tsx
const { save } = useFilePicker();

async function exportCsv(rows: Row[]) {
  const blob = new Blob([toCsv(rows)], { type: "text/csv" });
  await save(blob, "reporte.csv");
}
```

## Notas y comportamiento

- **`capture` fuerza el fallback de `<input type="file">`** aunque el navegador soporte `showOpenFilePicker` — la File System Access API no tiene equivalente al atributo `capture`, así que el hook prioriza abrir la cámara del sistema sobre el diálogo de archivos de escritorio cuando pasás esta opción.
- Con `showOpenFilePicker` (Chrome/Edge de escritorio), cancelar el diálogo lanza una excepción que el hook atrapa y traduce a `[]` (no a un error) — cancelar nunca setea `error`.
- `maxSize` filtra en el cliente **después** de elegir los archivos: `files` sólo contiene los que pasan el límite, y `error` muestra el nombre del primero que no pasó (si varios exceden el tamaño, sólo se reporta el primero encontrado).
- `save()` con el diálogo nativo (`showSaveFilePicker`) también puede ser cancelado por el usuario — el hook lo atrapa y devuelve `false`, sin lanzar.
- Sin `showSaveFilePicker` (la mayoría de navegadores no-Chromium), `save()` siempre "tiene éxito" (`true`) porque dispara una descarga directa vía `<a download>` — no hay forma de detectar si el usuario canceló ese diálogo del sistema operativo.
