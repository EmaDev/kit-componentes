# Chatbot

> Chat conversacional con burbujas, indicador "escribiendo…", respuestas rápidas (quick replies) y sugerencias iniciales. Dos variantes: `floating` (lanzador flotante con badge de no leídos) o `inline` (embebido en tu layout).

**Import**
```tsx
import { Chatbot } from "lib-kit-components";
import type { ChatMessage } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para asistentes conversacionales de soporte/ventas (bot con o sin IA detrás) que necesitan el patrón estándar de chat: mensajes del usuario a la derecha, del bot a la izquierda, estado "escribiendo…" mientras se espera respuesta, y sugerencias rápidas (`starters`/`quickReplies`) para guiar la conversación sin que el usuario tenga que tipear. El propio componente **no** implementa la lógica del bot — vos proveés `onSend` y actualizás `messages`.

## Cuándo NO usarlo / alternativas

- Si necesitás un chat 1-a-1 o grupal entre personas reales (no un bot), esta pieza sirve como base de UI, pero no trae presencia/lectura/multi-usuario — tendrías que extenderla.
- Para comentarios de un post (no una conversación en tiempo real), usá [CommentBox](CommentBox.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `messages` | `ChatMessage[]` | — (requerido) | Historial de mensajes a renderizar. |
| `onSend` | `(text: string) => void \| Promise<void>` | — (requerido) | Se llama al enviar. Mientras la promesa esté pendiente, el input se bloquea y se muestra "escribiendo…". |
| `botName` | `string` | `"Asistente"` | Nombre en el header. |
| `botStatus` | `string` | `"En línea"` | Subtítulo del header (se reemplaza por "Escribiendo…" mientras `thinking`). |
| `avatar` | `ReactNode` | `undefined` | Ícono/avatar custom del bot. |
| `typing` | `boolean` | `false` | Fuerza el indicador de escritura independientemente de `onSend`. |
| `placeholder` | `string` | `"Escribí tu mensaje…"` | Placeholder del composer. |
| `starters` | `string[]` | `[]` | Sugerencias mostradas cuando `messages` está vacío. |
| `variant` | `"floating" \| "inline"` | `"floating"` | `floating` = burbuja lanzadora fija; `inline` = panel embebido en el layout. |
| `open` | `boolean` | `undefined` | Estado abierto/cerrado controlado (sólo `variant="floating"`). |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Notifica cambios de apertura/cierre. |
| `unread` | `number` | `0` | Badge en la burbuja cuando está cerrada. |
| `header` | `ReactNode` | `undefined` | Reemplaza el header por defecto. |
| `footnote` | `string` | `undefined` | Texto pequeño bajo el composer (ej. "Respuestas automáticas"). |
| `className` | `string` | `""` | Clases adicionales (sólo aplican en `variant="inline"`). |

## Tipos exportados

```ts
export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  at?: Date | number;
  quickReplies?: string[];           // chips debajo de un mensaje del bot
  status?: "sending" | "sent" | "error";
}
```

## Ejemplos

### Flotante, con starters y quick replies
```tsx
const [msgs, setMsgs] = useState<ChatMessage[]>([]);

<Chatbot
  messages={msgs}
  onSend={async (text) => {
    setMsgs((m) => [...m, { id: uid(), role: "user", text, at: Date.now() }]);
    const answer = await askBot(text);
    setMsgs((m) => [...m, { id: uid(), role: "bot", ...answer }]);
  }}
  botName="Asistente" starters={["Envíos", "Pagos", "Devoluciones"]}
  variant="floating" unread={2} footnote="Respuestas automáticas."
/>
```

### Embebido en un panel de ayuda
```tsx
<Chatbot messages={msgs} onSend={handleSend} variant="inline" className="h-[520px]" />
```

## Requisitos / dependencias

- Usa `framer-motion` (entrada/salida de burbujas, indicador de escritura, apertura del panel flotante).
- Marcado como `"use client"`.
- Suma `var(--kb-inset)` al padding inferior del composer para que el teclado virtual no lo tape (ver [useKeyboardInset](../hooks/useKeyboardInset.md)) — funciona igual sin él (`0px`).

## Notas y comportamiento

- `Chatbot` bloquea el input (`disabled`) mientras `onSend` esté pendiente — no hace falta que vos manejes un estado de "cargando" aparte para eso.
- `starters` sólo se muestran cuando `messages.length === 0`; una vez que hay al menos un mensaje, desaparecen para siempre en esa sesión de props.
- `quickReplies` de un mensaje viven en el propio `ChatMessage` del bot (no son globales) — cada respuesta del bot puede traer sus propios chips.
- El scroll al fondo es automático en cada cambio de `messages.length`, de `thinking`, o al abrir el panel — no necesitás gestionarlo vos.
- El Enter (sin Shift) envía el mensaje; `Shift+Enter` inserta salto de línea — el textarea crece automáticamente hasta 120px.
