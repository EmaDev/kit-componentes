import { useState } from "react";
import { Chatbot, type ChatMessage } from "../../../components/Chatbot";
import { BookReader, type BookChapter } from "../../../components/BookReader";
import { SocialPost } from "../../../components/SocialPost";
import { CommentBox, type Comment } from "../../../components/CommentBox";
import { Poll } from "../../../components/Poll";
import { Confetti } from "../../../components/Confetti";
import { SuccessPage } from "../../../components/SuccessPage";
import { Section, Card } from "../chrome/Section";

function phImage({ w = 800, h = 600, label = "imagen", from = "#2563eb", to = "#8b5cf6", n = 1 }: { w?: number; h?: number; label?: string; from?: string; to?: string; n?: number } = {}) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<text x="${w / 2}" y="${h / 2}" text-anchor="middle" font-family="monospace" font-size="${h * 0.12}" font-weight="700" fill="rgba(255,255,255,0.85)">${n}</text>
<text x="${w / 2}" y="${h - 18}" text-anchor="middle" font-family="monospace" font-size="14" fill="rgba(255,255,255,0.6)" letter-spacing="2">${label.toUpperCase()}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function ChatbotSection() {
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);

  return (
    <Section id="chatbot" title="Chatbot" description="Chat conversacional con burbujas, «escribiendo…», respuestas rápidas y lanzador flotante.">
      <Card>
        <Chatbot
          messages={msgs}
          variant="inline"
          className="h-[440px]"
          botName="Asistente"
          starters={["Envíos", "Pagos", "Devoluciones"]}
          footnote="Respuestas automáticas de ejemplo."
          onSend={async (text) => {
            setMsgs((m) => [...m, { id: uid(), role: "user", text, at: Date.now() }]);
            await new Promise((r) => setTimeout(r, 700));
            setMsgs((m) => [
              ...m,
              { id: uid(), role: "bot", text: `Recibido: "${text}". ¿Algo más?`, at: Date.now(), quickReplies: ["Sí", "No, gracias"] },
            ]);
          }}
        />
      </Card>
    </Section>
  );
}

const CHAPTERS: BookChapter[] = [
  {
    id: "c1",
    title: "I · El taller",
    paragraphs: [
      "La calle Aldama olía a madera recién cortada desde las siete de la mañana. Irene abría el taller antes de que el sol terminara de subir, y el sonido de la sierra se mezclaba con el de los pájaros que anidaban en el jacarandá de la vereda.",
      "No era un oficio que hubiera elegido de joven, pero con los años se había vuelto lo único que sabía hacer con las manos sin pensar en otra cosa.",
      "Cada silla llevaba una marca pequeña, casi invisible, tallada en la parte de abajo del asiento: una espiral que sólo ella sabía leer.",
    ],
  },
  {
    id: "c2",
    title: "II · El pedido",
    paragraphs: [
      "El pedido llegó un martes, escrito a mano en un papel doblado en cuatro. Doce sillas, todas iguales, para una casa que todavía no existía.",
      "Irene lo leyó dos veces antes de aceptar. No por el trabajo — doce sillas no eran nada — sino por la letra, que le resultaba conocida sin poder decir de dónde.",
    ],
  },
];

export function BookReaderSection() {
  return (
    <Section id="bookreader" title="BookReader" description="Lector de texto paginado tipo Google Books: columnas CSS, tema, tipografía ajustable e índice de capítulos.">
      <Card>
        <BookReader title="Las sillas de la calle Aldama" author="Irene Costa" chapters={CHAPTERS} height={420} storageKey="playground.reader" />
      </Card>
    </Section>
  );
}

export function SocialPostSection() {
  const [voted, setVoted] = useState<string[] | null>(null);

  return (
    <Section id="socialpost" title="SocialPost" description="Post de red social: autor, texto con «ver más», grilla de media adaptativa, reacciones animadas y contenido anidado (acá, una encuesta).">
      <Card>
        <SocialPost
          author={{ name: "Estudio Aldama", handle: "@aldama", verified: true }}
          time="hace 2 h"
          text="Terminamos el lote de doce sillas para la casa de la calle Aldama. Cada una lleva la espiral tallada a mano, como siempre. Va a estar difícil despedirlas del taller."
          media={[
            { src: phImage({ w: 640, h: 480, label: "Taller", n: 1 }) },
            { src: phImage({ w: 640, h: 480, label: "Sillas", n: 2 }) },
          ]}
          counts={{ likes: 128, comments: 24, shares: 6 }}
          likedBy={["Lucía Marín"]}
        >
          <Poll
            question="¿Con qué madera armamos la próxima serie?"
            options={[
              { id: "a", label: "Roble", votes: 412 },
              { id: "b", label: "Pino", votes: 180 },
              { id: "c", label: "Nogal", votes: 96 },
            ]}
            kind="single"
            closesLabel="Cierra en 2 días"
            voted={voted}
            onVote={async (ids) => {
              await new Promise((r) => setTimeout(r, 300));
              setVoted(ids);
            }}
          />
        </SocialPost>
      </Card>
    </Section>
  );
}

export function CommentBoxSection() {
  const [comments, setComments] = useState<Comment[]>([
    { id: "1", author: "Lucía Marín", text: "¡Quedaron hermosas! ¿Hacen envíos al interior?", at: Date.now() - 3600_000, likes: 4, authorBadge: "Cliente" },
    { id: "2", author: "Estudio Aldama", text: "¡Gracias Lucía! Sí, hacemos envíos a todo el país.", at: Date.now() - 3000_000, parentId: "1", likes: 1, pinned: true },
  ]);

  return (
    <Section id="commentbox" title="CommentBox" description="Comentarios con hilos de una sola respuesta, orden (recientes/populares/antiguos), likes y contador de caracteres.">
      <CommentBox
        comments={comments}
        currentUser={{ name: "Vos" }}
        maxLength={280}
        pageSize={4}
        onSubmit={async (text, parentId) => {
          await new Promise((r) => setTimeout(r, 300));
          setComments((c) => [...c, { id: uid(), author: "Vos", text, at: Date.now(), parentId: parentId ?? null }]);
        }}
        onLike={(id, liked) => setComments((c) => c.map((x) => (x.id === id ? { ...x, liked, likes: (x.likes ?? 0) + (liked ? 1 : -1) } : x)))}
      />
    </Section>
  );
}

export function ConfettiSuccessSection() {
  const [shot, setShot] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <Section id="confetti" title="Confetti · SuccessPage" description="Confeti en canvas puro (sin dependencias) y la pantalla de éxito completa que lo integra: check animado, detalles de la operación y CTA.">
      <div className="grid sm:grid-cols-2 gap-4">
        <Card title="Confetti suelto">
          <div className="relative h-40 rounded-xl border border-dashed border-border overflow-hidden grid place-items-center">
            <Confetti fire={shot} mode="center" count={140} />
            <button
              type="button"
              onClick={() => setShot((s) => s + 1)}
              className="h-10 px-4 rounded-xl text-sm font-semibold bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-hover active:scale-95 transition-all"
            >
              ¡Festejar!
            </button>
          </div>
        </Card>
        <Card title="SuccessPage — variant=&quot;card&quot;">
          <button
            type="button"
            onClick={() => setShowSuccess(true)}
            className="h-10 px-4 rounded-xl text-sm font-semibold border border-border bg-surface text-foreground hover:bg-surface-alt active:scale-95 transition-all"
          >
            Ver pantalla de éxito
          </button>
        </Card>
      </div>

      {showSuccess && (
        <div className="mt-4">
          <SuccessPage
            variant="card"
            title="¡Pago confirmado!"
            headline="$248.320"
            description="Te mandamos el comprobante por mail."
            details={[
              { label: "Operación", value: "#A-10428" },
              { label: "Método", value: "Tarjeta ···· 4417" },
            ]}
            primary={{ label: "Ver mi pedido", onClick: () => {} }}
            secondary={{ label: "Cerrar", onClick: () => setShowSuccess(false) }}
          />
        </div>
      )}
    </Section>
  );
}

