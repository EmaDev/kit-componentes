import { useState } from "react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { Select, type SelectOption } from "../../../components/Select";
import { Dropdown, type DropdownItem } from "../../../components/Dropdown";
import { Checkbox, CheckboxGroup } from "../../../components/Checkbox";
import { Card, Row } from "./Layout";

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

export function FormsSection() {
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("ar");
  const [agree, setAgree] = useState(false);
  const [topics, setTopics] = useState<string[]>(["news"]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card title="Button">
        <Row>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
        </Row>
        <Row className="mt-3">
          <Button
            loading={loading}
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 1500);
            }}
          >
            {loading ? "Guardando…" : "Simular loading"}
          </Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </Row>
      </Card>

      <Card title="Input / Textarea">
        <div className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={email && !email.includes("@") ? "Email inválido" : undefined}
          />
          <Textarea
            label="Bio"
            hint="Máximo 200 caracteres"
            maxLength={200}
            showCount
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
      </Card>

      <Card title="Select / Dropdown">
        <div className="flex flex-col gap-4">
          <Select label="País" options={COUNTRIES} value={country} onChange={setCountry} />
          <Dropdown trigger={<Button variant="secondary">Acciones ⌄</Button>} items={MENU_ITEMS} />
        </div>
      </Card>

      <Card title="Checkbox / CheckboxGroup">
        <div className="flex flex-col gap-4">
          <Checkbox
            checked={agree}
            onChange={setAgree}
            label="Acepto los términos"
            description="Leí y acepto los términos y condiciones."
          />
          <CheckboxGroup
            label="Notificaciones"
            selectAllLabel="Todas"
            options={TOPICS}
            value={topics}
            onChange={setTopics}
          />
        </div>
      </Card>
    </div>
  );
}
