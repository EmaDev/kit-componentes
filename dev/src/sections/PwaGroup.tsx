import { useState } from "react";
import { Button } from "../../../components/Button";
import { PwaInstallPrompt } from "../../../components/PwaInstallPrompt";
import { InstallButton } from "../../../components/InstallButton";
import { OfflineBanner } from "../../../components/OfflineBanner";
import { UpdatePrompt } from "../../../components/UpdatePrompt";
import { NotificationOptIn } from "../../../components/NotificationOptIn";
import { PwaStatus } from "../../../components/PwaStatus";
import { SplashScreen, type SplashVariant } from "../../../components/SplashScreen";
import { SafeArea } from "../../../components/SafeArea";
import { usePlatform } from "../../../hooks/usePlatform";
import { useHaptics, type HapticPattern } from "../../../hooks/useHaptics";
import { Section, Card, Row } from "../chrome/Section";

const VARIANTS: SplashVariant[] = ["fade", "pulse", "orbit", "bars", "zoom", "wipe"];
const HAPTIC_PATTERNS: HapticPattern[] = ["tap", "success", "warning", "error", "toggle"];

function PwaInstallSection() {
  const [platform, setPlatform] = useState<"android" | "ios" | null>(null);
  return (
    <Section id="pwa" title="PwaInstallPrompt" description="Banner Android nativo + sheet de instrucciones iOS.">
      <Card>
        <Row>
          <Button size="sm" onClick={() => setPlatform("android")}>
            Forzar Android
          </Button>
          <Button size="sm" onClick={() => setPlatform("ios")}>
            Forzar iOS
          </Button>
          {platform && (
            <Button size="sm" variant="ghost" onClick={() => setPlatform(null)}>
              Cerrar
            </Button>
          )}
        </Row>
        {platform && <PwaInstallPrompt appName="Mi App" forcePlatform={platform} />}
      </Card>
    </Section>
  );
}

function PwaMoleculesSection() {
  const [updateVisible, setUpdateVisible] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  return (
    <Section
      id="pwamol"
      title="Moléculas PWA"
      description="InstallButton, OfflineBanner, UpdatePrompt, NotificationOptIn y PwaStatus."
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="InstallButton">
          <InstallButton size="sm" variant="outline" onIosClick={() => alert("Mostrar instrucciones iOS")} />
          <p className="mt-2 text-xs text-muted">
            Sólo activo si el navegador dispara <code>beforeinstallprompt</code> (Chrome/Edge desktop).
          </p>
        </Card>

        <Card title="OfflineBanner">
          <OfflineBanner position="top" />
          <p className="text-xs text-muted">
            Refleja el estado real de conexión: probá Network → Offline en DevTools.
          </p>
        </Card>

        <Card title="UpdatePrompt">
          <Row>
            <Button size="sm" onClick={() => setUpdateVisible(true)}>
              Forzar visible
            </Button>
          </Row>
          <UpdatePrompt forceVisible={updateVisible} />
        </Card>

        <Card title="NotificationOptIn">
          <Row>
            <Button size="sm" onClick={() => setNotifVisible((v) => !v)}>
              Forzar visible
            </Button>
          </Row>
          <NotificationOptIn forceVisible={notifVisible} requireInstalledOnIos={false} />
        </Card>

        <Card title="PwaStatus" className="md:col-span-2">
          <PwaStatus observeOnly />
        </Card>
      </div>
    </Section>
  );
}

function SplashSection() {
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<SplashVariant>("zoom");
  return (
    <Section id="splash" title="SplashScreen" description="6 estilos de animación de entrada/salida.">
      <Card>
        <Row>
          <select
            className="h-9 rounded-lg border border-border bg-surface px-2 text-sm"
            value={variant}
            onChange={(e) => setVariant(e.target.value as SplashVariant)}
          >
            {VARIANTS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            onClick={() => {
              setVisible(true);
              setTimeout(() => setVisible(false), 2200);
            }}
          >
            Mostrar 2.2s
          </Button>
        </Row>
        <SplashScreen visible={visible} variant={variant} appName="Mi App" tagline="Cargando tu espacio de trabajo" version="1.4.0" />
      </Card>
    </Section>
  );
}

function SafeAreaSection() {
  return (
    <Section
      id="safearea"
      title="Safe area · Shell"
      description="SafeArea respeta los insets del notch/home indicator. NativeShell y ViewportLock no se montan en vivo acá (bloquean zoom/gestos a nivel global)."
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="SafeArea">
          <div className="relative h-24 rounded-xl border border-dashed border-border overflow-hidden">
            <SafeArea edges={["top"]} gutter={8} className="bg-primary/10 text-xs px-2 py-1">
              Respeta safe-area-inset-top (+ 8px de gutter)
            </SafeArea>
          </div>
        </Card>
        <Card title="NativeShell / ViewportLock">
          <pre className="text-[11px] bg-surface rounded-lg p-3 overflow-auto border border-border">
{`<NativeShell onlyWhenInstalled>{children}</NativeShell>
<ViewportLock onlyWhenInstalled />`}
          </pre>
        </Card>
      </div>
    </Section>
  );
}

function PlatformSection() {
  const platform = usePlatform();
  const { haptic, supported } = useHaptics();
  return (
    <Section id="platform" title="Platform · Native" description="usePlatform() detecta OS/browser/form factor; useHaptics() dispara vibración con nombres semánticos.">
      <div className="grid md:grid-cols-2 gap-4">
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
      </div>
    </Section>
  );
}

export function PwaGroup() {
  return (
    <>
      <PwaInstallSection />
      <PwaMoleculesSection />
      <SplashSection />
      <SafeAreaSection />
      <PlatformSection />
    </>
  );
}
