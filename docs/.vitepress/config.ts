import { defineConfig } from 'vitepress'

const base = `/${(process.env.SITE_BASE_PATH || '/').replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/')
const origin = process.env.SITE_ORIGIN || 'https://freewareadvancedaudio.github.io'

export default defineConfig({
  base,
  title: 'Freeware Advanced Audio',
  description: 'Official documentation and interactive online audio converter for FAAC and FAAD, LGPL-licensed AAC encoder and decoder libraries in C.',
  cleanUrls: true,
  vite: {
    server: {
      watch: {
        usePolling: process.env.VITEPRESS_POLLING === '1',
        interval: 500
      }
    }
  },
  markdown: {
    config(md) {
      // Add decoration at render time so anchors and outline labels stay plain text.
      const renderHeading = md.renderer.rules.heading_open
      md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
        const children = tokens[idx + 1]?.children || []
        const title = children
          .filter(token => ['text', 'code_inline', 'emoji'].includes(token.type) && !token.meta?.isPermalinkSymbol)
          .map(token => token.content).join('').trim()
        const anchor = children.find(token => token.type === 'link_open' && token.attrGet('class') === 'header-anchor')
        anchor?.attrSet('aria-label', `Permalink to "${title}"`)
        const opening = renderHeading
          ? renderHeading(tokens, idx, options, env, self)
          : self.renderToken(tokens, idx, options)
        const icon = tokens[idx].attrGet('data-icon')
        const iconStyle = ['apple', 'linux', 'windows'].includes(icon) ? 'fa-brands' : 'fa-solid'
        return opening + (icon && /^[a-z-]+$/.test(icon)
          ? `<i class="${iconStyle} fa-${icon} section-icon" aria-hidden="true"></i> `
          : '')
      }
    }
  },
  appearance: 'force-dark',
  sitemap: {
    hostname: `${origin.replace(/\/$/, '')}${base}`
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
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
      { text: 'Try FAAC', link: '/playground' },
      { text: 'Download', link: '/docs/install' },
      { text: 'Documentation', link: '/docs/faac' },
      { text: 'Choose an Implementation', link: '/docs/comparison' },
      { text: 'Blog', link: '/blog/' }
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Installation Guide', link: '/docs/install' },
          { text: 'FAAC AAC Encoder', link: '/docs/faac' },
          { text: 'FAAD AAC Decoder', link: '/docs/faad' },
          { text: 'FAAM MP4 Muxer/Demuxer', link: '/docs/faam' },
          { text: 'FAAR Sample Rate Converter', link: '/docs/faar' }
        ]
      },
      {
        text: 'CLI Manuals',
        items: [
          { text: 'FAAC CLI Manpage', link: '/docs/faac-cli' },
          { text: 'FAAD CLI Manpage', link: '/docs/faad-cli' },
          { text: 'FAAM CLI Manpage', link: '/docs/faam-cli' },
          { text: 'FAAR CLI Manpage', link: '/docs/faar-cli' }
        ]
      },
      {
        text: 'C Library APIs',
        items: [
          { text: 'libfaac C API', link: '/docs/libfaac' },
          { text: 'libfaad C API', link: '/docs/libfaad' },
          { text: 'libfaam C API', link: '/docs/libfaam' },
          { text: 'libfaar C API', link: '/docs/libfaar' }
        ]
      },
      {
        text: 'Compare & Evaluate',
        items: [
          { text: 'Choose an Encoder or Decoder', link: '/docs/comparison' },
          { text: 'AAC Benchmark Results', link: '/docs/optimization' },
          { text: 'AAC on ESP32', link: '/docs/esp32-aac' },
          { text: 'Listening-Test Guide', link: '/docs/listening' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/FreewareAdvancedAudio' }
    ],
    footer: {
      message: 'Documentation & website content licensed under CC-BY-SA 4.0. WebAssembly component code licensed under AGPL-3.0.',
      copyright: 'Copyright © 2026 Freeware Advanced Audio Organization'
    }
  }
})
