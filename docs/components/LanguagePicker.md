# LanguagePicker

> Selector de idioma/región: dropdown buscable con bandera y nombre, filtrado en vivo por texto.

**Import**
```tsx
import { LanguagePicker } from "lib-kit-components";
import type { LanguageOption } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para elegir idioma o región dentro de un selector de configuración, un footer, o un onboarding: lista de `LanguageOption` (código, label, bandera opcional) con búsqueda incorporada, útil cuando la lista es larga (decenas de idiomas/regiones) y desplazarse visualmente por todas las opciones sería incómodo.

## Cuándo NO usarlo / alternativas

- Si la lista de opciones es corta (2-6 idiomas) y no necesitás búsqueda, un [Select](Select.md) simple o un [Dropdown](Dropdown.md) de acciones es más liviano.
- Si necesitás elegir cualquier otro valor de una lista cerrada que no sea idioma/región (sin bandera ni búsqueda especial), usá [Select](Select.md) — `LanguagePicker` está pensado específicamente para el patrón bandera + nombre + región.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `options` | `LanguageOption[]` | — (requerido) | Lista de idiomas/regiones disponibles. |
| `value` | `string` | — (requerido) | Código del idioma seleccionado (controlado), debe matchear `LanguageOption.code`. |
| `onChange` | `(code: string) => void` | — (requerido) | Se llama al elegir una opción, con su `code`. |
| `variant` | `"select" \| "sheet"` | `"select"` | Declarada para dos estilos de presentación — ver Notas, actualmente no tiene efecto visible. |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

## Tipos exportados

```ts
export interface LanguageOption {
  code: string;
  label: string;
  region?: string;
  flag?: string; // emoji, ej. "🇦🇷"
}
```

## Ejemplos

### Uso básico
```tsx
const [lang, setLang] = useState("es-AR");

<LanguagePicker
  value={lang}
  onChange={setLang}
  options={[
    { code: "es-AR", label: "Español", region: "Argentina", flag: "🇦🇷" },
    { code: "en-US", label: "English", region: "United States", flag: "🇺🇸" },
    { code: "pt-BR", label: "Português", region: "Brasil", flag: "🇧🇷" },
  ]}
/>
```

## Requisitos / dependencias

- No depende de `next` ni de `framer-motion`.
- Marcado como `"use client"`.
- Es controlado: no hay estado interno de valor seleccionado — siempre pasá `value` + `onChange`.
- No cierra el menú al hacer click afuera por sí mismo (ver Notas) — si lo necesitás dentro de un layout donde eso importa, envolvé el uso con tu propio manejo de click-outside o un `Popover`.

## Notas y comportamiento

- La prop `variant` (`"select" | "sheet"`) está declarada en la interfaz de props pero **no se usa en ningún lugar del render** — actualmente el componente siempre dibuja el mismo dropdown anclado (comportamiento de `"select""`), sin importar el valor de `variant`. No asumas que `variant="sheet"` abre un bottom sheet; si necesitás ese comportamiento en mobile, construilo aparte (por ejemplo con [BottomSheet](BottomSheet.md)) hasta que se implemente.
- El `ref` del contenedor (`ref={ref}`) está declarado pero no tiene ningún listener de click-outside asociado — el menú **no se cierra automáticamente** al tocar fuera de él; se cierra al elegir una opción (`pick`) o si el consumidor desmonta/controla su visibilidad de otra forma.
- El filtro de búsqueda compara contra `label` y `region` en minúsculas (`includes`), no contra `code`.
- Si `value` no matchea ningún `code` de `options`, `current` cae al primer elemento del array (`options[0]`) para no romper el render del botón trigger.
