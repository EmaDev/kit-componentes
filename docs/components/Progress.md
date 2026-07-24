# ProgressBar / ProgressRing / StepsProgress

> Tres formas de mostrar progreso: barra lineal (`ProgressBar`), anillo circular (`ProgressRing`) y pasos de un flujo multi-etapa (`StepsProgress`).

**Import**
```tsx
import { ProgressBar, ProgressRing, StepsProgress } from "lib-kit-components";
```

## Cuándo usarlo

`ProgressBar` sirve para cargas, subidas de archivos o cualquier proceso lineal donde el ancho disponible es horizontal (barras de progreso de formularios, uploads, descargas). Soporta modo indeterminado (sin `value`), segmentado (pasos discretos sin etiqueta) y rayado animado ("trabajando"). `ProgressRing` muestra el mismo tipo de dato pero en espacio reducido o compacto — avatares con progreso de perfil, widgets de dashboard, indicadores circulares pequeños — y permite contenido custom en el centro (ej. un ícono). `StepsProgress` es específico para wizards y flujos multi-paso con nombre (checkout, onboarding, formularios largos), mostrando cada paso como un círculo numerado/checkeado conectado por una línea.

## Cuándo NO usarlo / alternativas

- Si el progreso corresponde a pasos con nombre de un flujo (checkout, onboarding, wizard), usá `StepsProgress` en vez de `ProgressBar`/`ProgressRing` — comunica mejor "en qué paso estoy" que un simple porcentaje.
- Si el espacio es angosto/circular (avatar, ícono, celda compacta), preferí `ProgressRing` sobre `ProgressBar`.
- Si el espacio es horizontal y ancho (barra de carga completa), usá `ProgressBar`.

## Props

### ProgressBar

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `value` | `number` | `undefined` | Progreso de `0` a `max`. Si se omite, entra en **modo indeterminado** (animación de barra deslizante infinita). |
| `max` | `number` | `100` | Valor máximo de referencia para calcular el porcentaje. |
| `tone` | `"primary" \| "accent" \| "success" \| "danger" \| "warning"` | `"primary"` | Color de relleno. Nota: `"warning"` actualmente usa el mismo color que `"accent"` (ver Notas). |
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | `"md"` | Alto de la barra: `xs`=3px, `sm`=5px, `md`=8px, `lg`=12px. |
| `showValue` | `boolean` | `false` | Muestra el porcentaje redondeado a la derecha del `label`. No se muestra si está en modo indeterminado. |
| `label` | `ReactNode` | `undefined` | Texto/etiqueta sobre la barra. |
| `striped` | `boolean` | `false` | Agrega un rayado diagonal animado sobre el relleno (efecto "en progreso"). Sólo aplica en modo continuo (no en `segments` ni indeterminado). |
| `segments` | `number` | `undefined` | Si se define, renderiza `segments` bloques discretos en vez de una barra continua; cada bloque se activa según el porcentaje alcanzado. |
| `className` | `string` | `""` | Clases CSS adicionales. |

### ProgressRing

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `value` | `number` | `undefined` | Progreso de `0` a `max`. Si se omite, entra en modo indeterminado (anillo girando continuamente, con un arco fijo del 25%). |
| `max` | `number` | `100` | Valor máximo de referencia. |
| `size` | `number` | `72` | Diámetro del anillo en px. |
| `thickness` | `number` | `7` | Grosor del trazo en px. |
| `tone` | `"primary" \| "accent" \| "success" \| "danger" \| "warning"` | `"primary"` | Color del trazo de progreso. |
| `children` | `ReactNode` | `undefined` | Contenido custom al centro del anillo (reemplaza el porcentaje mostrado por default). |
| `showValue` | `boolean` | `true` | Si no hay `children`, muestra el porcentaje numérico al centro (sólo cuando no está en modo indeterminado). |
| `className` | `string` | `""` | Clases CSS adicionales. |

### StepsProgress

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `steps` | `string[]` | — (requerido) | Nombres de cada paso, en orden. |
| `current` | `number` | — (requerido) | Índice (0-based) del paso actual. Pasos con índice menor se muestran completados (check); el paso igual a `current` se muestra activo; los posteriores quedan pendientes. |
| `tone` | `"primary" \| "accent" \| "success" \| "danger" \| "warning"` | `"primary"` | Color de los pasos completados/activos y conectores. |
| `className` | `string` | `""` | Clases CSS adicionales. |

## Ejemplos

### ProgressBar de subida de archivo
```tsx
<ProgressBar value={uploadProgress} showValue label="Subiendo archivo.zip" />
```

### ProgressBar indeterminada
```tsx
<ProgressBar label="Procesando…" />
```

### ProgressBar segmentada y rayada
```tsx
<ProgressBar value={60} segments={5} tone="success" />
<ProgressBar value={40} striped tone="accent" label="Sincronizando" showValue />
```

### ProgressRing en un avatar de perfil
```tsx
<ProgressRing value={profileCompletion} size={64} thickness={5} tone="success">
  <img src={user.avatar} className="w-12 h-12 rounded-full" />
</ProgressRing>
```

### ProgressRing indeterminado (loading compacto)
```tsx
<ProgressRing size={32} thickness={4} showValue={false} />
```

### StepsProgress en un checkout
```tsx
<StepsProgress
  steps={["Carrito", "Envío", "Pago", "Confirmación"]}
  current={2}
  tone="primary"
/>
```

## Requisitos / dependencias

- Ninguno de los tres depende de `next`. Funcionan en cualquier app React/Next.js.
- Usan `framer-motion` para: relleno animado con spring (`ProgressBar`), aparición escalonada de segmentos, deslizamiento infinito en modo indeterminado, animación del `strokeDashoffset` del SVG (`ProgressRing`), y el check/número animado más el escalado del paso activo (`StepsProgress`).
- Los tres son de sólo lectura/presentacionales (no manejan interacción del usuario ni estado propio más allá de las animaciones).

## Notas y comportamiento

- En `ProgressBar` y `ProgressRing`, el modo indeterminado se activa automáticamente cuando `value` es `undefined`/`null` (`value == null`) — no hay una prop explícita `indeterminate`.
- `value` se clampea siempre entre 0 y 100% del porcentaje calculado (`Math.max(0, Math.min(100, ...))`), así que valores fuera de rango de `value`/`max` no rompen el layout.
- **`tone="warning"` no tiene color propio**: en el mapeo interno (`TONE_FILL`/`TONE_STROKE`), `warning` apunta a `bg-accent` / `var(--color-accent)`, exactamente igual que `tone="accent"`. Si necesitás un color distinto para advertencias, hay que pasar la clase custom vía `className` o tratarlo como conocido gap de la librería.
- En `ProgressBar` con `segments`, el `role="progressbar"` se coloca en el contenedor de segmentos con `aria-valuenow`/`aria-valuemax` tomando el `value`/`max` crudos (no el porcentaje), a diferencia de la barra continua que sí usa `aria-valuenow` en porcentaje (0-100) y fija `aria-valuemin={0}`/`aria-valuemax={100}`.
- `striped` no tiene efecto si se combina con `segments` (son modos de render mutuamente excluyentes: si `segments` está definido, se ignora todo el bloque de barra continua/indeterminada/rayado).
- En `ProgressRing`, el modo indeterminado gira el `<svg>` completo de forma continua y fija un arco de 25% (`pct = 25` hardcodeado) mientras dura el giro — no es un verdadero indicador circular indeterminado tipo Material, sino un arco fijo rotando.
- En `StepsProgress`, el conector antes del primer paso y después del último se oculta con `opacity-0` (mantiene el espaciado del layout sin mostrar línea colgante en los extremos).
- En `StepsProgress`, el ícono de check reemplaza al número únicamente en pasos con índice `< current` (completados); el paso `=== current` (activo) sigue mostrando su número, con estilo visualmente distinto (borde de color, fondo `surface`).
- Los labels de `StepsProgress` truncan con `truncate max-w-full` si son muy largos para el ancho asignado a cada paso (los pasos se reparten el ancho total en partes iguales, `flex-1`).
