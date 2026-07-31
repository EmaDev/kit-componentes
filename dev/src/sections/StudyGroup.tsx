import { useState } from "react";
import { Flashcard } from "../../../components/Flashcard";
import { FlashcardDeck, type FlashcardItem, type FlashcardGrade } from "../../../components/FlashcardDeck";
import { QuizCard, type QuizOption } from "../../../components/QuizCard";
import { StudyTimer } from "../../../components/StudyTimer";
import { StreakTracker } from "../../../components/StreakTracker";
import { ProgressByTopic, type TopicProgress } from "../../../components/ProgressByTopic";
import { MatchingPairs, type MatchPair } from "../../../components/MatchingPairs";
import { Section, Card } from "../chrome/Section";

function FlashcardSection() {
  return (
    <Section
      id="flashcard"
      title="Flashcard"
      description="Tarjeta de memorización suelta: la tarjeta entera es un botón, así que se da vuelta con click, Enter o Espacio."
    >
      <Card className="max-w-md">
        <Flashcard tag="Vocabulario" front="¿Cómo se dice «casa» en portugués?" back="Casa" />
      </Card>
    </Section>
  );
}

const CARDS: FlashcardItem[] = [
  { id: "1", tag: "Historia", front: "¿En qué año se declaró la independencia argentina?", back: "1816" },
  { id: "2", tag: "Historia", front: "¿Quién fue el primer presidente argentino?", back: "Bernardino Rivadavia" },
  { id: "3", tag: "Geografía", front: "¿Cuál es el punto más alto de América?", back: "Aconcagua (6.961 m)" },
];

function FlashcardDeckSection() {
  const [ultima, setUltima] = useState<{ id: string; grade: FlashcardGrade } | null>(null);
  return (
    <Section
      id="flashcarddeck"
      title="FlashcardDeck"
      description="Mazo con progreso y calificación por tarjeta. «De nuevo» la manda al final de la cola de la sesión; onGrade es el gancho para guardar el repaso en tu backend."
    >
      <Card className="max-w-md">
        <FlashcardDeck cards={CARDS} onGrade={(id, grade) => setUltima({ id, grade })} />
        {ultima && (
          <p className="mt-4 text-xs text-muted">
            Última calificación por `onGrade`: tarjeta <span className="font-bold text-foreground">{ultima.id}</span> →{" "}
            <span className="font-bold text-foreground">{ultima.grade}</span>
          </p>
        )}
      </Card>
    </Section>
  );
}

interface Pregunta {
  id: string;
  question: string;
  options: QuizOption[];
  correctId: string;
  explanation: string;
}

const PREGUNTAS: Pregunta[] = [
  {
    id: "q1",
    question: "¿Cuál es la capital de Australia?",
    options: [
      { id: "a", label: "Sídney" },
      { id: "b", label: "Canberra" },
      { id: "c", label: "Melbourne" },
    ],
    correctId: "b",
    explanation: "Canberra es la capital; Sídney es la ciudad más poblada.",
  },
  {
    id: "q2",
    question: "¿Qué río atraviesa la ciudad de Roma?",
    options: [
      { id: "a", label: "El Tíber" },
      { id: "b", label: "El Po" },
      { id: "c", label: "El Arno" },
    ],
    correctId: "a",
    explanation: "El Tíber. El Arno pasa por Florencia y el Po por el norte de Italia.",
  },
];

function QuizCardSection() {
  const [i, setI] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const q = PREGUNTAS[i % PREGUNTAS.length];

  return (
    <Section
      id="quizcard"
      title="QuizCard"
      description="Opción múltiple con feedback inmediato y explicación. Necesita una key distinta por pregunta: onNext no resetea su estado interno de «respondida»."
    >
      <Card className="max-w-md">
        <QuizCard
          key={`${q.id}-${i}`}
          question={q.question}
          options={q.options}
          correctId={q.correctId}
          explanation={q.explanation}
          index={i % PREGUNTAS.length}
          total={PREGUNTAS.length}
          onAnswer={(_, ok) => ok && setAciertos((a) => a + 1)}
          onNext={() => setI((n) => n + 1)}
        />
        <p className="mt-4 text-xs text-muted">Aciertos acumulados: <span className="font-bold text-foreground">{aciertos}</span></p>
      </Card>
    </Section>
  );
}

function StudyTimerSection() {
  return (
    <Section
      id="studytimer"
      title="StudyTimer"
      description="Pomodoro: alterna foco y descanso solo al llegar a cero y cuenta los ciclos de foco completados. Arranca en pausa."
    >
      <Card>
        <StudyTimer focusMinutes={25} breakMinutes={5} />
      </Card>
    </Section>
  );
}

/** Fechas de los últimos días para que la grilla y la racha se vean con datos. */
const STUDIED_DATES = (() => {
  const out: string[] = [];
  const today = new Date();
  for (let i = 0; i < 70; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    // saltea algunos días para que la racha y los huecos se noten
    if (i > 4 && i % 3 === 0) continue;
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  }
  return out;
})();

function StreakTrackerSection() {
  return (
    <Section
      id="streaktracker"
      title="StreakTracker"
      description="Racha de días consecutivos hacia atrás desde hoy + grilla de constancia de sólo lectura."
    >
      <Card>
        <StreakTracker studiedDates={STUDIED_DATES} weeks={14} goalPerWeek={5} />
      </Card>
    </Section>
  );
}

const TOPICS: TopicProgress[] = [
  { id: "1", label: "Álgebra lineal", mastery: 92 },
  { id: "2", label: "Cálculo diferencial", mastery: 61 },
  { id: "3", label: "Probabilidad y estadística", mastery: 38 },
  { id: "4", label: "Análisis numérico", mastery: 18 },
];

function ProgressByTopicSection() {
  const [ultimo, setUltimo] = useState<string | null>(null);
  return (
    <Section
      id="progressbytopic"
      title="ProgressByTopic"
      description="Dominio por tema: ordena solo de mayor a menor y colorea según umbrales fijos (≥80 success, ≥40 primary, <40 danger)."
    >
      <Card>
        <ProgressByTopic topics={TOPICS} onTopicClick={setUltimo} />
        {ultimo && <p className="mt-4 text-xs text-muted">Último tema clickeado: <span className="font-bold text-foreground">{ultimo}</span></p>}
      </Card>
    </Section>
  );
}

// Fuera del componente a propósito: con un literal inline las tarjetas se remezclan en cada render.
const PAIRS: MatchPair[] = [
  { id: "1", term: "Fotosíntesis", definition: "Conversión de luz en energía química en las plantas" },
  { id: "2", term: "Mitosis", definition: "División celular que produce dos células idénticas" },
  { id: "3", term: "Osmosis", definition: "Paso de un solvente por una membrana semipermeable" },
];

function MatchingPairsSection() {
  const [intento, setIntento] = useState(0);
  return (
    <Section
      id="matchingpairs"
      title="MatchingPairs"
      description="Emparejar término con definición: todas las tarjetas están visibles desde el arranque, así que ejercita la asociación y no la memoria."
    >
      <Card>
        <MatchingPairs key={intento} pairs={PAIRS} />
        <button
          type="button"
          onClick={() => setIntento((n) => n + 1)}
          className="mt-4 h-9 px-4 rounded-lg border border-border text-sm font-bold text-foreground hover:bg-surface transition-colors"
        >
          Remontar con otra distribución
        </button>
      </Card>
    </Section>
  );
}

export function StudyGroup() {
  return (
    <>
      <FlashcardSection />
      <FlashcardDeckSection />
      <QuizCardSection />
      <StudyTimerSection />
      <StreakTrackerSection />
      <ProgressByTopicSection />
      <MatchingPairsSection />
    </>
  );
}
