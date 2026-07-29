"use client";

export interface ComparedProduct { id: string; name: string; image?: string; price: string; highlight?: boolean }
export interface CompareSpecRow { id: string; label: string; values: Record<string, React.ReactNode> }
interface ProductComparisonTableProps { products: ComparedProduct[]; specs: CompareSpecRow[]; onSelect?: (id: string) => void; className?: string }
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Comparador de productos lado a lado con tabla de especificaciones. */
export function ProductComparisonTable({ products, specs, onSelect, className = "" }: ProductComparisonTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-border", className)}>
      <table className="w-full border-collapse min-w-[560px]">
        <thead>
          <tr>
            <th className="w-40"/>
            {products.map(p => (
              <th key={p.id} className={cn("px-4 py-4 text-center border-l border-border", p.highlight && "bg-primary/5")}>
                {p.image && <img src={p.image} alt={p.name} className="w-16 h-16 mx-auto rounded-xl object-cover mb-2"/>}
                <p className="text-sm font-bold text-foreground">{p.name}</p>
                <p className="text-xs text-muted mt-0.5">{p.price}</p>
                {onSelect && <button type="button" onClick={() => onSelect(p.id)} className={cn("mt-2 h-8 px-3 rounded-lg text-xs font-bold transition-colors", p.highlight ? "bg-primary text-white" : "border border-border text-foreground hover:bg-surface-alt")}>Elegir</button>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {specs.map(row => (
            <tr key={row.id} className="bg-surface">
              <td className="px-4 py-3 text-sm font-semibold text-foreground bg-surface-alt/40">{row.label}</td>
              {products.map(p => (
                <td key={p.id} className={cn("px-4 py-3 text-center text-sm text-foreground border-l border-border", p.highlight && "bg-primary/[0.03]")}>{row.values[p.id] ?? "—"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
