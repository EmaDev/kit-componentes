# useClipboard

> Copiar (y leer) el portapapeles, con feedback de "copiado" temporizado y fallback automático para navegadores sin Clipboard API o contextos no seguros (`http://`).

**Import**
```ts
import { useClipboard } from "lib-kit-components";
```

## Cuándo usarlo

Para cualquier botón de "copiar" (código de cupón, link para compartir, número de cuenta, IBAN) donde quieras mostrar un check/confirmación temporal sin armar el `setTimeout` a mano. `CouponCode` ya resuelve este patrón internamente para su propio caso de uso — usá `useClipboard` directo cuando necesités el mismo comportamiento en un botón propio.

## Firma

```ts
function useClipboard(resetMs?: number): {
  copy: (text: string) => Promise<boolean>;
  read: () => Promise<string | null>;
  copied: boolean;
  error: string | null;
}
```

## Parámetros

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `resetMs` | `number` | `1800` | Milisegundos tras los cuales `copied` vuelve a `false` automáticamente. |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `copy` | `(text: string) => Promise<boolean>` | Copia `text` al portapapeles. Devuelve si tuvo éxito. |
| `read` | `() => Promise<string \| null>` | Lee el portapapeles (requiere permiso y, en la mayoría de los navegadores, un gesto directo del usuario). `null` si falla. |
| `copied` | `boolean` | `true` durante `resetMs` después de un `copy()` exitoso — usalo para mostrar un ícono de check temporal. |
| `error` | `string \| null` | Mensaje legible si el último `copy`/`read` falló. |

## Ejemplos

### Botón de copiar con feedback visual
```tsx
function CopyButton({ text }: { text: string }) {
  const { copy, copied } = useClipboard();
  return (
    <button onClick={() => copy(text)}>
      {copied ? "¡Copiado!" : "Copiar"}
    </button>
  );
}
```

### Pegar desde el portapapeles (por ejemplo, un código pegado)
```tsx
const { read } = useClipboard();

async function onPasteClick() {
  const text = await read();
  if (text) setCode(text.trim());
}
```

## Notas y comportamiento

- `copy()` intenta primero `navigator.clipboard.writeText` (async, requiere contexto seguro); si falla o no existe, cae a un fallback con un `<textarea>` invisible + `document.execCommand("copy")`, que funciona en más navegadores viejos y en `http://` no seguro.
- El estado `copied` se resetea con un único `setTimeout` por llamada: copiar dos veces seguidas reinicia el temporizador (`clearTimeout` del anterior) en vez de acumular resets.
- `read()` **no** tiene fallback: sólo funciona donde existe `navigator.clipboard.readText`, que además suele exigir el permiso `clipboard-read` (podés pedirlo antes con `PermissionGate kind="clipboard-read"` o `usePermission("clipboard-read")`) y, en la mayoría de los navegadores, que la llamada ocurra dentro de un gesto directo del usuario (click), no en un `useEffect`.
- `error` queda seteado hasta el próximo intento — no se limpia solo con el tiempo como sí lo hace `copied`.
