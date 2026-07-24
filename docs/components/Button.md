# Button

> Botón de acción con variantes de color, tamaños, estado de carga y efecto ripple, animado con Framer Motion.

**Import**
```tsx
import { Button } from "lib-kit-components";
```

## Cuándo usarlo

Es el botón base de la librería: úsalo para cualquier acción primaria o secundaria disparada por el usuario (enviar un formulario, confirmar, navegar, abrir un modal, etc.). Soporta iconos a izquierda/derecha, un estado `loading` que reemplaza visualmente el contenido por un spinner sin cambiar el tamaño del botón, y un efecto de ripple táctil activado por defecto. Es un `<button>` real (vía `motion.button`), así que hereda todos los atributos nativos (`type`, `form`, `aria-*`, `onClick`, etc.).

## Cuándo NO usarlo / alternativas

- Si necesitás un menú de acciones anclado a un trigger (editar/eliminar/duplicar), combiná `Button` como `trigger` de `Dropdown` en vez de construir la lógica de apertura a mano.
- Si sólo necesitás mostrar un indicador de carga suelto (no asociado a un click), usá `Spinner` directamente en vez de un `Button` con `loading`.

## Props

`ButtonProps` extiende `Omit<HTMLMotionProps<"button">, "ref">`, es decir todos los atributos nativos de `<button>` (`type`, `disabled`, `form`, `aria-*`, `onClick`, etc.) más las props de animación de Framer Motion (`whileHover`, `whileTap`, `transition`, etc.). Como estas últimas se pueden pasar por `...rest`, **sobrescriben** los valores internos por defecto (`whileHover={{ y: -1 }}`, `whileTap={{ scale: 0.97, y: 0 }}`) si el consumidor las define explícitamente.

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `variant` | `"primary" \| "secondary" \| "ghost" \| "danger" \| "success" \| "outline"` | `"primary"` | Estilo de color del botón. |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | `"md"` | Tamaño. `"icon"` es un botón cuadrado de 44×44px pensado para un solo ícono sin texto. |
| `loading` | `boolean` | `false` | Muestra un spinner superpuesto y deshabilita el botón (oculta el contenido con `opacity-0`, pero mantiene el tamaño/layout). |
| `leftIcon` | `ReactNode` | `undefined` | Nodo renderizado antes del contenido. |
| `rightIcon` | `ReactNode` | `undefined` | Nodo renderizado después del contenido. |
| `fullWidth` | `boolean` | `false` | Si es `true`, el botón ocupa `w-full`. |
| `ripple` | `boolean` | `true` | Activa/desactiva el efecto de onda circular al hacer click. El color del ripple es oscuro para las variantes claras (`secondary`, `ghost`, `outline`) y claro para las variantes de fondo sólido. |
| `disabled` | `boolean` | `undefined` | Deshabilita el botón (también se deshabilita automáticamente si `loading` es `true`). |
| `children` | `ReactNode` | `undefined` | Contenido del botón. |
| `className` | `string` | `""` | Clases adicionales, se concatenan al final (pueden sobrescribir estilos por especificidad de Tailwind). |

## Ejemplos

### Uso básico
```tsx
<Button onClick={() => console.log("click")}>Guardar</Button>
```

### Variantes y tamaños
```tsx
<Button variant="secondary" size="sm">Cancelar</Button>
<Button variant="danger">Eliminar</Button>
<Button variant="outline">Ver más</Button>
<Button variant="success" size="lg">Confirmar pedido</Button>
```

### Con iconos y estado de carga
```tsx
<Button leftIcon={<PlusIcon />} onClick={handleAdd}>
  Agregar producto
</Button>

<Button loading={isSubmitting} fullWidth type="submit">
  Enviar
</Button>
```

### Botón de solo ícono
```tsx
<Button size="icon" variant="ghost" aria-label="Cerrar">
  <XIcon />
</Button>
```

## Requisitos / dependencias

- Usa `framer-motion` internamente (`motion.button`, `AnimatePresence`) — es peer dependency del paquete.
- Marcado como `"use client"`: sólo puede usarse en Client Components de Next.js.
- Los colores dependen de las variables CSS del tema (`--color-primary`, `--color-danger`, `--color-success`, etc.) definidas en `lib-kit-components/styles.css` o equivalentes en el proyecto consumidor.

## Notas y comportamiento

- El ripple es puramente decorativo: se agrega un `<span>` animado por click y se limpia solo a los 700ms; no interfiere con `onClick`, que se sigue disparando normalmente.
- Cuando `loading` es `true`, el botón queda `disabled` automáticamente (no hace falta pasar `disabled` a mano).
- El contenido (`children`, `leftIcon`, `rightIcon`) no se desmonta durante `loading`, sólo se oculta con `opacity-0`, así el ancho del botón no "salta".
- Al ser `Omit<HTMLMotionProps<"button">, "ref">`, cualquier prop de motion (`whileHover`, `animate`, `transition`, etc.) que pases explícitamente pisa el comportamiento animado por defecto — útil para casos custom, pero puede sorprender si no se espera.
