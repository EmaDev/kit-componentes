"use client";

import { useState } from "react";
import { Button } from "../../../../../../components/Button";
import { PwaInstallPrompt } from "../../../../../../components/PwaInstallPrompt";

/**
 * En un proyecto real basta con `<PwaInstallPrompt appName="…" />` en el shell:
 * aparece solo cuando el navegador es elegible. Acá agregamos botones para
 * forzar cada plataforma y poder verlo en desktop.
 */
export function InstallDemo() {
  const [platform, setPlatform] = useState<"android" | "ios" | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="secondary" onClick={() => setPlatform("android")}>
        Ver instalador Android
      </Button>
      <Button size="sm" variant="secondary" onClick={() => setPlatform("ios")}>
        Ver instalador iOS
      </Button>
      {platform && (
        <Button size="sm" variant="ghost" onClick={() => setPlatform(null)}>
          Cerrar
        </Button>
      )}
      {platform && <PwaInstallPrompt appName="Base App" forcePlatform={platform} />}
    </div>
  );
}
