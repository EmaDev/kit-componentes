"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type EditorFormat = "traditional" | "markdown";
export type MarkdownViewMode = "edit" | "split" | "preview";

interface DocumentEditorProps {
  defaultTitle?: string;
  defaultValue?: string;
  defaultFormat?: EditorFormat;
  placeholder?: string;
  onTitleChange?: (title: string) => void;
  onChange?: (markdown: string) => void;
  onFormatChange?: (format: EditorFormat) => void;
  onSave?: (payload: { title: string; markdown: string; format: EditorFormat }) => void | Promise<void>;
  onClose?: () => void;
  /** fullscreen: fixed a toda la pantalla. embed: relativo, llena su contenedor (para mocks). Default: "fullscreen" */
  variant?: "fullscreen" | "embed";
  className?: string;
}

// ---------- markdown <-> html (subset suficiente para uso profesional cotidiano) ----------
function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function mdInline(s: string) {
  let out = escapeHtml(s);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  out = out.replace(/_([^_]+)_/g, "<em>$1</em>");
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return out;
}

function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  let html = "";
  let listType: "ul" | "ol" | null = null;
  let inCode = false;
  let codeBuf: string[] = [];
  const closeList = () => { if (listType) { html += `</${listType}>`; listType = null; } };

  for (const raw of lines) {
    const line = raw;
    if (/^```/.test(line)) {
      if (!inCode) { inCode = true; codeBuf = []; }
      else { inCode = false; html += `<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`; }
      continue;
    }
    if (inCode) { codeBuf.push(line); continue; }

    const h = line.match(/^(#{1,3})\s+(.*)/);
    if (h) { closeList(); html += `<h${h[1].length}>${mdInline(h[2])}</h${h[1].length}>`; continue; }

    const bq = line.match(/^>\s?(.*)/);
    if (bq) { closeList(); html += `<blockquote>${mdInline(bq[1])}</blockquote>`; continue; }

    const ul = line.match(/^[-*]\s+(.*)/);
    if (ul) { if (listType !== "ul") { closeList(); html += "<ul>"; listType = "ul"; } html += `<li>${mdInline(ul[1])}</li>`; continue; }

    const ol = line.match(/^\d+\.\s+(.*)/);
    if (ol) { if (listType !== "ol") { closeList(); html += "<ol>"; listType = "ol"; } html += `<li>${mdInline(ol[1])}</li>`; continue; }

    closeList();
    if (!line.trim()) continue;
    html += `<p>${mdInline(line)}</p>`;
  }
  closeList();
  return html || "<p><br></p>";
}

function htmlToMarkdown(html: string): string {
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstChild as HTMLElement;
  const out: string[] = [];

  const inline = (node: ChildNode): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
    const el = node as HTMLElement;
    const tag = el.tagName?.toLowerCase();
    const inner = Array.from(el.childNodes).map(inline).join("");
    if (tag === "strong" || tag === "b") return `**${inner}**`;
    if (tag === "em" || tag === "i") return `*${inner}*`;
    if (tag === "code") return `\`${inner}\``;
    if (tag === "a") return `[${inner}](${el.getAttribute("href") || "#"})`;
    if (tag === "br") return "\n";
    return inner;
  };

  Array.from(root?.childNodes ?? []).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent?.trim()) out.push(node.textContent.trim());
      return;
    }
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    if (/^h[1-3]$/.test(tag)) out.push(`${"#".repeat(Number(tag[1]))} ${inline(el)}`);
    else if (tag === "blockquote") out.push(`> ${inline(el)}`);
    else if (tag === "ul") Array.from(el.children).forEach((li) => out.push(`- ${inline(li)}`));
    else if (tag === "ol") Array.from(el.children).forEach((li, i) => out.push(`${i + 1}. ${inline(li)}`));
    else if (tag === "pre") out.push("```\n" + el.textContent + "\n```");
    else out.push(inline(el));
  });
  return out.join("\n\n");
}

const TOOLBAR_BTN = "h-8 min-w-8 px-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-alt inline-flex items-center justify-center transition-colors text-[13px] font-semibold";

function ToolIcon({ children }: { children: React.ReactNode }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}

/** Escritor de texto profesional a pantalla completa, con formato tradicional (WYSIWYG) o Markdown intercambiables sobre la misma fuente. */
export function DocumentEditor({
  defaultTitle = "Documento sin título",
  defaultValue = "",
  defaultFormat = "traditional",
  placeholder = "Empezá a escribir…",
  onTitleChange,
  onChange,
  onFormatChange,
  onSave,
  onClose,
  variant = "fullscreen",
  className = "",
}: DocumentEditorProps) {
  const [title, setTitle] = useState(defaultTitle);
  const [format, setFormat] = useState<EditorFormat>(defaultFormat);
  const [markdown, setMarkdown] = useState(defaultValue);
  const [mdView, setMdView] = useState<MarkdownViewMode>("split");
  const [status, setStatus] = useState<"idle" | "editing" | "saved">("idle");
  const editableRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const syncingFromMd = useRef(false);

  const words = useMemo(() => (markdown.trim() ? markdown.trim().split(/\s+/).length : 0), [markdown]);
  const chars = markdown.length;

  useEffect(() => {
    if (editableRef.current && format === "traditional" && !syncingFromMd.current) {
      editableRef.current.innerHTML = markdownToHtml(markdown);
    }
    syncingFromMd.current = false;
  }, [format]);

  const bumpSave = () => {
    setStatus("editing");
    onChange?.(markdown);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setStatus("saved"), 700);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(bumpSave, [markdown]);

  const onEditableInput = () => {
    const html = editableRef.current?.innerHTML ?? "";
    syncingFromMd.current = true;
    setMarkdown(htmlToMarkdown(html));
  };

  const exec = (cmd: string, arg?: string) => {
    editableRef.current?.focus();
    document.execCommand(cmd, false, arg);
    onEditableInput();
  };

  const wrapSelection = (before: string, after = before) => {
    const el = taRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const next = value.slice(0, s) + before + value.slice(s, e) + after + value.slice(e);
    setMarkdown(next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + before.length, e + before.length); });
  };

  const prefixLine = (prefix: string) => {
    const el = taRef.current;
    if (!el) return;
    const { selectionStart, value } = el;
    const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    setMarkdown(next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(selectionStart + prefix.length, selectionStart + prefix.length); });
  };

  const switchFormat = (f: EditorFormat) => {
    if (f === format) return;
    setFormat(f);
    onFormatChange?.(f);
  };

  const handleSave = async () => {
    await onSave?.({ title, markdown, format });
    setStatus("saved");
  };

  return (
    <div className={[
      variant === "fullscreen" ? "fixed inset-0 z-[200]" : "absolute inset-0",
      "flex flex-col bg-surface text-foreground",
      className,
    ].join(" ")}>
      <header className="shrink-0 flex items-center gap-3 border-b border-border px-4 py-2.5">
        {onClose && (
          <button onClick={onClose} aria-label="Cerrar" className="w-8 h-8 rounded-lg text-muted hover:text-foreground hover:bg-surface-alt inline-flex items-center justify-center transition-colors shrink-0">
            <ToolIcon><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></ToolIcon>
          </button>
        )}
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); onTitleChange?.(e.target.value); }}
          placeholder="Título del documento"
          className="flex-1 min-w-0 bg-transparent text-[15px] font-semibold text-foreground placeholder:text-muted outline-none"
        />
        <span className="hidden sm:inline text-[11px] text-muted shrink-0 tabular-nums">
          {status === "editing" ? "Editando…" : status === "saved" ? "Guardado" : ""}
        </span>
        <div className="shrink-0 flex items-center gap-0.5 rounded-xl border border-border bg-surface-alt p-0.5">
          {(["traditional", "markdown"] as EditorFormat[]).map((f) => (
            <button key={f} onClick={() => switchFormat(f)}
              className={[
                "h-7 px-3 rounded-lg text-[11px] font-bold transition-all",
                format === f ? "bg-surface text-foreground shadow-sm" : "text-muted hover:text-foreground",
              ].join(" ")}>
              {f === "traditional" ? "Tradicional" : "Markdown"}
            </button>
          ))}
        </div>
        {onSave && (
          <button onClick={handleSave} className="shrink-0 h-8 px-3.5 rounded-lg bg-primary text-white text-xs font-bold shadow-sm shadow-primary/25 hover:bg-primary-hover active:scale-95 transition-all">
            Guardar
          </button>
        )}
      </header>

      {format === "traditional" ? (
        <div className="shrink-0 flex items-center gap-0.5 border-b border-border px-3 py-1.5 overflow-x-auto">
          <button className={TOOLBAR_BTN} title="Negrita" onClick={() => exec("bold")}><b>B</b></button>
          <button className={TOOLBAR_BTN} title="Cursiva" onClick={() => exec("italic")}><i>I</i></button>
          <button className={TOOLBAR_BTN} title="Subrayado" onClick={() => exec("underline")}><span className="underline">U</span></button>
          <span className="w-px h-5 bg-border mx-1"/>
          <button className={TOOLBAR_BTN} title="Título 1" onClick={() => exec("formatBlock", "h1")}>H1</button>
          <button className={TOOLBAR_BTN} title="Título 2" onClick={() => exec("formatBlock", "h2")}>H2</button>
          <button className={TOOLBAR_BTN} title="Título 3" onClick={() => exec("formatBlock", "h3")}>H3</button>
          <span className="w-px h-5 bg-border mx-1"/>
          <button className={TOOLBAR_BTN} title="Viñetas" onClick={() => exec("insertUnorderedList")}>
            <ToolIcon><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.2" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.2" fill="currentColor" stroke="none"/></ToolIcon>
          </button>
          <button className={TOOLBAR_BTN} title="Numerada" onClick={() => exec("insertOrderedList")}>1.</button>
          <button className={TOOLBAR_BTN} title="Cita" onClick={() => exec("formatBlock", "blockquote")}>
            <ToolIcon><path d="M7 8a3 3 0 0 0-3 3v5h5v-5H6a3 3 0 0 1 1-2z"/><path d="M17 8a3 3 0 0 0-3 3v5h5v-5h-3a3 3 0 0 1 1-2z"/></ToolIcon>
          </button>
          <button className={TOOLBAR_BTN} title="Enlace" onClick={() => { const url = window.prompt("URL:", "https://"); if (url) exec("createLink", url); }}>
            <ToolIcon><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></ToolIcon>
          </button>
        </div>
      ) : (
        <div className="shrink-0 flex items-center gap-0.5 border-b border-border px-3 py-1.5 overflow-x-auto">
          <button className={TOOLBAR_BTN} title="Negrita" onClick={() => wrapSelection("**")}><b>B</b></button>
          <button className={TOOLBAR_BTN} title="Cursiva" onClick={() => wrapSelection("*")}><i>I</i></button>
          <button className={TOOLBAR_BTN} title="Código" onClick={() => wrapSelection("`")}>{"</>"}</button>
          <span className="w-px h-5 bg-border mx-1"/>
          <button className={TOOLBAR_BTN} title="Título 1" onClick={() => prefixLine("# ")}>H1</button>
          <button className={TOOLBAR_BTN} title="Título 2" onClick={() => prefixLine("## ")}>H2</button>
          <button className={TOOLBAR_BTN} title="Viñeta" onClick={() => prefixLine("- ")}>•</button>
          <button className={TOOLBAR_BTN} title="Numerada" onClick={() => prefixLine("1. ")}>1.</button>
          <button className={TOOLBAR_BTN} title="Cita" onClick={() => prefixLine("> ")}>&gt;</button>
          <button className={TOOLBAR_BTN} title="Enlace" onClick={() => wrapSelection("[", "](https://)")}>
            <ToolIcon><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></ToolIcon>
          </button>
          <span className="ml-auto flex items-center gap-0.5 rounded-lg border border-border p-0.5">
            {(["edit", "split", "preview"] as MarkdownViewMode[]).map((m) => (
              <button key={m} onClick={() => setMdView(m)}
                className={["h-6 px-2 rounded-md text-[10px] font-bold transition-all", mdView === m ? "bg-surface-alt text-foreground" : "text-muted hover:text-foreground"].join(" ")}>
                {m === "edit" ? "Editar" : m === "split" ? "Dividido" : "Vista"}
              </button>
            ))}
          </span>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-hidden">
        {format === "traditional" ? (
          <div className="h-full overflow-y-auto">
            <div
              ref={editableRef}
              contentEditable
              suppressContentEditableWarning
              onInput={onEditableInput}
              data-placeholder={placeholder}
              data-empty={markdown.trim() ? "false" : "true"}
              className={[
                "prose-doc max-w-[720px] mx-auto px-8 py-10 text-[15px] leading-relaxed outline-none min-h-full",
                "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-2 [&_h1]:mb-3",
                "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-2.5",
                "[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-5 [&_h3]:mb-2",
                "[&_p]:mb-3.5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3.5",
                "[&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:text-muted [&_blockquote]:italic [&_blockquote]:mb-3.5",
                "[&_code]:bg-surface-alt [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px] [&_code]:font-mono",
                "[&_a]:text-primary [&_a]:underline",
              ].join(" ")}
            />
          </div>
        ) : (
          <div className="h-full grid" style={{ gridTemplateColumns: mdView === "split" ? "1fr 1fr" : "1fr" }}>
            {mdView !== "preview" && (
              <textarea
                ref={taRef}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder={placeholder}
                spellCheck={false}
                className={[
                  "h-full resize-none bg-transparent outline-none px-8 py-10 text-[14px] font-mono leading-relaxed text-foreground placeholder:text-muted",
                  mdView === "split" ? "border-r border-border" : "",
                ].join(" ")}
              />
            )}
            {mdView !== "edit" && (
              <div className="h-full overflow-y-auto">
                <div
                  className={[
                    "prose-doc max-w-[720px] mx-auto px-8 py-10 text-[15px] leading-relaxed",
                    "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-2 [&_h1]:mb-3",
                    "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-2.5",
                    "[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-5 [&_h3]:mb-2",
                    "[&_p]:mb-3.5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3.5",
                    "[&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:text-muted [&_blockquote]:italic [&_blockquote]:mb-3.5",
                    "[&_code]:bg-surface-alt [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px] [&_code]:font-mono",
                    "[&_pre]:bg-surface-alt [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:mb-3.5 [&_pre]:overflow-x-auto",
                    "[&_a]:text-primary [&_a]:underline",
                  ].join(" ")}
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="shrink-0 flex items-center gap-4 border-t border-border px-4 py-1.5 text-[11px] text-muted">
        <span className="tabular-nums">{words} palabras</span>
        <span className="tabular-nums">{chars} caracteres</span>
        <span className="ml-auto">{format === "traditional" ? "Formato tradicional" : "Markdown"}</span>
      </footer>
    </div>
  );
}
