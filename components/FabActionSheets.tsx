"use client";

import { useState, type ReactNode } from "react";
import { FloatingButton, type FabAction } from "./FloatingButton";
import { BottomSheet, type BottomSheetSize } from "./BottomSheet";

export interface FabSheetAction {
  icon: ReactNode;
  label: string;
  tone?: "primary" | "accent" | "success" | "danger";
  /** contenido libre del sheet: formulario, lista, lo que sea */
  content: ReactNode;
  sheetTitle?: string;
  sheetDescription?: string;
  sheetSize?: BottomSheetSize;
  sheetFooter?: ReactNode;
  sheetSnapPoints?: number[];
}

interface FabActionSheetsProps {
  actions: FabSheetAction[];
  mainIcon?: ReactNode;
  mainLabel?: string;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  tone?: "primary" | "accent" | "success" | "danger";
  hideOnScroll?: boolean;
  scrollTarget?: React.RefObject<HTMLElement>;
  absolute?: boolean;
  className?: string;
}

/**
 * FAB que despliega un speed dial de acciones; cada una abre su propio
 * BottomSheet con contenido totalmente personalizable (formulario, lista,
 * lo que sea que se le pase en `content`).
 */
export function FabActionSheets({
  actions,
  mainIcon,
  mainLabel = "Acciones",
  position = "bottom-right",
  tone = "primary",
  hideOnScroll = true,
  scrollTarget,
  absolute = false,
  className = "",
}: FabActionSheetsProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const fabActions: FabAction[] = actions.map((a, i) => ({
    icon: a.icon,
    label: a.label,
    tone: a.tone,
    onClick: () => setOpenIdx(i),
  }));

  return (
    <>
      <FloatingButton
        icon={mainIcon}
        label={mainLabel}
        actions={fabActions}
        position={position}
        tone={tone}
        hideOnScroll={hideOnScroll}
        scrollTarget={scrollTarget}
        absolute={absolute}
        className={className}
      />
      {actions.map((a, i) => (
        <BottomSheet
          key={i}
          open={openIdx === i}
          onClose={() => setOpenIdx(null)}
          title={a.sheetTitle ?? a.label}
          description={a.sheetDescription}
          size={a.sheetSize}
          footer={a.sheetFooter}
          snapPoints={a.sheetSnapPoints}
        >
          {a.content}
        </BottomSheet>
      ))}
    </>
  );
}
