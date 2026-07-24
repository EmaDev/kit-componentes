# Modal

> Diálogo centrado sobre un backdrop con blur, con header/footer opcionales, para confirmaciones y formularios.

**Import**
```tsx
import { Modal } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para diálogos centrados clásicos: confirmaciones ("¿Eliminar este ítem?"), formularios cortos, visores de detalle, cualquier interacción que deba bloquear el resto de la pantalla y funcionar igual en desktop y mobile. Soporta 5 tamaños (incluido `full`, casi pantalla completa) y footer con acciones alineadas a la derecha.

## Cuándo NO usarlo / alternativas

- Si la interacción se siente más "app nativa" (selector de opciones desde abajo, acciones rápidas en mobile, drag-to-close), usá `BottomSheet`, que además puede flotar como card centrada en desktop (`desktopFloating`).
- Para feedback no bloqueante que no requiere acción del usuario, usá `Toast` en vez de un `Modal`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `open` | `boolean` | — (requerido) | Controla si el modal está visible. |
| `onClose` | `() => void` | — (requerido) | Se llama al cerrar (botón X, backdrop, o tecla `Escape`). |
| `title` | `string` | `undefined` | Título del header. |
| `description` | `string` | `undefined` | Texto secundario debajo del título. Ver nota importante abajo. |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "full"` | `"md"` | Ancho máximo del diálogo (`full` también fija el alto a casi toda la pantalla). |
| `children` | `ReactNode` | `undefined` | Contenido del cuerpo (con scroll propio si excede el alto disponible). |
| `footer` | `ReactNode` | `undefined` | Contenido fijo al pie (típicamente botones de acción), separado por un borde superior. |
| `closeOnBackdrop` | `boolean` | `true` | Si es `false`, hacer click en el fondo oscuro no cierra el modal. |
| `showClose` | `boolean` | `true` | Muestra/oculta el botón × en el header. |

## Ejemplos

### Confirmación simple
```tsx
const [open, setOpen] = useState(false);

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Eliminar producto"
  description="Esta acción no se puede deshacer."
  size="sm"
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
      <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
    </>
  }
>
  <p className="text-sm text-muted">¿Estás seguro que querés eliminar este producto del catálogo?</p>
</Modal>
```

### Formulario dentro de un modal
```tsx
<Modal open={open} onClose={() => setOpen(false)} title="Nuevo cliente" size="lg">
  <div className="flex flex-col gap-4">
    <Input label="Nombre" />
    <Input label="Email" type="email" />
    <Textarea label="Notas" />
  </div>
</Modal>
```

### Pantalla completa, sin cierre por backdrop
```tsx
<Modal
  open={open}
  onClose={() => setOpen(false)}
  size="full"
  closeOnBackdrop={false}
  title="Editor"
>
  <EditorCanvas />
</Modal>
```

### Sin header (contenido custom)
```tsx
<Modal open={open} onClose={() => setOpen(false)} showClose={false} size="sm">
  <div className="text-center py-4">
    <SuccessIllustration />
    <p className="mt-3 font-medium">¡Listo!</p>
  </div>
</Modal>
```

## Requisitos / dependencias

- Usa `framer-motion` internamente (`AnimatePresence`, blur animado del backdrop, spring de entrada del diálogo).
- Marcado como `"use client"`.
- Es completamente **controlado**: el consumidor maneja el estado `open` (no hay modo no controlado ni trigger incorporado).

## Notas y comportamiento

- El header (título + botón cerrar) sólo se renderiza si `title` o `showClose` son truthy. **Gotcha**: si pasás sólo `description` sin `title` y con `showClose={false}`, la `description` no se muestra en absoluto, porque toda la sección de header queda condicionada a `(title || showClose)`.
- Mientras el modal está `open`, se bloquea el scroll del body (`document.body.style.overflow = "hidden"`), y se restaura al cerrar/desmontar.
- Se cierra con la tecla `Escape` automáticamente (listener agregado sólo mientras `open` es `true`).
- El `<div role="dialog" aria-modal="true">` no tiene focus trap propio ni `aria-labelledby`/`aria-describedby` vinculados al título/descripción — si necesitás accesibilidad estricta de foco (atrapar el tab dentro del modal, devolver el foco al cerrar), es responsabilidad del consumidor implementarlo.
- El cuerpo (`children`) tiene su propio scroll independiente (`overflow-auto`) cuando el contenido excede el alto máximo disponible (`max-h-[calc(100vh-2rem)]` en el diálogo completo).
- El z-index del contenedor es `z-[90]`, menor al de `BottomSheet` (`z-[140]`/`z-[150]`), por lo que un `BottomSheet` abierto se ve por encima de un `Modal` si ambos están abiertos a la vez.
