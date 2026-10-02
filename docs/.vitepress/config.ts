import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Freeware Advanced Audio',
  description: 'Official website for FAAC (LGPL v2.1+ AAC Encoder) and FAAD2 (GPL v2+ AAC Decoder). High-performance, open-source audio compression software.',
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
      { text: 'Interactive Converter', link: '/playground' },
      { text: 'FAAC Encoder Guide', link: '/docs/faac' },
      { text: 'FAAD2 Decoder Guide', link: '/docs/faad2' },
      { text: 'Benchmarks', link: '/docs/comparison' },
      {
        text: 'Downloads',
        items: [
          { text: 'FAAC Encoder Releases', link: 'https://github.com/FreewareAdvancedAudio/faac/releases' },
          { text: 'FAAD2 Decoder Releases', link: 'https://github.com/FreewareAdvancedAudio/faad2/releases' }
        ]
      },
      { text: 'FAQ', link: '/docs/faq' },
      { text: 'Blog', link: '/blog/' }
    ],
    sidebar: [
      {
        text: 'Documentation Guides',
        items: [
          { text: 'FAAC AAC Encoder Guide', link: '/docs/faac' },
          { text: 'FAAD2 AAC Decoder Guide', link: '/docs/faad2' },
          { text: 'Codec Comparison & Benchmarks', link: '/docs/comparison' },
          { text: 'Frequently Asked Questions (FAQ)', link: '/docs/faq' }
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
