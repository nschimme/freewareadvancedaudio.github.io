import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Freeware Advanced Audio',
  description: 'Official home of FAAC (LGPL AAC Encoder) and FAAD2 (GPL AAC Decoder)',
  cleanUrls: true,
  appearance: 'force-dark',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#1e1b4b' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Freeware Advanced Audio - FAAC & FAAD2' }],
    ['meta', { property: 'og:description', content: 'Modern, high-performance open-source AAC audio encoding (LGPL) and decoding (GPL) solutions.' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Freeware Advanced Audio',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Playground (WASM)', link: '/playground' },
      { text: 'Documentation', link: '/docs/faac' },
      { text: 'Blog', link: '/blog/' },
      { text: 'GitHub Org', link: 'https://github.com/FreewareAdvancedAudio' }
    ],
    sidebar: {
      '/docs/': [
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
          text: 'Comparison & Benchmarks',
          items: [
            { text: 'FAAC vs FDK-AAC & Others', link: '/docs/comparison' }
          ]
        }
      ],
      '/blog/': [
        {
          text: 'Blog Posts',
          items: [
            { text: 'The New FAAC Era & Website Launch', link: '/blog/website-launch' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/FreewareAdvancedAudio' }
    ],
    footer: {
      message: 'FAAC is licensed under LGPL v2.1+. FAAD2 is licensed under GPL v2+.',
      copyright: 'Copyright © 2026 Freeware Advanced Audio Organization'
    }
  }
})
