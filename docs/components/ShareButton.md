# ShareButton

> Botón de compartir que usa la hoja nativa del sistema (Web Share API) cuando existe, y cae a un sheet propio (WhatsApp, Telegram, mail, SMS, copiar enlace) cuando no — típicamente desktop.

**Import**
```tsx
import { ShareButton } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para compartir contenido de la app (una publicación, un producto, un perfil) sin tener que decidir vos si el dispositivo soporta `navigator.share`: el componente lo detecta solo y muestra la experiencia correcta en cada caso — la hoja nativa de iOS/Android/Safari, o un bottom sheet propio con los destinos más comunes y copiar enlace con confirmación visual. Cuatro apariencias (`button`, `icon`, `ghost`, `fab`) cubren desde una card de producto hasta un FAB de compartir.

## Cuándo NO usarlo / alternativas

- Para una redirección con cuenta atrás a una plataforma específica (no una elección de "a dónde compartir"), usá [RedirectTimer](RedirectTimer.md).
- Si necesitás forzar siempre el sheet propio (para probar ese flujo en un dispositivo que sí soporta `navigator.share`, o porque tu diseño requiere consistencia entre plataformas), usá `forceFallback`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `string` | `undefined` | Título compartido (usado por `navigator.share` y como subject de mail). |
| `text` | `string` | `undefined` | Texto compartido. |
| `url` | `string` | `location.href` | URL a compartir. Por defecto usa la URL actual. |
| `variant` | `"button" \| "icon" \| "ghost" \| "fab"` | `"button"` | Apariencia: `button` (con texto), `icon` (sólo ícono con borde), `ghost` (sólo ícono sin fondo), `fab` (botón circular flotante). |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño del botón (no aplica a `variant="fab"`, que es fijo 56px). |
| `label` | `string` | `"Compartir"` | Texto visible (en `variant="button"`) y `aria-label` del botón. También se usa como título del sheet propio. |
| `forceFallback` | `boolean` | `false` | Fuerza el sheet propio aunque exista `navigator.share` (útil para probar ese flujo en mobile, o para forzar consistencia visual). |
| `onShared` | `(method: string) => void` | `undefined` | Se llama al compartir con éxito. `method` es `"native"`, `"copy"`, o el id del destino tocado en el sheet (`"whatsapp"`, `"telegram"`, `"mail"`, `"sms"`). |
| `className` | `string` | `""` | Clases CSS adicionales para el botón trigger. |

## Ejemplos

### Botón estándar
```tsx
<ShareButton title="Casa Aldama" text="Mirá esta propiedad" onShared={(method) => track("share", method)} />
```

### Sólo ícono, dentro de una card
```tsx
<ShareButton variant="icon" size="sm" title={product.name} url={product.url} />
```

### FAB de compartir
```tsx
<ShareButton variant="fab" title="Mi perfil" />
```

### Forzar el sheet propio (probar en cualquier dispositivo)
```tsx
<ShareButton forceFallback label="Compartir proyecto" />
```

## Requisitos / dependencias

- No depende de `next` ni de `framer-motion`.
- Usa `useHaptics` (`"tap"` al abrir, `"success"` al copiar el enlace).
- Marcado como `"use client"`.
- No es controlado: el estado del sheet (`sheet`) y de "copiado" (`copied`) son internos.

## Notas y comportamiento

- La detección de `navigator.share` ocurre en un `useEffect` (evita mismatch de SSR/hydration, ya que `navigator` no existe en el servidor) — en el primer render siempre se asume `native = false` hasta que el efecto corre en el cliente.
- Si `navigator.share()` es cancelado por el usuario (`AbortError`), no pasa nada — no se abre el sheet de fallback ni se llama `onShared`. Cualquier otro error también cae silenciosamente al sheet propio.
- El sheet propio ofrece 4 destinos fijos (WhatsApp, Telegram, Email, SMS) más "Copiar enlace"; los links de WhatsApp/Telegram/mail/SMS se arman con `text`/`title`/`url` concatenados y `encodeURIComponent`, similar a `buildRedirectHref` de [RedirectTimer](RedirectTimer.md) pero sin exportarse como función aparte.
- "Copiar enlace" usa `navigator.clipboard.writeText`; si falla (ej. permisos, contexto no seguro), no muestra error — sólo no confirma el copiado. El estado `copied` (con ícono de check) se revierte automáticamente y cierra el sheet 1100ms después.
- El sheet es `fixed inset-0` con `role="dialog"`, se cierra tocando el backdrop o "Cancelar", y en mobile aparece pegado abajo (`items-end`) mientras que en `sm:` en adelante queda centrado como card flotante.
- No hay foco automático ni trap de foco dentro del sheet.
