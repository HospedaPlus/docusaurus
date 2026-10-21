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
  ],
};

export default sidebars;
