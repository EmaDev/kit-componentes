import { useRef, useState, type ReactNode, type RefObject } from "react";
import { AppHeader, type HeaderAction } from "../../../components/AppHeader";
import { AppHeaderIsland } from "../../../components/AppHeaderIsland";
import { AppHeaderTabs } from "../../../components/AppHeaderTabs";
import { AppHeaderWave } from "../../../components/AppHeaderWave";
import { AppHeaderCard } from "../../../components/AppHeaderCard";
import { AppHeaderNotch } from "../../../components/AppHeaderNotch";
import { AppHeaderPill } from "../../../components/AppHeaderPill";
import { AppHeaderCardSlot } from "../../../components/AppHeaderCardSlot";
import { SyncStatus } from "../../../components/SyncStatus";
import { OfflineFallback } from "../../../components/OfflineFallback";
import { PermissionGate } from "../../../components/PermissionGate";
import { CameraCapture } from "../../../components/CameraCapture";
import { LocationPicker } from "../../../components/LocationPicker";
import { BiometricGate } from "../../../components/BiometricGate";
import { Button } from "../../../components/Button";
import { useOfflineQueue } from "../../../hooks/useOfflineQueue";
import { usePersistentState } from "../../../hooks/usePersistentState";
import { useClipboard } from "../../../hooks/useClipboard";
import { useStorageEstimate, formatBytes } from "../../../hooks/useStorageEstimate";
import { useContactPicker } from "../../../hooks/useContactPicker";
import { useNfc } from "../../../hooks/useNfc";
import { useWebOTP } from "../../../hooks/useWebOTP";
import { usePeriodicSync } from "../../../hooks/usePeriodicSync";
import { Section, Card, Row } from "../chrome/Section";

export function AppHeaderSection() {
  const [big, setBig] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const actions: HeaderAction[] = [
    { id: "search", label: "Buscar", icon: <SearchIcon />, badge: false, onClick: () => {} },
    { id: "notif", label: "Notificaciones", icon: <BellIcon />, badge: 3, tone: "primary", onClick: () => {} },
  ];
  return (
    <Section
      id="appheader"
      title="AppHeader"
      description="Volver, título grande colapsable, acciones con badge y buscador expandible. Gana borde y fondo al scrollear, como una app nativa."
    >
      <Card>
        <Row className="mb-3">
          <Button size="sm" variant={big ? "primary" : "secondary"} onClick={() => setBig((v) => !v)}>
            {big ? "Título grande: ON" : "Título grande: OFF"}
          </Button>
        </Row>
        <div ref={scrollRef} className="rounded-2xl border border-border overflow-hidden h-64 overflow-y-auto">
          <AppHeader title="Inicio" largeTitle={big} searchable actions={actions} scrollRef={scrollRef} />
          <div className="p-4 flex flex-col gap-2">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="h-10 rounded-lg bg-surface-alt" />
            ))}
          </div>
        </div>
      </Card>
    </Section>
  );
}

function MiniHeaderDemo({ label, render }: { label: string; render: (ref: RefObject<HTMLDivElement | null>) => ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <Card title={label}>
      <div ref={ref} className="relative rounded-2xl border border-border overflow-hidden h-56 overflow-y-auto">
        {render(ref)}
        <div className="p-4 flex flex-col gap-2">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="h-10 rounded-lg bg-surface-alt" />
          ))}
        </div>
      </div>
    </Card>
  );
}

export function AppHeaderVariantsSection() {
  return (
    <Section
      id="appheadervariants"
      title="Variantes de AppHeader"
      description="Mismo trabajo (header con volver, título y acciones) resuelto con 6 formas distintas. Todas escuchan el scroll del contenedor pasado en scrollRef."
    >
      <div className="grid md:grid-cols-2 gap-4">
        <MiniHeaderDemo
          label="AppHeaderIsland"
          render={(ref) => <AppHeaderIsland title="Inicio" searchable onSearch={() => {}} scrollRef={ref} />}
        />
        <MiniHeaderDemo
          label="AppHeaderWave"
          render={(ref) => <AppHeaderWave title="Hola, Lucía" subtitle="Tenés 3 pedidos nuevos" scrollRef={ref} />}
        />
        <MiniHeaderDemo
          label="AppHeaderCard"
          render={(ref) => <AppHeaderCard title="Ajustes" onBack={() => {}} scrollRef={ref} />}
        />
        <MiniHeaderDemo
          label="AppHeaderNotch"
          render={(ref) => (
            <AppHeaderNotch
              title="Cámara"
              center={<span className="text-sm font-bold text-white">LM</span>}
              scrollRef={ref}
            />
          )}
        />
        <MiniHeaderDemo
          label="AppHeaderPill"
          render={(ref) => <AppHeaderPill title="Explorar" onSearch={() => {}} scrollRef={ref} />}
        />
        <MiniHeaderDemo
          label="AppHeaderCardSlot"
          render={() => (
            <AppHeaderCardSlot
              card={
                <div className="p-4">
                  <p className="text-xs text-muted font-semibold uppercase tracking-wider">Saldo</p>
                  <p className="text-2xl font-black text-foreground">$248.320</p>
                </div>
              }
            />
          )}
        />
      </div>
    </Section>
  );
}

const HEADER_TABS = [
  { id: "todos", label: "Todos" },
  { id: "pendientes", label: "Pendientes", count: 12 },
  { id: "camino", label: "En camino", count: 3 },
  { id: "entregados", label: "Entregados" },
  { id: "cancelados", label: "Cancelados" },
  { id: "devueltos", label: "Devueltos", count: 1 },
];

export function AppHeaderTabsSection() {
  const [tabVariant, setTabVariant] = useState<"underline" | "pill">("underline");
  const [tab, setTab] = useState("todos");
  const scrollRef = useRef<HTMLDivElement>(null);

  const panels = Object.fromEntries(
    HEADER_TABS.map((t) => [
      t.id,
      <p key={t.id} className="text-sm text-muted">
        Contenido de <b className="text-foreground">{t.label}</b>
        {t.count != null && ` — ${t.count} pedidos`}.
      </p>,
    ]),
  );

  return (
    <Section
      id="appheadertabs"
      title="AppHeaderTabs"
      description="Header con una fila de tabs scrolables pegada arriba: degradados en los bordes sólo cuando queda contenido fuera de vista, el tab activo siempre se trae a la vista, y panels con transición. Hay más tabs de los que entran a propósito — deslizá el track."
    >
      <Card>
        <Row className="mb-3">
          <Button
            size="sm"
            variant={tabVariant === "underline" ? "primary" : "secondary"}
            onClick={() => setTabVariant("underline")}
          >
            underline
          </Button>
          <Button
            size="sm"
            variant={tabVariant === "pill" ? "primary" : "secondary"}
            onClick={() => setTabVariant("pill")}
          >
            pill
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setTab("devueltos")}>
            Ir al último tab
          </Button>
        </Row>
        <div ref={scrollRef} className="rounded-2xl border border-border overflow-hidden h-72 overflow-y-auto">
          <AppHeaderTabs
            title="Pedidos"
            subtitle="Sucursal Centro"
            onBack={() => {}}
            tabs={HEADER_TABS}
            tabVariant={tabVariant}
            value={tab}
            onChange={setTab}
            panels={panels}
            scrollRef={scrollRef}
            actions={[{ id: "new", label: "Nuevo", icon: <BellIcon />, badge: 2, tone: "primary", onClick: () => {} }]}
          />
          <div className="p-4 flex flex-col gap-2">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="h-10 rounded-lg bg-surface-alt" />
            ))}
          </div>
        </div>
      </Card>
    </Section>
  );
}

export function OfflineQueueSection() {
  const queue = useOfflineQueue<{ text: string }>({
    name: "playground-comments",
    send: async () => {
      await new Promise((resolve, reject) =>
        setTimeout(() => (Math.random() > 0.35 ? resolve(undefined) : reject(new Error("500"))), 900),
      );
    },
  });

  return (
    <Section
      id="syncstatus"
      title="SyncStatus · useOfflineQueue"
      description="Encolá una acción y se persiste en IndexedDB con reintentos y backoff — SyncStatus muestra el estado en vivo. Acá el 'envío' falla ~35% de las veces a propósito, para ver el estado de error."
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Chip">
          <Row className="mb-3">
            <Button size="sm" onClick={() => queue.enqueue("comment", { text: "hola" })}>
              Encolar cambio
            </Button>
          </Row>
          <SyncStatus
            pending={queue.pending}
            failed={queue.failed}
            flushing={queue.flushing}
            hideWhenSynced={false}
            onRetry={() => queue.retry()}
          />
        </Card>
        <Card title="Panel">
          <SyncStatus
            variant="panel"
            pending={queue.pending}
            failed={queue.failed}
            flushing={queue.flushing}
            onRetry={() => queue.retry()}
          />
        </Card>
      </div>
    </Section>
  );
}

export function OfflineFallbackSection() {
  return (
    <Section
      id="offlinefallback"
      title="OfflineFallback"
      description="Estado de 'sin conexión' para cuando un fetch falla y no hay caché. Se actualiza solo al volver la conexión real (probá Network → Offline en DevTools)."
    >
      <Card>
        <OfflineFallback variant="inline" onRetry={() => {}} onGoCached={() => {}} />
      </Card>
    </Section>
  );
}

export function PermissionSection() {
  return (
    <Section
      id="permissiongate"
      title="PermissionGate"
      description="Pide un permiso del navegador con contexto — explica antes de preguntar, y contempla el estado bloqueado."
    >
      <Card>
        <PermissionGate kind="clipboard-read" reason="Para pegar el código que copiaste, necesitamos leer el portapapeles.">
          <p className="text-sm text-success font-semibold">✓ Permiso concedido — este contenido sólo se monta ahí.</p>
        </PermissionGate>
      </Card>
    </Section>
  );
}

export function CameraCaptureSection() {
  const [open, setOpen] = useState(false);
  const [shot, setShot] = useState<string | null>(null);
  return (
    <Section id="cameracapture" title="CameraCapture" description="Foto a pantalla completa: preview en vivo, cambio de cámara y revisión antes de confirmar.">
      <Card>
        <Row>
          <Button size="sm" onClick={() => setOpen(true)}>Abrir cámara</Button>
        </Row>
        {shot && <img src={shot} alt="" className="mt-3 w-32 rounded-xl border border-border" />}
        <CameraCapture
          open={open}
          onClose={() => setOpen(false)}
          guide="square"
          onCapture={(_, dataUrl) => setShot(dataUrl)}
        />
      </Card>
    </Section>
  );
}

export function LocationPickerSection() {
  return (
    <Section id="locationpicker" title="LocationPicker" description="Botón 'usar mi ubicación actual' + dirección con sugerencias. No dibuja mapa: enchufale el tuyo.">
      <Card>
        <div className="max-w-sm">
          <LocationPicker
            onSearch={async (q) => [
              { id: "1", label: `${q} 123, Palermo` },
              { id: "2", label: `${q} 456, Belgrano` },
            ]}
          />
        </div>
      </Card>
    </Section>
  );
}

export function BiometricGateSection() {
  const [locked, setLocked] = useState(false);
  return (
    <Section id="biometricgate" title="BiometricGate" description="Desbloqueo por Face ID / huella / Windows Hello vía WebAuthn, con caída a un método alternativo.">
      <Card>
        <Row>
          <Button size="sm" onClick={() => setLocked(true)}>Bloquear pantalla</Button>
        </Row>
        <BiometricGate
          open={locked}
          auto={false}
          onUnlock={() => setLocked(false)}
          onFallback={() => setLocked(false)}
        />
      </Card>
    </Section>
  );
}

export function DataHooksSection() {
  const [note, setNote, { hydrated }] = usePersistentState("playground.note", "");
  const { copy, copied } = useClipboard();
  const { usage, quota, supported, clearCaches } = useStorageEstimate();

  return (
    <Section
      id="datahooks"
      title="Hooks de datos y dispositivo"
      description="usePersistentState, useClipboard y useStorageEstimate — piezas sueltas para persistencia y utilidades de plataforma."
    >
      <div className="grid md:grid-cols-3 gap-4">
        <Card title="usePersistentState">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={hydrated ? "Escribí algo y recargá la página…" : "Cargando…"}
            className="w-full h-9 rounded-lg border border-border bg-surface px-2 text-sm"
          />
          <p className="mt-2 text-[11px] text-muted">Sobrevive un refresh — se guarda en IndexedDB.</p>
        </Card>
        <Card title="useClipboard">
          <Button size="sm" variant="secondary" onClick={() => copy("lib-kit-components")}>
            {copied ? "¡Copiado!" : "Copiar texto"}
          </Button>
        </Card>
        <Card title="useStorageEstimate">
          {supported ? (
            <>
              <p className="text-sm text-foreground">{formatBytes(usage)} de {formatBytes(quota)}</p>
              <Button size="sm" variant="ghost" className="mt-2" onClick={() => clearCaches()}>
                Vaciar Cache Storage
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted">No soportado en este navegador.</p>
          )}
        </Card>
      </div>
    </Section>
  );
}

export function DeviceApisSection() {
  const { supported: contactsSupported, pick, contacts } = useContactPicker();
  const { supported: nfcSupported, scanning, tag, scan, stop } = useNfc();
  const { supported: syncSupported, registered, register, unregister } = usePeriodicSync("playground-refresh", 6);
  const [otp, setOtp] = useState("");
  useWebOTP((code) => setOtp(code), otp.length === 0);

  return (
    <Section
      id="deviceapis"
      title="Web APIs de dispositivo"
      description="useContactPicker, useNfc, useWebOTP y usePeriodicSync — piezas puntuales sobre APIs de plataforma acotadas (Android/Chrome en su mayoría). Todas se degradan a 'no soportado' en el resto de navegadores."
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="useContactPicker">
          {contactsSupported ? (
            <Button size="sm" onClick={() => pick()}>Elegir contacto</Button>
          ) : (
            <p className="text-sm text-muted">No soportado en este navegador.</p>
          )}
          {contacts[0] && <p className="mt-2 text-xs text-foreground">{contacts[0].name ?? contacts[0].tel ?? contacts[0].email}</p>}
        </Card>

        <Card title="useNfc">
          {nfcSupported ? (
            <Button size="sm" onClick={scanning ? stop : scan}>{scanning ? "Cancelar" : "Escanear tag"}</Button>
          ) : (
            <p className="text-sm text-muted">No soportado en este navegador.</p>
          )}
          {tag && <p className="mt-2 text-xs text-foreground">{tag.serialNumber}</p>}
        </Card>

        <Card title="useWebOTP">
          <p className="text-xs text-muted mb-2">Autocompleta el código de un SMS en Android/Chrome (necesita un SMS real con el sufijo esperado).</p>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Código recibido…"
            className="w-full h-9 rounded-lg border border-border bg-surface px-2 text-sm"
          />
        </Card>

        <Card title="usePeriodicSync">
          {syncSupported ? (
            <Button size="sm" onClick={registered ? unregister : register}>
              {registered ? "Cancelar refresco en 2° plano" : "Registrar refresco en 2° plano"}
            </Button>
          ) : (
            <p className="text-sm text-muted">Sólo con la PWA instalada (Chrome).</p>
          )}
        </Card>
      </div>
    </Section>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" /><line x1="20" y1="20" x2="16.7" y2="16.7" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

