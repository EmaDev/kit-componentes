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

5. **Agregarlo al playground real (`dev/`)** — NO a `preview.html` (ese es un mock visual standalone, desactualizado a propósito, no se mantiene). Pasos:
   - Importar el componente real desde `../../../components/<Nombre>` en el grupo de `dev/src/sections/` que corresponda (`AtomsGroup.tsx`, `InteractionGroup.tsx`, `DataGroup.tsx`, `PwaGroup.tsx`), o crear un grupo nuevo si no encaja en ninguno.
   - Envolverlo en `<Section id="..." title="..." description="...">` con al menos una `<Card>` mostrando un uso representativo (interactivo si el componente tiene estado).
   - Si es un grupo nuevo, registrarlo en `dev/src/chrome/groups.ts` (`GROUPS`) para que aparezca en el sidebar con scroll-spy, y agregar el `<GroupHeader/>` + el grupo en `dev/src/App.tsx`.
   - Excepción: componentes que importan `next/link` o `next/navigation` (como `Navbar`, `SideBar`, `BottomNav`) no resuelven en Vite — en vez de montarlos en vivo, agregar una `Section` con nota explicando la limitación (mismo patrón que esos tres ya usan en `AtomsGroup.tsx`).
   - Validar con `cd dev && npx tsc --noEmit` antes de dar por terminado.

No hace falta pedir permiso para estos cinco pasos — son parte de terminar el trabajo de agregar el componente, no un extra opcional.
