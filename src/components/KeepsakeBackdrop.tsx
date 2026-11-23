export default function KeepsakeBackdrop() {
  return (
    <div aria-hidden="true" className="keepsake-backdrop">
      <svg
        className="keepsake-burst"
        viewBox="-250 -250 500 500"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
      >
        <defs>
          <radialGradient id="keepsake-halo">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.24" />
            <stop offset="0.4" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="keepsake-core-glow">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="0.42" stopColor="#d4d4d4" stopOpacity="0.3" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <pattern id="keepsake-glyphs" width="32" height="32" patternUnits="userSpaceOnUse">
            <text x="2" y="12" fill="#f1f1f1" fontFamily="monospace" fontSize="10">· + .</text>
            <text x="10" y="28" fill="#aaaaaa" fontFamily="monospace" fontSize="10">: * ·</text>
          </pattern>
          <mask id="keepsake-sun-mask" maskUnits="userSpaceOnUse" x="-250" y="-250" width="500" height="500">
            <rect x="-250" y="-250" width="500" height="500" fill="black" />
            <g fill="white">
              <circle r="34" />
              <path d="M-8-28 0-232 8-28Z" />
              <path d="M-8-28 0-232 8-28Z" transform="rotate(30)" />
              <path d="M-8-28 0-232 8-28Z" transform="rotate(60)" />
              <path d="M-8-28 0-232 8-28Z" transform="rotate(90)" />
              <path d="M-8-28 0-232 8-28Z" transform="rotate(120)" />
              <path d="M-8-28 0-232 8-28Z" transform="rotate(150)" />
              <path d="M-8-28 0-232 8-28Z" transform="rotate(180)" />
              <path d="M-8-28 0-232 8-28Z" transform="rotate(210)" />
              <path d="M-8-28 0-232 8-28Z" transform="rotate(240)" />
              <path d="M-8-28 0-232 8-28Z" transform="rotate(270)" />
              <path d="M-8-28 0-232 8-28Z" transform="rotate(300)" />
              <path d="M-8-28 0-232 8-28Z" transform="rotate(330)" />
            </g>
          </mask>
        </defs>

        <circle r="240" fill="url(#keepsake-halo)" />
        <circle r="174" fill="none" stroke="#ffffff" strokeOpacity="0.07" />
        <circle r="112" fill="none" stroke="#d4d4d4" strokeOpacity="0.07" />
        <g className="keepsake-ray-field">
          <rect x="-250" y="-250" width="500" height="500" fill="url(#keepsake-glyphs)" mask="url(#keepsake-sun-mask)" />
          <g fill="#f1f1f1" fillOpacity="0.32" shapeRendering="crispEdges">
            <path d="M-2-38h4v14h-4zm-2-28h8v18h-8zm1-34h6v22h-6zm-3-39h10v28h-10zm2-50h6v38h-6z" />
            <path d="M-2-38h4v18h-4zm-1-30h6v20h-6zm-3-40h10v26h-10zm2-47h6v36h-6z" transform="rotate(25.2)" />
            <path d="M-2-38h4v14h-4zm-2-28h8v18h-8zm1-34h6v22h-6zm-3-39h10v28h-10zm2-50h6v38h-6z" transform="rotate(60.8)" />
            <path d="M-2-38h4v18h-4zm-1-30h6v20h-6zm-3-40h10v26h-10zm2-47h6v36h-6z" transform="rotate(91.5)" />
            <path d="M-2-38h4v14h-4zm-2-28h8v18h-8zm1-34h6v22h-6zm-3-39h10v28h-10zm2-50h6v38h-6z" transform="rotate(123.3)" />
            <path d="M-2-38h4v18h-4zm-1-30h6v20h-6zm-3-40h10v26h-10zm2-47h6v36h-6z" transform="rotate(148.4)" />
            <path d="M-2-38h4v14h-4zm-2-28h8v18h-8zm1-34h6v22h-6zm-3-39h10v28h-10zm2-50h6v38h-6z" transform="rotate(181.2)" />
            <path d="M-2-38h4v18h-4zm-1-30h6v20h-6zm-3-40h10v26h-10zm2-47h6v36h-6z" transform="rotate(213.5)" />
            <path d="M-2-38h4v14h-4zm-2-28h8v18h-8zm1-34h6v22h-6zm-3-39h10v28h-10zm2-50h6v38h-6z" transform="rotate(237.1)" />
            <path d="M-2-38h4v18h-4zm-1-30h6v20h-6zm-3-40h10v26h-10zm2-47h6v36h-6z" transform="rotate(271.7)" />
            <path d="M-2-38h4v14h-4zm-2-28h8v18h-8zm1-34h6v22h-6zm-3-39h10v28h-10zm2-50h6v38h-6z" transform="rotate(299.5)" />
            <path d="M-2-38h4v18h-4zm-1-30h6v20h-6zm-3-40h10v26h-10zm2-47h6v36h-6z" transform="rotate(334.1)" />
          </g>
        </g>
        <circle className="keepsake-core-glow" r="56" fill="url(#keepsake-core-glow)" />
        <path
          d="M-18-18h12v12h-12zm18 0h12v12H0zm-18 18h12v12h-12zm18 0h12v12H0zm-9-9h12v12h-12z"
          fill="#ffffff"
          fillOpacity="0.78"
          shapeRendering="crispEdges"
        />
      </svg>
      <div className="keepsake-vignette" />
    </div>
  );
}
