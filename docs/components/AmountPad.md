# AmountPad

> Pantalla completa para ingresar un monto de dinero, estilo billetera virtual: número formateado en vivo con separadores de miles, tecla de coma para centavos, tipografía que se achica al crecer el monto, montos sugeridos y validación de mínimo/máximo (incluido el saldo disponible).

**Import**
```tsx
import { AmountPad } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para cualquier flujo de carga/envío/retiro de dinero donde el usuario tipea un importe: recarga de saldo, transferencias, montos de pago. El número se muestra grande y formateado según `locale`/`currency` mientras se tipea, con un cursor parpadeante, chips de montos rápidos (`quickAmounts`) y un chip "Todo" cuando hay `balance`. El botón de confirmar sólo se activa cuando el monto es válido (respeta `min`/`max`/`balance`) y muestra el monto formateado dentro del propio CTA.

## Cuándo NO usarlo / alternativas

- Para un campo de monto dentro de un formulario más largo (no a pantalla completa), usá [Input](Input.md) con `type="number"` — `AmountPad` está pensado como pantalla dedicada tipo billetera, no como campo embebido.
- Si sólo necesitás el teclado numérico sin el formateo de moneda ni la validación de saldo, usá [Keypad](Keypad.md) directamente.
- Para cargar un PIN o contraseña (no un monto), usá [PinLock](PinLock.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `open` | `boolean` | — (requerido) | Controla si la pantalla está visible. |
| `onClose` | `() => void` | — (requerido) | Se llama al tocar el botón × del header. |
| `onConfirm` | `(amount: number) => void \| Promise<void>` | — (requerido) | Se llama con el monto final al confirmar (ya validado). Si devuelve una promesa, el CTA muestra "Procesando…" y se deshabilita hasta que resuelva. |
| `title` | `string` | `"¿Cuánto querés cargar?"` | Título sobre el número. |
| `subtitle` | `string` | `undefined` | Texto bajo el número cuando no hay error de mínimo/máximo activo. |
| `currency` | `string` | `"ARS"` | Código ISO de moneda para `Intl.NumberFormat`. |
| `locale` | `string` | `"es-AR"` | Locale para formateo de número y moneda. |
| `balance` | `number` | `undefined` | Saldo disponible: se muestra en el header, agrega el chip "Todo" y actúa como `max` implícito si `max` no está definido. |
| `min` | `number` | `1` | Monto mínimo válido. |
| `max` | `number` | `undefined` | Monto máximo válido. Si no se define, usa `balance` como techo. |
| `quickAmounts` | `number[]` | `[1000, 5000, 10000]` | Montos sugeridos como chips. Pasá `[]` para ocultarlos. |
| `cta` | `string` | `"Continuar"` | Texto del botón de confirmar cuando el monto aún no es válido (o mientras no hay monto). |
| `decimals` | `boolean` | `true` | Habilita la tecla `","` para cargar centavos. |
| `className` | `string` | `""` | Clases CSS adicionales para el contenedor raíz. |

## Ejemplos

### Recarga con saldo y montos sugeridos
```tsx
const [open, setOpen] = useState(false);

<AmountPad
  open={open}
  onClose={() => setOpen(false)}
  title="¿Cuánto querés cargar?"
  currency="ARS"
  locale="es-AR"
  balance={saldo}
  min={100}
  max={500000}
  quickAmounts={[1000, 5000, 10000]}
  onConfirm={async (amount) => {
    await recargar(amount);
    setOpen(false);
  }}
/>
```

### Sin centavos ni montos sugeridos
```tsx
<AmountPad
  open={open}
  onClose={() => setOpen(false)}
  decimals={false}
  quickAmounts={[]}
  cta="Enviar"
  onConfirm={(amount) => enviarTransferencia(amount)}
/>
```

## Requisitos / dependencias

- No depende de `next`.
- Usa `Keypad` internamente (con `extraKey=","` cuando `decimals` es `true`) y por lo tanto `useHaptics` (`"tap"` en montos rápidos, `"error"` al rechazar una tecla o exceder el máximo, `"success"` al confirmar).
- Marcado como `"use client"`.
- Es controlado vía `open`, sin modo no-controlado.

## Notas y comportamiento

- El monto se compone de dos strings de estado (`raw` para la parte entera, `cents` para los centavos, `null` mientras no se activó la coma) — no es un `number` editado directamente, lo que evita los problemas de precisión de punto flotante mientras se tipea.
- El tamaño de fuente del número baja en 4 escalones (68px → 58px → 48px → 40px) según la cantidad de dígitos visibles, para que montos grandes no se desborden.
- El chip "Todo" sólo aparece si se pasó `balance`, y carga exactamente ese valor truncado (sin centavos) al tocarlo.
- Tocar una tecla que excede el límite de dígitos (9 en la parte entera, 2 en centavos) o cargar el segundo símbolo de coma no hace nada visualmente en el número, pero dispara el shake (`haptic("error")`, animación 380ms) como feedback de rechazo.
- El botón de confirmar sólo se habilita (`valid`) cuando `value >= min` y no hay `overflow` (monto mayor al techo efectivo `max ?? balance`); mientras no es válido, muestra sólo el texto de `cta` sin el monto.
- El mensaje bajo el número prioriza en este orden: error de máximo superado > `subtitle` custom > aviso de mínimo no alcanzado (sólo si ya se tipeó algo) > vacío.
- Mantener presionado el botón de borrado del `Keypad` limpia todo el monto de una (`onBackspaceLong`), tanto la parte entera como los centavos.
- El símbolo de moneda se deriva de `Intl.NumberFormat(locale, { style: "currency", currency }).format(0)` quitándole los dígitos — así sigue la posición/símbolo real del locale (ej. `$` antes o después del número) en vez de asumir un formato fijo.
