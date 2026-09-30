import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Freeware Advanced Audio',
  description: 'Official website and documentation for FAAC (LGPL AAC Encoder) and FAAD2 (GPL AAC Decoder).',
  cleanUrls: true,
  appearance: 'force-dark',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#0f172a' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Freeware Advanced Audio',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Playground', link: '/playground' },
      { text: 'Documentation', link: '/docs/faac' },
      { text: 'Blog', link: '/blog/website-launch' },
      { text: 'GitHub Org ↗', link: 'https://github.com/FreewareAdvancedAudio' }
    ],
    sidebar: [
      {
        text: 'FAAC Encoder',
        items: [
          { text: 'Overview & Licensing', link: '/docs/faac' },
          { text: 'CLI Usage Guide', link: '/docs/faac-cli' },
          { text: 'C API Reference', link: '/docs/faac-api' }
        ]
      },
      {
        text: 'FAAD2 Decoder',
        items: [
          { text: 'Overview & Licensing', link: '/docs/faad2' },
          { text: 'CLI Usage Guide', link: '/docs/faad2-cli' },
          { text: 'C API Reference', link: '/docs/faad2-api' }
        ]
      },
      {
        text: 'Codec Comparisons',
        items: [
          { text: 'Comparison & Benchmarks', link: '/docs/comparison' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/FreewareAdvancedAudio' }
    ],
    footer: {
      message: 'Freeware Advanced Audio Organization — FAAC (LGPL v2.1+) & FAAD2 (GPL v2+)',
      copyright: 'Copyright © 2026 Freeware Advanced Audio'
    }
  }
})
