---
layout: home

hero:
  name: "Freeware Advanced Audio"
  text: "High-Throughput Open-Source AAC"
  tagline: "Ultra-fast, low-footprint C audio codecs built for embedded hardware, cloud transcoding, and cross-platform applications."
  image:
    alt: "FAAC Visualizer"
  actions:
    - theme: brand
      text: "Interactive Playground"
      link: "/playground"
    - theme: alt
      text: "C API & Docs"
      link: "/docs/faac"

features:
  - icon: "<i class=\"fa-solid fa-bolt\"></i>"
    title: "Fast"
    details: "Delivers up to 500x+ realtime encoding and 490x+ realtime decoding throughput via SIMD vectorization, slashing compute overhead and power drain."
  - icon: "<i class=\"fa-solid fa-microchip\"></i>"
    title: "Small"
    details: "Ultra-compact compiled footprint (<85 KB ROM, <2.8 MB peak RAM), offering drop-in C codec engines for IoT firmware, SoCs, and edge devices."
  - icon: "<i class=\"fa-solid fa-sliders\"></i>"
    title: "Quality"
    details: "Top-tier MOS ratings and transient precision (0.9494) for encoding, alongside full HE-AAC v1/v2 and 7.1 surround sound decoding."
  - icon: "<i class=\"fa-solid fa-code\"></i>"
    title: "Modern"
    details: "Clean, ISO-free C11/C99 architecture under open-source LGPL v2.1+ and GPL v2+ licensing, ensuring vendor independence and simple C API integration."
---

<div class="home-technical-wrapper">

## Where FAAC & FAAD Excel

FAAC and FAAD excel in specialized environments where execution speed, memory constraints, and royalty-free licensing are paramount:

### <i class="fa-solid fa-microchip"></i> Embedded Firmware & Edge Hardware
- **[Thingino Linux Firmware](https://thingino.com/)**: Deploys FAAC for low-overhead, real-time AAC audio stream encoding on IP cameras and embedded Linux SoCs.

### <i class="fa-solid fa-layer-group"></i> Media Frameworks & Streaming Pipelines
- **[GStreamer](https://gstreamer.freedesktop.org/)**: Official `gst-plugins-bad` elements (`faac` and `faad`) provide low-latency AAC encoding and decoding in enterprise multimedia pipelines.
- **[VLC Media Player](https://www.videolan.org/vlc/)**: Integrates FAAD decoder modules for lightweight, cross-platform AAC audio stream playback.

### <i class="fa-solid fa-compact-disc"></i> Cross-Platform Tools & Codec Packs
- **[X Codec Pack](https://xcodecpack.com/aac-encoder/)**: Integrates FAAC for DirectShow AAC audio encoding and system-wide M4A audio conversion on Windows.
- **[fre:ac Converter](https://www.freac.org/)**: Popular cross-platform audio converter and CD ripper directly bundling FAAC and FAAD for high-speed M4A batch processing.
- **[Audiobook Boss](https://github.com/Allmight97/audiobook-boss)**: Integrates FAAC for rapid chapter encoding and M4A audiobook packaging.

---

## Quick Developer Q&A

### How do I install FAAC or FAAD?
Pre-compiled packages for macOS (`brew install faac`), Linux (`apt`, `dnf`, `pacman`), and source archives are detailed in our complete [Installation Guide](/docs/install).

### What are the open-source licenses and patent status?
FAAC is licensed under **LGPL v2.1+** (written in cleanroom C11/C99 free of ISO reference code) and FAAD2 under **GPL v2+** (with FAAD3 under LGPL v2.1+). Core patents for AAC-LC and HE-AAC v1 have expired worldwide, while HE-AAC v2 (Parametric Stereo) patents are scheduled to expire in **2029**.

### Where can I find developer documentation and C API references?
Explore the [Installation Guide](/docs/install), [FAAC Encoder Guide](/docs/faac), [FAAD Decoder Guide](/docs/faad), and [Codec Benchmarks](/docs/comparison) for CLI syntax, C API integration examples, and objective quality evaluations.

</div>
