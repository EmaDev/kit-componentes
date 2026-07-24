import { useState } from "react";
import { Breadcrumbs, type Crumb } from "../../../components/Breadcrumbs";
import { CreditCard, CreditCardStack, type CreditCardData } from "../../../components/FlipCard";
import { FloatingButton } from "../../../components/FloatingButton";
import { Stepper, AddButton } from "../../../components/Stepper";
import { ProgressBar, ProgressRing, StepsProgress } from "../../../components/Progress";
import { Card, Row } from "./Layout";

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

export function InteractionSection() {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [step, setStep] = useState(1);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card title="Breadcrumbs">
        <Breadcrumbs items={CRUMBS} maxItems={4} />
      </Card>

      <Card title="FlipCard / CreditCard">
        <Row>
          <div className="w-56">
            <CreditCard data={CARD} theme="dark" masked />
          </div>
          <div className="w-56 h-36">
            <CreditCardStack cards={CARDS} />
          </div>
        </Row>
      </Card>

      <Card title="Stepper / AddButton">
        <div className="flex flex-col gap-4">
          <Stepper value={qty} onChange={setQty} min={0} max={10} unit="u." />
          <AddButton
            onAdd={async () => {
              setAdded(false);
              await new Promise((r) => setTimeout(r, 800));
              setAdded(true);
            }}
            label={added ? "Agregado" : "Agregar al carrito"}
          />
        </div>
      </Card>

      <Card title="Progress">
        <div className="flex flex-col gap-5">
          <ProgressBar value={64} showValue label="Subiendo…" />
          <ProgressBar striped label="Procesando" />
          <Row>
            <ProgressRing value={64} />
            <ProgressRing />
          </Row>
          <StepsProgress steps={["Datos", "Pago", "Confirmación"]} current={step} />
          <Row>
            <button className="text-xs underline" onClick={() => setStep((s) => Math.max(0, s - 1))}>
              Anterior
            </button>
            <button className="text-xs underline" onClick={() => setStep((s) => Math.min(2, s + 1))}>
              Siguiente
            </button>
          </Row>
        </div>
      </Card>

      <Card title="FloatingButton">
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
    </div>
  );
}
