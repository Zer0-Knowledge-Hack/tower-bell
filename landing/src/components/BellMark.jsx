export function BellMark({ className = 'h-7 w-7' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 3.5v3.2M10.5 9.2h11v2.1h-11z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12.4 11.3h7.2v8.4l-3.6 3.2-3.6-3.2v-8.4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="15.6" r="1.5" fill="#54ADF6" />
    </svg>
  )
}
