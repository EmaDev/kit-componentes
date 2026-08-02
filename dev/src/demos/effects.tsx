import { useState } from "react";
import { CardFan, type FanCard } from "../../../components/CardFan";
import { SwipeableCardStack, type SwipeCard } from "../../../components/SwipeableCardStack";
import { FlipRevealGrid, type FlipItem } from "../../../components/FlipRevealGrid";
import { AnimatedCounter } from "../../../components/AnimatedCounter";
import { SkeletonMorph } from "../../../components/SkeletonMorph";
import { SkeletonCard } from "../../../components/Skeleton";
import { ParallaxScrollCards, type ParallaxCardItem } from "../../../components/ParallaxScrollCards";
import { TiltHoverCard } from "../../../components/TiltHoverCard";
import { AnimatedProgressRing } from "../../../components/AnimatedProgressRing";
import { DragReorderList, type ReorderItem } from "../../../components/DragReorderList";
import { VideoCallGrid, type CallParticipant } from "../../../components/VideoCallGrid";
import { Button } from "../../../components/Button";
import { Card as UiCard } from "../../../components/Card";
import { Section, Card, Row } from "../chrome/Section";

const FAN_CARDS: FanCard[] = [
  { id: "1", label: "Corazones", color: "#ef4444" },
  { id: "2", label: "Picas", color: "#0f172a" },
  { id: "3", label: "Diamantes", color: "#2563eb" },
  { id: "4", label: "Tréboles", color: "#22c55e" },
];

export function CardFanSection() {
  return (
    <Section id="cardfan" title="CardFan" description="Abanico de cartas interactivo, para elegir una entre varias.">
      <Card>
        <CardFan cards={FAN_CARDS} onPick={() => {}} allowShuffle />
      </Card>
    </Section>
  );
}

const SWIPE_CARDS: SwipeCard[] = [
  { id: "1", title: "Depto en Palermo", subtitle: "2 amb · $180.000" },
  { id: "2", title: "Casa en Belgrano", subtitle: "4 amb · $320.000" },
  { id: "3", title: "Loft en Núñez", subtitle: "1 amb · $140.000" },
];

export function SwipeableCardStackSection() {
  return (
    <Section id="swipeablecardstack" title="SwipeableCardStack" description="Pila de tarjetas swipeable, tipo Tinder.">
      <Card>
        <div className="max-w-sm mx-auto h-64">
          <SwipeableCardStack cards={SWIPE_CARDS} onSwipe={() => {}} onEmpty={() => {}} />
        </div>
      </Card>
    </Section>
  );
}

const flipFront = (label: string) => <span className="text-sm font-bold">{label}</span>;
const FLIP_ITEMS: FlipItem[] = ["A", "A", "B", "B", "C", "C", "D", "D"].map((label, i) => ({
  id: `${i}`, matchKey: label, front: flipFront(label),
}));

export function FlipRevealGridSection() {
  return (
    <Section id="fliprevealgrid" title="FlipRevealGrid" description="Grilla de cartas que se voltean para revelar o emparejar (modo memoria).">
      <Card>
        <FlipRevealGrid items={FLIP_ITEMS} columns={4} memoryMode onMatch={() => {}} onComplete={() => {}} />
      </Card>
    </Section>
  );
}

export function AnimatedCounterSection() {
  const [value, setValue] = useState(1280);
  return (
    <Section id="animatedcounter" title="AnimatedCounter" description="Contador numérico animado hacia un valor.">
      <Card>
        <p className="text-4xl font-black text-foreground mb-4">
          <AnimatedCounter value={value} format={(n) => `$${Math.round(n).toLocaleString()}`} />
        </p>
        <Button size="sm" onClick={() => setValue((v) => v + 4200)}>Sumar $4.200</Button>
      </Card>
    </Section>
  );
}

export function SkeletonMorphSection() {
  const [loading, setLoading] = useState(true);
  return (
    <Section id="skeletonmorph" title="SkeletonMorph" description="Transición morph entre un skeleton y el contenido real.">
      <Card>
        <Row className="mb-3">
          <Button size="sm" onClick={() => setLoading((v) => !v)}>{loading ? "Mostrar contenido" : "Mostrar skeleton"}</Button>
        </Row>
        <SkeletonMorph loading={loading} skeleton={<SkeletonCard />}>
          <UiCard padding="md">
            <p className="text-sm font-semibold text-foreground">Casa Aldama</p>
            <p className="text-sm text-muted">Reforma integral de 140 m².</p>
          </UiCard>
        </SkeletonMorph>
      </Card>
    </Section>
  );
}

const PARALLAX_ITEMS: ParallaxCardItem[] = [
  { id: "1", title: "Océano", description: "Buceo y snorkel", depth: 0.2 },
  { id: "2", title: "Montaña", description: "Trekking y camping", depth: 0.4 },
  { id: "3", title: "Ciudad", description: "Arquitectura y museos", depth: 0.6 },
];

export function ParallaxScrollCardsSection() {
  return (
    <Section id="parallaxscrollcards" title="ParallaxScrollCards" description="Cards con efecto parallax al scrollear.">
      <Card>
        <ParallaxScrollCards items={PARALLAX_ITEMS} />
      </Card>
    </Section>
  );
}

export function TiltHoverCardSection() {
  return (
    <Section id="tilthovercard" title="TiltHoverCard" description="Tarjeta con inclinación 3D al mover el mouse, más glare.">
      <Card>
        <div className="max-w-xs">
          <TiltHoverCard>
            <UiCard padding="md" variant="elevated">
              <p className="text-sm font-semibold text-foreground">Pasá el mouse acá</p>
              <p className="text-sm text-muted">Se inclina siguiendo el cursor.</p>
            </UiCard>
          </TiltHoverCard>
        </div>
      </Card>
    </Section>
  );
}

export function AnimatedProgressRingSection() {
  return (
    <Section id="animatedprogressring" title="AnimatedProgressRing" description="Anillo de progreso con animación de reveal al montarse.">
      <div className="flex gap-4">
        <Card><AnimatedProgressRing value={72} /></Card>
        <Card><AnimatedProgressRing value={45} color="var(--color-accent)" /></Card>
      </div>
    </Section>
  );
}

export function DragReorderListSection() {
  const [items, setItems] = useState<ReorderItem[]>([
    { id: "1", label: "Blinding Lights", sublabel: "The Weeknd" },
    { id: "2", label: "Levitating", sublabel: "Dua Lipa" },
    { id: "3", label: "Save Your Tears", sublabel: "The Weeknd" },
  ]);
  return (
    <Section id="dragreorderlist" title="DragReorderList" description="Lista reordenable por drag & drop.">
      <Card>
        <div className="max-w-sm">
          <DragReorderList items={items} onChange={setItems} />
        </div>
      </Card>
    </Section>
  );
}

const PARTICIPANTS: CallParticipant[] = [
  { id: "1", name: "Ana Torres", speaking: true, videoOn: true },
  { id: "2", name: "Bruno Díaz", muted: true, videoOn: false },
  { id: "3", name: "Vos", you: true, videoOn: false },
];

export function VideoCallGridSection() {
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  return (
    <Section id="videocallgrid" title="VideoCallGrid" description="Grilla de participantes de videollamada, con mute/video toggle.">
      <Card>
        <div className="h-96">
          <VideoCallGrid
            participants={PARTICIPANTS}
            muted={muted}
            videoOn={videoOn}
            onToggleMute={() => setMuted((v) => !v)}
            onToggleVideo={() => setVideoOn((v) => !v)}
            onLeave={() => {}}
          />
        </div>
      </Card>
    </Section>
  );
}

