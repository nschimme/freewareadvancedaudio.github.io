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

## Ecosystem Users & Integrations

FAAC and FAAD2 are integrated into major open-source media frameworks, audio converters, and embedded systems worldwide:

- **[fre:ac](https://www.freac.org/)**: Popular cross-platform audio converter and CD ripper directly bundling FAAC and FAAD2 binaries.
- **[Thingino](https://thingino.com/)**: Embedded Linux IP camera firmware utilizing FAAC for real-time, low-overhead AAC stream encoding.
- **[Audiobook Boss](https://github.com/Allmight97/audiobook-boss)**: Open-source audiobook processing suite integrating FAAC for M4A encoding and packaging.
- **[GStreamer](https://gstreamer.freedesktop.org/)**: Official GStreamer plugins (`gst-plugins-bad`) providing `faac` and `faad` elements for multimedia pipelines.
- **[VLC Media Player](https://www.videolan.org/vlc/)**: Includes FAAD2 decoder support in its modular codec plugin architecture.

---

## Quick Q&A

### How do I install FAAC or FAAD2?
- **macOS (Homebrew)**: `brew install faac` and `brew install faad2`
- **Linux (Debian/Ubuntu)**: `sudo apt install faac faad`
- **Source Archives**: Published directly on [FAAC Releases](https://github.com/FreewareAdvancedAudio/faac/releases) and [FAAD2 Releases](https://github.com/FreewareAdvancedAudio/faad2/releases).

### What are the open-source licenses and patent status?
FAAC is licensed under **LGPL v2.1+** (written in cleanroom C11/C99 free of ISO reference code) and FAAD2 under **GPL v2+** (with FAAD3 under LGPL v2.1+). Core patents for AAC-LC and HE-AAC v1 have expired worldwide.

### Where can I find complete developer documentation?
Explore the [FAAC Encoder Guide](/docs/faac), [FAAD2 Decoder Guide](/docs/faad2), and [Codec Benchmarks](/docs/comparison) for CLI syntax, C API integration examples, and objective quality evaluations.

</div>
