# StreakTracker

> Racha de estudio: días consecutivos + grilla de constancia tipo "contribuciones de GitHub".

**Import**
```tsx
import { StreakTracker } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para mostrar **constancia en el tiempo**: cuántos días seguidos viene estudiando el usuario y cómo se ve su historial de las últimas semanas. Es un componente de refuerzo motivacional, típico del home de una app de aprendizaje o hábitos.

## Cuándo NO usarlo / alternativas

- Si querés mostrar **cuánto sabe** de cada tema (no cuándo estudió), usá [ProgressByTopic](ProgressByTopic.md).
- Si necesitás un calendario navegable con eventos, fechas clickeables o detalle por día, usá [CalendarGrid](CalendarGrid.md) — esta grilla es de sólo lectura y sin navegación.
- Si el dato es un progreso hacia una meta única, usá [Progress](Progress.md) o [AnimatedProgressRing](AnimatedProgressRing.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `studiedDates` | `string[]` | — (requerido) | Fechas en que hubo actividad, en formato `yyyy-mm-dd`. El orden no importa y los duplicados se ignoran (se convierte a `Set`). |
| `weeks` | `number` | `14` | Cuántas semanas hacia atrás mostrar en la grilla (`weeks * 7` días, terminando hoy). |
| `goalPerWeek` | `number` | `5` | Meta semanal. **Sólo informativa**: se muestra como texto y no afecta ningún cálculo ni color. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Ejemplos

### Uso básico
```tsx
<StreakTracker studiedDates={["2026-07-27", "2026-07-28", "2026-07-29"]} />
```

### Medio año de historial
```tsx
<StreakTracker
  studiedDates={sesiones.map((s) => s.fecha)}   // ya en yyyy-mm-dd
  weeks={26}
  goalPerWeek={4}
/>
```

### Derivando las fechas de objetos `Date`
```tsx
const fmt = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

<StreakTracker studiedDates={sesiones.map((s) => fmt(s.date))} />
```

Formateá con los getters locales, no con `toISOString()`, para que la fecha no se corra de día (ver notas).

## Requisitos / dependencias

- Marcado como `"use client"`.
- No requiere `framer-motion` ni Next.js. La grilla es CSS Grid con `grid-flow-col`.
- Usa los tokens `--color-primary` (día con actividad), `--color-border` (día sin actividad), `--color-foreground` y `--color-muted`.

## Notas y comportamiento

- **Componente de sólo lectura**: no hay callbacks. Los cuadraditos no son clickeables (sí tienen `title` con la fecha, así que el navegador muestra un tooltip nativo al pasar el mouse).
- La racha se cuenta **hacia atrás desde hoy**: si hoy no figura en `studiedDates`, la racha es `0` aunque ayer y anteayer sí estén. Es el comportamiento habitual de este tipo de widget, pero conviene tenerlo presente: la racha "se rompe" visualmente antes de que el usuario estudie hoy.
- **Ojo con la zona horaria.** Internamente compara con `toISOString().slice(0, 10)`, que es UTC. En zonas al **oeste** de UTC (Argentina, UTC−3) la conversión da el día correcto; en zonas al **este** de UTC (Europa continental, Asia) la medianoche local cae en el día anterior UTC y **toda la grilla y la racha se corren un día**. Si tenés usuarios en esas zonas, este componente hay que ajustarlo.
- El contador "esta semana" son los **últimos 7 días corridos** (no la semana calendario) y se muestra siempre sobre `7`, no sobre `goalPerWeek`.
- La grilla tiene 7 filas fijas (una por día de la semana) y `weeks` columnas, pero **no está alineada a los días de la semana**: la primera celda es simplemente "hace `weeks * 7 - 1` días", así que las filas no corresponden a lunes, martes, etc. No hay etiquetas de día ni de mes.
- Sólo dos estados por día (con o sin actividad): no hay intensidad ni escala de color según cuánto se estudió.
- Con muchas semanas la grilla scrollea horizontalmente dentro de su contenedor.
- Fechas mal formateadas o fuera del rango visible simplemente no aparecen; no hay validación ni aviso.
