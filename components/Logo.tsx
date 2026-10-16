export default function Logo({ src, name, size = 28, className = "" }: { src: string | null; name: string; size?: number; className?: string }) {
  if (src) return <span className={`logo ${className}`} style={{ width: size, height: size }}><img src={src} alt="" width={size} height={size} loading="lazy" decoding="async" /></span>;
  const mono = name.replace(/\(.*?\)/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  return <span className={`logo mono-tile ${className}`} style={{ width: size, height: size, fontSize: size * 0.4 }} aria-hidden="true">{mono}</span>;
}
