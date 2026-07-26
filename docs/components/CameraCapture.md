# CameraCapture

> Captura de foto a pantalla completa: preview en vivo de la cámara, cambio frontal/trasera, guía visual opcional (marco cuadrado o de documento), revisión antes de confirmar y apagado prolijo del stream al cerrar.

**Import**
```tsx
import { CameraCapture } from "lib-kit-components";
```

## Cuándo usarlo

Para cualquier flujo que necesite tomar una foto con la cámara del dispositivo dentro de la propia app (en vez de delegar al selector nativo de archivos): foto de perfil, foto de un documento/comprobante, evidencia de una entrega, etc. Incluye revisión ("Repetir" / "Usar foto") antes de confirmar por defecto.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás **elegir** un archivo (imagen ya existente en el dispositivo, con opción de abrir la cámara del sistema como una opción más), usá `useFilePicker` con `capture="environment"` en vez de este componente.
- Para leer QR/códigos de barras en vivo (no tomar una foto), combiná `useCamera` + `useBarcodeScanner` en tu propia UI — `CameraCapture` no decodifica nada, sólo captura.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `open` | `boolean` | — (requerido) | Controla si la pantalla de cámara está visible. |
| `onClose` | `() => void` | — (requerido) | Se llama al cerrar (botón ×, o tras confirmar sin revisión). |
| `onCapture` | `(blob: Blob, dataUrl: string) => void \| Promise<void>` | — (requerido) | Foto tomada (y confirmada, si `review` está activo). |
| `review` | `boolean` | `true` | Muestra la foto antes de confirmar, con opción de repetir. |
| `facing` | `"user" \| "environment"` | `"environment"` | Cámara inicial (trasera por defecto). |
| `guide` | `"none" \| "square" \| "document"` | `"none"` | Marco guía superpuesto: cuadrado (1:1) o rectángulo tipo documento (1.586:1). |
| `title` | `string` | `"Tomar foto"` | Título en la barra superior. |

## Ejemplos

### Foto de perfil, con revisión
```tsx
<CameraCapture
  open={open}
  onClose={() => setOpen(false)}
  facing="user"
  guide="square"
  onCapture={async (blob) => {
    await uploadAvatar(blob);
  }}
/>
```

### Captura de documento, sin pantalla de revisión (dispara al instante)
```tsx
<CameraCapture
  open={open}
  onClose={() => setOpen(false)}
  guide="document"
  review={false}
  title="Foto del DNI (frente)"
  onCapture={(blob, dataUrl) => setDniFront({ blob, preview: dataUrl })}
/>
```

## Requisitos / dependencias

- Usa el hook `useCamera` (getUserMedia) y `useHaptics` para el feedback táctil al disparar/confirmar.
- Usa `framer-motion` para la entrada del overlay y el spinner mientras arranca el stream.
- Marcado como `"use client"`. Requiere contexto seguro (HTTPS o `localhost`) y permiso de cámara del usuario.

## Notas y comportamiento

- El stream de la cámara arranca al abrir (`open: true`) y se apaga siempre al cerrar — incluyendo el `URL.revokeObjectURL` de la foto en revisión, para no dejar el LED de la cámara encendido ni memoria colgada.
- El botón de cambiar cámara (`flip`) se deshabilita automáticamente si el dispositivo sólo tiene una cámara (`hasMultiple`, detectado con `enumerateDevices()`).
- Con cámara frontal (`facing="user"`), tanto el preview en vivo como la foto capturada se espejan horizontalmente para que coincidan con lo que el usuario ve (selfie mode) — el `<canvas>` de captura aplica `ctx.scale(-1, 1)` antes de dibujar el frame.
- Si `getUserMedia` falla (permiso denegado, sin cámara, etc.), el mensaje de error del hook (`useCamera`) se muestra centrado sobre el área de preview en vez del video.
- `z-index` del overlay es `z-[140]`, por debajo de `BiometricGate` (`z-[150]`) y de `BottomSheet` (`z-[140]`/`z-[150]` según variante) — revisá el z-index si combinás varias pantallas a pantalla completa.
