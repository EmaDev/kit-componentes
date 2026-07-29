import { useState } from "react";
import { PricingTable, type PricingPlan } from "../../../components/PricingTable";
import { ShippingMethodPicker, type ShippingOption } from "../../../components/ShippingMethodPicker";
import { ProductComparisonTable, type ComparedProduct, type CompareSpecRow } from "../../../components/ProductComparisonTable";
import { StockLimitedStepper } from "../../../components/StockLimitedStepper";
import { ReferralProgram } from "../../../components/ReferralProgram";
import { ApprovalChecklist, type ApprovalItem } from "../../../components/ApprovalChecklist";
import { RolePermissionsTable, type Role, type PermissionRow } from "../../../components/RolePermissionsTable";
import { SecurityAlertBanner } from "../../../components/SecurityAlertBanner";
import { IdentityVerification } from "../../../components/IdentityVerification";
import { BranchSelector, type Branch } from "../../../components/BranchSelector";
import { PageStatusScreen } from "../../../components/PageStatusScreen";
import { MaintenancePage } from "../../../components/MaintenancePage";
import { Section, Card } from "../chrome/Section";

const PLANS: PricingPlan[] = [
  { id: "starter", name: "Starter", price: { monthly: 0, yearly: 0 }, features: ["1 proyecto", "Componentes atómicos"] },
  { id: "pro", name: "Pro", price: { monthly: 29, yearly: 290 }, tagline: "Para equipos de producto", highlight: true, features: ["Proyectos ilimitados", "Soporte prioritario"] },
];

function PricingTableSection() {
  return (
    <Section id="pricingtable" title="PricingTable" description="Tabla comparativa de planes, con toggle mensual/anual.">
      <Card>
        <PricingTable plans={PLANS} currency="USD" locale="en-US" onSelect={() => {}} />
      </Card>
    </Section>
  );
}

const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: "standard", label: "Estándar", price: 0, eta: "5-7 días" },
  { id: "express", label: "Express", price: 1500, eta: "24-48h" },
];

function ShippingMethodPickerSection() {
  const [shipping, setShipping] = useState("standard");
  return (
    <Section id="shippingmethodpicker" title="ShippingMethodPicker" description="Selector de método de envío con precio y ETA.">
      <Card>
        <div className="max-w-sm">
          <ShippingMethodPicker options={SHIPPING_OPTIONS} value={shipping} onChange={setShipping} currency="ARS" />
        </div>
      </Card>
    </Section>
  );
}

const PRODUCTS: ComparedProduct[] = [
  { id: "a", name: "Plan A", price: "$29" },
  { id: "b", name: "Plan B", price: "$49", highlight: true },
];
const SPECS: CompareSpecRow[] = [
  { id: "storage", label: "Almacenamiento", values: { a: "50GB", b: "200GB" } },
  { id: "support", label: "Soporte", values: { a: "Email", b: "Prioritario" } },
];

function ProductComparisonTableSection() {
  return (
    <Section id="productcomparisontable" title="ProductComparisonTable" description="Tabla comparativa de especificaciones entre productos.">
      <Card>
        <ProductComparisonTable products={PRODUCTS} specs={SPECS} onSelect={() => {}} />
      </Card>
    </Section>
  );
}

function StockLimitedStepperSection() {
  const [qty, setQty] = useState(1);
  return (
    <Section id="stocklimitedstepper" title="StockLimitedStepper" description="Stepper de cantidad limitado por el stock disponible, con aviso de stock bajo.">
      <Card>
        <StockLimitedStepper value={qty} onChange={setQty} stock={4} lowStockThreshold={5} />
      </Card>
    </Section>
  );
}

function ReferralProgramSection() {
  return (
    <Section id="referralprogram" title="ReferralProgram" description="Código propio, copiar/compartir y progreso hacia una recompensa.">
      <Card>
        <div className="max-w-md">
          <ReferralProgram code="LUCIA10" invited={12} joined={5} goal={10} reward="1 mes gratis" shareUrl="https://app.com/r/LUCIA10" onShare={() => {}} />
        </div>
      </Card>
    </Section>
  );
}

const APPROVAL_ITEMS: ApprovalItem[] = [
  { id: "1", label: "Verificar identidad", description: "Documento y selfie" },
  { id: "2", label: "Confirmar dirección de envío" },
];

function ApprovalChecklistSection() {
  return (
    <Section id="approvalchecklist" title="ApprovalChecklist" description="Checklist de aprobación/rechazo por ítem.">
      <Card>
        <ApprovalChecklist items={APPROVAL_ITEMS} onApprove={() => {}} onReject={() => {}} />
      </Card>
    </Section>
  );
}

const ROLES: Role[] = [{ id: "admin", label: "Admin" }, { id: "editor", label: "Editor" }, { id: "viewer", label: "Visor" }];
const PERMISSIONS: PermissionRow[] = [
  { id: "billing", label: "Facturación", access: { admin: true, editor: false, viewer: false } },
  { id: "content", label: "Contenido", access: { admin: true, editor: true, viewer: false } },
];

function RolePermissionsTableSection() {
  const [permissions, setPermissions] = useState(PERMISSIONS);
  return (
    <Section id="rolepermissionstable" title="RolePermissionsTable" description="Matriz de permisos por rol, editable.">
      <Card>
        <RolePermissionsTable
          roles={ROLES}
          permissions={permissions}
          onChange={(permissionId, roleId, value) =>
            setPermissions((rows) =>
              rows.map((r) => (r.id === permissionId ? { ...r, access: { ...r.access, [roleId]: value } } : r)),
            )
          }
        />
      </Card>
    </Section>
  );
}

function SecurityAlertBannerSection() {
  return (
    <Section id="securityalertbanner" title="SecurityAlertBanner" description="Banner de alerta de seguridad de cuenta (nuevo dispositivo, login sospechoso…).">
      <div className="flex flex-col gap-3">
        <SecurityAlertBanner kind="new-device" detail="Desde Córdoba, Argentina · Safari en iPhone" onReview={() => {}} />
        <SecurityAlertBanner kind="suspicious-login" detail="Intento bloqueado hace 5 minutos" onReview={() => {}} />
      </div>
    </Section>
  );
}

function IdentityVerificationSection() {
  return (
    <Section id="identityverification" title="IdentityVerification" description="Flujo KYC de 3 pasos: frente y dorso del documento, selfie y confirmación.">
      <Card>
        <div className="max-w-sm">
          <IdentityVerification onSubmit={async () => {}} />
        </div>
      </Card>
    </Section>
  );
}

const BRANCHES: Branch[] = [
  { id: "palermo", name: "Palermo", address: "Av. Santa Fe 3253", open: true, distanceKm: 1.2 },
  { id: "belgrano", name: "Belgrano", address: "Cabildo 2040", open: false, distanceKm: 4.8 },
];

function BranchSelectorSection() {
  const [branch, setBranch] = useState("palermo");
  return (
    <Section id="branchselector" title="BranchSelector" description="Selector de sucursal, con distancia y estado abierta/cerrada.">
      <Card>
        <div className="max-w-sm">
          <BranchSelector branches={BRANCHES} value={branch} onChange={setBranch} />
        </div>
      </Card>
    </Section>
  );
}

function PageStatusScreenSection() {
  return (
    <Section id="pagestatusscreen" title="PageStatusScreen" description="Pantalla de estado: 404, 403, 500 o vacío.">
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="404">
          <PageStatusScreen status="404" primary={{ label: "Volver al inicio", onClick: () => {} }} />
        </Card>
        <Card title="empty">
          <PageStatusScreen status="empty" primary={{ label: "Crear el primero", onClick: () => {} }} />
        </Card>
      </div>
    </Section>
  );
}

function MaintenancePageSection() {
  return (
    <Section id="maintenancepage" title="MaintenancePage" description="Pantalla de mantenimiento o 'próximamente'.">
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="maintenance">
          <MaintenancePage kind="maintenance" eta="Volvemos a las 14:00" />
        </Card>
        <Card title="coming-soon">
          <MaintenancePage kind="coming-soon" onNotify={async () => {}} />
        </Card>
      </div>
    </Section>
  );
}

export function TrustGroup() {
  return (
    <>
      <PricingTableSection />
      <ShippingMethodPickerSection />
      <ProductComparisonTableSection />
      <StockLimitedStepperSection />
      <ReferralProgramSection />
      <ApprovalChecklistSection />
      <RolePermissionsTableSection />
      <SecurityAlertBannerSection />
      <IdentityVerificationSection />
      <BranchSelectorSection />
      <PageStatusScreenSection />
      <MaintenancePageSection />
    </>
  );
}
