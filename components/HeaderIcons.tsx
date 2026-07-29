const svg = {
  width: 20, height: 20, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 2,
  strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
};

export function ChevronLeftIcon() {
  return <svg {...svg} width="22" height="22" strokeWidth={2.4}><polyline points="15 18 9 12 15 6" /></svg>;
}
export function SearchIcon() {
  return <svg {...svg}><circle cx="11" cy="11" r="7" /><line x1="20" y1="20" x2="16.7" y2="16.7" /></svg>;
}
