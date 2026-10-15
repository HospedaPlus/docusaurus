import type {ReactNode} from 'react';

// Simplified marks for the tools in the architecture diagrams.
// They are drawn here (not the official logos) so the diagrams stay
// self-contained and crisp at any size.

type LogoProps = {size?: number};

export function AirflowLogo({size = 30}: LogoProps): ReactNode {
  return (
    <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 16 4 3c-1 6 2 11 12 13Z" fill="#e43921" />
        <path d="M16 16 29 4c-6-1-11 2-13 12Z" fill="#00ad46" />
        <path d="M16 16 28 29c1-6-2-11-12-13Z" fill="#04d1f6" />
        <path d="M16 16 3 28c6 1 11-2 13-12Z" fill="#017cee" />
      </svg>
      <span style={{fontSize: size * 0.62, color: '#3a4160', fontWeight: 500}}>Airflow</span>
    </span>
  );
}

export function SparkLogo({size = 30}: LogoProps): ReactNode {
  return (
    <span style={{position: 'relative', display: 'inline-flex', alignItems: 'flex-end'}}>
      <span
        style={{
          fontSize: size * 0.72,
          fontStyle: 'italic',
          fontWeight: 700,
          color: '#2b2b2b',
          letterSpacing: '-0.02em',
          fontFamily: 'Georgia, serif',
        }}>
        Spark
      </span>
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        style={{position: 'absolute', right: -size * 0.32, top: -size * 0.22}}
        aria-hidden="true">
        <path d="m12 1 2.6 7.2L22 9l-5.8 4.7L18 21l-6-4.2L6 21l1.8-7.3L2 9l7.4-.8Z" fill="#e25a1c" />
      </svg>
    </span>
  );
}

export function S3Logo({size = 34, color = '#d6402d'}: LogoProps & {color?: string}): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <ellipse cx="16" cy="7" rx="11" ry="3.5" fill={color} opacity="0.75" />
      <path d="M5 7v2l3 17c.3 2 3.6 3.5 8 3.5s7.7-1.5 8-3.5l3-17V7c0 2-4.9 3.5-11 3.5S5 9 5 7Z" fill={color} />
      <path d="M11 14h10M11 18h10" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export function BucketLogo({size = 34}: LogoProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M5 8 8 27c.3 2 3.6 3 8 3s7.7-1 8-3l3-19Z" fill="#7aa63a" />
      <ellipse cx="16" cy="8" rx="11" ry="4" fill="#9cc65a" />
      <ellipse cx="16" cy="8" rx="8" ry="2.4" fill="#5d8a28" />
    </svg>
  );
}

export function PostgresLogo({size = 34}: LogoProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M16 2C9 2 5 6 5 12c0 5 2 9 4 12 1 2 2 5 4 5s2-3 2-5c0 0 1 1 2 1 2 0 2-2 2-4 1 1 3 1 4 0 3-3 4-8 4-12 0-4-4-7-11-7Z"
        fill="#336791"
      />
      <path d="M11 9c1-2 4-3 6-2M20 10c1 1 2 3 1 5" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="13" cy="12" r="1.3" fill="#fff" />
    </svg>
  );
}

export function PowerBiLogo({size = 34}: LogoProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="18" y="3" width="8" height="26" rx="2" fill="#e8a317" />
      <rect x="12" y="10" width="8" height="19" rx="2" fill="#f2c811" />
      <rect x="6" y="17" width="8" height="12" rx="2" fill="#f7d94c" />
    </svg>
  );
}

export function MetabaseLogo({size = 34}: LogoProps): ReactNode {
  const dots: [number, number][] = [];
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      dots.push([x, y]);
    }
  }
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      {dots.map(([x, y]) => {
        const strong = x === 2 || (y === 2 && x !== 0 && x !== 4) || (x + y) % 3 === 0;
        return (
          <circle
            key={`${x}-${y}`}
            cx={4 + x * 6}
            cy={4 + y * 6}
            r={2}
            fill="#509ee3"
            opacity={strong ? 1 : 0.35}
          />
        );
      })}
    </svg>
  );
}

export function AthenaLogo({size = 34}: LogoProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="14" fill="#8c4fff" />
      <circle cx="16" cy="16" r="9" fill="none" stroke="#fff" strokeWidth="2.2" />
      <circle cx="15" cy="15" r="4" fill="none" stroke="#fff" strokeWidth="2.2" />
      <path d="m18 18 4 4" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function RdsLogo({size = 34}: LogoProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="4" fill="#2e73b8" />
      <ellipse cx="16" cy="10" rx="6" ry="2.4" fill="none" stroke="#fff" strokeWidth="1.8" />
      <path d="M10 10v11c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4V10M10 15.5c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4" fill="none" stroke="#fff" strokeWidth="1.8" />
      <path d="M5 8V5h3M27 8V5h-3M5 24v3h3M27 24v3h-3" stroke="#fff" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

export function GlueLogo({size = 34}: LogoProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="4" fill="#fff" stroke="#8c4fff" strokeWidth="2.4" />
      <path d="M9 8h14l-5 8v6l-4 2v-8Z" fill="none" stroke="#8c4fff" strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
}

/** Generic AWS service badge: colored rounded shape with a white glyph. */
export function AwsBadge({
  color,
  shape = 'shield',
  glyph,
  size = 32,
}: {
  color: string;
  shape?: 'shield' | 'hexagon' | 'square' | 'circle';
  glyph: ReactNode;
  size?: number;
}): ReactNode {
  const shapes = {
    shield: <path d="M16 2 4 6v9c0 7 5 12 12 15 7-3 12-8 12-15V6Z" fill={color} />,
    hexagon: <path d="M16 2 28 9v14l-12 7-12-7V9Z" fill={color} />,
    square: <rect x="3" y="3" width="26" height="26" rx="6" fill={color} />,
    circle: <circle cx="16" cy="16" r="14" fill={color} />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      {shapes[shape]}
      <g fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {glyph}
      </g>
    </svg>
  );
}

export function AwsWordmark(): ReactNode {
  return (
    <svg width="40" height="26" viewBox="0 0 40 26" aria-hidden="true">
      <text x="20" y="13" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700" fontFamily="Arial, sans-serif">
        aws
      </text>
      <path d="M8 18c7 4 17 4 24 0" stroke="#ff9900" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="m29 16 3.5 2-2 3" stroke="#ff9900" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
