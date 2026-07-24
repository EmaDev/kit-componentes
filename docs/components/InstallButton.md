# InstallButton

> Botón embebible para instalar la PWA a demanda, pensado para un header, pantalla de ajustes u onboarding — no interrumpe como un banner.

**Import**
```tsx
import { InstallButton } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando querés dar la opción de instalar la app sin interrumpir al usuario: un botón más, en el lugar donde vos decidas (header, menú, pantalla de ajustes, tarjeta de onboarding). A diferencia de un banner, no aparece solo ni desaparece solo — el usuario lo ve y lo clickea cuando quiere.

## Cuándo NO usarlo / alternativas

- Si querés que la oferta de instalación aparezca proactivamente (sin que el usuario tenga que buscarla), usá `PwaInstallPrompt`, que se muestra como banner (Android) o sheet (iOS) por su cuenta.
- Si sólo necesitás mostrar el estado de instalación como dato (sin botón de acción), usá `PwaStatus`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `"Instalar app"` | Texto cuando la instalación está disponible. |
| `installedLabel` | `string` | `"App instalada"` | Texto (y `aria-label`) cuando la app ya está instalada. |
| `iosLabel` | `string` | `"Cómo instalar"` | Texto en iOS, donde la instalación es manual. |
| `onIosClick` | `() => void` | — | Callback al clickear en iOS (no hay prompt nativo posible ahí). Usalo para abrir tu propio `<PwaInstallPrompt forcePlatform="ios">` o un modal con los pasos. |
| `variant` | `"primary" \| "outline" \| "ghost"` | `"primary"` | Estilo visual del botón. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño del botón. |
| `icon` | `ReactNode` | ícono de descarga por defecto | Icono a la izquierda del texto (se reemplaza por un check cuando está instalada). |
| `hideWhenUnavailable` | `boolean` | `true` | Si es `true`, el botón no renderiza nada (`null`) cuando no hay forma de instalar ni de mostrar instrucciones. Si es `false`, se muestra deshabilitado/atenuado en su lugar. |
| `className` | `string` | `""` | Clases CSS adicionales para el botón. |

## Ejemplos

### Uso básico
```tsx
<InstallButton />
```

### En un header, tamaño chico y variante outline
```tsx
<InstallButton
  size="sm"
  variant="outline"
  onIosClick={() => setShowIosInstructions(true)}
/>
```

### Mostrando siempre el botón, aunque no se pueda instalar (deshabilitado)
```tsx
<InstallButton hideWhenUnavailable={false} variant="ghost" />
```

### Con icono y textos personalizados
```tsx
<InstallButton
  label="Agregar a mi dispositivo"
  installedLabel="Ya la tenés instalada"
  icon={<PhoneIcon />}
  size="lg"
/>
```

## Requisitos / dependencias

- Usa `framer-motion` (`motion.button`) sólo para el `whileTap` de escala al presionar.
- Depende del hook `usePwaInstall` (con `delay: 0`, es decir sin el retraso anti-flicker que usa `PwaInstallPrompt` por defecto), que a su vez depende del evento `beforeinstallprompt` — sólo disponible en navegadores Chromium con los criterios de instalabilidad cumplidos (manifest, service worker, HTTPS/localhost). En Safari/Firefox nunca llega ese evento, por eso iOS tiene su propio camino (`onIosClick`) en vez de un prompt nativo.
- En un entorno de desarrollo normal (sin manifest/service worker correctamente configurados, o en un navegador no-Chromium), es esperable que el botón no aparezca si `hideWhenUnavailable` es `true` — no es un bug del componente.

## Notas y comportamiento

- `available` es `true` si la app ya está instalada, o si es iOS (ahí el botón siempre puede mostrar instrucciones), o si `pwa.canInstall` es `true` (Android/desktop con el evento nativo listo). Si ninguna se cumple y `hideWhenUnavailable` es `true`, el componente devuelve `null`.
- Una vez instalada (`pwa.isStandalone` o tras un `install()` con resultado `"accepted"`), el botón queda deshabilitado, cambia a tono de éxito (`bg-success/10 text-success`) y muestra un ícono de check.
- En iOS, el click no dispara `install()` (no existe prompt nativo): sólo llama a `onIosClick`, si se definió. Si no se define `onIosClick`, el botón en iOS no hace nada al clickear más allá de mostrar el label `iosLabel`.
- Mientras se resuelve el prompt nativo (`busy`), el botón se deshabilita y el texto cambia a `"…"`.
- Si `pwa.canInstall` es `false` y no es iOS ni está instalada, el botón se muestra con opacidad reducida (`opacity-60`) salvo que `hideWhenUnavailable` lo oculte directamente.
