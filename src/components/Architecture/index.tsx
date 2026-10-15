import type {ReactNode} from 'react';
import clsx from 'clsx';
import Icon from '@site/src/components/Icon';
import {
  AirflowLogo,
  AthenaLogo,
  AwsBadge,
  AwsWordmark,
  BucketLogo,
  GlueLogo,
  MetabaseLogo,
  PostgresLogo,
  PowerBiLogo,
  RdsLogo,
  S3Logo,
  SparkLogo,
} from './logos';
import styles from './styles.module.css';

type Tone = 'blue' | 'purple' | 'green' | 'sky' | 'violet';

function Stage({title, tone, children}: {title: ReactNode; tone: Tone; children: ReactNode}): ReactNode {
  return (
    <div className={clsx(styles.stage, styles[tone])}>
      <div className={styles.stageTitle}>{title}</div>
      <div className={styles.stageBody}>{children}</div>
    </div>
  );
}

function Arrow({vertical = false}: {vertical?: boolean}): ReactNode {
  return (
    <span className={clsx(styles.arrow, vertical && styles.arrowDown)} aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12h15" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    </span>
  );
}

/** Logo above a bold label and a muted caption. */
function Tool({logo, label, caption}: {logo: ReactNode; label?: ReactNode; caption?: ReactNode}): ReactNode {
  return (
    <div className={styles.tool}>
      {logo}
      {label && <div className={styles.toolLabel}>{label}</div>}
      {caption && <div className={styles.toolCaption}>{caption}</div>}
    </div>
  );
}

/** Logo next to a label (used for the data sources and the medallion layers). */
function Row({logo, label, caption}: {logo: ReactNode; label: ReactNode; caption?: ReactNode}): ReactNode {
  return (
    <div className={styles.row}>
      <span className={styles.rowLogo}>{logo}</span>
      <span>
        <span className={styles.rowLabel}>{label}</span>
        {caption && <span className={styles.toolCaption}>{caption}</span>}
      </span>
    </div>
  );
}

function SourceRows(): ReactNode {
  return (
    <>
      <Row logo={<Icon name="bed" size={26} className={styles.iconPurple} />} label="PMS" />
      <Row logo={<Icon name="network" size={26} className={styles.iconIndigo} />} label="Channel Manager" />
      <Row logo={<Icon name="pos" size={26} className={styles.iconBlue} />} label="POS" />
      <Row logo={<Icon name="cloud" size={26} className={styles.iconSky} />} label="External Data" />
    </>
  );
}

/** High-level architecture: from the sources to the business users. */
export function ArchitectureOverview(): ReactNode {
  return (
    <figure className={styles.figure} aria-label="HospedaPlus architecture overview">
      <div className={styles.flow}>
        <Stage title="Data Sources" tone="blue">
          <SourceRows />
        </Stage>
        <Arrow />
        <Stage title="Ingestion & Processing" tone="purple">
          <Tool logo={<AirflowLogo />} />
          <Arrow vertical />
          <Tool logo={<SparkLogo />} />
          <div className={styles.chip}>
            ETL/ELT
            <br />
            (Python)
          </div>
        </Stage>
        <Arrow />
        <Stage title="Data Lake & Warehouse" tone="green">
          <Tool logo={<S3Logo />} label="S3" caption="(Raw / Bronze / Gold)" />
          <Tool logo={<PostgresLogo />} label="PostgreSQL" caption="(Metadata / Catalog)" />
        </Stage>
        <Arrow />
        <Stage title="Analytics & BI" tone="sky">
          <Tool logo={<PowerBiLogo />} label="Power BI" caption="(Dashboards & Reports)" />
          <Tool logo={<MetabaseLogo />} label="Metabase" caption="(Exploration & Reporting)" />
        </Stage>
        <Arrow />
        <Stage title="Users" tone="violet">
          <Tool
            logo={<Icon name="user" size={40} className={styles.iconBlue} />}
            label={
              <span className={styles.usersLabel}>
                Business Teams
                <br />
                &amp; Stakeholders
              </span>
            }
          />
        </Stage>
      </div>
    </figure>
  );
}

const infrastructure: {name: string; caption: string; badge: ReactNode}[] = [
  {
    name: 'EC2',
    caption: '(bastion / services)',
    badge: <AwsBadge color="#f58534" glyph={<rect x="11" y="11" width="10" height="10" rx="1.5" />} />,
  },
  {
    name: 'ECR',
    caption: '(containers)',
    badge: <AwsBadge color="#f58534" glyph={<path d="M10 12h12v8H10zM13 12v-2h6v2" />} />,
  },
  {
    name: 'EKS',
    caption: '(Kubernetes)',
    badge: <AwsBadge color="#7b5cf0" shape="hexagon" glyph={<circle cx="16" cy="16" r="5" />} />,
  },
  {
    name: 'IAM',
    caption: '(permissions)',
    badge: <AwsBadge color="#dd344c" glyph={<><circle cx="16" cy="13" r="3" /><path d="M16 16v6M16 19h3" /></>} />,
  },
  {
    name: 'CloudWatch',
    caption: '(monitoring)',
    badge: <AwsBadge color="#d6338a" shape="circle" glyph={<path d="m9 18 4-5 3 3 6-7" />} />,
  },
  {
    name: 'CloudTrail',
    caption: '(logs)',
    badge: <AwsBadge color="#e7157b" shape="square" glyph={<path d="M9 22 16 10l7 12ZM12 18h8" />} />,
  },
  {
    name: 'Billing & Cost',
    caption: '(optimization)',
    badge: <AwsBadge color="#dd344c" shape="circle" glyph={<path d="M11 21V11h6a3 3 0 0 1 0 6h-6M16 17l4 4" />} />,
  },
];

/** Detailed AWS architecture with the medallion storage layer and the shared infrastructure. */
export function ArchitectureDetailed(): ReactNode {
  return (
    <figure className={clsx(styles.figure, styles.aws)} aria-label="HospedaPlus detailed AWS architecture">
      <div className={styles.awsHeader}>
        <span className={styles.awsTab}>
          <AwsWordmark />
        </span>
        <span className={styles.region}>Region: Ohio (us-east-2)</span>
      </div>
      <div className={styles.vpc}>
        <Icon name="cloud" size={16} className={styles.iconTeal} /> VPC
      </div>
      <div className={clsx(styles.flow, styles.flowCompact)}>
        <Stage title="Data Sources" tone="blue">
          <SourceRows />
        </Stage>
        <Arrow />
        <Stage title="Ingestion & Orchestration" tone="purple">
          <Tool logo={<AirflowLogo />} caption="DAGs / Schedules" />
          <Arrow vertical />
          <Tool logo={<SparkLogo />} label="PySpark" caption="(3 workers + 1 master)" />
        </Stage>
        <Arrow />
        <Stage title="Storage Layer (Medallion)" tone="green">
          <Row logo={<BucketLogo />} label="S3 - Raw" caption="(raw)" />
          <Row logo={<BucketLogo />} label="S3 - Bronze" caption="(cleaned)" />
          <Row logo={<BucketLogo />} label="S3 - Gold" caption="(analytics)" />
        </Stage>
        <Arrow />
        <Stage title="Data Warehouse & Metadata" tone="sky">
          <Tool logo={<RdsLogo />} label="RDS" caption="(PostgreSQL)" />
          <Tool logo={<GlueLogo />} label="Glue" caption="(Catalog)" />
        </Stage>
        <Arrow />
        <Stage title="Analytics & BI" tone="violet">
          <Tool logo={<AthenaLogo />} label="Athena" />
          <Tool logo={<PowerBiLogo />} label="Power BI" />
        </Stage>
        <Arrow />
        <Stage title="Visualization" tone="violet">
          <Tool logo={<MetabaseLogo />} label="Metabase" caption="(Dashboards)" />
        </Stage>
      </div>
      <div className={styles.infra}>
        <div className={styles.infraTitle}>Infrastructure &amp; Security</div>
        <div className={styles.infraItems}>
          {infrastructure.map((item) => (
            <div key={item.name} className={styles.infraItem}>
              {item.badge}
              <span>
                <span className={styles.rowLabel}>{item.name}</span>
                <span className={styles.toolCaption}>{item.caption}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
