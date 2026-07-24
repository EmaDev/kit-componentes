import { useState } from "react";
import { Breadcrumbs, type Crumb } from "../../../components/Breadcrumbs";
import { CreditCard, CreditCardStack, type CreditCardData } from "../../../components/FlipCard";
import { FloatingButton } from "../../../components/FloatingButton";
import { Stepper, AddButton } from "../../../components/Stepper";
import { ProgressBar, ProgressRing, StepsProgress } from "../../../components/Progress";
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
        <div className="relative h-40 rounded-xl border border-dashed border-border">
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

function StepperSection() {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  return (
    <Section id="stepper" title="Stepper" description="Loading independiente en + y − · AddButton estilo 'agregar al carrito'.">
      <div className="grid sm:grid-cols-2 gap-4">
        <Card title="Cantidad">
          <Stepper value={qty} onChange={setQty} min={0} max={10} unit="u." />
        </Card>
        <Card title="AddButton">
          <AddButton
            onAdd={async () => {
              setAdded(false);
              await new Promise((r) => setTimeout(r, 800));
              setAdded(true);
            }}
            label={added ? "Agregado" : "Agregar al carrito"}
          />
        </Card>
      </div>
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

export function InteractionGroup() {
  return (
    <>
      <BreadcrumbsSection />
      <FlipCardSection />
      <FloatingButtonSection />
      <StepperSection />
      <ProgressSection />
    </>
  );
}
