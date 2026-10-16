import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

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
      value: 'Project Overview',
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
        'data-access/f1-hotel-booking-demand',
        'data-access/f2-channel-manager-events',
        'data-access/f3-own-booking-engine',
        'data-access/f4-traditional-agency-files',
        'data-access/f5-guest-reviews',
        'data-access/f6-holidays-and-events',
        'data-access/f7-exchange-rates',
      ],
    },
    'architecture-infrastructure',
  ],
};

export default sidebars;
