// =============================================================
//  Tabs — preview version
//  underline · pill · segmented · enclosed · vertical
// =============================================================

const TAB_SIZES = { sm:"h-8 px-3 text-[13px] gap-1.5", md:"h-10 px-4 text-sm gap-2", lg:"h-12 px-5 text-[15px] gap-2" };

function PreviewTabs({
  items, value, onChange, variant = "underline", size = "md",
  fitted = false, scrollable = false, panels, className = "",
}) {
  const vertical = variant === "vertical";
  const listRef = useRef(null);
  const [ind, setInd] = useState(null);

  // el indicador se mide del DOM y se anima con transform/size
  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]');
    if (!el) return;
    setInd({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
  }, [value, variant, size, fitted, items]);

  const move = dir => {
    const enabled = items.filter(i=>!i.disabled);
    const idx = enabled.findIndex(i=>i.id===value);
    const next = enabled[(idx + dir + enabled.length) % enabled.length];
    if (next) onChange(next.id);
  };

  const indClass = {
    underline: "border-b-2 border-primary",
    pill: "rounded-full bg-primary/12",
    segmented: "rounded-lg bg-surface shadow-sm shadow-black/5",
    enclosed: "rounded-t-lg bg-surface border border-border",
    vertical: "rounded-lg bg-primary/12",
  }[variant];

  const list = (
    <div ref={listRef} role="tablist" tabIndex={-1}
      aria-orientation={vertical ? "vertical" : "horizontal"}
      onKeyDown={e=>{
        const prevKey = vertical ? "ArrowUp" : "ArrowLeft", nextKey = vertical ? "ArrowDown" : "ArrowRight";
        if (e.key === nextKey) { e.preventDefault(); move(1); }
        if (e.key === prevKey) { e.preventDefault(); move(-1); }
      }}
      className={cx("relative flex",
        vertical ? "flex-col gap-1 w-full" : "items-center",
        scrollable && !vertical && "overflow-x-auto",
        variant === "underline" && "gap-1 border-b border-border",
        variant === "pill" && "gap-1.5",
        variant === "segmented" && "gap-1 p-1 rounded-xl bg-surface-alt border border-border",
        variant === "enclosed" && "gap-1 px-1 pt-1 rounded-t-xl bg-surface-alt border border-border border-b-0")}>

      {ind && (
        <span aria-hidden className={cx("absolute pointer-events-none", indClass)}
          style={{
            left: ind.x, top: variant === "underline" ? undefined : ind.y,
            bottom: variant === "underline" ? -1 : undefined,
            width: ind.w, height: variant === "underline" ? 2 : ind.h,
            borderBottomColor: variant === "enclosed" ? "var(--color-surface)" : undefined,
            transition: "left 0.3s cubic-bezier(0.16,1,0.3,1), top 0.3s cubic-bezier(0.16,1,0.3,1), width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s ease",
          }}/>
      )}

      {items.map(item => {
        const active = item.id === value;
        return (
          <button key={item.id} role="tab" aria-selected={active} data-active={active}
            disabled={item.disabled} tabIndex={active ? 0 : -1} onClick={()=>onChange(item.id)}
            className={cx("relative inline-flex items-center justify-center font-medium whitespace-nowrap transition-colors outline-none",
              TAB_SIZES[size],
              fitted && !vertical && "flex-1",
              vertical && "justify-start w-full rounded-lg",
              variant === "underline" && "rounded-t-lg",
              variant === "pill" && "rounded-full",
              variant === "segmented" && "rounded-lg",
              variant === "enclosed" && "rounded-t-lg",
              item.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
              active ? "text-foreground" : "text-muted hover:text-foreground")}>
            {item.icon && <span className={active ? "text-primary" : ""}>{item.icon}</span>}
            <span className={active && (variant === "pill" || vertical) ? "text-primary" : ""}>{item.label}</span>
            {item.badge != null && (
              <span className={cx("ml-0.5 rounded-full px-1.5 min-w-[18px] h-[18px] inline-flex items-center justify-center text-[10px] font-bold tabular-nums",
                active ? "bg-primary text-white" : "bg-surface-alt text-muted border border-border")}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  const panel = panels && (
    <div key={value} role="tabpanel" className="min-w-0 flex-1" style={{ animation:"fadeInPanel 0.22s cubic-bezier(0.16,1,0.3,1) both" }}>
      {panels[value]}
    </div>
  );

  if (vertical) {
    return <div className={cx("flex gap-5", className)}><div className="w-48 shrink-0">{list}</div>{panel}</div>;
  }

  return (
    <div className={className}>
      {list}
      {panels && <div className={variant === "enclosed" ? "rounded-b-xl border border-border border-t-0 p-5" : "pt-5"}>{panel}</div>}
    </div>
  );
}

Object.assign(window, { PreviewTabs });
