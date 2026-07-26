# useNfc

> Lectura y escritura de tags NFC vía Web NFC (sólo Android/Chrome, HTTPS y gesto del usuario). Útil para credenciales, control de acceso o inventario donde el usuario acerca un tag físico al dispositivo.

**Import**
```ts
import { useNfc, type NfcTag } from "lib-kit-components";
```

## Cuándo usarlo

Cuando tu app necesita leer o escribir tags NFC físicos: check-in con una credencial NFC, escaneo de inventario con etiquetas NFC, o compartir un link/texto acercando dos dispositivos. Es una API de plataforma muy acotada (sólo Chrome en Android) — siempre revisá `supported` antes de mostrar cualquier UI relacionada.

## Firma

```ts
function useNfc(): {
  supported: boolean;
  scanning: boolean;
  tag: NfcTag | null;
  error: string | null;
  scan: () => Promise<boolean>;
  write: (text: string) => Promise<boolean>;
  stop: () => void;
}

interface NfcTag {
  serialNumber: string;
  records: { type: string; text: string }[];
}
```

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `supported` | `boolean` | El navegador expone `NDEFReader` (Web NFC). |
| `scanning` | `boolean` | Hay un escaneo activo esperando que se acerque un tag. |
| `tag` | `NfcTag \| null` | Último tag leído. |
| `error` | `string \| null` | Mensaje del último error. |
| `scan` | `() => Promise<boolean>` | Arranca el escaneo. Devuelve si pudo activarse (no si ya leyó algo). |
| `write` | `(text: string) => Promise<boolean>` | Escribe un registro de texto en el próximo tag que se acerque. |
| `stop` | `() => void` | Cancela el escaneo en curso. |

## Ejemplos

### Leer un tag de control de acceso
```tsx
function NfcCheckin() {
  const { supported, scanning, tag, error, scan, stop } = useNfc();
  if (!supported) return <p>Este dispositivo no soporta NFC.</p>;

  return (
    <>
      <Button onClick={scanning ? stop : scan}>{scanning ? "Cancelar" : "Acercar tag"}</Button>
      {tag && <p>Leído: {tag.serialNumber} — {tag.records.map((r) => r.text).join(", ")}</p>}
      {error && <p className="text-danger">{error}</p>}
    </>
  );
}
```

### Escribir un tag
```tsx
const { write } = useNfc();
await write("https://miapp.com/producto/123");
```

## Notas y comportamiento

- `scan()` arranca un escaneo **continuo**: cada vez que se acerca un tag nuevo, dispara el evento `reading` y actualiza `tag` — no hay que volver a llamar a `scan()` por cada lectura, sólo una vez para dejar el lector activo.
- El escaneo se puede cancelar en cualquier momento con `stop()` (usa un `AbortController` interno), y se aborta automáticamente al desmontar el componente.
- `write()` es **una sola escritura**: espera al próximo tag que se acerque y le escribe el texto — no queda "escuchando" como `scan()`.
- Los registros NFC (`records`) se decodifican como texto plano (`TextDecoder`) sin importar el `recordType` original — para tags con formatos binarios o URIs estructuradas, vas a necesitar decodificar `data` vos mismo a partir del tipo de registro.
- Requiere Android + Chrome, HTTPS, y que `scan()`/`write()` se llamen dentro de un gesto directo del usuario — no hay ningún fallback para el resto de las plataformas.
