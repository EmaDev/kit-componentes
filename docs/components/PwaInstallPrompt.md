# PwaInstallPrompt

> Prompt de instalación de PWA que aparece proactivamente: banner flotante en Android/desktop, bottom sheet con instrucciones manuales en iOS Safari.

**Import**
```tsx
import { PwaInstallPrompt } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando querés ofrecer la instalación de la app de forma proactiva y visible, sin que el usuario tenga que buscar un botón: aparece solo cuando el navegador considera que la app es instalable (Android/Chrome/Edge/desktop, vía el evento `beforeinstallprompt`) o, en iOS Safari, muestra directamente un sheet con los pasos manuales (ahí no existe un evento nativo de instalación). Es ideal para montarlo una vez en el layout raíz de la app y dejar que decida solo cuándo mostrarse.

## Cuándo NO usarlo / alternativas

- Si preferís un enfoque menos intrusivo — un botón que el usuario clickea cuando quiere, en un header o pantalla de ajustes — usá `InstallButton` en su lugar. `InstallButton` no interrumpe; `PwaInstallPrompt` sí (aparece como overlay/banner fijo).
- Si sólo necesitás mostrar el estado de instalación (sin ofrecer instalar), usá `PwaStatus`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `appName` | `string` | — | Nombre de la app mostrado en el título del prompt. Requerido. |
| `tagline` | `string` | `"Instala la app para acceso rápido, soporte offline y notificaciones."` | Descripción corta de una línea. |
| `icon` | `ReactNode` | ícono por defecto (rayo) | Icono de la app; puede ser un `<img>` o cualquier `ReactNode`. |
| `forcePlatform` | `"android" \| "ios" \| "desktop" \| "other"` | — | Fuerza qué variante mostrar (y la fuerza visible) independientemente de lo que detecte el navegador. Pensado para testear el UI sin depender de la elegibilidad real. |
| `installLabel` | `string` | `"Instalar"` | Texto del botón principal en la variante Android/desktop. |
| `dismissLabel` | `string` | `"Ahora no"` | Texto del botón secundario en la variante Android/desktop. |
| `snoozeDays` | `number` | `14` | Días que se recuerda un "descartar" antes de volver a ofrecer la instalación (persistido en `localStorage`). |

## Ejemplos

### Uso básico (en el layout raíz)
```tsx
<PwaInstallPrompt appName="Mi App" />
```

### Personalizando textos, icono y snooze
```tsx
<PwaInstallPrompt
  appName="Mi App"
  tagline="Accedé más rápido y usala sin conexión."
  icon={<img src="/icon-192.png" alt="" className="w-full h-full object-cover" />}
  installLabel="Instalar ahora"
  dismissLabel="Quizás después"
  snoozeDays={30}
/>
```

### Forzando la variante iOS para testear el UI en desarrollo
```tsx
<PwaInstallPrompt appName="Mi App" forcePlatform="ios" />
```

### Forzando la variante Android/desktop
```tsx
<PwaInstallPrompt appName="Mi App" forcePlatform="android" />
```

## Requisitos / dependencias

- Usa `framer-motion` internamente para las animaciones de entrada/salida (banner con spring, sheet con backdrop + slide up).
- Depende del hook `usePwaInstall`, que a su vez depende del evento `beforeinstallprompt` del navegador — **este evento sólo lo dispara Chromium (Chrome, Edge, Samsung Internet, Android WebView con soporte)**. Safari (iOS y macOS) y Firefox nunca lo disparan; por eso la plataforma `"ios"` usa un flujo 100% manual (instrucciones) en vez de un prompt nativo.
- En desarrollo normal, sin forzar `forcePlatform`, es fácil no ver nunca el banner: además de necesitar un navegador Chromium, Chrome exige ciertos criterios de "PWA installability" (manifest válido, service worker registrado, servido por HTTPS o `localhost`) antes de disparar el evento.
- El estado de "descartado" se persiste en `localStorage` bajo la clave `"pwa-install-dismissed"` (fija, no configurable desde `PwaInstallPrompt`; si necesitás cambiarla, usá `usePwaInstall` directamente).

## Notas y comportamiento

- Con `forcePlatform` definido, el prompt queda siempre visible (`visible = true`), ignorando `canInstall`, `dismissed` y el delay anti-flicker del hook — es exclusivamente para inspeccionar el diseño.
- Sin `forcePlatform`, la plataforma se detecta por user agent (`usePwaInstall` → `detectPlatform`) y la visibilidad depende de `pwa.canInstall`, que en Android/desktop requiere que el evento `beforeinstallprompt` ya haya llegado, y en iOS es simplemente "no está en standalone y no fue descartado".
- La variante Android/desktop dispara el prompt nativo del navegador (`deferred.prompt()`); si el usuario lo descarta, se guarda el timestamp en `localStorage` y no se vuelve a ofrecer hasta que pasen `snoozeDays`.
- La variante iOS es un bottom sheet con 3 pasos ilustrados (Compartir → "Agregar a inicio" → "Agregar"), backdrop clickeable para cerrar, y se puede cerrar también con `Escape`.
- Ambas variantes respetan `env(safe-area-inset-bottom)` para no quedar tapadas por el home indicator en iOS.
- El banner Android usa `role="dialog"`; el sheet iOS usa `role="dialog"` + `aria-modal="true"`.
- Si la app ya corre en modo standalone (`isStandalone`), `canInstall` es `false` y el prompt no se muestra (salvo `forcePlatform`).
