# FabActionSheets

> FAB con speed dial donde cada acción abre su propio BottomSheet, con contenido totalmente libre.

**Import**
```tsx
import { FabActionSheets } from "lib-kit-components";
import type { FabSheetAction } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando el botón flotante tiene que ofrecer varias acciones y **cada una necesita un formulario o una lista propia**, no ejecutarse de una: "nuevo gasto", "nueva nota", "escanear QR". Compone [FloatingButton](FloatingButton.md) con [BottomSheet](BottomSheet.md) y se encarga del cableado entre los dos.

## Cuándo NO usarlo / alternativas

- Si las acciones se **ejecutan directo** (sin pedir datos), usá [FloatingButton](FloatingButton.md) con `actions` y tus propios `onClick`: no hace falta esta capa.
- Si hay una sola acción, un `FloatingButton` con `onClick` alcanza.
- Si el menú de acciones se abre desde una fila o un ícono y no desde un FAB, usá [Dropdown](Dropdown.md) o un [BottomSheet](BottomSheet.md) propio.
- Si la acción es específicamente tomar una nota rápida, [QuickNotePad](QuickNotePad.md) ya trae el sheet armado.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `actions` | `FabSheetAction[]` | — (requerido) | Acciones del speed dial; cada una define su propio sheet. |
| `mainIcon` | `ReactNode` | `undefined` | Ícono del FAB principal. Si se omite, usa el default de `FloatingButton`. |
| `mainLabel` | `string` | `"Acciones"` | Label accesible del FAB principal. |
| `position` | `"bottom-right" \| "bottom-left" \| "bottom-center"` | `"bottom-right"` | Posición del FAB. |
| `tone` | `"primary" \| "accent" \| "success" \| "danger"` | `"primary"` | Color del FAB principal. |
| `hideOnScroll` | `boolean` | `true` | Esconder el FAB al scrollear hacia abajo. |
| `scrollTarget` | `React.RefObject<HTMLElement>` | `undefined` | Contenedor scrolleable a observar. Por defecto, la ventana. |
| `absolute` | `boolean` | `false` | `absolute` en vez de `fixed`, para montarlo dentro de un contenedor (mocks, previews). |
| `className` | `string` | `""` | Clases adicionales, pasadas a `FloatingButton`. |

## Tipos exportados

```ts
interface FabSheetAction {
  icon: ReactNode;
  label: string;
  tone?: "primary" | "accent" | "success" | "danger";
  /** contenido libre del sheet: formulario, lista, lo que sea */
  content: ReactNode;
  sheetTitle?: string;          // default: label
  sheetDescription?: string;
  sheetSize?: BottomSheetSize;
  sheetFooter?: ReactNode;
  sheetSnapPoints?: number[];
}
```

## Ejemplos

### Uso básico
```tsx
<FabActionSheets
  actions={[
    {
      icon: <PlusIcon />,
      label: "Nuevo gasto",
      content: <FormularioGasto onDone={cerrar} />,
    },
    {
      icon: <CameraIcon />,
      label: "Escanear ticket",
      tone: "accent",
      content: <EscanerTicket />,
    },
  ]}
/>
```

### Con sheet a medida por acción
```tsx
<FabActionSheets
  mainLabel="Crear"
  actions={[
    {
      icon: <NoteIcon />,
      label: "Nota",
      sheetTitle: "Nueva nota",
      sheetDescription: "Se guarda en tu cuaderno personal.",
      sheetSize: "lg",
      sheetFooter: <Button fullWidth onClick={guardar}>Guardar nota</Button>,
      content: <Textarea label="Contenido" />,
    },
    {
      icon: <FilterIcon />,
      label: "Filtros",
      sheetSnapPoints: [0.4, 0.9],
      content: <PanelDeFiltros />,
    },
  ]}
/>
```

### Dentro de un contenedor acotado (mock de pantalla)
```tsx
<div className="relative h-[560px] overflow-y-auto rounded-2xl border border-border" ref={scrollRef}>
  <Contenido />
  <FabActionSheets absolute scrollTarget={scrollRef} actions={acciones} />
</div>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Depende de [FloatingButton](FloatingButton.md) y [BottomSheet](BottomSheet.md) del propio kit (y por lo tanto de `framer-motion`).
- No depende de Next.js.

## Notas y comportamiento

- **Todos los sheets están montados a la vez**, uno por acción, y sólo el que corresponde tiene `open={true}`. Es decir: el `content` de cada acción se renderiza desde el arranque, aunque el sheet esté cerrado. Si un `content` hace fetch o abre la cámara al montarse, va a ejecutarse antes de que el usuario abra nada — en ese caso, renderizá el contenido condicionalmente adentro de tu propio componente.
- **No expone cuál sheet está abierto**: el índice es estado interno y no hay callback (`onOpenChange`). Cerrar un sheet desde su propio `content` requiere pasarle tu propia función y manejar el cierre por afuera (por ejemplo, con el botón X del sheet o el backdrop).
- Sólo se puede tener **un sheet abierto a la vez**: elegir una acción del speed dial cierra cualquier otra.
- Las `key` de los sheets son el índice del array: si reordenás `actions` en caliente con un sheet abierto, el contenido puede quedar desalineado. Mantené el orden estable.
- `sheetTitle` cae en `label` si no lo definís, así que el título del sheet coincide con el texto de la acción por defecto.
- `sheetSnapPoints` tiene prioridad sobre `sheetSize` (es el comportamiento de `BottomSheet`: con `snapPoints` definido, `size` se ignora).
- El cierre del sheet lo maneja `BottomSheet` con sus defaults: backdrop y arrastre hacia abajo habilitados.
- `hideOnScroll` esconde el FAB, no el sheet abierto.
