import { useState } from "react";
import { DiceRoller } from "../../../components/DiceRoller";
import { RouletteWheel } from "../../../components/RouletteWheel";
import { CoinFlip } from "../../../components/CoinFlip";
import { NumberGenerator } from "../../../components/NumberGenerator";
import { RaffleDraw } from "../../../components/RaffleDraw";
import { TeamShuffler } from "../../../components/TeamShuffler";
import { TallyCounter } from "../../../components/TallyCounter";
import { Section, Card } from "../chrome/Section";

function DiceRollerSection() {
  const [ultima, setUltima] = useState<number[] | null>(null);
  return (
    <Section
      id="diceroller"
      title="DiceRoller"
      description="Cada dado es un cubo CSS 3D real de seis caras con puntos: cae exactamente en la cara sorteada. min y max acotan la cantidad de dados, no el valor de las caras."
    >
      <Card>
        <DiceRoller min={1} max={6} defaultCount={2} size={64} onRoll={setUltima} />
        {ultima && (
          <p className="mt-4 text-xs text-muted">
            `onRoll` recibió: [{ultima.join(", ")}] · total {ultima.reduce((a, b) => a + b, 0)}
          </p>
        )}
      </Card>
    </Section>
  );
}

function RouletteWheelSection() {
  const [ultimo, setUltimo] = useState<string | null>(null);
  return (
    <Section
      id="roulettewheel"
      title="RouletteWheel"
      description="Ruleta con opciones editables por el usuario: gajos de conic-gradient, puntero fijo y giro que siempre avanza hasta la opción sorteada."
    >
      <Card>
        <RouletteWheel
          defaultOptions={["Pizza", "Sushi", "Empanadas", "Hamburguesas"]}
          onResult={(option) => setUltimo(option)}
        />
        {ultimo && <p className="mt-4 text-xs text-muted">Último resultado recibido por `onResult`: <span className="font-bold text-foreground">{ultimo}</span></p>}
      </Card>
    </Section>
  );
}

function CoinFlipSection() {
  const [historial, setHistorial] = useState<string[]>([]);
  return (
    <Section id="coinflip" title="CoinFlip" description="Moneda 3D en CSS: cara o cruz al azar, con etiquetas configurables.">
      <Card>
        <CoinFlip labels={["Cara", "Cruz"]} onFlip={(r) => setHistorial((h) => [r, ...h].slice(0, 8))} />
        {historial.length > 0 && <p className="mt-4 text-xs text-muted text-center">Historial: {historial.join(" · ")}</p>}
      </Card>
    </Section>
  );
}

function NumberGeneratorSection() {
  return (
    <Section
      id="numbergenerator"
      title="NumberGenerator"
      description="Número al azar en un rango que el usuario edita, con efecto de conteo y las últimas 10 tiradas."
    >
      <Card>
        <NumberGenerator defaultMin={1} defaultMax={100} />
      </Card>
    </Section>
  );
}

function RaffleDrawSection() {
  const [ganadores, setGanadores] = useState<string[]>([]);
  return (
    <Section
      id="raffledraw"
      title="RaffleDraw"
      description="Sorteo de N ganadores con reel animado. Con «No repetir» activo, cada elegido sale del bolillero para el resto del sorteo."
    >
      <Card>
        <RaffleDraw
          defaultEntries={["Ana", "Bruno", "Carla", "Diego", "Elena", "Facundo", "Guadalupe", "Hernán"]}
          maxWinners={5}
          onDraw={setGanadores}
        />
        {ganadores.length > 0 && (
          <p className="mt-4 text-xs text-muted">
            `onDraw` recibe el acumulado ({ganadores.length}): {ganadores.join(", ")}
          </p>
        )}
      </Card>
    </Section>
  );
}

function TeamShufflerSection() {
  return (
    <Section
      id="teamshuffler"
      title="TeamShuffler"
      description="Reparte la lista completa en N equipos al azar y lo más parejos posible (round-robin sobre la lista mezclada)."
    >
      <Card>
        <TeamShuffler
          defaultEntries={["Ana", "Bruno", "Carla", "Diego", "Elena", "Facundo", "Guadalupe"]}
          defaultTeamCount={2}
        />
      </Card>
    </Section>
  );
}

function TallyCounterSection() {
  return (
    <Section
      id="tallycounter"
      title="TallyCounter"
      description="Anotador de palitos: una fila por jugador, marcas en grupos de 5 con el quinto cruzado en diagonal, igual que a mano."
    >
      <Card>
        <TallyCounter defaultPlayers={[{ name: "Equipo A", count: 7 }, { name: "Equipo B", count: 3 }]} />
      </Card>
    </Section>
  );
}

export function GamesGroup() {
  return (
    <>
      <DiceRollerSection />
      <RouletteWheelSection />
      <CoinFlipSection />
      <NumberGeneratorSection />
      <RaffleDrawSection />
      <TeamShufflerSection />
      <TallyCounterSection />
    </>
  );
}
