# RedirectTimer

> Cuenta atrás con anillo de progreso que, al llegar a cero, abre otra plataforma (WhatsApp, Telegram, SMS, mail o una URL) con el mensaje ya cargado. El usuario puede editar el texto, pausar, reanudar o salir en el momento.

**Import**
```tsx
import { RedirectTimer, buildRedirectHref, type RedirectTarget } from "lib-kit-components";
```

## Cuándo usarlo

Usalo en pantallas de "gracias por tu consulta" o de contacto donde el siguiente paso natural es continuar la conversación en otra plataforma: tras un formulario de contacto, redirigir a WhatsApp con el mensaje prellenado; tras una compra, abrir el mail de soporte; etc. El timer da contexto visual de que algo va a pasar automáticamente, pero deja al usuario cambiar el mensaje (lo que pausa la cuenta atrás), pausarla manualmente, o ir ya mismo con "Ir ahora".

## Cuándo NO usarlo / alternativas

- Si sólo necesitás el link armado (sin el timer ni la UI) para tu propio botón, usá la función exportada `buildRedirectHref(target, opts)` directamente en vez de montar el componente completo.
- Para un botón de compartir genérico (no una redirección con cuenta atrás a un destino fijo), usá [ShareButton](ShareButton.md).
- Si la redirección debe ser inmediata y no una decisión del usuario, no uses este componente — es específicamente para dar una ventana de cancelar/editar antes de salir.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `target` | `RedirectTarget` | `"whatsapp"` | Plataforma de destino. |
| `phone` | `string` | `undefined` | Teléfono en formato internacional sin `+` (ej. `"5491122334455"`). Para `target="telegram"` puede ser un `@usuario`. |
| `email` | `string` | `undefined` | Email destino, sólo para `target="mail"`. |
| `url` | `string` | `undefined` | URL directa, sólo para `target="url"`. |
| `message` | `string` | `""` | Mensaje prellenado — editable por el usuario si `editable` es `true`. |
| `onMessageChange` | `(message: string) => void` | `undefined` | Se llama en cada cambio del textarea de mensaje. |
| `editable` | `boolean` | `true` | Muestra el textarea de mensaje (oculto automáticamente si `target="url"`, que no tiene mensaje). |
| `seconds` | `number` | `8` | Segundos de cuenta atrás. |
| `autoStart` | `boolean` | `true` | Si `false`, arranca en pausa. |
| `newTab` | `boolean` | `true` | Si `true`, abre con `window.open(..., "_blank")`; si `false`, navega en la misma pestaña (`window.location.href`). |
| `title` | `string` | texto según estado | Título; por defecto varía entre "Te llevamos a X…", "Abriendo X" y "Redirección en pausa". |
| `description` | `string` | texto según estado | Descripción bajo el título. |
| `onRedirect` | `(href: string) => void` | `undefined` | Se llama una única vez, justo antes de abrir el link (ej. para tracking). |
| `onCancel` | `() => void` | `undefined` | Si se define, muestra el botón "Cancelar", que pausa el timer y lo llama. |
| `className` | `string` | `""` | Clases CSS adicionales para el contenedor raíz. |

## Tipos exportados

```ts
export type RedirectTarget = "whatsapp" | "telegram" | "sms" | "mail" | "url";

// función standalone, sin montar el componente:
function buildRedirectHref(
  target: RedirectTarget,
  opts: { phone?: string; email?: string; url?: string; message?: string }
): string;
```

## Ejemplos

### Redirección a WhatsApp con mensaje editable
```tsx
<RedirectTimer
  target="whatsapp"
  phone="5491122334455"
  message="Hola 👋 quiero consultar por el plan Pro."
  seconds={8}
  onRedirect={(href) => track("wa_redirect", href)}
  onCancel={() => setStep("form")}
/>
```

### Sólo el link, para un botón propio
```tsx
const href = buildRedirectHref("whatsapp", { phone: "5491122334455", message: "Hola!" });
<a href={href} target="_blank" rel="noopener noreferrer">Escribinos</a>
```

### Redirección a una URL sin mensaje
```tsx
<RedirectTimer target="url" url="https://miapp.com/gracias" seconds={5} editable={false} />
```

## Requisitos / dependencias

- No depende de `next` ni de `framer-motion`.
- Marcado como `"use client"`.
- No es controlado: `left` (segundos restantes) y `running` son estado interno; se puede influir desde afuera sólo a través de `autoStart`, `seconds` y el `key` del componente para reiniciarlo (cambiar `target`/`seconds` con un `key` distinto reinicia el timer, como se ve en el playground).

## Notas y comportamiento

- La redirección sólo se dispara una vez por instancia: un `ref` (`fired`) evita que se abra dos veces aunque el efecto se re-ejecute.
- Enfocar el textarea de mensaje pausa automáticamente el timer (`onFocus={() => setRunning(false)}`) — editar el mensaje nunca compite con una redirección en curso.
- El botón "Ir ahora" fuerza la redirección inmediatamente, sin esperar a que el contador llegue a 0.
- El anillo de progreso (SVG, radio 26) usa `strokeDashoffset` con transición lineal de 1s, sincronizada con el `setTimeout` de 1000ms que decrementa `left` — no es una animación con `requestAnimationFrame`.
- `buildRedirectHref` limpia el teléfono con `replace(/[^\d]/g, "")` para todos los targets salvo `telegram` (que sólo remueve un `@` inicial, ya que Telegram usa usernames, no siempre números).
- El href final se muestra siempre en texto pequeño y monoespaciado al pie del componente, útil para depurar qué se va a abrir antes de que ocurra.
- Cambiar el `message` prop después del montaje inicial actualiza el texto editable vía `useEffect` (`setText(message)`), aunque el usuario ya lo haya modificado — si necesitás que el usuario "gane" sobre actualizaciones externas del prop, controlá vos cuándo cambiarlo.
