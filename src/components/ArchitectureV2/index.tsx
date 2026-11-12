import type {ReactNode} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Icon, {type IconName} from '@site/src/components/Icon';
import {AthenaLogo, GlueLogo, PowerBiLogo} from '@site/src/components/Architecture/logos';
import {
  AirflowMark,
  DataLakeLogo,
  Ec2Logo,
  FlowerLogo,
  GhcrLogo,
  GitHubActionsLogo,
  IgwLogo,
  KafkaLogo,
  LayerBucket,
  NeonLogo,
  PythonLogo,
  RabbitMqLogo,
  SecurityLogo,
  SparkMark,
} from './logos';
import {strings, type Strings} from './strings';
import styles from './styles.module.css';

/** The six kinds of flow in the legend; each has its own color and line style. */
export type FlowKind = keyof Strings['legend'];

const dashedKinds: FlowKind[] = ['cicd', 'meta', 'pending'];

export function useStrings(): Strings {
  const {i18n} = useDocusaurusContext();
  return strings[i18n.currentLocale] ?? strings.en;
}

export function FlowLine({kind, width = 26}: {kind: FlowKind; width?: number}): ReactNode {
  return (
    <svg className={styles.flowLine} width={width} height="10" viewBox={`0 0 ${width} 10`} aria-hidden="true">
      <path d={`M1 5h${width - 4}`} strokeDasharray={dashedKinds.includes(kind) ? '4 3' : undefined} />
      <path d={`m${width - 7} 1.5 4.5 3.5-4.5 3.5`} />
    </svg>
  );
}

/** Outgoing connection of a node: line in the flow color, target and an optional label. */
export function Edge({kind, to, label, both = false}: {kind: FlowKind; to?: ReactNode; label?: ReactNode; both?: boolean}): ReactNode {
  return (
    <span className={clsx(styles.edge, styles[kind])}>
      {both ? <span className={styles.edgeBoth}>↔</span> : <FlowLine kind={kind} width={16} />}
      <span>
        {to && <strong>{to}</strong>}
        {to && label && ' · '}
        {label}
      </span>
    </span>
  );
}

/** Arrow between two nodes that sit next to each other. */
export function Link({kind, direction = 'right'}: {kind: FlowKind; direction?: 'right' | 'left' | 'down' | 'up'}): ReactNode {
  return (
    <span className={clsx(styles.link, styles[kind], styles[direction])} aria-hidden="true">
      <FlowLine kind={kind} />
    </span>
  );
}

export function Node({
  logo,
  title,
  caption,
  edges,
  className,
}: {
  logo: ReactNode;
  title: ReactNode;
  caption?: ReactNode;
  edges?: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <div className={clsx(styles.node, className)}>
      <div className={styles.nodeLogo}>{logo}</div>
      <div className={styles.nodeTitle}>{title}</div>
      {caption && <div className={styles.nodeCaption}>{caption}</div>}
      {edges && <div className={styles.edges}>{edges}</div>}
    </div>
  );
}

export function SourceIcon({name}: {name: IconName}): ReactNode {
  return <Icon name={name} size={30} strokeWidth={1.6} className={styles.sourceIcon} />;
}

export function Column({title, children, className}: {title: ReactNode; children: ReactNode; className?: string}): ReactNode {
  return (
    <section className={clsx(styles.column, className)}>
      <h4 className={styles.columnTitle}>{title}</h4>
      <div className={styles.columnBody}>{children}</div>
    </section>
  );
}

export function Zone({label, tone, icon, children}: {label: ReactNode; tone: string; icon?: IconName; children: ReactNode}): ReactNode {
  return (
    <div className={clsx(styles.zone, styles[tone])}>
      <div className={styles.zoneLabel}>
        {icon && <Icon name={icon} size={13} strokeWidth={2.2} />}
        {label}
      </div>
      {children}
    </div>
  );
}

function Sources({s}: {s: Strings}): ReactNode {
  return (
    <Column title={s.col1} className={styles.sources}>
      <Node
        logo={<GitHubActionsLogo />}
        title={s.dev}
        caption={s.devCaption}
        edges={
          <>
            <Edge kind="cicd" to="GHCR" label={s.edge.pushImages} />
            <Edge kind="cicd" to={s.ec2Group} label={s.edge.deploySsh} />
          </>
        }
      />
      <Node logo={<SourceIcon name="users" />} title={s.dataTeam} caption={s.dataTeamCaption} edges={<Edge kind="cicd" to="Internet Gateway" label={s.edge.ssh} />} />
      <Node logo={<PythonLogo size={30} />} title={s.f2} caption={s.f2Caption} edges={<Edge kind="realtime" to="Kafka" />} />
      <Node logo={<PythonLogo size={30} />} title={s.f3} caption={s.f3Caption} edges={<Edge kind="realtime" to="Neon" label="reservar()" />} />
      <div className={styles.catalogNote}>
        <strong>{s.sharedCatalogTitle}</strong> {s.sharedCatalog}
      </div>
      <Node logo={<SourceIcon name="cloud" />} title={s.apis} caption={s.apisCaption} edges={<Edge kind="batch" to={s.workerBronze} label={s.edge.https} />} />
      <Node logo={<SourceIcon name="file" />} title={s.files} caption={s.filesCaption} edges={<Edge kind="batch" to={s.workerBronze} label={s.edge.kaggle} />} />
    </Column>
  );
}

function Entry({s}: {s: Strings}): ReactNode {
  return (
    <Column title={s.col2} className={styles.entry}>
      <Node
        logo={<GhcrLogo />}
        title="GHCR"
        caption={s.ghcrCaption}
        edges={<Edge kind="cicd" to={s.ec2Group} label={s.edge.deployImage} />}
      />
      <div className={styles.sgNote}>
        <strong>{s.sgTitle}</strong>
        <ul>
          {s.sg.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </Column>
  );
}

function Processing({s}: {s: Strings}): ReactNode {
  return (
    <Column title={s.col3} className={styles.processing}>
      {/* VPC on the left, Neon (external SaaS) beside it on the right */}
      <div className={styles.procGrid}>
      <Zone label={s.vpc} tone="vpc" icon="cloud">
        <Node logo={<IgwLogo />} title="Internet Gateway" caption={s.igwCaption} />
        <Zone label={s.sourcesEc2} tone="realtimeZone" icon="zap">
          <p className={styles.note}>{s.sourcesEc2Caption}</p>
          <div className={styles.row}>
            <Node logo={<PythonLogo size={30} />} title={s.f2Producer} caption={s.f2ProducerCaption} />
            <Link kind="realtime" />
            <Node className={styles.box} logo={<KafkaLogo />} title="Kafka 4.1.1" caption={s.kafkaCaption} />
            <Link kind="realtime" />
            <Node
              logo={<PythonLogo size={30} />}
              title={s.consumers}
              caption={s.consumersCaption}
              edges={<Edge kind="realtime" to="Neon" label={s.edge.ledger} />}
            />
          </div>
          <div className={styles.row}>
            <Node logo={<PythonLogo size={30} />} title={s.f3Sim} caption={s.f3SimCaption} edges={<Edge kind="realtime" to="Neon" label="reservar()" />} />
            <Node
              logo={<SourceIcon name="file" />}
              title={s.f4}
              caption={s.f4Caption}
              edges={
                <>
                  <Edge kind="realtime" to="Neon" label="reservar()" />
                  <Edge kind="batch" to="S3 bronze/f4_agencias" />
                </>
              }
            />
          </div>
        </Zone>
        <div className={styles.batchRow}>
          <div className={clsx(styles.box, styles.ec2)}>
            <div className={styles.ec2Head}>
              <Ec2Logo />
              <span>
                <span className={styles.nodeTitle}>{s.core}</span>
                <span className={styles.nodeCaption}>{s.coreCaption}</span>
              </span>
            </div>
            <div className={styles.components}>
              <AirflowMark size={34} />
              <span>
                <span className={styles.nodeTitle}>{s.components}</span>
                <span className={styles.nodeCaption}>{s.componentsList}</span>
              </span>
            </div>
            <div className={styles.components}>
              <RabbitMqLogo />
              <FlowerLogo />
              <span>
                <span className={styles.nodeTitle}>RabbitMQ · Flower</span>
                <span className={styles.nodeCaption}>{s.rabbitCaption}</span>
              </span>
            </div>
            <div className={styles.edges}>
              <Edge kind="cicd" to={s.workers} label={s.edge.broker} />
            </div>
          </div>
          <div className={clsx(styles.box, styles.ec2)}>
            <div className={styles.ec2Head}>
              <Ec2Logo />
              <span>
                <span className={styles.nodeTitle}>{s.workers}</span>
                <span className={styles.nodeCaption}>{s.workersCaption}</span>
              </span>
            </div>
            <Worker logo={<PythonLogo />} title={s.workerBronze} caption={s.workerBronzeCaption} tone="bronze" />
            <Worker logo={<SparkMark />} title={s.workerSilver} caption={s.workerSilverCaption} tone="silver" />
            <Worker
              logo={<SparkMark />}
              title={s.workerGold}
              caption={s.workerGoldCaption}
              tone="gold"
              edge={<Edge kind="rates" to="Neon" label={s.edge.writeback} />}
            />
            <div className={styles.edges}>
              <Edge kind="batch" to="Amazon S3" label={s.edge.s3a} />
              <Edge kind="cicd" to={s.core} label={s.edge.status} />
            </div>
            <p className={styles.note}>{s.sparkNote}</p>
          </div>
        </div>
      </Zone>
      <Zone label={s.external} tone="external">
        <Node
          logo={<NeonLogo />}
          title="Neon PostgreSQL (F3)"
          caption={s.neonCaption}
          edges={<Edge kind="batch" to={s.workerBronze} label={s.edge.bronzeExtract} />}
        />
      </Zone>
      </div>
    </Column>
  );
}

export function Worker({
  logo,
  title,
  caption,
  tone,
  edge,
}: {
  logo: ReactNode;
  title: ReactNode;
  caption: ReactNode;
  tone: 'bronze' | 'silver' | 'gold';
  edge?: ReactNode;
}): ReactNode {
  return (
    <div className={clsx(styles.worker, styles[tone])}>
      {logo}
      <span>
        <span className={styles.nodeTitle}>{title}</span>
        <span className={styles.nodeCaption}>{caption}</span>
        {edge && <span className={styles.edges}>{edge}</span>}
      </span>
    </div>
  );
}

export function Layer({name, caption, tone, color}: {name: string; caption: ReactNode; tone: 'bronze' | 'silver' | 'gold'; color: string}): ReactNode {
  return (
    <div className={clsx(styles.layer, styles[tone])}>
      <LayerBucket color={color} />
      <div className={styles.nodeTitle}>{name}</div>
      <div className={styles.nodeCaption}>{caption}</div>
    </div>
  );
}

function DataLake({s}: {s: Strings}): ReactNode {
  return (
    <Column title={s.col4} className={styles.lake}>
      <div className={styles.howGold}>
        <strong>{s.howGoldTitle}</strong>
        <ol>
          {s.howGold.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
      <div className={clsx(styles.row, styles.catalog)}>
        <Node logo={<AthenaLogo size={30} />} title="Athena DDL" caption={s.ddlCaption} />
        <Link kind="meta" />
        <Node logo={<GlueLogo size={30} />} title="Glue Data Catalog" caption={s.catalogCaption} />
        <Link kind="meta" direction="left" />
        <Node
          logo={<AthenaLogo size={30} />}
          title="Amazon Athena"
          caption={s.athenaCaption}
          edges={<span className={styles.athenaEdge}><Edge kind="gold" to="Power BI" /></span>}
        />
        {/* Landscape: the arrow leaves column 4 towards Power BI in column 5 */}
        <div className={styles.toPowerBi}>
          <Link kind="gold" />
        </div>
      </div>
      {/* Athena reads gold/: the arrow goes down from Athena to the gold layer */}
      <div className={styles.athenaToGold}>
        <Link kind="gold" direction="down" />
      </div>
      <div className={styles.bucket}>
        <div className={styles.ec2Head}>
          <DataLakeLogo />
          <span>
            <span className={styles.nodeTitle}>{s.lakehouse}</span>
            <span className={styles.nodeCaption}>{s.lakehouseCaption}</span>
          </span>
        </div>
        <div className={styles.layers}>
          <Layer name="bronze/" caption={s.bronzeCaption} tone="bronze" color="#b5651d" />
          <Link kind="batch" />
          <Layer name="silver/" caption={s.silverCaption} tone="silver" color="#6b7280" />
          <Link kind="batch" />
          <Layer name="gold/" caption={s.goldCaption} tone="gold" color="#b08900" />
        </div>
        <div className={styles.edges}>
          <Edge kind="gold" to="gold/ → Amazon Athena" />
          <Edge kind="rates" to="gold/ → Neon" label={s.edge.writeback} />
        </div>
        <p className={styles.note}>{s.lakeNote}</p>
      </div>
    </Column>
  );
}

function Analytics({s}: {s: Strings}): ReactNode {
  return (
    <Column title={s.col5} className={styles.analytics}>
      <div className={styles.stack}>
        <Node logo={<SourceIcon name="users" />} title={s.managers} caption={s.managersCaption} />
        <Link kind="gold" direction="up" />
        <Node logo={<PowerBiLogo size={32} />} title={s.powerbi} caption={s.powerbiCaption} />
      </div>
      <Node className={styles.dashedBox} logo={<SourceIcon name="network" />} title={s.pendingApi} caption={s.pendingApiCaption} />
    </Column>
  );
}

const securityServices: {name: string; title: (s: Strings) => string; caption: (s: Strings) => string}[] = [
  {name: 'IAM', title: () => 'IAM', caption: (s) => s.iamCaption},
  {name: 'Security groups', title: () => 'Security groups', caption: (s) => s.sgCaption},
  {name: 'Secrets Manager', title: (s) => s.credentials, caption: (s) => s.credentialsCaption},
  {name: 'Neon', title: (s) => s.neonRoles, caption: (s) => s.neonRolesCaption},
  {name: 'S3', title: () => 'S3', caption: (s) => s.s3Caption},
  {name: 'CloudWatch', title: (s) => s.monitoring, caption: (s) => s.monitoringCaption},
];

/** Final AWS architecture of HospedaPlus: five columns from the sources to the decision makers. */
export function ArchitectureV2(): ReactNode {
  const s = useStrings();
  const legendKinds = Object.keys(s.legend) as FlowKind[];
  return (
    // Landscape canvas like the draw.io reference; scrolls sideways on narrow screens
    <div className={styles.landscape}>
    <figure className={clsx(styles.figure, styles.figureWide)} aria-label={s.ariaLabel}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>{s.title}</div>
          <div className={styles.subtitle}>{s.subtitle}</div>
        </div>
        <div className={styles.roles}>
          <strong>{s.stackTitle}</strong> {s.stack}
        </div>
      </div>

      <div className={styles.board}>
        <Sources s={s} />
        <div className={styles.cloud}>
          <div className={styles.cloudLabel}>
            <span className={styles.awsTag}>aws</span>
            {s.awsCloud}
          </div>
          <Entry s={s} />
          <Processing s={s} />
          <DataLake s={s} />
        </div>
        <Analytics s={s} />
      </div>

      <div className={styles.security}>
        <div className={styles.securityTitle}>{s.securityTitle}</div>
        <div className={styles.securityItems}>
          {securityServices.map((service) => (
            <div key={service.name} className={styles.securityItem}>
              <SecurityLogo name={service.name} />
              <span>
                <span className={styles.nodeTitle}>{service.title(s)}</span>
                <span className={styles.nodeCaption}>{service.caption(s)}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.legend}>
        <strong>{s.legendTitle}</strong>
        {legendKinds.map((kind) => (
          <span key={kind} className={clsx(styles.legendItem, styles[kind])}>
            <FlowLine kind={kind} width={34} />
            {s.legend[kind]}
          </span>
        ))}
      </div>
    </figure>
    </div>
  );
}
