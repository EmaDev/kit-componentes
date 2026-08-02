import { useState } from "react";
import { KpiCard } from "../../../components/KpiCard";
import { WalletBalanceCard, type WalletBalance } from "../../../components/WalletBalanceCard";
import { CurrencySelector, type CurrencyOption } from "../../../components/CurrencySelector";
import { RateComparator, type RateQuote } from "../../../components/RateComparator";
import { ValueHistoryChart, type ValueHistoryPeriod } from "../../../components/ValueHistoryChart";
import { JsonChartViewer } from "../../../components/JsonChartViewer";
import { TransactionList, type Transaction } from "../../../components/TransactionList";
import { SendMoneyFlow, type Contact } from "../../../components/SendMoneyFlow";
import { PaymentQrCard } from "../../../components/PaymentQrCard";
import { BillSplitter, type SplitParticipant } from "../../../components/BillSplitter";
import { BudgetCategoryProgress, type BudgetCategory } from "../../../components/BudgetCategoryProgress";
import { PaymentMethodPicker, type SavedCard } from "../../../components/PaymentMethodPicker";
import { Section, Card } from "../chrome/Section";

export function KpiCardSection() {
  return (
    <Section id="kpicard" title="KpiCard" description="Tarjeta de KPI con sparkline y variación, para dashboards.">
      <div className="grid sm:grid-cols-3 gap-4">
        <KpiCard label="MRR" value="$48.2k" delta={{ value: "+12,4%", direction: "up" }} trend={[8, 10, 9, 13, 15, 14, 18]} />
        <KpiCard label="Churn" value="2,3%" delta={{ value: "-0,8pp", direction: "down" }} tone="danger" trend={[3.4, 3, 2.8, 2.5, 2.6, 2.3]} />
        <KpiCard label="Usuarios activos" value="9.481" trend={[5, 6, 6, 7, 8, 7, 9]} tone="success" />
      </div>
    </Section>
  );
}

const BALANCES: WalletBalance[] = [
  { code: "ARS", symbol: "$", amount: 248320, flag: "🇦🇷" },
  { code: "USD", symbol: "US$", amount: 340, flag: "🇺🇸" },
];

export function WalletBalanceCardSection() {
  return (
    <Section id="walletbalancecard" title="WalletBalanceCard" description="Saldo multi-moneda con acciones enviar/recibir/convertir.">
      <Card>
        <div className="max-w-sm">
          <WalletBalanceCard balances={BALANCES} primaryCode="ARS" onSend={() => {}} onReceive={() => {}} onConvert={() => {}} />
        </div>
      </Card>
    </Section>
  );
}

const CURRENCIES: CurrencyOption[] = [
  { code: "ARS", name: "Peso argentino", flag: "🇦🇷" },
  { code: "USD", name: "Dólar estadounidense", flag: "🇺🇸", rate: 1050 },
  { code: "EUR", name: "Euro", flag: "🇪🇺", rate: 1140 },
];

export function CurrencySelectorSection() {
  const [code, setCode] = useState("USD");
  return (
    <Section id="currencyselector" title="CurrencySelector" description="Selector de moneda con tasa de cambio.">
      <Card>
        <div className="max-w-xs">
          <CurrencySelector options={CURRENCIES} value={code} onChange={setCode} baseCode="ARS" />
        </div>
      </Card>
    </Section>
  );
}

const QUOTES: RateQuote[] = [
  { provider: "Banco Nación", rate: 1045, fee: 0 },
  { provider: "Wise", rate: 1052, fee: 800, best: true },
  { provider: "Cambio Palermo", rate: 1048, fee: 200 },
];

export function RateComparatorSection() {
  return (
    <Section id="ratecomparator" title="RateComparator" description="Comparador de cotizaciones entre proveedores.">
      <Card>
        <RateComparator from="USD" to="ARS" amount={100} quotes={QUOTES} onSelect={() => {}} />
      </Card>
    </Section>
  );
}

const baseDate = new Date();
const points = (n: number, start: number) =>
  Array.from({ length: n }, (_, i) => ({
    date: new Date(baseDate.getTime() - (n - i) * 86400000),
    value: start + Math.round(Math.sin(i / 2) * 40 + i * 6),
  }));

const HISTORY_PERIODS: ValueHistoryPeriod[] = [
  { id: "7d", label: "7D", points: points(7, 1000) },
  { id: "30d", label: "30D", points: points(30, 800) },
];

export function ValueHistoryChartSection() {
  return (
    <Section id="valuehistorychart" title="ValueHistoryChart" description="Gráfico de evolución de un valor por período.">
      <Card>
        <ValueHistoryChart periods={HISTORY_PERIODS} currency="USD" />
      </Card>
    </Section>
  );
}

export function JsonChartViewerSection() {
  return (
    <Section id="jsonchartviewer" title="JsonChartViewer" description="Visor de datos JSON como tabla, gráfico o árbol.">
      <Card>
        <JsonChartViewer />
      </Card>
    </Section>
  );
}

const TRANSACTIONS: Transaction[] = [
  { id: "1", date: new Date(), title: "Supermercado", category: "Comida", amount: -12500 },
  { id: "2", date: new Date(), title: "Sueldo", category: "Ingresos", amount: 850000 },
  { id: "3", date: new Date(baseDate.getTime() - 86400000), title: "Netflix", category: "Suscripciones", amount: -3200 },
];

export function TransactionListSection() {
  return (
    <Section id="transactionlist" title="TransactionList" description="Lista de transacciones agrupadas por categoría.">
      <Card>
        <TransactionList transactions={TRANSACTIONS} currency="ARS" />
      </Card>
    </Section>
  );
}

const CONTACTS: Contact[] = [
  { id: "1", name: "Lucía Marín", handle: "@lucia" },
  { id: "2", name: "Martín Paz", handle: "@martinp" },
];

export function SendMoneyFlowSection() {
  return (
    <Section id="sendmoneyflow" title="SendMoneyFlow" description="Flujo de envío de dinero a un contacto: elegir destinatario, monto, nota y confirmar.">
      <Card>
        <div className="max-w-sm">
          <SendMoneyFlow contacts={CONTACTS} balance={248320} currency="ARS" onSend={async () => {}} />
        </div>
      </Card>
    </Section>
  );
}

export function PaymentQrCardSection() {
  return (
    <Section id="paymentqrcard" title="PaymentQrCard" description="Tarjeta de cobro con QR y monto editable.">
      <Card>
        <div className="max-w-xs mx-auto">
          <PaymentQrCard name="Lucía Marín" handle="@lucia" qrValue="lucia.marin@wallet" onAmountChange={() => {}} onShare={() => {}} />
        </div>
      </Card>
    </Section>
  );
}

const PARTICIPANTS: SplitParticipant[] = [
  { id: "1", name: "Ana" },
  { id: "2", name: "Bruno" },
  { id: "3", name: "Vos" },
];

export function BillSplitterSection() {
  return (
    <Section id="billsplitter" title="BillSplitter" description="Divisor de cuenta entre participantes, en partes iguales o montos custom.">
      <Card>
        <BillSplitter total={45000} participants={PARTICIPANTS} currency="ARS" onConfirm={() => {}} />
      </Card>
    </Section>
  );
}

const BUDGET_CATEGORIES: BudgetCategory[] = [
  { id: "comida", label: "Comida", spent: 32000, limit: 40000 },
  { id: "transporte", label: "Transporte", spent: 18500, limit: 15000 },
  { id: "ocio", label: "Ocio", spent: 6000, limit: 20000 },
];

export function BudgetCategoryProgressSection() {
  return (
    <Section id="budgetcategoryprogress" title="BudgetCategoryProgress" description="Progreso de gasto por categoría de presupuesto.">
      <Card>
        <BudgetCategoryProgress categories={BUDGET_CATEGORIES} currency="ARS" />
      </Card>
    </Section>
  );
}

const CARDS: SavedCard[] = [
  { id: "1", brand: "visa", last4: "4242", expiry: "08/28" },
  { id: "2", brand: "mastercard", last4: "9981", expiry: "02/27" },
];

export function PaymentMethodPickerSection() {
  const [cardId, setCardId] = useState("1");
  return (
    <Section id="paymentmethodpicker" title="PaymentMethodPicker" description="Selector de tarjetas guardadas + alta de tarjeta nueva.">
      <Card>
        <div className="max-w-sm">
          <PaymentMethodPicker cards={CARDS} value={cardId} onChange={setCardId} onAddCard={async () => {}} />
        </div>
      </Card>
    </Section>
  );
}

