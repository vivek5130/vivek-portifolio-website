import type { IconName } from "@/lib/data";

/** Hand-drawn 24px line icon set — one stroke system across the whole site. */
const paths: Record<IconName, React.ReactNode> = {
  brain: (
    <>
      <path d="M9.5 4.5a2.5 2.5 0 0 0-4.6 1.4A3 3 0 0 0 3.5 11a3 3 0 0 0 1.6 4.6A2.8 2.8 0 0 0 9.5 18V4.5Z" />
      <path d="M14.5 4.5a2.5 2.5 0 0 1 4.6 1.4 3 3 0 0 1 1.4 5.1 3 3 0 0 1-1.6 4.6 2.8 2.8 0 0 1-4.4 2.4V4.5Z" />
      <path d="M9.5 9H7.5M14.5 9h2M9.5 13.5H8M14.5 13.5H16" />
      <circle cx="12" cy="20.5" r="1" />
    </>
  ),
  code: <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />,
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12.5 9 5 9-5M3 16.5l9 5 9-5" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="2.5" />
      <path d="M4.5 5.5v13c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-13M4.5 12c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5" />
    </>
  ),
  workflow: (
    <>
      <rect x="3" y="3" width="6" height="6" rx="1.5" />
      <rect x="15" y="15" width="6" height="6" rx="1.5" />
      <path d="M9 6h5a3 3 0 0 1 3 3v6M15 18h-5a3 3 0 0 1-3-3V9" />
    </>
  ),
  cloud: <path d="M7 18.5a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 9a4.75 4.75 0 0 1-.5 9.5H7Z" />,
  chart: (
    <>
      <path d="M3.5 20.5h17" />
      <path d="M6.5 17v-5M11 17V7M15.5 17v-8M20 17v-3" />
    </>
  ),
  paper: (
    <>
      <path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8l-5-5Z" />
      <path d="M14 3v5h5M8.5 12.5h7M8.5 16h5" />
    </>
  ),
  trophy: (
    <>
      <path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0V4Z" />
      <path d="M7.5 6H4.5a3 3 0 0 0 3 4M16.5 6h3a3 3 0 0 1-3 4M12 13.5V17M8.5 20.5h7M9.5 17h5v3.5h-5z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </>
  ),
  phone: <path d="M5 3.5h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 6.6 6.6l1.4-2.3 4.5 1.8V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5Z" />,
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  github: (
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M7.5 10.5V17M7.5 7.2v.1M11.5 17v-6.5M11.5 13.2c0-1.6 1.2-2.7 2.6-2.7s2.4 1 2.4 2.7V17" />
    </>
  ),
  leetcode: (
    <>
      <path d="M13.5 3.5 6.8 10.3a2.4 2.4 0 0 0 0 3.4l4.2 4.2a2.4 2.4 0 0 0 3.4 0l2.1-2.1" />
      <path d="M9.5 12h9" />
      <path d="m10 6.5 2.6-2.6" />
    </>
  ),
  download: <path d="M12 3.5v12M7 11l5 5 5-5M4.5 20.5h15" />,
  arrow: <path d="M4.5 12h15M13.5 6l6 6-6 6" />,
  external: <path d="M14 4.5h5.5V10M19.5 4.5 11 13M18 14.5v4A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6h4" />,
  spark: <path d="M12 3c.6 4.6 3.4 7.4 9 9-5.6 1.6-8.4 4.4-9 9-.6-4.6-3.4-7.4-9-9 5.6-1.6 8.4-4.4 9-9Z" />,
  command: <path d="M9 6.5V17.5M15 6.5v11M9 9h6M9 15h6M9 6.5A2.5 2.5 0 1 0 6.5 9H9M15 6.5A2.5 2.5 0 1 1 17.5 9H15M9 17.5A2.5 2.5 0 1 1 6.5 15H9M15 17.5a2.5 2.5 0 1 0 2.5-2.5H15" />,
  copy: (
    <>
      <rect x="8" y="8" width="12.5" height="12.5" rx="2" />
      <path d="M16 8V5.5A2 2 0 0 0 14 3.5H5.5a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2H8" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  cap: (
    <>
      <path d="m12 4 10 5-10 5L2 9l10-5Z" />
      <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6" />
    </>
  ),
  bolt: <path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12l1-8Z" />,
  chat: <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v10a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V17h0A1.5 1.5 0 0 1 4 15.5v-10ZM8 9h8M8 12.5h5" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.4-4.4" />
    </>
  ),
  close: <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />,
  menu: <path d="M4 7h16M4 12h10M4 17h16" />,
  shield: (
    <>
      <path d="M12 3 19 6v5.5c0 4.3-2.9 8-7 9.5-4.1-1.5-7-5.2-7-9.5V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  play: <path d="M7 4.5v15l12-7.5-12-7.5Z" />,
  pause: <path d="M8 5v14M16 5v14" />,
  stop: <rect x="6" y="6" width="12" height="12" rx="2" />,
  music: (
    <>
      <path d="M9 18V5.5l11-2V16" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="16" r="2.5" />
    </>
  ),
};

type Props = { name: IconName; size?: number; className?: string; strokeWidth?: number };

export function Icon({ name, size = 20, className, strokeWidth = 1.5 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
