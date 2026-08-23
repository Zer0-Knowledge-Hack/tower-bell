export function StreetScene() {
  return (
    <svg
      viewBox="0 0 1100 440"
      className="h-auto w-full"
      role="img"
      aria-labelledby="street-title street-desc"
      style={{ imageRendering: 'pixelated' }}
    >
      <title id="street-title">A walker on a Buenos Aires sidewalk</title>
      <desc id="street-desc">
        Five shopfronts. Only the café and the kiosco sit inside the walker’s
        range.
      </desc>
      <defs>
        <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 8L8 0" stroke="#5CE1FF" strokeWidth="1" opacity="0.18" />
        </pattern>
        <pattern id="stripe" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#0A1224" />
          <rect width="4" height="8" fill="#5CE1FF" />
        </pattern>
        <pattern id="stars" width="48" height="48" patternUnits="userSpaceOnUse">
          <rect width="2" height="2" x="8" y="12" fill="#5CE1FF" opacity="0.55" />
          <rect width="2" height="2" x="28" y="6" fill="#F0A43A" opacity="0.45" />
          <rect width="2" height="2" x="40" y="30" fill="#5CE1FF" opacity="0.35" />
        </pattern>
      </defs>

      <rect width="1100" height="440" fill="#020617" />
      <rect x="0" y="0" width="1100" height="168" fill="#050814" />
      <rect x="0" y="0" width="1100" height="168" fill="url(#stars)" />

      <line x1="0" y1="168" x2="1100" y2="168" stroke="#1CFFFF" strokeWidth="2" opacity="0.35" />

      {/* out of range — librería */}
      <g opacity="0.42">
        <rect x="36" y="168" width="168" height="192" fill="#0A1224" stroke="#5CE1FF" strokeWidth="2" />
        <rect x="36" y="168" width="168" height="192" fill="url(#hatch)" />
        <rect x="36" y="148" width="168" height="22" fill="#5CE1FF" />
        <text x="120" y="164" textAnchor="middle" fill="#020617" fontFamily="VT323, monospace" fontSize="14">
          LIBRERÍA
        </text>
        <rect x="52" y="200" width="56" height="70" fill="#050814" stroke="#5CE1FF" strokeWidth="2" />
        <rect x="128" y="200" width="56" height="70" fill="#050814" stroke="#5CE1FF" strokeWidth="2" />
        <rect x="90" y="292" width="52" height="68" fill="#050814" stroke="#5CE1FF" strokeWidth="2" />
      </g>

      {/* in range — café */}
      <g>
        <rect x="214" y="132" width="196" height="228" fill="#0A1224" stroke="#5CE1FF" strokeWidth="2" />
        <rect x="214" y="112" width="196" height="24" fill="#F0A43A" />
        <text x="312" y="130" textAnchor="middle" fill="#020617" fontFamily="VT323, monospace" fontSize="15">
          CAFÉ RIVADAVIA
        </text>
        <path d="M222 156h180l8 22H214z" fill="url(#stripe)" stroke="#5CE1FF" strokeWidth="2" />
        <rect x="232" y="196" width="72" height="86" fill="#5CE1FF" stroke="#5CE1FF" opacity="0.35" />
        <rect x="320" y="196" width="72" height="86" fill="#5CE1FF" stroke="#5CE1FF" opacity="0.35" />
        <line x1="268" y1="196" x2="268" y2="282" stroke="#5CE1FF" strokeWidth="2" />
        <line x1="356" y1="196" x2="356" y2="282" stroke="#5CE1FF" strokeWidth="2" />
        <rect x="286" y="292" width="52" height="68" fill="#050814" stroke="#5CE1FF" strokeWidth="2" />
        <rect x="326" y="326" width="4" height="4" fill="#3DFF9A" />
      </g>

      {/* in range — kiosco */}
      <g>
        <rect x="420" y="196" width="148" height="164" fill="#0A1224" stroke="#5CE1FF" strokeWidth="2" />
        <rect x="420" y="176" width="148" height="22" fill="#5CE1FF" />
        <text x="494" y="192" textAnchor="middle" fill="#020617" fontFamily="VT323, monospace" fontSize="14">
          KIOSCO 25
        </text>
        <rect x="434" y="226" width="120" height="58" fill="#5CE1FF" stroke="#5CE1FF" opacity="0.28" />
        <line x1="474" y1="226" x2="474" y2="284" stroke="#5CE1FF" strokeWidth="2" />
        <line x1="514" y1="226" x2="514" y2="284" stroke="#5CE1FF" strokeWidth="2" />
        <rect x="468" y="296" width="52" height="64" fill="#050814" stroke="#5CE1FF" strokeWidth="2" />
      </g>

      {/* edge — farmacia */}
      <g opacity="0.7">
        <rect x="578" y="150" width="176" height="210" fill="#0A1224" stroke="#5CE1FF" strokeWidth="2" />
        <rect x="578" y="130" width="176" height="22" fill="#F0A43A" />
        <text x="666" y="146" textAnchor="middle" fill="#020617" fontFamily="VT323, monospace" fontSize="14">
          FARMACIA
        </text>
        <rect x="598" y="184" width="56" height="72" fill="#050814" stroke="#5CE1FF" strokeWidth="2" />
        <rect x="676" y="184" width="56" height="72" fill="#050814" stroke="#5CE1FF" strokeWidth="2" />
        <path d="M652 268h28v-10h10v28h-10v10h-28v-10h-10v-28h10z" fill="#3DFF9A" />
        <rect x="640" y="300" width="50" height="60" fill="#050814" stroke="#5CE1FF" strokeWidth="2" />
      </g>

      {/* out of range — tech */}
      <g opacity="0.38">
        <rect x="764" y="168" width="188" height="192" fill="#0A1224" stroke="#5CE1FF" strokeWidth="2" />
        <rect x="764" y="168" width="188" height="192" fill="url(#hatch)" />
        <rect x="764" y="148" width="188" height="22" fill="#5CE1FF" />
        <text x="858" y="164" textAnchor="middle" fill="#020617" fontFamily="VT323, monospace" fontSize="14">
          TALLER
        </text>
        <rect x="786" y="200" width="64" height="78" fill="#050814" stroke="#5CE1FF" strokeWidth="2" />
        <rect x="866" y="200" width="64" height="78" fill="#050814" stroke="#5CE1FF" strokeWidth="2" />
        <rect x="828" y="292" width="56" height="68" fill="#050814" stroke="#5CE1FF" strokeWidth="2" />
      </g>

      {/* sidewalk */}
      <rect x="0" y="360" width="1100" height="80" fill="#0A1224" />
      <line x1="0" y1="360" x2="1100" y2="360" stroke="#5CE1FF" strokeWidth="2" />
      <line
        x1="0"
        y1="388"
        x2="1100"
        y2="388"
        stroke="#5CE1FF"
        strokeWidth="2"
        strokeDasharray="12 10"
        opacity="0.35"
      />

      {/* range */}
      <path
        d="M248 360 A 196 92 0 0 1 640 360"
        fill="none"
        stroke="#5CE1FF"
        strokeWidth="2"
        strokeDasharray="6 6"
      />
      <text
        x="318"
        y="300"
        fill="#F0A43A"
        fontFamily="VT323, monospace"
        fontSize="14"
        letterSpacing="2"
      >
        RANGE
      </text>

      {/* walker — pixel stick figure */}
      <g transform="translate(430 304)" fill="#E8F7FF" stroke="none">
        <rect x="6" y="2" width="8" height="8" />
        <rect x="8" y="10" width="4" height="18" />
        <rect x="0" y="14" width="8" height="3" />
        <rect x="12" y="14" width="8" height="3" />
        <rect x="4" y="28" width="4" height="14" />
        <rect x="12" y="28" width="4" height="14" />
      </g>
    </svg>
  )
}
