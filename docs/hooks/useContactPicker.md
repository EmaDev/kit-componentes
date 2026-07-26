# useContactPicker

> Selector de contactos del sistema (Contact Picker API, Android/Chrome): el usuario elige qué contacto compartir desde su agenda — nunca tenés acceso a la agenda completa.

**Import**
```ts
import { useContactPicker, type PickedContact } from "lib-kit-components";
```

## Cuándo usarlo

Para cualquier campo que necesite "elegir un contacto" en vez de escribirlo a mano: invitar a un amigo, cargar un destinatario de transferencia, agregar un contacto de emergencia. Al ser una selección explícita y puntual del usuario (no una lectura masiva de la agenda), no requiere un permiso previo del tipo `PermissionGate` — el propio diálogo nativo del sistema **es** el permiso.

## Cuándo NO usarlo / alternativas

- Sin soporte (`supported: false` — hoy sólo Android/Chrome; sin soporte en iOS, desktop ni Firefox), no hay fallback automático: mostrá un input de texto normal para nombre/teléfono/email.

## Firma

```ts
function useContactPicker(): {
  supported: boolean;
  pick: (multiple?: boolean) => Promise<PickedContact[]>;
  contacts: PickedContact[];
}

interface PickedContact {
  name?: string;
  tel?: string;
  email?: string;
}
```

## Parámetros

`pick(multiple)`: `multiple` (default `false`) permite elegir más de un contacto en el mismo diálogo.

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `supported` | `boolean` | El navegador expone la Contact Picker API. |
| `pick` | `(multiple?: boolean) => Promise<PickedContact[]>` | Abre el selector nativo. Devuelve `[]` si el usuario cancela o no hay soporte. |
| `contacts` | `PickedContact[]` | Último resultado de `pick()`. |

## Ejemplos

### Invitar a un contacto
```tsx
function InviteButton() {
  const { supported, pick } = useContactPicker();
  if (!supported) return <input placeholder="Nombre y teléfono" />;
  return (
    <button onClick={async () => {
      const [contact] = await pick();
      if (contact) sendInvite(contact);
    }}>
      Elegir de mis contactos
    </button>
  );
}
```

### Selección múltiple
```tsx
const { pick } = useContactPicker();
const invitados = await pick(true);
```

## Notas y comportamiento

- El hook sólo pide las propiedades (`name`/`tel`/`email`) que la implementación del navegador realmente soporta (`getProperties()`) — pedir una propiedad no soportada puede rechazar la llamada completa, por eso se filtra antes de llamar a `select()`.
- Cada propiedad devuelve un array (un contacto puede tener varios teléfonos); el hook toma sólo el **primer** valor de cada una (`name?.[0]`, `tel?.[0]`, `email?.[0]`) para simplificar el consumo — si necesitás todos los valores, no uses este hook, llamá a la API cruda.
- Cancelar el diálogo nativo no es un error: se atrapa en el `try/catch` interno y resuelve `[]` en silencio.
- Requiere HTTPS y que `pick()` se llame dentro de un gesto directo del usuario (click/tap).
