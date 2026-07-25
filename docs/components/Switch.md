# Switch

> Interruptor on/off con thumb animado por spring, para preferencias que se aplican al instante (sin botón "Guardar").

**Import**
```tsx
import { Switch } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para valores booleanos que se aplican **inmediatamente** al cambiar: activar notificaciones, modo oscuro, "recordarme", visibilidad de un campo. La semántica de un switch es "esto está prendido/apagado ahora mismo", a diferencia de un checkbox que suele vivir dentro de un formulario con confirmación posterior.

## Cuándo NO usarlo / alternativas

- Si el valor forma parte de un formulario que se envía con un botón "Guardar"/"Confirmar" (no se aplica al instante), usá `Checkbox` — es la convención visual esperada para ese contexto.
- Si necesitás selección múltiple con "seleccionar todo" e indeterminado, usá `CheckboxGroup`.
- Si el valor tiene más de dos estados, usá `Select` o `Tabs`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `checked` | `boolean` | — (requerido) | Estado actual. Siempre controlado. |
| `onChange` | `(checked: boolean) => void` | — (requerido) | Se llama con el nuevo valor al hacer click (en el switch o en el label). |
| `label` | `ReactNode` | `undefined` | Texto principal a la derecha del switch. |
| `description` | `ReactNode` | `undefined` | Texto secundario debajo del label. |
| `disabled` | `boolean` | `false` | Deshabilita la interacción y atenúa el componente. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño del track y el thumb. |
| `tone` | `"primary" \| "success" \| "danger"` | `"primary"` | Color de fondo cuando está activado (`checked`). |
| `className` | `string` | `""` | Clases para el contenedor raíz. |

## Tipos exportados

```ts
export type SwitchSize = "sm" | "md" | "lg";
export type SwitchTone = "primary" | "success" | "danger";
```

## Ejemplos

### Uso básico
```tsx
const [notifications, setNotifications] = useState(true);

<Switch checked={notifications} onChange={setNotifications} label="Notificaciones push" />
```

### Con descripción y tono
```tsx
<Switch
  checked={autoRenew}
  onChange={setAutoRenew}
  label="Renovación automática"
  description="Se debitará de tu tarjeta guardada cada mes."
  tone="success"
/>
```

### Tamaños
```tsx
<div className="flex items-center gap-4">
  <Switch checked size="sm" onChange={() => {}} />
  <Switch checked size="md" onChange={() => {}} />
  <Switch checked size="lg" onChange={() => {}} />
</div>
```

### Deshabilitado
```tsx
<Switch checked={false} onChange={() => {}} disabled label="Requiere plan Pro" />
```

## Requisitos / dependencias

- Usa `framer-motion` para el spring del thumb (`stiffness: 550, damping: 32`).
- Marcado como `"use client"`.
- Es completamente **controlado**: no hay modo no controlado ni estado interno — igual que `Checkbox`.

## Notas y comportamiento

- El `<button role="switch" aria-checked={checked}>` es el elemento interactivo real; el `<label>` asociado (si hay `label`/`description`) también dispara `onChange` al clickear, con `preventDefault()` sobre el click nativo del label para evitar doble disparo.
- El thumb se desplaza calculando el recorrido disponible (`width - thumb - padding*2`) según el `size`, no con porcentajes — por eso el desplazamiento se ve proporcional en los tres tamaños.
- El color de fondo cuando está apagado es siempre `bg-border` (neutro), independientemente del `tone`; `tone` sólo afecta el color cuando `checked` es `true`.
