export interface PollData {
  question: string;
  options: { id: string; label: string; votes: number }[];
}

export interface Post {
  id: string;
  author: { name: string; handle: string; verified?: boolean };
  time: string;
  text: string;
  media?: { src: string; alt: string }[];
  likes: number;
  shares: number;
  poll?: PollData;
}

function phImage(seed: number, label: string, from: string, to: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
<defs><linearGradient id="g${seed}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
<rect width="640" height="480" fill="url(#g${seed})"/>
<text x="320" y="250" text-anchor="middle" font-family="monospace" font-size="56" font-weight="700" fill="rgba(255,255,255,0.85)">${seed}</text>
<text x="320" y="462" text-anchor="middle" font-family="monospace" font-size="14" fill="rgba(255,255,255,0.6)" letter-spacing="2">${label.toUpperCase()}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const POSTS: Post[] = [
  {
    id: "p1",
    author: { name: "Estudio Aldama", handle: "@aldama", verified: true },
    time: "hace 2 h",
    text: "Terminamos el lote de doce sillas para la casa de la calle Aldama. Cada una lleva la espiral tallada a mano, como siempre. Va a estar difícil despedirlas del taller — nos quedamos mirándolas un rato largo antes de embalarlas.",
    media: [
      { src: phImage(1, "Taller", "#2563eb", "#8b5cf6"), alt: "Taller de carpintería" },
      { src: phImage(2, "Sillas", "#8b5cf6", "#ec4899"), alt: "Sillas terminadas" },
    ],
    likes: 128,
    shares: 6,
  },
  {
    id: "p2",
    author: { name: "Lucía Marín", handle: "@luma", verified: false },
    time: "hace 5 h",
    text: "¿Con qué encaramos la próxima serie de la colección de otoño? Quiero que decidamos entre todos antes de arrancar a cortar madera.",
    likes: 342,
    shares: 21,
    poll: {
      question: "¿Con qué madera armamos la próxima serie?",
      options: [
        { id: "roble", label: "Roble", votes: 412 },
        { id: "pino", label: "Pino", votes: 180 },
        { id: "nogal", label: "Nogal", votes: 96 },
      ],
    },
  },
  {
    id: "p3",
    author: { name: "Bruno Aguirre", handle: "@brunoag" },
    time: "hace 1 d",
    text: "Primer día en el taller. Todavía no sé distinguir el roble del nogal a simple vista, pero ya me enseñaron a afilar el formón. Despacio se llega lejos.",
    media: [{ src: phImage(3, "Formón", "#f59e0b", "#ef4444"), alt: "Herramientas de carpintería" }],
    likes: 54,
    shares: 2,
  },
];

export function getPost(id: string) {
  return POSTS.find((p) => p.id === id) ?? null;
}
