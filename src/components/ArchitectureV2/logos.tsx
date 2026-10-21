import type {ReactNode} from 'react';
import {AwsBadge} from '@site/src/components/Architecture/logos';

// Simplified marks for the services in the Architecture v2 diagram.
// Like the ones in ../Architecture/logos.tsx they are drawn here (not the
// official logos) so the diagram stays self-contained.

type LogoProps = {size?: number};

const networking = '#8c4fff';
const compute = '#ed7100';
const integration = '#e7157b';
const security = '#dd344c';
const storage = '#7aa116';

export function Route53Logo({size = 32}: LogoProps): ReactNode {
  return (
    <AwsBadge
      size={size}
      color={networking}
      shape="square"
      glyph={
        <>
          <path d="M16 7 9 10v5c0 4 3 7 7 9 4-2 7-5 7-9v-5Z" />
          <text x="16" y="18.5" textAnchor="middle" fill="#fff" stroke="none" fontSize="7" fontWeight="700" fontFamily="Arial, sans-serif">
            53
          </text>
        </>
      }
    />
  );
}

export function WafLogo({size = 32}: LogoProps): ReactNode {
  return (
    <AwsBadge
      size={size}
      color={security}
      shape="square"
      glyph={
        <>
          <path d="M16 7 9 10v5c0 4 3 7 7 9 4-2 7-5 7-9v-5Z" />
          <path d="M16 12c2 2 3 3 3 5a3 3 0 0 1-6 0c0-1 .5-2 1.5-2.5" />
        </>
      }
    />
  );
}

export function EcrLogo({size = 32}: LogoProps): ReactNode {
  return (
    <AwsBadge
      size={size}
      color={compute}
      shape="square"
      glyph={
        <>
          <path d="m16 8 7 4v8l-7 4-7-4v-8Z" />
          <path d="m9 12 7 4 7-4M16 16v8" />
        </>
      }
    />
  );
}

export function IgwLogo({size = 30}: LogoProps): ReactNode {
  return (
    <AwsBadge size={size} color={networking} shape="circle" glyph={<path d="M11 23V14a5 5 0 0 1 10 0v9M14 23v-8a2 2 0 0 1 4 0v8" />} />
  );
}

export function AlbLogo({size = 30}: LogoProps): ReactNode {
  return (
    <AwsBadge
      size={size}
      color={networking}
      shape="circle"
      glyph={
        <>
          <rect x="13" y="8" width="6" height="4" rx="1" />
          <path d="M16 12v3M10 18v-3h12v3" />
          <rect x="8" y="18" width="4" height="4" rx="1" />
          <rect x="14" y="18" width="4" height="4" rx="1" />
          <rect x="20" y="18" width="4" height="4" rx="1" />
        </>
      }
    />
  );
}

export function NatLogo({size = 30}: LogoProps): ReactNode {
  return (
    <AwsBadge
      size={size}
      color={networking}
      shape="circle"
      glyph={
        <>
          <rect x="9" y="11" width="8" height="10" rx="1" />
          <path d="M17 13h7m-2-2 2 2-2 2M17 19h7m-2-2 2 2-2 2" />
        </>
      }
    />
  );
}

export function EndpointLogo({size = 30}: LogoProps): ReactNode {
  return (
    <AwsBadge
      size={size}
      color={networking}
      shape="circle"
      glyph={
        <>
          <circle cx="16" cy="16" r="6" />
          <circle cx="16" cy="16" r="2" />
        </>
      }
    />
  );
}

export function FargateLogo({size = 30}: LogoProps): ReactNode {
  return (
    <AwsBadge
      size={size}
      color={compute}
      shape="square"
      glyph={
        <>
          <path d="m11 10 5-3 5 3v5l-5 3-5-3Z" />
          <path d="m8 18 4-2 4 2v5l-4 2-4-2ZM16 18l4-2 4 2v5l-4 2-4-2Z" />
        </>
      }
    />
  );
}

export function Ec2Logo({size = 26}: LogoProps): ReactNode {
  return (
    <AwsBadge
      size={size}
      color={compute}
      shape="square"
      glyph={
        <>
          <rect x="10" y="10" width="12" height="12" rx="1.5" />
          <path d="M13 7v3M19 7v3M13 22v3M19 22v3M7 13h3M7 19h3M22 13h3M22 19h3" />
        </>
      }
    />
  );
}

export function MqLogo({size = 30}: LogoProps): ReactNode {
  return (
    <AwsBadge
      size={size}
      color={integration}
      shape="square"
      glyph={
        <>
          <rect x="8" y="12" width="16" height="8" rx="2" />
          <path d="M12 12v8M16 12v8M20 12v8" />
        </>
      }
    />
  );
}

export function RabbitMqLogo({size = 30}: LogoProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M5 4h5v10h5V4h5v10h2V8h5v19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1Zm16 14v4h4v-4Z"
        fill="#ff6600"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function FastApiLogo({size = 30}: LogoProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="14" fill="#009688" />
      <path d="M17.5 6 10 18h5.5L14 26l8-12h-5.5Z" fill="#fff" />
    </svg>
  );
}

export function PythonLogo({size = 26}: LogoProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M15.8 3C9.6 3 10 5.7 10 5.7V9h6v1H7.6S4 9.6 4 15.8s3.2 6 3.2 6H9v-3s-.1-3.2 3.2-3.2h5.5S21 15.6 21 12.4V6.6S21.4 3 15.8 3Zm-3.1 1.8a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="#3776ab" />
      <path d="M16.2 29c6.2 0 5.8-2.7 5.8-2.7V23h-6v-1h8.4s3.6.4 3.6-5.8-3.2-6-3.2-6H23v3s.1 3.2-3.2 3.2h-5.5S11 16.4 11 19.6v5.8S10.6 29 16.2 29Zm3.1-1.8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" fill="#ffd43b" />
    </svg>
  );
}

export function SparkMark({size = 26}: LogoProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 1 2.6 7.2L22 9l-5.8 4.7L18 21l-6-4.2L6 21l1.8-7.3L2 9l7.4-.8Z" fill="none" stroke="#e25a1c" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  );
}

export function AirflowMark({size = 30}: LogoProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 16 4 3c-1 6 2 11 12 13Z" fill="#e43921" />
      <path d="M16 16 29 4c-6-1-11 2-13 12Z" fill="#00ad46" />
      <path d="M16 16 28 29c1-6-2-11-12-13Z" fill="#04d1f6" />
      <path d="M16 16 3 28c6 1 11-2 13-12Z" fill="#017cee" />
    </svg>
  );
}

export function NeonLogo({size = 34}: LogoProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="3" y="3" width="26" height="26" rx="7" fill="#00e599" />
      <path d="M10 23V9l12 11V9" fill="none" stroke="#0b1a14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Data lake bucket tinted for each medallion layer. */
export function LayerBucket({color, size = 30}: LogoProps & {color: string}): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M5 8 8 27c.3 2 3.6 3 8 3s7.7-1 8-3l3-19" fill="none" stroke={color} strokeWidth="2" />
      <ellipse cx="16" cy="8" rx="11" ry="4" fill="none" stroke={color} strokeWidth="2" />
      <path d="M11 18h4v4h-4ZM18 16l3 5h-6Z" fill={color} opacity="0.85" />
    </svg>
  );
}

export function DataLakeLogo({size = 26}: LogoProps): ReactNode {
  return (
    <AwsBadge
      size={size}
      color={storage}
      shape="square"
      glyph={
        <>
          <ellipse cx="16" cy="11" rx="7" ry="2.5" />
          <path d="M9 11l2 11c.2 1 2.4 2 5 2s4.8-1 5-2l2-11" />
        </>
      }
    />
  );
}

export function CrawlerLogo({size = 30}: LogoProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="4" fill="#fff" stroke="#8c4fff" strokeWidth="2.4" />
      <path d="M8 9h16M8 14h16M8 19h9M8 24h7" stroke="#8c4fff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="21.5" cy="21.5" r="3.5" fill="none" stroke="#8c4fff" strokeWidth="2" />
      <path d="m24 24 2.5 2.5" stroke="#8c4fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const securityGlyphs: Record<string, {color: string; glyph: ReactNode}> = {
  IAM: {
    color: security,
    glyph: (
      <>
        <rect x="8" y="10" width="16" height="12" rx="1.5" />
        <circle cx="13" cy="15" r="2" />
        <path d="M17 14h4M17 18h4M10 20c.5-1.5 1.6-2 3-2s2.5.5 3 2" />
      </>
    ),
  },
  KMS: {
    color: security,
    glyph: (
      <>
        <circle cx="12" cy="16" r="4" />
        <path d="M16 16h9M22 16v3M25 16v2" />
      </>
    ),
  },
  'Secrets Manager': {
    color: security,
    glyph: (
      <>
        <rect x="10" y="14" width="12" height="9" rx="1.5" />
        <path d="M12.5 14v-2.5a3.5 3.5 0 0 1 7 0V14M16 17.5v2" />
      </>
    ),
  },
  CloudWatch: {
    color: integration,
    glyph: (
      <>
        <path d="M10 21a4 4 0 0 1 .5-8 6 6 0 0 1 11.3 1.5A3.5 3.5 0 0 1 22 21Z" />
        <path d="m12 18 2.5-2.5 2 2 3-3" />
      </>
    ),
  },
  CloudTrail: {
    color: integration,
    glyph: (
      <>
        <path d="M10 18a4 4 0 0 1 .5-8 6 6 0 0 1 11.3 1.5A3.5 3.5 0 0 1 22 18" />
        <path d="M9 22h14M12 25h8" />
      </>
    ),
  },
  'Systems Manager': {
    color: integration,
    glyph: (
      <>
        <circle cx="16" cy="16" r="3" />
        <path d="M16 8v3M16 21v3M8 16h3M21 16h3M10.3 10.3l2.1 2.1M19.6 19.6l2.1 2.1M10.3 21.7l2.1-2.1M19.6 12.4l2.1-2.1" />
      </>
    ),
  },
};

export function SecurityLogo({name, size = 30}: LogoProps & {name: string}): ReactNode {
  const {color, glyph} = securityGlyphs[name];
  return <AwsBadge size={size} color={color} shape="square" glyph={glyph} />;
}

export function GitHubActionsLogo({size = 32}: LogoProps): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="7" fill="#2088ff" />
      <g fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="3" />
        <path d="m9 8.6 2.4 1.4L9 11.4Z" fill="#fff" strokeWidth="1" />
        <circle cx="22" cy="10" r="2.2" />
        <circle cx="22" cy="22" r="2.2" />
        <path d="M13 10h6.8M10 13v5a4 4 0 0 0 4 4h5.8" />
      </g>
    </svg>
  );
}
