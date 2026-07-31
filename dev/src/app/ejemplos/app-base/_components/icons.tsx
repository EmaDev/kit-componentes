import type { ReactNode, SVGProps } from "react";

function Svg({ d, ...p }: { d: ReactNode } & Omit<SVGProps<SVGSVGElement>, "d">) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      {d}
    </svg>
  );
}

export const HomeIcon = () => (
  <Svg
    d={
      <g>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
      </g>
    }
  />
);

export const ActivityIcon = () => <Svg d={<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />} />;

export const UserIcon = () => (
  <Svg
    d={
      <g>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
      </g>
    }
  />
);

export const PlusIcon = () => (
  <Svg
    d={
      <g>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </g>
    }
    strokeWidth="2.5"
  />
);

export const SearchIcon = () => (
  <Svg
    d={
      <g>
        <circle cx="11" cy="11" r="7" />
        <line x1="16.5" y1="16.5" x2="21" y2="21" />
      </g>
    }
  />
);

export const ShareIcon = () => (
  <Svg
    d={
      <g>
        <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="14" />
      </g>
    }
  />
);

export const BoltIcon = () => <Svg d={<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />} />;

export const TargetIcon = () => (
  <Svg
    d={
      <g>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4.5" />
      </g>
    }
  />
);

export const ListIcon = () => (
  <Svg
    d={
      <g>
        <line x1="9" y1="6" x2="20" y2="6" />
        <line x1="9" y1="12" x2="20" y2="12" />
        <line x1="9" y1="18" x2="20" y2="18" />
        <circle cx="4.5" cy="6" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="4.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="4.5" cy="18" r="1.2" fill="currentColor" stroke="none" />
      </g>
    }
  />
);
