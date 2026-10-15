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
    'data-access',
    'architecture-infrastructure',
  ],
};

export default sidebars;
