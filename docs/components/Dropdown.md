# Dropdown

> Menú contextual genérico anclado a cualquier elemento disparador, para listas de acciones.

**Import**
```tsx
import { Dropdown } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para menús de **acciones** anclados a un trigger arbitrario: un botón de "⋮" (más opciones), un avatar de usuario, un ícono. Cada ítem del menú ejecuta una acción (`onClick`) o navega (`href`), no captura un valor de formulario. Soporta separadores, íconos, atajos de teclado visuales y estilo destructivo (rojo) para acciones como "Eliminar".

## Cuándo NO usarlo / alternativas

- Si necesitás que el usuario elija un valor dentro de un formulario (con label, error, hint, valor controlado), usá `Select` — `Dropdown` no tiene noción de "valor seleccionado persistente".
- Si la lista de acciones requiere un formulario propio o contenido más complejo que texto+ícono, considerá `Modal` o `BottomSheet` en su lugar.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `trigger` | `ReactNode` | — (requerido) | Elemento que abre/cierra el menú al hacer click (botón, avatar, ícono, etc.). Se envuelve en un `<div>` con `onClick`. |
| `items` | `DropdownItem[]` | — (requerido) | Ítems del menú, en orden de renderizado. |
| `align` | `"start" \| "end"` | `"end"` | Alineación horizontal del menú respecto al trigger (`"end"` = alineado a la derecha). |
| `className` | `string` | `""` | Clases para el contenedor raíz (`relative inline-block`). |
| `menuClassName` | `string` | `""` | Clases adicionales para el panel del menú desplegado. |

## Tipos exportados

```ts
export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  destructive?: boolean;
  shortcut?: string;
  disabled?: boolean;
  divider?: boolean;
}
```

## Ejemplos

### Uso básico (acciones sobre una fila)
```tsx
<Dropdown
  trigger={<Button variant="ghost" size="icon"><MoreIcon /></Button>}
  items={[
    { label: "Editar", icon: <EditIcon />, onClick: () => editItem(id) },
    { label: "Duplicar", icon: <CopyIcon />, onClick: () => duplicateItem(id) },
    { divider: true },
    { label: "Eliminar", icon: <TrashIcon />, destructive: true, onClick: () => deleteItem(id) },
  ]}
/>
```

### Con atajos de teclado visuales y navegación
```tsx
<Dropdown
  align="start"
  trigger={<Avatar src={user.avatar} />}
  items={[
    { label: "Mi perfil", href: "/perfil" },
    { label: "Configuración", href: "/config", shortcut: "⌘," },
    { divider: true },
    { label: "Cerrar sesión", onClick: logout, destructive: true },
  ]}
/>
```

### Ítem deshabilitado
```tsx
<Dropdown
  trigger={<Button size="icon" variant="ghost"><SettingsIcon /></Button>}
  items={[
    { label: "Exportar CSV", onClick: exportCsv },
    { label: "Exportar PDF", onClick: exportPdf, disabled: !hasProPlan },
  ]}
/>
```

## Requisitos / dependencias

- Usa `framer-motion` internamente para la animación de apertura/cierre y el stagger de los ítems.
- Marcado como `"use client"`.
- No requiere ningún provider — es autocontenido, cada `Dropdown` maneja su propio estado `open`.

## Notas y comportamiento

- El menú se cierra al hacer click fuera (listener `mousedown` en `document`), al presionar `Escape`, o al clickear cualquier ítem (incluidos los que tienen `href`).
- Un ítem con `divider: true` renderiza sólo una línea separadora; el resto de sus campos (`label`, `onClick`, etc.) se ignoran.
- **Gotcha de accesibilidad/comportamiento**: la prop `disabled` sólo se aplica cuando el ítem se renderiza como `<button>` (sin `href`). Si un ítem tiene `href` **y** `disabled: true`, el link sigue siendo clickeable — `disabled` no tiene efecto en los ítems de tipo enlace.
- `shortcut` es puramente visual (texto monoespaciado a la derecha del ítem); no registra ningún listener de teclado real.
- El origen de la animación de escala/opacidad del menú (`originX`) depende de `align`: `1` (desde la derecha) si `align="end"`, `0` (desde la izquierda) si `align="start"`.
