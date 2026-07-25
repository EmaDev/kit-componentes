import { useState } from "react";
import { Breadcrumbs, type Crumb } from "../../../components/Breadcrumbs";
import { CreditCard, CreditCardStack, type CreditCardData } from "../../../components/FlipCard";
import { FloatingButton } from "../../../components/FloatingButton";
import { AddButton } from "../../../components/AddButton";
import { AddToCartButton } from "../../../components/AddToCartButton";
import { ProgressBar, ProgressRing, StepsProgress } from "../../../components/Progress";
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonList, SkeletonTable } from "../../../components/Skeleton";
import { Section, Card } from "../chrome/Section";

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

export function InteractionGroup() {
  return (
    <>
      <BreadcrumbsSection />
      <FlipCardSection />
      <FloatingButtonSection />
      <AddButtonSection />
      <ProgressSection />
      <SkeletonSection />
    </>
  );
}
