import type { ReactNode } from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  AthenaLogo,
  GlueLogo,
  PowerBiLogo,
} from "@site/src/components/Architecture/logos";
import {
  Column,
  Edge,
  FlowLine,
  Layer,
  Link,
  Node,
  SourceIcon,
  Worker,
  Zone,
  type FlowKind,
} from "./index";
import {
  AirflowMark,
  Ec2Logo,
  FlowerLogo,
  KafkaLogo,
  NeonLogo,
  PythonLogo,
  RabbitMqLogo,
  SparkMark,
  DataLakeLogo,
} from "./logos";
import { airflowStrings, type AirflowStrings } from "./airflowStrings";
import styles from "./styles.module.css";

function useStrings(): AirflowStrings {
  const { i18n } = useDocusaurusContext();
  return airflowStrings[i18n.currentLocale] ?? airflowStrings.en;
}

function Sources({ s }: { s: AirflowStrings }): ReactNode {
  return (
    <Column title={s.col1} className={styles.sources}>
      <Node
        logo={<SourceIcon name="file" />}
        title={s.f1}
        caption={s.f1Caption}
      />
      <Node
        className={styles.box}
        logo={<KafkaLogo />}
        title={s.f2}
        caption={s.f2Caption}
      />
      <Node logo={<NeonLogo size={30} />} title={s.f3} caption={s.f3Caption} />
      <Node
        logo={<SourceIcon name="file" />}
        title={s.f4}
        caption={s.f4Caption}
      />
      <Node
        logo={<SourceIcon name="message" />}
        title={s.f5}
        caption={s.f5Caption}
      />
      <Node
        logo={<SourceIcon name="calendar" />}
        title={s.f6}
        caption={s.f6Caption}
      />
      <Node
        logo={<SourceIcon name="currency" />}
        title={s.f7}
        caption={s.f7Caption}
      />
      <div className={styles.edges}>
        <Edge kind="batch" to={s.workerBronze} label={s.edge.bronzeGoes} />
      </div>
    </Column>
  );
}

function DagGroup({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: "bronze" | "silver" | "gold";
}): ReactNode {
  return (
    <div className={clsx(styles.dagGroup, styles.layer, styles[tone])}>
      <strong>{title}</strong>
      {body}
    </div>
  );
}

function Job({
  worker,
  job,
  tone,
}: {
  worker: ReactNode;
  job: ReactNode;
  tone: "bronze" | "silver" | "gold";
}): ReactNode {
  return (
    <div className={styles.jobRow}>
      {worker}
      <Link kind={tone === "bronze" ? "batch" : "batch"} />
      {job}
    </div>
  );
}

function Machines({ s }: { s: AirflowStrings }): ReactNode {
  return (
    <Column title={s.col2} className={styles.processing}>
      <div className={clsx(styles.box, styles.ec2)}>
        <div className={styles.ec2Head}>
          <Ec2Logo />
          <span>
            <span className={styles.nodeTitle}>{s.core}</span>
            <span className={styles.nodeCaption}>{s.coreCaption}</span>
          </span>
        </div>
        <div className={styles.row}>
          <Node
            logo={<AirflowMark size={30} />}
            title="Airflow 3.1.5"
            caption={s.airflowCaption}
          />
          <Node
            logo={<SourceIcon name="database" />}
            title="PostgreSQL"
            caption={s.postgresCaption}
          />
          <Node
            logo={<RabbitMqLogo />}
            title="RabbitMQ"
            caption={s.rabbitCaption}
          />
          <Node
            logo={<FlowerLogo />}
            title="Flower"
            caption={s.flowerCaption}
          />
        </div>
        <Zone label={s.dagsTitle} tone="vpc" icon="file">
          <DagGroup
            title={s.bronzeDagsTitle}
            body={s.bronzeDags}
            tone="bronze"
          />
          <DagGroup
            title={s.silverDagsTitle}
            body={s.silverDags}
            tone="silver"
          />
          <DagGroup title={s.goldDagsTitle} body={s.goldDags} tone="gold" />
          <p className={styles.note}>{s.dagsNote}</p>
        </Zone>
        <div className={styles.edges}>
          <Edge kind="cicd" to={s.workers} label={s.edge.orders} />
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
        <Job
          tone="bronze"
          worker={
            <Worker
              logo={<AirflowMark size={26} />}
              title={s.workerBronze}
              caption={s.workerBronzeCaption}
              tone="bronze"
            />
          }
          job={
            <Node
              logo={<PythonLogo size={28} />}
              title={s.jobBronze}
              caption={s.jobBronzeCaption}
              edges={
                <Edge kind="batch" to="bronze/" label={s.edge.writesBronze} />
              }
            />
          }
        />
        <Job
          tone="silver"
          worker={
            <Worker
              logo={<AirflowMark size={26} />}
              title={s.workerSilver}
              caption={s.workerSilverCaption}
              tone="silver"
            />
          }
          job={
            <Node
              logo={<SparkMark size={28} />}
              title={s.jobSilver}
              caption={s.jobSilverCaption}
              edges={
                <Edge kind="batch" to="silver/" label={s.edge.readsBronze} />
              }
            />
          }
        />
        <Job
          tone="gold"
          worker={
            <Worker
              logo={<AirflowMark size={26} />}
              title={s.workerGold}
              caption={s.workerGoldCaption}
              tone="gold"
            />
          }
          job={
            <Node
              logo={<SparkMark size={28} />}
              title={s.jobGold}
              caption={s.jobGoldCaption}
              edges={
                <Edge kind="batch" to="gold/" label={s.edge.readsSilver} />
              }
            />
          }
        />
        <div className={styles.edges}>
          <Edge kind="cicd" to={s.core} label={s.edge.status} />
        </div>
        <p className={styles.note}>{s.sparkNote}</p>
      </div>
    </Column>
  );
}

function Lake({ s }: { s: AirflowStrings }): ReactNode {
  return (
    <Column title={s.col3} className={styles.lake}>
      <Node
        logo={<GlueLogo size={30} />}
        title="Glue Data Catalog"
        caption={s.catalogCaption}
      />
      <Link kind="meta" direction="up" />
      <div className={styles.bucket}>
        <div className={styles.ec2Head}>
          <DataLakeLogo />
          <span>
            <span className={styles.nodeTitle}>Amazon S3</span>
            <span className={styles.nodeCaption}>
              hospedaplus-lakehouse-buenavista
            </span>
          </span>
        </div>
        <Node
          logo={<SourceIcon name="file" />}
          title="airflow-logs/"
          caption={s.logsCaption}
        />
        <Layer
          name="bronze/"
          caption={s.bronzeCaption}
          tone="bronze"
          color="#b5651d"
        />
        <Link kind="batch" direction="down" />
        <Layer
          name="silver/"
          caption={s.silverCaption}
          tone="silver"
          color="#6b7280"
        />
        <Link kind="batch" direction="down" />
        <Layer
          name="gold/"
          caption={s.goldCaption}
          tone="gold"
          color="#b08900"
        />
        <div className={styles.edges}>
          <Edge kind="gold" to="gold/ → Athena" />
          <Edge kind="rates" to="gold/ → Neon" label="gold_neon_writeback" />
        </div>
      </div>
    </Column>
  );
}

function Consumers({ s }: { s: AirflowStrings }): ReactNode {
  return (
    <Column title={s.col4} className={styles.analytics}>
      <Node
        logo={<NeonLogo size={30} />}
        title="Neon (F3)"
        caption={s.neonCaption}
      />
      <div className={styles.stack}>
        <Node
          logo={<PowerBiLogo size={30} />}
          title="Power BI"
          caption={s.powerbiCaption}
        />
        <Link kind="gold" direction="up" />
        <Node
          logo={<AthenaLogo size={30} />}
          title="Athena"
          caption={s.athenaCaption}
        />
      </div>
    </Column>
  );
}

/** Airflow architecture: core and workers EC2, the DAGs by layer and what each job leaves in S3. */
export function AirflowArchitecture(): ReactNode {
  const s = useStrings();
  const legendKinds = Object.keys(s.legend) as FlowKind[];
  return (
    <figure className={styles.figure} aria-label={s.title}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>{s.title}</div>
          <div className={styles.subtitle}>{s.subtitle}</div>
        </div>
      </div>
      <div className={styles.airflowBoard}>
        <Sources s={s} />
        <Machines s={s} />
        <Lake s={s} />
        <Consumers s={s} />
      </div>
      <div className={styles.legend}>
        <strong>{s.legendTitle}</strong>
        {legendKinds.map((kind) => (
          <span key={kind} className={clsx(styles.legendItem, styles[kind])}>
            <FlowLine kind={kind} width={34} />
            {s.legend[kind as keyof AirflowStrings["legend"]]}
          </span>
        ))}
      </div>
    </figure>
  );
}
