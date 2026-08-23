export function StreetScene() {
  return (
    <svg
      viewBox="0 0 1100 440"
      className="h-auto w-full"
      role="img"
      aria-labelledby="street-title street-desc"
    >
      <title id="street-title">A walker on a Buenos Aires sidewalk</title>
      <desc id="street-desc">
        Five shopfronts. Only the café and the kiosco sit inside the walker’s
        range.
      </desc>
      <defs>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 6L6 0" stroke="#0A110F" strokeWidth="0.4" opacity="0.25" />
        </pattern>
        <pattern id="stripe" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#0D47A1" />
          <rect width="4" height="8" fill="#F4F1EA" />
        </pattern>
      </defs>

      <rect width="1100" height="440" fill="#EBE6DA" />
      <rect x="0" y="0" width="1100" height="168" fill="#F4F1EA" />

      {/* distant cornice line */}
      <line x1="0" y1="168" x2="1100" y2="168" stroke="#C9C2B3" strokeWidth="1" />

      {/* out of range — librería */}
      <g opacity="0.38">
        <rect x="36" y="168" width="168" height="192" fill="#F4F1EA" stroke="#0A110F" />
        <rect x="36" y="168" width="168" height="192" fill="url(#hatch)" />
        <rect x="36" y="148" width="168" height="22" fill="#0A110F" />
        <text x="120" y="164" textAnchor="middle" fill="#F4F1EA" fontFamily="IBM Plex Mono, monospace" fontSize="10">
          LIBRERÍA
        </text>
        <rect x="52" y="200" width="56" height="70" fill="#EBE6DA" stroke="#0A110F" />
        <rect x="128" y="200" width="56" height="70" fill="#EBE6DA" stroke="#0A110F" />
        <rect x="90" y="292" width="52" height="68" fill="#EBE6DA" stroke="#0A110F" />
      </g>

      {/* in range — café */}
      <g>
        <rect x="214" y="132" width="196" height="228" fill="#F4F1EA" stroke="#0A110F" />
        <rect x="214" y="112" width="196" height="24" fill="#0D47A1" />
        <text x="312" y="129" textAnchor="middle" fill="#F4F1EA" fontFamily="IBM Plex Mono, monospace" fontSize="11">
          CAFÉ RIVADAVIA
        </text>
        <path d="M222 156h180l8 22H214z" fill="url(#stripe)" stroke="#0A110F" />
        <rect x="232" y="196" width="72" height="86" fill="#54ADF6" stroke="#0A110F" opacity="0.55" />
        <rect x="320" y="196" width="72" height="86" fill="#54ADF6" stroke="#0A110F" opacity="0.55" />
        <line x1="268" y1="196" x2="268" y2="282" stroke="#0A110F" />
        <line x1="356" y1="196" x2="356" y2="282" stroke="#0A110F" />
        <rect x="286" y="292" width="52" height="68" fill="#EBE6DA" stroke="#0A110F" />
        <circle cx="328" cy="328" r="2" fill="#0A110F" />
      </g>

      {/* in range — kiosco */}
      <g>
        <rect x="420" y="196" width="148" height="164" fill="#F4F1EA" stroke="#0A110F" />
        <rect x="420" y="176" width="148" height="22" fill="#0A110F" />
        <text x="494" y="192" textAnchor="middle" fill="#F4F1EA" fontFamily="IBM Plex Mono, monospace" fontSize="10">
          KIOSCO 25
        </text>
        <rect x="434" y="226" width="120" height="58" fill="#54ADF6" stroke="#0A110F" opacity="0.4" />
        <line x1="474" y1="226" x2="474" y2="284" stroke="#0A110F" />
        <line x1="514" y1="226" x2="514" y2="284" stroke="#0A110F" />
        <rect x="468" y="296" width="52" height="64" fill="#EBE6DA" stroke="#0A110F" />
      </g>

      {/* edge — farmacia */}
      <g opacity="0.72">
        <rect x="578" y="150" width="176" height="210" fill="#F4F1EA" stroke="#0A110F" />
        <rect x="578" y="130" width="176" height="22" fill="#0D47A1" />
        <text x="666" y="146" textAnchor="middle" fill="#F4F1EA" fontFamily="IBM Plex Mono, monospace" fontSize="10">
          FARMACIA
        </text>
        <rect x="598" y="184" width="56" height="72" fill="#EBE6DA" stroke="#0A110F" />
        <rect x="676" y="184" width="56" height="72" fill="#EBE6DA" stroke="#0A110F" />
        <path d="M652 268h28v-10h10v28h-10v10h-28v-10h-10v-28h10z" fill="#0D47A1" />
        <rect x="640" y="300" width="50" height="60" fill="#EBE6DA" stroke="#0A110F" />
      </g>

      {/* out of range — tech */}
      <g opacity="0.34">
        <rect x="764" y="168" width="188" height="192" fill="#F4F1EA" stroke="#0A110F" />
        <rect x="764" y="168" width="188" height="192" fill="url(#hatch)" />
        <rect x="764" y="148" width="188" height="22" fill="#0A110F" />
        <text x="858" y="164" textAnchor="middle" fill="#F4F1EA" fontFamily="IBM Plex Mono, monospace" fontSize="10">
          TALLER
        </text>
        <rect x="786" y="200" width="64" height="78" fill="#EBE6DA" stroke="#0A110F" />
        <rect x="866" y="200" width="64" height="78" fill="#EBE6DA" stroke="#0A110F" />
        <rect x="828" y="292" width="56" height="68" fill="#EBE6DA" stroke="#0A110F" />
      </g>

      {/* sidewalk */}
      <rect x="0" y="360" width="1100" height="80" fill="#E4DFD2" />
      <line x1="0" y1="360" x2="1100" y2="360" stroke="#0A110F" strokeWidth="1.4" />
      <line
        x1="0"
        y1="388"
        x2="1100"
        y2="388"
        stroke="#C9C2B3"
        strokeWidth="1"
        strokeDasharray="10 8"
      />

      {/* range */}
      <path
        d="M248 360 A 196 92 0 0 1 640 360"
        fill="none"
        stroke="#54ADF6"
        strokeWidth="1.6"
        strokeDasharray="5 6"
      />
      <text
        x="318"
        y="300"
        fill="#0D47A1"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="10"
        letterSpacing="1.4"
      >
        RANGE
      </text>

      {/* walker */}
      <g transform="translate(430 304)" fill="none" stroke="#0A110F" strokeWidth="1.6">
        <circle cx="10" cy="8" r="6" />
        <path d="M10 14v22M10 22l-11 14M10 22l12 8M10 36l-7 20M10 36l9 20" />
      </g>
    </svg>
  )
}
