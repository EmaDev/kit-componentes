# OfflineFallback

> Pantalla (o bloque inline) de "sin conexión" para cuando un fetch falla y no hay nada en caché para mostrar. Se actualiza sola: en cuanto vuelve la conexión, cambia el mensaje y ofrece recargar.

**Import**
```tsx
import { OfflineFallback } from "lib-kit-components";
```

## Cuándo usarlo

Como estado de error de una pantalla que depende de datos remotos, cuando el fetch falló **y** no hay ningún dato cacheado para mostrar en su lugar (si hay caché, mejor mostrar el dato viejo con `SyncStatus`/`useCachedFetch` en vez de bloquear la pantalla). Reacciona en vivo al evento `online`/`offline` del navegador, así que si la conexión vuelve mientras el usuario mira la pantalla, el mensaje cambia solo.

## Cuándo NO usarlo / alternativas

- Si tenés datos cacheados (aunque estén desactualizados), mostralos con `SyncStatus` como indicador secundario en vez de bloquear toda la pantalla con `OfflineFallback`.
- Para un aviso persistente y no bloqueante de que el dispositivo está sin conexión (sin que haya fallado ningún fetch todavía), usá `OfflineBanner`.
- `OfflineFallback` no reintenta nada por sí mismo: la lógica de refetch va en tu `onRetry`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `string` | `"Sin conexión"` | Título mientras está offline. |
| `description` | `string` | `"No pudimos cargar esta pantalla. Revisá tu conexión y volvé a intentar."` | Texto de ayuda mientras está offline. |
| `onRetry` | `() => void` | `undefined` | Reintentar la carga. Si no se pasa, no se muestra el botón. |
| `onGoCached` | `() => void` | `undefined` | Ir a la última versión guardada (si existe). Si no se pasa, no se muestra el botón. |
| `cachedLabel` | `string` | `"Ver contenido guardado"` | Texto del botón de `onGoCached`. |
| `variant` | `"full" \| "inline"` | `"full"` | Pantalla casi completa (`min-h-[60dvh]`) o bloque dentro de una card existente. |
| `className` | `string` | `""` | Clases adicionales para el contenedor. |

## Ejemplos

### Como estado de error de una pantalla completa
```tsx
function ProductScreen() {
  const { data, error, refetch } = useCachedFetch<Product>(`/api/products/${id}`);

  if (error && !data) {
    return <OfflineFallback onRetry={refetch} />;
  }
  return <ProductDetail product={data} />;
}
```

### Inline, dentro de una sección de la pantalla
```tsx
<Card>
  <OfflineFallback
    variant="inline"
    title="No pudimos traer los comentarios"
    onRetry={reloadComments}
  />
</Card>
```

### Con acceso a lo último guardado
```tsx
<OfflineFallback
  onRetry={refetch}
  onGoCached={() => router.push(`/products/${id}?cached=1`)}
  cachedLabel="Ver la última versión guardada"
/>
```

## Requisitos / dependencias

- Usa el hook `useOnlineStatus` para reaccionar en vivo a los eventos `online`/`offline`.
- Usa `framer-motion` para la entrada del ícono.
- Marcado como `"use client"`. No requiere ningún Provider.

## Notas y comportamiento

- En cuanto `online` pasa a `true`, el componente **reemplaza** título y descripción por "Conexión restablecida" / "Ya podés volver a cargar la pantalla" — no oculta el bloque ni llama a `onRetry` solo; sigue siendo responsabilidad del consumidor decidir cuándo recargar (mostrando el botón de `onRetry`, que sigue visible).
- Ninguno de los dos botones se muestra si no se pasa su callback correspondiente — si no pasás ni `onRetry` ni `onGoCached`, el bloque queda sólo como mensaje informativo sin acciones.
- `variant="inline"` agrega su propio borde y fondo tenue (`rounded-2xl border border-border bg-surface-alt/40`); pensado para vivir dentro de otro contenedor, no para reemplazar toda la pantalla.
