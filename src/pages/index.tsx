import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Translate, {translate} from '@docusaurus/Translate';
import Icon, {type IconName} from '@site/src/components/Icon';
import styles from './index.module.css';

type Section = {to: string; icon: IconName; title: string; text: string};

function getSections(): Section[] {
  return [
    {
      to: '/docs/what-is-hospedaplus',
      icon: 'building',
      title: translate({id: 'landing.section.what.title', message: 'What is HospedaPlus'}),
      text: translate({id: 'landing.section.what.text', message: 'The business context, the hotel chain and who uses the platform.'}),
    },
    {
      to: '/docs/the-pains',
      icon: 'alert',
      title: translate({id: 'landing.section.pains.title', message: 'The Pains'}),
      text: translate({id: 'landing.section.pains.text', message: 'The problems the platform has to solve.'}),
    },
    {
      to: '/docs/data-sources',
      icon: 'database',
      title: translate({id: 'landing.section.sources.title', message: 'Data Sources'}),
      text: translate({id: 'landing.section.sources.text', message: 'The seven sources, F1 to F7, and what each one brings.'}),
    },
    {
      to: '/docs/data-access',
      icon: 'lock',
      title: translate({id: 'landing.section.access.title', message: 'Data Access'}),
      text: translate({id: 'landing.section.access.text', message: 'Where each source lives and how to connect to it.'}),
    },
    {
      to: '/docs/architecture-infrastructure',
      icon: 'network',
      title: translate({id: 'landing.section.architecture.title', message: 'Architecture & Infrastructure'}),
      text: translate({id: 'landing.section.architecture.text', message: 'How data is ingested, stored and visualized on AWS.'}),
    },
  ];
}

function HotelScene(): ReactNode {
  return (
    <svg className={styles.scene} viewBox="20 20 540 400" aria-hidden="true">
      <defs>
        <linearGradient id="lp-tower" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a99bff" />
          <stop offset="1" stopColor="#7b68f0" />
        </linearGradient>
        <linearGradient id="lp-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6c58e8" />
          <stop offset="1" stopColor="#4a37c9" />
        </linearGradient>
        <linearGradient id="lp-wing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9c0ff" />
          <stop offset="1" stopColor="#a395f7" />
        </linearGradient>
      </defs>
      {/* backdrop */}
      <circle className={styles.sceneBlob} cx="285" cy="215" r="190" />
      <circle className={styles.sceneSun} cx="412" cy="98" r="27" />
      <g className={styles.sceneCloud}>
        <path d="M80 118h96c0-15-12-26-27-26-4-16-18-27-35-27-19 0-34 14-36 32-12 1-22 10-22 21Z" />
        <path d="M398 168h96c0-13-11-23-24-23-4-14-16-24-31-24-17 0-30 12-32 28-5 1-9 8-9 19Z" />
        <path d="M30 290h80c0-12-10-22-22-22-3-13-14-22-28-22-15 0-28 12-29 27-1 0-1 17-1 17Z" />
      </g>
      {/* side wing */}
      <rect x="128" y="180" width="38" height="160" fill="url(#lp-side)" />
      <rect x="166" y="180" width="68" height="160" fill="url(#lp-wing)" />
      <rect x="160" y="166" width="58" height="16" rx="3" fill="#7d68f5" />
      {[0, 1].map((r) => [0, 1].map((c) => <rect key={`w${r}${c}`} x={180 + c * 26} y={200 + r * 34} width="14" height="16" rx="2" fill="#fff" />))}
      <rect x="183" y="276" width="34" height="64" rx="3" fill="#fff" />
      <path d="M200 276v64M183 300h34" stroke="#a395f7" strokeWidth="2.5" />
      {/* main tower */}
      <rect x="230" y="96" width="44" height="244" fill="url(#lp-side)" />
      <rect x="270" y="96" width="140" height="244" fill="url(#lp-tower)" />
      <rect x="262" y="84" width="152" height="14" rx="3" fill="#2d2585" />
      <rect x="300" y="64" width="72" height="22" rx="3" fill="#7d68f5" />
      {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <rect key={`t${r}${c}`} x={286 + c * 30} y={118 + r * 40} width="18" height="22" rx="2.5" fill="#fff" opacity={c === 3 ? 0.75 : 1} />))}
      <rect x="312" y="232" width="58" height="42" rx="6" fill="#3b2fb8" />
      <path d="M341 242 328 253v12h26v-12Z" fill="#fff" />
      <rect x="336" y="257" width="10" height="8" fill="#3b2fb8" />
      <rect x="306" y="290" width="70" height="50" rx="3" fill="#fff" />
      <path d="M341 296v44M318 304h12M352 304h12" stroke="#a395f7" strokeWidth="2.5" />
      {/* palms */}
      <path d="M440 340c0-50 4-90 14-122" stroke="#a5672f" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M454 218c-22-14-46-10-58 4 18-4 38-1 58-4Z M454 218c14-20 42-24 56-12-18 0-38 4-56 12Z M454 218c-6-24-28-34-46-28 16 6 34 14 46 28Z M454 218c8-22 30-30 46-24-16 6-34 12-46 24Z M454 218c4 14 16 28 30 34-8-14-18-26-30-34Z" fill="#2fb59a" />
      <path d="M488 340c2-34 8-60 20-80" stroke="#a5672f" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M508 260c-16-10-34-6-42 4 14-3 28 0 42-4Z M508 260c10-14 30-16 40-8-14 0-28 3-40 8Z M508 260c-4-16-18-24-32-20 12 4 24 10 32 20Z" fill="#3cc7a8" />
      {/* bushes and ground */}
      <path d="M108 340c0-14 12-22 22-18 6-10 22-10 28 0 10-2 18 8 16 18Z" fill="#35b996" />
      <path d="M420 340c0-14 12-22 24-18 8-12 26-10 32 2 12-2 20 8 18 16Z" fill="#35b996" />
      <path className={styles.sceneGround} d="M60 341h400M470 341h24M500 341h10" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ChartBadge(): ReactNode {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="14" width="4" height="7" rx="1" fill="#7b68f0" />
      <rect x="10" y="9" width="4" height="12" rx="1" fill="#5b45e0" />
      <rect x="17" y="4" width="4" height="17" rx="1" fill="#3f5ce8" />
      <path d="M3 11 9 6l4 3 7-6" stroke="#5b45e0" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Landing(): ReactNode {
  return (
    <Layout
      title={translate({id: 'landing.meta.title', message: 'Welcome'})}
      description={translate({
        id: 'landing.meta.description',
        message: 'Your complete guide to understanding, exploring and using the HospedaPlus data platform.',
      })}>
      <main className={styles.landing}>
        <div className={styles.waves} aria-hidden="true">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path className={styles.waveBack} d="M0 140C120 90 200 150 230 320H0Z" />
            <path className={styles.waveBack} d="M720 320C820 210 1000 150 1180 170c120 14 200-40 260-110V320Z" />
            <path className={styles.waveLine} d="M880 120c120-10 200 40 320 30 100-8 170-60 240-90" />
          </svg>
        </div>
        <section className={styles.hero}>
          <div className={styles.copy}>
            <span className={styles.badge}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2ZM22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8Z" />
              </svg>
              <Translate id="landing.badge">Documentation</Translate>
            </span>
            <h1 className={styles.title}>
              <Translate id="landing.title.welcome">Welcome to</Translate>
              <span className={styles.brand}>HospedaPlus</span>
            </h1>
            <p className={styles.subtitle}>
              <Translate id="landing.subtitle">
                Your complete guide to understanding, exploring and using the HospedaPlus data platform.
              </Translate>
            </p>
            <p className={styles.text}>
              <Translate id="landing.text">
                Here you'll find all the information you need about the data sources, architecture, infrastructure and how to work with the platform.
              </Translate>
            </p>
            <Link className={styles.cta} to="/docs/what-is-hospedaplus">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.5 1.6 11.4c-.6.5-.2 1.6.6 1.6H4v8a1.5 1.5 0 0 0 1.5 1.5H10v-6h4v6h4.5A1.5 1.5 0 0 0 20 21v-8h1.8c.8 0 1.2-1.1.6-1.6z" />
              </svg>
              <Translate id="landing.cta">Go to Home</Translate>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <p className={styles.tagline}>
              <span className={styles.spark} aria-hidden="true">
                <svg width="22" height="26" viewBox="0 0 22 26" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 3 12 8M3 13h8M6 23l6-5" />
                </svg>
              </span>
              <span>
                <Translate id="landing.tagline.line1">Better data.</Translate>
                <br />
                <Translate id="landing.tagline.line2">Smarter stays.</Translate>
              </span>
            </p>
          </div>
          <div className={styles.art}>
            <HotelScene />
            <span className={`${styles.float} ${styles.floatChart}`}>
              <ChartBadge />
            </span>
            <span className={`${styles.float} ${styles.floatDb}`}>
              <Icon name="database" size={30} strokeWidth={2} />
            </span>
          </div>
        </section>
        <section className={styles.sections} aria-labelledby="landing-sections">
          <h2 id="landing-sections" className={styles.sectionsTitle}>
            <Translate id="landing.sections.title">Explore the documentation</Translate>
          </h2>
          <div className={styles.grid}>
            {getSections().map((s) => (
              <Link key={s.to} to={s.to} className={styles.card}>
                <span className={styles.cardIcon}>
                  <Icon name={s.icon} size={24} strokeWidth={2.1} />
                </span>
                <span className={styles.cardTitle}>{s.title}</span>
                <span className={styles.cardText}>{s.text}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
