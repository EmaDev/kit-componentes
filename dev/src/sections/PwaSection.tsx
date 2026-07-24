import { useState } from "react";
import { Button } from "../../../components/Button";
import { PwaInstallPrompt } from "../../../components/PwaInstallPrompt";
import { InstallButton } from "../../../components/InstallButton";
import { OfflineBanner } from "../../../components/OfflineBanner";
import { UpdatePrompt } from "../../../components/UpdatePrompt";
import { NotificationOptIn } from "../../../components/NotificationOptIn";
import { PwaStatus } from "../../../components/PwaStatus";
import { SplashScreen, type SplashVariant } from "../../../components/SplashScreen";
import { Card, Row } from "./Layout";

const VARIANTS: SplashVariant[] = ["fade", "pulse", "orbit", "bars", "zoom", "wipe"];

export function PwaSection() {
  const [installPrompt, setInstallPrompt] = useState<"android" | "ios" | null>(null);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  const [splashVisible, setSplashVisible] = useState(false);
  const [splashVariant, setSplashVariant] = useState<SplashVariant>("zoom");

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card title="PwaInstallPrompt">
        <Row>
          <Button size="sm" onClick={() => setInstallPrompt("android")}>Forzar Android</Button>
          <Button size="sm" onClick={() => setInstallPrompt("ios")}>Forzar iOS</Button>
          {installPrompt && (
            <Button size="sm" variant="ghost" onClick={() => setInstallPrompt(null)}>Cerrar</Button>
          )}
        </Row>
        {installPrompt && (
          <PwaInstallPrompt appName="Mi App" forcePlatform={installPrompt} />
        )}
      </Card>

      <Card title="InstallButton">
        <InstallButton size="sm" variant="outline" onIosClick={() => alert("Mostrar instrucciones iOS")} />
        <p className="mt-2 text-xs text-muted">
          Sólo se ve activo si el navegador dispara <code>beforeinstallprompt</code> (Chrome/Edge desktop, no en este dev server sobre http).
        </p>
      </Card>

      <Card title="OfflineBanner">
        <OfflineBanner position="top" />
        <p className="text-xs text-muted">
          Refleja el estado real de conexión: desactivá la red desde DevTools (Network → Offline) para verlo.
        </p>
      </Card>

      <Card title="UpdatePrompt">
        <Row>
          <Button size="sm" onClick={() => setUpdateVisible(true)}>Forzar visible</Button>
        </Row>
        <UpdatePrompt forceVisible={updateVisible} />
      </Card>

      <Card title="NotificationOptIn">
        <Row>
          <Button size="sm" onClick={() => setNotifVisible((v) => !v)}>Forzar visible</Button>
        </Row>
        <NotificationOptIn forceVisible={notifVisible} requireInstalledOnIos={false} />
      </Card>

      <Card title="PwaStatus">
        <PwaStatus observeOnly />
      </Card>

      <Card title="SplashScreen">
        <Row>
          <select
            className="h-9 rounded-lg border border-border bg-surface px-2 text-sm"
            value={splashVariant}
            onChange={(e) => setSplashVariant(e.target.value as SplashVariant)}
          >
            {VARIANTS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <Button
            size="sm"
            onClick={() => {
              setSplashVisible(true);
              setTimeout(() => setSplashVisible(false), 2200);
            }}
          >
            Mostrar 2.2s
          </Button>
        </Row>
        <SplashScreen
          visible={splashVisible}
          variant={splashVariant}
          appName="Mi App"
          tagline="Cargando tu espacio de trabajo"
          version="1.4.0"
        />
      </Card>
    </div>
  );
}
