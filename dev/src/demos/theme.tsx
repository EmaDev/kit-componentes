import { useEffect, useState } from "react";
import {
  ThemeConfigurator,
  DEFAULT_THEME_TOKENS,
  DEFAULT_DARK_THEME_TOKENS,
  type ThemePreset,
  type ThemeTokens,
} from "../../../components/ThemeConfigurator";
import {
  useTenantTheme,
  resolveTenantByHost,
  type ThemeMode,
} from "../../../components/TenantTheme";
import { Button } from "../../../components/Button";
import { TENANTS } from "../tenants";
import { Section, Card } from "../chrome/Section";

const PRESETS: ThemePreset[] = [
  { name: "Default", tokens: DEFAULT_THEME_TOKENS },
  { name: "Océano", tokens: { ...DEFAULT_THEME_TOKENS, primary: "#0891b2", primaryHover: "#0e7490", accent: "#06b6d4" } },
  { name: "Coral", tokens: { ...DEFAULT_THEME_TOKENS, primary: "#e11d48", primaryHover: "#be123c", accent: "#fb7185" } },
  { name: "Bosque", tokens: { ...DEFAULT_THEME_TOKENS, primary: "#16a34a", primaryHover: "#15803d", accent: "#84cc16" } },
];

export function ConfiguratorSection() {
  const [tokens, setTokens] = useState<ThemeTokens>(DEFAULT_THEME_TOKENS);

  return (
    <Section
      id="themeconfigurator"
      title="ThemeConfigurator"
      description="Editor de los 10 tokens de color del tema · presets · preview · export a CSS/JSON."
    >
      <Card title="Controlado, con estado local">
        <p className="text-sm text-muted mb-4">
          Acá el editor maneja su propia paleta y sólo reporta los cambios por{" "}
          <code className="font-mono text-xs">onChange</code>. Para que reskinee la app entera hay dos
          caminos: <code className="font-mono text-xs">applyToDocument</code> (app de un solo cliente) o
          conectarlo al provider multi-tenant, como en la sección de abajo.
        </p>
        <div className="grid lg:grid-cols-2 gap-4">
          <ThemeConfigurator value={tokens} onChange={setTokens} presets={PRESETS} />
          <pre className="rounded-xl border border-border bg-surface-alt p-4 text-xs font-mono overflow-auto max-h-96">
            {JSON.stringify(tokens, null, 2)}
          </pre>
        </div>
      </Card>
    </Section>
  );
}

export function TenantsSection() {
  const { tenant, tenantId, themes, tokens, darkTokens, css, setTenant, resetTokens, setTokens } =
    useTenantTheme();
  const [mode, setMode] = useState<ThemeMode>("light");
  const [host, setHost] = useState<string | null>(null);

  // El host se lee tras hidratar para no romper el markup del servidor.
  useEffect(() => setHost(window.location.host), []);

  const byHost = host ? resolveTenantByHost(TENANTS, host) : null;
  const editing = mode === "light" ? tokens : darkTokens;

  return (
    <Section
      id="tenants"
      title="TenantThemeProvider"
      description="Una paleta por cliente en un mismo deploy: resuelta por dominio o por sesión, aplicada a toda la app."
    >
      <div className="flex flex-col gap-4">
        <Card title="Tenant activo">
          <p className="text-sm text-muted mb-4">
            El provider está montado en{" "}
            <code className="font-mono text-xs">dev/src/app/layout.tsx</code>, que resuelve el tenant en
            el servidor con <code className="font-mono text-xs">headers()</code>. Cambiá de tenant y mirá
            cómo se reskinea <strong>toda</strong> la página — header, botones, tablas, sheets: todos leen
            las mismas CSS vars.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {themes.map((t) => {
              const active = t.id === tenantId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTenant(t.id)}
                  className={[
                    "flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors",
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-muted/40 text-foreground",
                  ].join(" ")}
                >
                  <span className="flex -space-x-1">
                    {[t.tokens?.primary ?? DEFAULT_THEME_TOKENS.primary, t.tokens?.accent ?? DEFAULT_THEME_TOKENS.accent].map(
                      (c, i) => (
                        <span
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-surface"
                          style={{ background: c }}
                        />
                      )
                    )}
                  </span>
                  {t.name}
                </button>
              );
            })}
          </div>

          <dl className="grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">Host</dt>
              <dd className="font-mono text-xs">{host ?? "…"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                Matchea por dominio
              </dt>
              <dd className="font-mono text-xs">{byHost ? byHost.name : "— (ninguno)"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                Tenant aplicado
              </dt>
              <dd className="font-mono text-xs">{tenant?.name ?? "— (default)"}</dd>
            </div>
          </dl>

          <p className="mt-4 text-xs text-muted leading-relaxed">
            Probá la resolución por dominio de verdad: abrí{" "}
            <code className="font-mono">http://acme.localhost:3000</code> o{" "}
            <code className="font-mono">http://globex.localhost:3000</code> — la marca ya viene aplicada
            en el HTML, sin flash. Al refrescar se vuelve a lo que dicta el dominio, porque este provider
            no usa <code className="font-mono">storageKey</code>.
          </p>
        </Card>

        <Card title="Editar la paleta del tenant activo">
          <p className="text-sm text-muted mb-4">
            El mismo <code className="font-mono text-xs">ThemeConfigurator</code>, ahora escribiendo sobre
            el tenant vía <code className="font-mono text-xs">setTokens()</code>. Es el flujo de un panel
            &ldquo;personalizá tu marca&rdquo;: editás, ves el resultado en la app real, y guardás el CSS
            resultante contra tu backend.
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="inline-flex rounded-lg border border-border overflow-hidden">
              {(["light", "dark"] as ThemeMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={[
                    "px-3 py-1.5 text-xs font-semibold transition-colors",
                    mode === m ? "bg-primary text-white" : "hover:bg-surface-alt",
                  ].join(" ")}
                >
                  {m === "light" ? "Paleta clara" : "Paleta oscura"}
                </button>
              ))}
            </div>
            <Button size="sm" variant="secondary" onClick={resetTokens}>
              Descartar cambios
            </Button>
          </div>

          {mode === "dark" && (
            <p className="text-xs text-muted mb-4">
              Estás editando la paleta oscura: usá el switch del header para verla aplicada.
            </p>
          )}

          <div className="grid lg:grid-cols-2 gap-4">
            <ThemeConfigurator
              value={editing}
              onChange={(next) => setTokens(next, mode)}
              resetTo={mode === "light" ? DEFAULT_THEME_TOKENS : DEFAULT_DARK_THEME_TOKENS}
              showExport={false}
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                CSS inyectado por el provider
              </p>
              <pre className="rounded-xl border border-border bg-surface-alt p-4 text-[11px] font-mono leading-relaxed whitespace-pre-wrap break-all max-h-96 overflow-auto">
                {css}
              </pre>
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}

