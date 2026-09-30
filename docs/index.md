---
layout: home

hero:
  name: Freeware Advanced Audio
  text: Open-Source AAC Encoder (FAAC) & Decoder (FAAD2)
  tagline: ISO-Free LGPL v2.1+ AAC-LC / HE-AAC v1 Encoder & GPL v2+ AAC Decoder
  actions:
    - theme: brand
      text: In-Browser Demo (WASM)
      link: /playground
    - theme: alt
      text: Technical Docs & C API
      link: /docs/faac
    - theme: alt
      text: GitHub Organization
      link: https://github.com/FreewareAdvancedAudio

features:
  - icon: 🛠️
    title: FAAC 2.0+ Architecture
    details: Clean C codebase rewritten from scratch. Completely independent of proprietary ISO reference code. Fully licensed under LGPL v2.1+.
  - icon: 📊
    title: Audio Profiles & Rate Control
    details: Supports AAC-LC and HE-AAC v1 (SBR). Features VBR (-q), ABR (-b average bitrate), and CBR (--cbr) with bit reservoir modeling.
  - icon: ⚡
    title: High Throughput Efficiency
    details: Lightweight, low-overhead C implementation with 3-5x encoding speed headroom over conventional software AAC encoders.
  - icon: 🔊
    title: FAAD2 Decoder
    details: Standalone GPL v2+ decoder supporting MPEG-2 & MPEG-4 AAC, HE-AAC v1/v2 (SBR+PS), LD, ER, and multi-channel streams up to 7.1.
---

<div class="home-technical-wrapper">

## Ecosystem & Software Integration

FAAC (`libfaac`) and FAAD2 (`libfaad2`) are integrated into audio production tools, media players, and embedded platforms:

<div class="users-grid">
  <a href="https://www.freac.org/" target="_blank" rel="noopener" class="user-card">
    <span class="user-title">fre:ac</span>
    <span class="user-desc">Open-source audio converter and CD ripper for Windows, macOS, and Linux.</span>
  </a>
  <a href="https://thingino.com/" target="_blank" rel="noopener" class="user-card">
    <span class="user-title">Thingino</span>
    <span class="user-desc">Open-source firmware for IP cameras and embedded Linux devices using low-overhead FAAC audio stream encoding.</span>
  </a>
  <a href="https://github.com/Allmight97/audiobook-boss" target="_blank" rel="noopener" class="user-card">
    <span class="user-title">Audiobook Boss</span>
    <span class="user-desc">Automated audiobook processing, conversion, and M4B tag management tool.</span>
  </a>
  <a href="https://ffmpeg.org/" target="_blank" rel="noopener" class="user-card">
    <span class="user-title">FFmpeg</span>
    <span class="user-desc">Multimedia framework supporting libfaac external encoding library integration.</span>
  </a>
  <a href="https://www.videolan.org/vlc/" target="_blank" rel="noopener" class="user-card">
    <span class="user-title">VLC Media Player</span>
    <span class="user-desc">Cross-platform media player using libfaad2 for native AAC audio decoding.</span>
  </a>
  <a href="https://gstreamer.freedesktop.org/" target="_blank" rel="noopener" class="user-card">
    <span class="user-title">GStreamer</span>
    <span class="user-desc">Pipeline-based multimedia framework with FAAC and FAAD plugin modules.</span>
  </a>
</div>

## In-Browser WebAssembly Test Harness

Run `libfaac` (WAV to AAC/M4A) and `libfaad2` directly in WebAssembly below:

<WasmConverter />

</div>

<style>
.home-technical-wrapper {
  max-width: 960px;
  margin: 3rem auto;
  padding: 0 1.5rem;
}

.home-technical-wrapper h2 {
  text-align: center;
  font-size: 1.6rem;
  font-weight: 800;
  margin: 2.5rem 0 1.25rem 0;
  border: none;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.user-card {
  display: block;
  background: var(--vp-c-bg-elv);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  text-decoration: none !important;
  transition: border-color 0.2s, transform 0.2s;
}

.user-card:hover {
  border-color: #06b6d4;
  transform: translateY(-2px);
}

.user-title {
  display: block;
  font-weight: 800;
  font-size: 1.05rem;
  color: #06b6d4;
  margin-bottom: 0.3rem;
}

.user-desc {
  display: block;
  font-size: 0.85rem;
  color: #94a3b8;
  line-height: 1.4;
}
</style>
