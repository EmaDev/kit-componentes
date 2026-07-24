import { usePlatform } from "../../../hooks/usePlatform";
import { useHaptics, type HapticPattern } from "../../../hooks/useHaptics";
import { SafeArea } from "../../../components/SafeArea";
import { Button } from "../../../components/Button";
import { Card, Row } from "./Layout";

const HAPTIC_PATTERNS: HapticPattern[] = ["tap", "success", "warning", "error", "toggle"];

export function PlatformSection() {
  const platform = usePlatform();
  const { haptic, supported } = useHaptics();

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card title="usePlatform()">
        {platform.hydrating ? (
          <p className="text-sm text-muted">Resolviendo…</p>
        ) : (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {Object.entries(platform)
              .filter(([k]) => k !== "hydrating" && k !== "safeArea")
              .map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-foreground font-medium truncate">{String(v)}</dd>
                </div>
              ))}
          </dl>
        )}
      </Card>

      <Card title="useHaptics()">
        <p className="text-xs text-muted mb-3">
          Soportado en este dispositivo: <strong>{supported ? "sí" : "no"}</strong> (iOS Safari nunca lo soporta).
        </p>
        <Row>
          {HAPTIC_PATTERNS.map((p) => (
            <Button key={p} size="sm" variant="secondary" onClick={() => haptic(p)}>
              {p}
            </Button>
          ))}
        </Row>
      </Card>

      <Card title="SafeArea">
        <div className="relative h-24 rounded-xl border border-dashed border-border overflow-hidden">
          <SafeArea edges={["top"]} gutter={8} className="bg-primary/10 text-xs px-2 py-1">
            Respeta el notch/safe-area-inset-top (+ 8px de gutter)
          </SafeArea>
        </div>
      </Card>

      <Card title="Navbar / SideBar / BottomNav">
        <p className="text-xs text-muted leading-relaxed">
          Usan <code>next/link</code> y <code>next/navigation</code> directamente, así que no
          resuelven en este playground de Vite. Se siguen viendo (con mocks visuales) en{" "}
          <code>preview.html</code>, y funcionan de verdad sólo dentro de una app Next.js real.
        </p>
      </Card>

      <Card title="NativeShell / ViewportLock">
        <p className="text-xs text-muted leading-relaxed">
          Bloquean zoom, overscroll y gestos a nivel global — no los monto acá en vivo para no
          romper la navegación del playground mismo. Import real:
        </p>
        <pre className="mt-2 text-[11px] bg-surface-alt rounded-lg p-2 overflow-auto">
{`<NativeShell onlyWhenInstalled>{children}</NativeShell>
<ViewportLock onlyWhenInstalled />`}
        </pre>
      </Card>
    </div>
  );
}
