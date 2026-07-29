# UnitConverter

> Conversor de unidades genérico y configurable por grupos (largo, peso, volumen, temperatura, etc.), con conversión bidireccional e intercambio rápido.

**Import**
```tsx
import { UnitConverter } from "lib-kit-components";
import type { UnitGroup } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando el producto necesita convertir un valor entre unidades dentro de una misma magnitud: metros a pies, kilos a libras, litros a galones, etc. El componente no trae unidades predefinidas — recibe `groups` con la lista de unidades y su factor de conversión a una unidad base, y arma automáticamente los selectores "De"/"A", el input de valor, el resultado y un botón para invertir el sentido de la conversión. Si se pasa más de un `UnitGroup`, además muestra chips para cambiar de magnitud (ej. "Longitud" / "Peso").

## Cuándo NO usarlo / alternativas

- Si necesitás un rango numérico (no una conversión de unidades), usá [DualRangeSlider](DualRangeSlider.md).
- Si la conversión no es lineal respecto a una unidad base común (ej. temperatura con offset, como Celsius↔Fahrenheit), tené en cuenta que este componente sólo soporta factores multiplicativos simples (`toBase`) — no hace las cuentas correctamente para esos casos sin adaptar los datos primero (ver Notas).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `groups` | `UnitGroup[]` | — (requerido) | Magnitudes disponibles (ej. longitud, peso), cada una con su lista de unidades. |
| `defaultGroup` | `string` | `groups[0]?.id` | `id` del grupo seleccionado al montar. |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

### UnitGroup

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Identificador único del grupo. |
| `label` | `string` | Nombre mostrado en el chip selector de magnitud. |
| `units` | `{ id: string; label: string; toBase: number }[]` | Unidades del grupo. `toBase` es el factor multiplicativo a una unidad base común arbitraria dentro del grupo (ej. metros). |

## Tipos exportados

```ts
interface UnitGroup {
  id: string;
  label: string;
  units: { id: string; label: string; toBase: number }[];
}
```

## Ejemplos

### Un solo grupo (longitud)
```tsx
<UnitConverter
  groups={[
    {
      id: "longitud",
      label: "Longitud",
      units: [
        { id: "m", label: "Metros", toBase: 1 },
        { id: "km", label: "Kilómetros", toBase: 1000 },
        { id: "ft", label: "Pies", toBase: 0.3048 },
        { id: "mi", label: "Millas", toBase: 1609.34 },
      ],
    },
  ]}
/>
```

### Varios grupos con selector de magnitud
```tsx
<UnitConverter
  defaultGroup="peso"
  groups={[
    {
      id: "longitud", label: "Longitud",
      units: [{ id: "m", label: "Metros", toBase: 1 }, { id: "km", label: "Kilómetros", toBase: 1000 }],
    },
    {
      id: "peso", label: "Peso",
      units: [{ id: "kg", label: "Kilos", toBase: 1 }, { id: "lb", label: "Libras", toBase: 0.453592 }],
    },
  ]}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Sin dependencias externas.

## Notas y comportamiento

- Es **no controlado**: el grupo activo, las unidades "de"/"a" y el valor ingresado viven en estado interno; no hay props `value`/`onChange` para leer el resultado desde afuera del componente.
- La conversión es `(input * from.toBase) / to.toBase` — es decir, `toBase` es el factor para llevar esa unidad a una base común del grupo (no necesariamente el SI, cualquier unidad de referencia interna sirve mientras todas las del grupo compartan la misma base). **No soporta conversiones con offset** (como Celsius a Fahrenheit, que no es puramente multiplicativa) — para esos casos hay que resolverlo fuera del componente o aceptar que el resultado será incorrecto.
- Si `input` no es un número parseable (`isNaN`), el resultado se muestra como `"—"` en vez de un error.
- Al cambiar de grupo (`changeGroup`), las unidades "de"/"a" se resetean siempre a las dos primeras del nuevo grupo (`units[0]` y `units[1] ?? units[0]`) — no intenta preservar una selección equivalente.
- El botón de intercambio simplemente invierte `fromUnit`/`toUnit` sin tocar el `input`, por lo que el resultado pasa a ser la conversión inversa del mismo valor ingresado (no fija el resultado anterior como nuevo input).
