export function Logo({ size = 40, className = '' }) {
  return (
    <span
      className={`logo-badge ${className}`}
      style={{ width: size, height: size }}
    >
      <img src="/owl-tower.jpg" alt="Towerbell" width={size} height={size} />
    </span>
  )
}
