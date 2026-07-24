import { useState } from "react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { Select, type SelectOption } from "../../../components/Select";
import { Dropdown, type DropdownItem } from "../../../components/Dropdown";
import { Checkbox, CheckboxGroup } from "../../../components/Checkbox";
import { Spinner } from "../../../components/Spinner";
import { useToast } from "../../../components/Toast";
import { Modal } from "../../../components/Modal";
import { BottomSheet } from "../../../components/BottomSheet";
import { Section, Card } from "../chrome/Section";

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
    <Section id="button" title="Button" description="6 variantes · 4 tamaños · loading state · iconos · hover lift y tap scale.">
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

function NextOnlyNote({ id, title, importLine }: { id: string; title: string; importLine: string }) {
  return (
    <Section id={id} title={title} description="Usa next/link y next/navigation: no resuelve fuera de una app Next.js real.">
      <Card>
        <p className="text-sm text-muted leading-relaxed">
          No se puede montar en vivo en este playground de Vite. Se ve con un mock visual en{" "}
          <code>preview.html</code>, y funciona de verdad en cualquier app Next.js que instale el paquete.
        </p>
        <pre className="mt-3 text-[11px] bg-surface rounded-lg p-3 overflow-auto border border-border">{importLine}</pre>
      </Card>
    </Section>
  );
}

export function AtomsGroup() {
  return (
    <>
      <ButtonSection />
      <InputSection />
      <TextareaSection />
      <SelectSection />
      <DropdownSection />
      <CheckboxSection />
      <SpinnerSection />
      <ToastSection />
      <ModalSection />
      <BottomSheetSection />
      <NextOnlyNote id="navbar" title="Navbar" importLine={`<Navbar brand={<Logo/>} links={[...]} />`} />
      <NextOnlyNote id="sidebar" title="SideBar" importLine={`<SideBar links={[...]} />`} />
      <NextOnlyNote id="bottomnav" title="BottomNav" importLine={`<BottomNav items={[...]} />`} />
    </>
  );
}
