import type {ReactNode} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Icon, {type IconName} from '@site/src/components/Icon';
import {AthenaLogo, GlueLogo, MetabaseLogo, PowerBiLogo} from '@site/src/components/Architecture/logos';
import {
  AirflowMark,
  AlbLogo,
  CrawlerLogo,
  DataLakeLogo,
  Ec2Logo,
  EcrLogo,
  EndpointLogo,
  FargateLogo,
  FastApiLogo,
  IgwLogo,
  LayerBucket,
  MqLogo,
  NatLogo,
  NeonLogo,
  PythonLogo,
  RabbitMqLogo,
  Route53Logo,
  SecurityLogo,
  SparkMark,
  WafLogo,
} from './logos';
import {strings, type Strings} from './strings';
import styles from './styles.module.css';

/** The six kinds of flow in the legend; each has its own color and line style. */
type FlowKind = keyof Strings['legend'];

const dashedKinds: FlowKind[] = ['cicd', 'meta'];

function useStrings(): Strings {
  const {i18n} = useDocusaurusContext();
  return strings[i18n.currentLocale] ?? strings.en;
}

function FlowLine({kind, width = 26}: {kind: FlowKind; width?: number}): ReactNode {
  return (
    <svg className={styles.flowLine} width={width} height="10" viewBox={`0 0 ${width} 10`} aria-hidden="true">
      <path d={`M1 5h${width - 4}`} strokeDasharray={dashedKinds.includes(kind) ? '4 3' : undefined} />
      <path d={`m${width - 7} 1.5 4.5 3.5-4.5 3.5`} />
    </svg>
  );
}

/** Outgoing connection of a node: line in the flow color, target and an optional label. */
function Edge({kind, to, label, both = false}: {kind: FlowKind; to?: ReactNode; label?: ReactNode; both?: boolean}): ReactNode {
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
function Link({kind, direction = 'right'}: {kind: FlowKind; direction?: 'right' | 'left' | 'down' | 'up'}): ReactNode {
  return (
    <span className={clsx(styles.link, styles[kind], styles[direction])} aria-hidden="true">
      <FlowLine kind={kind} />
    </span>
  );
}

function Node({
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

function SourceIcon({name}: {name: IconName}): ReactNode {
  return <Icon name={name} size={30} strokeWidth={1.6} className={styles.sourceIcon} />;
}

function Column({title, children, className}: {title: ReactNode; children: ReactNode; className?: string}): ReactNode {
  return (
    <section className={clsx(styles.column, className)}>
      <h4 className={styles.columnTitle}>{title}</h4>
      <div className={styles.columnBody}>{children}</div>
    </section>
  );
}

function Zone({label, tone, icon, children}: {label: ReactNode; tone: string; icon?: IconName; children: ReactNode}): ReactNode {
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
      <Node logo={<SourceIcon name="users" />} title={s.guests} caption={s.guestsCaption} edges={<Edge kind="realtime" to="Route 53" />} />
      <Node logo={<SourceIcon name="gear" />} title={s.dev} caption={s.devCaption} edges={<Edge kind="cicd" to="Amazon ECR" />} />
      <Node logo={<SourceIcon name="network" />} title={s.f2} caption={s.f2Caption} edges={<Edge kind="realtime" to="Amazon MQ · RabbitMQ" />} />
      <Node logo={<SourceIcon name="cloud" />} title={s.apis} caption={s.apisCaption} edges={<Edge kind="batch" to={s.workerBronze} label={s.edge.dailyApis} />} />
      <Node logo={<SourceIcon name="file" />} title={s.files} caption={s.filesCaption} edges={<Edge kind="batch" to={s.workerBronze} label={s.edge.csv} />} />
    </Column>
  );
}

function Entry({s}: {s: Strings}): ReactNode {
  return (
    <Column title={s.col2} className={styles.entry}>
      <div className={styles.stack}>
        <Node logo={<Route53Logo />} title="Route 53" caption={s.route53Caption} />
        <Link kind="realtime" direction="down" />
        <Node logo={<WafLogo />} title="AWS WAF" caption={s.wafCaption} edges={<Edge kind="realtime" to="Internet Gateway" />} />
      </div>
      <Node
        logo={<EcrLogo />}
        title="Amazon ECR"
        caption={s.ecrCaption}
        edges={
          <>
            <Edge kind="cicd" to="FastAPI" label={s.edge.deployImage} />
            <Edge kind="cicd" to={s.core} label={s.edge.airflowImages} />
          </>
        }
      />
    </Column>
  );
}

function Processing({s}: {s: Strings}): ReactNode {
  return (
    <Column title={s.col3} className={styles.processing}>
      <Zone label={s.vpc} tone="vpc" icon="cloud">
        <Zone label={s.publicSubnet} tone="public" icon="lock">
          <div className={styles.row}>
            <Node logo={<IgwLogo />} title="Internet Gateway" caption={s.igwCaption} />
            <Link kind="realtime" />
            <Node logo={<AlbLogo />} title="Application Load Balancer" caption={s.albCaption} edges={<Edge kind="realtime" to="FastAPI" />} />
            <Node logo={<NatLogo />} title="NAT Gateway" caption={s.natCaption} />
          </div>
        </Zone>
        <Zone label={s.realtimeSubnet} tone="realtimeZone" icon="zap">
          <Node
            className={styles.box}
            logo={
              <>
                <FargateLogo />
                <FastApiLogo />
              </>
            }
            title="FastAPI · ECS Fargate"
            caption={s.fastapiCaption}
            edges={<Edge kind="realtime" both to="Neon" label={s.edge.directBooking} />}
          />
          <div className={styles.row}>
            <Node
              className={styles.box}
              logo={
                <>
                  <MqLogo />
                  <RabbitMqLogo />
                </>
              }
              title="Amazon MQ · RabbitMQ"
              caption={s.mqCaption}
              edges={
                <>
                  <Edge kind="realtime" to={s.consumers} label={s.edge.f2Events} />
                  <Edge kind="cicd" to={s.workers} label={s.edge.broker} />
                </>
              }
            />
            <Link kind="realtime" />
            <Node
              className={styles.box}
              logo={
                <>
                  <FargateLogo />
                  <PythonLogo size={30} />
                </>
              }
              title={s.consumers}
              caption={s.consumersCaption}
              edges={
                <>
                  <Edge kind="realtime" to="Neon" />
                  <Edge kind="realtime" to="Bronze" label={s.edge.f2Bronze} />
                </>
              }
            />
          </div>
        </Zone>
        <Zone label={s.batchSubnet} tone="batchZone" icon="clock">
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
                edge={<Edge kind="rates" to="RabbitMQ" label={s.edge.hourlyRates} />}
              />
              <div className={styles.edges}>
                <Edge kind="batch" to={s.endpoint} />
              </div>
              <p className={styles.note}>{s.sparkNote}</p>
            </div>
          </div>
        </Zone>
      </Zone>
      <div className={styles.row}>
        <Zone label={s.external} tone="external">
          <Node
            logo={<NeonLogo />}
            title="Neon PostgreSQL 16"
            caption={s.neonCaption}
            edges={<Edge kind="batch" to={s.workerBronze} label={s.edge.bronzeExtract} />}
          />
        </Zone>
        <Node
          className={clsx(styles.box, styles.endpoint)}
          logo={<EndpointLogo />}
          title={s.endpoint}
          caption={s.endpointCaption}
          edges={<Edge kind="batch" to="Amazon S3" label={s.edge.parquet} />}
        />
      </div>
    </Column>
  );
}

function Worker({
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

function Layer({name, caption, tone, color}: {name: string; caption: ReactNode; tone: 'bronze' | 'silver' | 'gold'; color: string}): ReactNode {
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
        <Node logo={<CrawlerLogo />} title="Glue Crawler" caption={s.crawlerCaption} />
        <Link kind="meta" />
        <Node logo={<GlueLogo size={30} />} title="Glue Data Catalog" caption={s.catalogCaption} />
        <Link kind="meta" direction="left" />
        <Node
          logo={<AthenaLogo size={30} />}
          title="Amazon Athena"
          caption={s.athenaCaption}
          edges={
            <>
              <Edge kind="gold" to="Power BI" />
              <Edge kind="gold" to="Metabase" />
            </>
          }
        />
      </div>
      <div className={styles.bucket}>
        <div className={styles.ec2Head}>
          <DataLakeLogo />
          <span>
            <span className={styles.nodeTitle}>{s.datalake}</span>
            <span className={styles.nodeCaption}>{s.datalakeCaption}</span>
          </span>
        </div>
        <div className={styles.layers}>
          <Layer name="Bronze" caption={s.bronzeCaption} tone="bronze" color="#b5651d" />
          <Link kind="batch" />
          <Layer name="Silver" caption={s.silverCaption} tone="silver" color="#6b7280" />
          <Link kind="batch" />
          <Layer name="Gold" caption={s.goldCaption} tone="gold" color="#b08900" />
        </div>
        <div className={styles.edges}>
          <Edge kind="gold" to="Gold → Amazon Athena" />
          <Edge kind="meta" to="silver/ · gold/ → Glue Crawler" label={s.edge.metadata} />
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
      <Node className={styles.dashedBox} logo={<MetabaseLogo size={30} />} title={s.metabase} caption={s.metabaseCaption} />
      <div className={styles.decide}>
        <strong>{s.decideTitle}</strong>
        <ul>
          {s.decide.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </Column>
  );
}

const securityServices: {name: string; caption: (s: Strings) => string}[] = [
  {name: 'IAM', caption: (s) => s.iamCaption},
  {name: 'KMS', caption: (s) => s.kmsCaption},
  {name: 'Secrets Manager', caption: (s) => s.secretsCaption},
  {name: 'CloudWatch', caption: (s) => s.cloudwatchCaption},
  {name: 'CloudTrail', caption: (s) => s.cloudtrailCaption},
  {name: 'Systems Manager', caption: (s) => s.ssmCaption},
];

/** AWS data architecture v2: five columns from the sources to the decision makers. */
export function ArchitectureV2(): ReactNode {
  const s = useStrings();
  const legendKinds = Object.keys(s.legend) as FlowKind[];
  return (
    <figure className={styles.figure} aria-label={s.ariaLabel}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>{s.title}</div>
          <div className={styles.subtitle}>{s.subtitle}</div>
        </div>
        <div className={styles.changes}>
          <strong>{s.changesTitle}</strong> {s.changes} <strong>{s.keptTitle}</strong> {s.kept}
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
                <span className={styles.nodeTitle}>{service.name}</span>
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
  );
}
