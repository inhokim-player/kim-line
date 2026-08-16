export default function ShieldIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="shieldGlow" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#5B9CFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#5B9CFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="shieldStroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8FC0FF" />
          <stop offset="100%" stopColor="#2F6FED" />
        </linearGradient>
      </defs>

      <circle cx="100" cy="100" r="95" fill="url(#shieldGlow)" />

      <path
        d="M100 15 L165 40 L165 100 C165 150 135 185 100 205 C65 185 35 150 35 100 L35 40 Z"
        fill="rgba(47,111,237,0.10)"
        stroke="url(#shieldStroke)"
        strokeWidth="3"
      />

      {/* 사람 */}
      <g transform="translate(88,42)" fill="#DCE8FF">
        <circle cx="12" cy="7" r="7" />
        <path d="M-1 32 C-1 20 25 20 25 32 Z" />
      </g>

      {/* 집 */}
      <g transform="translate(52,92)" fill="#DCE8FF">
        <path d="M0 20 L20 4 L40 20 V42 H0 Z" />
        <rect x="23" y="26" width="9" height="16" fill="#0B1220" />
      </g>

      {/* 자동차 */}
      <g transform="translate(108,96)" fill="#DCE8FF">
        <path d="M4 10 L10 -2 H30 L36 10 Z" />
        <rect x="0" y="10" width="40" height="14" rx="5" />
        <circle cx="9" cy="26" r="4.5" fill="#0B1220" />
        <circle cx="31" cy="26" r="4.5" fill="#0B1220" />
      </g>
    </svg>
  )
}
