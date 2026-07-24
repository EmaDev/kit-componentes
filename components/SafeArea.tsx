"use client";

import { type CSSProperties, type ReactNode } from "react";
import { useKeyboardInset } from "../hooks/useKeyboardInset";
import { useSafeArea } from "../hooks/useSafeArea";

type Edge = "top" | "right" | "bottom" | "left";

interface SafeAreaProps {
  children?: ReactNode;
  /** qué bordes respetar. Default: todos */
  edges?: Edge[] | "all" | "none";
  /** px extra sumados a la inset de cada borde aplicado. Default: 0 */
  gutter?: number;
  /** aplicar como margin en vez de padding. Default: false */
  asMargin?: boolean;
  /** sumar la altura del teclado al borde inferior (barras fijas). Default: false */
  avoidKeyboard?: boolean;
  /** ocupar la altura real del viewport (usa --app-height si useImmersive la publica) */
  fillViewport?: boolean;
  as?: "div" | "header" | "footer" | "main" | "section" | "nav";
  className?: string;
  style?: CSSProperties;
}

/**
 * Contenedor que respeta las safe areas del dispositivo (notch, dynamic
 * island, home indicator) y, si querés, el teclado virtual.
 *
 * ```tsx
 * <SafeArea edges={["top"]} gutter={12} as="header">…</SafeArea>
 * <SafeArea edges={["bottom"]} avoidKeyboard as="footer">…</SafeArea>
 * ```
 */
export function SafeArea({
  children,
  edges = "all",
  gutter = 0,
  asMargin = false,
  avoidKeyboard = false,
  fillViewport = false,
  as: Tag = "div",
  className = "",
  style,
}: SafeAreaProps) {
  const sa = useSafeArea();
  const kb = useKeyboardInset();

  const active: Edge[] =
    edges === "all" ? ["top", "right", "bottom", "left"] : edges === "none" ? [] : edges;

  const val = (edge: Edge) => {
    if (!active.includes(edge)) return undefined;
    const base = sa[edge] + gutter;
    return edge === "bottom" && avoidKeyboard ? base + kb.inset : base;
  };

  const prop = asMargin ? "margin" : "padding";
  const box: CSSProperties = {
    [`${prop}Top`]: val("top"),
    [`${prop}Right`]: val("right"),
    [`${prop}Bottom`]: val("bottom"),
    [`${prop}Left`]: val("left"),
    ...(fillViewport ? { minHeight: "var(--app-height, 100dvh)" } : null),
    ...(avoidKeyboard ? { transition: "padding-bottom 0.22s cubic-bezier(0.16,1,0.3,1)" } : null),
    ...style,
  };

  return <Tag className={className} style={box}>{children}</Tag>;
}

interface SafeAreaSpacerProps {
  edge?: Edge;
  /** px mínimos aunque el dispositivo no reporte inset. Default: 0 */
  min?: number;
  className?: string;
}

/**
 * Espaciador del alto exacto de una inset. Útil al final de una lista
 * scrolleable para que el último item no quede bajo el home indicator.
 */
export function SafeAreaSpacer({ edge = "bottom", min = 0, className = "" }: SafeAreaSpacerProps) {
  const sa = useSafeArea();
  const size = Math.max(sa[edge], min);
  const horizontal = edge === "left" || edge === "right";
  return (
    <div
      aria-hidden
      className={className}
      style={horizontal ? { width: size, flexShrink: 0 } : { height: size, flexShrink: 0 }}
    />
  );
}
