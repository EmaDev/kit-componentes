"use client";
import { useRef, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const CMDS: { cmd: string; label: string; icon: React.ReactNode }[] = [
  { cmd: "bold", label: "Negrita", icon: <path d="M6 4h6a3.5 3.5 0 0 1 0 7H6zM6 11h7a3.5 3.5 0 0 1 0 7H6z"/> },
  { cmd: "italic", label: "Cursiva", icon: <g><line x1="14" y1="4" x2="10" y2="20"/><line x1="15" y1="4" x2="19" y2="4"/><line x1="5" y1="20" x2="9" y2="20"/></g> },
  { cmd: "insertUnorderedList", label: "Lista", icon: <g><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.2"/><circle cx="4" cy="12" r="1.2"/><circle cx="4" cy="18" r="1.2"/></g> },
  { cmd: "createLink", label: "Enlace", icon: <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/> },
];

/** Editor de texto enriquecido simple: negrita, cursiva, lista y enlace — para descripciones y notas. */
export function RichTextEditor({ value, onChange, placeholder = "Escribí acá…", minHeight = 120, className = "" }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [empty, setEmpty] = useState(!value);

  const exec = (cmd: string) => {
    ref.current?.focus();
    if (cmd === "createLink") {
      const url = window.prompt("URL del enlace:", "https://");
      if (!url) return;
      document.execCommand(cmd, false, url);
    } else document.execCommand(cmd, false);
    onChange(ref.current?.innerHTML ?? "");
  };

  return (
    <div className={cn("rounded-xl border border-border bg-surface overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all", className)}>
      <div className="flex items-center gap-0.5 border-b border-border p-1.5">
        {CMDS.map(c => (
          <button key={c.cmd} type="button" onMouseDown={e => e.preventDefault()} onClick={() => exec(c.cmd)} title={c.label}
            className="w-8 h-8 rounded-lg text-muted hover:text-foreground hover:bg-surface-alt inline-flex items-center justify-center transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{c.icon}</svg>
          </button>
        ))}
      </div>
      <div className="relative">
        {empty && <span className="absolute top-3 left-3.5 text-sm text-muted pointer-events-none">{placeholder}</span>}
        <div ref={ref} contentEditable suppressContentEditableWarning
          onInput={e => { const html = e.currentTarget.innerHTML; setEmpty(!e.currentTarget.textContent?.trim()); onChange(html); }}
          dangerouslySetInnerHTML={{ __html: value }}
          style={{ minHeight }}
          className="px-3.5 py-3 text-sm text-foreground leading-relaxed outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-primary [&_a]:underline"/>
      </div>
    </div>
  );
}
