import type { TenantTheme } from "../../components/TenantTheme";

/**
 * Tenants de demo del playground.
 *
 * Los dominios `*.localhost` funcionan tal cual en dev: entrá a
 * http://acme.localhost:3000 y el layout resuelve el tenant en el servidor
 * (con `headers()`), así que la marca ya viene aplicada en el primer render.
 */
export const TENANTS: TenantTheme[] = [
  {
    id: "lib-kit",
    name: "lib-kit (default)",
    domains: ["localhost", "127.0.0.1"],
  },
  {
    id: "acme",
    name: "Acme",
    domains: ["acme.com", "*.acme.com", "acme.localhost"],
    tokens: { primary: "#e11d48", primaryHover: "#be123c", accent: "#fb7185" },
    dark: { primary: "#fb7185", primaryHover: "#fda4af", surface: "#1c0a12" },
  },
  {
    id: "globex",
    name: "Globex",
    domains: ["globex.io", "*.globex.io", "globex.localhost"],
    tokens: { primary: "#0891b2", primaryHover: "#0e7490", accent: "#06b6d4" },
    dark: { primary: "#22d3ee", primaryHover: "#67e8f9", surface: "#082f49" },
  },
  {
    id: "initech",
    name: "Initech",
    domains: ["initech.dev", "*.initech.dev", "initech.localhost"],
    tokens: {
      primary: "#16a34a",
      primaryHover: "#15803d",
      accent: "#84cc16",
      surfaceAlt: "#f2fbf4",
      border: "#d3e8d8",
    },
    dark: { primary: "#4ade80", primaryHover: "#86efac", surface: "#052e16", surfaceAlt: "#0b3d1f" },
  },
];
