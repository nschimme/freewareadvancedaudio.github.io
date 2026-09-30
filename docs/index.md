---
layout: home

hero:
  name: Freeware Advanced Audio
  text: Open-Source AAC Codecs
  tagline: ISO-Free LGPL v2.1+ AAC Encoder (FAAC) & GPL v2+ Decoder (FAAD2)
  actions:
    - theme: brand
      text: WebAssembly Demo
      link: /playground
    - theme: alt
      text: C API & Docs
      link: /docs/faac
    - theme: alt
      text: GitHub Org
      link: https://github.com/FreewareAdvancedAudio

features:
  - icon: 🛠️
    title: FAAC 2.0+ Architecture
    details: Written in C11/C99. Free of legacy ISO reference code. LGPL v2.1+ licensed.
  - icon: 📊
    title: Profiles & Rate Control
    details: AAC-LC and HE-AAC v1 (SBR). Supports VBR (-q), ABR (-b), and CBR (--cbr) with bit reservoir modeling.
  - icon: ⚡
    title: Encoding Speed
    details: Lightweight, low-overhead C implementation with 3–5x throughput headroom over standard encoders.
  - icon: 🔊
    title: FAAD2 Decoder
    details: Standalone GPL v2+ decoder for MPEG-2/4 AAC, HE-AAC v1/v2 (SBR+PS), and multi-channel streams up to 7.1.
---

<div class="home-technical-wrapper">

## Ecosystem Adoption

FAAC (`libfaac`) and FAAD2 (`libfaad2`) in production:

<div class="users-grid">
  <a href="https://www.freac.org/" target="_blank" rel="noopener" class="user-card">
    <span class="user-title">fre:ac</span>
    <span class="user-desc">Audio converter and CD ripper.</span>
  </a>
  <a href="https://thingino.com/" target="_blank" rel="noopener" class="user-card">
    <span class="user-title">Thingino</span>
    <span class="user-desc">Embedded Linux firmware for IP camera audio streaming.</span>
  </a>
  <a href="https://github.com/Allmight97/audiobook-boss" target="_blank" rel="noopener" class="user-card">
    <span class="user-title">Audiobook Boss</span>
    <span class="user-desc">Automated audiobook processor and M4B manager.</span>
  </a>
  <a href="https://ffmpeg.org/" target="_blank" rel="noopener" class="user-card">
    <span class="user-title">FFmpeg</span>
    <span class="user-desc">Supports external libfaac encoding library integration.</span>
  </a>
  <a href="https://www.videolan.org/vlc/" target="_blank" rel="noopener" class="user-card">
    <span class="user-title">VLC</span>
    <span class="user-desc">Media player using libfaad2 for native AAC decoding.</span>
  </a>
  <a href="https://gstreamer.freedesktop.org/" target="_blank" rel="noopener" class="user-card">
    <span class="user-title">GStreamer</span>
    <span class="user-desc">Pipeline framework with FAAC and FAAD plugin modules.</span>
  </a>
</div>

## WebAssembly Converter Demo

Run `libfaac` and `libfaad2` in-browser:

<WasmConverter />

</div>

<style>
.home-technical-wrapper {
  max-width: 960px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.home-technical-wrapper h2 {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 800;
  margin: 2rem 0 1rem 0;
  border: none;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.75rem;
}

.user-card {
  display: block;
  background: var(--vp-c-bg-elv);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 0.85rem 1rem;
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
  font-size: 1rem;
  color: #06b6d4;
  margin-bottom: 0.2rem;
}

.user-desc {
  display: block;
  font-size: 0.825rem;
  color: #94a3b8;
  line-height: 1.35;
}
</style>
