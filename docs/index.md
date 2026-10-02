---
layout: home

hero:
  name: "Freeware Advanced Audio"
  text: "Open-Source AAC Codecs"
  tagline: "High-performance, ISO-free C audio codecs for embedded and cross-platform applications."
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
    details: "Low-overhead C implementation delivering up to 500x+ realtime throughput headroom for minimal battery consumption and CPU usage."
  - icon: "<i class=\"fa-solid fa-microchip\"></i>"
    title: "Small"
    details: "Compact binary footprint (<75 KB) enabling seamless deployment into resource-constrained embedded systems and IoT microcontrollers."
  - icon: "<i class=\"fa-solid fa-sliders\"></i>"
    title: "Quality"
    details: "High MOS quality ratings across AAC-LC and HE-AAC profiles without compromising encoding speed or binary size."
  - icon: "<i class=\"fa-solid fa-code\"></i>"
    title: "Modern"
    details: "Clean, ISO-free C11/C99 architecture under LGPL v2.1+ licensing for straightforward integration into modern software applications."
---

<div class="home-technical-wrapper">

## Where FAAC & FAAD Shine

FAAC and FAAD excel in specialized environments where low memory overhead, ultra-fast throughput, and clean open-source licensing are essential:

### <i class="fa-solid fa-microchip"></i> Embedded Firmware & IoT Microcontrollers
- **[Thingino Linux Firmware](https://thingino.com/)**: Uses FAAC for real-time, low-CPU AAC audio stream encoding on IP cameras and resource-constrained SoC hardware.

### <i class="fa-solid fa-layer-group"></i> Multimedia Frameworks & Modular Plugins
- **[GStreamer](https://gstreamer.freedesktop.org/)**: Official `gst-plugins-bad` elements (`faac` and `faad`) provide low-latency AAC encoding/decoding in custom streaming pipelines.
- **[VLC Media Player](https://www.videolan.org/vlc/)**: Integrates FAAD decoder modules for lightweight, cross-platform AAC stream playback.

### <i class="fa-solid fa-compact-disc"></i> Cross-Platform Audio Processing & Ripping
- **[fre:ac Converter](https://www.freac.org/)**: Popular open-source audio converter and CD ripper directly bundling FAAC and FAAD binaries for batch M4A conversion.
- **[Audiobook Boss](https://github.com/Allmight97/audiobook-boss)**: Uses FAAC for M4A audio packaging and high-speed chapter encoding.

---

## Quick Q&A

### How do I install FAAC or FAAD?
Pre-compiled packages for macOS (Homebrew), Linux (`apt`, `dnf`, `pacman`), and source archives are detailed in our complete [Installation Guide](/docs/install).

### What are the open-source licenses and patent status?
FAAC is licensed under **LGPL v2.1+** (written in cleanroom C11/C99 free of ISO reference code) and FAAD2 under **GPL v2+** (with FAAD3 under LGPL v2.1+). Core patents for AAC-LC and HE-AAC v1 have expired worldwide, while HE-AAC v2 (Parametric Stereo) patents are scheduled to expire in **2029**.

### Where can I find complete developer documentation?
Explore the [Installation Guide](/docs/install), [FAAC Encoder Guide](/docs/faac), [FAAD Decoder Guide](/docs/faad), and [Codec Benchmarks](/docs/comparison) for CLI syntax, C API integration examples, and objective quality evaluations.

</div>
