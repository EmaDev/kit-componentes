import { useEffect, useState } from "react";
import { FormsSection } from "./sections/FormsSection";
import { FeedbackSection } from "./sections/FeedbackSection";
import { DataSection } from "./sections/DataSection";
import { InteractionSection } from "./sections/InteractionSection";
import { PwaSection } from "./sections/PwaSection";
import { PlatformSection } from "./sections/PlatformSection";

const TABS = [
  { id: "forms", label: "Forms", render: FormsSection },
  { id: "feedback", label: "Feedback & Overlays", render: FeedbackSection },
  { id: "data", label: "Data & Grillas", render: DataSection },
  { id: "interaction", label: "Interacción", render: InteractionSection },
  { id: "pwa", label: "PWA", render: PwaSection },
  { id: "platform", label: "Plataforma", render: PlatformSection },
] as const;

export default function App() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("forms");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const Active = TABS.find((t) => t.id === tab)!.render;

  return (
    <div className="min-h-screen bg-surface text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          <span className="font-semibold text-sm">lib-kit-components · playground</span>
          <button
            onClick={() => setDark((d) => !d)}
            className="h-9 px-3 rounded-lg border border-border text-sm hover:bg-surface-alt transition-colors"
          >
            {dark ? "☀️ Claro" : "🌙 Oscuro"}
          </button>
        </div>
        <nav className="max-w-6xl mx-auto px-5 flex gap-1 overflow-x-auto pb-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                "shrink-0 h-8 px-3 rounded-lg text-xs font-medium transition-colors",
                tab === t.id
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-surface-alt hover:text-foreground",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8">
        <Active />
      </main>
    </div>
  );
}
