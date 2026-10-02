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
      text: "In-Browser Demo"
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

## Interactive In-Browser Audio Converter

Test FAAC encoding and FAAD2 decoding live inside your web browser without installing any software or uploading files to a server:

<WasmConverter />

</div>
