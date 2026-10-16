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
  ],
};

export default sidebars;
