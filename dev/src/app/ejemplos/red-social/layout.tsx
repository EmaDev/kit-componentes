"use client";

import { useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Navbar } from "../../../../../components/Navbar";
import { Chatbot, type ChatMessage } from "../../../../../components/Chatbot";
import { FeedHydrator } from "./_store/FeedHydrator";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function RedSocialLayout({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  return (
    <div className="min-h-screen bg-surface text-foreground">
      <FeedHydrator />
      <Navbar
        brand={
          <Link href="/ejemplos/red-social" className="font-bold text-foreground">
            Red social
          </Link>
        }
        actions={
          <Link href="/ejemplos" className="text-sm text-muted hover:text-foreground transition-colors">
            ← Ejemplos
          </Link>
        }
      />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">{children}</main>

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
    </div>
  );
}
