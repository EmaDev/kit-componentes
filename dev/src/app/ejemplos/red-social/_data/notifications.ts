import type { AppNotification } from "../../../../../../components/NotificationPanel";

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    title: "Lucía Marín publicó una encuesta",
    description: "¿Con qué madera armamos la próxima serie?",
    date: Date.now() - 10 * 60_000,
    read: false,
    tone: "info",
    href: "/ejemplos/red-social/post/p2",
  },
  {
    id: "n2",
    title: "A Bruno Aguirre le gustó tu post",
    description: "Terminamos el lote de doce sillas para la casa de la calle Aldama.",
    date: Date.now() - 3 * 3600_000,
    read: false,
    tone: "success",
    href: "/ejemplos/red-social/post/p1",
  },
  {
    id: "n3",
    title: "Nuevo comentario en tu publicación",
    description: "Camila Ríos: “¡Quedaron hermosas! ¿Hacen envíos al interior?”",
    date: Date.now() - 26 * 3600_000,
    read: true,
    tone: "neutral",
    href: "/ejemplos/red-social/post/p1",
  },
];
