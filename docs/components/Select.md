# Select

> Campo de formulario para elegir un único valor de una lista cerrada de opciones, con menú desplegable animado.

**Import**
```tsx
import { Select } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando necesitás que el usuario elija **un** valor de una lista predefinida dentro de un formulario: país, categoría, estado de un pedido, método de pago, etc. Tiene el mismo lenguaje visual que `Input`/`Textarea` (label, hint, error) y soporta modo controlado o no controlado.

## Cuándo NO usarlo / alternativas

- Si lo que necesitás es un menú de **acciones** (editar, eliminar, duplicar, compartir) anclado a un botón, avatar o ícono — no capturar un valor de formulario — usá `Dropdown`.
- Si las opciones son muchas (cientos) o necesitás búsqueda/autocompletado, este componente no lo provee out-of-the-box; tendrías que extenderlo o construir un combobox aparte.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `options` | `SelectOption[]` | — (requerido) | Lista de opciones a mostrar. |
| `value` | `string` | `undefined` | Valor controlado. Si se pasa (aunque sea `""`), el componente queda en modo controlado. |
| `defaultValue` | `string` | `undefined` | Valor inicial en modo no controlado. |
| `onChange` | `(value: string) => void` | `undefined` | Se llama al elegir una opción. |
| `placeholder` | `string` | `"Selecciona…"` | Texto mostrado cuando no hay opción seleccionada. |
| `label` | `string` | `undefined` | Etiqueta fija arriba del control (no es flotante como en `Input`). |
| `error` | `string` | `undefined` | Mensaje de error; pinta el borde de rojo. |
| `hint` | `string` | `undefined` | Texto de ayuda (se ignora si hay `error`). |
| `disabled` | `boolean` | `false` | Deshabilita el control. |
| `className` | `string` | `""` | Clases para el contenedor raíz. |

## Tipos exportados

```ts
export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}
```

## Ejemplos

### Uso básico (no controlado)
```tsx
<Select
  label="País"
  placeholder="Elegí un país"
  options={[
    { value: "ar", label: "Argentina" },
    { value: "br", label: "Brasil" },
    { value: "cl", label: "Chile" },
  ]}
  onChange={(value) => console.log(value)}
/>
```

### Controlado con valor inicial y error
```tsx
const [status, setStatus] = useState("pending");

<Select
  label="Estado del pedido"
  value={status}
  onChange={setStatus}
  error={!status ? "Seleccioná un estado" : undefined}
  options={[
    { value: "pending", label: "Pendiente" },
    { value: "shipped", label: "Enviado" },
    { value: "delivered", label: "Entregado" },
  ]}
/>
```

### Con íconos y opciones deshabilitadas
```tsx
<Select
  label="Método de pago"
  options={[
    { value: "card", label: "Tarjeta", icon: <CardIcon className="w-4 h-4" /> },
    { value: "cash", label: "Efectivo", icon: <CashIcon className="w-4 h-4" /> },
    { value: "crypto", label: "Cripto", icon: <CoinIcon className="w-4 h-4" />, disabled: true },
  ]}
  defaultValue="card"
/>
```

## Requisitos / dependencias

- Usa `framer-motion` internamente para la animación de apertura/cierre del menú y el ícono de check compartido (`layoutId="select-check"`).
- Marcado como `"use client"`.
- No depende de un `<select>` nativo: es un `<button>` + lista custom (`<ul>`/`<li>`), por lo que el estilo es 100% controlable pero la semántica de accesibilidad de listbox nativo no aplica (ver notas).

## Notas y comportamiento

- El menú se cierra automáticamente al hacer click fuera del componente (listener `mousedown` en `document`) o al presionar `Escape`.
- La opción seleccionada se resalta y muestra un ícono de check animado con `layoutId="select-check"` (transición compartida de Framer Motion entre selecciones).
- Es un componente custom, **no** un `<select>` nativo ni usa roles ARIA de `listbox`/`option`/`aria-expanded`; si tu proyecto necesita compatibilidad estricta con lectores de pantalla, revisá si esto es suficiente para tu caso.
- El estado abierto/cerrado y la opción seleccionada son independientes: podés controlar `value` desde afuera sin controlar la apertura del menú.
- Las opciones con `disabled: true` no disparan `onChange` al clickearlas (el botón interno queda `disabled`).
