# usePeriodicSync

> Registra actualización en segundo plano cada tantas horas vía Periodic Background Sync (Chrome, sólo con la PWA instalada y con "engagement" suficiente del usuario). Es un extra oportunista, nunca la única vía de refresco.

**Import**
```ts
import { usePeriodicSync } from "lib-kit-components";
```

## Cuándo usarlo

Para intentar mantener datos frescos aunque el usuario no abra la app seguido (un feed, precios, disponibilidad) — el navegador decide cuándo (y si) efectivamente ejecuta la sincronización, según su propia heurística de uso. **Siempre** mantené además el refresco al volver a primer plano con `useAppLifecycle`/`useCachedFetch`, porque Periodic Sync no está garantizado ni disponible en la mayoría de los navegadores.

## Cuándo NO usarlo / alternativas

- No confíes en esto para nada crítico o con tiempo garantizado (notificaciones puntuales, recordatorios exactos) — usá Web Push (`usePushSubscription`) para eso, que sí es iniciado por el servidor.

## Firma

```ts
function usePeriodicSync(tag?: string, minIntervalHours?: number): {
  supported: boolean;
  registered: boolean;
  register: () => Promise<boolean>;
  unregister: () => Promise<void>;
}
```

## Parámetros

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `tag` | `string` | `"refresh-content"` | Identificador de la tarea — debe coincidir con el que maneja tu `sw.js` en el evento `periodicsync`. |
| `minIntervalHours` | `number` | `12` | Intervalo mínimo entre sincronizaciones, en horas (el navegador puede espaciarlas más, nunca menos). |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `supported` | `boolean` | Hay un service worker listo y expone `periodicSync`. |
| `registered` | `boolean` | El `tag` ya está registrado. |
| `register` | `() => Promise<boolean>` | Pide el registro. Devuelve si tuvo éxito (el navegador puede rechazarlo). |
| `unregister` | `() => Promise<void>` | Da de baja el registro. |

## Ejemplos

### Opt-in en ajustes
```tsx
function BackgroundRefreshToggle() {
  const { supported, registered, register, unregister } = usePeriodicSync("refresh-feed", 6);
  if (!supported) return null;

  return (
    <Switch
      checked={registered}
      onChange={(v) => (v ? register() : unregister())}
      label="Actualizar el feed en segundo plano"
    />
  );
}
```

## Requisitos / dependencias

- Requiere un service worker registrado y activo (`navigator.serviceWorker.ready`).
- Tu `sw.js` necesita manejar el evento `periodicsync` con el mismo `tag` (ver el ejemplo de referencia en el service worker de este kit).
- Sólo Chrome/Chromium en desktop y Android, y sólo con la PWA **instalada** — en el resto de navegadores, `supported` es `false` y no hay ningún fallback.

## Notas y comportamiento

- **El navegador decide si y cuándo ejecuta la sincronización**, incluso con el registro exitoso: la heurística de Chrome considera el "engagement" del sitio (cuánto y qué tan seguido lo usa el usuario) — un registro exitoso no garantiza que `periodicsync` se dispare nunca.
- `minIntervalHours` es un piso, no una garantía de frecuencia exacta — el navegador puede espaciar las sincronizaciones mucho más si el engagement es bajo o el dispositivo está en modo de ahorro de batería.
- Al montar, el hook consulta los tags ya registrados (`getTags()`) para inicializar `registered` correctamente, sin necesidad de que vos lo llames a mano.
- `register()` requiere el permiso `"periodic-background-sync"` (gestionado internamente por el navegador según el engagement, no hay un diálogo explícito de permiso) — si el navegador lo deniega, la promesa rechaza y el hook devuelve `false` sin lanzar hacia tu código.
