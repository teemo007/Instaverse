import { useId } from "react";

interface KapsuleMarkProps {
  size?: number;
  className?: string;
  title?: string;
}

/** The Kapsule app icon: a two-tone time capsule with a sparkle. */
const KapsuleMark = ({ size = 32, className, title }: KapsuleMarkProps) => {
  const id = useId().replace(/:/g, "");
  const pink = `kp-pink-${id}`;
  const cyan = `kp-cyan-${id}`;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id={pink} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF9BE4" />
          <stop offset="1" stopColor="#FF4FB8" />
        </linearGradient>
        <linearGradient id={cyan} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A6FBFF" />
          <stop offset="1" stopColor="#3EDCF2" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="#151527" />
      <g transform="rotate(-35 24 24)">
        <path d="M24 12H17A12 12 0 0 0 17 36H24Z" fill={`url(#${pink})`} />
        <path d="M24 12H31A12 12 0 0 1 31 36H24Z" fill={`url(#${cyan})`} />
        <rect x="23" y="12" width="2" height="24" fill="#151527" />
        <rect x="11" y="16" width="9" height="2.6" rx="1.3" fill="#fff" opacity="0.55" />
      </g>
      <path
        d="M33 9C33.5 12 35 13.5 38 14C35 14.5 33.5 16 33 19C32.5 16 31 14.5 28 14C31 13.5 32.5 12 33 9Z"
        fill="#FFF27A"
      />
    </svg>
  );
};

export default KapsuleMark;
