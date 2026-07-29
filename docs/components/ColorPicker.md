# ColorPicker

> Selector de un único color: paleta curada de 10 swatches + recientes + picker nativo `<input type="color">` opcional para color custom.

**Import**
```tsx
import { ColorPicker } from "lib-kit-components";
```

## Cuándo usarlo

Usalo como campo de formulario cuando el usuario tiene que elegir **un** color puntual: color de una etiqueta, de una categoría, de un evento en un calendario, de una variante de producto. Muestra un preview del color elegido (swatch + código hex), una paleta curada de colores por default, los últimos colores usados en la sesión, y opcionalmente un link que abre el color picker nativo del navegador para elegir cualquier color.

## Cuándo NO usarlo / alternativas

- Si lo que necesitás es editar la **paleta de diseño completa de la app** (los 10 tokens `--color-*`: primario, acento, superficies, texto, estados) con presets de tema, preview en vivo y export a CSS/JSON, usá [ThemeConfigurator](ThemeConfigurator.md) — `ColorPicker` es un campo de formulario para un solo valor, no un editor de theming.
- Si el color es fijo y sólo se muestra (no se elige), no uses `ColorPicker` — es exclusivamente un input interactivo.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `value` | `string` | — (requerido) | Color actual en formato hex (ej. `"#2563eb"`), controlado. |
| `onChange` | `(hex: string) => void` | — (requerido) | Se llama al elegir un swatch, un reciente, o un color custom. |
| `palette` | `string[]` | 10 colores curados (`#2563eb`, `#7c3aed`, `#db2777`, `#ef4444`, `#f59e0b`, `#84cc16`, `#0ea5e9`, `#14b8a6`, `#64748b`, `#0f172a`) | Swatches fijos mostrados en la grilla principal. |
| `allowCustom` | `boolean` | `true` | Si se muestra el link "Elegir un color personalizado" que abre el `<input type="color">` nativo del sistema operativo/navegador. |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

## Ejemplos

### Uso básico
```tsx
const [color, setColor] = useState("#2563eb");

<ColorPicker value={color} onChange={setColor} />
```

### Paleta custom sin color personalizado
```tsx
<ColorPicker
  value={color}
  onChange={setColor}
  palette={["#f87171", "#fb923c", "#facc15", "#4ade80", "#60a5fa"]}
  allowCustom={false}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- El color custom depende del `<input type="color">` nativo del navegador (soporte universal en navegadores modernos; la UI del picker la controla el sistema operativo, no es estilizable).

## Notas y comportamiento

- Es un componente **controlado**: `value` viene siempre de afuera; el único estado interno es la lista de `recents` (colores recientes de la sesión actual, se pierde al desmontar — no persiste).
- Los "recientes" se actualizan con cualquier color elegido (swatch, reciente previo o custom), moviéndolo al frente y sin duplicados, limitado a 6.
- La comparación para resaltar el swatch activo (`ring-2 ring-primary`) es case-insensitive (`toLowerCase()`), pero no normaliza formatos (ej. `#fff` vs `#ffffff` no matchean).
- No expone ningún tipo exportado adicional — sólo el componente.
