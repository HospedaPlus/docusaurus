import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {Flow, type FlowEdge, type FlowNode, type FlowSpec} from './engine';
import {flowStrings, type FlowStrings} from './strings';

/**
 * Every flow diagram of the docs, drawn as SVG in the site style.
 * They replace the old text (ASCII) drawings and keep exactly the same flow.
 * Usage in MDX:  import {F2Flow} from '@site/src/components/Flows';  then  <F2Flow />
 */

function useT(): FlowStrings {
  const {i18n} = useDocusaurusContext();
  return flowStrings[i18n.currentLocale] ?? flowStrings.en;
}

function make(build: (t: FlowStrings) => FlowSpec): () => ReactNode {
  return function Diagram(): ReactNode {
    return <Flow spec={build(useT())} />;
  };
}

// ---------------------------------------------------------------- data sources

export const F2Flow = make((t) => ({
  title: 'F2 channel manager events: producer, Kafka, Neon and bronze',
  width: 930,
  height: 270,
  nodes: [
    {id: 'p', x: 10, y: 40, w: 180, title: 'F2 producer', lines: ['src.kafka_producer', t.f2rate]},
    {id: 'k', x: 225, y: 40, w: 190, title: 'Kafka', lines: ['reservation.events.v1_3', t.partitions6], tone: 'kafka'},
    {id: 'c', x: 455, y: 40, w: 180, title: 'neon-consumer', lines: ['× NEON_CONSUMERS (2)', 'app_writer'], tone: 'kafka'},
    {id: 'l', x: 690, y: 14, w: 200, title: 'Neon · streaming', lines: ['reservation_event_ledger'], tone: 'neon'},
    {id: 'o', x: 690, y: 92, w: 200, title: 'Neon · operation', lines: ['reservar / modificar', 'cancelar / liberar'], tone: 'neon'},
    {id: 'd', x: 225, y: 160, w: 190, chip: true, title: 'reservation.events.dlq', tone: 'bad'},
    {id: 'a', x: 690, y: 200, w: 200, title: 'bronze_neon_f2_f3', lines: [`${t.everyHour} · etl_reader`], tone: 'airflow'},
    {id: 's', x: 420, y: 200, w: 230, title: 'S3 bronze', lines: ['f2_ledger/fecha=…/hora=HH.jsonl'], tone: 'bronze'},
  ],
  edges: [
    {from: 'p', to: 'k'},
    {from: 'k', to: 'c', tone: 'kafka'},
    {from: 'c', to: 'l', tone: 'neon', mid: 662},
    {from: 'c', to: 'o', tone: 'neon', mid: 662},
    {from: 'k', to: 'd', fs: 'b', ts: 't', label: t.invalid, tone: 'bad'},
    {from: 'l', to: 'a', fs: 'r', ts: 'r', mid: 912, tone: 'airflow'},
    {from: 'a', to: 's', fs: 'l', ts: 'r', tone: 'bronze'},
  ],
}));

export const F4Flow = make((t) => ({
  title: 'F4 weekly agency files: EC2, S3 bronze and Neon',
  width: 840,
  height: 230,
  nodes: [
    {id: 'g', x: 10, y: 80, w: 190, title: 'f4-weekly', lines: [t.mondayUtc6, 'F4_DUPLICATE_RATE 0.10']},
    {id: 'e', x: 290, y: 20, w: 220, title: 'EC2 · ./output/', lines: ['f4_agency_files/<week>/'], tone: 'aws'},
    {id: 's', x: 600, y: 20, w: 230, title: 'S3 bronze', lines: ['f4_agencias/semana=<week>/'], tone: 'bronze'},
    {id: 'n', x: 290, y: 160, w: 220, title: 'Neon · operation', lines: ["reservar('AGxx', …)"], tone: 'neon'},
    {id: 'a', x: 600, y: 160, w: 230, title: 'bronze_f4_agencias', lines: [t.mondayUtc7], tone: 'airflow'},
  ],
  edges: [
    {from: 'g', to: 'e', label: t.files, mid: 245, lx: 245, ly: 40},
    {from: 'e', to: 's', label: 'upload_file', tone: 'bronze'},
    {from: 'g', to: 'n', label: t.rows, tone: 'neon', mid: 245, lx: 245, ly: 205},
    {from: 'a', to: 's', fs: 't', ts: 'b', label: t.checksWeek, tone: 'airflow', lx: 560, ly: 120},
  ],
}));

export const F5Flow = make((t) => ({
  title: 'F5 guest reviews: simulator, API and bronze',
  width: 950,
  height: 220,
  nodes: [
    {id: 'sim', x: 10, y: 20, w: 200, h: 68, title: 'api-reviews-simulator', lines: [t.every15, t.perDay]},
    {id: 'pg', x: 250, y: 20, w: 180, h: 68, title: 'API PostgreSQL', lines: ['AWS ECS · us-east-1'], tone: 'aws'},
    {id: 'api', x: 470, y: 20, w: 200, h: 68, title: 'GET /api/v1/reviews', lines: ['?updated_from=…', 'page · page_size'], tone: 'out'},
    {id: 'a', x: 470, y: 140, w: 200, title: 'bronze_f5_reviews', lines: [t.everyHour], tone: 'airflow'},
    {id: 's', x: 710, y: 140, w: 230, title: 'S3 bronze', lines: ['f5_reviews/fecha=…/hora=HH.jsonl'], tone: 'bronze'},
  ],
  edges: [
    {from: 'sim', to: 'pg'},
    {from: 'pg', to: 'api', tone: 'aws'},
    {from: 'api', to: 'a', fs: 'b', ts: 't', label: 'requests', tone: 'airflow'},
    {from: 'a', to: 's', tone: 'bronze'},
  ],
}));

export const SourcesFlow = make((t) => {
  const y = (i: number) => 50 + i * 48;
  const airTop = 46;
  const airH = y(5) + 32 - airTop + 4;
  const at = (i: number) => (y(i) + 16 - airTop) / airH;
  return {
    title: 'Where each source is stored first and how it reaches the lake',
    width: 1000,
    height: 420,
    bands: [
      {x: 10, w: 300, label: t.simulators, tone: 'src'},
      {x: 370, w: 300, label: t.storedFirst, tone: 'neon'},
      {x: 700, w: 290, label: t.lake, tone: 'bronze'},
    ],
    nodes: [
      {id: 'f2', x: 10, y: y(0), w: 105, chip: true, title: 'F2 producer'},
      {id: 'kf', x: 130, y: y(0), w: 66, chip: true, title: 'Kafka', tone: 'kafka'},
      {id: 'cs', x: 210, y: y(0), w: 100, chip: true, title: 'consumer', tone: 'kafka'},
      {id: 'f3', x: 10, y: y(1), w: 300, chip: true, title: t.f3sim},
      {id: 'f6', x: 10, y: y(2), w: 300, chip: true, title: t.f6csv},
      {id: 'f5', x: 10, y: y(3), w: 300, chip: true, title: t.f5api},
      {id: 'ex', x: 10, y: y(4), w: 300, chip: true, title: t.extApis},
      {id: 'f4', x: 10, y: y(5), w: 300, chip: true, title: t.f4gen},
      {id: 'n0', x: 370, y: y(0), w: 300, chip: true, title: 'Neon · streaming + operation', tone: 'neon'},
      {id: 'n1', x: 370, y: y(1), w: 300, chip: true, title: 'Neon · operation', tone: 'neon'},
      {id: 'n2', x: 370, y: y(2), w: 300, chip: true, title: 'Neon · operation.local_events', tone: 'neon'},
      {id: 'n3', x: 370, y: y(3), w: 300, chip: true, title: 'API PostgreSQL', tone: 'aws'},
      {id: 'n5', x: 370, y: y(5), w: 300, chip: true, title: 'Neon · operation', tone: 'neon'},
      {id: 'af', x: 720, y: airTop, w: 140, h: airH, title: 'Airflow', lines: [t.hourly, '+ 03:00 UTC'], tone: 'airflow'},
      {id: 'b', x: 560, y: 370, w: 120, chip: true, title: 'S3 bronze', tone: 'bronze'},
      {id: 'sv', x: 720, y: 370, w: 100, chip: true, title: 'silver', tone: 'silver'},
      {id: 'gd', x: 860, y: 370, w: 100, chip: true, title: 'gold', tone: 'gold'},
    ],
    edges: [
      {from: 'f2', to: 'kf'},
      {from: 'kf', to: 'cs', tone: 'kafka'},
      {from: 'cs', to: 'n0', tone: 'neon'},
      {from: 'f3', to: 'n1', tone: 'neon'},
      {from: 'f6', to: 'n2', tone: 'neon'},
      {from: 'f5', to: 'n3', tone: 'aws'},
      {from: 'f4', to: 'n5', tone: 'neon', label: 'reservar()', lx: 340, ly: y(5) + 10},
      ...[0, 1, 2, 3, 5].map((i): FlowEdge => ({from: `n${i}`, to: 'af', to_: at(i), tone: 'airflow'})),
      {from: 'ex', to: 'af', to_: at(4), tone: 'airflow'},
      {from: 'af', to: 'b', fs: 'b', ts: 't', tone: 'bronze', mid: 350},
      {from: 'f4', to: 'b', fs: 'b', ts: 'l', fo: 0.5, label: t.rawFiles, tone: 'bronze', dashed: true, lx: 330, ly: 380},
      {from: 'b', to: 'sv', tone: 'silver'},
      {from: 'sv', to: 'gd', tone: 'gold'},
    ],
  };
});

// ---------------------------------------------------------------- pipeline

export const EtlFlow = make((t) => ({
  title: 'OLTP to OLAP: extract, transform and load',
  width: 1000,
  height: 250,
  bands: [
    {x: 10, w: 180, label: 'OLTP', tone: 'neon'},
    {x: 230, w: 160, label: 'E · Extract', tone: 'bronze'},
    {x: 440, w: 170, label: 'T · Transform', tone: 'silver'},
    {x: 660, w: 160, label: 'L · Load', tone: 'gold'},
    {x: 870, w: 120, label: 'OLAP', tone: 'out'},
  ],
  groups: [{x: 220, y: 150, w: 610, h: 82, label: t.lakehouse, tone: 'bronze'}],
  nodes: [
    {id: 'neon', x: 10, y: 50, w: 180, h: 84, title: 'Neon', lines: ['operation · streaming', t.bookings, t.localEvents], tone: 'neon'},
    {id: 'api', x: 10, y: 160, w: 180, title: t.apisFiles, lines: ['F1 · F5 · F6 · F7']},
    {id: 'bd', x: 230, y: 50, w: 160, h: 84, title: 'bronze DAGs', lines: ['worker bronze', t.rawCopy], tone: 'airflow'},
    {id: 'sb', x: 230, y: 186, w: 160, chip: true, title: 'S3 bronze', tone: 'bronze'},
    {id: 'ss', x: 440, y: 50, w: 170, h: 84, title: 'Spark silver', lines: ['worker silver', t.cleanCopDedup], tone: 'silver'},
    {id: 'sv', x: 440, y: 186, w: 170, chip: true, title: 'S3 silver', tone: 'silver'},
    {id: 'sg', x: 660, y: 50, w: 160, h: 84, title: 'Spark gold', lines: ['worker gold', t.starMarts], tone: 'gold'},
    {id: 'gd', x: 660, y: 186, w: 160, chip: true, title: 'S3 gold', tone: 'gold'},
    {id: 'at', x: 870, y: 60, w: 120, chip: true, title: 'Athena', tone: 'out'},
    {id: 'pb', x: 870, y: 130, w: 120, chip: true, title: 'Power BI', tone: 'out'},
  ],
  edges: [
    {from: 'neon', to: 'bd'},
    {from: 'api', to: 'bd', to_: 0.85, mid: 210},
    {from: 'bd', to: 'sb', fs: 'b', ts: 't', tone: 'bronze'},
    {from: 'sb', to: 'ss', mid: 415, tone: 'silver'},
    {from: 'ss', to: 'sv', fs: 'b', ts: 't', tone: 'silver'},
    {from: 'sv', to: 'sg', mid: 635, tone: 'gold'},
    {from: 'sg', to: 'gd', fs: 'b', ts: 't', tone: 'gold'},
    {from: 'gd', to: 'at', mid: 845, tone: 'out'},
    {from: 'at', to: 'pb', fs: 'b', ts: 't', tone: 'out'},
  ],
}));

export const MedallionFlow = make((t) => ({
  title: 'Medallion layers: bronze, silver, gold',
  width: 1100,
  height: 110,
  nodes: [
    {id: 'b', x: 10, y: 20, w: 190, title: 'bronze/', lines: [t.asItCame, 'JSON · CSV · Excel'], tone: 'bronze'},
    {id: 's', x: 320, y: 20, w: 190, title: 'silver/', lines: [t.oneTruth, 'Parquet · COP'], tone: 'silver'},
    {id: 'g', x: 630, y: 20, w: 190, title: 'gold/', lines: [t.starMarts, 'Parquet'], tone: 'gold'},
    {id: 'o', x: 940, y: 20, w: 150, title: 'Athena / Power BI', lines: [t.analysis], h: 68, tone: 'out'},
  ],
  edges: [
    {from: 'b', to: 's', label: t.rawReplayable, tone: 'silver'},
    {from: 's', to: 'g', label: t.cleanConformed, tone: 'gold'},
    {from: 'g', to: 'o', label: t.modelledReady, tone: 'out'},
  ],
}));

export const StarSchema = make((t) => ({
  title: 'Gold star model: dimensions around the fact tables',
  width: 900,
  height: 410,
  nodes: [
    {id: 'f', x: 340, y: 10, w: 220, title: 'dim_fecha', lines: ['PK fecha', 'anio, mes, semana…'], tone: 'gold'},
    {id: 'c', x: 20, y: 150, w: 220, title: 'dim_canal', lines: ['PK channel_code', 'channel_type, comisión'], tone: 'gold'},
    {id: 'x', x: 340, y: 134, w: 220, title: 'FACTS', lines: ['fact_reservas', 'fact_cancelaciones', 'fact_ocupacion_diaria', 'fact_resenas'], tone: 'out'},
    {id: 'r', x: 660, y: 150, w: 220, title: 'dim_tipo_habitacion', lines: ['PK room_type', 'nombre, capacidad'], tone: 'gold'},
    {id: 'h', x: 340, y: 290, w: 220, title: 'dim_hotel', lines: ['PK hotel_code', 'ciudad, pais, categoría'], tone: 'gold'},
  ],
  edges: [
    {from: 'f', to: 'x', fs: 'b', ts: 't', arrow: false, tone: 'gold'},
    {from: 'c', to: 'x', arrow: false, tone: 'gold'},
    {from: 'x', to: 'r', arrow: false, tone: 'gold'},
    {from: 'x', to: 'h', fs: 'b', ts: 't', arrow: false, tone: 'gold'},
  ],
  notes: [{x: 450, y: 398, text: t.martsFromFacts, anchor: 'middle', bold: true, tone: 'out'}],
}));

export const NeonFlow = make((t) => {
  const tables = [
    'streaming.reservation_event_ledger',
    'operation.reservations · reservation_anomalies · inventory',
    'operation.relocations · reservation_rejections · local_events',
    'operation.hotels · room_types · channels · rates · cancellation_…',
    'operation.cancellation_rate_by_lead',
  ];
  return {
    title: 'Neon: who writes each table and how the pipeline reads it',
    width: 1080,
    height: 410,
    groups: [{x: 190, y: 14, w: 540, h: 262, label: 'Neon · database hospedaplus', tone: 'neon', solid: true}],
    nodes: [
      {id: 'neon', x: 190, y: 14, w: 540, h: 262, title: '', ghost: true},
      ...tables.map((title, i): FlowNode => ({id: `t${i}`, x: 205, y: 46 + i * 44, w: 510, chip: true, title, tone: 'neon'})),
      {id: 'f2', x: 10, y: 46, w: 140, chip: true, title: 'F2 consumer', tone: 'kafka'},
      {id: 'f3', x: 10, y: 90, w: 140, chip: true, title: 'F3 simulator'},
      {id: 'f4', x: 10, y: 134, w: 140, chip: true, title: 'F4 loader'},
      {id: 'wb', x: 800, y: 222, w: 270, chip: true, title: 'gold_neon_writeback · app_writer', tone: 'gold'},
      {id: 'rd', x: 190, y: 320, w: 540, title: t.bronzeDags, lines: ['bronze_neon_f2_f3 (hourly) · bronze_neon_full_load (03:00)', 'bronze_neon_dims (03:15) · bronze_f6_events (02:30)'], tone: 'airflow'},
      {id: 's3', x: 820, y: 338, w: 160, chip: true, title: 'S3 bronze/', tone: 'bronze'},
    ],
    edges: [
      {from: 'f2', to: 't0', tone: 'kafka'},
      {from: 'f3', to: 't1'},
      {from: 'f4', to: 't2'},
      {from: 'wb', to: 't4', fs: 'l', ts: 'r', label: t.writeBack, tone: 'gold'},
      {from: 'neon', to: 'rd', fs: 'b', ts: 't', label: t.readOnly, tone: 'airflow'},
      {from: 'rd', to: 's3', tone: 'bronze'},
    ],
  };
});

export const AwsServicesFlow = make((t) => ({
  title: 'AWS services used by the pipeline',
  width: 1160,
  height: 270,
  nodes: [
    {id: 'iam', x: 10, y: 40, w: 200, h: 68, title: 'IAM role', lines: ['hospedaplus-pipeline-role'], tone: 'aws'},
    {id: 'ec2', x: 240, y: 40, w: 200, h: 68, title: t.ec2Title, lines: ['Elastic IP · Security Groups', 'Airflow · Celery · Spark'], tone: 'aws'},
    {id: 's3', x: 470, y: 40, w: 170, h: 68, title: 'S3 lakehouse', lines: ['bronze / silver / gold', 'airflow-logs/'], tone: 'bronze'},
    {id: 'glue', x: 670, y: 40, w: 190, h: 68, title: 'Glue Data Catalog', lines: ['hospedaplus_gold · silver'], tone: 'aws'},
    {id: 'ath', x: 890, y: 40, w: 110, h: 68, title: 'Athena', lines: ['us-east-2'], tone: 'out'},
    {id: 'pbi', x: 1030, y: 40, w: 120, h: 68, title: 'Power BI', lines: ['ODBC'], tone: 'out'},
    {id: 'lf', x: 670, y: 170, w: 190, chip: true, title: t.lfPerms, tone: 'aws'},
  ],
  edges: [
    {from: 'iam', to: 'ec2', tone: 'aws'},
    {from: 'ec2', to: 's3', tone: 'bronze'},
    {from: 's3', to: 'glue', tone: 'aws'},
    {from: 'glue', to: 'ath', tone: 'out'},
    {from: 'ath', to: 'pbi', tone: 'out'},
    {from: 'lf', to: 'glue', fs: 't', ts: 'b', tone: 'aws'},
    {from: 'iam', to: 's3', fs: 'b', ts: 'b', mid: 240, dashed: true, label: t.tempCreds, tone: 'aws'},
  ],
}));

export const DagsTimeline = make((t) => {
  const y = (i: number) => 50 + i * 42;
  const chip = (id: string, x: number, i: number, title: string, tone: FlowNode['tone'] = 'airflow'): FlowNode => ({id, x, y: y(i), chip: true, title, tone});
  const times: [string, string][] = [
    [t.everyHour, t.everyHour],
    [t.everyHour, t.everyHour],
    ['01:00', '20:00'],
    ['02:00', '21:00'],
    ['02:30', '21:30'],
    ['03:00', '22:00'],
    ['03:15', '22:15'],
    ['03:30', '22:30'],
    ['~03:35', '22:35'],
    ['05:00', '00:00'],
  ];
  return {
    title: 'Daily schedule of the DAGs (UTC and Colombia time)',
    width: 1100,
    height: 480,
    notes: [
      {x: 14, y: 30, text: 'UTC', bold: true, tone: 'airflow'},
      {x: 100, y: 30, text: 'COT', bold: true, tone: 'airflow'},
      ...times.flatMap(([u, c], i) => [
        {x: 14, y: y(i) + 20, text: u, bold: true},
        {x: 100, y: y(i) + 20, text: c},
      ]),
      {x: 600, y: y(0) + 20, text: t.hourlyRefresh},
      {x: 360, y: y(1) + 20, text: t.accumulates},
      {x: 650, y: y(3) + 20, text: `(${t.day1})`},
      {x: 200, y: y(9) + 20, text: t.madrid, bold: true, tone: 'gold'},
    ],
    nodes: [
      chip('a0', 200, 0, 'bronze_neon_f2_f3', 'bronze'),
      chip('b0', 400, 0, 'silver_reservas_daily', 'silver'),
      chip('a1', 200, 1, 'bronze_f5_reviews', 'bronze'),
      chip('a2', 200, 2, 'bronze_f7_fx', 'bronze'),
      chip('b2', 400, 2, 'silver_fx_daily', 'silver'),
      chip('a3', 200, 3, 'bronze_f6_holidays', 'bronze'),
      chip('b3', 400, 3, 'silver_calendario_daily', 'silver'),
      chip('a4', 200, 4, 'bronze_f6_events', 'bronze'),
      chip('a5', 200, 5, 'bronze_neon_full_load', 'bronze'),
      chip('a6', 200, 6, 'bronze_neon_dims', 'bronze'),
      {id: 'col', x: 780, y: y(4) - 6, w: 220, title: t.silverAssets, lines: ['silver_reservas_daily', 'silver_ocupacion_daily', 'silver_calendario_daily'], tone: 'silver'},
      chip('a7', 200, 7, 'silver_resenas_daily', 'silver'),
      chip('a8', 200, 8, t.allFour, 'silver'),
      chip('b8', 520, 8, 'gold_modelo_daily', 'gold'),
      chip('c8', 720, 8, 'gold_neon_writeback', 'gold'),
    ],
    edges: [
      {from: 'a0', to: 'b0', tone: 'silver'},
      {from: 'a2', to: 'b2', tone: 'silver'},
      {from: 'a3', to: 'b3', tone: 'silver'},
      {from: 'b2', to: 'col', to_: 0.18, mid: 720, dashed: true, tone: 'silver', label: t.assets, lx: 650, ly: y(2) + 10},
      {from: 'a4', to: 'col', to_: 0.38, mid: 735, dashed: true, tone: 'silver'},
      {from: 'a5', to: 'col', to_: 0.58, mid: 745, dashed: true, tone: 'silver'},
      {from: 'a6', to: 'col', to_: 0.8, mid: 755, tone: 'silver'},
      {from: 'a8', to: 'b8', tone: 'gold'},
      {from: 'b8', to: 'c8', tone: 'gold'},
    ],
  };
});

export const DagDependencies = make((t) => {
  const rows: [string, string][] = [
    ['bronze_f7_fx', 'silver_fx_daily'],
    ['(silver_fx_daily & bronze_neon_full_load & bronze_neon_dims) | bronze_neon_f2_f3', 'silver_reservas_daily'],
    ['bronze_neon_full_load & bronze_neon_dims', 'silver_ocupacion_daily'],
    ['(bronze_f6_events & bronze_neon_dims) | bronze_f6_holidays', 'silver_calendario_daily'],
    [t.clock, 'silver_resenas_daily'],
    ['bronze_f1_historical', 'silver_f1_historico'],
    ['silver_ocupacion & silver_calendario & silver_reservas & silver_resenas', 'gold_modelo_daily'],
    ['gold_modelo_daily', 'gold_neon_writeback'],
  ];
  const y = (i: number) => 14 + i * 44;
  return {
    title: 'What starts each silver and gold DAG',
    width: 920,
    height: y(rows.length) + 20,
    nodes: rows.flatMap(([cause, target], i): FlowNode[] => [
      {id: `c${i}`, x: 10, y: y(i), w: 590, chip: true, title: cause, tone: 'bronze'},
      {id: `t${i}`, x: 680, y: y(i), w: 230, chip: true, title: target, tone: target.startsWith('gold') ? 'gold' : 'silver'},
    ]),
    edges: rows.map((_, i): FlowEdge => ({from: `c${i}`, to: `t${i}`, tone: 'airflow'})),
    notes: [{x: 460, y: y(rows.length) + 6, text: t.legendDeps, anchor: 'middle', tone: 'airflow', bold: true}],
  };
});

// ---------------------------------------------------------------- visualization

export const PowerBiFlow = make((t) => ({
  title: 'From the sources to Power BI',
  width: 780,
  height: 560,
  groups: [{x: 110, y: 82, w: 560, h: 82, label: 'S3 · hospedaplus-lakehouse-buenavista', tone: 'bronze'}],
  nodes: [
    {id: 'src', x: 10, y: 10, w: 760, chip: true, title: t.pbiSources},
    {id: 'b', x: 150, y: 116, w: 130, chip: true, title: 'bronze', tone: 'bronze'},
    {id: 's', x: 325, y: 116, w: 130, chip: true, title: 'silver', tone: 'silver'},
    {id: 'g', x: 500, y: 116, w: 130, chip: true, title: 'gold', tone: 'gold'},
    {id: 'glue', x: 240, y: 230, w: 300, title: 'Glue Data Catalog', lines: ['database hospedaplus_gold'], tone: 'aws'},
    {id: 'ath', x: 240, y: 330, w: 300, title: 'Amazon Athena', lines: ['workgroup primary · us-east-2'], tone: 'aws'},
    {id: 'odbc', x: 240, y: 430, w: 300, chip: true, title: 'Athena ODBC driver', tone: 'out'},
    {id: 'pbi', x: 110, y: 506, w: 560, chip: true, title: t.pbiOut, tone: 'out'},
  ],
  edges: [
    {from: 'src', to: 'b', fs: 'b', ts: 't', label: 'Airflow (hospedaplus-pipeline)', tone: 'airflow', mid: 62},
    {from: 'b', to: 's', tone: 'silver'},
    {from: 's', to: 'g', tone: 'gold'},
    {from: 'g', to: 'glue', fs: 'b', ts: 't', label: t.externalTables, tone: 'aws', mid: 198},
    {from: 'glue', to: 'ath', fs: 'b', ts: 't', tone: 'aws'},
    {from: 'ath', to: 'odbc', fs: 'b', ts: 't', tone: 'out'},
    {from: 'odbc', to: 'pbi', fs: 'b', ts: 't', tone: 'out'},
  ],
}));

export const PublishingFlow = make((t) => ({
  title: 'Scheduled refresh of the Power BI Service',
  width: 880,
  height: 200,
  nodes: [
    {id: 'svc', x: 10, y: 30, w: 180, chip: true, title: 'Power BI Service', tone: 'out'},
    {id: 'gw', x: 300, y: 30, w: 220, chip: true, title: 'gateway hospedaplus-gw', tone: 'out'},
    {id: 'odbc', x: 640, y: 30, w: 200, chip: true, title: 'Athena ODBC driver', tone: 'out'},
    {id: 'ath', x: 600, y: 140, w: 280, chip: true, title: t.athenaReads, tone: 'aws'},
  ],
  edges: [
    {from: 'svc', to: 'gw', label: '05:00 COT', tone: 'out'},
    {from: 'gw', to: 'odbc', tone: 'out'},
    {from: 'odbc', to: 'ath', fs: 'b', ts: 't', to_: 0.57, fo: 0.5, tone: 'aws'},
    {from: 'ath', to: 'svc', fs: 'l', ts: 'b', label: t.rows, tone: 'aws'},
  ],
}));

// ---------------------------------------------------------------- new sections

export const CiCdFlow = make((t) => ({
  title: 'CI/CD of every repository',
  width: 1040,
  height: 360,
  nodes: [
    {id: 'pr', x: 10, y: 46, w: 180, chip: true, title: t.prMain},
    {id: 'ci', x: 240, y: 20, w: 240, title: 'CI · GitHub Actions', lines: t.ciLines, tone: 'airflow'},
    {id: 'm', x: 540, y: 46, w: 210, chip: true, title: t.merge, tone: 'ok'},
    {id: 'img', x: 240, y: 180, w: 300, title: t.imageTitle, lines: ['ghcr.io/hospedaplus/<repo>', 'ECR (api-reviews)', 'tags: <sha> · main · vX.Y.Z'], tone: 'out'},
    {id: 'gate', x: 590, y: 212, w: 160, chip: true, title: t.secretsQ, tone: 'gold'},
    {id: 'dep', x: 800, y: 180, w: 230, title: t.deployTitle, lines: ['ssh EC2: git pull --ff-only', 'docker compose up -d --build', 'ECS: new task definition'], tone: 'aws'},
    {id: 'skip', x: 800, y: 306, w: 230, chip: true, title: t.skipped},
  ],
  edges: [
    {from: 'pr', to: 'ci'},
    {from: 'ci', to: 'm', tone: 'ok', label: '✓'},
    {from: 'm', to: 'img', fs: 'b', ts: 't', mid: 140, tone: 'out'},
    {from: 'img', to: 'gate', tone: 'gold'},
    {from: 'gate', to: 'dep', label: t.yes, tone: 'aws'},
    {from: 'gate', to: 'skip', fs: 'b', ts: 'l', label: t.no, dashed: true},
  ],
}));

export const DockerTopology = make((t) => {
  const c = (id: string, x: number, y: number, w: number, title: string, tone: FlowNode['tone'] = 'src'): FlowNode => ({id, x, y, w, chip: true, title, tone});
  return {
    title: 'Which containers run where',
    width: 1100,
    height: 480,
    groups: [
      {x: 10, y: 10, w: 520, h: 430, label: t.ec2Sources, tone: 'aws', solid: true},
      {x: 25, y: 40, w: 490, h: 140, label: 'buenavista-streaming (F2) · docker-compose.yml', tone: 'kafka'},
      {x: 25, y: 196, w: 490, h: 120, label: 'db_simulated (F3) · docker-compose.yml', tone: 'neon'},
      {x: 25, y: 332, w: 490, h: 92, label: 'hospedaplus-csv (F4) · docker-compose.yml', tone: 'src'},
      {x: 560, y: 10, w: 530, h: 110, label: `api-reviews (F5) · ${t.ecs}`, tone: 'aws', solid: true},
      {x: 560, y: 140, w: 530, h: 160, label: `hospedaplus-pipeline · ${t.ec2Core}`, tone: 'airflow', solid: true},
      {x: 560, y: 370, w: 530, h: 100, label: `hospedaplus-pipeline · ${t.ec2Workers}`, tone: 'airflow', solid: true},
    ],
    nodes: [
      c('k', 40, 72, 90, 'kafka', 'kafka'),
      c('ki', 145, 72, 110, 'kafka-init', 'kafka'),
      c('nm', 270, 72, 130, 'neon-migrate', 'neon'),
      c('pr', 40, 126, 110, 'producer', 'kafka'),
      c('nc', 165, 126, 200, 'neon-consumer × 2', 'kafka'),
      c('ns', 40, 228, 150, 'neon-simulator', 'neon'),
      c('nsd', 205, 228, 210, `neon-seed · neon-check`, 'src'),
      c('f4', 40, 364, 130, 'f4-weekly', 'src'),
      c('api', 575, 46, 160, 'api (FastAPI)', 'aws'),
      c('sim', 750, 46, 200, 'simulator (--live)', 'aws'),
      c('pg', 575, 172, 100, 'postgres', 'airflow'),
      c('rmq', 690, 172, 110, 'rabbitmq', 'airflow'),
      c('apis', 815, 172, 160, 'airflow-apiserver', 'airflow'),
      c('sch', 575, 222, 160, 'airflow-scheduler', 'airflow'),
      c('dp', 750, 222, 130, 'dag-processor', 'airflow'),
      c('tr', 895, 222, 100, 'triggerer', 'airflow'),
      c('fl', 575, 262, 90, 'flower', 'airflow'),
      c('init', 680, 262, 120, 'airflow-init', 'src'),
      c('wb', 575, 404, 150, 'worker-bronze', 'bronze'),
      c('ws', 740, 404, 150, 'worker-silver', 'silver'),
      c('wg', 905, 404, 140, 'worker-gold', 'gold'),
      {id: 'core', x: 560, y: 140, w: 530, h: 160, title: '', ghost: true},
      {id: 'wk', x: 560, y: 370, w: 530, h: 100, title: '', ghost: true},
    ],
    edges: [
      {from: 'wk', to: 'core', fs: 't', ts: 'b', label: t.coreLink, tone: 'airflow', lx: 825, ly: 340},
    ],
    notes: [{x: 210, y: 300, text: `profile neon · ${t.onDemand}`, size: 10.5}],
  };
});

export const LambdaMedallion = make((t) => ({
  title: 'Architecture style: streaming path plus batch medallion lakehouse',
  width: 1060,
  height: 340,
  groups: [
    {x: 10, y: 10, w: 1040, h: 110, label: t.speedLayer, tone: 'kafka'},
    {x: 10, y: 190, w: 1040, h: 120, label: t.batchLayer, tone: 'bronze'},
  ],
  nodes: [
    {id: 'p', x: 30, y: 56, w: 130, chip: true, title: 'F2 producer'},
    {id: 'k', x: 200, y: 56, w: 90, chip: true, title: 'Kafka', tone: 'kafka'},
    {id: 'c', x: 330, y: 56, w: 140, chip: true, title: 'neon-consumer', tone: 'kafka'},
    {id: 'n', x: 510, y: 56, w: 220, chip: true, title: 'Neon (operation + ledger)', tone: 'neon'},
    {id: 'live', x: 770, y: 56, w: 260, chip: true, title: t.liveOps, tone: 'neon'},
    {id: 'o', x: 30, y: 250, w: 200, chip: true, title: t.otherSources},
    {id: 'b', x: 420, y: 250, w: 110, chip: true, title: 'bronze', tone: 'bronze'},
    {id: 's', x: 570, y: 250, w: 110, chip: true, title: 'silver', tone: 'silver'},
    {id: 'g', x: 720, y: 250, w: 110, chip: true, title: 'gold', tone: 'gold'},
    {id: 'pbi', x: 870, y: 250, w: 160, chip: true, title: 'Athena · Power BI', tone: 'out'},
  ],
  edges: [
    {from: 'p', to: 'k', tone: 'kafka'},
    {from: 'k', to: 'c', tone: 'kafka'},
    {from: 'c', to: 'n', tone: 'neon'},
    {from: 'n', to: 'live', tone: 'neon'},
    {from: 'n', to: 'b', fs: 'b', ts: 't', fo: 0.2, mid: 150, label: t.extract, tone: 'airflow', dashed: true, lx: 300, ly: 172},
    {from: 'g', to: 'n', fs: 't', ts: 'b', to_: 0.8, mid: 165, label: t.writeBackP, tone: 'gold', lx: 880, ly: 160},
    {from: 'o', to: 'b', tone: 'bronze'},
    {from: 'b', to: 's', tone: 'silver'},
    {from: 's', to: 'g', tone: 'gold'},
    {from: 'g', to: 'pbi', tone: 'out'},
  ],
}));

export const ConnectionsFlow = make((t) => {
  const targets: [string, string, string, FlowNode['tone']][] = [
    ['nr', 'Neon · etl_reader', 'psycopg2.connect(NEON_READ_URL)', 'neon'],
    ['nw', 'Neon · app_writer', t.writebackOnly, 'neon'],
    ['s3', 'S3 lakehouse', 'boto3 · s3a:// (Spark)', 'bronze'],
    ['ap', t.apis, 'F5 reviews · Nager · Frankfurter', 'out'],
    ['lg', 'S3 airflow-logs/', 'connection aws_default', 'airflow'],
  ];
  return {
    title: 'How an Airflow task reaches each system',
    width: 1080,
    height: 430,
    nodes: [
      {id: 'env', x: 10, y: 110, w: 300, title: t.envTitle, lines: ['NEON_READ_URL · NEON_WRITE_URL', 'S3_BUCKET · AWS_DEFAULT_REGION', 'F5_API_URL · NAGER_BASE_URL', 'AIRFLOW_CONN_AWS_DEFAULT']},
      {id: 'iam', x: 10, y: 290, w: 300, chip: true, title: t.iamTitle, tone: 'aws'},
      {id: 'core', x: 400, y: 20, w: 270, chip: true, title: t.coreTitle, tone: 'airflow'},
      {id: 'task', x: 400, y: 170, w: 270, h: 84, title: t.taskTitle, lines: ['os.getenv(…)', 'psycopg2 · boto3 · requests', 'Spark (s3a)'], tone: 'airflow'},
      ...targets.map(([id, title, line, tone], i): FlowNode => ({id, x: 760, y: 14 + i * 82, w: 310, title, lines: [line], tone})),
    ],
    edges: [
      {from: 'env', to: 'task', to_: 0.3},
      {from: 'iam', to: 'task', to_: 0.75, label: t.tempCredsShort, tone: 'aws', mid: 355, lx: 200, ly: 284},
      {from: 'task', to: 'core', fs: 't', ts: 'b', label: t.brokerMeta, tone: 'airflow'},
      ...targets.map(([id, , , tone], i): FlowEdge => ({from: 'task', to: id, fo: 0.15 + i * 0.175, tone, mid: 715 + i * 6})),
    ],
  };
});

export const F3Flow = make((t) => ({
  title: 'F3 own booking engine: Neon and the three bronze copies',
  width: 1040,
  height: 240,
  nodes: [
    {id: 'sim', x: 10, y: 30, w: 210, chip: true, title: t.f3sim},
    {id: 'oth', x: 10, y: 120, w: 210, chip: true, title: t.f3Writers, tone: 'kafka'},
    {id: 'n', x: 300, y: 60, w: 180, title: 'Neon · operation', lines: ['reservar()', 'updated_at (trigger)'], tone: 'neon'},
    {id: 'd0', x: 540, y: 10, w: 220, title: 'bronze_neon_f2_f3', lines: [t.byUpdatedAt], tone: 'airflow'},
    {id: 'd1', x: 540, y: 90, w: 220, title: 'bronze_neon_full_load', lines: [t.nightlySnapshot], tone: 'airflow'},
    {id: 'd2', x: 540, y: 170, w: 220, title: 'bronze_neon_dims', lines: [t.nightlyCatalog], tone: 'airflow'},
    {id: 's0', x: 800, y: 20, w: 230, chip: true, title: 'f3_reservations/ · f3_anomalies/', tone: 'bronze'},
    {id: 's1', x: 800, y: 100, w: 230, chip: true, title: 'f3_*_full/', tone: 'bronze'},
    {id: 's2', x: 800, y: 180, w: 230, chip: true, title: 'neon_dims/', tone: 'bronze'},
  ],
  edges: [
    {from: 'sim', to: 'n', to_: 0.3, tone: 'neon'},
    {from: 'oth', to: 'n', to_: 0.75, tone: 'neon', label: t.sameReservar, lx: 255, ly: 160},
    ...[0, 1, 2].map((i): FlowEdge => ({from: 'n', to: `d${i}`, mid: 510, tone: 'airflow'})),
    ...[0, 1, 2].map((i): FlowEdge => ({from: `d${i}`, to: `s${i}`, tone: 'bronze'})),
  ],
  notes: [{x: 915, y: 228, text: 'S3 bronze/', anchor: 'middle', bold: true, tone: 'bronze'}],
}));

export const LakeTree = make((t) => {
  const H = 34;
  const y = (i: number) => 10 + i * H;
  const kids: [string, string?][] = [
    ['f2_ledger/fecha=YYYY-MM-DD/hora=HH.jsonl'],
    ['f3_reservations/fecha=…/hora=HH.jsonl', 'f3_anomalies/…'],
    ['f3_reservations_full/fecha=…/part-NNNNN.jsonl + _SUCCESS', t.treeFull],
    [`neon_dims/${t.table}/fecha=YYYY-MM-DD.jsonl`],
    ['f4_agencias/semana=YYYY-Www/'],
    ['f5_reviews/fecha=…/hora=HH.jsonl'],
    ['f6_holidays/anio=YYYY/pais=XX.json', 'f6_events/fecha=….jsonl'],
    ['f7_fx/fecha=YYYY-MM-DD.json'],
    ['f1_historical/hotel_bookings.csv'],
  ];
  const kidW = (s: string) => Math.ceil(s.length * 7.1 + 24);
  return {
    title: 'Folders of the S3 lakehouse',
    width: 1000,
    height: y(14) + 4,
    nodes: [
      {id: 'root', x: 10, y: y(0), w: 330, chip: true, title: 's3://hospedaplus-lakehouse-buenavista/', tone: 'aws'},
      {id: 'b', x: 50, y: y(1), w: 90, chip: true, title: 'bronze/', tone: 'bronze'},
      ...kids.map(([k], i): FlowNode => ({id: `k${i}`, x: 100, y: y(2 + i), w: kidW(k), chip: true, title: k, tone: 'bronze'})),
      {id: 's', x: 50, y: y(11), w: 90, chip: true, title: 'silver/', tone: 'silver'},
      {id: 'g', x: 50, y: y(13), w: 90, chip: true, title: 'gold/', tone: 'gold'},
    ],
    edges: [
      ...['b', 's', 'g'].map((id): FlowEdge => ({from: 'root', to: id, fs: 'b', fo: 20 / 330, ts: 'l', arrow: false, tone: 'aws'})),
      ...kids.map((_, i): FlowEdge => ({from: 'b', to: `k${i}`, fs: 'b', fo: 22 / 90, ts: 'l', arrow: false, tone: 'bronze'})),
    ],
    notes: [
      {x: 155, y: y(1) + 20, text: t.treeBronze},
      ...kids.flatMap(([k, extra], i) => (extra ? [{x: 100 + kidW(k) + 12, y: y(2 + i) + 20, text: extra}] : [])),
      {x: 155, y: y(11) + 14, text: t.treeSilver},
      {x: 155, y: y(11) + 30, text: t.treeSilver2},
      {x: 155, y: y(13) + 20, text: t.treeGold},
    ],
  };
});

const TONE_HEX: Record<string, string> = {
  src: '#6b7280', neon: '#0f766e', kafka: '#0891b2', airflow: '#2563eb', bronze: '#b45309',
  silver: '#64748b', gold: '#ca8a04', out: '#5b45e0', aws: '#e8590c', bad: '#dc2626',
};

/** A connection string or URI split in coloured parts, each with its name under it. */
export function UriAnatomy({parts}: {parts: [string, string?, string?][]}): ReactNode {
  return (
    <div style={{margin: '1rem 0 1.5rem', padding: '0.9rem 1rem', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 12, background: 'var(--ifm-background-surface-color)'}}>
      <div style={{display: 'flex', flexWrap: 'wrap', rowGap: 10, alignItems: 'flex-start', fontFamily: 'var(--ifm-font-family-monospace)', fontSize: '0.86rem'}}>
        {parts.map(([text, label, tone], i) => {
          const c = TONE_HEX[tone ?? 'src'];
          return (
            <span key={i} style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'center'}}>
              <span style={{padding: '0.15rem 0.1rem', whiteSpace: 'pre', overflowWrap: 'anywhere', color: label ? c : 'inherit', fontWeight: label ? 700 : 400, borderBottom: label ? `3px solid ${c}` : '3px solid transparent'}}>{text}</span>
              {label && <span style={{marginTop: 4, fontFamily: 'var(--ifm-font-family-base)', fontSize: '0.72rem', fontWeight: 600, color: c, whiteSpace: 'nowrap'}}>{label}</span>}
            </span>
          );
        })}
      </div>
    </div>
  );
}
