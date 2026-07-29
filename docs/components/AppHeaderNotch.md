# AppHeaderNotch

> Variante de `AppHeader` con una muesca circular fija en el borde inferior que sostiene un botón redondo flotante (perfil, logo, cámara…), que entra con un rebote elástico al montar el header.

**Import**
```tsx
import { AppHeaderNotch } from "lib-kit-components";
```

## Cuándo usarlo

Cuando la pantalla necesita una acción central protagonista anclada visualmente al header, tipo apps de cámara, apps sociales con botón de "crear" o dashboards con un avatar/logo grande centrado entre el header y el contenido. El botón (`center`) queda semi-superpuesto, mitad dentro del header y mitad sobre el contenido.

## Cuándo NO usarlo / alternativas

- Si no necesitás una acción central destacada, usá [AppHeader](AppHeader.md) o cualquiera de las otras variantes — la muesca ocupa espacio visual (`pr-10` en las acciones) aunque no pases `center`.
- Si el elemento flotante que necesitás es una tarjeta de contenido (no un botón circular), usá [AppHeaderCardSlot](AppHeaderCardSlot.md).
- Si preferís una cápsula flotante sin muesca, usá [AppHeaderIsland](AppHeaderIsland.md).
- No tiene buscador ni `largeTitle` — para eso usá `AppHeader`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `string` | — (requerido) | Título de la pantalla. |
| `subtitle` | `string` | `undefined` | Texto secundario debajo del título. |
| `onBack` | `() => void` | `undefined` | Si se pasa, muestra la flecha de volver. |
| `center` | `ReactNode` | `undefined` | Contenido del botón circular flotante en la muesca (ej. avatar, ícono). Sin `center`, la muesca queda vacía. |
| `onCenterClick` | `() => void` | `undefined` | Handler de click del botón circular central. |
| `actions` | `HeaderAction[]` | `[]` | Botones de icono a la derecha, con badge opcional. |
| `scrollRef` | `RefObject<HTMLElement \| null>` | `undefined` | Elemento scrolleable a observar en vez de la ventana. |
| `safeArea` | `boolean` | `true` | Agrega `padding-top` respetando `env(safe-area-inset-top)`. |
| `className` | `string` | `""` | Clases adicionales para el `<header>`. |

## Tipos exportados

No exporta tipos propios. Usa `HeaderAction`, exportado desde [AppHeader](AppHeader.md).

## Ejemplos

### Con avatar central
```tsx
<AppHeaderNotch
  title="Mi perfil"
  center={<img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />}
  onCenterClick={() => router.push("/perfil")}
/>
```

### Con volver y acciones
```tsx
<AppHeaderNotch
  title="Cámara"
  onBack={() => router.back()}
  center={<CameraIcon />}
  onCenterClick={takePhoto}
  actions={[{ id: "flash", label: "Flash", icon: <FlashIcon />, onClick: toggleFlash }]}
/>
```

## Requisitos / dependencias

- Usa `framer-motion` para la animación de entrada con rebote (`spring`) del botón central.
- Usa internamente `HeaderIcons` (`ChevronLeftIcon`) — helper interno, no exportado por el paquete.
- Marcado como `"use client"`.
- No requiere ningún Provider.

## Notas y comportamiento

- La muesca se dibuja con `mask-image`/`-webkit-mask-image` (`radial-gradient` circular de 26px de radio centrado en el borde inferior) — requiere soporte de CSS masks en el navegador; en navegadores sin soporte el header se ve como un rectángulo normal (degrada de forma segura, sin errores).
- El botón `center` se posiciona `absolute` con `-bottom-5`, por lo que sobresale del header hacia el contenido; el layout del contenido debajo no reserva espacio automáticamente para él — hay que dejar margen manualmente si no querés que lo tape.
- Si no pasás `center`, la muesca igual se recorta en el fondo del header (queda un hueco visual vacío); considerá usar otra variante si no vas a usar el botón central.
- La fila de acciones tiene `pr-10` fijo para no superponerse visualmente con la muesca central, incluso sin `center`.
