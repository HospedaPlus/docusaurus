import type {ReactNode} from 'react';
import clsx from 'clsx';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Icon, {type IconName} from '@site/src/components/Icon';
import styles from './styles.module.css';

/* ---------- What is HospedaPlus ---------- */

export function Hero({children}: {children: ReactNode}): ReactNode {
  return (
    <div className={styles.hero}>
      <div className={styles.heroText}>{children}</div>
      <div className={styles.heroArt}>
        <HotelIllustration />
        <div className={styles.brand}>
          <img src={useBaseUrl('/img/logo.svg')} alt="" />
          <span>HospedaPlus</span>
        </div>
        <p className={styles.slogan}>More data. Better stays.</p>
      </div>
    </div>
  );
}

function HotelIllustration(): ReactNode {
  return (
    <svg className={styles.hotel} viewBox="0 0 260 190" aria-hidden="true">
      <defs>
        <linearGradient id="hotel-main" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8f7bff" />
          <stop offset="1" stopColor="#6a55ea" />
        </linearGradient>
      </defs>
      {/* clouds */}
      <circle cx="78" cy="96" r="44" fill="#ece6ff" />
      <circle cx="196" cy="56" r="42" fill="#e5efff" />
      <circle cx="226" cy="84" r="30" fill="#e5efff" />
      {/* small building */}
      <rect x="54" y="112" width="44" height="66" rx="3" fill="#7d68f5" stroke="#3b2fa8" strokeWidth="2.5" />
      <rect x="50" y="106" width="52" height="10" rx="2" fill="#a597ff" stroke="#3b2fa8" strokeWidth="2.5" />
      <rect x="63" y="126" width="9" height="13" rx="1.5" fill="#fff" />
      <rect x="80" y="126" width="9" height="13" rx="1.5" fill="#fff" />
      <rect x="64" y="154" width="12" height="24" rx="1.5" fill="#fff" />
      {/* main building */}
      <rect x="98" y="46" width="76" height="132" rx="3" fill="url(#hotel-main)" stroke="#3b2fa8" strokeWidth="2.5" />
      <rect x="114" y="28" width="44" height="18" rx="2" fill="#a597ff" stroke="#3b2fa8" strokeWidth="2.5" />
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={109 + col * 20}
            y={60 + row * 24}
            width="12"
            height="14"
            rx="2"
            fill="#fff"
          />
        )),
      )}
      <rect x="122" y="150" width="28" height="28" rx="2" fill="#fff" />
      <path d="M136 150v28" stroke="#6a55ea" strokeWidth="2" />
      {/* palm tree */}
      <path d="M206 178c0-30 2-52 8-70" stroke="#e08a3c" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M214 108c-14-10-30-8-38 2 12-2 24 0 38-2Z" fill="#2fb59a" />
      <path d="M214 108c10-14 28-16 38-8-12 0-26 2-38 8Z" fill="#2fb59a" />
      <path d="M214 108c-4-16-18-24-30-20 10 4 22 10 30 20Z" fill="#3cc7a8" />
      <path d="M214 108c6-14 20-20 30-16-10 4-22 8-30 16Z" fill="#3cc7a8" />
      <path d="M214 108c2 10 10 20 20 24-6-10-12-18-20-24Z" fill="#2fb59a" />
      <ellipse cx="206" cy="180" rx="26" ry="6" fill="#bfe9dc" />
      {/* ground */}
      <path d="M40 180h200" stroke="#3b2fa8" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Generic cards ---------- */

type Tone = 'blue' | 'purple' | 'teal' | 'sky';

export function CardGrid({
  columns = 3,
  children,
}: {
  columns?: 2 | 3 | 4;
  children: ReactNode;
}): ReactNode {
  return <div className={clsx(styles.grid, styles[`cols${columns}`])}>{children}</div>;
}

/** Small centered card with an icon and a short label. */
export function FeatureCard({icon, children}: {icon: IconName; children: ReactNode}): ReactNode {
  return (
    <div className={clsx(styles.card, styles.feature)}>
      <Icon name={icon} size={30} className={styles.featureIcon} />
      <div className={styles.featureLabel}>{children}</div>
    </div>
  );
}

/** Card with an icon, a title and a description. */
export function InfoCard({
  icon,
  title,
  children,
}: {
  icon: IconName;
  title: string;
  children: ReactNode;
}): ReactNode {
  return (
    <div className={clsx(styles.card, styles.info)}>
      <Icon name={icon} size={30} strokeWidth={2.2} className={styles.infoIcon} />
      <h3 className={styles.infoTitle}>{title}</h3>
      <div className={styles.infoText}>{children}</div>
    </div>
  );
}

/** Data source card: big colored icon, centered title and a bullet list. */
export function SourceCard({
  icon,
  tone = 'purple',
  title,
  children,
}: {
  icon: IconName;
  tone?: Tone;
  title: ReactNode;
  children: ReactNode;
}): ReactNode {
  return (
    <div className={clsx(styles.card, styles.source)}>
      <span className={clsx(styles.sourceIcon, styles[tone])}>
        <Icon name={icon} size={38} strokeWidth={2} />
      </span>
      <h3 className={styles.sourceTitle}>{title}</h3>
      <div className={styles.sourceList}>{children}</div>
    </div>
  );
}

/* ---------- Callouts ---------- */

export function Note({children}: {children: ReactNode}): ReactNode {
  return (
    <div className={clsx(styles.callout, styles.note)}>
      <Icon name="info" size={22} className={styles.noteIcon} />
      <div>{children}</div>
    </div>
  );
}

export function AccessNote({
  icon = 'lock',
  title,
  children,
}: {
  icon?: IconName;
  title: string;
  children: ReactNode;
}): ReactNode {
  return (
    <div className={clsx(styles.callout, styles.access)}>
      <Icon name={icon} size={26} strokeWidth={2.2} className={styles.accessIcon} />
      <div>
        <div className={styles.accessTitle}>{title}</div>
        {children}
      </div>
    </div>
  );
}

/* ---------- Access table ---------- */

export function SourceName({icon, tone = 'purple', children}: {icon: IconName; tone?: Tone; children: ReactNode}): ReactNode {
  return (
    <span className={styles.sourceName}>
      <span className={clsx(styles.sourceNameIcon, styles[tone])}>
        <Icon name={icon} size={22} />
      </span>
      {children}
    </span>
  );
}

export function AccessTable({children}: {children: ReactNode}): ReactNode {
  return <div className={styles.accessTable}>{children}</div>;
}

/* ---------- Key figures ---------- */

export function StatGrid({children}: {children: ReactNode}): ReactNode {
  return <div className={styles.stats}>{children}</div>;
}

export function Stat({value, children}: {value: string; children: ReactNode}): ReactNode {
  return (
    <div className={styles.stat}>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{children}</div>
    </div>
  );
}

/* ---------- Data sources F1-F7 ---------- */

type SourceMeta = {label: string; value: ReactNode};

/** Data source card with its ID (F1-F7), type and key facts. */
export function DataSourceCard({
  id,
  icon,
  tone = 'purple',
  title,
  type,
  simulated = false,
  meta,
  children,
}: {
  id: string;
  icon: IconName;
  tone?: Tone;
  title: string;
  type: string;
  simulated?: boolean;
  meta: SourceMeta[];
  children?: ReactNode;
}): ReactNode {
  return (
    <div className={clsx(styles.card, styles.dataSource)}>
      <div className={styles.dataSourceHead}>
        <span className={clsx(styles.sourceIcon, styles[tone])}>
          <Icon name={icon} size={30} strokeWidth={2} />
        </span>
        <span className={styles.sourceId}>{id}</span>
      </div>
      <h3 className={styles.dataSourceTitle}>{title}</h3>
      <div className={styles.tags}>
        <span className={styles.tag}>{type}</span>
        <span className={clsx(styles.tag, simulated ? styles.tagSimulated : styles.tagReal)}>
          {simulated ? 'Simulated' : 'Real data'}
        </span>
      </div>
      <dl className={styles.meta}>
        {meta.map((m) => (
          <div key={m.label}>
            <dt>{m.label}</dt>
            <dd>{m.value}</dd>
          </div>
        ))}
      </dl>
      {children && <div className={styles.dataSourceText}>{children}</div>}
    </div>
  );
}
