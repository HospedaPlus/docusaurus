import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type Labels = {
  sources: string; oltp: string; extract: string; transform: string; load: string; olap: string;
  bronze: string; silver: string; gold: string; consume: string; orchestration: string; writeback: string;
  bronzeSub: string; silverSub: string; goldSub: string; lakehouse: string;
};

const L: Record<string, Labels> = {
  en: {sources: 'Sources', oltp: 'OLTP · Neon', extract: 'E · Extract', transform: 'T · Transform', load: 'L · Load', olap: 'OLAP',
    bronze: 'Bronze', silver: 'Silver', gold: 'Gold', consume: 'Analysis', orchestration: 'Airflow 3 orchestrates every step (core EC2) · Celery workers bronze / silver / gold (workers EC2)',
    writeback: 'write-back: cancellation rates', bronzeSub: 'raw copy · JSON / CSV', silverSub: 'clean · Parquet · COP', goldSub: 'star + marts P1–P5', lakehouse: 'S3 lakehouse'},
  es: {sources: 'Fuentes', oltp: 'OLTP · Neon', extract: 'E · Extracción', transform: 'T · Transformación', load: 'L · Carga', olap: 'OLAP',
    bronze: 'Bronze', silver: 'Silver', gold: 'Gold', consume: 'Análisis', orchestration: 'Airflow 3 orquesta cada paso (EC2 núcleo) · workers Celery bronze / silver / gold (EC2 workers)',
    writeback: 'write-back: tasas de cancelación', bronzeSub: 'copia cruda · JSON / CSV', silverSub: 'limpio · Parquet · COP', goldSub: 'estrella + marts P1–P5', lakehouse: 'lakehouse en S3'},
  pt: {sources: 'Fontes', oltp: 'OLTP · Neon', extract: 'E · Extração', transform: 'T · Transformação', load: 'L · Carga', olap: 'OLAP',
    bronze: 'Bronze', silver: 'Silver', gold: 'Gold', consume: 'Análise', orchestration: 'O Airflow 3 orquestra cada passo (EC2 núcleo) · workers Celery bronze / silver / gold (EC2 workers)',
    writeback: 'write-back: taxas de cancelamento', bronzeSub: 'cópia bruta · JSON / CSV', silverSub: 'limpo · Parquet · COP', goldSub: 'estrela + marts P1–P5', lakehouse: 'lakehouse no S3'},
  fr: {sources: 'Sources', oltp: 'OLTP · Neon', extract: 'E · Extraction', transform: 'T · Transformation', load: 'L · Chargement', olap: 'OLAP',
    bronze: 'Bronze', silver: 'Silver', gold: 'Gold', consume: 'Analyse', orchestration: 'Airflow 3 orchestre chaque étape (EC2 cœur) · workers Celery bronze / silver / gold (EC2 workers)',
    writeback: 'write-back : taux d\'annulation', bronzeSub: 'copie brute · JSON / CSV', silverSub: 'propre · Parquet · COP', goldSub: 'étoile + marts P1–P5', lakehouse: 'lakehouse S3'},
  de: {sources: 'Quellen', oltp: 'OLTP · Neon', extract: 'E · Extract', transform: 'T · Transform', load: 'L · Load', olap: 'OLAP',
    bronze: 'Bronze', silver: 'Silver', gold: 'Gold', consume: 'Analyse', orchestration: 'Airflow 3 orchestriert jeden Schritt (Kern-EC2) · Celery-Worker bronze / silver / gold (Worker-EC2)',
    writeback: 'Write-back: Stornoquoten', bronzeSub: 'Rohkopie · JSON / CSV', silverSub: 'bereinigt · Parquet · COP', goldSub: 'Stern + Marts P1–P5', lakehouse: 'S3-Lakehouse'},
};

const C = {src: '#6b7280', oltp: '#0f766e', bronze: '#b45309', silver: '#64748b', gold: '#ca8a04', out: '#5b45e0'};

function Box({x, y, w, h, color, title, lines}: {x: number; y: number; w: number; h: number; color: string; title: string; lines: string[]}): ReactNode {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="var(--ifm-background-surface-color, #fff)" stroke={color} strokeWidth={2} />
      <rect x={x} y={y} width={w} height={26} rx={10} fill={color} />
      <rect x={x} y={y + 16} width={w} height={10} fill={color} />
      <text x={x + w / 2} y={y + 18} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">{title}</text>
      {lines.map((t, i) => (
        <text key={i} x={x + 10} y={y + 44 + i * 17} fontSize={11.5} fill="currentColor">{t}</text>
      ))}
    </g>
  );
}

function Arrow({x1, y1, x2, y2, dashed}: {x1: number; y1: number; x2: number; y2: number; dashed?: boolean}): ReactNode {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeOpacity={0.55} strokeWidth={2} markerEnd="url(#pf-arrow)" strokeDasharray={dashed ? '6 4' : undefined} />;
}

export default function PipelineFlow(): ReactNode {
  const {i18n} = useDocusaurusContext();
  const t = L[i18n.currentLocale] ?? L.en;
  return (
    <div style={{overflowX: 'auto', margin: '1.5rem 0'}}>
      <svg viewBox="0 0 1180 470" style={{minWidth: 720, width: '100%', fontFamily: 'var(--ifm-font-family-base)'}} role="img" aria-label="HospedaPlus data pipeline">
        <defs>
          <marker id="pf-arrow" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
            <path d="M0 0 10 5 0 10z" fill="currentColor" fillOpacity={0.6} />
          </marker>
        </defs>

        {/* stage bands */}
        {[
          {x: 10, w: 330, label: t.sources + ' / ' + t.oltp, c: C.oltp},
          {x: 360, w: 180, label: t.extract, c: C.bronze},
          {x: 560, w: 380, label: t.transform + '  ·  ' + t.load, c: C.silver},
          {x: 960, w: 210, label: t.olap, c: C.out},
        ].map((b) => (
          <g key={b.label}>
            <rect x={b.x} y={8} width={b.w} height={26} rx={13} fill={b.c} fillOpacity={0.12} />
            <text x={b.x + b.w / 2} y={26} textAnchor="middle" fontSize={13} fontWeight={700} fill={b.c}>{b.label}</text>
          </g>
        ))}
        <rect x={355} y={46} width={590} height={330} rx={14} fill="none" stroke={C.bronze} strokeOpacity={0.35} strokeDasharray="5 5" />
        <text x={650} y={368} textAnchor="middle" fontSize={12} fontWeight={600} fill="currentColor" fillOpacity={0.6}>{t.lakehouse} · s3://hospedaplus-lakehouse-buenavista</text>

        <Box x={10} y={56} w={150} h={112} color={C.src} title={t.sources} lines={['F2 OTA (Kafka)', 'F3 booking engine', 'F4 agencies', 'F6 local events']} />
        <Box x={190} y={66} w={150} h={92} color={C.oltp} title={t.oltp} lines={['operation', 'streaming', 'reservar()']} />
        <Box x={10} y={196} w={150} h={112} color={C.src} title="APIs / files" lines={['F1 Kaggle CSV', 'F5 reviews API', 'F6 Nager API', 'F7 Frankfurter']} />

        <Box x={375} y={66} w={160} h={262} color={C.bronze} title={t.bronze} lines={[t.bronzeSub, '', 'bronze_neon_f2_f3', 'bronze_neon_full_load', 'bronze_neon_dims', 'bronze_f5_reviews', 'bronze_f6_*', 'bronze_f7_fx', 'bronze_f4_agencias', 'bronze_f1_historical']} />
        <Box x={565} y={66} w={170} h={262} color={C.silver} title={t.silver} lines={[t.silverSub, '', 'reservas', 'cancelaciones', 'reservas_rechazadas', 'ocupacion_diaria', 'calendario_hotel', 'tasa_cambio_diaria', 'resenas', 'historico_f1']} />
        <Box x={765} y={66} w={170} h={262} color={C.gold} title={t.gold} lines={[t.goldSub, '', 'dim_fecha · dim_hotel', 'dim_canal', 'dim_tipo_habitacion', 'fact_reservas', 'fact_cancelaciones', 'fact_ocupacion_diaria', 'fact_resenas', 'mart_p1 … mart_p5']} />

        <Box x={975} y={86} w={190} h={70} color={C.out} title="Athena" lines={['Glue Data Catalog', 'hospedaplus_gold · silver']} />
        <Box x={975} y={200} w={190} h={70} color={C.out} title="Power BI" lines={[t.consume, 'P1 · P2 · P3 · P4 · P5']} />

        <Arrow x1={160} y1={112} x2={188} y2={112} />
        <Arrow x1={340} y1={112} x2={373} y2={112} />
        <Arrow x1={160} y1={252} x2={373} y2={252} />
        <Arrow x1={535} y1={197} x2={563} y2={197} />
        <Arrow x1={735} y1={197} x2={763} y2={197} />
        <Arrow x1={935} y1={121} x2={973} y2={121} />
        <Arrow x1={1070} y1={156} x2={1070} y2={198} />
        <path d="M850 328 V 410 H 265 V 160" fill="none" stroke={C.oltp} strokeWidth={2} strokeDasharray="6 4" markerEnd="url(#pf-arrow)" />
        <text x={560} y={404} textAnchor="middle" fontSize={12} fill={C.oltp} fontWeight={600}>gold_neon_writeback · {t.writeback}</text>

        <rect x={10} y={428} width={1160} height={32} rx={8} fill={C.out} fillOpacity={0.1} />
        <text x={590} y={449} textAnchor="middle" fontSize={12.5} fontWeight={600} fill={C.out}>{t.orchestration}</text>
      </svg>
    </div>
  );
}
