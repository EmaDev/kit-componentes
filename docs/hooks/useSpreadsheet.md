# useSpreadsheet

> Motor de estado y de fórmulas para una hoja de cálculo editable (selección, edición, undo/redo, copy/paste y evaluación de fórmulas), sin usar `eval()`.

**Import**
```ts
import { useSpreadsheet, evaluateCell, cellId, colName, colIndex } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando necesitás la lógica completa de una grilla tipo Excel (cursor, selección por rango, edición de celdas, historial de undo/redo, copiar/pegar como TSV y evaluación de fórmulas) pero querés tu propia UI en vez del componente `Spreadsheet` prearmado — por ejemplo para renderizar la grilla con virtualización, integrarla a un formulario custom, o exponer sólo un subconjunto de celdas editable. El componente `Spreadsheet` de esta librería usa este hook internamente para toda su lógica (atajos de teclado, barra de fórmulas, barra de estado); si te alcanza con su UI, usalo directamente en vez de reimplementar sobre este hook. Las funciones sueltas (`evaluateCell`, `cellId`, `colName`, `colIndex`) también sirven de forma completamente independiente del hook, por ejemplo para evaluar fórmulas en el servidor, exportar/importar datos, o generar encabezados de columna tipo A, B, C… AA.

## Firma

```ts
function useSpreadsheet(options: {
  rows: number;
  cols: number;
  initial?: Record<string, string>;
  onChange?: (grid: Record<string, string>) => void;
}): UseSpreadsheetReturn

// Funciones sueltas del motor de fórmulas
function colName(c: number): string
function colIndex(name: string): number
function cellId(r: number, c: number): string
function evaluateCell(grid: Record<string, string>, ref: string, seen?: Set<string>): string
```

> Nota: `UseSpreadsheetOptions` y el tipo de retorno no se exportan con nombre desde el paquete (son internos); usá la forma inline de arriba para tipar props manualmente si hace falta. La "grilla" (`Grid`) es siempre un objeto plano `Record<string, string>`, indexado por `cellId` (`"A1"`, `"B2"`, …), donde cada valor es el contenido crudo de la celda: texto, número como string, o una fórmula que arranca con `=`.

## Opciones (parámetros)

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `rows` | `number` | — (requerido) | Cantidad de filas de la grilla. Se usa para acotar (clamp) el cursor/selección y al pegar (`pasteTsv`). |
| `cols` | `number` | — (requerido) | Cantidad de columnas de la grilla. |
| `initial` | `Record<string, string>` | `{}` | Contenido inicial de la grilla, mapeado por `cellId` → valor crudo. |
| `onChange` | `(grid: Record<string, string>) => void` | `undefined` | Se llama con la grilla completa resultante cada vez que cambia por `setGrid`, `setCell`, `clearRange`, `pasteTsv`, `undo` o `redo`. No se llama por cambios de cursor/selección/edición. |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `grid` | `Record<string, string>` | Estado actual de la grilla (valores crudos, no evaluados). |
| `setGrid` | `(next: Record<string, string>) => void` | Reemplaza toda la grilla de una vez, empujando el estado anterior al historial de undo (limpia el historial de redo). Úsalo para pegar datos externos o resetear la hoja completa. |
| `cursor` | `{ r: number; c: number }` | Celda activa (0-indexada). |
| `anchor` | `{ r: number; c: number }` | Extremo fijo de la selección (junto con `cursor` define el rango). |
| `setAnchor` | `(a: { r: number; c: number }) => void` | Setter directo del anchor (útil para construir selecciones de fila/columna completa, ver ejemplos). |
| `range` | `{ r1: number; c1: number; r2: number; c2: number }` | Rectángulo de selección normalizado (r1≤r2, c1≤c2) entre `anchor` y `cursor`. |
| `inRange` | `(r: number, c: number) => boolean` | Indica si una celda cae dentro de `range`. |
| `goTo` | `(r: number, c: number, extend?: boolean) => void` | Mueve el cursor a una celda absoluta (acotada a los límites). `extend: true` mantiene el `anchor` (extiende la selección); `false` (default) mueve también el anchor. |
| `move` | `(dr: number, dc: number, extend?: boolean) => void` | Mueve el cursor en forma relativa, acotado a los límites. Misma semántica de `extend` que `goTo`. |
| `editing` | `{ r: number; c: number; draft: string } \| null` | Celda que se está editando actualmente y su texto en borrador. El hook sólo guarda este estado; la UI es responsable de mostrarlo y de llamar a `setCell` al confirmar. |
| `setEditing` | `(e: { r: number; c: number; draft: string } \| null) => void` | Setter de `editing`. |
| `setCell` | `(r: number, c: number, value: string) => void` | Fija el valor crudo de una celda (commitea al historial). `value === ""` elimina la clave de la grilla. |
| `clearRange` | `() => void` | Borra el contenido de todas las celdas dentro de `range` (commitea al historial). |
| `undo` | `() => void` | Deshace el último cambio. No hace nada si no hay historial. |
| `redo` | `() => void` | Rehace el último cambio deshecho. No hace nada si no hay futuro. |
| `canUndo` | `boolean` | Si hay historial disponible para `undo`. |
| `canRedo` | `boolean` | Si hay historial disponible para `redo`. |
| `selectionToTsv` | `() => string` | Serializa el contenido crudo de `range` como texto separado por tabs/saltos de línea (formato TSV), listo para el portapapeles. |
| `pasteTsv` | `(text: string) => void` | Parsea texto TSV y lo pega empezando en `cursor`, celda por celda, recortando lo que exceda `rows`/`cols` (commitea al historial). |
| `displayOf` | `(r: number, c: number) => string` | Valor mostrado de una celda: si es fórmula, la evalúa (equivale a `evaluateCell(grid, cellId(r,c))`). |
| `rawOf` | `(r: number, c: number) => string` | Valor crudo de una celda (lo que hay realmente guardado, `""` si está vacía). |
| `stats` | `{ count, numeric, sum, avg, cells }` | Estadísticas de `range`, estilo barra de estado de Excel: `count` = celdas no vacías (incluye texto y errores), `numeric` = celdas cuyo valor mostrado se pudo parsear como número, `sum`/`avg` sólo sobre esas numéricas (`avg = 0` si no hay ninguna), `cells` = total de celdas del rectángulo (`filas × columnas` de la selección, sin importar el contenido). |

## Funciones auxiliares exportadas

Estas funciones son el motor de fórmulas y las utilidades de referencia A1, y funcionan sin necesidad del hook.

| Función | Firma | Descripción |
|---|---|---|
| `colName` | `(c: number) => string` | Convierte un índice de columna 0-based a su nombre estilo Excel: `colName(0) = "A"`, `colName(25) = "Z"`, `colName(26) = "AA"`. |
| `colIndex` | `(name: string) => number` | Inversa de `colName`: convierte un nombre de columna (`"A"`, `"AA"`, case-insensitive) a su índice 0-based. |
| `cellId` | `(r: number, c: number) => string` | Construye el identificador de celda estilo A1 a partir de fila/columna 0-based: `cellId(0, 0) = "A1"`, `cellId(1, 0) = "A2"`, `cellId(0, 1) = "B1"`. |
| `evaluateCell` | `(grid: Record<string, string>, ref: string, seen?: Set<string>) => string` | Evalúa el valor **mostrado** de la celda `ref` dentro de `grid`, resolviendo fórmulas recursivamente. Si el valor no empieza con `=`, lo devuelve tal cual. Si la celda no existe o está vacía, devuelve `""`. El tercer parámetro (`seen`) es de uso interno para detectar referencias circulares al recorrer una cadena de dependencias; normalmente no hace falta pasarlo desde afuera. |

### Fórmulas soportadas

El evaluador es un parser recursivo-descendente escrito a mano — **no usa `eval()` ni `Function()`**, por lo que es seguro evaluar contenido arbitrario de celdas.

- **Operadores**: `+ - * /` (aritméticos), `^` (potencia), `+`/`-` unarios, paréntesis `( )`. Precedencia estándar: `^` > `* /` > `+ -`.
- **Referencias**: estilo A1 (`A1`, `B12`, `AA3`…), case-insensitive.
- **Rangos**: sólo dentro de argumentos de función, con `:` (`A1:B10`). Los extremos pueden estar en cualquier orden (el rango se normaliza).
- **Funciones**: `SUM(...)`, `AVERAGE(...)` / `AVG(...)`, `MIN(...)`, `MAX(...)`, `COUNT(...)`, `ABS(x)`, `ROUND(x, decimales=0)`. Los argumentos pueden ser expresiones sueltas o rangos, separados por `,` o `;`.
- **Números**: sólo notación decimal con punto dentro de la fórmula (`3.5`); no se soporta notación científica ni comas como separador decimal en el texto de la fórmula (la coma se usa como separador de argumentos). En cambio, si una celda tiene un valor crudo no-fórmula como `"3,5"`, sí se interpreta la coma como separador decimal al usarlo como operando numérico.

### Errores devueltos

`evaluateCell` nunca lanza excepciones hacia afuera: los errores se devuelven como strings que empiezan con `#`, igual que en una planilla real.

| Error | Cuándo ocurre |
|---|---|
| `#DIV/0!` | El resultado numérico final no es finito (división por cero, etc.). |
| `#NAME?` | Se usó un nombre de función desconocido (no está en `SUM/AVERAGE/AVG/MIN/MAX/COUNT/ABS/ROUND`). |
| `#REF!` | Un rango de función tiene una referencia inválida (extremos no parseables como celda A1). |
| `#CIRC!` | Se detectó una referencia circular al resolver la cadena de dependencias. |
| `#ERROR!` | Error de sintaxis genérico (paréntesis sin cerrar, token inesperado, caracteres sobrantes al final) o cualquier otra excepción no tipada. |

## Ejemplos

### Uso básico
```tsx
import { useSpreadsheet, cellId } from "lib-kit-components";

function MiniGrid() {
  const sheet = useSpreadsheet({ rows: 5, cols: 3, initial: { A1: "10", B1: "20", C1: "=A1+B1" } });

  return (
    <table>
      <tbody>
        {Array.from({ length: 5 }, (_, r) => (
          <tr key={r}>
            {Array.from({ length: 3 }, (_, c) => (
              <td
                key={c}
                onClick={() => sheet.goTo(r, c)}
                style={{ outline: sheet.inRange(r, c) ? "2px solid dodgerblue" : "none" }}
              >
                {sheet.displayOf(r, c)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Edición, undo/redo y copy/paste
```tsx
function Cell({ sheet, r, c }: { sheet: ReturnType<typeof useSpreadsheet>; r: number; c: number }) {
  const isEditing = sheet.editing?.r === r && sheet.editing?.c === c;

  if (isEditing) {
    return (
      <input
        autoFocus
        value={sheet.editing!.draft}
        onChange={(e) => sheet.setEditing({ r, c, draft: e.target.value })}
        onBlur={() => { sheet.setCell(r, c, sheet.editing!.draft); sheet.setEditing(null); }}
      />
    );
  }
  return (
    <div
      onDoubleClick={() => sheet.setEditing({ r, c, draft: sheet.rawOf(r, c) })}
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "z") sheet.undo();
        if ((e.ctrlKey || e.metaKey) && e.key === "y") sheet.redo();
        if ((e.ctrlKey || e.metaKey) && e.key === "c") navigator.clipboard.writeText(sheet.selectionToTsv());
      }}
    >
      {sheet.displayOf(r, c)}
    </div>
  );
}
```

### `evaluateCell` y las funciones de referencia sin el hook
```ts
import { evaluateCell, cellId, colName, colIndex } from "lib-kit-components";

const grid = { A1: "5", A2: "7", A3: "=SUM(A1:A2)", A4: "=A3/0" };

evaluateCell(grid, "A3"); // "12"
evaluateCell(grid, "A4"); // "#DIV/0!"

colName(0);       // "A"
colName(26);      // "AA"
colIndex("AA");   // 26
cellId(2, 26);    // "AA3"
```

## Notas y comportamiento

- El hook en sí no toca `window`/`document` (es sólo estado de React), así que no tiene requisitos particulares de SSR más allá de los normales de cualquier hook con estado.
- El historial de undo/redo se guarda en `useRef` (no en estado), capado a 50 niveles (`slice(-49)` + el estado actual); hacer `undo` o `redo` limpia/reconstruye el otro stack de la forma esperada (deshacer habilita un redo, y viceversa).
- `editing` es sólo estado: el hook no commitea automáticamente el borrador a la grilla. Es responsabilidad de tu UI llamar a `setCell(r, c, editing.draft)` al confirmar (Enter, blur, etc.), como hace el componente `Spreadsheet` interno.
- `setGrid` (el `commit` interno) reemplaza la grilla **completa**, no hace merge parcial — si querés modificar una sola celda usá `setCell`.
- La detección de referencias circulares (`#CIRC!`) es por cadena de resolución (usa un `Set` que se clona en cada llamada recursiva a `evaluateCell`), no un chequeo global previo: dos celdas que dependen de una tercera en común (un "diamante" de dependencias) se resuelven bien y no disparan un falso `#CIRC!`.
- Los resultados numéricos se redondean a 10 decimales (`Math.round(v * 1e10) / 1e10`) antes de convertirse a string, para evitar artefactos de punto flotante tipo `0.1 + 0.2`.
- El motor de fórmulas no soporta: funciones de texto, concatenación, operadores de comparación/lógicos, referencias absolutas (`$A$1`), referencias a otra hoja, ni notación científica en los literales numéricos de la fórmula.
- Todas las claves de la grilla (`cellId`) se generan siempre en mayúsculas vía `colName`; si construís claves manualmente para `initial`, usá el mismo formato (`"A1"`, no `"a1"`) para evitar duplicados silenciosos.
