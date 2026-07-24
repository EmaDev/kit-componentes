"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface DropdownItem {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  href?: string;
  destructive?: boolean;
  shortcut?: string;
  disabled?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "start" | "end";
  className?: string;
  menuClassName?: string;
}

export function Dropdown({
  trigger,
  items,
  align = "end",
  className = "",
  menuClassName = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <div onClick={() => setOpen((v) => !v)} className="inline-flex">
        {trigger}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ originY: 0, originX: align === "end" ? 1 : 0 }}
            className={[
              "absolute z-50 mt-2 min-w-[220px]",
              align === "end" ? "right-0" : "left-0",
              "rounded-xl border border-border bg-surface shadow-xl shadow-black/10",
              "p-1.5",
              menuClassName,
            ].join(" ")}
          >
            {items.map((item, i) =>
              item.divider ? (
                <div
                  key={`d-${i}`}
                  className="my-1.5 h-px bg-border"
                />
              ) : (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.025 }}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      className={menuItemCls(item)}
                      onClick={() => setOpen(false)}
                    >
                      <DropdownContent item={item} />
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled={item.disabled}
                      onClick={() => {
                        item.onClick?.();
                        setOpen(false);
                      }}
                      className={menuItemCls(item)}
                    >
                      <DropdownContent item={item} />
                    </button>
                  )}
                </motion.div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function menuItemCls(item: DropdownItem) {
  return [
    "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left",
    "transition-colors duration-150",
    "disabled:opacity-40 disabled:pointer-events-none",
    item.destructive
      ? "text-danger hover:bg-danger/10"
      : "text-foreground hover:bg-surface-alt",
  ].join(" ");
}

function DropdownContent({ item }: { item: DropdownItem }) {
  return (
    <>
      {item.icon && (
        <span className="w-4 h-4 inline-flex items-center justify-center shrink-0 opacity-80">
          {item.icon}
        </span>
      )}
      <span className="flex-1 truncate">{item.label}</span>
      {item.shortcut && (
        <span className="text-[11px] text-muted font-mono tracking-wide">
          {item.shortcut}
        </span>
      )}
    </>
  );
}
