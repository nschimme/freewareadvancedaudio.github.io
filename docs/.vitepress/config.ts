import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Freeware Advanced Audio',
  description: 'Official documentation and interactive online audio converter for FAAC (LGPL v2.1+ AAC Encoder) and FAAD (AAC Decoder). Fast, low-footprint open-source C audio codecs.',
  cleanUrls: true,
  appearance: 'force-dark',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' }],
    ['meta', { name: 'theme-color', content: '#0f172a' }],
    ['meta', { property: 'og:site_name', content: 'Freeware Advanced Audio' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Freeware Advanced Audio',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/docs/faac' },
      { text: 'Interactive Converter', link: '/playground' },
      {
        text: 'Downloads',
        items: [
          { text: 'FAAC Encoder Releases', link: 'https://github.com/FreewareAdvancedAudio/faac/releases' },
          { text: 'FAAD Decoder Releases', link: 'https://github.com/FreewareAdvancedAudio/faad2/releases' }
        ]
      },
      { text: 'Blog', link: '/blog/' }
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Installation Guide', link: '/docs/install' },
          { text: 'FAAC AAC Encoder', link: '/docs/faac' },
          { text: 'FAAD AAC Decoder', link: '/docs/faad' }
        ]
      },
      {
        text: 'CLI Manuals',
        items: [
          { text: 'FAAC CLI Manpage', link: '/docs/faac-cli' },
          { text: 'FAAD CLI Manpage', link: '/docs/faad-cli' }
        ]
      },
      {
        text: 'Benchmarks & Evaluation',
        items: [
          { text: 'Codec Benchmarks', link: '/docs/comparison' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/FreewareAdvancedAudio' }
    ],
    footer: {
      message: 'Freeware Advanced Audio Organization — FAAC (LGPL v2.1+) & FAAD (GPL v2+ / LGPL v2.1+)',
      copyright: 'Copyright © 2026 Freeware Advanced Audio'
    }
  }
})
