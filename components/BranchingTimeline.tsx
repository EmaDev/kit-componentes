"use client";

export interface BranchNode { id: string; title: string; time: string; status: "done" | "current" | "pending"; children?: BranchNode[] }
interface BranchingTimelineProps { nodes: BranchNode[]; className?: string }

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const DOT: Record<BranchNode["status"], string> = { done: "bg-success text-white", current: "bg-primary text-white", pending: "bg-surface-alt text-muted border border-border" };

function Dot({ status }: { status: BranchNode["status"] }) {
  return (
    <span className={cn("w-6 h-6 rounded-full shrink-0 inline-flex items-center justify-center", DOT[status])}>
      {status === "done" && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
      {status === "current" && <span className="w-2 h-2 rounded-full bg-white animate-pulse"/>}
    </span>
  );
}

function Branch({ node, isLast }: { node: BranchNode; isLast: boolean }) {
  const kids = node.children ?? [];
  return (
    <li className="relative pb-6 last:pb-0">
      {!isLast && <span className="absolute left-[11px] top-6 bottom-0 w-px bg-border"/>}
      <div className="flex gap-3">
        <Dot status={node.status}/>
        <div className="min-w-0 pt-0.5">
          <p className={cn("text-sm font-semibold", node.status === "pending" ? "text-muted" : "text-foreground")}>{node.title}</p>
          <p className="mt-0.5 text-[11px] font-medium text-muted/80">{node.time}</p>
        </div>
      </div>
      {kids.length > 0 && (
        <div className="ml-[11px] pl-6 mt-2 border-l border-dashed border-border space-y-2">
          {kids.map(k => (
            <div key={k.id} className="flex gap-2.5 items-start">
              <Dot status={k.status}/>
              <div className="min-w-0 pt-0.5">
                <p className={cn("text-[13px] font-medium", k.status === "pending" ? "text-muted" : "text-foreground")}>{k.title}</p>
                <p className="text-[11px] text-muted/80">{k.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </li>
  );
}

/** Timeline con ramas: un tronco principal y sub-eventos paralelos (ej. un pedido dividido en dos envíos). */
export function BranchingTimeline({ nodes, className = "" }: BranchingTimelineProps) {
  return <ol className={cn("space-y-0", className)}>{nodes.map((n, i) => <Branch key={n.id} node={n} isLast={i === nodes.length - 1}/>)}</ol>;
}
