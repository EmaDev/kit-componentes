# ScrollArea

> Contenedor con scroll y barra propia (reemplaza la nativa), con 4 formatos/grosores/animaciones distintos y thumb arrastrable.

**Import**
```tsx
import { ScrollArea } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para reemplazar el scroll nativo del navegador dentro de un panel, lista larga, sidebar de contenido o cualquier contenedor con altura fija donde querés una barra de scroll consistente entre navegadores (Firefox/Safari/Chrome dibujan la nativa distinto) y con más personalidad visual que el `::-webkit-scrollbar` global del tema.

## Cuándo NO usarlo / alternativas

- Para el scroll general de la página (`body`/`html`), no lo uses — está pensado para contenedores acotados con `overflow`, no reemplaza el scroll del documento.
- Si sólo necesitás que el scroll nativo se vea "bien" sin barra custom interactiva, alcanza con los tokens de `::-webkit-scrollbar` ya definidos globalmente en `app/globals.css` — no hace falta `ScrollArea` para eso.
- Si el contenido es una hoja de datos con muchas columnas/filas (no un simple panel scrolleable), evaluá `DataTable` o `Spreadsheet`, que manejan su propio scroll interno con sticky header.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `children` | `ReactNode` | — (requerido) | Contenido scrolleable. |
| `variant` | `"thin" \| "pill" \| "glow" \| "debounce"` | `"thin"` | Formato/grosor/animación de la barra (ver detalle abajo). |
| `orientation` | `"vertical" \| "horizontal" \| "both"` | `"vertical"` | Eje(s) en los que se habilita el scroll y se dibuja la barra. |
| `maxHeight` | `string \| number` | `undefined` | Alto máximo del viewport scrolleable (cualquier valor CSS válido, ej. `"20rem"`, `320`). Sin esto, el contenedor crece con el contenido y no hay nada que scrollear. |
| `hideDelay` | `number` | `900` | Ms de inactividad tras dejar de scrollear antes de atenuar el thumb (aplica a `"thin"`, `"glow"` y `"debounce"`). |
| `showDelay` | `number` | `160` | Ms de debounce antes de **revelar** el thumb tras iniciar el hover/scroll. Sólo aplica a `variant="debounce"` — el resto de variantes reaccionan al instante. Arrastrar el thumb siempre lo revela sin esperar este delay. |
| `className` | `string` | `""` | Clases para el contenedor raíz (`relative`). |
| `contentClassName` | `string` | `""` | Clases adicionales para el viewport scrolleable interno. |

### Los 4 variantes

| Variant | Grosor idle → activo | Animación |
|---|---|---|
| `thin` | 4px → 4px | Invisible en reposo; aparece con fade al hacer hover del contenedor o al scrollear, y se atenúa de nuevo tras `hideDelay` (estilo overlay scrollbar de macOS). |
| `pill` | 8px → 12px | Siempre visible a baja opacidad (35%); al activarse (hover/scroll/drag) se ensancha con un spring y pasa a opacidad completa y color `primary`. |
| `glow` | 6px → 8px | Gradiente `primary → accent` con resplandor (`box-shadow`) permanente; atenuado (45% opacidad) en reposo, a opacidad completa al activarse. |
| `debounce` | 5px → 11px | Invisible en reposo; **no** reacciona al instante como `thin` — espera `showDelay` de hover/scroll sostenido antes de revelarse, y el grosor "rebota" con un spring más blando (`stiffness: 200, damping: 12`) en vez de resolver directo. Color `accent` con resplandor. Arrastrar el thumb ignora el delay y lo revela al toque. |

## Tipos exportados

```ts
export type ScrollAreaVariant = "thin" | "pill" | "glow" | "debounce";
export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";
```

## Ejemplos

### Uso básico
```tsx
<ScrollArea maxHeight={280}>
  <div className="flex flex-col gap-3 p-1">
    {items.map((item) => <ItemRow key={item.id} item={item} />)}
  </div>
</ScrollArea>
```

### Variant "pill", lista de notificaciones
```tsx
<ScrollArea variant="pill" maxHeight="24rem" className="rounded-xl border border-border">
  <NotificationList />
</ScrollArea>
```

### Variant "glow", panel destacado
```tsx
<ScrollArea variant="glow" maxHeight={360} contentClassName="p-4">
  <MarkdownPreview content={doc} />
</ScrollArea>
```

### Scroll horizontal
```tsx
<ScrollArea orientation="horizontal" variant="thin" contentClassName="flex gap-3 p-1">
  {images.map((img) => <img key={img.id} src={img.src} className="h-32 rounded-lg shrink-0" />)}
</ScrollArea>
```

### Variant "debounce", con delay de revelación más largo
```tsx
<ScrollArea variant="debounce" showDelay={300} maxHeight={320}>
  <LongDocument />
</ScrollArea>
```

## Requisitos / dependencias

- Usa `framer-motion` para animar opacidad y grosor del thumb.
- Marcado como `"use client"`.
- Usa `ResizeObserver` para remedir el contenido cuando cambia de tamaño (agregar/quitar ítems, texto que crece, etc.) — no requiere ningún prop adicional para eso.
- No requiere ningún provider.

## Notas y comportamiento

- El scroll nativo del navegador **sigue funcionando** (rueda del mouse, trackpad, teclado, swipe táctil): sólo se oculta la barra visual nativa (`scrollbar-width: none`, `[&::-webkit-scrollbar]:hidden`) y se reemplaza por el thumb custom, que además es **arrastrable** (`pointerdown` + `pointermove` sobre `window`) para scrollear con el mouse directamente sobre la barra.
- El thumb tiene un tamaño mínimo de 8% del track para que siga siendo agarrable con el mouse incluso en contenidos muy largos, aunque proporcionalmente le correspondería un tamaño menor.
- Si `maxHeight` no se especifica (ni se limita la altura por `className`/`contentClassName`), el contenedor crece con el contenido como un `<div>` normal y no hay scroll que mostrar — es responsabilidad del consumidor acotar la altura.
- Con `orientation="both"`, las dos barras (vertical en el borde derecho, horizontal en el borde inferior) no reservan espacio para evitar superponerse en la esquina — hay un pequeño solape ahí, aceptable para el caso de uso típico (paneles con overflow ocasional en ambos ejes, no grillas densas).
- La barra se oculta completamente (no se renderiza) cuando el contenido no excede el tamaño del viewport en ese eje — no hay un thumb "vacío" o deshabilitado.
- **`variant="debounce"`**: el delay de `showDelay` sólo afecta la revelación pasiva por `hover`/`scroll` — se reinicia cada vez que la actividad se corta y vuelve a empezar (comportamiento debounce real, no throttle: scrolls cortos e intermitentes por debajo de `showDelay` nunca llegan a mostrar el thumb). Iniciar un arrastre (`pointerdown` sobre el thumb) lo revela sin esperar el delay, para que la interacción de drag nunca se sienta "trabada".
