export default function BrandMark({ size = 24 }: { size?: number }) {
  return (<svg className="brand-svg" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <rect x="0" y="10" width="4" height="4" fill="var(--ink)" /><rect x="0" y="18" width="4" height="4" fill="var(--ink)" />
    <rect className="bm-l" x="4" y="6" width="12" height="20" fill="var(--ink)" /><rect className="bm-r" x="16" y="6" width="12" height="20" fill="var(--sig)" />
    <rect x="28" y="14" width="4" height="4" fill="var(--sig)" />
    <path d="M9 16 L14 21 L23 12" fill="none" stroke="var(--paper)" strokeWidth="4" strokeLinecap="square" />
  </svg>);
}
