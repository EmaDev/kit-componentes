import { useMemo, useState } from "react";
import { SearchFilters, type FilterGroup, type SearchResult } from "../../../components/SearchFilters";
import { ProductFilterBar, type ProductFilterGroup, type ProductFilterValue, type SortField } from "../../../components/ProductFilterBar";
import { BookingCalendar, type BookingDay } from "../../../components/BookingCalendar";
import { ProfileEditor, type ProfileFields } from "../../../components/ProfileEditor";
import { LanguagePicker, type LanguageOption } from "../../../components/LanguagePicker";
import { DateRangePicker, type DateRange } from "../../../components/DateRangePicker";
import { TagInput } from "../../../components/TagInput";
import { CollapsibleFormSections, type FormSection } from "../../../components/CollapsibleFormSections";
import { DualRangeSlider } from "../../../components/DualRangeSlider";
import { ColorPicker } from "../../../components/ColorPicker";
import { RichTextEditor } from "../../../components/RichTextEditor";
import { BeforeAfterSlider } from "../../../components/BeforeAfterSlider";
import { StarRatingWidget } from "../../../components/StarRatingWidget";
import { OnboardingWizard, type WizardStep } from "../../../components/OnboardingWizard";
import { UnitConverter, type UnitGroup } from "../../../components/UnitConverter";
import { Input } from "../../../components/Input";
import { Section, Card } from "../chrome/Section";

const FILTER_GROUPS: FilterGroup[] = [
  { id: "categoria", label: "Categoría", options: [{ id: "ropa", label: "Ropa" }, { id: "hogar", label: "Hogar" }], multi: true },
  { id: "envio", label: "Envío", options: [{ id: "gratis", label: "Gratis" }] },
];
const RESULTS: SearchResult[] = [
  { id: "1", group: "ropa", title: "Campera de jean", subtitle: "$18.400" },
  { id: "2", group: "hogar", title: "Set de sábanas", subtitle: "$9.200" },
];

export function SearchFiltersSection() {
  return (
    <Section id="searchfilters" title="SearchFilters" description="Filtros de búsqueda agrupados (multi-selección) + resultados en vivo.">
      <Card>
        <SearchFilters filters={FILTER_GROUPS} results={RESULTS} />
      </Card>
    </Section>
  );
}

const PRODUCT_SORT_FIELDS: SortField[] = [
  { id: "relevancia", label: "Más relevantes" },
  { id: "precio", label: "Precio" },
  { id: "ventas", label: "Más vendidos" },
];
const PRODUCT_GROUPS: ProductFilterGroup[] = [
  { id: "categoria", label: "Categoría", options: [
    { id: "ropa", label: "Ropa", count: 3 }, { id: "calzado", label: "Calzado", count: 2 }, { id: "hogar", label: "Hogar", count: 1 },
  ] },
  { id: "marca", label: "Marca", options: [{ id: "nike", label: "Nike", count: 2 }, { id: "adidas", label: "Adidas", count: 2 }] },
  { id: "estado", label: "Estado", multi: false, options: [{ id: "nuevo", label: "Nuevo" }, { id: "usado", label: "Usado" }] },
];
const PRODUCTS = [
  { id: "1", title: "Campera de jean", precio: 18400, categoria: "ropa", marca: "nike", ventas: 120 },
  { id: "2", title: "Zapatillas urbanas", precio: 54000, categoria: "calzado", marca: "adidas", ventas: 340 },
  { id: "3", title: "Set de sábanas", precio: 9200, categoria: "hogar", marca: "adidas", ventas: 45 },
  { id: "4", title: "Remera básica", precio: 6800, categoria: "ropa", marca: "nike", ventas: 210 },
  { id: "5", title: "Zapatillas running", precio: 62000, categoria: "calzado", marca: "nike", ventas: 90 },
  { id: "6", title: "Buzo canguro", precio: 21500, categoria: "ropa", marca: "adidas", ventas: 175 },
];

export function ProductFilterBarSection() {
  const [filters, setFilters] = useState<ProductFilterValue>({ sortField: "relevancia" });

  const productos = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (filters.price && (p.precio < filters.price[0] || p.precio > filters.price[1])) return false;
      const categorias = filters.groups?.categoria ?? [];
      if (categorias.length && !categorias.includes(p.categoria)) return false;
      const marcas = filters.groups?.marca ?? [];
      if (marcas.length && !marcas.includes(p.marca)) return false;
      return true;
    });
    if (filters.sortField === "precio" || filters.sortField === "ventas") {
      const key = filters.sortField;
      list = [...list].sort((a, b) => (filters.sortDirection === "asc" ? a[key] - b[key] : b[key] - a[key]));
    }
    return list;
  }, [filters]);

  return (
    <Section id="productfilterbar" title="ProductFilterBar" description="Orden (asc/desc) + filtros de faceta + rango de precio — la cabecera típica de un listado de productos.">
      <Card>
        <ProductFilterBar
          value={filters}
          onChange={setFilters}
          resultCount={productos.length}
          sortFields={PRODUCT_SORT_FIELDS}
          price={{ min: 0, max: 70000, step: 1000, format: (n) => `$${n.toLocaleString("es-AR")}` }}
          groups={PRODUCT_GROUPS}
        />
        <ul className="mt-4 divide-y divide-border">
          {productos.map((p) => (
            <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
              <span className="font-medium text-foreground">{p.title}</span>
              <span className="text-muted tabular-nums">${p.precio.toLocaleString("es-AR")}</span>
            </li>
          ))}
          {productos.length === 0 && <li className="py-8 text-center text-sm text-muted">Sin resultados con esos filtros.</li>}
        </ul>
      </Card>
    </Section>
  );
}

const BOOKING_DAYS: BookingDay[] = Array.from({ length: 3 }, (_, i) => ({
  date: new Date(Date.now() + i * 86400000),
  slots: [
    { time: "09:00", available: true }, { time: "10:00", available: false },
    { time: "11:00", available: true }, { time: "15:00", available: true },
  ],
}));

export function BookingCalendarSection() {
  const [value, setValue] = useState<{ date: Date; time: string } | null>(null);
  return (
    <Section id="bookingcalendar" title="BookingCalendar" description="Calendario de reservas: tira de días + horarios disponibles.">
      <Card>
        <BookingCalendar days={BOOKING_DAYS} value={value} onChange={setValue} onConfirm={() => {}} />
      </Card>
    </Section>
  );
}

export function ProfileEditorSection() {
  const [profile, setProfile] = useState<ProfileFields>({ avatar: null, name: "Lucía Marín", email: "lucia@mail.com", phone: "", bio: "Product designer." });
  return (
    <Section id="profileeditor" title="ProfileEditor" description="Editor de perfil: avatar, datos de contacto y bio.">
      <Card>
        <div className="max-w-md">
          <ProfileEditor value={profile} onSave={async (v) => setProfile(v)} />
        </div>
      </Card>
    </Section>
  );
}

const LANGUAGES: LanguageOption[] = [
  { code: "es-AR", label: "Español", region: "Argentina", flag: "🇦🇷" },
  { code: "en-US", label: "English", region: "United States", flag: "🇺🇸" },
  { code: "pt-BR", label: "Português", region: "Brasil", flag: "🇧🇷" },
];

export function LanguagePickerSection() {
  const [lang, setLang] = useState("es-AR");
  return (
    <Section id="languagepicker" title="LanguagePicker" description="Selector de idioma/región, buscable.">
      <Card>
        <div className="max-w-xs">
          <LanguagePicker options={LANGUAGES} value={lang} onChange={setLang} />
        </div>
      </Card>
    </Section>
  );
}

export function DateRangePickerSection() {
  const [range, setRange] = useState<DateRange>({ from: new Date(), to: null });
  return (
    <Section id="daterangepicker" title="DateRangePicker" description="Selector de rango de fechas con presets.">
      <Card>
        <DateRangePicker value={range} onChange={setRange} presets={[{ label: "Próximos 7 días", range: () => ({ from: new Date(), to: new Date(Date.now() + 7 * 86400000) }) }]} />
      </Card>
    </Section>
  );
}

export function TagInputSection() {
  const [tags, setTags] = useState(["react", "next.js"]);
  return (
    <Section id="taginput" title="TagInput" description="Input de etiquetas con sugerencias.">
      <Card>
        <div className="max-w-md">
          <TagInput value={tags} onChange={setTags} suggestions={["react", "vue", "svelte", "tailwind", "next.js"]} maxTags={6} />
        </div>
      </Card>
    </Section>
  );
}

const FORM_SECTIONS: FormSection[] = [
  { id: "envio", title: "Envío", description: "Dirección de entrega", content: <Input label="Dirección" placeholder="Calle y número" />, defaultOpen: true },
  { id: "pago", title: "Pago", description: "Método de pago", content: <Input label="Número de tarjeta" placeholder="**** **** **** ****" /> },
];

export function CollapsibleFormSectionsSection() {
  return (
    <Section id="collapsibleformsections" title="CollapsibleFormSections" description="Formulario largo dividido en secciones colapsables.">
      <Card>
        <CollapsibleFormSections sections={FORM_SECTIONS} />
      </Card>
    </Section>
  );
}

export function DualRangeSliderSection() {
  const [range, setRange] = useState<[number, number]>([200, 800]);
  return (
    <Section id="dualrangeslider" title="DualRangeSlider" description="Slider de rango doble (mínimo–máximo), ej. filtro de precio.">
      <Card>
        <DualRangeSlider min={0} max={1000} step={10} value={range} onChange={setRange} format={(n) => `$${n}`} />
      </Card>
    </Section>
  );
}

export function ColorPickerSection() {
  const [color, setColor] = useState("#2563eb");
  return (
    <Section id="colorpicker" title="ColorPicker" description="Selector de color con paleta curada + color personalizado.">
      <Card>
        <div className="max-w-xs">
          <ColorPicker value={color} onChange={setColor} />
        </div>
      </Card>
    </Section>
  );
}

export function RichTextEditorSection() {
  const [html, setHtml] = useState("<p>Escribí <strong>algo</strong> acá…</p>");
  return (
    <Section id="richtexteditor" title="RichTextEditor" description="Editor de texto enriquecido básico (negrita, listas, links).">
      <Card>
        <RichTextEditor value={html} onChange={setHtml} />
      </Card>
    </Section>
  );
}

export function BeforeAfterSliderSection() {
  const ph = (label: string, from: string, to: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="${from}"/><text x="400" y="260" text-anchor="middle" font-family="sans-serif" font-size="36" fill="${to}">${label}</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };
  return (
    <Section id="beforeafterslider" title="BeforeAfterSlider" description="Comparador de imágenes antes/después con divisor arrastrable.">
      <Card>
        <div className="max-w-md">
          <BeforeAfterSlider before={ph("ANTES", "#334155", "#e2e8f0")} after={ph("DESPUÉS", "#2563eb", "#ffffff")} />
        </div>
      </Card>
    </Section>
  );
}

export function StarRatingWidgetSection() {
  const [rating, setRating] = useState(4);
  return (
    <Section id="starratingwidget" title="StarRatingWidget" description="Calificación por estrellas, interactiva o resumen con promedio.">
      <div className="grid sm:grid-cols-2 gap-4">
        <Card title="Interactivo">
          <StarRatingWidget value={rating} onChange={setRating} />
        </Card>
        <Card title="Resumen (solo lectura)">
          <StarRatingWidget readOnly average={4.6} count={128} distribution={[2, 4, 10, 45, 67]} />
        </Card>
      </div>
    </Section>
  );
}

const WIZARD_STEPS: WizardStep[] = [
  { id: "1", title: "Bienvenida", description: "Contanos un poco de vos", content: <p className="text-sm text-muted">Paso 1 de la configuración inicial.</p> },
  { id: "2", title: "Preferencias", description: "Opcional", content: <p className="text-sm text-muted">Paso 2, se puede saltear.</p>, optional: true },
  { id: "3", title: "Listo", content: <p className="text-sm text-muted">Todo configurado.</p> },
];

export function OnboardingWizardSection() {
  return (
    <Section id="onboardingwizard" title="OnboardingWizard" description="Wizard multi-paso con validación y pasos opcionales.">
      <Card>
        <OnboardingWizard steps={WIZARD_STEPS} onFinish={() => {}} />
      </Card>
    </Section>
  );
}

const UNIT_GROUPS: UnitGroup[] = [
  { id: "longitud", label: "Longitud", units: [{ id: "m", label: "Metros", toBase: 1 }, { id: "km", label: "Kilómetros", toBase: 1000 }, { id: "mi", label: "Millas", toBase: 1609.34 }] },
  { id: "peso", label: "Peso", units: [{ id: "kg", label: "Kilos", toBase: 1 }, { id: "lb", label: "Libras", toBase: 0.453592 }] },
];

export function UnitConverterSection() {
  return (
    <Section id="unitconverter" title="UnitConverter" description="Conversor de unidades, configurable por grupos (longitud, peso, etc.).">
      <Card>
        <div className="max-w-sm">
          <UnitConverter groups={UNIT_GROUPS} />
        </div>
      </Card>
    </Section>
  );
}

