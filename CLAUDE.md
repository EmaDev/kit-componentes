# lib-kit-components

Librería de componentes React (Next.js + Tailwind v4 + Framer Motion) distribuida como paquete instalable desde otros proyectos. Ver [README.md](README.md) para instalación y [docs/README.md](docs/README.md) para la guía de uso de cada componente.

## Al crear (o modificar la API de) un componente nuevo

Esto aplica tanto a componentes en `components/` como a hooks en `hooks/`. Ningún componente se considera terminado hasta cumplir los cinco pasos:

1. **Exportarlo en `components/index.ts`** (barrel export) — el componente y cualquier tipo/sub-componente que exponga públicamente. Si no está acá, no es parte de la API del paquete.

2. **Crear su documentación de uso** en `docs/components/<Nombre>.md` (o `docs/hooks/<useNombre>.md` para hooks). Seguir exactamente la estructura de un doc existente comparable (por ejemplo `docs/components/Button.md` o `docs/components/Modal.md` para componentes, `docs/hooks/usePlatform.md` para hooks):
   - `Cuándo usarlo` — situacional, concreto.
   - `Cuándo NO usarlo / alternativas` — comparar contra el componente hermano más ambiguo si existe.
   - `Props` — tabla completa (prop / tipo / default / descripción), leída del código real, no inventada.
   - `Tipos exportados` si aplica.
   - `Ejemplos` — uso básico + 1-3 variantes reales.
   - `Requisitos / dependencias` — ej. si necesita estar dentro de un Provider, si depende de `next/link` (como `Navbar`/`SideBar`/`BottomNav`), si usa una Web API con soporte parcial.
   - `Notas y comportamiento` — controlado vs no controlado, accesibilidad, gotchas no obvios del código.

3. **Agregarlo a `docs/README.md`**: una fila en la tabla de su categoría, y una entrada en la guía de decisión ("Necesito… → Usá…") si cubre un caso de uso claro.

4. **Agregarlo al `README.md` principal**: una línea en el árbol de `## 📁 Estructura` (con comentario corto de qué hace), y si corresponde, un bloque en `## 📚 Uso rápido` o la sección temática correspondiente (Datos, PWA, Plataforma, etc.).

5. **Agregarlo al playground real (`dev/`)**. El playground es un catálogo plano: un preview por componente, ordenado según las 6 categorías del inventario. Pasos:
   - Escribir el demo en el archivo de `dev/src/demos/` que temáticamente corresponda (`ui.tsx`, `interaction.tsx`, `data.tsx`, `pwa.tsx`, `finance.tsx`, …), importando el componente real desde `../../../components/<Nombre>`.
   - El demo es **una función exportada** llamada `<Nombre>Section` que devuelve `<Section id="..." title="<Nombre>" description="...">` con al menos una `<Card>` mostrando un uso representativo (interactivo si el componente tiene estado). El `id` es el ancla de la página y tiene que ser único en todo el playground.
   - Registrarlo en `dev/src/catalog.tsx`: una `Entry` (`{ id, name, alias?, Demo }`) dentro del grupo de la categoría que corresponda. El `id` debe coincidir con el del `<Section>`. `name` es lo que se ve en el índice lateral; `alias` suma términos de búsqueda (sub-componentes, hooks, sinónimos en español).
   - No hay que tocar `dev/src/app/page.tsx`: renderiza el catálogo entero por sí solo (índice lateral, buscador y anclas incluidos).
   - `dev/` es una app Next.js real, así que `Navbar`, `SideBar` y `BottomNav` (que usan `next/link`/`next/navigation`) también se montan en vivo — no hace falta ninguna excepción para ellos.
   - No crear rutas nuevas ni pantallas de ejemplo: el playground es una sola página.
   - Validar con `cd dev && npx tsc --noEmit` antes de dar por terminado.

No hace falta pedir permiso para estos cinco pasos — son parte de terminar el trabajo de agregar el componente, no un extra opcional.
