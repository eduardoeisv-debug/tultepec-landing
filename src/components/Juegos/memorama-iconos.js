// Dibujos originales del memorama (SVG en línea, 64x64) y su color de
// fondo. Los nombres mostrados NO viven aquí -- cada `id` se traduce en
// MemoramaTultepec.jsx vía t("juegos.memorama.carta.<id>") en strings.js,
// para que el memorama funcione en español e inglés.

const T = '#1a1038'; // tinta
const N = '#ff5a36'; // naranja fuego
const A = '#ffb627'; // ámbar
const C = '#8b5a3c'; // café

const abre = '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">';
const base = `fill="none" stroke="${T}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"`;

export const ICONOS = [
  {
    id: 'cohete',
    color: '#9fe8d5',
    svg: `${abre}<g ${base}>
      <path d="M32 60V36"/>
      <path d="M26 30l-6 8h6zM38 30l6 8h-6z" fill="${A}"/>
      <rect x="26" y="18" width="12" height="18" rx="2" fill="${N}"/>
      <path d="M26 18l6-10 6 10z" fill="${A}"/>
      <path d="M32 2v2M23 6l1.5 1.5M41 6l-1.5 1.5"/>
    </g></svg>`,
  },
  {
    id: 'castillo',
    color: '#ffe27a',
    svg: `${abre}<g ${base}>
      <path d="M24 60V12M40 60V12"/>
      <path d="M24 60h16M24 48h16M24 36h16M24 24h16M24 12h16"/>
      <path d="M24 60l16-12M40 60l-16-12M24 48l16-12M40 48l-16-12M24 36l16-12M40 36l-16-12M24 24l16-12M40 24l-16-12"/>
      <path d="M32 12V5"/>
      <circle cx="32" cy="4" r="2" fill="${A}"/>
      <g stroke="${N}">
        <circle cx="11" cy="42" r="8"/>
        <path d="M11 34v16M3 42h16M5.3 36.3l11.4 11.4M16.7 36.3L5.3 47.7M19 42h5"/>
        <circle cx="53" cy="30" r="8"/>
        <path d="M53 22v16M45 30h16M47.3 24.3l11.4 11.4M58.7 24.3L47.3 35.7M40 30h5"/>
      </g>
    </g></svg>`,
  },
  {
    id: 'torito',
    color: '#ffc48a',
    svg: `${abre}<g ${base}>
      <path d="M12 16c-5 9 0 17 10 15"/>
      <path d="M52 16c5 9 0 17-10 15"/>
      <path d="M20 28l-8-2 4 7zM44 28l8-2-4 7z" fill="${C}"/>
      <path d="M20 26c4-3 20-3 24 0l-3 22c-2 6-16 6-18 0z" fill="${C}"/>
      <ellipse cx="32" cy="46" rx="7" ry="5" fill="#f1c7a0"/>
      <circle cx="26" cy="35" r="1.8" fill="${T}" stroke="none"/>
      <circle cx="38" cy="35" r="1.8" fill="${T}" stroke="none"/>
      <circle cx="29.5" cy="46" r="1.2" fill="${T}" stroke="none"/>
      <circle cx="34.5" cy="46" r="1.2" fill="${T}" stroke="none"/>
      <circle cx="32" cy="53" r="3" stroke="${N}"/>
      <path d="M32 4v6M24 8l3 4M40 8l-3 4" stroke="${N}"/>
    </g></svg>`,
  },
  {
    id: 'rueda',
    color: '#b9d7ff',
    svg: `${abre}<g ${base}>
      <circle cx="32" cy="32" r="16"/>
      <path d="M32 16v32M16 32h32M20.7 20.7l22.6 22.6M43.3 20.7L20.7 43.3"/>
      <circle cx="32" cy="32" r="3.5" fill="${A}"/>
      <path d="M32 4v6M32 54v6M4 32h6M54 32h6M12 12l4 4M52 12l-4 4M12 52l4-4M52 52l-4-4" stroke="${N}"/>
    </g></svg>`,
  },
  {
    id: 'volcan',
    color: '#dcc3ff',
    svg: `${abre}<g ${base}>
      <path d="M32 26V8M32 26L22 10M32 26l10-16M32 26L16 18M32 26l16-8" stroke="${N}"/>
      <circle cx="32" cy="6" r="2.5" fill="${A}"/>
      <circle cx="21" cy="8" r="2" fill="${A}"/>
      <circle cx="43" cy="8" r="2" fill="${A}"/>
      <circle cx="14" cy="17" r="2" fill="${A}"/>
      <circle cx="50" cy="17" r="2" fill="${A}"/>
      <path d="M10 58L26 30h12l16 28z" fill="${C}"/>
    </g></svg>`,
  },
  {
    id: 'bengala',
    color: '#ffb3c7',
    svg: `${abre}<g ${base}>
      <path d="M32 60V28" stroke-width="3"/>
      <path d="M32 6v10M19 9l7 7M45 9l-7 7M10 22h10M44 22h10M16 36l7-7M48 36l-7-7"/>
      <circle cx="32" cy="22" r="5" fill="${N}"/>
    </g></svg>`,
  },
  {
    id: 'papel',
    color: '#c9f08f',
    svg: `${abre}<g ${base}>
      <path d="M4 14Q32 26 60 14"/>
      <path d="M7 16.5h14v20l-3.5-4-3.5 4-3.5-4-3.5 4z" fill="#ff4fa3"/>
      <path d="M25 20h14v20l-3.5-4-3.5 4-3.5-4-3.5 4z" fill="#ffe45e"/>
      <path d="M43 16.5h14v20l-3.5-4-3.5 4-3.5-4-3.5 4z" fill="#38b6ff"/>
      <path d="M14 22l2.5 3-2.5 3-2.5-3zM32 25.5l2.5 3-2.5 3-2.5-3zM50 22l2.5 3-2.5 3-2.5-3z" fill="${T}" stroke="none"/>
    </g></svg>`,
  },
  {
    id: 'parroquia',
    color: '#ff9e8a',
    svg: `${abre}<g ${base}>
      <path d="M10 58V34l22-10 22 10v24z" fill="#ffffff"/>
      <path d="M25 26V14h14v12" fill="#ffffff"/>
      <path d="M25 14l7-6 7 6" fill="${N}"/>
      <path d="M32 8V2M29 4h6"/>
      <circle cx="32" cy="19.5" r="2.5" fill="${A}"/>
      <path d="M27 58V46a5 5 0 0 1 10 0v12" fill="${A}"/>
    </g></svg>`,
  },
];
