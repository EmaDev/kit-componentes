# ThemeConfigurator

> Panel para ajustar en vivo los 10 tokens de color del tema (`--color-*`): swatch + hex por token, agrupados en Marca/Superficie/Texto/Estado, con presets, preview embebido y export a CSS/JSON.

**Import**
```tsx
import { ThemeConfigurator, DEFAULT_THEME_TOKENS } from "lib-kit-components";
import type { ThemeTokens, ThemePreset } from "lib-kit-components";
```

## Cuándo usarlo

Cuando necesitás una pantalla de personalización de marca dentro de tu producto (multi-tenant, white-label, panel de ajustes de una agencia/dashboard) que edite los mismos 10 tokens de color que ya usa toda la librería (`--color-primary`, `--color-surface`, etc., ver [tokens de tema del README](../../README.md#-tokens)). Con `applyToDocument` reskinea la app entera en vivo mientras se arrastra cada color, así el usuario ve el resultado en los componentes reales, no en una maqueta aparte.

## Cuándo NO usarlo / alternativas

- Para alternar entre **claro/oscuro** (la clase `.dark`), usá `next-themes` directamente — `ThemeConfigurator` edita los valores de los tokens, no el modo. Ambos pueden convivir: el modo decide qué tokens aplican por default, `ThemeConfigurator` los sobreescribe.
- Si sólo necesitás mostrarle al usuario un puñado fijo de temas (2-4 combinaciones prearmadas, sin edición fina), usá la prop `presets` sola con `showExport={false}` en vez de exponer todos los pickers — o armá tu propio selector de presets sin este componente.
- Si la app sirve a **varios clientes con marcas distintas** (white-label, SaaS multi-tenant), usá [TenantThemeProvider](TenantTheme.md): resuelve la paleta por dominio o por sesión y la aplica sin flash. `ThemeConfigurator` sigue sirviendo, pero como editor de la paleta del tenant activo (`value={tokens} onChange={setTokens}`), **sin** `applyToDocument`.
- No persiste nada por sí mismo: si necesitás que la elección sobreviva un refresh, guardá `tokens` (via `onChange`) en `localStorage`/tu backend y pasalo de vuelta como `defaultValue` o `value`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `value` | `ThemeTokens` | — | Tokens en modo controlado. Si se pasa, el componente no mantiene estado propio: cada cambio dispara `onChange` y el padre decide el próximo `value`. |
| `defaultValue` | `Partial<ThemeTokens>` | `DEFAULT_THEME_TOKENS` | Valores iniciales en modo no controlado (se mergean sobre `DEFAULT_THEME_TOKENS`). Ignorado si `value` está presente. |
| `onChange` | `(tokens: ThemeTokens) => void` | — | Se llama con el objeto completo de 10 tokens en cada edición, preset aplicado o `Restablecer`. |
| `presets` | `ThemePreset[]` | `[]` | Combinaciones prearmadas (`{ name, tokens }`) mostradas como chips arriba de los pickers; oculto si el array está vacío. |
| `applyToDocument` | `boolean` | `false` | Si es `true`, además espeja los 10 tokens como CSS custom properties inline en `document.documentElement` (`useEffect`, con cleanup al desmontar o al volver a `false`) — reskinea en vivo toda la app, no sólo el preview interno. |
| `showPreview` | `boolean` | `true` | Muestra el bloque "Vista previa" (botón primario, outline, badges de éxito/peligro, texto) que refleja los tokens actuales sin depender de `applyToDocument`. |
| `showExport` | `boolean` | `true` | Muestra los botones "Restablecer" / "Copiar CSS" / "Copiar JSON". |
| `resetTo` | `ThemeTokens` | `DEFAULT_THEME_TOKENS` | Paleta a la que vuelve "Restablecer". Pasá `DEFAULT_DARK_THEME_TOKENS` si el configurador está editando la paleta oscura, o la paleta declarada de un tenant. |
| `className` | `string` | `""` | Clases CSS adicionales en el contenedor raíz. |

## Tipos exportados

```ts
interface ThemeTokens {
  primary: string;
  primaryHover: string;
  accent: string;
  surface: string;
  surfaceAlt: string;
  foreground: string;
  muted: string;
  border: string;
  success: string;
  danger: string;
}

interface ThemePreset {
  name: string;
  tokens: ThemeTokens;
}

// paletas por default = los bloques @theme y .dark de app/globals.css
const DEFAULT_THEME_TOKENS: ThemeTokens;
const DEFAULT_DARK_THEME_TOKENS: ThemeTokens;

// token → CSS var, y el listado de keys
const THEME_TOKEN_VARS: Record<keyof ThemeTokens, string>;
const THEME_TOKEN_KEYS: (keyof ThemeTokens)[];
```

Cada key de `ThemeTokens` mapea 1 a 1 a una CSS var: `primary` → `--color-primary`, `primaryHover` → `--color-primary-hover`, `surfaceAlt` → `--color-surface-alt`, etc. (mismo set que documenta el README principal). `THEME_TOKEN_VARS` expone ese mapa si necesitás generar CSS vos mismo.

## Ejemplos

### Uso básico, no controlado
```tsx
<ThemeConfigurator onChange={(tokens) => console.log(tokens)} />
```

### Reskin en vivo de toda la app
```tsx
<ThemeConfigurator applyToDocument showPreview={false} />
```

### Con presets de marca
```tsx
const presets: ThemePreset[] = [
  { name: "Océano", tokens: { ...DEFAULT_THEME_TOKENS, primary: "#0891b2", accent: "#06b6d4" } },
  { name: "Coral", tokens: { ...DEFAULT_THEME_TOKENS, primary: "#e11d48", accent: "#fb7185" } },
];

<ThemeConfigurator presets={presets} applyToDocument />
```

### Editor de la paleta del tenant activo (multi-tenant)
```tsx
const { tokens, setTokens } = useTenantTheme();

<ThemeConfigurator value={tokens} onChange={setTokens} />
```
Ver [TenantThemeProvider](TenantTheme.md). No uses `applyToDocument` acá: escribe estilos inline en `<html>` que ganan sobre el CSS del provider.

### Controlado, con persistencia en localStorage
```tsx
const [tokens, setTokens] = useState<ThemeTokens>(
  () => JSON.parse(localStorage.getItem("theme") ?? "null") ?? DEFAULT_THEME_TOKENS
);

<ThemeConfigurator
  value={tokens}
  onChange={(next) => {
    setTokens(next);
    localStorage.setItem("theme", JSON.stringify(next));
  }}
/>
```

## Requisitos / dependencias

- No depende de `next` ni de `framer-motion`. Funciona en cualquier app React.
- "Copiar CSS"/"Copiar JSON" usan `navigator.clipboard` — si no está disponible (contexto no seguro o permiso denegado) el click no hace nada, sin romper el resto del componente.
- `applyToDocument` requiere DOM (`document.documentElement`); no se ejecuta en SSR (vive dentro de un `useEffect`).
- Los inputs de color son `<input type="color">` nativos — el selector que abren (picker del sistema operativo/navegador) no es personalizable por CSS más allá del swatch.

## Notas y comportamiento

- Controlado vs no controlado sigue el mismo patrón que `Select`/`Input`: pasá `value` + `onChange` para manejarlo vos, o sólo `onChange` (con `defaultValue` opcional) para que el componente mantenga su propio estado.
- El input de texto (hex) no valida el formato: acepta cualquier string tal cual lo tipea el usuario y lo asigna directo a la CSS var. Un valor inválido a mitad de tipear (`"#2"`) simplemente no aplica hasta que el navegador lo reconozca como color válido — no genera errores ni bloquea el resto de los tokens.
- `applyToDocument` limpia las CSS vars que seteó (`removeProperty`) al desmontar el componente o al pasar `applyToDocument` de `true` a `false`, así no deja el documento "pegado" a la última paleta elegida.
- El bloque "Vista previa" no depende de `applyToDocument`: usa `style` inline con los valores de `tokens` directamente, así siempre refleja la paleta actual aunque `applyToDocument` esté en `false`.
- `Restablecer` vuelve a `resetTo` (default `DEFAULT_THEME_TOKENS`, los valores del tema claro), no a los valores originales de `defaultValue`/`value` con los que se montó el componente.
- El componente edita **una** paleta a la vez: no tiene switch claro/oscuro propio. Para editar la oscura, pasale `DEFAULT_DARK_THEME_TOKENS` (o `darkTokens` del provider multi-tenant) como `value`/`defaultValue` y como `resetTo`.
- "Copiar CSS" genera un bloque `:root { --color-primary: …; }` listo para pegar en `app/globals.css`, en el mismo formato que ya usa el paquete (ver [Estilos y tokens de tema](../../README.md#estilos-y-tokens-de-tema)).
