import { I } from "./Icon";
import { SITE_CONFIG } from "../site.config";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
        <span>
          lib-kit-components <span className="font-mono">v{SITE_CONFIG.libVersion}</span>
        </span>
        <div className="flex items-center gap-4">
          <a href={SITE_CONFIG.repoUrl} target="_blank" rel="noreferrer" className="hover:text-foreground">
            GitHub
          </a>
          {SITE_CONFIG.donateUrl && (
            <a
              href={SITE_CONFIG.donateUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-foreground"
            >
              <span className="w-4 h-4">{I.heart}</span>
              Donar
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
