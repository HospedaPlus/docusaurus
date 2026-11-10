// Texts of the Airflow architecture diagram, one entry per site language.

const en = {
  title: "Airflow architecture",
  subtitle:
    "Two EC2 with Docker Compose: core (Airflow 3.1.5, metadata, RabbitMQ, Flower) and Celery workers with local Spark · 17 DAGs chained by Assets · data lake in S3 (Parquet) · catalog via Athena DDL",
  col1: "Sources",
  col2: "Airflow on two EC2",
  col3: "Amazon S3 · data lake",
  col4: "Consumption",
  f1: "F1 · Kaggle (history)",
  f1Caption: "hotel_bookings.csv from the hospedaplus-csv repo · manual, once",
  f2: "F2 · Channel Manager",
  f2Caption:
    "Kafka → consumer → Neon (streaming) · Airflow copies it from Neon every hour",
  f3: "F3 · PostgreSQL (Neon)",
  f3Caption:
    "operation schema · etl_reader role (production) · every hour + full load 03:00",
  f4: "F4 · Agencies",
  f4Caption:
    "f4-weekly (sources EC2) leaves it in bronze/f4_agencias on Monday 06:00; the DAG checks it at 07:00",
  f5: "F5 · Reviews · REST API",
  f5Caption: "team api-reviews (FastAPI) · incremental every hour",
  f6: "F6 · Holidays and events",
  f6Caption:
    "Nager.Date (day 1 of each month) · local events from Neon (daily)",
  f7: "F7 · Exchange rates",
  f7Caption: "Frankfurter (REST) · daily 01:00 UTC",
  core: "Core EC2 · docker-compose.nucleo.yaml",
  coreCaption: "t3.medium · 30 GB · sg-nucleo",
  airflowCaption: "API Server · Scheduler · DAG Processor · Triggerer",
  postgresCaption: "Airflow metadata",
  rabbitCaption: "bronze · silver · gold queues",
  flowerCaption: "worker status · :5555",
  dagsTitle: "DAGs · dags/ folder (same repo on both EC2; schedules in UTC)",
  bronzeDagsTitle: "BRONZE · 9 DAGs · bronze queue",
  bronzeDags:
    "f1 manual · f4 Mon 07:00 · f5 hourly · f6 holidays day 1 · f6 events 02:30 · f7 fx 01:00 · neon_f2_f3 hourly · neon_dims 03:15 · neon_full_load 03:00",
  silverDagsTitle: "SILVER · 6 DAGs · silver queue · by Assets",
  silverDags:
    "fx · bookings · occupancy · calendar · reviews (03:30) · F1 history",
  goldDagsTitle: "GOLD · 2 DAGs · gold queue · by Assets",
  goldDags:
    "gold_modelo_daily (4 dim_, 4 fact_, 7 mart_) → gold_neon_writeback",
  dagsNote:
    "Each DAG publishes an Asset when it finishes and the next one starts by itself; catchup=False.",
  workers: "Workers EC2 · docker-compose.workers.yaml",
  workersCaption: "t3.xlarge · 50 GB · sg-workers",
  workerBronze: "Celery worker · bronze",
  workerBronzeCaption: "-q bronze · 4 tasks at a time",
  workerSilver: "Celery worker · silver",
  workerSilverCaption: "-q silver · 2 tasks at a time",
  workerGold: "Celery worker · gold",
  workerGoldCaption: "-q gold · 2 tasks at a time",
  jobBronze: "BRONZE JOB · Python",
  jobBronzeCaption: "requests and psycopg (etl_reader) → JSON/CSV in bronze/",
  jobSilver: "SILVER JOB · local Spark",
  jobSilverCaption:
    "validates (quality.py), deduplicates (RN-08), converts to COP",
  jobGold: "GOLD JOB · local Spark",
  jobGoldCaption: "dim_ / fact_ / mart_ P1–P5 · JSON for Neon",
  sparkNote:
    "Local Spark: Spark 3.5 runs inside the worker container (local[*]) with s3a:// and the EC2 IAM role. No cluster or Fargate; the t3.xlarge (4 vCPU, 16 GB) is enough.",
  catalogCaption:
    "hospedaplus_gold · tables created with Athena DDL (no crawler)",
  logsCaption: "logs of every task (remote logging)",
  bronzeCaption: "raw by source and date · F2 ledger",
  silverCaption: "Parquet · clean and without duplicates",
  goldCaption: "Parquet · dim_ / fact_ / mart_ · neon_*.json",
  neonCaption: "receives cancellation_rate_by_lead (upsert)",
  powerbiCaption: "ODBC · powerbi-reader",
  athenaCaption: "reads only gold/",
  legendTitle: "Legend",
  legend: {
    cicd: "Airflow order / task status",
    batch: "Data (source → worker → S3, and between layers)",
    meta: "Athena DDL → Glue Data Catalog",
    rates: "Gold write-back to Neon",
    gold: "Consumption of gold/",
  },
  edge: {
    bronzeGoes: "the bronze worker goes to each source",
    orders: "orders by queue (RabbitMQ)",
    writesBronze: "writes JSON/CSV",
    readsBronze: "reads bronze/, writes silver/",
    readsSilver: "reads silver/, writes gold/",
    status: "reports status to the API Server (private IP)",
  },
};

export type AirflowStrings = typeof en;

const es: AirflowStrings = {
  title: "Arquitectura de Airflow",
  subtitle:
    "Dos EC2 con Docker Compose: núcleo (Airflow 3.1.5, metadatos, RabbitMQ, Flower) y workers de Celery con Spark local · 17 DAGs encadenados por Assets · data lake en S3 (Parquet) · catálogo por Athena DDL",
  col1: "Fuentes",
  col2: "Airflow en dos EC2",
  col3: "Amazon S3 · data lake",
  col4: "Consumo",
  f1: "F1 · Kaggle (histórico)",
  f1Caption: "hotel_bookings.csv del repo hospedaplus-csv · manual, 1 vez",
  f2: "F2 · Channel Manager",
  f2Caption:
    "Kafka → consumidor → Neon (streaming) · Airflow lo copia de Neon cada hora",
  f3: "F3 · PostgreSQL (Neon)",
  f3Caption:
    "esquema operation · rol etl_reader (production) · cada hora + carga completa 03:00",
  f4: "F4 · Agencias",
  f4Caption:
    "f4-weekly (EC2 fuentes) lo deja en bronze/f4_agencias el lunes 06:00; el DAG verifica a las 07:00",
  f5: "F5 · Reseñas · REST API",
  f5Caption: "api-reviews del equipo (FastAPI) · incremental cada hora",
  f6: "F6 · Festivos y eventos",
  f6Caption:
    "Nager.Date (día 1 de cada mes) · eventos locales desde Neon (diario)",
  f7: "F7 · Tasas de cambio",
  f7Caption: "Frankfurter (REST) · diario 01:00 UTC",
  core: "EC2 núcleo · docker-compose.nucleo.yaml",
  coreCaption: "t3.medium · 30 GB · sg-nucleo",
  airflowCaption: "API Server · Scheduler · DAG Processor · Triggerer",
  postgresCaption: "metadatos de Airflow",
  rabbitCaption: "colas bronze · silver · gold",
  flowerCaption: "estado de los workers · :5555",
  dagsTitle:
    "DAGs · carpeta dags/ (mismo repo en los dos EC2; horarios en UTC)",
  bronzeDagsTitle: "BRONZE · 9 DAGs · cola bronze",
  bronzeDags:
    "f1 manual · f4 lun 07:00 · f5 cada hora · f6 festivos día 1 · f6 eventos 02:30 · f7 fx 01:00 · neon_f2_f3 cada hora · neon_dims 03:15 · neon_full_load 03:00",
  silverDagsTitle: "SILVER · 6 DAGs · cola silver · por Assets",
  silverDags:
    "fx · reservas · ocupación · calendario · reseñas (03:30) · histórico F1",
  goldDagsTitle: "GOLD · 2 DAGs · cola gold · por Assets",
  goldDags:
    "gold_modelo_daily (4 dim_, 4 fact_, 7 mart_) → gold_neon_writeback",
  dagsNote:
    "Cada DAG publica un Asset al terminar y el siguiente arranca solo; catchup=False.",
  workers: "EC2 workers · docker-compose.workers.yaml",
  workersCaption: "t3.xlarge · 50 GB · sg-workers",
  workerBronze: "Celery worker · bronze",
  workerBronzeCaption: "-q bronze · 4 tareas a la vez",
  workerSilver: "Celery worker · silver",
  workerSilverCaption: "-q silver · 2 tareas a la vez",
  workerGold: "Celery worker · gold",
  workerGoldCaption: "-q gold · 2 tareas a la vez",
  jobBronze: "JOB BRONZE · Python",
  jobBronzeCaption: "requests y psycopg (etl_reader) → JSON/CSV en bronze/",
  jobSilver: "JOB SILVER · Spark local",
  jobSilverCaption: "valida (quality.py), deduplica (RN-08), pasa a COP",
  jobGold: "JOB GOLD · Spark local",
  jobGoldCaption: "dim_ / fact_ / mart_ P1–P5 · JSON para Neon",
  sparkNote:
    "Spark local: Spark 3.5 corre dentro del contenedor del worker (local[*]) con s3a:// y el rol IAM del EC2. Sin clúster ni Fargate; el t3.xlarge (4 vCPU, 16 GB) basta.",
  catalogCaption:
    "hospedaplus_gold · tablas creadas con Athena DDL (sin crawler)",
  logsCaption: "logs de cada tarea (remote logging)",
  bronzeCaption: "crudo por fuente y fecha · ledger F2",
  silverCaption: "Parquet · limpio y sin duplicados",
  goldCaption: "Parquet · dim_ / fact_ / mart_ · neon_*.json",
  neonCaption: "recibe cancellation_rate_by_lead (upsert)",
  powerbiCaption: "ODBC · powerbi-reader",
  athenaCaption: "solo lee gold/",
  legendTitle: "Leyenda",
  legend: {
    cicd: "Orden de Airflow / estado de la tarea",
    batch: "Datos (fuente → worker → S3, y entre capas)",
    meta: "Athena DDL → Glue Data Catalog",
    rates: "Writeback de gold a Neon",
    gold: "Consumo de gold/",
  },
  edge: {
    bronzeGoes: "el worker bronze va a cada fuente",
    orders: "órdenes por cola (RabbitMQ)",
    writesBronze: "escribe JSON/CSV",
    readsBronze: "lee bronze/, escribe silver/",
    readsSilver: "lee silver/, escribe gold/",
    status: "reporta el estado al API Server (IP privada)",
  },
};

const pt: AirflowStrings = {
  title: "Arquitetura do Airflow",
  subtitle:
    "Dois EC2 com Docker Compose: núcleo (Airflow 3.1.5, metadados, RabbitMQ, Flower) e workers do Celery com Spark local · 17 DAGs encadeados por Assets · data lake no S3 (Parquet) · catálogo via Athena DDL",
  col1: "Fontes",
  col2: "Airflow em dois EC2",
  col3: "Amazon S3 · data lake",
  col4: "Consumo",
  f1: "F1 · Kaggle (histórico)",
  f1Caption: "hotel_bookings.csv do repo hospedaplus-csv · manual, 1 vez",
  f2: "F2 · Channel Manager",
  f2Caption:
    "Kafka → consumidor → Neon (streaming) · o Airflow copia do Neon a cada hora",
  f3: "F3 · PostgreSQL (Neon)",
  f3Caption:
    "esquema operation · papel etl_reader (production) · a cada hora + carga completa 03:00",
  f4: "F4 · Agências",
  f4Caption:
    "f4-weekly (EC2 de fontes) deixa em bronze/f4_agencias na segunda 06:00; o DAG verifica às 07:00",
  f5: "F5 · Avaliações · REST API",
  f5Caption: "api-reviews da equipe (FastAPI) · incremental a cada hora",
  f6: "F6 · Feriados e eventos",
  f6Caption: "Nager.Date (dia 1 de cada mês) · eventos locais do Neon (diário)",
  f7: "F7 · Taxas de câmbio",
  f7Caption: "Frankfurter (REST) · diário 01:00 UTC",
  core: "EC2 núcleo · docker-compose.nucleo.yaml",
  coreCaption: "t3.medium · 30 GB · sg-nucleo",
  airflowCaption: "API Server · Scheduler · DAG Processor · Triggerer",
  postgresCaption: "metadados do Airflow",
  rabbitCaption: "filas bronze · silver · gold",
  flowerCaption: "estado dos workers · :5555",
  dagsTitle: "DAGs · pasta dags/ (mesmo repo nos dois EC2; horários em UTC)",
  bronzeDagsTitle: "BRONZE · 9 DAGs · fila bronze",
  bronzeDags:
    "f1 manual · f4 seg 07:00 · f5 a cada hora · f6 feriados dia 1 · f6 eventos 02:30 · f7 fx 01:00 · neon_f2_f3 a cada hora · neon_dims 03:15 · neon_full_load 03:00",
  silverDagsTitle: "SILVER · 6 DAGs · fila silver · por Assets",
  silverDags:
    "fx · reservas · ocupação · calendário · avaliações (03:30) · histórico F1",
  goldDagsTitle: "GOLD · 2 DAGs · fila gold · por Assets",
  goldDags:
    "gold_modelo_daily (4 dim_, 4 fact_, 7 mart_) → gold_neon_writeback",
  dagsNote:
    "Cada DAG publica um Asset ao terminar e o próximo começa sozinho; catchup=False.",
  workers: "EC2 workers · docker-compose.workers.yaml",
  workersCaption: "t3.xlarge · 50 GB · sg-workers",
  workerBronze: "Celery worker · bronze",
  workerBronzeCaption: "-q bronze · 4 tarefas por vez",
  workerSilver: "Celery worker · silver",
  workerSilverCaption: "-q silver · 2 tarefas por vez",
  workerGold: "Celery worker · gold",
  workerGoldCaption: "-q gold · 2 tarefas por vez",
  jobBronze: "JOB BRONZE · Python",
  jobBronzeCaption: "requests e psycopg (etl_reader) → JSON/CSV em bronze/",
  jobSilver: "JOB SILVER · Spark local",
  jobSilverCaption: "valida (quality.py), deduplica (RN-08), converte para COP",
  jobGold: "JOB GOLD · Spark local",
  jobGoldCaption: "dim_ / fact_ / mart_ P1–P5 · JSON para o Neon",
  sparkNote:
    "Spark local: o Spark 3.5 roda dentro do contêiner do worker (local[*]) com s3a:// e o papel IAM do EC2. Sem cluster nem Fargate; o t3.xlarge (4 vCPU, 16 GB) basta.",
  catalogCaption:
    "hospedaplus_gold · tabelas criadas com Athena DDL (sem crawler)",
  logsCaption: "logs de cada tarefa (remote logging)",
  bronzeCaption: "bruto por fonte e data · ledger F2",
  silverCaption: "Parquet · limpo e sem duplicados",
  goldCaption: "Parquet · dim_ / fact_ / mart_ · neon_*.json",
  neonCaption: "recebe cancellation_rate_by_lead (upsert)",
  powerbiCaption: "ODBC · powerbi-reader",
  athenaCaption: "lê só gold/",
  legendTitle: "Legenda",
  legend: {
    cicd: "Ordem do Airflow / estado da tarefa",
    batch: "Dados (fonte → worker → S3, e entre camadas)",
    meta: "Athena DDL → Glue Data Catalog",
    rates: "Write-back do gold para o Neon",
    gold: "Consumo do gold/",
  },
  edge: {
    bronzeGoes: "o worker bronze vai a cada fonte",
    orders: "ordens por fila (RabbitMQ)",
    writesBronze: "grava JSON/CSV",
    readsBronze: "lê bronze/, grava silver/",
    readsSilver: "lê silver/, grava gold/",
    status: "reporta o estado ao API Server (IP privado)",
  },
};

const fr: AirflowStrings = {
  title: "Architecture d'Airflow",
  subtitle:
    "Deux EC2 avec Docker Compose : cœur (Airflow 3.1.5, métadonnées, RabbitMQ, Flower) et workers Celery avec Spark local · 17 DAG enchaînés par Assets · data lake dans S3 (Parquet) · catalogue par Athena DDL",
  col1: "Sources",
  col2: "Airflow sur deux EC2",
  col3: "Amazon S3 · data lake",
  col4: "Consommation",
  f1: "F1 · Kaggle (historique)",
  f1Caption: "hotel_bookings.csv du dépôt hospedaplus-csv · manuel, 1 fois",
  f2: "F2 · Channel Manager",
  f2Caption:
    "Kafka → consommateur → Neon (streaming) · Airflow le copie depuis Neon toutes les heures",
  f3: "F3 · PostgreSQL (Neon)",
  f3Caption:
    "schéma operation · rôle etl_reader (production) · toutes les heures + chargement complet 03:00",
  f4: "F4 · Agences",
  f4Caption:
    "f4-weekly (EC2 sources) le dépose dans bronze/f4_agencias le lundi 06:00 ; le DAG vérifie à 07:00",
  f5: "F5 · Avis · API REST",
  f5Caption:
    "api-reviews de l'équipe (FastAPI) · incrémental toutes les heures",
  f6: "F6 · Jours fériés et événements",
  f6Caption:
    "Nager.Date (1er de chaque mois) · événements locaux depuis Neon (quotidien)",
  f7: "F7 · Taux de change",
  f7Caption: "Frankfurter (REST) · quotidien 01:00 UTC",
  core: "EC2 cœur · docker-compose.nucleo.yaml",
  coreCaption: "t3.medium · 30 Go · sg-nucleo",
  airflowCaption: "API Server · Scheduler · DAG Processor · Triggerer",
  postgresCaption: "métadonnées d'Airflow",
  rabbitCaption: "files bronze · silver · gold",
  flowerCaption: "état des workers · :5555",
  dagsTitle:
    "DAG · dossier dags/ (même dépôt sur les deux EC2 ; horaires en UTC)",
  bronzeDagsTitle: "BRONZE · 9 DAG · file bronze",
  bronzeDags:
    "f1 manuel · f4 lun 07:00 · f5 toutes les heures · f6 fériés le 1er · f6 événements 02:30 · f7 fx 01:00 · neon_f2_f3 toutes les heures · neon_dims 03:15 · neon_full_load 03:00",
  silverDagsTitle: "SILVER · 6 DAG · file silver · par Assets",
  silverDags:
    "fx · réservations · occupation · calendrier · avis (03:30) · historique F1",
  goldDagsTitle: "GOLD · 2 DAG · file gold · par Assets",
  goldDags:
    "gold_modelo_daily (4 dim_, 4 fact_, 7 mart_) → gold_neon_writeback",
  dagsNote:
    "Chaque DAG publie un Asset à la fin et le suivant démarre tout seul ; catchup=False.",
  workers: "EC2 workers · docker-compose.workers.yaml",
  workersCaption: "t3.xlarge · 50 Go · sg-workers",
  workerBronze: "Celery worker · bronze",
  workerBronzeCaption: "-q bronze · 4 tâches à la fois",
  workerSilver: "Celery worker · silver",
  workerSilverCaption: "-q silver · 2 tâches à la fois",
  workerGold: "Celery worker · gold",
  workerGoldCaption: "-q gold · 2 tâches à la fois",
  jobBronze: "JOB BRONZE · Python",
  jobBronzeCaption: "requests et psycopg (etl_reader) → JSON/CSV dans bronze/",
  jobSilver: "JOB SILVER · Spark local",
  jobSilverCaption: "valide (quality.py), déduplique (RN-08), convertit en COP",
  jobGold: "JOB GOLD · Spark local",
  jobGoldCaption: "dim_ / fact_ / mart_ P1–P5 · JSON pour Neon",
  sparkNote:
    "Spark local : Spark 3.5 tourne dans le conteneur du worker (local[*]) avec s3a:// et le rôle IAM de l'EC2. Ni cluster ni Fargate ; le t3.xlarge (4 vCPU, 16 Go) suffit.",
  catalogCaption:
    "hospedaplus_gold · tables créées avec Athena DDL (sans crawler)",
  logsCaption: "logs de chaque tâche (remote logging)",
  bronzeCaption: "brut par source et date · ledger F2",
  silverCaption: "Parquet · propre et sans doublons",
  goldCaption: "Parquet · dim_ / fact_ / mart_ · neon_*.json",
  neonCaption: "reçoit cancellation_rate_by_lead (upsert)",
  powerbiCaption: "ODBC · powerbi-reader",
  athenaCaption: "lit seulement gold/",
  legendTitle: "Légende",
  legend: {
    cicd: "Ordre d'Airflow / état de la tâche",
    batch: "Données (source → worker → S3, et entre couches)",
    meta: "Athena DDL → Glue Data Catalog",
    rates: "Write-back du gold vers Neon",
    gold: "Consommation de gold/",
  },
  edge: {
    bronzeGoes: "le worker bronze va vers chaque source",
    orders: "ordres par file (RabbitMQ)",
    writesBronze: "écrit JSON/CSV",
    readsBronze: "lit bronze/, écrit silver/",
    readsSilver: "lit silver/, écrit gold/",
    status: "rapporte l'état à l'API Server (IP privée)",
  },
};

const de: AirflowStrings = {
  title: "Airflow-Architektur",
  subtitle:
    "Zwei EC2 mit Docker Compose: Kern (Airflow 3.1.5, Metadaten, RabbitMQ, Flower) und Celery-Worker mit lokalem Spark · 17 über Assets verkettete DAGs · Data Lake in S3 (Parquet) · Katalog per Athena DDL",
  col1: "Quellen",
  col2: "Airflow auf zwei EC2",
  col3: "Amazon S3 · Data Lake",
  col4: "Nutzung",
  f1: "F1 · Kaggle (Historie)",
  f1Caption:
    "hotel_bookings.csv aus dem Repo hospedaplus-csv · manuell, einmal",
  f2: "F2 · Channel Manager",
  f2Caption:
    "Kafka → Consumer → Neon (streaming) · Airflow kopiert es stündlich aus Neon",
  f3: "F3 · PostgreSQL (Neon)",
  f3Caption:
    "Schema operation · Rolle etl_reader (production) · stündlich + Volllast 03:00",
  f4: "F4 · Agenturen",
  f4Caption:
    "f4-weekly (Quellen-EC2) legt es montags 06:00 in bronze/f4_agencias ab; der DAG prüft um 07:00",
  f5: "F5 · Bewertungen · REST-API",
  f5Caption: "api-reviews des Teams (FastAPI) · stündlich inkrementell",
  f6: "F6 · Feiertage und Events",
  f6Caption: "Nager.Date (1. jedes Monats) · lokale Events aus Neon (täglich)",
  f7: "F7 · Wechselkurse",
  f7Caption: "Frankfurter (REST) · täglich 01:00 UTC",
  core: "Kern-EC2 · docker-compose.nucleo.yaml",
  coreCaption: "t3.medium · 30 GB · sg-nucleo",
  airflowCaption: "API Server · Scheduler · DAG Processor · Triggerer",
  postgresCaption: "Airflow-Metadaten",
  rabbitCaption: "Queues bronze · silver · gold",
  flowerCaption: "Worker-Status · :5555",
  dagsTitle:
    "DAGs · Ordner dags/ (gleiches Repo auf beiden EC2; Zeiten in UTC)",
  bronzeDagsTitle: "BRONZE · 9 DAGs · Queue bronze",
  bronzeDags:
    "f1 manuell · f4 Mo 07:00 · f5 stündlich · f6 Feiertage am 1. · f6 Events 02:30 · f7 fx 01:00 · neon_f2_f3 stündlich · neon_dims 03:15 · neon_full_load 03:00",
  silverDagsTitle: "SILVER · 6 DAGs · Queue silver · per Assets",
  silverDags:
    "fx · Buchungen · Belegung · Kalender · Bewertungen (03:30) · F1-Historie",
  goldDagsTitle: "GOLD · 2 DAGs · Queue gold · per Assets",
  goldDags:
    "gold_modelo_daily (4 dim_, 4 fact_, 7 mart_) → gold_neon_writeback",
  dagsNote:
    "Jeder DAG veröffentlicht am Ende ein Asset und der nächste startet von selbst; catchup=False.",
  workers: "Worker-EC2 · docker-compose.workers.yaml",
  workersCaption: "t3.xlarge · 50 GB · sg-workers",
  workerBronze: "Celery-Worker · bronze",
  workerBronzeCaption: "-q bronze · 4 Tasks gleichzeitig",
  workerSilver: "Celery-Worker · silver",
  workerSilverCaption: "-q silver · 2 Tasks gleichzeitig",
  workerGold: "Celery-Worker · gold",
  workerGoldCaption: "-q gold · 2 Tasks gleichzeitig",
  jobBronze: "BRONZE-JOB · Python",
  jobBronzeCaption: "requests und psycopg (etl_reader) → JSON/CSV in bronze/",
  jobSilver: "SILVER-JOB · lokales Spark",
  jobSilverCaption:
    "validiert (quality.py), dedupliziert (RN-08), rechnet in COP um",
  jobGold: "GOLD-JOB · lokales Spark",
  jobGoldCaption: "dim_ / fact_ / mart_ P1–P5 · JSON für Neon",
  sparkNote:
    "Lokales Spark: Spark 3.5 läuft im Container des Workers (local[*]) mit s3a:// und der IAM-Rolle der EC2. Kein Cluster, kein Fargate; die t3.xlarge (4 vCPU, 16 GB) reicht.",
  catalogCaption:
    "hospedaplus_gold · mit Athena DDL angelegte Tabellen (ohne Crawler)",
  logsCaption: "Logs jeder Task (Remote Logging)",
  bronzeCaption: "roh nach Quelle und Datum · F2-Ledger",
  silverCaption: "Parquet · sauber und ohne Duplikate",
  goldCaption: "Parquet · dim_ / fact_ / mart_ · neon_*.json",
  neonCaption: "erhält cancellation_rate_by_lead (Upsert)",
  powerbiCaption: "ODBC · powerbi-reader",
  athenaCaption: "liest nur gold/",
  legendTitle: "Legende",
  legend: {
    cicd: "Airflow-Auftrag / Task-Status",
    batch: "Daten (Quelle → Worker → S3 und zwischen Schichten)",
    meta: "Athena DDL → Glue Data Catalog",
    rates: "Write-back von Gold nach Neon",
    gold: "Nutzung von gold/",
  },
  edge: {
    bronzeGoes: "der Bronze-Worker geht zu jeder Quelle",
    orders: "Aufträge per Queue (RabbitMQ)",
    writesBronze: "schreibt JSON/CSV",
    readsBronze: "liest bronze/, schreibt silver/",
    readsSilver: "liest silver/, schreibt gold/",
    status: "meldet den Status an den API Server (private IP)",
  },
};

export const airflowStrings: Record<string, AirflowStrings> = {
  en,
  es,
  pt,
  fr,
  de,
};
