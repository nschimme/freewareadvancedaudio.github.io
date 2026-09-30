---
layout: home

hero:
  name: Freeware Advanced Audio
  text: High-Performance Open-Source AAC Codecs
  tagline: Modern LGPL v2.1+ AAC Encoding (FAAC) & GPL v2+ AAC Decoding (FAAD2)
  actions:
    - theme: brand
      text: Try WASM Converter
      link: /playground
    - theme: alt
      text: Documentation
      link: /docs/faac
    - theme: alt
      text: GitHub Organization
      link: https://github.com/FreewareAdvancedAudio

features:
  - icon: ⚡
    title: FAAC 2.0+ Renaissance
    details: Completely rewritten in LGPL v2.1+ free software license. Clean, fast, ISO-free codebase built for modern audio applications.
  - icon: 🔊
    title: FAAD2 AAC Decoder
    details: Robust, battle-tested GPL v2+ decoder supporting MPEG-2 & MPEG-4 AAC, HE-AAC v1/v2, SBR, PS, and multi-channel audio streams.
  - icon: 💻
    title: WebAssembly Powered
    details: Run FAAC and FAAD2 directly in your browser without installing native binaries.
  - icon: 🛠️
    title: Developer & CLI Ready
    details: Simple C APIs (libfaac, libfaad2), CMake/Meson build integration, and standalone CLI binaries.
---

<div class="home-demo-wrapper">

## Interactive Online Audio Converter

Test FAAC encoding and FAAD2 decoding right in your browser below:

<WasmConverter />

</div>

<style>
.home-demo-wrapper {
  max-width: 900px;
  margin: 3rem auto;
  padding: 0 1.5rem;
}
.home-demo-wrapper h2 {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 1rem;
  border: none;
}
</style>
