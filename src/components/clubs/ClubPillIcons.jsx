/**
 * Small stroke icons for club status pills (24×24 viewBox, scale with className).
 * Placed after the label text; inherit colour via currentColor.
 */

const stroke = {
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  fill: "none",
};

export function IconVirtual({ className = "w-3 h-3" }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 24 24" aria-hidden>
      <polygon points="23 7 16 12 23 17 23 7" {...stroke} />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" {...stroke} />
    </svg>
  );
}

export function IconInPerson({ className = "w-3 h-3" }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 24 24" aria-hidden>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" {...stroke} />
      <circle cx="12" cy="10" r="3" {...stroke} />
    </svg>
  );
}

export function IconPublic({ className = "w-3 h-3" }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10" {...stroke} />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" {...stroke} />
    </svg>
  );
}

export function IconPrivate({ className = "w-3 h-3" }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...stroke} />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" {...stroke} />
    </svg>
  );
}
