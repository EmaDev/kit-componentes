# CurrencySelector

> Selector de moneda tipo dropdown, buscable por código o nombre, con bandera y cotización opcional respecto de una moneda base.

**Import**
```tsx
import { CurrencySelector } from "lib-kit-components";
```

## Cuándo usarlo

Para que el usuario elija **una** moneda entre varias opciones (moneda de visualización de la billetera, moneda de un formulario de pago, moneda destino de una conversión), con búsqueda por texto cuando la lista es larga, y opcionalmente mostrando de un vistazo la cotización de cada una contra una moneda base (`baseCode`).

## Cuándo NO usarlo / alternativas

- Si el objetivo no es elegir una moneda sino comparar cuánto te da cada **proveedor** por convertir un monto ya fijado entre dos monedas concretas, usá [RateComparator](RateComparator.md) — ahí las opciones son casas de cambio/proveedores, no monedas, y el resultado incluye comisión y monto neto a recibir.
- Si sólo necesitás un combo genérico sin bandera/cotización, usá [Select](Select.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `options` | `CurrencyOption[]` | — (requerido) | Monedas disponibles. |
| `value` | `string` | — (requerido) | Código de la moneda seleccionada (controlado). |
| `onChange` | `(code: string) => void` | — (requerido) | Se llama al elegir una opción, con el `code` elegido. |
| `baseCode` | `string` | `undefined` | Código de la moneda base; si se pasa junto con `option.rate`, muestra `"1 {baseCode} = {rate} {code}"` en cada fila. |
| `className` | `string` | `""` | Clases adicionales para el contenedor relativo. |

## Tipos exportados

```ts
interface CurrencyOption {
  code: string;    // ej. "USD"
  name: string;    // ej. "Dólar estadounidense"
  flag?: string;   // emoji, ej. "🇺🇸"
  rate?: number;   // cotización respecto de baseCode
}
```

## Ejemplos

### Básico
```tsx
const [currency, setCurrency] = useState("ARS");

<CurrencySelector
  value={currency}
  onChange={setCurrency}
  options={[
    { code: "ARS", name: "Peso argentino", flag: "🇦🇷" },
    { code: "USD", name: "Dólar estadounidense", flag: "🇺🇸" },
    { code: "EUR", name: "Euro", flag: "🇪🇺" },
  ]}
/>
```

### Con cotización respecto de una moneda base
```tsx
<CurrencySelector
  value={to}
  onChange={setTo}
  baseCode="USD"
  options={[
    { code: "ARS", name: "Peso argentino", flag: "🇦🇷", rate: 1180.5 },
    { code: "EUR", name: "Euro", flag: "🇪🇺", rate: 0.92 },
    { code: "BRL", name: "Real brasileño", flag: "🇧🇷", rate: 5.4 },
  ]}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`. No usa `framer-motion` ni depende de Next.js.
- No requiere ningún Provider.

## Notas y comportamiento

- El dropdown **no** se cierra al hacer click afuera ni con `Escape` (no hay listener de `document` para eso) — sólo se cierra eligiendo una opción; tenelo en cuenta si tu layout necesita ese comportamiento.
- La búsqueda filtra en memoria por `code` o `name` (case-insensitive, `includes`), sin debounce — pensado para listas de monedas (decenas de opciones), no para datasets grandes.
- Al seleccionar una opción, el input de búsqueda se limpia (`setQ("")`) para la próxima apertura.
- La cotización (`rate`) sólo se muestra por fila si **ambos** `o.rate` y la prop `baseCode` están presentes; si falta cualquiera de los dos, la fila se ve igual que sin cotización.
- `current` se resuelve buscando `value` en `options`; si no hay match, cae a `options[0]` (pero `value` sigue siendo lo que el padre controla — el fallback es sólo visual).
