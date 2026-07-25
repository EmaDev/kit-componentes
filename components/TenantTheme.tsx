"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_DARK_THEME_TOKENS,
  DEFAULT_THEME_TOKENS,
  THEME_TOKEN_KEYS,
  THEME_TOKEN_VARS,
  type ThemeTokens,
} from "./ThemeConfigurator";

export type ThemeMode = "light" | "dark";

export interface TenantTheme {
  /** Identificador estable del tenant (el que guardás en la sesión / la base). */
  id: string;
  /** Nombre visible, para selectores de tenant y paneles de admin. */
  name: string;
  /** Paleta clara. Los tokens que no definas caen a `DEFAULT_THEME_TOKENS`. */
  tokens?: Partial<ThemeTokens>;
  /** Paleta oscura. Ver `resolveTenantTokens` para las reglas de herencia. */
  dark?: Partial<ThemeTokens>;
  /** Dominios que mapean a este tenant: exactos (`acme.com`) o wildcard (`*.acme.com`). */
  domains?: string[];
}

/** Tokens de marca/estado: se heredan del modo claro al oscuro si el tenant no los redefine en `dark`. */
const BRAND_KEYS = ["primary", "primaryHover", "accent", "success", "danger"] as const;

/**
 * Paleta efectiva de un tenant para un modo.
 *
 * - `light`: `DEFAULT_THEME_TOKENS` + `tenant.tokens`.
 * - `dark`: `DEFAULT_DARK_THEME_TOKENS` + los tokens de marca/estado de `tenant.tokens` + `tenant.dark`.
 *   Es decir: en oscuro se conservan los colores de marca del tenant, pero superficie/texto/borde
 *   usan la paleta oscura por default (un `surface: #fff` de marca no debería filtrarse al modo oscuro).
 */
export function resolveTenantTokens(theme: TenantTheme | null | undefined, mode: ThemeMode): ThemeTokens {
  const base = mode === "dark" ? DEFAULT_DARK_THEME_TOKENS : DEFAULT_THEME_TOKENS;
  if (!theme) return base;
  if (mode === "light") return { ...base, ...theme.tokens };

  const brand: Partial<ThemeTokens> = {};
  for (const key of BRAND_KEYS) {
    const v = theme.tokens?.[key];
    if (v) brand[key] = v;
  }
  return { ...base, ...brand, ...theme.dark };
}

function normalizeHost(host: string): string {
  return host.trim().toLowerCase().replace(/^[a-z]+:\/\//, "").split("/")[0].split(":")[0];
}

/** `true` si `host` matchea el patrón (exacto o `*.dominio`). Ignora protocolo, puerto y mayúsculas. */
export function hostMatches(pattern: string, host: string): boolean {
  const h = normalizeHost(host);
  const p = normalizeHost(pattern);
  if (!h || !p) return false;
  if (p === h) return true;
  if (p.startsWith("*.")) {
    const base = p.slice(2);
    return h === base || h.endsWith(`.${base}`);
  }
  return false;
}

/** Primer tenant cuyo `domains` matchea el host. Los patrones exactos ganan sobre los wildcard. */
export function resolveTenantByHost(
  themes: TenantTheme[],
  host: string | null | undefined
): TenantTheme | null {
  if (!host) return null;
  const exact = themes.find((t) => t.domains?.some((d) => !d.includes("*") && hostMatches(d, host)));
  if (exact) return exact;
  return themes.find((t) => t.domains?.some((d) => d.includes("*") && hostMatches(d, host))) ?? null;
}

/** Descarta caracteres que permitirían cerrar la declaración e inyectar CSS arbitrario. */
function safeValue(value: string): string {
  return String(value).replace(/[;{}<>@\\]/g, "").trim();
}

/**
 * CSS con las custom properties de ambos modos.
 *
 * Usa selectores duplicados (`:root:root` / `.dark.dark`) para ganarle en especificidad a los
 * tokens base de `globals.css` (`:root` y `.dark`) sin depender del orden de las hojas de estilo.
 */
export function tenantThemeCss(light: ThemeTokens, dark: ThemeTokens): string {
  const decl = (t: ThemeTokens) =>
    THEME_TOKEN_KEYS.map((k) => `${THEME_TOKEN_VARS[k]}:${safeValue(t[k])}`).join(";");
  return `:root:root{${decl(light)}}.dark.dark{${decl(dark)}}`;
}

interface TenantThemeContextValue {
  /** Tenant activo, o `null` si ninguno matcheó. */
  tenant: TenantTheme | null;
  tenantId: string | null;
  themes: TenantTheme[];
  /** Paleta clara efectiva (tenant + overrides en vivo). */
  tokens: ThemeTokens;
  /** Paleta oscura efectiva (tenant + overrides en vivo). */
  darkTokens: ThemeTokens;
  /** El CSS que el provider está inyectando — útil para persistirlo o servirlo desde el backend. */
  css: string;
  setTenant: (id: string) => void;
  setTokens: (tokens: Partial<ThemeTokens>, mode?: ThemeMode) => void;
  resetTokens: () => void;
}

const TenantThemeContext = createContext<TenantThemeContextValue | null>(null);

export function useTenantTheme() {
  const ctx = useContext(TenantThemeContext);
  if (!ctx) throw new Error("useTenantTheme must be used inside <TenantThemeProvider>");
  return ctx;
}

interface TenantThemeProviderProps {
  themes: TenantTheme[];
  /** Tenant resuelto en el servidor (sesión, middleware, subdominio). Modo controlado: gana sobre todo lo demás. */
  tenantId?: string | null;
  /** Tenant a usar si el dominio no matchea ninguno. Default: el primero de `themes`. */
  defaultTenantId?: string;
  /** Host para resolver por dominio durante el SSR — ej. `(await headers()).get("host")`. */
  host?: string;
  /** Si no hay `tenantId` ni `host`, resuelve por `window.location.host` después de hidratar. Default `true`. */
  resolveOnClient?: boolean;
  /** Si se pasa, `setTenant` persiste la elección en `localStorage` bajo esta clave. */
  storageKey?: string;
  onTenantChange?: (id: string) => void;
  /** Inyecta el `<style>` con las CSS vars. Default `true`. */
  emitStyle?: boolean;
  children: ReactNode;
}

const NO_OVERRIDES: Record<ThemeMode, Partial<ThemeTokens>> = { light: {}, dark: {} };

/** Aplica la paleta del tenant activo a toda la app, resolviéndolo por dominio o por sesión. */
export function TenantThemeProvider({
  themes,
  tenantId,
  defaultTenantId,
  host,
  resolveOnClient = true,
  storageKey,
  onTenantChange,
  emitStyle = true,
  children,
}: TenantThemeProviderProps) {
  const [internalId, setInternalId] = useState<string | null>(() => {
    const fromHost = host ? resolveTenantByHost(themes, host)?.id : undefined;
    return tenantId ?? fromHost ?? defaultTenantId ?? themes[0]?.id ?? null;
  });
  const [overrides, setOverrides] = useState(NO_OVERRIDES);
  const resolvedRef = useRef(false);

  // Resolución del lado del cliente (localStorage / window.location). Corre una sola vez tras
  // hidratar: si corriera en cada render pisaría la elección manual hecha con setTenant().
  useEffect(() => {
    if (resolvedRef.current || tenantId) return;
    resolvedRef.current = true;

    if (storageKey) {
      const saved = window.localStorage.getItem(storageKey);
      if (saved && themes.some((t) => t.id === saved)) {
        setInternalId(saved);
        return;
      }
    }
    if (resolveOnClient && !host) {
      const byHost = resolveTenantByHost(themes, window.location.host);
      if (byHost) setInternalId(byHost.id);
    }
  }, [tenantId, storageKey, resolveOnClient, host, themes]);

  const setTenant = useCallback(
    (id: string) => {
      setOverrides(NO_OVERRIDES);
      setInternalId(id);
      if (storageKey) {
        try {
          window.localStorage.setItem(storageKey, id);
        } catch {
          // localStorage bloqueado (modo privado, cookies de terceros) — la elección no se persiste
        }
      }
      onTenantChange?.(id);
    },
    [storageKey, onTenantChange]
  );

  const setTokens = useCallback((next: Partial<ThemeTokens>, mode: ThemeMode = "light") => {
    setOverrides((prev) => ({ ...prev, [mode]: { ...prev[mode], ...next } }));
  }, []);

  const resetTokens = useCallback(() => setOverrides(NO_OVERRIDES), []);

  const activeId = tenantId ?? internalId;
  const tenant = useMemo(() => themes.find((t) => t.id === activeId) ?? null, [themes, activeId]);
  const tokens = useMemo(
    () => ({ ...resolveTenantTokens(tenant, "light"), ...overrides.light }),
    [tenant, overrides.light]
  );
  const darkTokens = useMemo(
    () => ({ ...resolveTenantTokens(tenant, "dark"), ...overrides.dark }),
    [tenant, overrides.dark]
  );
  const css = useMemo(() => tenantThemeCss(tokens, darkTokens), [tokens, darkTokens]);

  const value = useMemo<TenantThemeContextValue>(
    () => ({
      tenant,
      tenantId: activeId,
      themes,
      tokens,
      darkTokens,
      css,
      setTenant,
      setTokens,
      resetTokens,
    }),
    [tenant, activeId, themes, tokens, darkTokens, css, setTenant, setTokens, resetTokens]
  );

  return (
    <TenantThemeContext.Provider value={value}>
      {emitStyle && (
        <style data-tenant-theme={activeId ?? ""} dangerouslySetInnerHTML={{ __html: css }} />
      )}
      {children}
    </TenantThemeContext.Provider>
  );
}
