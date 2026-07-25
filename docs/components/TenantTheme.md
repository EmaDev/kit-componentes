# TenantThemeProvider / useTenantTheme

> Paleta multi-tenant: registrás varios temas y el provider aplica el del cliente activo — resuelto por **dominio** (`acme.com`, `*.acme.com`) o por **sesión/autenticación** — a toda la app, sin flash y sin recompilar CSS.

**Import**
```tsx
import { TenantThemeProvider, useTenantTheme, resolveTenantByHost } from "lib-kit-components";
import type { TenantTheme, ThemeTokens } from "lib-kit-components";
```

## Cuándo usarlo

Cuando un mismo deploy sirve a varios clientes con marcas distintas: SaaS white-label, portales de agencia, apps por franquicia. Cada tenant define su paleta (los mismos 10 tokens `--color-*` que usa toda la librería) y el provider la inyecta como CSS custom properties globales, así **todos** los componentes del paquete se reskinean solos — no hace falta pasar props de color por ningún lado.

Los dos disparadores típicos, y ambos se soportan a la vez:

- **Por dominio** — `acme.tuapp.com` y `globex.tuapp.com` corren el mismo build. Resolvés el tenant desde el `host` en el servidor (o en el cliente con `resolveOnClient`).
- **Por autenticación** — el usuario entra a `app.tuapp.com`, y recién con la sesión sabés a qué organización pertenece. Pasás `tenantId` desde el server component.

## Cuándo NO usarlo / alternativas

- Si tenés **un solo cliente** y sólo querés que el usuario final ajuste colores, usá [ThemeConfigurator](ThemeConfigurator.md) con `applyToDocument` — no necesitás el registro de tenants.
- Para alternar **claro/oscuro**, usá `next-themes` (la clase `.dark`): el provider define ambas paletas de cada tenant, pero no decide cuál modo está activo. Los dos se complementan.
- Si cada tenant necesita además layout, tipografía, logos o feature flags distintos, esto sólo cubre color: armá tu propio contexto de tenant y usá `TenantThemeProvider` adentro para la parte de paleta.
- **No lo combines con `applyToDocument` de `ThemeConfigurator`**: ese prop escribe estilos *inline* en `<html>`, que ganan sobre cualquier hoja de estilo, incluida la del provider. Dentro de un provider, editá con `setTokens` (ver ejemplos).

## Props — TenantThemeProvider

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `themes` | `TenantTheme[]` | — | Registro de tenants disponibles. Requerido. |
| `tenantId` | `string \| null` | — | Tenant activo en modo **controlado** (resuelto en el servidor: sesión, middleware, subdominio). Gana sobre `host`, `defaultTenantId` y `localStorage`. `null` = todavía no se sabe (cae al resto de las estrategias). |
| `defaultTenantId` | `string` | primer tema de `themes` | Tenant a usar si el dominio no matchea ninguno. |
| `host` | `string` | — | Host para resolver por dominio **durante el SSR**, ej. `(await headers()).get("host")`. Es la vía para que no haya flash de marca. |
| `resolveOnClient` | `boolean` | `true` | Si no hay `tenantId` ni `host`, resuelve por `window.location.host` después de hidratar. |
| `storageKey` | `string` | — | Si se pasa, `setTenant()` persiste la elección en `localStorage` bajo esa clave y se restaura al montar (útil para impersonación/preview en un panel de admin). |
| `onTenantChange` | `(id: string) => void` | — | Se llama cuando `setTenant()` cambia el tenant activo. |
| `emitStyle` | `boolean` | `true` | Inyecta el `<style>` con las CSS vars. Ponelo en `false` si preferís servir el CSS vos mismo (ver `tenantThemeCss`). |
| `children` | `ReactNode` | — | Tu app. |

## `useTenantTheme()`

Devuelve, y lanza un error si se usa fuera del provider:

| Campo | Tipo | Descripción |
|---|---|---|
| `tenant` | `TenantTheme \| null` | Tenant activo (`null` si ninguno matcheó). |
| `tenantId` | `string \| null` | Su `id`. |
| `themes` | `TenantTheme[]` | El registro completo, para armar un selector. |
| `tokens` | `ThemeTokens` | Paleta **clara** efectiva (tenant + overrides en vivo). |
| `darkTokens` | `ThemeTokens` | Paleta **oscura** efectiva. |
| `css` | `string` | El CSS que el provider está inyectando — útil para guardarlo en la base o servirlo desde el backend. |
| `setTenant` | `(id: string) => void` | Cambia de tenant (y descarta los overrides en vivo del anterior). |
| `setTokens` | `(tokens: Partial<ThemeTokens>, mode?: "light" \| "dark") => void` | Override en vivo sobre la paleta del tenant activo. `mode` default `"light"`. |
| `resetTokens` | `() => void` | Descarta los overrides y vuelve a la paleta declarada del tenant. |

## Tipos exportados

```ts
interface TenantTheme {
  id: string;                    // el que guardás en la sesión / la base
  name: string;                  // nombre visible
  tokens?: Partial<ThemeTokens>; // paleta clara
  dark?: Partial<ThemeTokens>;   // paleta oscura
  domains?: string[];            // "acme.com" | "*.acme.com"
}

type ThemeMode = "light" | "dark";
```

### Helpers (puros, usables en el servidor)

| Función | Firma | Para qué |
|---|---|---|
| `resolveTenantByHost` | `(themes, host) => TenantTheme \| null` | Resolver el tenant desde un host. Los patrones exactos ganan sobre los wildcard. |
| `hostMatches` | `(pattern, host) => boolean` | Matchear un patrón suelto. Ignora protocolo, puerto y mayúsculas. |
| `resolveTenantTokens` | `(theme, mode) => ThemeTokens` | Paleta efectiva de un tenant en un modo (aplica las reglas de herencia de abajo). |
| `tenantThemeCss` | `(light, dark) => string` | El bloque CSS con las custom properties de ambos modos. |

## Ejemplos

### Por dominio, resuelto en el servidor (sin flash)

```tsx
// app/layout.tsx  — Server Component
import { headers } from "next/headers";
import { TenantThemeProvider } from "lib-kit-components";
import { TENANTS } from "@/lib/tenants";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const host = (await headers()).get("host") ?? undefined;
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <TenantThemeProvider themes={TENANTS} host={host}>
          {children}
        </TenantThemeProvider>
      </body>
    </html>
  );
}
```

```ts
// lib/tenants.ts
import type { TenantTheme } from "lib-kit-components";

export const TENANTS: TenantTheme[] = [
  {
    id: "acme",
    name: "Acme",
    domains: ["acme.com", "*.acme.com"],
    tokens: { primary: "#e11d48", primaryHover: "#be123c", accent: "#fb7185" },
  },
  {
    id: "globex",
    name: "Globex",
    domains: ["globex.io", "*.globex.io"],
    tokens: { primary: "#0891b2", primaryHover: "#0e7490", accent: "#06b6d4" },
    dark: { primary: "#22d3ee", surface: "#082f49" },
  },
];
```

### Por autenticación (el tenant sale de la sesión)

```tsx
// app/(app)/layout.tsx — Server Component
const session = await auth();

<TenantThemeProvider themes={TENANTS} tenantId={session?.user.tenantId ?? null} defaultTenantId="acme">
  {children}
</TenantThemeProvider>
```

Mientras `tenantId` sea `null` se usa `defaultTenantId`; en cuanto la sesión resuelve, la paleta cambia sola.

### Tenants que vienen de la base de datos

`TenantTheme` es un objeto plano y serializable, así que se puede cargar en el server component y pasarlo al provider:

```tsx
const themes = await db.tenant.findMany({ select: { id: true, name: true, tokens: true, domains: true } });
<TenantThemeProvider themes={themes} host={host}>{children}</TenantThemeProvider>
```

### Selector de tenant (panel de admin / impersonación)

```tsx
"use client";
const { themes, tenantId, setTenant } = useTenantTheme();

<Select
  options={themes.map((t) => ({ value: t.id, label: t.name }))}
  value={tenantId ?? undefined}
  onChange={setTenant}
/>
```

Con `storageKey="tenant-preview"` en el provider, la elección sobrevive al refresh.

### Editar la paleta del tenant activo con ThemeConfigurator

```tsx
"use client";
const { tokens, setTokens, resetTokens, css } = useTenantTheme();

<ThemeConfigurator value={tokens} onChange={setTokens} />
<Button onClick={() => { save(css); }}>Guardar marca</Button>
<Button variant="ghost" onClick={resetTokens}>Descartar</Button>
```

### Editar también la paleta oscura

```tsx
const { darkTokens, setTokens } = useTenantTheme();

<ThemeConfigurator
  value={darkTokens}
  onChange={(t) => setTokens(t, "dark")}
  resetTo={DEFAULT_DARK_THEME_TOKENS}
/>
```

## Requisitos / dependencias

- No depende de `next` ni de `framer-motion` — el ejemplo de `headers()` es de Next.js, pero el provider funciona en cualquier app React (pasale el host que tengas).
- Requiere que existan los tokens base (`app/globals.css` del paquete o los tuyos): el provider **sobreescribe** las CSS vars, no reemplaza la hoja de estilos base.
- `storageKey` usa `localStorage`; si está bloqueado (modo privado, cookies de terceros) la elección simplemente no se persiste, sin romper nada.
- Para SSR sin flash necesitás poder leer el host o la sesión en el servidor (`headers()`, middleware, o tu capa de auth).

## Notas y comportamiento

- **Precedencia del tenant activo**: `tenantId` (controlado) → `host` (SSR) → `localStorage` (si hay `storageKey`) → `window.location.host` (si `resolveOnClient`) → `defaultTenantId` → primer tema de `themes`. Las dos estrategias de cliente corren **una sola vez** después de hidratar, así no pisan una elección hecha con `setTenant()`.
- **Herencia claro → oscuro**: en modo oscuro, los tokens de **marca y estado** (`primary`, `primaryHover`, `accent`, `success`, `danger`) se heredan de `tokens`; los de **superficie, texto y borde** (`surface`, `surfaceAlt`, `foreground`, `muted`, `border`) usan la paleta oscura por default — un `surface: "#ffffff"` de marca no debería filtrarse al tema oscuro. Sobreescribí cualquiera de los diez con `dark`.
- **Especificidad**: el CSS se emite como `:root:root { … }` y `.dark.dark { … }` (selectores duplicados) para ganarle a los tokens base de `globals.css` (`:root` y `.dark`) sin depender del orden en que se carguen las hojas de estilo.
- **Flash de marca**: si el tenant se resuelve sólo en el cliente (sin `tenantId` ni `host`), el primer render usa el tema por default y cambia al hidratar. Pasá `host` o `tenantId` desde el servidor para evitarlo.
- **Inyección de CSS**: los valores de los tokens se sanitizan (se descartan `;{}<>@\`) antes de escribirlos en el `<style>`, porque en multi-tenant suelen venir de una base de datos y no de código. Aun así, validá los colores al guardarlos.
- **Cambiar de tenant descarta los overrides**: `setTenant()` limpia lo editado con `setTokens()`, para que la paleta en pantalla siempre corresponda al tenant activo.
- Un `<style>` sin `precedence` no lo hoistea React, así que queda donde lo renderiza el provider y se actualiza en cada cambio de paleta.
