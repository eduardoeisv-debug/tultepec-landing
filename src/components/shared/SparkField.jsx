import { useMemo } from "react";
import "./SparkField.css";

// Genera un campo de chispas decorativas con CSS puro (sin librerías),
// pensado como textura sutil de fondo en el hero.
export default function SparkField({ count = 22 }) {
  const sparks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 6,
        size: 2 + Math.random() * 3,
        hue: i % 3,
      })),
    [count]
  );

  return (
    <div className="spark-field" aria-hidden="true">
      {sparks.map((s) => (
        <span
          key={s.id}
          className={`spark spark--${s.hue}`}
          style={{
            left: `${s.left}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            width: `${s.size}px`,
            height: `${s.size}px`,
          }}
        />
      ))}
    </div>
  );
}
