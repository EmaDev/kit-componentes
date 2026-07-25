"use client";

import { motion } from "framer-motion";
import { useState, type FormEvent, type MouseEvent, type ReactNode } from "react";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterSocialLink {
  label: string;
  href: string;
  icon: ReactNode;
}

export interface FooterNewsletter {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonLabel?: string;
  onSubmit?: (email: string) => void | Promise<unknown>;
}

interface FooterProps {
  brand?: ReactNode;
  description?: string;
  groups?: FooterLinkGroup[];
  socials?: FooterSocialLink[];
  newsletter?: FooterNewsletter;
  /** Default: "© {año} — Todos los derechos reservados." */
  bottomText?: string;
  bottomLinks?: FooterLink[];
  /** Intercepta la navegación de todos los links (para routers SPA). Si no se pasa, usa <a href> nativo. */
  onNavigate?: (href: string) => void;
  /** Botón flotante para volver al inicio de la página. Default: true. */
  showBackToTop?: boolean;
  className?: string;
}

export function Footer({
  brand,
  description,
  groups = [],
  socials = [],
  newsletter,
  bottomText,
  bottomLinks = [],
  onNavigate,
  showBackToTop = true,
  className = "",
}: FooterProps) {
  const year = new Date().getFullYear();

  const linkProps = (href: string) => ({
    href,
    onClick: onNavigate ? (e: MouseEvent) => { e.preventDefault(); onNavigate(href); } : undefined,
  });

  return (
    <footer className={`relative overflow-hidden border-t border-border bg-surface ${className}`}>
      {/* decoración de fondo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(auto-fit,minmax(120px,1fr))]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
            className="max-w-xs"
          >
            {brand && <div className="text-lg font-bold text-foreground">{brand}</div>}
            {description && <p className="mt-2.5 text-sm text-muted leading-relaxed">{description}</p>}

            {socials.length > 0 && (
              <div className="mt-5 flex items-center gap-2">
                {socials.map((s) => (
                  <motion.a
                    key={s.label}
                    {...linkProps(s.href)}
                    aria-label={s.label}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.92 }}
                    className="w-9 h-9 rounded-lg grid place-items-center bg-surface-alt text-muted hover:text-foreground hover:bg-border/60 transition-colors"
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            )}
          </motion.div>

          {groups.map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: 0.06 * (gi + 1) }}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-muted mb-3.5">{group.title}</p>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      {...linkProps(link.href)}
                      className="text-sm text-muted hover:text-foreground transition-colors relative inline-block group"
                    >
                      {link.label}
                      <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-foreground transition-all duration-200 group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {newsletter && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: 0.06 * (groups.length + 1) }}
              className="min-w-55"
            >
              <NewsletterForm newsletter={newsletter} />
            </motion.div>
          )}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted order-2 sm:order-1">
            {bottomText ?? `© ${year} — Todos los derechos reservados.`}
          </p>

          <div className="flex items-center gap-5 order-1 sm:order-2">
            {bottomLinks.map((link) => (
              <a key={link.label} {...linkProps(link.href)} className="text-xs text-muted hover:text-foreground transition-colors">
                {link.label}
              </a>
            ))}

            {showBackToTop && (
              <motion.button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Volver arriba"
                className="w-8 h-8 rounded-lg grid place-items-center bg-surface-alt text-muted hover:text-foreground hover:bg-border/60 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

function NewsletterForm({ newsletter }: { newsletter: FooterNewsletter }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || state !== "idle") return;
    setState("busy");
    try {
      await newsletter.onSubmit?.(email);
      setState("done");
      setEmail("");
      setTimeout(() => setState("idle"), 2400);
    } catch {
      setState("idle");
    }
  };

  return (
    <form onSubmit={submit}>
      <p className="text-xs font-bold uppercase tracking-wider text-muted mb-3.5">
        {newsletter.title ?? "Novedades"}
      </p>
      {newsletter.description && (
        <p className="text-sm text-muted leading-relaxed mb-3">{newsletter.description}</p>
      )}
      <div className="flex items-center gap-2 rounded-xl border-2 border-border bg-surface-alt/40 p-1 focus-within:border-primary transition-colors">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={newsletter.placeholder ?? "tu@email.com"}
          disabled={state !== "idle"}
          className="flex-1 min-w-0 bg-transparent px-2.5 py-1.5 text-sm text-foreground outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={state !== "idle"}
          className={[
            "shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
            state === "done" ? "bg-success text-white" : "bg-primary text-white hover:bg-primary-hover",
          ].join(" ")}
        >
          {state === "busy" ? "…" : state === "done" ? "✓" : newsletter.buttonLabel ?? "Enviar"}
        </button>
      </div>
    </form>
  );
}
