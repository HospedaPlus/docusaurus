import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'HospedaPlus',
  tagline: 'More data. Better stays.',
  favicon: 'img/logo.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Each locale is built with its own baseUrl, so the automatic storage
  // namespace would differ per language and the chosen light/dark mode would
  // reset when switching languages. A fixed namespace keeps one choice for the
  // whole site while staying separate from other sites on the same domain.
  storage: {
    namespace: 'hospedaplus-docs',
  },

  url: 'https://hospedaplus.github.io',
  baseUrl: '/docusaurus/',

  // GitHub pages deployment config.
  organizationName: 'HospedaPlus',
  projectName: 'docusaurus',

  onBrokenLinks: 'throw',

  // English is the main language: it is always the one served at the root URL.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'pt', 'fr', 'de'],
    localeConfigs: {
      en: {label: 'English'},
      es: {label: 'Español'},
      pt: {label: 'Português'},
      fr: {label: 'Français'},
      de: {label: 'Deutsch'},
    },
  },

  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Caveat:wght@600&display=swap',
      type: 'text/css',
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: 'docs',
        language: ['en', 'es', 'pt', 'fr', 'de'],
        searchBarShortcutHint: true,
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    docs: {
      sidebar: {
        hideable: false,
      },
    },
    navbar: {
      title: 'HospedaPlus',
      logo: {
        alt: 'HospedaPlus',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'search',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/HospedaPlus/docusaurus',
          label: 'GitHub',
          position: 'right',
          className: 'navbar-github-link',
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
