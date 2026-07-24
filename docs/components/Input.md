# Input

> Campo de texto de una sola línea con label flotante animado, ícono opcional, estado de error y hint.

**Import**
```tsx
import { Input } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para cualquier campo de formulario de una sola línea: email, nombre, contraseña, búsqueda, etc. Incluye label flotante (estilo Material), mensaje de ayuda (`hint`) o de error, animación de "sacudida" cuando aparece un error, e íconos a izquierda/derecha. Funciona controlado (`value` + `onChange`) o no controlado (`defaultValue`).

## Cuándo NO usarlo / alternativas

- Para texto de varias líneas (comentarios, descripciones largas) usá `Textarea`, que además soporta auto-resize y contador de caracteres.
- Para elegir un valor de una lista cerrada de opciones (en vez de tipear texto libre) usá `Select`.

## Props

`InputProps` extiende `InputHTMLAttributes<HTMLInputElement>` (sin `onAnimationStart`, `onAnimationEnd`, `onDrag`, `onDragStart`, `onDragEnd`, que están excluidos por conflicto de tipos con Framer Motion). El componente hace `forwardRef<HTMLInputElement>`.

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `undefined` | Etiqueta flotante. Si no se pasa, no se renderiza ninguna etiqueta. |
| `hint` | `string` | `undefined` | Texto de ayuda debajo del input. Se oculta si hay `error`. |
| `error` | `string` | `undefined` | Mensaje de error. Cuando está presente: pinta el borde y el label de rojo, dispara una animación de sacudida horizontal, y reemplaza al `hint`. |
| `leftIcon` | `ReactNode` | `undefined` | Ícono a la izquierda (agrega padding interno `pl-11`). |
| `rightIcon` | `ReactNode` | `undefined` | Ícono a la derecha (agrega padding interno `pr-11`). |
| `value` | `string` | `undefined` | Valor controlado. |
| `defaultValue` | `string` | `undefined` | Valor inicial no controlado. |
| `placeholder` | `string` | `undefined` | Ver nota de comportamiento abajo — sólo se muestra mientras el input está enfocado. |
| `className` | `string` | `""` | Clases para el `<div>` contenedor (no para el `<input>` en sí). |
| ...resto | atributos nativos de `<input>` | — | `type`, `name`, `disabled`, `maxLength`, `onChange`, `onFocus`, `onBlur`, etc. |

## Ejemplos

### Uso básico
```tsx
<Input label="Nombre completo" placeholder="Juan Pérez" />
```

### Controlado con validación
```tsx
const [email, setEmail] = useState("");

<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={!isValidEmail(email) ? "Ingresá un email válido" : undefined}
/>
```

### Con íconos y hint
```tsx
<Input
  label="Buscar"
  leftIcon={<SearchIcon className="w-4 h-4" />}
  hint="Buscá por nombre o SKU"
/>

<Input
  label="Contraseña"
  type="password"
  rightIcon={<EyeIcon className="w-4 h-4" />}
/>
```

## Requisitos / dependencias

- Usa `framer-motion` internamente para el label flotante, la barra de foco y la sacudida por error.
- Marcado como `"use client"`.
- Depende de las variables CSS del tema (`--color-primary`, `--color-danger`, `--color-muted`).

## Notas y comportamiento

- El label "flota" (se achica y sube) cuando el input está enfocado, tiene valor, **o cuando se pasa `placeholder`** — este último caso es una particularidad importante: si definís `placeholder`, el label queda flotado permanentemente (aunque el input esté vacío y sin foco), porque el `placeholder` nativo del `<input>` sólo se renderiza mientras está enfocado (`placeholder={focused ? placeholder : ""}`). Si no querés el label siempre arriba, no pases `placeholder`.
- La detección de "tiene valor" para el label se basa en estado interno (`hasValue`) que se actualiza en `onChange`/`onBlur`, así que en modo controlado con cambios externos al DOM (fuera de `onChange`) podría desincronizarse visualmente.
- El `id` del input se genera automáticamente con `useId()` y se vincula al `label` vía `htmlFor`.
- Cuando hay `error`, el input hace una animación de sacudida (`x: [0, -6, 6, -4, 4, 0]`, 0.4s) cada vez que cambia el string de error.
