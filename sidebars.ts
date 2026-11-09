import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// HTML sidebar items are not part of the translation files, so the section
// title is picked here from the locale being built.
const sectionTitles: Record<string, string> = {
  en: 'Project Overview',
  es: 'Visión general del proyecto',
  pt: 'Visão geral do projeto',
  fr: "Vue d'ensemble du projet",
  de: 'Projektübersicht',
};
const engineeringTitles: Record<string, string> = {
  en: 'Data Engineering',
  es: 'Ingeniería de datos',
  pt: 'Engenharia de dados',
  fr: 'Ingénierie des données',
  de: 'Data Engineering',
};
const locale = process.env.DOCUSAURUS_CURRENT_LOCALE ?? 'en';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'link',
      label: 'Home',
      href: '/',
      className: 'sidebar-home',
    },
    {
      type: 'html',
      value: sectionTitles[locale] ?? sectionTitles.en,
      className: 'sidebar-section-title',
      defaultStyle: true,
    },
    'what-is-hospedaplus',
    'the-pains',
    'data-sources',
    {
      type: 'category',
      label: 'Data Access',
      link: {type: 'doc', id: 'data-access/index'},
      collapsed: true,
      items: [
        {type: 'doc', id: 'data-access/f1-hotel-booking-demand', className: 'source-icon source-icon-file source-tone-purple'},
        {type: 'doc', id: 'data-access/f2-channel-manager-events', className: 'source-icon source-icon-stream source-tone-blue'},
        {type: 'doc', id: 'data-access/f3-own-booking-engine', className: 'source-icon source-icon-database source-tone-teal'},
        {type: 'doc', id: 'data-access/f4-traditional-agency-files', className: 'source-icon source-icon-file source-tone-sky'},
        {type: 'doc', id: 'data-access/f5-guest-reviews', className: 'source-icon source-icon-message source-tone-purple'},
        {type: 'doc', id: 'data-access/f6-holidays-and-events', className: 'source-icon source-icon-calendar source-tone-blue'},
        {type: 'doc', id: 'data-access/f7-exchange-rates', className: 'source-icon source-icon-currency source-tone-teal'},
      ],
    },
    'architecture-infrastructure',
    'architecture-v2',
    {
      type: 'html',
      value: engineeringTitles[locale] ?? engineeringTitles.en,
      className: 'sidebar-section-title',
      defaultStyle: true,
    },
    {
      type: 'category',
      label: 'Data Engineering Pipeline',
      link: {type: 'doc', id: 'data-engineering-pipeline/index'},
      collapsed: false,
      items: [
        'data-engineering-pipeline/technical-decisions',
        'data-engineering-pipeline/neon-connection',
        {
          type: 'category',
          label: 'Medallion architecture',
          link: {type: 'doc', id: 'data-engineering-pipeline/medallion/index'},
          collapsed: false,
          items: [
            'data-engineering-pipeline/medallion/bronze',
            'data-engineering-pipeline/medallion/silver',
            'data-engineering-pipeline/medallion/gold',
          ],
        },
        'data-engineering-pipeline/athena',
        'data-engineering-pipeline/dags',
        'data-engineering-pipeline/running-dags',
      ],
    },
  ],
};

export default sidebars;
