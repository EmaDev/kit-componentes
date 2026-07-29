# AppIdentityConfig

> Panel de configuración de identidad de la PWA: nombre, colores e íconos que se ven al instalar la app (banner de Android, pantalla de inicio, splash screen), con vista previa en vivo y descarga de un `manifest.json` listo para reemplazar el de `public/`.

**Import**
```tsx
import { AppIdentityConfig } from "lib-kit-components";
```

## Cuándo usarlo

En un panel de administración o pantalla de configuración donde el usuario final (o el equipo del proyecto) necesita personalizar cómo se ve la app cuando se instala como PWA: nombre completo, nombre corto (bajo el ícono), descripción, color de tema, color de fondo del splash e íconos (normal y maskable). Persiste los cambios localmente y permite descargar el `manifest.json` resultante.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás mostrar el estado de instalación/soporte de la PWA (no editar identidad), usá `PwaStatus` o `InstallButton`.
- Si necesitás el prompt de instalación en sí (banner que invita a instalar), usá `PwaInstallPrompt` o `InstallButton`, no este panel.
- No es una cabecera de pantalla (`AppHeader*`) ni la reemplaza — es un panel de configuración que podría vivir debajo de cualquiera de ellas.
- Si ya tenés tu propio flujo de generación de manifest/íconos en build time (ej. `next-pwa`), este panel es redundante para producción; sirve como herramienta de configuración en desarrollo o para paneles de auto-servicio.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `baseManifest` | `Record<string, unknown>` | `undefined` | Manifest ya cargado (ej. `fetch("/manifest.json")`), para no perder claves que este panel no edita (`shortcuts`, `share_target`, etc.) al descargar el nuevo manifest. |
| `title` | `string` | `"Identidad de la app"` | Título mostrado arriba del formulario. |
| `className` | `string` | `""` | Clases adicionales para el contenedor grid raíz. |

## Tipos exportados

No exporta tipos propios directamente, pero depende de los tipos del hook `useAppIdentity` (`AppIdentity`).

## Ejemplos

### Uso básico
```tsx
<AppIdentityConfig />
```

### Con manifest base cargado, para no perder claves existentes
```tsx
function ConfigPage() {
  const [baseManifest, setBaseManifest] = useState<Record<string, unknown>>();

  useEffect(() => {
    fetch("/manifest.json").then((r) => r.json()).then(setBaseManifest);
  }, []);

  return <AppIdentityConfig baseManifest={baseManifest} title="Identidad de la PWA" />;
}
```

## Requisitos / dependencias

- Usa el hook `useAppIdentity` (`hooks/useAppIdentity.ts`) para leer/actualizar la identidad persistida y generar/descargar el manifest.
- Compone `Input`, `Textarea`, `ColorPicker` y `Button` de la librería.
- Usa `framer-motion` para la animación de entrada de la vista previa de instalación.
- Marcado como `"use client"`.
- No requiere ningún Provider explícito, pero `useAppIdentity` accede a `document`/`localStorage`/IndexedDB — sólo funciona en cliente (ya cubierto por `"use client"`).

## Notas y comportamiento

- La persistencia y el estado los maneja enteramente `useAppIdentity`; este componente es sólo la UI — no tiene estado propio de los valores de identidad (sólo el toggle local `platform` de la vista previa).
- Al subir un ícono, se convierte a `dataURL` en el cliente (`FileReader`) y se guarda tal cual en el estado persistido — no hay validación de tamaño ni redimensionado, así que archivos grandes se persisten completos.
- El botón "Restablecer" vuelve a los valores de `APP_IDENTITY_DEFAULTS` del hook, no a los del `baseManifest` pasado por prop.
- Cambiar el ícono acá actualiza el estado persistido y, si `useAppIdentity` tiene `applyLive` activo (default), pisa en caliente el `<link rel="icon">`, el `<meta name="theme-color">` y el `document.title` de la página actual — pero **no** actualiza apps ya instaladas en el dispositivo del usuario final, que requieren resubir `manifest.json` y los PNG de `/icons` porque el sistema operativo no relee el manifest en caliente.
- La vista previa (toggle iOS/Android) es puramente visual/ilustrativa, no afecta el manifest generado.
