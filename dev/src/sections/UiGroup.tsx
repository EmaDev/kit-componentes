import { useState, type ReactNode } from "react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { Select, type SelectOption } from "../../../components/Select";
import { Dropdown, type DropdownItem } from "../../../components/Dropdown";
import { Checkbox, CheckboxGroup } from "../../../components/Checkbox";
import { Switch } from "../../../components/Switch";
import { CodeOTP } from "../../../components/CodeOTP";
import { Spinner } from "../../../components/Spinner";
import { useToast } from "../../../components/Toast";
import { Modal } from "../../../components/Modal";
import { BottomSheet } from "../../../components/BottomSheet";
import { Tooltip } from "../../../components/Tooltip";
import { Popover } from "../../../components/Popover";
import { CoachMark, type CoachMarkStep } from "../../../components/CoachMark";
import { Tabs, type TabItem } from "../../../components/Tabs";
import { Section, Card } from "../chrome/Section";
import { I } from "../chrome/Icon";

const COUNTRIES: SelectOption[] = [
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brasil" },
  { value: "cl", label: "Chile" },
  { value: "uy", label: "Uruguay" },
];

const MENU_ITEMS: DropdownItem[] = [
  { label: "Editar", onClick: () => console.log("editar") },
  { label: "Duplicar", onClick: () => console.log("duplicar") },
  { divider: true, label: "" },
  { label: "Eliminar", destructive: true, onClick: () => console.log("eliminar") },
];

const TOPICS = [
  { value: "news", label: "Novedades" },
  { value: "billing", label: "Facturación" },
  { value: "security", label: "Seguridad" },
];

function ButtonSection() {
  const [loading, setLoading] = useState(false);
  return (
    <Section id="button" title="Button" description="6 variantes · 4 tamaños · loading state · iconos · ripple y tap scale.">
      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Variantes">
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="success">Success</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </Card>
        <Card title="Tamaños">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </Card>
        <Card title="Con iconos">
          <div className="flex flex-wrap gap-2">
            <Button leftIcon={<span>＋</span>}>Crear proyecto</Button>
            <Button variant="outline" leftIcon={<span>⌥</span>}>
              GitHub
            </Button>
          </div>
        </Card>
        <Card title="Loading">
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              loading={loading}
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1500);
              }}
            >
              {loading ? "Procesando…" : "Iniciar acción"}
            </Button>
            <Button variant="secondary" loading>
              Cargando
            </Button>
            <Button variant="success" disabled>
              Deshabilitado
            </Button>
          </div>
        </Card>
      </div>
    </Section>
  );
}

function InputSection() {
  const [email, setEmail] = useState("invalid-email");
  return (
    <Section id="input" title="Input" description="Floating label · estados focus/error con shake · iconos prefix/suffix.">
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Estados">
          <div className="space-y-4">
            <Input label="Nombre" hint="Aparece como label flotante." />
            <Input label="Contraseña" type="password" defaultValue="••••••••" />
          </div>
        </Card>
        <Card title="Con error">
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={email.includes("@") ? undefined : "Formato de email inválido"}
            />
            <Input label="Username" placeholder="@usuario" />
          </div>
        </Card>
      </div>
    </Section>
  );
}

function TextareaSection() {
  return (
    <Section id="textarea" title="Textarea" description="Auto-resize hasta 280px · contador animado · floating label.">
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Auto-resize">
          <Textarea label="Descripción" hint="Crece a medida que escribes." />
        </Card>
        <Card title="Con contador">
          <Textarea label="Bio" maxLength={140} showCount defaultValue="Diseñador, dev y curioso." />
        </Card>
      </div>
    </Section>
  );
}

function SelectSection() {
  const [country, setCountry] = useState("ar");
  return (
    <Section id="select" title="Select" description="Dropdown animado con teclado (Escape para cerrar) y click-outside.">
      <Card title="País">
        <div className="max-w-xs">
          <Select label="País" options={COUNTRIES} value={country} onChange={setCountry} />
        </div>
      </Card>
    </Section>
  );
}

function DropdownSection() {
  return (
    <Section id="dropdown" title="Dropdown" description="Menú contextual con divisores, atajos e ítems destructivos.">
      <Card title="Menú de acciones">
        <Dropdown trigger={<Button variant="secondary">Acciones ⌄</Button>} items={MENU_ITEMS} />
      </Card>
    </Section>
  );
}

function CheckboxSection() {
  const [agree, setAgree] = useState(false);
  const [topics, setTopics] = useState<string[]>(["news"]);
  return (
    <Section id="checkbox" title="Checkbox" description="Estado indeterminado, tonos y grupo con 'seleccionar todo'.">
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Individual">
          <Checkbox
            checked={agree}
            onChange={setAgree}
            label="Acepto los términos"
            description="Leí y acepto los términos y condiciones."
          />
        </Card>
        <Card title="Grupo">
          <CheckboxGroup
            label="Notificaciones"
            selectAllLabel="Todas"
            options={TOPICS}
            value={topics}
            onChange={setTopics}
          />
        </Card>
      </div>
    </Section>
  );
}

function SwitchSection() {
  const [notifications, setNotifications] = useState(true);
  const [autoRenew, setAutoRenew] = useState(false);
  return (
    <Section id="switch" title="Switch" description="Interruptor on/off con thumb animado por spring, para preferencias que se aplican al instante.">
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Básico">
          <div className="flex flex-col gap-4">
            <Switch checked={notifications} onChange={setNotifications} label="Notificaciones push" />
            <Switch
              checked={autoRenew}
              onChange={setAutoRenew}
              label="Renovación automática"
              description="Se debitará de tu tarjeta guardada cada mes."
              tone="success"
            />
            <Switch checked={false} onChange={() => {}} disabled label="Requiere plan Pro" />
          </div>
        </Card>
        <Card title="Tamaños">
          <div className="flex items-center gap-5">
            <Switch checked size="sm" onChange={() => {}} />
            <Switch checked size="md" onChange={() => {}} />
            <Switch checked size="lg" onChange={() => {}} />
          </div>
        </Card>
      </div>
    </Section>
  );
}

function CodeOTPSection() {
  const [code, setCode] = useState("");
  return (
    <Section id="codeotp" title="CodeOTP" description="Código de un solo uso (2FA/OTP) en casillas segmentadas, con auto-avance, borrado inteligente y pegado multi-dígito.">
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="No controlado">
          <CodeOTP length={6} label="Código de verificación" hint="Te lo enviamos por SMS." onComplete={(c) => console.log("completo:", c)} />
        </Card>
        <Card title="Controlado">
          <CodeOTP length={4} value={code} onChange={setCode} label="PIN" />
          <p className="mt-3 text-[11px] font-mono text-muted">value: &quot;{code}&quot;</p>
        </Card>
      </div>
    </Section>
  );
}

function SpinnerSection() {
  return (
    <Section id="spinner" title="Spinner" description="4 variantes de loading indicator.">
      <Card>
        <div className="flex flex-wrap items-center gap-6">
          <Spinner variant="ring" />
          <Spinner variant="dots" />
          <Spinner variant="pulse" />
          <Spinner variant="bars" />
        </div>
      </Card>
    </Section>
  );
}

function ToastSection() {
  const { toast } = useToast();
  return (
    <Section id="toast" title="Toast" description="ToastProvider + useToast() — apilado, con barra de progreso y acción opcional.">
      <Card>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="success"
            onClick={() => toast({ title: "Guardado", description: "Los cambios se guardaron.", variant: "success" })}
          >
            Success
          </Button>
          <Button variant="danger" onClick={() => toast({ title: "Error al guardar", variant: "error" })}>
            Error
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast({
                title: "Nueva versión disponible",
                variant: "info",
                action: { label: "Actualizar", onClick: () => toast({ title: "Actualizando…" }) },
              })
            }
          >
            Con acción
          </Button>
        </div>
      </Card>
    </Section>
  );
}

function ModalSection() {
  const [open, setOpen] = useState(false);
  return (
    <Section id="modal" title="Modal" description="Backdrop con blur, spring de entrada, cierre con Escape/backdrop.">
      <Card>
        <Button onClick={() => setOpen(true)}>Abrir modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Confirmar acción"
          description="Esto no se puede deshacer."
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Eliminar
              </Button>
            </>
          }
        >
          <p className="text-sm text-muted">Contenido del modal.</p>
        </Modal>
      </Card>
    </Section>
  );
}

function BottomSheetSection() {
  const [open, setOpen] = useState(false);
  return (
    <Section id="sheet" title="BottomSheet" description="7 alturas · snapPoints arrastrables · flotante en desktop.">
      <Card>
        <Button onClick={() => setOpen(true)}>Abrir sheet</Button>
        <BottomSheet
          open={open}
          onClose={() => setOpen(false)}
          size="md"
          title="Elegí una opción"
          footer={
            <Button fullWidth onClick={() => setOpen(false)}>
              Confirmar
            </Button>
          }
        >
          <p className="text-sm text-muted">Contenido del sheet.</p>
        </BottomSheet>
      </Card>
    </Section>
  );
}

function TooltipSection() {
  return (
    <Section id="tooltip" title="Tooltip" description="Globo informativo con hover/focus, delay configurable y auto-flip si no entra en el viewport.">
      <Card title="Distintos lados">
        <div className="flex flex-wrap items-center gap-6 py-4">
          <Tooltip content="Arriba" side="top">
            <Button variant="secondary" size="sm">Top</Button>
          </Tooltip>
          <Tooltip content="Abajo" side="bottom">
            <Button variant="secondary" size="sm">Bottom</Button>
          </Tooltip>
          <Tooltip content="Izquierda" side="left">
            <Button variant="secondary" size="sm">Left</Button>
          </Tooltip>
          <Tooltip content="Derecha" side="right">
            <Button variant="secondary" size="sm">Right</Button>
          </Tooltip>
          <Tooltip content="Aparece más rápido (100ms)" delay={100}>
            <Button variant="outline" size="sm">Delay corto</Button>
          </Tooltip>
        </div>
      </Card>
    </Section>
  );
}

function PopoverSection() {
  const [filters, setFilters] = useState<string[]>(["stock"]);
  const toggle = (key: string) =>
    setFilters((prev) => (prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]));

  return (
    <Section id="popover" title="Popover" description="Panel anclado con contenido interactivo, abierto con click. Cierra con click afuera o Escape.">
      <Card title="Filtros">
        <Popover trigger={<Button variant="secondary">Filtros {filters.length > 0 ? `(${filters.length})` : ""}</Button>}>
          <div className="flex flex-col gap-2.5 w-56">
            <Checkbox label="Sólo en stock" checked={filters.includes("stock")} onChange={() => toggle("stock")} />
            <Checkbox label="Con descuento" checked={filters.includes("descuento")} onChange={() => toggle("descuento")} />
            <Checkbox label="Envío gratis" checked={filters.includes("envio")} onChange={() => toggle("envio")} />
          </div>
        </Popover>
      </Card>
    </Section>
  );
}

const COACHMARK_STEPS: CoachMarkStep[] = [
  { target: "#coachmark-target-search", title: "Buscá lo que necesites", description: "Escribí un producto o proveedor y filtrá en vivo.", side: "bottom" },
  { target: "#coachmark-target-cart", title: "Tu carrito", description: "Revisá tus pedidos pendientes acá.", side: "top" },
  { target: "#coachmark-target-profile", title: "Tu cuenta", description: "Configurá notificaciones y datos de facturación.", side: "top", align: "end" },
];

function CoachMarkSection() {
  const [open, setOpen] = useState(false);
  return (
    <Section id="coachmark" title="CoachMark" description="Tour guiado con spotlight sobre elementos reales de la UI, para onboarding.">
      <Card title="Tour de bienvenida">
        <Button onClick={() => setOpen(true)}>Iniciar tour</Button>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button id="coachmark-target-search" variant="outline" size="sm">
            Buscar
          </Button>
          <Button id="coachmark-target-cart" variant="outline" size="sm">
            Carrito
          </Button>
          <Button id="coachmark-target-profile" variant="outline" size="sm">
            Perfil
          </Button>
        </div>
        <CoachMark
          open={open}
          onClose={() => setOpen(false)}
          steps={COACHMARK_STEPS}
        />
      </Card>
    </Section>
  );
}

const UI_TABS: TabItem[] = [
  { id: "formularios", label: "Formularios", icon: I.sliders, badge: 8 },
  { id: "feedback", label: "Feedback", icon: I.bell, badge: 2 },
  { id: "overlays", label: "Overlays", icon: I.stack, badge: 5 },
];

const UI_PANELS: Record<string, ReactNode> = {
  formularios: (
    <>
      <ButtonSection />
      <InputSection />
      <TextareaSection />
      <SelectSection />
      <DropdownSection />
      <CheckboxSection />
      <SwitchSection />
      <CodeOTPSection />
    </>
  ),
  feedback: (
    <>
      <SpinnerSection />
      <ToastSection />
    </>
  ),
  overlays: (
    <>
      <ModalSection />
      <BottomSheetSection />
      <TooltipSection />
      <PopoverSection />
      <CoachMarkSection />
    </>
  ),
};

export function UiGroup({ tab, onTabChange }: { tab: string; onTabChange: (id: string) => void }) {
  return (
    <Tabs
      items={UI_TABS}
      value={tab}
      onChange={onTabChange}
      variant="segmented"
      size="lg"
      fitted
      panels={UI_PANELS}
    />
  );
}
