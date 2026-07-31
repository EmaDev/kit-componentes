import { useState } from "react";
import { Breadcrumbs, type Crumb } from "../../../components/Breadcrumbs";
import { CreditCard, CreditCardStack, type CreditCardData } from "../../../components/FlipCard";
import { FloatingButton } from "../../../components/FloatingButton";
import { FabActionSheets } from "../../../components/FabActionSheets";
import { QuickNotePad } from "../../../components/QuickNotePad";
import { DocumentEditor } from "../../../components/DocumentEditor";
import { AddButton } from "../../../components/AddButton";
import { AddToCartButton } from "../../../components/AddToCartButton";
import { ProgressBar, ProgressRing, StepsProgress } from "../../../components/Progress";
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonList, SkeletonTable } from "../../../components/Skeleton";
import { NotificationPanel, NotificationSidebar, NotificationBell, type AppNotification } from "../../../components/NotificationPanel";
import { useLongPress } from "../../../hooks/useLongPress";
import { useSwipe, type SwipeDirection } from "../../../hooks/useSwipe";
import { Button } from "../../../components/Button";
import { Section, Card, Row } from "../chrome/Section";

const CRUMBS: Crumb[] = [
  { label: "Inicio", href: "#" },
  { label: "Proyectos", href: "#" },
  { label: "Scaffold", href: "#" },
  { label: "Componentes", href: "#" },
  { label: "Button" },
];

const CARD: CreditCardData = {
  number: "4532 1188 0343 6467",
  holder: "Emanuel Dev",
  expiry: "08/29",
  cvc: "123",
  brand: "visa",
};

const CARDS = [
  { id: "a", data: CARD },
  {
    id: "b",
    data: {
      number: "5425 2334 3010 9903",
      holder: "Emanuel Dev",
      expiry: "11/27",
      cvc: "456",
      brand: "mastercard",
    } satisfies CreditCardData,
  },
];

function BreadcrumbsSection() {
  return (
    <Section id="breadcrumbs" title="Breadcrumbs" description="Colapsa automáticamente cuando hay demasiados niveles.">
      <Card>
        <Breadcrumbs items={CRUMBS} maxItems={4} />
      </Card>
    </Section>
  );
}

function FlipCardSection() {
  return (
    <Section id="flipcard" title="FlipCard" description="Contenedor 3D de dos caras · CreditCard y CreditCardStack listos para usar.">
      <div className="grid sm:grid-cols-2 gap-4">
        <Card title="CreditCard">
          <div className="w-56">
            <CreditCard data={CARD} theme="dark" masked />
          </div>
        </Card>
        <Card title="CreditCardStack">
          <div className="w-56 h-36">
            <CreditCardStack cards={CARDS} />
          </div>
        </Card>
      </div>
    </Section>
  );
}

function FloatingButtonSection() {
  return (
    <Section id="floatingbutton" title="FloatingButton" description="Se esconde al scrollear · speed dial con acciones secundarias.">
      <Card>
        <div className="relative h-40 rounded-xl border border-dashed border-border overflow-hidden">
          <FloatingButton
            icon={<span>＋</span>}
            label="Nuevo"
            absolute
            hideOnScroll={false}
            actions={[
              { icon: <span>📄</span>, label: "Documento", onClick: () => {} },
              { icon: <span>📁</span>, label: "Carpeta", onClick: () => {} },
            ]}
          />
        </div>
      </Card>
    </Section>
  );
}

function FabActionSheetsSection() {
  return (
    <Section
      id="fabactionsheets"
      title="FabActionSheets"
      description="FAB con speed dial donde cada acción abre su propio BottomSheet con contenido libre. Compone FloatingButton + BottomSheet."
    >
      <Card>
        <div className="relative h-40 rounded-xl border border-dashed border-border overflow-hidden">
          <FabActionSheets
            absolute
            hideOnScroll={false}
            mainIcon={<span>＋</span>}
            mainLabel="Crear"
            actions={[
              {
                icon: <span>💸</span>,
                label: "Nuevo gasto",
                sheetDescription: "Cargá el importe y la categoría.",
                content: <p className="text-sm text-muted">Acá iría tu formulario de gasto.</p>,
              },
              {
                icon: <span>🔍</span>,
                label: "Filtros",
                tone: "accent",
                sheetSnapPoints: [0.4, 0.85],
                content: <p className="text-sm text-muted">Sheet con snap points arrastrables.</p>,
              },
            ]}
          />
        </div>
        <p className="mt-3 text-xs text-muted">
          Ojo: monta todos los sheets a la vez (sólo uno abierto), así que el `content` se renderiza desde el arranque.
        </p>
      </Card>
    </Section>
  );
}

function QuickNotePadSection() {
  const [guardada, setGuardada] = useState<string | null>(null);
  return (
    <Section
      id="quicknotepad"
      title="QuickNotePad"
      description="FAB que abre un bloc de notas en un BottomSheet: viñetas y numeración con continuación automática al presionar Enter, y selector de emojis."
    >
      <Card>
        <div className="relative h-40 rounded-xl border border-dashed border-border overflow-hidden">
          <QuickNotePad absolute onSave={setGuardada} />
        </div>
        {guardada && (
          <pre className="mt-3 rounded-xl bg-surface-alt/60 p-3 text-xs text-foreground whitespace-pre-wrap">{guardada}</pre>
        )}
      </Card>
    </Section>
  );
}

function DocumentEditorSection() {
  const [markdown, setMarkdown] = useState("");
  return (
    <Section
      id="documenteditor"
      title="DocumentEditor"
      description="Escritor de documentos con formato tradicional (WYSIWYG) o Markdown sobre la misma fuente. Acá montado con variant=embed; en producción es fullscreen."
    >
      <Card>
        <div className="relative h-[560px] rounded-xl border border-border overflow-hidden">
          <DocumentEditor
            variant="embed"
            defaultTitle="Notas de la reunión"
            defaultValue={"# Kickoff del proyecto\n\nAcuerdos de la primera reunión:\n\n- Definir el alcance de la **fase 1**\n- Armar el backlog inicial\n\n> Próxima revisión: en dos semanas.\n"}
            onChange={setMarkdown}
            onSave={async () => {}}
          />
        </div>
        <p className="mt-3 text-xs text-muted">
          `onChange` siempre entrega Markdown ({markdown.length} caracteres), incluso editando en modo tradicional — y esa
          conversión es con pérdida fuera del subset soportado.
        </p>
      </Card>
    </Section>
  );
}

function AddButtonSection() {
  const [qtyAsync, setQtyAsync] = useState(5);
  const [qtySm, setQtySm] = useState(1);
  const [qtyMd, setQtyMd] = useState(1);
  const [qtyLg, setQtyLg] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <Section id="addbutton" title="AddButton" description="Loading independiente en + y − · AddToCartButton estilo 'agregar al carrito'.">
      <div className="grid sm:grid-cols-2 gap-4">
        <Card title="Con carga en el servidor">
          <p className="text-sm text-muted mb-4 leading-relaxed">
            Cada toque espera 900&nbsp;ms. Fijate que el spinner aparece <strong>sólo en el botón que tocaste</strong>.
          </p>
          <AddButton
            value={qtyAsync}
            onChange={async (next) => {
              await new Promise((r) => setTimeout(r, 900));
              setQtyAsync(next);
            }}
            min={0}
            max={20}
            unit="u."
          />
        </Card>
        <Card title="Variantes y tamaños">
          <div className="flex flex-col gap-3">
            <AddButton value={qtySm} onChange={setQtySm} size="sm" variant="solid" />
            <AddButton value={qtyMd} onChange={setQtyMd} size="md" variant="outline" unit="kg" />
            <AddButton value={qtyLg} onChange={setQtyLg} size="lg" variant="pill" />
          </div>
        </Card>
      </div>
      <Card title="AddToCartButton" className="mt-4">
        <AddToCartButton
          onAdd={async () => {
            setAdded(false);
            await new Promise((r) => setTimeout(r, 800));
            setAdded(true);
          }}
          label={added ? "Agregado" : "Agregar al carrito"}
        />
      </Card>
    </Section>
  );
}

function ProgressSection() {
  const [step, setStep] = useState(1);
  return (
    <Section id="progress" title="Progress" description="Barra continua/segmentada/rayada, anillo circular y progreso por pasos.">
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Bar & Ring">
          <div className="flex flex-col gap-5">
            <ProgressBar value={64} showValue label="Subiendo…" />
            <ProgressBar striped label="Procesando" />
            <div className="flex gap-3">
              <ProgressRing value={64} />
              <ProgressRing />
            </div>
          </div>
        </Card>
        <Card title="Steps">
          <div className="flex flex-col gap-4">
            <StepsProgress steps={["Datos", "Pago", "Confirmación"]} current={step} />
            <div className="flex gap-3 text-xs">
              <button className="underline" onClick={() => setStep((s) => Math.max(0, s - 1))}>
                Anterior
              </button>
              <button className="underline" onClick={() => setStep((s) => Math.min(2, s + 1))}>
                Siguiente
              </button>
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}

function SkeletonSection() {
  const [loading, setLoading] = useState(true);
  return (
    <Section id="skeleton" title="Skeleton" description="Placeholders animados (pulse / wave) para texto, avatar, tarjeta, lista y tabla.">
      <div className="mb-4">
        <button
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:bg-surface-alt transition-colors"
          onClick={() => setLoading((v) => !v)}
        >
          {loading ? "Mostrar contenido real" : "Simular carga"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="SkeletonCard">
          {loading ? (
            <SkeletonCard media mediaHeight={120} avatar lines={2} />
          ) : (
            <div className="rounded-2xl border border-border p-4">
              <div className="h-[120px] rounded-xl bg-primary/15 mb-4 grid place-items-center text-2xl">🖼️</div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 grid place-items-center text-sm shrink-0">EC</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm mb-1">Nuevo lanzamiento</p>
                  <p className="text-sm text-muted leading-relaxed">
                    El contenido real reemplaza al skeleton una vez que termina de cargar.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card title="SkeletonList">
          {loading ? (
            <SkeletonList rows={4} avatar lines={2} />
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {["Ana", "Bruno", "Caro", "Dani"].map((name) => (
                <div key={name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="w-9 h-9 rounded-full bg-accent/20 grid place-items-center text-xs shrink-0">
                    {name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-xs text-muted truncate">Comentó en tu publicación</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="SkeletonTable">
          {loading ? (
            <SkeletonTable rows={4} columns={3} />
          ) : (
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(3, minmax(0,1fr))" }}>
              {["Nombre", "Plan", "Estado"].map((h) => (
                <p key={h} className="text-xs font-semibold text-muted">{h}</p>
              ))}
              {[
                ["Ana", "Pro", "Activo"],
                ["Bruno", "Free", "Activo"],
                ["Caro", "Pro", "Pausado"],
                ["Dani", "Team", "Activo"],
              ].flatMap((row, i) =>
                row.map((cell, j) => (
                  <p key={`${i}-${j}`} className="text-sm">{cell}</p>
                ))
              )}
            </div>
          )}
        </Card>

        <Card title="Primitivo · formas y animación">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Skeleton variant="circle" width={36} height={36} />
              <Skeleton variant="text" width="55%" />
              <Skeleton variant="rounded" width={56} height={24} />
            </div>
            <SkeletonText lines={3} />
            <div className="flex items-center gap-3">
              <SkeletonAvatar size={28} animation="wave" />
              <Skeleton variant="rect" width="100%" height={16} animation="wave" />
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: "1",
    title: "Lucía comentó tu publicación",
    description: "«Me encanta cómo quedó el balcón»",
    date: Date.now() - 5 * 60_000,
    tone: "info",
    action: { label: "Responder", onClick: () => {} },
  },
  {
    id: "2",
    title: "Pago confirmado",
    description: "Tu pedido #A-1042 fue acreditado.",
    date: Date.now() - 3 * 3600_000,
    tone: "success",
  },
  {
    id: "3",
    title: "No pudimos procesar tu tarjeta",
    date: Date.now() - 26 * 3600_000,
    tone: "danger",
    read: true,
  },
  {
    id: "4",
    title: "Nueva versión disponible",
    description: "Actualizá para ver las últimas novedades.",
    date: Date.now() - 5 * 86400_000,
    tone: "neutral",
    read: true,
  },
];

function NotificationPanelSection() {
  const [items, setItems] = useState<AppNotification[]>(SEED_NOTIFICATIONS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarSide, setSidebarSide] = useState<"left" | "right">("right");

  const read = (id: string) => setItems((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const readAll = () => setItems((l) => l.map((n) => ({ ...n, read: true })));
  const dismiss = (id: string) => setItems((l) => l.filter((n) => n.id !== id));

  return (
    <Section
      id="notificationpanel"
      title="NotificationPanel"
      description="Historial agrupado por fecha (Hoy / Ayer / Esta semana / Anteriores), con filtro, marcar todo como leído y descartar. NotificationBell es el mismo panel dentro de una campana con popover; NotificationSidebar es el mismo panel como drawer de altura completa con backdrop."
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="NotificationPanel">
          <NotificationPanel
            items={items}
            onRead={read}
            onReadAll={readAll}
            onDismiss={dismiss}
            onClear={() => setItems([])}
          />
        </Card>
        <div className="flex flex-col gap-4">
          <Card title="NotificationBell">
            <p className="text-xs text-muted mb-4">Campana con badge de no leídas — abre el mismo panel en un popover anclado.</p>
            <NotificationBell items={items} onRead={read} onReadAll={readAll} />
          </Card>
          <Card title="NotificationSidebar">
            <p className="text-xs text-muted mb-4">
              Drawer de altura completa con backdrop, para un centro de notificaciones dedicado en vez de un popover chico.
              Cierra con Escape, con el backdrop o con la ×.
            </p>
            <Row>
              <Button size="sm" onClick={() => { setSidebarSide("right"); setSidebarOpen(true); }}>
                Abrir desde la derecha
              </Button>
              <Button size="sm" variant="secondary" onClick={() => { setSidebarSide("left"); setSidebarOpen(true); }}>
                Desde la izquierda
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setItems(SEED_NOTIFICATIONS)}>
                Reiniciar
              </Button>
            </Row>
          </Card>
        </div>
      </div>

      <NotificationSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        side={sidebarSide}
        items={items}
        onRead={read}
        onReadAll={readAll}
        onDismiss={dismiss}
        onClear={() => setItems([])}
      />
    </Section>
  );
}

function GestosSection() {
  const [pressed, setPressed] = useState(0);
  const [lastSwipe, setLastSwipe] = useState<SwipeDirection | null>(null);
  const longPress = useLongPress(() => setPressed((n) => n + 1));
  const swipe = useSwipe({ onSwipe: setLastSwipe });

  return (
    <Section
      id="gestos"
      title="Gestos — useLongPress · useSwipe"
      description="Devuelven props de puntero listos para pegar en cualquier elemento: mantener presionado (cancela si el dedo se mueve) y swipe en las 4 direcciones (distingue el eje dominante)."
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="useLongPress">
          <div
            {...longPress}
            className="h-24 rounded-xl border-2 border-dashed border-border grid place-items-center text-sm text-muted select-none cursor-pointer"
          >
            Mantené presionado…
          </div>
          <p className="mt-3 text-xs text-muted">Disparado {pressed} {pressed === 1 ? "vez" : "veces"}.</p>
        </Card>
        <Card title="useSwipe">
          <div
            {...swipe}
            className="h-24 rounded-xl border-2 border-dashed border-border grid place-items-center text-sm text-muted select-none touch-none"
          >
            Arrastrá en cualquier dirección…
          </div>
          <p className="mt-3 text-xs text-muted">Último swipe: {lastSwipe ?? "ninguno todavía"}.</p>
        </Card>
      </div>
    </Section>
  );
}

export function InteractionGroup() {
  return (
    <>
      <BreadcrumbsSection />
      <FlipCardSection />
      <FloatingButtonSection />
      <FabActionSheetsSection />
      <QuickNotePadSection />
      <DocumentEditorSection />
      <AddButtonSection />
      <ProgressSection />
      <SkeletonSection />
      <NotificationPanelSection />
      <GestosSection />
    </>
  );
}
