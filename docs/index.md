---
layout: home

hero:
  name: "Freeware Advanced Audio"
  text: "Open-Source AAC Codecs"
  tagline: "ISO-Free LGPL v2.1+ AAC Encoder (FAAC) & GPL v2+ Decoder (FAAD2)"
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
    details: "Low-overhead C implementation delivering 3–5x throughput headroom for lower battery consumption and CPU usage."
  - icon: "<i class=\"fa-solid fa-microchip\"></i>"
    title: "Small"
    details: "Tiny binary footprint (<75 KB) enabling seamless deployment into embedded devices and IoT microcontrollers."
  - icon: "<i class=\"fa-solid fa-sliders\"></i>"
    title: "Quality"
    details: "Pick all three—speed, compact footprint, and pristine audio quality—without having to choose two out of three."
  - icon: "<i class=\"fa-solid fa-code\"></i>"
    title: "Modern"
    details: "Clean, ISO-free C11/C99 architecture under LGPL v2.1+ licensing for modern cross-platform software."
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
