# Checkbox / CheckboxGroup

> Casilla de verificación animada (`Checkbox`) y su variante para listas de opciones relacionadas con "seleccionar todo" automático (`CheckboxGroup`).

**Import**
```tsx
import { Checkbox, CheckboxGroup } from "lib-kit-components";
```

## Cuándo usarlo

Usá `Checkbox` para un booleano suelto e independiente: aceptar términos y condiciones, activar/desactivar una opción individual. Usá `CheckboxGroup` cuando tenés una **lista** de opciones relacionadas de las que el usuario puede marcar varias (tags, filtros, permisos), especialmente si querés ofrecer una casilla de "seleccionar todo" con estado indeterminado automático.

## Cuándo NO usarlo / alternativas

- Para elegir **un solo** valor de una lista (no varios), usá `Select` en un formulario o un grupo de radios (no incluido en esta librería).
- Si sólo tenés una opción suelta sin relación con otras, no uses `CheckboxGroup` con un solo ítem — usá `Checkbox` directamente.

## Props

### `Checkbox`

Completamente **controlado**: no tiene `defaultChecked` ni estado interno de marcado, siempre depende de `checked` + `onChange`.

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `checked` | `boolean` | — (requerido) | Estado marcado/no marcado. |
| `onChange` | `(checked: boolean) => void` | — (requerido) | Se llama con el nuevo valor al hacer click en la casilla o en el label. |
| `indeterminate` | `boolean` | `false` | Estado mixto (ej. "algunos hijos marcados"). Visualmente muestra un guion en vez del check; tiene prioridad visual sobre `checked` (`aria-checked="mixed"`). |
| `label` | `ReactNode` | `undefined` | Texto/nodo principal, clickeable (togglea el checkbox). |
| `description` | `ReactNode` | `undefined` | Texto secundario debajo del label, vinculado con `aria-describedby`. |
| `disabled` | `boolean` | `false` | Deshabilita la interacción. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño de la casilla (16px / 20px / 24px). |
| `tone` | `"primary" \| "success" \| "danger"` | `"primary"` | Color de fondo/borde cuando está marcada. |
| `error` | `string` | `undefined` | Mensaje de error debajo (también pinta el borde de rojo si no está marcada). |
| `className` | `string` | `""` | Clases para el contenedor raíz. |

### `CheckboxGroup<T extends string>`

`T` es el tipo (string literal o `string`) de los `value` de cada opción — por ejemplo `"admin" | "editor" | "viewer"`.

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `options` | `{ value: T; label: ReactNode; description?: ReactNode; disabled?: boolean }[]` | — (requerido) | Lista de opciones del grupo. |
| `value` | `T[]` | — (requerido) | Array de valores actualmente marcados (controlado). |
| `onChange` | `(value: T[]) => void` | — (requerido) | Se llama con el nuevo array al togglear cualquier opción o "seleccionar todo". |
| `label` | `string` | `undefined` | Título del grupo (texto pequeño en mayúsculas arriba de las opciones). |
| `selectAllLabel` | `string` | `undefined` | Si se define, agrega una casilla "seleccionar todo" arriba, con separador y estado indeterminado automático. |
| `size` | `CheckboxProps["size"]` | `"md"` | Se propaga a todas las casillas internas. |
| `tone` | `CheckboxProps["tone"]` | `"primary"` | Se propaga a todas las casillas internas. |
| `className` | `string` | `""` | Clases para el contenedor raíz (`role="group"`). |

## Ejemplos

### Checkbox individual (términos y condiciones)
```tsx
const [accepted, setAccepted] = useState(false);

<Checkbox
  checked={accepted}
  onChange={setAccepted}
  label="Acepto los términos y condiciones"
  error={!accepted ? "Debés aceptar para continuar" : undefined}
/>
```

### Checkbox con descripción y tono
```tsx
<Checkbox
  checked={notifyByEmail}
  onChange={setNotifyByEmail}
  label="Notificarme por email"
  description="Recibirás un resumen semanal de actividad."
  tone="success"
/>
```

### CheckboxGroup con "seleccionar todo"
```tsx
const [permissions, setPermissions] = useState<string[]>(["read"]);

<CheckboxGroup
  label="Permisos"
  selectAllLabel="Seleccionar todos"
  value={permissions}
  onChange={setPermissions}
  options={[
    { value: "read", label: "Lectura" },
    { value: "write", label: "Escritura" },
    { value: "delete", label: "Eliminación", description: "Acceso irreversible" },
  ]}
/>
```

### CheckboxGroup con opción deshabilitada
```tsx
<CheckboxGroup
  value={selectedTags}
  onChange={setSelectedTags}
  options={[
    { value: "sale", label: "Oferta" },
    { value: "new", label: "Nuevo" },
    { value: "archived", label: "Archivado", disabled: true },
  ]}
/>
```

## Requisitos / dependencias

- Usa `framer-motion` internamente para la animación del check/indeterminado y del mensaje de error.
- Marcado como `"use client"`.
- Ambos son componentes **controlados** — no hay modo no controlado ni `defaultChecked`/`defaultValue`.

## Notas y comportamiento

- En `Checkbox`, hacer click en el `label` también togglea el estado (se llama `e.preventDefault()` y luego `onChange(!checked)` manualmente, no depende del `htmlFor` nativo).
- El indeterminado tiene prioridad visual sobre `checked`: si `indeterminate` es `true`, se muestra el guion aunque `checked` sea `true` o `false`.
- En `CheckboxGroup`, la casilla "seleccionar todo" y su estado indeterminado (`someOn`) se calculan **excluyendo** las opciones con `disabled: true` (variable `selectable`). Togglear "seleccionar todo" sólo agrega/quita las opciones seleccionables; las deshabilitadas no se ven afectadas por esa acción aunque ya estuvieran en `value`.
- El mensaje de `error` en `Checkbox` está indentado (`pl-[30px]`) para alinearse visualmente con el label, no con la casilla.
