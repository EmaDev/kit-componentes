"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { AppHeader, type HeaderAction } from "../../../../../components/AppHeader";
import { NotificationPanel, type AppNotification } from "../../../../../components/NotificationPanel";
import { Footer } from "../../../../../components/Footer";
import { SafeArea } from "../../../../../components/SafeArea";
import { Chatbot, type ChatMessage } from "../../../../../components/Chatbot";
import { NOTIFICATIONS } from "./_data/notifications";
import { FeedHydrator } from "./_store/FeedHydrator";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function RedSocialLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>(NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  const headerActions: HeaderAction[] = [
    {
      id: "notifications",
      label: "Notificaciones",
      icon: <BellIcon />,
      badge: unread > 0 ? unread : false,
      onClick: () => setNotifOpen((o) => !o),
    },
  ];

  return (
    <SafeArea as="div" edges={["bottom"]} className="min-h-screen bg-surface text-foreground flex flex-col">
      <FeedHydrator />

      <AppHeader
        title="Red social"
        onBack={() => router.push("/ejemplos")}
        backLabel="Ejemplos"
        actions={headerActions}
      />

      {notifOpen && (
        <>
          <button
            type="button"
            aria-label="Cerrar notificaciones"
            onClick={() => setNotifOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            className="fixed z-50 right-3 sm:right-6 w-90 max-w-[calc(100vw-1.5rem)]"
            style={{ top: "calc(3.75rem + var(--sa-top, env(safe-area-inset-top, 0px)))" }}
          >
            <NotificationPanel
              items={notifications}
              onRead={(id) => setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)))}
              onReadAll={() => setNotifications((ns) => ns.map((n) => ({ ...n, read: true })))}
              onDismiss={(id) => setNotifications((ns) => ns.filter((n) => n.id !== id))}
              onClear={() => setNotifications([])}
              onItemClick={(n) => {
                setNotifOpen(false);
                if (n.href) router.push(n.href);
              }}
            />
          </div>
        </>
      )}

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8">{children}</main>

      <Footer
        brand="Red social"
        description="Mini app de ejemplo: posts, encuestas y comentarios con hilos armados con lib-kit-components."
        groups={[
          {
            title: "Comunidad",
            links: [
              { label: "Feed", href: "/ejemplos/red-social" },
              { label: "Otros ejemplos", href: "/ejemplos" },
            ],
          },
        ]}
        onNavigate={(href) => router.push(href)}
        bottomText={`© ${new Date().getFullYear()} — Demo de lib-kit-components.`}
      />

      <Chatbot
        messages={messages}
        variant="floating"
        botName="Ayuda"
        starters={["¿Cómo publico?", "¿Cómo edito mi perfil?"]}
        footnote="Respuestas automáticas de ejemplo."
        onSend={async (text) => {
          setMessages((m) => [...m, { id: uid(), role: "user", text, at: Date.now() }]);
          await new Promise((r) => setTimeout(r, 700));
          setMessages((m) => [
            ...m,
            {
              id: uid(),
              role: "bot",
              text: "Esto es una demo: no hay un asistente real detrás, pero así se vería una respuesta.",
              at: Date.now(),
            },
          ]);
        }}
      />
    </SafeArea>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
