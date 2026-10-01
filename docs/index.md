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
  - icon: "🛠️"
    title: "FAAC 2.0+ Architecture"
    details: "Written in C11/C99. Free of legacy ISO reference code. LGPL v2.1+ licensed."
  - icon: "📊"
    title: "Profiles & Rate Control"
    details: "AAC-LC and HE-AAC v1 (SBR). Supports VBR (-q), ABR (-b), and CBR (--cbr) with bit reservoir modeling."
  - icon: "⚡"
    title: "Encoding Speed"
    details: "Lightweight, low-overhead C implementation with 3–5x throughput headroom over standard encoders."
  - icon: "🔊"
    title: "FAAD2 Decoder"
    details: "Standalone GPL v2+ decoder for MPEG-2/4 AAC, HE-AAC v1/v2 (SBR+PS), and multi-channel streams up to 7.1."
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
