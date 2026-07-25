import { useEffect, useState } from "react";
import { GROUPS, GROUP_TONES, SECTIONS, type GroupSection } from "./groups";

export function SideNav() {
  const [active, setActive] = useState("intro");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const item = (s: GroupSection) => {
    const isActive = active === s.id;
    return (
      <li key={s.id}>
        <a
          href={`#${s.id}`}
          className={[
            "relative block px-3 py-1.5 text-sm rounded-lg transition-all",
            isActive ? "text-primary font-medium" : "text-muted hover:text-foreground",
          ].join(" ")}
        >
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-primary" />
          )}
          {s.label}
        </a>
      </li>
    );
  };

  return (
    <nav className="hidden xl:block sticky top-24 self-start w-52 shrink-0 max-h-[calc(100vh-7rem)] scroll-native pr-2 pb-6">
      <ul className="space-y-0.5">{item({ id: "intro", label: "Introducción" })}</ul>
      {GROUPS.map((g) => (
        <div key={g.id} className="mt-6">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-foreground mb-2 pl-3">
            <span className={`w-1.5 h-1.5 rounded-full ${GROUP_TONES[g.tone].dot}`} />
            {g.label}
          </p>
          <ul className="space-y-0.5 border-l border-border ml-3 pl-0.5">{g.sections.map(item)}</ul>
        </div>
      ))}
    </nav>
  );
}
