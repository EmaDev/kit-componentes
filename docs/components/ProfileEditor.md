# ProfileEditor

> Formulario de edición de perfil: avatar editable (foto o iniciales), datos básicos (nombre, correo, teléfono), bio con contador de caracteres, y guardado con estado de carga/dirty-tracking.

**Import**
```tsx
import { ProfileEditor } from "lib-kit-components";
import type { ProfileFields, AvatarValue } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para la pantalla de "Editar perfil" de un usuario dentro de la app: foto, nombre, correo, teléfono y una bio corta, todo en un único formulario con guardado explícito. Resuelve el flujo completo — cambiar la foto (con selector de archivo integrado), editar los campos, ver si hay cambios sin guardar (`dirty`), y un botón "Guardar cambios" con estado de carga y confirmación visual al terminar.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás mostrar el perfil de un usuario (no editarlo), usá [ProfileCard](Card.md) en su lugar — `ProfileEditor` es un formulario, no una tarjeta de presentación.
- Si tu formulario de perfil necesita campos distintos a los cinco fijos (`avatar`, `name`, `email`, `phone`, `bio`) o un layout distinto, armalo vos mismo con [Input](Input.md)/[Textarea](Textarea.md) — `ProfileEditor` no acepta campos custom ni reordenar/quitar los existentes.
- Si necesitás validación de formato (email inválido, teléfono incompleto) antes de guardar, agregala vos en el consumidor (ej. validando dentro de `onSave` y rechazando la promesa) — el componente no valida nada internamente.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `value` | `ProfileFields` | — (requerido) | Valor inicial del formulario. |
| `onSave` | `(v: ProfileFields) => Promise<void> \| void` | `undefined` | Se llama al tocar "Guardar cambios" con el estado actual del formulario. Puede ser async: el botón queda en estado de carga hasta que resuelva. |
| `bioMaxLength` | `number` | `160` | Largo máximo de la bio; se refleja en el label (`Bio · X/160`) y en el `maxLength` del `<textarea>`. |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

## Tipos exportados

```ts
export interface ProfileFields {
  avatar: AvatarValue;
  name: string;
  email: string;
  phone: string;
  bio: string;
}

/** Foto de perfil como data URL, o null para mostrar iniciales. */
export type AvatarValue = string | null;
```

## Ejemplos

### Uso básico
```tsx
const [perfil] = useState<ProfileFields>({
  avatar: null, name: "Lucía Marín", email: "lucia@mail.com", phone: "+54 9 11 5555-5555", bio: "",
});

<ProfileEditor
  value={perfil}
  onSave={async (v) => { await api.updateProfile(v); }}
/>
```

### Con bio más corta
```tsx
<ProfileEditor value={perfil} bioMaxLength={80} onSave={guardarPerfil} />
```

## Requisitos / dependencias

- No depende de `next` ni de `framer-motion`.
- Marcado como `"use client"`.
- Es **no controlado**: `value` sólo inicializa el estado interno (`useState(value)`); cambios posteriores en la prop `value` desde el padre no se reflejan salvo que remontes el componente (ej. con `key`). Si necesitás sincronizar externamente, usá `key={perfil.id}` sobre `<ProfileEditor>`.
- El selector de avatar lee el archivo con `FileReader.readAsDataURL` (API del navegador, sin dependencias externas) — no sube nada a un servidor por sí mismo; `onChange("data:image/...")` queda dentro de `ProfileFields.avatar` y viaja tal cual a `onSave`, así que si necesitás subir la imagen a un storage, hacelo dentro de `onSave` antes de persistir el resto de los campos.

## Notas y comportamiento

- El picker de avatar (botón circular con iniciales o foto, overlay de cámara al hover) es una pieza **interna** del archivo, no exportada por separado — no hay un `AvatarPicker` público en el barrel de la librería.
- Las iniciales del avatar se calculan igual que en `ProfileCard`: primera letra de las dos primeras palabras de `name`, en mayúsculas.
- `dirty` se calcula comparando `JSON.stringify(f) !== JSON.stringify(value)` en cada render — cualquier cambio en cualquier campo (incluida la foto) habilita el botón "Guardar cambios"; sin cambios, el botón queda deshabilitado.
- El mensaje "Guardado" sólo se muestra si `saved && !dirty`; volver a tocar cualquier campo después de guardar lo oculta automáticamente (`set` resetea `saved` a `false` en cada edición).
- El botón queda deshabilitado tanto sin cambios (`!dirty`) como durante el guardado (`busy`), evitando doble submit.
