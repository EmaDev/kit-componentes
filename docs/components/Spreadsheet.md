# Spreadsheet

> Hoja de cálculo editable tipo Excel/Google Sheets, con fórmulas, selección por rango, copiar/pegar TSV y undo/redo.

**Import**
```tsx
import { Spreadsheet } from "lib-kit-components";
// el motor interno también se exporta por si necesitás usarlo aparte
import { useSpreadsheet, evaluateCell, cellId, colName, colIndex } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando el usuario necesita **cargar y calcular datos** en una grilla, con la mecánica familiar de una planilla: escribir valores, referenciar celdas (`A1`, `B2:B10`), aplicar fórmulas (sumas, promedios, redondeos) y navegar con teclado. Es el componente correcto para presupuestos simples, tablas de cálculo, importación/edición rápida de datos tabulares chicos-a-medianos, o cualquier flujo donde el usuario "arma" un dataset a mano.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás **mostrar** datos existentes (con orden, búsqueda, selección y paginado) sin que el usuario los edite celda por celda, usá `DataTable` — es más liviano y no tiene motor de fórmulas.
- No es un reemplazo de Excel/Sheets real: no soporta múltiples hojas, formato condicional, gráficos, ni funciones más allá de las listadas abajo. Para casos así, considerá exportar/importar hacia una herramienta externa en vez de reimplementarla acá.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `rows` | `number` | `24` | Cantidad de filas de la grilla. |
| `cols` | `number` | `8` | Cantidad de columnas de la grilla. |
| `initial` | `Record<string, string>` | `{}` | Contenido inicial, como mapa `{ A1: "Mes", B7: "=SUM(B2:B6)" }`. Las claves son IDs de celda tipo A1. |
| `onChange` | `(grid: Record<string, string>) => void` | — | Se llama con el grid completo (crudo, sin evaluar) cada vez que hay un cambio confirmado (edición, borrado, pegado, undo/redo). |
| `colWidth` | `number` | `104` | Ancho de columna en px. |
| `rowHeight` | `number` | `32` | Alto de fila en px. |
| `height` | `string` | `"420px"` | Alto del área scrolleable de la grilla. |
| `showFormulaBar` | `boolean` | `true` | Muestra la barra superior con el ID de celda activa y el input `fx`. |
| `showStatusBar` | `boolean` | `true` | Muestra la barra inferior con la selección actual y estadísticas (suma/promedio). |
| `headerRow` | `boolean` | `false` | Da estilo de encabezado (fondo + negrita) a la primera fila, sin lógica especial más allá del estilo. |
| `readOnly` | `boolean` | `false` | Bloquea edición: no se puede escribir, pegar, ni borrar celdas (la navegación y copia siguen funcionando). |

## Tipos exportados

El componente `Spreadsheet` no exporta props propias como tipo público, pero re-exporta el motor completo desde `hooks/useSpreadsheet`:

```ts
export interface Cursor { r: number; c: number }
export interface Range { r1: number; c1: number; r2: number; c2: number }

// utilidades de referencia A1 ↔ {r, c}
function colName(c: number): string;      // 0 -> "A", 26 -> "AA"
function colIndex(name: string): number;  // "A" -> 0, "AA" -> 26
const cellId: (r: number, c: number) => string; // (0,0) -> "A1"

// evalúa el valor mostrado de una celda, resolviendo fórmulas recursivamente
function evaluateCell(grid: Record<string, string>, ref: string): string;

// hook de estado completo (cursor, rango, historial, fórmulas, clipboard)
function useSpreadsheet(options: {
  rows: number;
  cols: number;
  initial?: Record<string, string>;
  onChange?: (grid: Record<string, string>) => void;
}): { /* ver "Requisitos / dependencias" */ };
```

## Ejemplos

### Uso básico
```tsx
<Spreadsheet rows={12} cols={6} height="360px" />
```

### Con fórmulas y valores iniciales
```tsx
<Spreadsheet
  rows={24}
  cols={8}
  height="420px"
  headerRow
  initial={{
    A1: "Mes", B1: "Ingresos", C1: "Gastos", D1: "Neto",
    A2: "Enero", B2: "10000", C2: "4200", D2: "=B2-C2",
    A3: "Febrero", B3: "12500", C3: "5100", D3: "=B3-C3",
    A7: "Total", B7: "=SUM(B2:B6)", C7: "=SUM(C2:C6)", D7: "=SUM(D2:D6)",
    A8: "Promedio", D8: "=ROUND(AVERAGE(D2:D6), 2)",
  }}
  onChange={(grid) => saveDraft(grid)}
/>
```

### Solo lectura (reporte calculado)
```tsx
<Spreadsheet
  rows={10}
  cols={5}
  readOnly
  showFormulaBar={false}
  initial={reportSnapshot}
/>
```

### Sin barras auxiliares, compacta
```tsx
<Spreadsheet
  rows={8}
  cols={4}
  colWidth={80}
  rowHeight={28}
  showFormulaBar={false}
  showStatusBar={false}
  height="240px"
/>
```

## Requisitos / dependencias

- Usa `framer-motion` no directamente en `Spreadsheet.tsx` (no importa `motion`), pero forma parte del mismo paquete que sí lo requiere como peer dependency general.
- El motor de fórmulas es un parser recursivo propio (sin `eval()`), expuesto también como `useSpreadsheet` + `evaluateCell` + `cellId`/`colName`/`colIndex` en el barrel de la librería, por si necesitás evaluar celdas o construir tu propia UI sobre el mismo estado.
- Copiar/pegar con `⌘/Ctrl+C/X/V` usa la Clipboard API del navegador (`navigator.clipboard`); si el navegador no otorga permiso, cae en un catch silencioso y el usuario puede usar el pegado nativo del input de edición como respaldo.
- No persiste nada por sí solo: el guardado (localStorage, backend, etc.) es responsabilidad de quien consume `onChange`.

### Fórmulas soportadas

Toda celda cuyo contenido empiece con `=` se trata como fórmula. Sintaxis soportada:

- Operadores aritméticos: `+ - * / ^` y paréntesis `( )`, con precedencia estándar (potencia > mul/div > suma/resta).
- Referencias de celda tipo `A1`, `B12`, etc.
- Rangos dentro de funciones, tipo `A1:A10` (se expanden a la lista de celdas del rectángulo, sea cual sea el orden de las esquinas).
- Funciones: `SUM`, `AVERAGE` / `AVG`, `MIN`, `MAX`, `COUNT`, `ABS`, `ROUND(valor, decimales)`.
- Los argumentos de una función se separan con `,` o `;`.
- Las fórmulas pueden referenciar celdas que a su vez son fórmulas (evaluación recursiva).

Errores tipados que puede mostrar una celda: `#DIV/0!` (resultado no finito, ej. división por cero), `#NAME?` (función desconocida), `#REF!` (rango inválido), `#CIRC!` (referencia circular), `#ERROR!` (sintaxis inválida). Los resultados numéricos se redondean a 10 decimales para evitar ruido de punto flotante.

### Atajos de teclado

| Atajo | Acción |
|---|---|
| Flechas | Mover el cursor una celda (cancela cualquier rango activo). |
| `Shift` + flechas | Extender el rango de selección desde el ancla. |
| `⌘/Ctrl` + flechas | Saltar al extremo de la grilla en esa dirección (fila/columna 0 o última). |
| `⌘/Ctrl` + `Shift` + flechas | Extender el rango hasta el extremo de la grilla. |
| `Tab` / `Shift+Tab` | Mover una celda a la derecha / izquierda. |
| `Enter` | Entrar en modo edición de la celda activa. |
| `F2` | Entrar en modo edición (equivalente a doble click). |
| Escribir un carácter directamente | Reemplaza el contenido de la celda y entra en edición con ese carácter como valor inicial. |
| `Escape` | Mientras se edita: cancela sin guardar. Fuera de edición: limpia el indicador de "Copiado". |
| `Delete` / `Backspace` | Borra el contenido de todas las celdas del rango seleccionado. |
| `Home` | Va a la primera columna de la fila actual (`⌘/Ctrl+Home`: además fila 0). |
| `End` | Va a la última columna de la fila actual (`⌘/Ctrl+End`: además última fila). |
| `⌘/Ctrl+A` | Selecciona toda la grilla. |
| `⌘/Ctrl+C` | Copia el rango como TSV al portapapeles. |
| `⌘/Ctrl+X` | Copia y además borra el rango (equivalente a copiar + `Delete`). |
| `⌘/Ctrl+V` | Pega TSV desde el portapapeles a partir de la celda cursor. |
| `⌘/Ctrl+Z` | Deshacer (hasta 50 pasos de historial). |
| `⌘/Ctrl+Shift+Z` o `⌘/Ctrl+Y` | Rehacer. |
| Mientras se edita: `Enter` | Confirma y mueve el cursor una fila hacia abajo (`Shift+Enter`: confirma sin mover). |
| Mientras se edita: `Tab` | Confirma y mueve el cursor una columna a la derecha. |
| Doble click en celda | Entra en modo edición. |
| Click y arrastre (o click con `Shift`) en encabezado de fila/columna | Selecciona la fila/columna completa como rango. |

Todos los atajos de edición (`readOnly=false`) quedan deshabilitados cuando `readOnly` es `true`: no se puede escribir, pegar ni borrar, pero navegación, copia y selección de rango siguen activas.

## Notas y comportamiento

- El historial de undo/redo guarda hasta 50 snapshots del grid completo (`history.current.slice(-49)` + el estado actual); no es un diff incremental.
- La barra de estado (`showStatusBar`) muestra estadísticas (celdas, con datos, suma, promedio) sólo cuando el rango seleccionado tiene más de una celda (`stats.cells > 1`).
- Los valores numéricos se alinean a la derecha automáticamente (`numeric = shown !== "" && !isNaN(parseFloat(shown)) && !isError`); el resto se alinea a la izquierda.
- Las celdas con error (`#...`) se muestran con color `text-danger`.
- El input de la barra de fórmulas (`fx`) y el input inline de edición de celda están sincronizados: editar en uno actualiza el `editing.draft` que usa el otro.
- `commitEdit` hace `trim()` del valor antes de guardarlo; una celda vacía después del trim se borra del grid (no queda un string vacío).
- Pegar TSV (`pasteTsv`) ignora las celdas que caerían fuera de los límites de `rows`/`cols` de la grilla actual.
- El componente es `select-none` a nivel raíz para evitar selección de texto accidental al arrastrar sobre la grilla.
