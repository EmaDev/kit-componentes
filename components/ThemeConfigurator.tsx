"use client";

import { useEffect, useState } from "react";

export interface ThemeTokens {
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

export interface ThemePreset {
  name: string;
  tokens: ThemeTokens;
}

/** Paleta del tema claro — mismos valores que el bloque `@theme` de `app/globals.css`. */
export const DEFAULT_THEME_TOKENS: ThemeTokens = {
  primary: "#2563eb",
  primaryHover: "#1d4ed8",
  accent: "#8b5cf6",
  surface: "#ffffff",
  surfaceAlt: "#f8fafc",
  foreground: "#0f172a",
  muted: "#64748b",
  border: "#e2e8f0",
  success: "#22c55e",
  danger: "#ef4444",
};

/** Paleta del tema oscuro — mismos valores que el bloque `.dark` de `app/globals.css`. */
export const DEFAULT_DARK_THEME_TOKENS: ThemeTokens = {
  primary: "#3b82f6",
  primaryHover: "#60a5fa",
  accent: "#a78bfa",
  surface: "#0f172a",
  surfaceAlt: "#1e293b",
  foreground: "#f1f5f9",
  muted: "#94a3b8",
  border: "#334155",
  success: "#4ade80",
  danger: "#f87171",
};

/** Mapa token → CSS custom property. */
export const THEME_TOKEN_VARS: Record<keyof ThemeTokens, string> = {
  primary: "--color-primary",
  primaryHover: "--color-primary-hover",
  accent: "--color-accent",
  surface: "--color-surface",
  surfaceAlt: "--color-surface-alt",
  foreground: "--color-foreground",
  muted: "--color-muted",
  border: "--color-border",
  success: "--color-success",
  danger: "--color-danger",
};

const TOKEN_VAR = THEME_TOKEN_VARS;

export const THEME_TOKEN_KEYS = Object.keys(TOKEN_VAR) as (keyof ThemeTokens)[];

const TOKEN_KEYS = THEME_TOKEN_KEYS;

const GROUPS: { label: string; tokens: { key: keyof ThemeTokens; label: string }[] }[] = [
  {
    label: "Marca",
    tokens: [
      { key: "primary", label: "Primario" },
      { key: "primaryHover", label: "Primario (hover)" },
      { key: "accent", label: "Acento" },
    ],
  },
  {
    label: "Superficie",
    tokens: [
      { key: "surface", label: "Superficie" },
      { key: "surfaceAlt", label: "Superficie alterna" },
      { key: "border", label: "Borde" },
    ],
  },
  {
    label: "Texto",
    tokens: [
      { key: "foreground", label: "Texto" },
      { key: "muted", label: "Texto atenuado" },
    ],
  },
  {
    label: "Estado",
    tokens: [
      { key: "success", label: "Éxito" },
      { key: "danger", label: "Peligro" },
    ],
  },
];

function buildCssBlock(tokens: ThemeTokens): string {
  const lines = TOKEN_KEYS.map((key) => `  ${TOKEN_VAR[key]}: ${tokens[key]};`);
  return `:root {\n${lines.join("\n")}\n}`;
}

interface ThemeConfiguratorProps {
  value?: ThemeTokens;
  defaultValue?: Partial<ThemeTokens>;
  onChange?: (tokens: ThemeTokens) => void;
  presets?: ThemePreset[];
  applyToDocument?: boolean;
  showPreview?: boolean;
  showExport?: boolean;
  /** Paleta a la que vuelve el botón "Restablecer". Útil al editar la paleta oscura (`DEFAULT_DARK_THEME_TOKENS`) o la de un tenant. */
  resetTo?: ThemeTokens;
  className?: string;
}

/** Panel para ajustar en vivo los 10 tokens de color del tema (`--color-*`), con presets, preview y export a CSS/JSON. */
export function ThemeConfigurator({
  value,
  defaultValue,
  onChange,
  presets = [],
  applyToDocument = false,
  showPreview = true,
  showExport = true,
  resetTo = DEFAULT_THEME_TOKENS,
  className = "",
}: ThemeConfiguratorProps) {
  const [internal, setInternal] = useState<ThemeTokens>({ ...DEFAULT_THEME_TOKENS, ...defaultValue });
  const tokens = value ?? internal;
  const [copied, setCopied] = useState<"css" | "json" | null>(null);

  useEffect(() => {
    if (!applyToDocument) return;
    const root = document.documentElement;
    TOKEN_KEYS.forEach((key) => root.style.setProperty(TOKEN_VAR[key], tokens[key]));
    return () => TOKEN_KEYS.forEach((key) => root.style.removeProperty(TOKEN_VAR[key]));
  }, [applyToDocument, tokens]);

  const set = (key: keyof ThemeTokens, v: string) => {
    const next = { ...tokens, [key]: v };
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };

  const reset = () => {
    if (value === undefined) setInternal(resetTo);
    onChange?.(resetTo);
  };

  const applyPreset = (preset: ThemePreset) => {
    if (value === undefined) setInternal(preset.tokens);
    onChange?.(preset.tokens);
  };

  const copy = async (kind: "css" | "json") => {
    const text = kind === "css" ? buildCssBlock(tokens) : JSON.stringify(tokens, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      // clipboard no disponible (permisos o contexto no seguro) — se ignora
    }
  };

  return (
    <div className={`rounded-2xl border border-border bg-surface p-5 ${className}`}>
      {presets.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-medium text-muted mb-2">Presets</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border hover:border-muted/40 transition-colors text-xs font-medium"
              >
                <span className="flex -space-x-1">
                  {[preset.tokens.primary, preset.tokens.accent, preset.tokens.success].map((c, i) => (
                    <span
                      key={i}
                      className="w-3.5 h-3.5 rounded-full border border-surface"
                      style={{ background: c }}
                    />
                  ))}
                </span>
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
        {GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-medium text-muted mb-2">{group.label}</p>
            <div className="flex flex-col gap-2.5">
              {group.tokens.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={tokens[key]}
                    onChange={(e) => set(key, e.target.value)}
                    aria-label={label}
                    className="w-9 h-9 rounded-lg border border-border cursor-pointer shrink-0 bg-transparent p-0.5"
                  />
                  <span className="flex-1 text-sm truncate">{label}</span>
                  <input
                    type="text"
                    value={tokens[key]}
                    onChange={(e) => set(key, e.target.value)}
                    spellCheck={false}
                    className="w-24 px-2 py-1 rounded-md border border-border bg-surface text-xs font-mono text-right outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showPreview && (
        <div className="mt-5 pt-5 border-t border-border">
          <p className="text-xs font-medium text-muted mb-3">Vista previa</p>
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface-alt p-4">
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: tokens.primary }}
            >
              Botón primario
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-semibold border-2 bg-transparent"
              style={{ borderColor: tokens.primary, color: tokens.primary }}
            >
              Outline
            </button>
            <span
              className="px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: `${tokens.success}22`, color: tokens.success }}
            >
              Éxito
            </span>
            <span
              className="px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: `${tokens.danger}22`, color: tokens.danger }}
            >
              Peligro
            </span>
            <span className="text-sm" style={{ color: tokens.foreground }}>
              Texto <span style={{ color: tokens.muted }}>atenuado</span>
            </span>
          </div>
        </div>
      )}

      {showExport && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="px-3 py-1.5 rounded-lg border border-border hover:bg-surface-alt transition-colors text-xs font-semibold"
          >
            Restablecer
          </button>
          <button
            type="button"
            onClick={() => copy("css")}
            className="px-3 py-1.5 rounded-lg border border-border hover:bg-surface-alt transition-colors text-xs font-semibold"
          >
            {copied === "css" ? "¡Copiado!" : "Copiar CSS"}
          </button>
          <button
            type="button"
            onClick={() => copy("json")}
            className="px-3 py-1.5 rounded-lg border border-border hover:bg-surface-alt transition-colors text-xs font-semibold"
          >
            {copied === "json" ? "¡Copiado!" : "Copiar JSON"}
          </button>
        </div>
      )}
    </div>
  );
}
