import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Nautilus Agent',
  tagline: 'AI for Scientists. Built on Hermes Agent.',
  favicon: 'img/favicon.png',

  url: 'https://tj-coding.github.io',
  baseUrl: '/nautilus-agent/',

  organizationName: 'tj-coding',
  projectName: 'nautilus-agent',

  onBrokenLinks: 'warn',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  themes: [
    '@docusaurus/theme-mermaid',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      ({
        hashed: true,
        language: ['en'],
        indexBlog: false,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: false,
      }),
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/tj-coding/nautilus-agent/edit/main/website/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/nautilus-agent-banner.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'Nautilus Agent',
      logo: {
        alt: 'Nautilus Agent',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/skills',
          label: 'Skills',
          position: 'left',
        },
        {
          href: 'https://nousresearch.com',
          label: 'Built on Hermes',
          position: 'left',
        },
        {
          href: 'https://tj-coding.github.io/nautilus-community/',
          label: 'Community',
          position: 'right',
        },
        {
          href: 'https://github.com/tj-coding/nautilus-agent',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://discord.gg/2n3gTN2rn7',
          label: 'Discord',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Getting Started', to: '/getting-started/quickstart' },
            { label: 'User Guide', to: '/user-guide/cli' },
            { label: 'Developer Guide', to: '/developer-guide/architecture' },
            { label: 'Reference', to: '/reference/cli-commands' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'Discord', href: 'https://discord.gg/2n3gTN2rn7' },
            { label: 'GitHub Issues', href: 'https://github.com/tj-coding/nautilus-agent/issues' },
            { label: 'Nautilus Community', href: 'https://tj-coding.github.io/nautilus-community/' },
          ],
        },
        {
          title: 'Upstream',
          items: [
            { label: 'Hermes Agent', href: 'https://hermes-agent.nousresearch.com' },
            { label: 'Nous Research', href: 'https://nousresearch.com' },
            { label: 'Upstream GitHub', href: 'https://github.com/NousResearch/hermes-agent' },
          ],
        },
      ],
      copyright: `Built on <a href="https://github.com/NousResearch/hermes-agent">Hermes Agent</a> by <a href="https://nousresearch.com">Nous Research</a> · Branded for science by the Nautilus community · MIT License · ${new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'yaml', 'json', 'python', 'toml', 'r'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
