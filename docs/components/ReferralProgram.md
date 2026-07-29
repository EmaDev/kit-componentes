# ReferralProgram

> Bloque de "invitá amigos y ganá": código propio con copiar/compartir, contador de invitados/sumados y progreso hacia una recompensa.

**Import**
```tsx
import { ReferralProgram } from "lib-kit-components";
```

## Cuándo usarlo

En la sección de "referidos" del perfil o dashboard de un usuario, cuando querés que comparta un código propio a cambio de un beneficio. Resuelve de una: mostrar el código, copiarlo o compartirlo (`navigator.clipboard` / `onShare`), las métricas de invitados vs. efectivamente sumados, y opcionalmente una barra de progreso hacia una meta (`goal`) que desbloquea `reward`.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás un **cupón de descuento** para aplicar en el checkout (sin programa de referidos, invitados ni progreso), usá `CouponCode` — más simple, sin las métricas ni la barra de progreso.
- Si necesitás sólo el botón de compartir (Web Share API / fallback) para otro contexto que no sea un código de referido, usá `ShareButton` directamente.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `code` | `string` | — (requerido) | Código de referido propio del usuario. |
| `invited` | `number` | — (requerido) | Cantidad de personas invitadas. |
| `joined` | `number` | — (requerido) | Cantidad de personas que efectivamente se registraron con el código. |
| `goal` | `number` | `undefined` | Meta de `joined` para desbloquear la recompensa. Sin ella, no se muestra la barra de progreso. |
| `reward` | `string` | `"beneficios"` | Texto de la recompensa en el título (ej. `"$5.000 de crédito"`). |
| `shareUrl` | `string` | `undefined` | URL a copiar/compartir en vez del `code` crudo. |
| `onShare` | `() => void` | `undefined` | Handler del botón "Compartir invitación" (armá ahí tu propia llamada a `navigator.share` u otro flujo). |
| `className` | `string` | `""` | Clases adicionales para el contenedor. |

## Ejemplos

### Uso básico
```tsx
<ReferralProgram
  code="LUCIA20"
  invited={8}
  joined={3}
  goal={5}
  reward="$5.000 de crédito"
  onShare={() => navigator.share?.({ title: "Unite con mi código", url: `https://app.com/r/LUCIA20` })}
/>
```

### Con URL de invitación en vez de sólo el código
```tsx
<ReferralProgram
  code="LUCIA20"
  shareUrl="https://app.com/r/LUCIA20"
  invited={12}
  joined={12}
  goal={10}
  reward="1 mes gratis"
/>
```

## Requisitos / dependencias

- Usa `navigator.clipboard?.writeText(...)` al copiar — el `?.` evita romper en contextos sin la API (ej. `http://` no seguro); si no está disponible, el click en "Copiar" simplemente no copia nada (sigue mostrando el feedback "Copiado" igual, ya que no se verifica el resultado de la promesa).
- Marcado como `"use client"`. No requiere ningún Provider.

## Notas y comportamiento

- El botón "Copiar" copia `shareUrl` si está definido; si no, copia `code`. Después de copiar, el texto del botón cambia a "Copiado" durante 1.8 segundos (estado interno, no controlado desde afuera).
- La barra de progreso sólo aparece si se pasa `goal`; el porcentaje se calcula como `Math.min(100, (joined / goal) * 100)`, así que nunca se pasa de 100% aunque `joined > goal`.
- `onShare` es opcional: si no se pasa, el botón "Compartir invitación" sigue siendo clickeable pero no hace nada — la lógica real de compartir (Web Share API, deep link, etc.) es responsabilidad del consumidor.
