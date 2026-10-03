// Insignia de Tultepec: ilustración de torito (proporcionada por el
// usuario, public/images/logo/torito-folk.png) recortada en círculo sin
// deformarse, con el nombre del pueblo en el borde.
const DOTS = Array.from({ length: 30 }, (_, i) => {
  const angle = (i / 30) * Math.PI * 2;
  return {
    cx: 100 + Math.cos(angle) * 95,
    cy: 100 + Math.sin(angle) * 95,
  };
});

export default function Logo({ size = 44, className }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="logoPhotoClip">
          <circle cx="100" cy="100" r="86" />
        </clipPath>
      </defs>

      {/* borde punteado, como una insignia de tela */}
      <circle cx="100" cy="100" r="98" fill="var(--color-night-950)" />
      {DOTS.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r="3.2" fill="var(--color-gold)" />
      ))}

      {/* ilustración del torito, recortada en círculo (imagen cuadrada, sin distorsión) */}
      <image
        href="/images/logo/torito-folk.png"
        x="14"
        y="14"
        width="172"
        height="172"
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#logoPhotoClip)"
      />

      {/* listón con el nombre */}
      <path
        d="M14 150 Q100 176 186 150 L186 168 Q100 192 14 168 Z"
        fill="var(--color-night-950)"
      />
      <text
        x="100"
        y="166"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontStyle="italic"
        fontWeight="700"
        fontSize="26"
        fill="var(--color-paper)"
      >
        Tultepec
      </text>
      <text
        x="100"
        y="182"
        textAnchor="middle"
        fontFamily="var(--font-body)"
        fontWeight="600"
        fontSize="9"
        letterSpacing="0.8"
        fill="var(--color-gold-light)"
      >
        PUEBLO PIROTÉCNICO
      </text>
    </svg>
  );
}
