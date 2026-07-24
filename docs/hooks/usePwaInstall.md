# usePwaInstall

> Maneja todo el ciclo de instalación de la PWA: detección de plataforma, captura del prompt nativo de Chromium, snooze de "descartar" persistido, e instalación programática.

**Import**
```ts
import { usePwaInstall, type PwaPlatform } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando necesitás controlar vos mismo la UI de instalación (un botón en el header, un badge, una lógica condicional distinta según plataforma) en vez del componente `PwaInstallPrompt`/`InstallButton` prearmados, que ya usan este hook internamente. Es el hook indicado para: mostrar un botón "Instalar app" sólo cuando realmente se puede instalar, dar instrucciones manuales en iOS (donde no existe un prompt nativo), y no volver a molestar a un usuario que ya descartó la sugerencia recientemente.

## Firma

```ts
function usePwaInstall(options?: {
  delay?: number;
  storageKey?: string;
  snoozeDays?: number;
}): {
  platform: PwaPlatform;
  isStandalone: boolean;
  canInstall: boolean;
  dismissed: boolean;
  install: () => Promise<"accepted" | "dismissed" | "unsupported">;
  dismiss: () => void;
  reset: () => void;
}
```

`PwaPlatform = "android" | "ios" | "desktop" | "other"` (tipo exportado).

## Opciones (parámetros)

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `delay` | `number` | `1500` | ms a esperar tras montar antes de marcar `canInstall` como posible (evita el flicker de mostrar/ocultar el prompt apenas carga la página). No depende de que llegue `beforeinstallprompt`; es un mínimo de tiempo independiente. |
| `storageKey` | `string` | `"pwa-install-dismissed"` | Clave de `localStorage` donde se persiste el timestamp del último `dismiss()`. |
| `snoozeDays` | `number` | `14` | Cuántos días se respeta un `dismiss()` antes de volver a considerar la app instalable. |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `platform` | `"android" \| "ios" \| "desktop" \| "other"` | Plataforma detectada por user agent. |
| `isStandalone` | `boolean` | La app ya está corriendo instalada (`display-mode: standalone` o `navigator.standalone` en iOS). |
| `canInstall` | `boolean` | Se puede ofrecer instalación ahora. Ver mecánica abajo. |
| `dismissed` | `boolean` | El usuario descartó el prompt recientemente y todavía está dentro de la ventana de `snoozeDays`. |
| `install` | `() => Promise<"accepted" \| "dismissed" \| "unsupported">` | Dispara el prompt nativo de instalación (Android/Chromium desktop). |
| `dismiss` | `() => void` | Persiste un "descartado" (snooze) para no volver a mostrar el prompt durante `snoozeDays`. |
| `reset` | `() => void` | Borra el dismiss guardado en `localStorage` (pensado para testing/debug, pero funciona igual en producción si querés dar un botón "recordarme más tarde nunca / resetear"). |

## Ejemplos

### Uso básico
```tsx
import { usePwaInstall } from "lib-kit-components";

function InstallButton() {
  const { canInstall, install } = usePwaInstall();
  if (!canInstall) return null;

  return (
    <button onClick={async () => {
      const result = await install();
      if (result === "accepted") console.log("¡Instalada!");
    }}>
      Instalar app
    </button>
  );
}
```

### Instrucciones manuales en iOS (no hay prompt nativo)
```tsx
function InstallHint() {
  const { platform, canInstall, isStandalone } = usePwaInstall();

  if (!canInstall || isStandalone) return null;

  if (platform === "ios") {
    return <p>Tocá el ícono de compartir y elegí "Agregar a pantalla de inicio".</p>;
  }
  return <InstallButton />; // Android / desktop Chromium: usa install()
}
```

### Descartar con snooze y panel de debug
```tsx
function InstallBanner() {
  const { canInstall, dismissed, install, dismiss, reset } = usePwaInstall({ snoozeDays: 7 });

  if (!canInstall) return null;

  return (
    <div className="banner">
      <button onClick={install}>Instalar</button>
      <button onClick={dismiss}>Ahora no</button>
      {process.env.NODE_ENV === "development" && (
        <button onClick={reset}>[debug] resetear dismiss</button>
      )}
    </div>
  );
}
```

## Notas y comportamiento

- **Ciclo del prompt nativo**: Chromium (Android, Chrome/Edge desktop) dispara el evento `beforeinstallprompt` cuando la app cumple los criterios de instalabilidad (manifest válido, HTTPS o localhost, service worker registrado). El hook llama `preventDefault()` sobre ese evento y lo guarda; recién ahí `canInstall` puede pasar a `true` (para `platform !== "ios"`). Al llamar `install()`, se dispara `deferred.prompt()` y se espera `deferred.userChoice`, que resuelve `"accepted"` o `"dismissed"` según lo que elija el usuario en el diálogo nativo del navegador.
- Si `install()` se llama sin que haya un evento capturado (por ejemplo en iOS, o en un navegador que nunca disparó `beforeinstallprompt`), devuelve `"unsupported"` sin hacer nada — nunca lanza una excepción.
- Si `deferred.prompt()` o `userChoice` rechazan la promesa, `install()` lo captura y devuelve `"dismissed"` como fallback seguro (no `"unsupported"`).
- Cuando el resultado es `"dismissed"` (ya sea desde el diálogo nativo o por el catch anterior), el hook persiste automáticamente el snooze en `localStorage`, igual que si hubieras llamado `dismiss()` manualmente.
- **iOS es un caso especial**: Safari nunca dispara `beforeinstallprompt` ni expone una API de instalación programática. Por eso, para `platform === "ios"`, `canInstall` se habilita **sin** depender del evento (`ready && !isStandalone && !dismissed`), asumiendo que vas a mostrar instrucciones manuales ("Compartir → Agregar a pantalla de inicio") en vez de llamar `install()` — llamar `install()` en iOS siempre devuelve `"unsupported"`.
- El evento `appinstalled` se escucha para poner `isStandalone: true` y limpiar el evento diferido apenas el usuario instala la app por cualquier vía (incluida la barra de direcciones del navegador, no sólo tu botón).
- El dismiss persistido se lee y valida al montar: si el timestamp guardado es más viejo que `snoozeDays`, se borra solo de `localStorage` y `dismissed` queda en `false`.
- Los accesos a `localStorage` están envueltos en `try/catch`: en contextos donde está bloqueado (navegación privada estricta, iframes de terceros) el hook simplemente no persiste nada, sin romper.
- SSR-safe: el estado inicial (`platform: "other"`, `isStandalone: false`, `ready: false`) es fijo y no depende del entorno; toda la detección real ocurre dentro de un `useEffect` (sólo cliente), así que no hay riesgo de mismatch de hidratación.
- `beforeinstallprompt` requiere HTTPS (o `localhost`), un manifest válido y un service worker registrado — son requisitos del navegador, el hook no los verifica ni los sustituye.
